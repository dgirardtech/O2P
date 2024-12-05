const LOG = cds.log('KupitO2PSrv');
const client = require('@sap-cloud-sdk/http-client');
const connectivity = require('@sap-cloud-sdk/connectivity');
const _ = require('underscore');
const consts = require("./Constants");
const { getEnvParam, getTextBundle } = require('./Utils');
const SequenceHelper = require("./SequenceHelper");
const { WorkflowInstancesApi, UserTaskInstancesApi } = require(consts.PATH_API_WF);
const moment = require('moment');
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

                let oApprovalDb = aApprovalDb.find(oApprovalDb => oApprovalDb.STEP === Number(iMoaApprovers[a].STEP)  ) 

                if (oApprovalDb && Boolean(oApprovalDb.BPA_TASKID_ID)) {
                    aApprovalHistory.push(oApprovalDb)
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


        insertRequestResponse = await UPSERT.into(ApprovalHistory).entries(aApprovalHistory);


    } catch (error) {
        iRequest.error(450, error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }

    return iRequest;
}

async function getMoaApprovers(iRequest, iRequestID, iUserCompiler) {

    let moaRequest = {};
    let input = [];
    let moaResponse;
    var result = []

    let oRequest = await SELECT.one.from(Request).where({ REQUEST_ID: iRequestID });



    try {


        let sendFakeMail = getEnvParam("FAKE_APPROVERS", false);
        if (sendFakeMail === "false") {


            input.push({ attribute: "COMPANYNAMEAT", value: "KUPIT" });
            input.push({ attribute: "BPROCESSNAMEAT", value: "O2PAPP" });
            input.push({ attribute: "DEFAULTLVLAT", value: "TRUE" });
            input.push({ attribute: "MAILCOMPILER", value: iUserCompiler });

            moaRequest = { input: input };


            moaResponse = await MoaExtraction.send('POST', '/NewMoaExtraction', moaRequest);

            result = moaResponse.d.results;


        } else {


            result.push({ INDEX: "10", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COMPILER", DESCROLE: "Compilatore", ISMANAGER: "false" });
            result.push({ INDEX: "20", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COORDVEND", DESCROLE: "Controller", ISMANAGER: "false" });  // o Uffcio Attività Fisse
            result.push({ INDEX: "30", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COORDRETE", DESCROLE: "Coordinatore", ISMANAGER: "false" });
            result.push({ INDEX: "40", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COMPILER", DESCROLE: "Manager", ISMANAGER: "false" });

            if (oRequest && Boolean(oRequest.EXTRA_MANAGER_REQUIRED)) {
                //oRequest.EXTRA_MANAGER_NAME
                result.push({ INDEX: "42", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COMPILER", DESCROLE: "Manager Step30", ISMANAGER: "false" });
             }
          
            // result.push({ INDEX: "45", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COMPILER", DESCROLE: "Direttore", ISMANAGER: "false" });
            result.push({ INDEX: "50", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COORDVEND", DESCROLE: "Controller", ISMANAGER: "false" });
      
            
            if (oRequest && Boolean(oRequest.PAYMENT_MODE_CODE) && oRequest.PAYMENT_MODE_CODE === consts.Paymode.F24 ) {
            result.push({ INDEX: "60", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COORDRETE", DESCROLE: "Addetto Finanza ", ISMANAGER: "false" }); // o Addetto Cassa o Controller
            }
       
            //    result.push({ INDEX: "70", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COORDRETE", DESCROLE: "Addetto Finanza", ISMANAGER: "false" }); // o Addetto Cassa 
        //    result.push({ INDEX: "80", WDID: "702302", SAPUSER: "IT_RCAO", MAIL: "rcao@q8.it", FNAME: "ROBERTO", LNAME: "CAO", IDROLE: "COORDRETE", DESCROLE: "Compilatore", ISMANAGER: "false" });
            
        }



    } catch (error) {
        iRequest.error(450, error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }


    //   let result = moaResponse.d.results;

    /*
        for (let a = 0; a < result.length; a++) {
    
            let messageApprover = result[a].MESSAGE;
            if (messageApprover.MTYPE === undefined) {
                continue;
            }
            if (messageApprover.MTYPE === consts.MOAERROR) {
                iRequest.error(450, messageApprover.TEXT, null, 450);
                LOG.error(messageApprover.TEXT);
                return iRequest;
            }
        }
     
     */


    return result;

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
        insertRequest = UPSERT.into(ApprovalFlow).entries(approversEntries);
        InsertRequestResponse = await iCdsTx.run(insertRequest);

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
            .execute({ destinationName: consts.API_WF_DESTINATION });
            //.execute({ destinationName: consts.API_WF_DESTINATION_XSUAA, jwt: userJwt });

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
          let deleteApprovers = DELETE.from(ApprovalFlow).where({ to_Request_REQUEST_ID : iRequest.data.REQUEST_ID });
          let deleteResponse = await cdsTx.run(deleteApprovers);


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
        await cdsTx.commit();

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



module.exports = {
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
    getTaskId
}