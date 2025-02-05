const LOG = cds.log('KupitO2PSrv'); 
const _ = require('underscore');
const consts = require("./Constants");
const { getEnvParam, getTextBundle } = require('./Utils');
const SequenceHelper = require("./SequenceHelper");
const { WorkflowInstancesApi, UserTaskInstancesApi } = require(consts.PATH_API_WF); 
const { retrieveJwt } = require('@sap-cloud-sdk/connectivity');
const SapCfAxios = require('sap-cf-axios').default;
const axiosMyInboxService = SapCfAxios("sap_inbox_task_api", { logger: console }); 


async function getRequestData(iRequestId, iRequest) {

    let request;

    try {
        request = await SELECT.one.from(Request).
            where({
                REQUEST_ID: iRequestId
            });
        if (request === null) {
            let errMEssage = "ERROR getRequestData " + iRequestId + ". Request not found";
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }
        return request;
    } catch (error) {
        let errMEssage = "ERROR getRequestData " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
}


async function createProcess(iRequest) {



    const oBundle = getTextBundle(iRequest);

    let message = new Object()
    let returnGetMoaApprovers = []
    let returnSaveMoaApprovers = [];

    message.MTYPE = consts.SUCCESS;

    try {

        const cdsTx = cds.tx(); //-> creo la transaction

        //Get next sequence Request ID
        let returnRequestId = await getNextRequestId(iRequest, cdsTx);
        if (returnRequestId.errors) {
            return returnRequestId;
        }

        //Get MOA Approvers

        let userCompiler = iRequest.user.id;
        returnGetMoaApprovers = await getMoaApprovers(iRequest, returnRequestId, userCompiler);
        if (returnGetMoaApprovers.errors) {
            return returnGetMoaApprovers;
        }



        //Save request    
        let returnCreateRequest = await createRequest(iRequest, returnRequestId, cdsTx);
        if (returnCreateRequest.errors) {
            return returnCreateRequest;
        }



        //Save MOA Approvers
        returnSaveMoaApprovers = await saveMoaApprovers(iRequest, returnRequestId, returnGetMoaApprovers, cdsTx);
        if (returnSaveMoaApprovers.errors) {
            return returnSaveMoaApprovers;
        }




        //Commit before start Process BPA
        await cdsTx.commit();

        //Create Approvers history

        let firstVersion = 1;

        let returnApprovalHistory = await insertApprovalHistory(iRequest, returnRequestId, returnSaveMoaApprovers, firstVersion);
        if (returnApprovalHistory.errors) {
            return returnApprovalHistory;
        }



        //Start BPA Process
        let returnStartProcess = await startBPAProcess(iRequest, returnRequestId, returnSaveMoaApprovers);
        if (returnStartProcess.errors) {
            return returnStartProcess;
        }

        //Aggiornamento Url nella Request
        let returnUpdateWfInstanceId = await updateWfInstanceId(iRequest, returnRequestId, returnStartProcess);
        if (returnUpdateWfInstanceId.errors) {
            return returnUpdateWfInstanceId;
        }


      //  let o2pDocument = await generateO2PDocument(iRequest, true)



        message.MTYPE = consts.SUCCESS;
        message.REQUESTID = returnRequestId;
        message.WF_INSTACE_ID = returnStartProcess;
        message.TEXT = oBundle.getText("PROCESS_STARTED", [returnRequestId]);
        return message;

    } catch (error) {
        throw { code: 499, message: error.message ? error.message : "Errore generazione richiesta" };
    }

    return message;
}

async function updateWfInstanceId(iRequest, iRequestId, iWfInstanceId) {
    let resUpdate;
    try {
        resUpdate = await UPDATE(Request).set({ BPA_PROCESS_ID: iWfInstanceId }).where({
            REQUEST_ID: iRequestId
        });


    } catch (error) {
        let errMEssage = "updateWfInstanceId:" + error.message + " REQUESTID: " + iRequestId;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}



async function checkTaskCreated(iRequest) {


    const oBundle = getTextBundle(iRequest);

    let requestId = iRequest.data.REQUEST_ID;
    let wfInstanceID = iRequest.data.WF_INSTACE_ID;

    let message = new Object()
    message.MTYPE = consts.SUCCESS;


    //Get ID Task instance and Task end point.
    let returnGetTaskInstanceUrl = await getTaskInstanceUrl(iRequest, requestId, wfInstanceID);
    if (returnGetTaskInstanceUrl.errors) {
        return returnGetTaskInstanceUrl;
    }

    if (returnGetTaskInstanceUrl.MTYPE === consts.WARNING) {
        returnGetTaskInstanceUrl.REQUESTID = requestId;
        return returnGetTaskInstanceUrl;
    }


    //const cdsTx = cds.tx(); //-> creo la transaction


    let request = await SELECT.one.from(Request).
        where({
            REQUEST_ID: requestId
        });

    message.MTYPE = consts.SUCCESS;
    message.TASKID = returnGetTaskInstanceUrl.TASKID;
    message.TASKURL = returnGetTaskInstanceUrl.TASKURL;
    message.TEXT = oBundle.getText("PROCESS_STARTED", requestId);
    message.REQUESTID = requestId;

    return message;

}


async function insertApprovalHistory(iRequest, iRequestId, iMoaApprovers, iVersion) {


    let aApprovalHistory = new Array();
    let aApprovalHistoryDb = new Array();
    let insertRequest;
    let insertRequestResponse;
    let stepCheck = ""
    let oApproval

    let oldVersion = iVersion - 1

    try {

        let approvalHistory = {};

        let reqData = await getRequestData(iRequestId, iRequest)
        if (reqData.errors) {
            return reqData;
        }



        if (iRequest.path === 'O2PBpaService.UpdateRequestVersion') {

            oApproval = await SELECT.one.from(ApprovalHistory).
                where({
                    REQUEST_ID: iRequestId,
                    VERSION: oldVersion,
                    To_Action_ACTION: 'REJECTED'
                });

            /*       
               if (oApproval && oApproval.STEP > 40 &&
                   reqData.PROCESSTYPE_code === consts.processType.Annuale) {
                   stepCheck = 40
               }

               if (oApproval && oApproval.STEP > 50 &&
                   reqData.PROCESSTYPE_code === consts.processType.Cessazione
               ) {
                   stepCheck = 50
               } else {

                   if (oApproval && oApproval.STEP > 20 &&
                       reqData.PROCESSTYPE_code === consts.processType.Cessazione
                   ) {

                       stepCheck = 20

                    }

               }
*/

            stepCheck = 10

        }



        if (stepCheck !== "") {

            let aApproval = await SELECT.from(ApprovalHistory).
                where({
                    REQUEST_ID: iRequestId,
                    VERSION: oldVersion
                }).orderBy('STEP asc');


            for (let a = 0; a < iMoaApprovers.length; a++) {
                if (iMoaApprovers[a].STEP < stepCheck) {

                    oApproval = aApproval[a]
                    oApproval.VERSION = iVersion
                    // oApproval.To_StepStatus_STEP_STATUS = consts.stepStatus.NOTASSIGNED

                    aApprovalHistory.push(oApproval)

                } else {

                    aApprovalHistory.push({
                        to_Request_REQUEST_ID: iRequestId,
                        STEP: iMoaApprovers[a].STEP,
                        VERSION: iVersion,
                        To_StepStatus_STEP_STATUS: consts.stepStatus.NOTASSIGNED
                    })

                }
            }


        } else { //

            let aApprovalDb = await SELECT.from(ApprovalHistory).
                where({
                    REQUEST_ID: iRequestId,
                    VERSION: iVersion
                }).orderBy('STEP asc');



            for (let a = 0; a < iMoaApprovers.length; a++) {

                let oApprovalDb = aApprovalDb.find(oApprovalDb => oApprovalDb.STEP === Number(iMoaApprovers[a].STEP))

                if (oApprovalDb && Boolean(oApprovalDb.BPA_TASKID_ID)) {
                    aApprovalHistoryDb.push(oApprovalDb)
                } else {

                    aApprovalHistory.push({
                        to_Request_REQUEST_ID: iRequestId,
                        STEP: iMoaApprovers[a].STEP,
                        VERSION: iVersion,
                        To_StepStatus_STEP_STATUS: consts.stepStatus.NOTASSIGNED
                    })
                }
            }

        }

        if (aApprovalHistoryDb.length > 0) {
            insertRequestResponse = await UPSERT.into(ApprovalHistory).entries(aApprovalHistoryDb);
        }

        if (aApprovalHistory.length > 0) {
            insertRequestResponse = await UPSERT.into(ApprovalHistory).entries(aApprovalHistory);
        }







    } catch (error) {
        iRequest.error(450, error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }

    return iRequest;
}

async function getMoaApprovers(iRequest, iRequestID, iUserCompiler) {

    let aResult = []

    let oMOAParam = await getMOAParams(iRequestID)

    try {


        let sendFakeMail = getEnvParam("FAKE_APPROVERS", false);
        if (sendFakeMail === "false") {


            let oInput = {
                input: [
                    { attribute: "COMPANYNAMEAT", value: "KUPIT" },
                    { attribute: "BPROCESSNAMEAT", value: "O2PPROCESS" },
                    { attribute: "DEFAULTLVLAT", value: "TRUE" },
                    { attribute: "MAILCOMPILER", value: iUserCompiler },

                    { attribute: "DEPRE_ACCOUNT", value: oMOAParam.depreAccount },
                    { attribute: "ADD_STEP_30_COORD", value: oMOAParam.addStep30Coord },
                    { attribute: "ADD_STEP_30_COORD_LINEA", value: oMOAParam.addStep30CoordLinea },

                    { attribute: "ADD_STEP_40", value: oMOAParam.addStep40 },
                    { attribute: "WDIDMANAGER", value: oMOAParam.managerExceptStep40WDID },
                    { attribute: "ADDED_FROM_EXCEPTION", value: oMOAParam.addedFromException },

                    { attribute: "ADD_STEP_45", value: oMOAParam.addStep45 },
                    { attribute: "ADD_STEP_60_CONTROLLER", value: oMOAParam.addStep60Controller },
                    { attribute: "ADD_STEP_60_CASSA", value: oMOAParam.addStep60Cassa },
                    { attribute: "ADD_STEP_60_FINANZA", value: oMOAParam.addStep60Finanza },
                    { attribute: "ADD_STEP_70", value: oMOAParam.addStep70 },

                    { attribute: "IDAREA", value: oMOAParam.idArea }
                    
                ]
            }


            let moaResponse = await MoaExtraction.send('POST', '/NewMoaExtraction', oInput);

            aResult = moaResponse.d.results;



        } else {

            let wdId = ''
            let sapUser = ''
            let mail = ''
            let fname = ''
            let lname = ''

            let fakeApproversUser = getEnvParam("FAKE_APPROVERS_USER", false);

            let approver = ''
            if (Boolean(fakeApproversUser)) {

                approver = fakeApproversUser


            } else {
                approver = iRequest.user.id
            }

            

            let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
                .where({ MailDipendente: approver }));
            if (oInfoWDPosition) {

                wdId = oInfoWDPosition.WorkdayEmployeeID
                sapUser = oInfoWDPosition.UtenteSAP
                mail = oInfoWDPosition.MailDipendente
                fname = oInfoWDPosition.Nome
                lname = oInfoWDPosition.Cognome

            }

            /*
                wdId = '702302'
                sapUser = 'IT_RCAO'
                mail = 'rcao@q8.it'
                fname = 'ROBERTO'
                lname = 'CAO'
                */




            /*
            else {

            if (Boolean(sysLandscape) || sysLandscape === "TEST" ) {

                wdId = '702302'
                sapUser = 'IT_ASACCARD'
                mail = 'asaccard@q8.it'
                fname = 'ALESSANDRA'
                lname = 'SACCARDO'

            }  
            }

            */




            aResult.push({ INDEX: "10", WDID: wdId, SAPUSER: sapUser, MAIL: mail, FNAME: fname, LNAME: lname, IDROLE: "COMPILER", DESCROLE: "Compilatore", ISMANAGER: "false" });
            aResult.push({ INDEX: "20", WDID: wdId, SAPUSER: sapUser, MAIL: mail, FNAME: fname, LNAME: lname, IDROLE: "COORDVEND", DESCROLE: "Controller", ISMANAGER: "false" });  // o Uffcio Attività Fisse

            aResult.push({ INDEX: "30", WDID: wdId, SAPUSER: sapUser, MAIL: mail, FNAME: fname, LNAME: lname, IDROLE: "COORDRETE", DESCROLE: "Coordinatore", ISMANAGER: "false" });

            // if (oMOAParam.addStep40 === 'TRUE') {
            aResult.push({ INDEX: "40", WDID: wdId, SAPUSER: sapUser, MAIL: mail, FNAME: fname, LNAME: lname, IDROLE: "COMPILER", DESCROLE: "Manager", ISMANAGER: "false" });
            // }

            // if (Boolean(oMOAParam.managerStep42)) {
            //       aResult.push({ INDEX: "42", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COMPILER", DESCROLE: "Manager Step30", ISMANAGER: "false" });
            //  }


            if (oMOAParam.addStep45 === 'TRUE') {
                aResult.push({ INDEX: "45", WDID: wdId, SAPUSER: sapUser, MAIL: mail, FNAME: fname, LNAME: lname, IDROLE: "COMPILER", DESCROLE: "Direttore", ISMANAGER: "false" });
            }

            aResult.push({ INDEX: "50", WDID: wdId, SAPUSER: sapUser, MAIL: mail, FNAME: fname, LNAME: lname, IDROLE: "COORDVEND", DESCROLE: "Controller", ISMANAGER: "false" });


            if (oMOAParam.addStep60Controller === 'TRUE' ||
                oMOAParam.addStep60Cassa === 'TRUE' ||
                oMOAParam.addStep60Finanza === 'TRUE'
            ) {
                aResult.push({ INDEX: "60", WDID: wdId, SAPUSER: sapUser, MAIL: mail, FNAME: fname, LNAME: lname, IDROLE: "COORDRETE", DESCROLE: "Addetto Finanza ", ISMANAGER: "false" }); // o Addetto Cassa o Controller
            }

            if (oMOAParam.addStep70 === 'TRUE') {
                aResult.push({ INDEX: "70", WDID: wdId, SAPUSER: sapUser, MAIL: mail, FNAME: fname, LNAME: lname, IDROLE: "COORDRETE", DESCROLE: "Addetto Finanza", ISMANAGER: "false" }); // o Addetto Cassa 
            }

            /*
            if (oMOAParam.addStep80 === 'TRUE') {
                aResult.push({ INDEX: "80", WDID: wdId, SAPUSER: sapUser, MAIL: mail, FNAME: fname, LNAME: lname,  IDROLE: "COORDRETE", DESCROLE: "Compilatore", ISMANAGER: "false" });
            }
                */

            /*
            if (oMOAParam.addStep40 === 'TRUE' && Boolean(oMOAParam.managerExceptStep40)) {

                let oResponse = await MoaExtraction.send("GET", "/PostionsMapping?$filter=LBLPOSITION eq '" +
                    oMOAParam.managerExceptStep40 + "'");
    
                if (oResponse && oResponse.d.results.length > 0) {
    
                    let wd = oResponse.d.results[0].WDPOSITION;
                    let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay).where({ IdPosizione: wd }));
                    if (oInfoWDPosition) {
    
                        let idx = aResult.findIndex((oResult) => oResult.INDEX === "40")
    
                        if (idx >= 0) {
    
                            aResult[idx].WDID = oInfoWDPosition.WorkdayEmployeeID
                            aResult[idx].SAPUSER = oInfoWDPosition.UtenteSAP
                            aResult[idx].MAIL = oInfoWDPosition.MailDipendente
                            aResult[idx].FNAME = oInfoWDPosition.Nome
                            aResult[idx].LNAME = oInfoWDPosition.Cognome
    
                        }
                        else {
    
                            aResult.push({
                                INDEX: "40", WDID: oInfoWDPosition.WorkdayEmployeeID,
                                SAPUSER: oInfoWDPosition.UtenteSAP, MAIL: oInfoWDPosition.MailDipendente,
                                FNAME: oInfoWDPosition.Nome, LNAME: oInfoWDPosition.Cognome,
                                IDROLE: "COMPILER", DESCROLE: "Manager", ISMANAGER: "false"
                            });
                        }
    
                    }
                }
            }

*/


        }

        // sendFakeMail = getEnvParam("FAKE_APPROVERS", false);
        //  if (sendFakeMail === "false") {




        if (Boolean(oMOAParam.managerStep42)) {

            let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
                .where({ MailDipendente: oMOAParam.managerStep42 }));
            if (oInfoWDPosition) {
                aResult.push({
                    INDEX: "42", WDID: oInfoWDPosition.WorkdayEmployeeID,
                    SAPUSER: oInfoWDPosition.UtenteSAP, MAIL: oInfoWDPosition.MailDipendente,
                    FNAME: oInfoWDPosition.Nome, LNAME: oInfoWDPosition.Cognome,
                    IDROLE: "COMPILER", DESCROLE: "Manager Step30", ISMANAGER: "false"
                });
            }
        }

        // }

    } catch (error) {
        iRequest.error(450, error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }


    return aResult;

}

async function getMOAParams(iRequestID) {

    oResult = {
        depreAccount: 'FALSE',
        addStep30Coord: 'FALSE',
        addStep30CoordLinea: 'FALSE',
        managerExceptStep40: "",
        managerExceptStep40WDID: "",
        addStep40: 'FALSE',
        addedFromException: 'FALSE',
        managerStep42: '',
        addStep45: 'FALSE',
        addStep60Controller: 'FALSE',
        addStep60Cassa: 'FALSE',
        addStep60Finanza: 'FALSE',
        addStep70: 'FALSE',
        addStep80: 'FALSE',
        idArea : ''
    }


    var oRequest = await SELECT.one.from(Request).where({ REQUEST_ID: iRequestID });

    if (oRequest) {

        oResult.idArea = oRequest.AREA_CODE

        var oRequester = await SELECT.one.from(Requester).
            where({ CODE: oRequest.REQUESTER_CODE });


        var aDocument = await SELECT.from(Document).
            where({
                to_Request_REQUEST_ID: iRequestID
            }).orderBy('DOC_ID asc', 'ID asc');

    }


    // Step 20

    if (Boolean(oRequester) && oRequester.CONTROLLER_CHECK === true) {

        for (let i = 0; i < aDocument.length; i++) {
            if (aDocument[i].ACCOUNT.substring(0, 1) === '9') {
                oResult.depreAccount = 'TRUE'
            }
        }
    }


    // Step 30

    if (Boolean(oRequest)) {

        if (oRequest.REQUESTER_CODE === 'ONERIPV') {
            oResult.addStep30Coord = 'TRUE'
        } else {

            if (Boolean(oRequester) && oRequester.SKIP_COORD === false) {
                oResult.addStep30CoordLinea = 'TRUE'
            }
        }
    }


    // Step 40
    let coordLimit = false

    if (Boolean(oRequest) && Boolean(oRequester)) {

        for (let i = 0; i < aDocument.length; i++) {

            var oAccountreq = await SELECT.one.from(Accountreq).
                where({
                    REQUESTER_CODE: oRequest.REQUESTER_CODE,
                    ACCOUNT: aDocument[i].ACCOUNT,
                    COORDINATOR_LIMIT: { '<': aDocument[i].AMOUNT },
                });
            if (oAccountreq) {
                coordLimit = true
            }

        }



        if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL ||
            oRequest.REQUESTER_CODE === 'ONERIPV' ||
            coordLimit === true
        ) {

            oResult.addStep40 = 'TRUE'

            var oParam = await SELECT.one.from(Param).
                where({
                    PARAMNAME: 'MANAGER_EXCEPTION',
                    VAL_INPUT: oRequest.REQUESTER_CODE
                });

            if (Boolean(oParam) && Boolean(oParam.VAL_OUTPUT)) {
                oResult.managerExceptStep40 = oParam.VAL_OUTPUT

                oResult.addedFromException = 'TRUE'


                let oResponse = await MoaExtraction.send("GET", "/PostionsMapping?$filter=LBLPOSITION eq '" +
                    oResult.managerExceptStep40 + "'");

                if (oResponse && oResponse.d.results.length > 0) {

                    let wd = oResponse.d.results[0].WDPOSITION;
                    let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay).where({ IdPosizione: wd }));
                    if (oInfoWDPosition) {

                        oResult.managerExceptStep40WDID = oInfoWDPosition.WorkdayEmployeeID

                    }
                }




            }
        }
    }

    // oResult.addStep40 = 'TRUE'
    // oResult.managerExceptStep40 = "HR_POSITION_MANAGER_CONTAB_GEN_AMM_VENDITE"

    //   Step 42


    if (oRequest && Boolean(oRequest.EXTRA_MANAGER_REQUIRED)) {
        oResult.managerStep42 = oRequest.EXTRA_MANAGER_NAME
    }

    //   Step 45

    if (oRequest && oRequester) {

        let key = 'ACCOUNT'

        let aAccountTot = Object.values(aDocument.reduce((acc, curr) => {
            acc[curr[key]] ??= { [key]: curr[key] };
            Object.keys(curr).filter(k => k !== key).forEach(k =>
                acc[curr[key]][k] = (acc[curr[key]][k] || 0) + curr[k]);
            return acc;
        }, {}));


        for (let i = 0; i < aAccountTot.length; i++) {

            var oAccountreq = await SELECT.one.from(Accountreq).
                where({
                    REQUESTER_CODE: oRequest.REQUESTER_CODE,
                    ACCOUNT: aAccountTot[i].ACCOUNT
                });
            if (oAccountreq && oAccountreq.DIRECTOR_TRESHOLD > 0 &&
                oAccountreq.DIRECTOR_TRESHOLD < aAccountTot[i].AMOUNT
            ) {
                oResult.addStep45 = 'TRUE'
            }

        }

    }

    //   Step 50
    //   Step 60

    if (oRequest) {
        if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.PAGOPA ||
            oRequest.PAYMENT_MODE_CODE === consts.Paymode.F24 ||
            oRequest.PAYMENT_MODE_CODE === consts.Paymode.MAE ||
            oRequest.PAYMENT_MODE_CODE === consts.Paymode.FLBONIFIC ||
            oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL ||
            oRequest.PAYMENT_MODE_CODE === consts.Paymode.F23

        ) {

            if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL) {
                oResult.addStep60Controller = 'TRUE'
            }

            if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.F23) {
                oResult.addStep60Cassa = 'TRUE'
            } else {
                oResult.addStep60Finanza = 'TRUE'
            }

        } else {

            if (oRequest.PAYMENT_MODE_CODE !== consts.Paymode.BONIFICO) {
                oResult.addStep60Cassa = 'TRUE'

                if (oRequest.PAYMENT_MODE_CODE !== consts.Paymode.ASSCIRC_NT) {

                    //   Step 70
                    oResult.addStep70 = 'TRUE'

                }
            }
        }
    }



    return oResult

}

async function saveMoaApprovers(iRequest, iRequestId, iMoaApprovers, iCdsTx) {

    let approversEntries = new Array();
    let insertResult;
    let skipStep20 = false;
    let appSequence = [];
    let insertRequest;
    let InsertRequestResponse;

    try {
        for (let a = 0; a < iMoaApprovers.length; a++) {

            let moaApprover = iMoaApprovers[a];

            let approver = new Object();
            approver.to_Request_REQUEST_ID = iRequestId;
            approver.STEP = moaApprover.INDEX;
            approver.SEQUENCE = await getApproverSequence(approver.STEP, appSequence);
            approver.WDID = moaApprover.WDID; //PERNR
            approver.SAPUSER = moaApprover.SAPUSER;
            approver.MAIL = moaApprover.MAIL; //USERID
            approver.FNAME = moaApprover.FNAME;
            approver.LNAME = moaApprover.LNAME;
            approver.FULLNAME = "" + moaApprover.FNAME + " " + moaApprover.LNAME;
            approver.IDROLE = moaApprover.IDROLE;
            approver.DESCROLE = moaApprover.DESCROLE;
            approver.ISMANAGER = moaApprover.ISMANAGER;
            approversEntries.push(approver);

            // skipStep20 = false;
            // if (approver.IDROLE === "COMP" && approver.ISMANAGER === true) {
            //     skipStep20 = true;
            // }
        }

        // insertRequest = INSERT.into(ApprovalFlow).entries(approversEntries);
        insertRequest = await UPSERT.into(ApprovalFlow).entries(approversEntries);
        //InsertRequestResponse = await iCdsTx.run(insertRequest);

        let debug = 0;
        debug++;

    } catch (error) {
        iRequest.error(450, error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }

    return approversEntries;
}


async function getApproverSequence(iStep, iAppSequence) {
    let sequenceValue = 0;
    let sequenceElement = _.findWhere(iAppSequence, { STEP: iStep });

    if (sequenceElement === undefined) {
        iAppSequence.push({ STEP: iStep, value: 10 });
        sequenceValue = 10;
    } else {
        sequenceElement.value = sequenceElement.value + 10;
        sequenceValue = sequenceElement.value;
    }

    return sequenceValue;

}

async function getTaskInstanceUrl(iRequest, iRequestId, iWfInstaceID) {
    LOG.info("Retrive task url" + iRequestId);

    let lReturn = new Object();
    let tryCounter = 0;
    let maxattempts = 0;

    maxattempts = getEnvParam("MAX_ATTEMPTS", false);
    LOG.info("getTaskInstanceUrl: maximum attempts n: " + maxattempts);

    try {
        do {
            await new Promise(resolve => setTimeout(resolve, 1000));

            tryCounter = tryCounter + 1;

            const userJwt = retrieveJwt(iRequest);
            responseTaskInstance = await UserTaskInstancesApi.getV1TaskInstances({
                workflowInstanceId: iWfInstaceID,
                status: "READY",
            }).execute({
                //  destinationName: consts.API_WF_DESTINATION
                destinationName: consts.API_WF_DESTINATION, jwt: userJwt
            });
            LOG.info("getTaskInstanceUrl: Try get task instance n: " + tryCounter);
            if (tryCounter > maxattempts) {
                let errMEssage = "The Task Id of the process could not be determined. Request: " + iRequestId;
                lReturn.MTYPE = consts.WARNING;
                lReturn.TEXT = errMEssage;
                LOG.error(errMEssage);
                return lReturn;
            }

        } while (responseTaskInstance.length == 0);

    } catch (error) {
        let errMEssage = "getTaskInstanceUrl:" + error.message + " REQUESTID: " + iRequestId;
        lReturn
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    let urlTask1 = getEnvParam("URL_TASK_WF1", false);
    let urlTask2 = getEnvParam("URL_TASK_WF2", false);
    let taskUrl = urlTask1 + urlTask2;
    taskUrl = taskUrl.replaceAll("<TASKID>", responseTaskInstance[0].id);

    lReturn.MTYPE = consts.SUCCESS;
    lReturn.TASKURL = taskUrl;
    lReturn.TASKID = responseTaskInstance[0].id;
    return lReturn;
}

async function getNextRequestId(iRequest) {
    let lRequestID = 0;
    try {
        LOG.info("Get next RequestID");

        const db = await cds.connect.to("db");
        const sequence = new SequenceHelper({
            db: db,
            sequence: consts.SEQUENCE,
        });

        lRequestID = await sequence.getNextNumber();
    } catch (error) {
        let errMEssage = "Get New RequestId " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return lRequestID;
}



async function reqWithZeroes(iNumber, iLength) {

    let string = '' + iNumber;
    while (string.length < iLength) {
        string = '0' + string;
    }

    return string;

}

async function createRequest(iRequest, iRequestId, iCdsTx) {

    let actualUser = iRequest.user.id;

    let requestRecord = new Object();
    requestRecord.REQUEST_ID = iRequestId;

    requestRecord.REQUESTER_CODE = iRequest.data.REQUESTER;



    let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay).where({ MailDipendente: actualUser }));
    if (oInfoWDPosition === undefined) {
        requestRecord.REQUEST_OWNER = actualUser;
    } else {
        requestRecord.REQUEST_OWNER = oInfoWDPosition.FullName;
    }


    requestRecord.STATUS_code = consts.requestStatus.Progress;
    requestRecord.STARDATE = new Date();
    requestRecord.VERSION = 1;

    let InsertRequest = INSERT.into(Request).entries(requestRecord);

    let insertTasksResponse = await iCdsTx.run(InsertRequest);

    return iRequest;
}

async function startBPAProcess(iRequest, iRequestId, iMoaApprovers) {


    let responseCreateWf;
    let compiler
    let oBPAContext
    let definitionID


    let compilerElement = _.findWhere(iMoaApprovers, {
        IDROLE: "COMPILER"
    });

    if (compilerElement === undefined) {
        let errMEssage = "ERROR: COMPILER role not found: " + iRequestId;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    compiler = compilerElement.MAIL;

    if (compiler === undefined) {
        let errMEssage = "ERROR: Not mail set for IDROLE: COMPILER ";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }



    oBPAContext = {
        "REQUESTID": iRequestId,
        "CURRENT_APPROVERS": compiler,
        "STEP_10": 10,
        "STEP_20": 20,
        "STEP_30": 30,
        "STEP_40": 40,
        "STEP_42": 42,
        "STEP_45": 45,
        "STEP_50": 50,
        "STEP_60": 60,
        "STEP_70": 70,
        "STEP_80": 80,
        "STEP_DESCRIPTION": "",
        "ISREADONLY": "",
        "GENERICSTRING": ""
    }

    definitionID = consts.WF_DEFINITION_ID;


    try {

        LOG.info("Start Process" + iRequestId);

        let startPayload = {};
        startPayload.definitionId = definitionID

        startPayload.context = {
            "bpacontext": oBPAContext
        }

        const userJwt = retrieveJwt(iRequest);
        responseCreateWf = await WorkflowInstancesApi.createV1WorkflowInstances(startPayload)
            //  .execute({ destinationName: consts.API_WF_DESTINATION });
            .execute({ destinationName: consts.API_WF_DESTINATION_XSUAA, jwt: userJwt });

    } catch (error) {
        let errMEssage = "startProcess:" + error.message + " REQUESTID: " + iRequestId;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    return responseCreateWf.id;
}

async function userTaskCounter(iData, iRequest) {

    LOG.info("userTaskCounter");

    let urlTaskCollection;
    let authorization;
    let resultTasks;
    let counter = 0;

    try {
        //Non è stata inclusa la direttiva $count 
        if (iData <= 0) {
            return iData;
        }



        urlTaskCollection = "TaskCollection/?$filter=Status eq 'READY' or Status eq 'RESERVED' or Status eq 'IN_PROGRESS' or Status eq 'EXECUTED'";


        authorization = iRequest.headers.authorization;

        resultTasks = await axiosMyInboxService({
            method: 'GET',
            url: urlTaskCollection,
            params: {
                "$format": 'json'
            },
            headers: {
                "content-type": "application/json",
                "Authorization": authorization
            }
        });

        resultTasks.data.d.results.forEach(task => {
            if (task.TaskDefinitionID.includes("kupito2p")) {
                counter++;
            }
        });

        iData[0].$count = counter;

    } catch (error) {
        let errMEssage = "userTaskCounter " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

}

async function getMonitorTaskLink(iRequestId, iRequest) {

    LOG.info("getMonitorTaskLink" + iRequestId);

    let lReturn = {};
    let resultTasks;
    let urlTaskCollection;
    let taskInstanceId;
    let queryTaskId;
    let queryVersion;

    try {

        queryVersion = await SELECT.one.from(Request)
            .columns(["VERSION"])
            .where({
                REQUEST_ID: iRequestId
            });
        if (queryVersion === null) {
            lReturn.MTYPE = consts.ERROR;
            lReturn.TEXT = "ERROR getMonitorTaskLink: VERSION for request " + iRequestId + " was not found";
            LOG.error(lReturn.TEXT);
            return lReturn;
        }

        queryTaskId = await SELECT.one.from(ApprovalHistory)
            .columns(["BPA_TASKID_ID"])
            .where({
                to_Request_REQUEST_ID: iRequestId,
                VERSION: queryVersion.VERSION,
                To_StepStatus_STEP_STATUS: consts.stepStatus.READY
            });
        if (queryTaskId === null ||
            queryTaskId === undefined ||
            queryTaskId.BPA_TASKID_ID === null) {
            lReturn.MTYPE = consts.ERROR;
            lReturn.TEXT = "ERROR getMonitorTaskLink: BPA_TASKID_ID for request " + iRequestId + " was not found";
            LOG.error(lReturn.TEXT);
            return lReturn;
        }


        urlTaskCollection = "TaskCollection(SAP__Origin='NA',InstanceID='" + queryTaskId.BPA_TASKID_ID + "')";
        let authorization = iRequest.headers.authorization;

        resultTasks = await axiosMyInboxService({
            method: 'GET',
            url: urlTaskCollection,
            params: {
                "$format": 'json'
            },
            headers: {
                "content-type": "application/json",
                "Authorization": authorization
            }
        });

    } catch (error) {
        let errMEssage = "getMonitorTaskLink:" + error.message + " REQUESTID: " + iRequestId;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    let taskUrl = await getTaskComposedUrl(queryTaskId.BPA_TASKID_ID, iRequest);

    lReturn.MTYPE = consts.SUCCESS;
    lReturn.TASKURL = taskUrl.relativeUrl;
    lReturn.TASKID = queryTaskId.BPA_TASKID_ID;
    return lReturn;
}


async function getTaskComposedUrl(iTaskId, iRequest) {

    let result = {};
    result.absoluteUrl = "";
    result.relativeUrl = "";

    try {

        let host = iRequest.headers.origin;
        let urlWzSite = getEnvParam("URL_WZ_SITE", false);
        //Debug da BAS
        if (host === undefined) {
            host = 'https://cf-kupit-dev-yy6gs83h.launchpad.cfapps.eu10.hana.ondemand.com';
        }

        let urlTask1 = getEnvParam("URL_TASK_WF1", false);
        let urlTask2 = getEnvParam("URL_TASK_WF2", false);
        let taskUrl = urlTask1 + urlTask2;

        taskUrl = taskUrl.replaceAll("<TASKID>", iTaskId);

        result.relativeUrl = taskUrl;
        result.absoluteUrl = host + urlWzSite + taskUrl;

    } catch (error) {
        let errMEssage = "ERROR getTaskComposedUrl:" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return result;
    }
    return result;
}

async function updateMoaApprovers(iRequestId, iUserCompiler, iRequest) {


    let returnSaveMoaApprovers;

    try {
        const cdsTx = cds.tx();

        //Get MOA Approvers
        let returnGetMoaApprovers = await getMoaApprovers(iRequest, iRequestId, iUserCompiler);
        if (returnGetMoaApprovers.errors) {
            return returnGetMoaApprovers;
        }

        //Delete OLD MOA Approvers
        let deleteApprovers = await DELETE.from(ApprovalFlow).where({ to_Request_REQUEST_ID: iRequest.data.REQUEST_ID });
        // let deleteResponse = await cdsTx.run(deleteApprovers);


        //Save MOA Approvers
        returnSaveMoaApprovers = await saveMoaApprovers(iRequest, iRequestId, returnGetMoaApprovers, cdsTx);
        if (returnSaveMoaApprovers.errors) {
            return returnSaveMoaApprovers;
        }

        /*  let newHistorySteps = [];
          for (var i = 0; i < returnGetMoaApprovers.length; i++) {
              if (returnGetMoaApprovers[i].INDEX > iStepID) {
                  newHistorySteps.push(returnGetMoaApprovers[i]);
              }
          } */

        //Create Approvers history
        // let firstVersion = 1;

        let returnData = await getRequestData(iRequestId, iRequest);
        let actualVersion = returnData.VERSION;

        let returnApprovalHistory = await insertApprovalHistory(iRequest, iRequest.data.REQUEST_ID, returnSaveMoaApprovers, actualVersion, cdsTx);

        if (returnApprovalHistory.errors) {
            return returnApprovalHistory;
        }

        //Commit 
        // await cdsTx.commit();

    } catch (error) {
        let errMEssage = "updateMoaApprovers:" + error.message + " O2PREQUESTID: " + iRequest.data.REQUEST_ID;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    return returnSaveMoaApprovers;
}


async function getTaskId(iRequestId, iStepId, iWfInstaceID, iRequest) {
    LOG.info("getTaskId" + iRequestId);

    let lReturn = new Object();

    let responseTaskInstance;
    let respTaskContext;
    let respTaskAttributes;

    try {

        //  const userJwt = retrieveJwt(iRequest);

        responseTaskInstance = await UserTaskInstancesApi.getV1TaskInstances({
            workflowInstanceId: iWfInstaceID,
            status: "READY",
        }).execute({
            destinationName: consts.API_WF_DESTINATION
            //  destinationName: consts.API_WF_DESTINATION_XSUAA, jwt: userJwt
        });

        if (responseTaskInstance.length <= 0) {
            let errMEssage = "getTaskId.getV1TaskInstances: active tasks not found for Request:" + iRequestId;
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        respTaskContext = await UserTaskInstancesApi.getV1TaskInstancesContextByTaskInstanceId(responseTaskInstance[0].id).execute({
            destinationName: consts.API_WF_DESTINATION
        });

        let contextRequest = respTaskContext.REQUESTID;
        let contextStep = respTaskContext.STEP;

        if (contextRequest !== iRequestId || contextStep !== iStepId) {
            let errMEssage = "getTaskId.getV1TaskInstances: active tasks not found for Request:" + iRequestId + " and Step:" + iStepId;
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }
    } catch (error) {
        let errMEssage = "getTaskId:" + error.message + " REQUESTID: " + iRequestId;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return responseTaskInstance[0].id;
}


async function getActualStep(iRequestId) {

    let actualStep = ''

    let oRequest = await SELECT.one.from(Request).
        where({
            REQUEST_ID: iRequestId
        });


    if (oRequest) {

        let oApproval = await SELECT.one.from(ApprovalHistory).
            where({
                REQUEST_ID: oRequest.REQUEST_ID,
                VERSION: oRequest.VERSION,
                To_Action_ACTION: 'READY'
            });

        if (oApproval) {
            actualStep = oApproval.STEP
        }

    }

    return actualStep

}

module.exports = {
    getActualStep,
    createProcess,
    updateWfInstanceId,
    checkTaskCreated,
    insertApprovalHistory,
    getMoaApprovers,
    saveMoaApprovers,
    getApproverSequence,
    getTaskInstanceUrl,
    getNextRequestId,
    reqWithZeroes,
    createRequest,
    startBPAProcess,
    userTaskCounter,
    getMonitorTaskLink,
    getTaskComposedUrl,
    updateMoaApprovers,
    getTaskId,
    getMOAParams
}