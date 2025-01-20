const LOG = cds.log('KupitO2PSrv');
const _ = require('underscore');
const consts = require("./Constants");
const { getEnvParam, getTextBundle } = require('./Utils');
const { getMoaApprovers, updateMoaApprovers, insertApprovalHistory, getTaskId, getTaskComposedUrl } = require('./createProcess');
const { generateO2PDocument } = require('./HandlerPDF');
const moment = require('moment');
const { row, and } = require('mathjs');
const { WorkflowInstancesApi, UserTaskInstancesApi } = require(consts.PATH_API_WF);
const { testMail, mailMissingApprovers, mailProcessDeleted, mailProcessCompleted, mailTaskRejected, sendAllMail, teamsTaskNotification, teamsTaskRejectNotification } = require('./MailHandler');
const { PassThrough } = require("stream");
const { UPSERT } = require('@sap/cds/lib/ql/cds-ql'); 

async function saveUserAction(iRequest) {

    let requestId;
    let stepID;
    let bpaUserAction;
    let message = {};
    let response;

    try {
        requestId = iRequest.data.REQUEST_ID;
        stepID = iRequest.data.STEPID;
        bpaUserAction = iRequest.data.ACTION;

        switch (bpaUserAction) {
            case consts.bpaUserAction.START:
                response = await userActionStart(requestId, stepID, iRequest);
                break;
            case consts.bpaUserAction.APPROVE:
                response = await handleUserAction(requestId, stepID, consts.UserAction.APPROVED, iRequest);
                break;
            case consts.bpaUserAction.REJECT:
                response = await handleUserAction(requestId, stepID, consts.UserAction.REJECTED, iRequest);
                break;
            case consts.bpaUserAction.TERMINATE:
                response = await handleUserAction(requestId, stepID, consts.UserAction.TERMINATED, iRequest);
                break;
            default:
                let errMEssage = "ERROR saveUserAction " + requestId + " : unhandled user action:" + bpaUserAction;
                iRequest.error(450, errMEssage, null, 450);
                LOG.error(errMEssage);
                return iRequest;
        }


        let oResponseSendAllMail = await sendAllMail(iRequest,false)
  
        let o2pDocument = await generateO2PDocument(iRequest,true) 


        return response;
        //return iRequest;

    } catch (error) {
        let errMEssage = "ERROR UserAction " + requestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

}

async function handleUserAction(iRequestId, iStepID, iUserAction, iRequest) {

    const oBundle = getTextBundle(iRequest);


    let requestData = await getRequestData(iRequestId, iRequest)
    if (requestData.errors) {
        return requestData;
    }

    let retUserAction = await userAction(iRequestId, iStepID, iUserAction, iRequest);
    if (retUserAction.errors) {
        return retUserAction;
    }

    let retUpdateRequestStatus = await updateRequestStatus(iRequestId, iStepID, iUserAction, iRequest);
    if (retUpdateRequestStatus.errors) {
        return retUpdateRequestStatus;
    }

    if (retUpdateRequestStatus === consts.requestStatus.Completed ||
        iUserAction === consts.UserAction.REJECTED) {

        if (iUserAction === consts.UserAction.REJECTED) {
            retUpdateRequestStatus = consts.requestStatus.Refused
        }

/*
        let retsendProcessMail = await sendProcessMail(iRequestId, retUpdateRequestStatus, iUserAction, iRequest);
        if (retsendProcessMail.errors) {
            return retsendProcessMail;
        }
            */

    }



    let message = new Object();
    message.MTYPE = consts.SUCCESS;
    message.REQUESTID = iRequestId;
    message.TEXT = oBundle.getText("ACTION_COMPLETED", [iRequestId]);
    return message;

}

 

async function emailRejectedProcessTask(iRequestId, iRequest) {

    let recipient = [];
    let rejectorFullName = "";
    let fullNameCompiler = "";
    let request;
    let actualUser;
    let note = "";

    try 
    
    {

        actualUser = iRequest.user.id;

        request = await getRequestData(iRequestId, iRequest)
        if (request.errors) {
            return request;
        }

        let approval = await SELECT.from(ApprovalHistory).
            where({
                REQUEST_ID: iRequestId,
                To_StepStatus_STEP_STATUS: consts.stepStatus.COMPLETED
            });

        approval.forEach(element => {
            if (element.REAL_MAIL !== null) {
                recipient.push(element.REAL_MAIL);
            }
        });

        ////////////////////////////////////////////////////////////////////////////

        let stepCheck

        /*

        if (request.PROCESSTYPE_code === consts.processType.Annuale) {
            if (iRequest.data.STEPID > 40) {
                stepCheck = 40
            } else {
                stepCheck = 10
            }
        }

        if (request.PROCESSTYPE_code === consts.processType.Cessazione) {

            if (iRequest.data.STEPID > 50) {
                stepCheck = 50
            } else {

                if (iRequest.data.STEPID > 20) {

                    stepCheck = 20

                } else {
                    stepCheck = 10
                }

            }
        }

        */

        stepCheck = 10


        let approvalH = await SELECT.one.from(ApprovalHistory).
            where({
                REQUEST_ID: iRequestId,
                VERSION: request.VERSION,
                STEP: stepCheck
            });


        //////////////////////////////////////////////////////////////////////////

        /*   let approvalH = await SELECT.one.from(ApprovalHistory).
               where({
                   REQUEST_ID: iRequestId,
                   STEP: 10,
                   To_StepStatus_STEP_STATUS: consts.stepStatus.COMPLETED
               }); */

        //////////////////////////////////////////////////////////////////////

        if (approvalH.REAL_FULLNAME !== null) {
            fullNameCompiler = approvalH.REAL_FULLNAME;
        }

        recipient = _.reject(recipient, actualUser);
        if (recipient.length <= 0) {
            return iRequest;
        }

        // createdBy: actualUser
        let noteElement = await SELECT.one.from(Notes).
            where({
                REQUEST_ID: iRequestId,
                VERSION: request.VERSION,
                TYPE: 'R'

            });
        if (noteElement) {
            rejectorFullName = noteElement.CREATOR_FULLNAME
            note = noteElement.NOTE;
        }

        let retMailProcedeleted = await mailTaskRejected(iRequestId, request, recipient, rejectorFullName, fullNameCompiler, note, iRequest)
        if (retMailProcedeleted.errors) {
            return retMailProcedeleted;
        }

    } catch (error) {
        let errMEssage = "ERROR emailTerminatedProcess " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}


async function updateRequestStatus(iRequestId, iStepID, iUserAction, iRequest) {

    if (iUserAction === consts.UserAction.REJECTED) {
        return iRequest;
    }

    let processStatus;
    let updateRequest;
    let date


    let requestData = await getRequestData(iRequestId, iRequest)
    if (requestData.errors) {
        return requestData;
    }

    try {
        switch (iUserAction) {
            case consts.UserAction.APPROVED:

                processStatus = await getStatusProcessApproved(iRequestId, iStepID, iRequest)
                if (processStatus === consts.requestStatus.Completed) {
                    date = new Date()
                }

                break;

            case consts.UserAction.TERMINATED:

                processStatus = await getStatusProcessTerminated(iRequestId, iRequest)
                date = new Date()

                break;
        }
        if (processStatus.errors) {
            return processStatus;
        }

        /* if (requestData.PROCESSTYPE_code === consts.processType.Annuale ||
             requestData.PROCESSTYPE_code === consts.processType.Cessazione
         ) { */
        updateRequest = await UPDATE(Request).set({ STATUS_code: processStatus, ENDDATE: date }).where({ REQUEST_ID: iRequestId });
        /*  } else {
              updateRequest = await UPDATE(Request).set({ STATUS_code: processStatus, ENDDATE: date, REQUEST_OWNER: '' }).where({ REQUEST_ID: iRequestId });
          } */
    } catch (error) {
        let errMEssage = "ERROR updateRequestStatus " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return processStatus;
}


async function getStatusProcessApproved(iRequestId, iStepID, iRequest) {

    try {

        let returnGetApprovers = await getNextApprovers(iRequestId, iStepID, iRequest);
        if (returnGetApprovers.errors) {
            return returnGetApprovers;
        }
        if (returnGetApprovers.endProcess) {
            return consts.requestStatus.Completed;
        }

        return consts.requestStatus.Progress;

    } catch (error) {
        let errMEssage = "ERROR getStatusProcessApproved " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

}

async function getStatusProcessTerminated(iRequestId, iRequest) {

    let requestData;
    let processStatus;

    try {

        requestData = await getRequestData(iRequestId, iRequest)
        if (requestData.errors) {
            return requestData;
        }
        if (requestData.VERSION === 1) {
            processStatus = consts.requestStatus.Deleted;
        } else {
            processStatus = consts.requestStatus.Refused;
        }

        //  processStatus = consts.requestStatus.Refused;

    } catch (error) {
        let errMEssage = "ERROR getStatusProcessTerminated " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return processStatus;
}

async function userActionStart(iRequestId, iStepID, iRequest) {

    const oBundle = getTextBundle(iRequest);

    let returnApproversControl = await approversControl(iRequestId, iStepID, iRequest);
    if (returnApproversControl.errors) {
        return returnApproversControl;
    }

    //Update approval history
    let actualUser = iRequest.user.id
 

    let returnO2PData = await getRequestData(iRequestId, iRequest);
    let actualVersion = returnO2PData.VERSION;

    let approvalHistory = await getRealUserInfo(actualUser, iRequest);

    approvalHistory.to_Request_REQUEST_ID = iRequestId;
    approvalHistory.STEP = iStepID;
    approvalHistory.VERSION = actualVersion;
    approvalHistory.To_StepStatus_STEP_STATUS = consts.stepStatus.COMPLETED;
    approvalHistory.To_Action_ACTION = consts.UserAction.STARTED;
    approvalHistory.EXECUTED_AT = new Date();

    let returnUpdate = await updateApprovalHistory(approvalHistory, iRequest);


    //aggiornamento data inizio flusso
    let startdt = new Date();
    let updateRequest;
    updateRequest = await UPDATE(Request).where({ REQUEST_ID: iRequestId }).set({ START_APPROVAL_FLOW: startdt });

 

    let message = new Object();
    message.MTYPE = consts.SUCCESS;
    message.REQUESTID = iRequestId;
    message.TEXT = oBundle.getText("ACTION_COMPLETED", [iRequestId]);
    return message;
}
 




async function userAction(iRequestId, iStepID, iUserAction, iRequest) {


    let returnApproversControl = await approversControl(iRequestId, iStepID, iRequest);
    if (returnApproversControl.errors) {
        return returnApproversControl;
    }



    //Update approval history
    let actualUser = iRequest.user.id; //<----da ripristinare 
    //let actualUser = 'vasbarde@q8.it';

    let returnData = await getRequestData(iRequestId, iRequest);
    let actualVersion = returnData.VERSION;

    let approvalHistory = await getRealUserInfo(actualUser, iRequest);

    approvalHistory.to_Request_REQUEST_ID = iRequestId;
    approvalHistory.STEP = iStepID;
    approvalHistory.VERSION = actualVersion;
    approvalHistory.To_StepStatus_STEP_STATUS = consts.stepStatus.COMPLETED;
    approvalHistory.To_Action_ACTION = iUserAction;
    approvalHistory.EXECUTED_AT = new Date();

    let returnUpdate = await updateApprovalHistory(approvalHistory, iRequest);
    return returnUpdate;
}

async function getRealUserInfo(iActualUser, iRequest) {

    let approvalHistory = {};

    let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
        .where({ MailDipendente: iActualUser }));
    if (oInfoWDPosition === undefined) {
        approvalHistory.REAL_MAIL = iActualUser;
        approvalHistory.REAL_FULLNAME = iActualUser;
    } else {
        approvalHistory.REAL_MAIL = iActualUser;
        approvalHistory.REAL_FNAME = oInfoWDPosition.Nome;
        approvalHistory.REAL_LNAME = oInfoWDPosition.Cognome;
        approvalHistory.REAL_FULLNAME = oInfoWDPosition.FullName;
    }

    return approvalHistory;
}



async function getStepList() {

    let StepList = [];
    let row;

    let resStepDescription = await SELECT.from(StepDescription);

    for (let i = 0; i < resStepDescription.length; i++) {
        row = {};
        row.STEP = resStepDescription[i].STEP;
        StepList.push(row);
    }
    return StepList;
}

async function getStepParams(iRequest) {

    let resp = {};
    let aMailList = [];
    let mailList = "";
    let aRequest;
    let requestId = iRequest.data.REQUEST_ID;
    let stepID = iRequest.data.STEP;

    resp.REQUEST_ID = iRequest.data.REQUEST_ID;
    resp.STEP = iRequest.data.STEP;

    try {
        aRequest = await getRequestData(requestId, iRequest)
        if (aRequest.errors) {
            return aRequest;
        }

        //take the version for approval history update  
        version = aRequest.VERSION;

        let returnGetApprovers = await getNextApprovers(requestId, 0, iRequest);
        if (returnGetApprovers.errors) {
            return returnGetApprovers;
        }

        let stepElements = _.where(returnGetApprovers.approvalFlow, { STEP: stepID });
        // if (stepID == 20 && stepElements.length <= 0) {
        //     let message = "STEP 20 not found for REQUEST_ID " + requestId;
        //     LOG.info(message);
        //     resp.STEP_EXIST = false;
        //     return resp;
        // }

        if (stepElements.length <= 0) {
            let message = "STEP " + stepID + " not found for REQUEST_ID " + requestId;
            LOG.info(message);
            resp.STEP_EXIST = false;
            return resp;
        }

        if (stepElements.length <= 0) {
            let errMEssage = "STEP " + iRequest.data.STEP + " not found for REQUEST_ID " + iRequest.data.REQUEST_ID;
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        // //Update approver step by MOA
        // let stepStarter = _.findWhere(resApprovalFlow, { STEP: 10 });
        // let userCompiler = stepStarter.MAIL;
        // let returnUpdateStepByMOA = await updateStepByMOA(iRequest, userCompiler, stepElements);
        // if (returnUpdateStepByMOA.errors) {
        //     return returnUpdateStepByMOA;
        // }
        // stepElements = returnUpdateStepByMOA;

        //Approvers by Step
        for (let a = 0; a < stepElements.length; a++) {
            aMailList.push(stepElements[a].MAIL);
        }

        // /*
        //Approvers delegated
        let returnGetDelegated = await getDelegated(iRequest, stepElements);
        if (returnGetDelegated.errors) {
            return returnSaveMoaApprovers;
        }
        aMailList = aMailList.concat(returnGetDelegated);
        aMailList = _.uniq(aMailList);


        for (let m = 0; m < aMailList.length; m++) {
            mailList = mailList + aMailList[m] + ",";
        }
        mailList = mailList.substring(0, mailList.length - 1);

        let returnStepDescription = await getStepDescritpion(iRequest);
        if (returnStepDescription.errors) {
            return returnStepDescription;
        }

        resp.REQUEST_ID = iRequest.data.REQUEST_ID;
        resp.STEP = iRequest.data.STEP;
        resp.STEP_EXIST = true;
        resp.MAIL_LIST = mailList;
        resp.STEP_DESCRIPTION = returnStepDescription.stepDescription;
        resp.STEP_RO = returnStepDescription.stepRo;
        resp.PAYMODE = aRequest.PAYMENT_MODE_CODE

        //update approvalHistory  
        let approvalHistory = {};
        approvalHistory.to_Request_REQUEST_ID = requestId;
        approvalHistory.STEP = stepID;
        approvalHistory.VERSION = version;
        approvalHistory.To_StepStatus_STEP_STATUS = consts.stepStatus.READY;
        approvalHistory.ASSIGNED_AT = new Date();

        let returnUpdate = await updateApprovalHistory(approvalHistory, iRequest);
        if (returnUpdate.errors) {
            return returnUpdate;
        }

        return resp;
    } catch (error) {
        iRequest.error(450, "getO2PStepParams: " + error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }
}


async function getDelegated(iRequest, iStepElements) {

    let responseDelegations;
    let results = [];
    let aMailList = [];
    let oDate = new Date();
    let jsonDate = oDate.toJSON();
    let user = "";

    try {

        for (let d = 0; d < iStepElements.length; d++) {

            user = iStepElements[d].MAIL;

            let filterP1 = "/DelegationRO?$filter=USER eq '" + user + "' and BPROCESS_BPROCESS eq 'O2PPROCESS'";
            let filterP2 = filterP1 + " and FROMDATE le datetime'" + jsonDate + "' and TODATE ge datetime'" + jsonDate + "'";

            responseDelegations = await MoaExtraction.send({
                method: 'GET',
                path: filterP2
            });

            for (let i = 0; i < responseDelegations.d.results.length; i++) {
                results.push(responseDelegations.d.results[i]);
            }
        }

    } catch (error) {
        iRequest.error(450, "getDelegation: " + error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }

    if (results.length <= 0) {
        return aMailList;
    }

    for (let r = 0; r < results.length; r++) {
        let result = results[r];
        let delegate = result.DELEGATE;
        if (delegate !== undefined || delegate !== "") {
            aMailList.push(delegate);
        }
    }
    return aMailList;
}


async function updateApprovalHistory(iApprovalHistory, iRequest) {
    let aApprovalHistory = new Array();
    let updateResp;

    try {
        aApprovalHistory.push(iApprovalHistory);
        updateResp = await UPSERT.into(ApprovalHistory).entries(aApprovalHistory);
    } catch (error) {
        iRequest.error(450, "updateApprovalHistory: " + error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }
    return iRequest;
}

async function getNextApprovers(iRequestId, iStepID, iRequest) {

    let aApprovals;
    let response = {};

    try {
        aApprovals = await SELECT.from(ApprovalFlow).
            where({
                STEP: { '>': iStepID },
                to_Request_REQUEST_ID: iRequestId
            }).orderBy('STEP asc');
    } catch (error) {
        let errMEssage = "ERROR getNextApprovers " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    if (aApprovals.length <= 0) {
        //Fine flusso approvativo
        LOG.info("End approval flow PidRequest: " + iPidRequestId);
        response.endProcess = true;
        return response;
    }

    response.approvalFlow = aApprovals;
    return response;
}

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

async function getStepDescritpion(iRequest) {

    let responseStepDescription = {};
    let stepDescription = "";
    let projectTitle = "";

    let rsRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID });


    let rsStepDescription = await SELECT.one.from(StepDescription).
        where({
            STEP: iRequest.data.STEP
        });


    if (rsStepDescription === undefined) {
        stepDescription = "- - -";
    } else {
        stepDescription = rsStepDescription.STEP_DESCRIPTION;
    }


    stepDescription = stepDescription.replaceAll('<REQUEST_ID>', iRequest.data.REQUEST_ID);

    //////////////////////////////////////////////////////////////

    if (rsRequest.PAYMENT_MODE_CODE) {

        let oPaymode = await SELECT.one.from(Paymode).
            where({ CODE: rsRequest.PAYMENT_MODE_CODE });

        stepDescription = stepDescription.replaceAll('<PAYMENT_MODE>', oPaymode.PAYMENT_NAME);

    }

    ////////////////////////////////////////////////////////////////

    let rsRequester = await SELECT.one.from(Requester).
        where({ CODE: rsRequest.REQUESTER_CODE });

    stepDescription = stepDescription.replaceAll('<REQUESTER>', rsRequester.REQUESTER_NAME);



    responseStepDescription.stepDescription = stepDescription;
    responseStepDescription.stepRo = rsStepDescription.STEP_RO;

    return responseStepDescription;
}

async function updateStepByMOA(iRequest, iUserCompiler, iStepElements) {

    let approversEntries = new Array();

    let returnGetMoaApprovers = await getMoaApprovers(iRequest, iUserCompiler);
    if (returnGetMoaApprovers.errors) {
        return returnGetMoaApprovers;
    }

    let moaElements = _.where(returnGetMoaApprovers, { INDEX: iRequest.data.STEP });
    if (moaElements.length <= 0) {
        //Qualcosa non ha funzionato.Non aggiorno il flusso salvato, il processo continua
        let errMEssage = "Update by MOA STEP " + iRequest.data.STEP + " not found for REQUEST_ID " + iRequest.data.REQUEST_ID;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iStepElements;
    }

    try {

        let respDelete = await DELETE.from(ApprovalFlow).
            where({
                to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                STEP: iRequest.data.STEP
            });

        let lSequence = 0;
        for (let i = 0; i < moaElements.length; i++) {
            let moaApprover = moaElements[i];

            let approver = new Object();
            approver.to_Request_REQUEST_ID = iRequest.data.REQUEST_ID;
            approver.STEP = moaApprover.INDEX;
            approver.SEQUENCE = lSequence = lSequence + 10
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
        }

        let insertResult = await INSERT.into(ApprovalFlow).entries(approversEntries);

    } catch (error) {
        let message = "updateStepByMOA : " + error.message;
        iRequest.error(450, message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }

    return approversEntries;
}


async function approversControl(iRequestId, iStepID, iRequest) {

    let returnRequestData = await getRequestData(iRequestId, iRequest);
    if (returnRequestData.errors) {
        return returnRequestData;
    }
    let userCompiler = returnRequestData.createdBy;

    //Aggiornamento approvatori MOA

    let returnUpdateMoa = await updateMoaApprovers(iRequestId, userCompiler, iRequest);
    if (returnUpdateMoa.errors) {
        return returnUpdateMoa;
    }


    let returnGetApprovers = await getNextApprovers(iRequestId, iStepID, iRequest);
    if (returnGetApprovers.errors) {
        return returnGetApprovers;
    }

    if (returnGetApprovers.endProcess) {
        return iRequest;
    }

    //A. Se l'approvatore successivo non è stato trovato blocca il processo e manda la mail al SAP Support
    let returnCheckNextApprover = await checkNextApprover(iRequestId, returnGetApprovers.approvalFlow, iRequest);
    if (returnCheckNextApprover.errors) {
        return returnCheckNextApprover;
    }

    //B. se manca uno dei successivi approvatori manda solo la mail
    let returncheckAllApprovers = await checkAllApprovers(iRequestId, returnGetApprovers.approvalFlow, iRequest);
    if (returncheckAllApprovers.errors) {
        return returncheckAllApprovers;
    }
    return iRequest;
}

async function checkNextApprover(iRequestId, iApprovalFlow, iRequest) {
    const oBundle = getTextBundle(iRequest);

    let nextApprover = iApprovalFlow[0];
    if (checkMailApprover(nextApprover.MAIL)) {
        return iRequest;
    }

    let errMEssage = oBundle.getText("MISSING_NEXT_APPROVER");
    iRequest.error(450, errMEssage, null, 450);
    LOG.error(errMEssage);

    let request = await SELECT.one.from(Request)
        .where({
            REQUEST_ID: iRequestId
        });

    //Invio mail al SAP Support
    let returnmissingApprovers = await mailMissingApprovers(request, iRequest);
    if (returnmissingApprovers.errors) {
        return returnmissingApprovers;
    }

    return iRequest;
}

function checkMailApprover(iMail) {

    if (typeof iMail === "string" && iMail.length === 0) {
        return false;
    } else if (iMail === null) {
        return false;
    } else if (iMail === undefined) {
        return false;
    } else if (iMail === 'null') {
        return false;
    } else {
        return true;
    }
}

async function updateRequestVersion(iRequest) {

    let requestId = iRequest.data.REQUEST_ID;

    let newVersion = await updateVersion(iRequest);
    if (newVersion.errors) {
        return newVersion;
    }

    let moaApprovers = await getNextApprovers(requestId, 0, iRequest);

    let respInsertHistory = await insertApprovalHistory(iRequest, requestId, moaApprovers.approvalFlow, newVersion);

    let o2pDocument = await generateO2PDocument(iRequest,true) 
    
    return respInsertHistory;

}

async function updateVersion(iRequest) {

    let requestId = iRequest.data.REQUEST_ID;
    let aRequest;
    let newVersion;

    try {
        let queryMaxVersion = await SELECT.one.from(Request)
            .columns(["max(VERSION) as maxVersion"])
            .where({
                REQUEST_ID: requestId
            });
        if (queryMaxVersion.maxVersion === null) {
            let errMEssage = "ERROR updateRequestVersion " + requestId + ". Request not found";
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        newVersion = + queryMaxVersion.maxVersion + 1;

        let resUPdate = await UPDATE(Request).set({ VERSION: newVersion }).where({
            REQUEST_ID: requestId
        });

    } catch (error) {
        let errMEssage = "ERROR updateRequestVersion " + pidRequest + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    return newVersion;
}

async function checkAllApprovers(iRequestId, iApprovalFlow, iRequest) {

    let sendMail = false;

    for (let i = 0; i < iApprovalFlow.length; i++) {
        if (!checkMailApprover(iApprovalFlow[i].MAIL)) {
            sendMail = true;
            break;
        }
    }

    if (!sendMail) {
        return iRequest;
    }

    let request = await SELECT.one.from(Request)
        .where({
            REQUEST_ID: iRequestId
        });

    //Invio mail al SAP Support
    let returnmissingApprovers = await mailMissingApprovers(request, iRequest);
    if (returnmissingApprovers.errors) {
        return returnmissingApprovers;
    }
    return iRequest;
}

async function getNextApprovers(iRequestId, iStepID, iRequest) {

    let aApprovals;
    let response = {};

    try {
        aApprovals = await SELECT.from(ApprovalFlow).
            where({
                STEP: { '>': iStepID },
                to_Request_REQUEST_ID: iRequestId
            }).orderBy('STEP asc');
    } catch (error) {
        let errMEssage = "ERROR getNextApprovers " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    if (aApprovals.length <= 0) {
        //Fine flusso approvativo
        LOG.info("End approval flow PidRequest: " + iRequestId);
        response.endProcess = true;
        return response;
    }

    response.approvalFlow = aApprovals;
    return response;
}

async function sendTeamsNotification(iRequest) {

    LOG.info("Begin sendTeamsNotification");

    let requestId;
    let stepID;
    let aRequestData;
    let taskId;
    let mailList;
    let aMailList;
    let taskUrl;
    let retTeamsTaskNotification;

    try {

        requestId = iRequest.data.REQUEST_ID;
        stepID = iRequest.data.STEP;
        mailList = iRequest.data.MAIL_LIST;
        aMailList = mailList.split(",");

        taskId = await updateTaskId(requestId, stepID, iRequest);
        if (taskId.errors) {
            return taskId;
        }

        taskUrl = await getTaskComposedUrl(taskId, iRequest);

        aRequestData = await getRequestData(requestId, iRequest);
        if (aRequestData.errors) {
            return aRequestData;
        }

        //Notifica di richiesta rifiutata
        if (stepID === 10 && aRequestData.VERSION > 1) {
               return await teamsTaskRejectNotification(aRequestData, taskUrl.absoluteUrl, aMailList, iRequest);
        }

        //Sul primo step non mandiamo la notifica
        if (stepID === 10) {
            return iRequest;
        }


        
        retTeamsTaskNotification = await teamsTaskNotification(aRequestData, taskUrl.absoluteUrl, aMailList, iRequest);
        if (retTeamsTaskNotification.errors) {
            return retTeamsTaskNotification;
        }
            


    } catch (error) {
        let errMEssage = "sendTeamsNotification:" + error.message + " REQUESTID: " + requestId;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}

async function updateTaskId(iRequestId, iStepID, iRequest) {
    LOG.info("Begin updateTaskId");

    let aRequestData;
    let taskId;

    try {

        aRequestData = await getRequestData(iRequestId, iRequest);
        if (aRequestData.errors) {
            return aRequestData;
        }

        taskId = await getTaskId(iRequestId, iStepID, aRequestData.BPA_PROCESS_ID, iRequest)
        if (taskId.errors) {
            return taskId;
        }

        let resultUPdate = await UPDATE(ApprovalHistory).set({ BPA_TASKID_ID: taskId }).where({
            to_Request_REQUEST_ID: iRequestId,
            STEP: iStepID,
            VERSION: aRequestData.VERSION
        });

    } catch (error) {
        let errMEssage = "updateTaskId:" + error.message + " REQUESTID: " + iRequestId;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return taskId;
}

async function assignApprover(iRequest) {

    let assign;
    try {
        let requestID = iRequest.data.REQUEST_ID;
        //let wfInstanceID = iRequest.data.WF_INSTACE_ID;
        let eMail = iRequest.data.EMAIL;
        let note = iRequest.data.NOTE;

        let history = await SELECT.one.from(ApprovalHistory)
            .where({
                to_Request_REQUEST_ID: requestID,
                // VERSION: queryVersion.VERSION,
                To_StepStatus_STEP_STATUS: consts.stepStatus.READY
            });

        if (history === undefined) {
            let errMEssage = "ERROR Request ID " + requestID + ", History record on ready not found";
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        const cdsTx = cds.tx(); //-> creo la transaction

        //Aggiornamento dei campi relativi al vecchio compilatore utilizzato da Fiori per visualizzare il messaggio di warning
        let oldApprover = await SELECT.one.from(ApprovalFlow).
            where({
                to_Request_REQUEST_ID: requestID,
                STEP: history.STEP
            });
        if (oldApprover !== null && oldApprover !== undefined) {
            let updateRequest = await UPDATE(Request).set({
                OLD_COMPILER_MAIL: oldApprover.MAIL,
                OLD_COMPILER_FULLNAME: oldApprover.FULLNAME
            }).where({
                REQUEST_ID: requestID
            });
            // let updateRequestResponse = await cdsTx.run(updateRequest);
        }
        //OLD_COMPILER
        updatecompiler = await updateReqApprovers(iRequest, requestID, eMail, history.STEP, cdsTx)
        if (updatecompiler.errors) {
            //  await cdsTx.rollback();
            return assign;
        }

        if (note !== undefined && note != '') {
            let responseNote = await saveNove(iRequest, requestID, note, cdsTx);
            if (responseNote.errors) {
                //  await cdsTx.rollback();
                return assign;
            }

        }

        assign = await assignTaskto(iRequest, requestID, history.BPA_TASKID_ID, eMail)
        if (assign.errors) {
            return assign;
        }

        // await cdsTx.commit();

        const oBundle = getTextBundle(iRequest);
        let message = new Object();
        message.MTYPE = consts.SUCCESS;
        message.REQUESTID = requestID;
        message.TEXT = oBundle.getText("ASSIGN_COMPLETED", [requestID]);
        return message;

    } catch (error) {
        let errMEssage = "assignApprover:" + error.message + " REQUESTID: " + iRequestId;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

}

async function saveNove(iRequest, iRequestId, iNote, iCdsTx) {

    try {

        let note = new Object();
        let actualUser = iRequest.user.id;

        let queryMaxResult = await SELECT.one.from(Notes).columns(["max(ID) as maxId"])
            .where({ REQUEST_ID: iRequestId });

        let requestdb = await SELECT.one.from(Request).columns(["VERSION"])
            .where({ REQUEST_ID: iRequestId });

        let maxId = queryMaxResult.maxId + 10;

        let creator = "";
        let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
            .where({ MailDipendente: actualUser }));

        if (oInfoWDPosition === undefined) {
            creator = actualUser;
        } else {
            creator = oInfoWDPosition.FullName;
        }
        note.to_Request_REQUEST_ID = iRequestId;
        note.ID = maxId;
        note.VERSION = requestdb.VERSION;
        note.NOTE = iNote;
        note.CREATOR_FULLNAME = creator;
        let insertRequest = await INSERT.into(Notes).entries(note);
        //let insertRequestResponse = await iCdsTx.run(insertRequest);

        //return insertRequestResponse;
        return insertRequest

    } catch (error) {
        iRequest.error(450, error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }
}

async function updateReqApprovers(iRequest, iRequestId, iEmail, iStepFlow, iCdsTx) {

    try {
        let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
            .where({ MailDipendente: iEmail }));

        if (oInfoWDPosition === undefined) {
            let errMEssage = "ERROR mail address  " + iEmail + " not found on WorkDay";
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        let oldApprover = await SELECT.one.from(ApprovalFlow).
            where({
                to_Request_REQUEST_ID: iRequestId,
                STEP: iStepFlow
            });
        if (oInfoWDPosition === undefined) {
            let errMEssage = "ERROR ID REQUEST " + iRequestId + " Approval flow for step " + iStepFlow + " not found";
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        let respDelete = await DELETE.from(ApprovalFlow).
            where({
                to_Request_REQUEST_ID: iRequestId,
                STEP: iStepFlow
            });

        // let deleteResponse = await iCdsTx.run(respDelete);

        let approver = new Object();
        let approversEntries = new Array();
        approver.to_Request_REQUEST_ID = iRequestId;
        approver.STEP = iStepFlow;
        approver.SEQUENCE = 10
        approver.WDID = oInfoWDPosition.WorkdayEmployeeID; //PERNR
        approver.SAPUSER = oInfoWDPosition.UtenteSAP;
        approver.MAIL = oInfoWDPosition.MailDipendente; //USERID
        approver.FNAME = oInfoWDPosition.Nome;
        approver.LNAME = oInfoWDPosition.Cognome;
        approver.FULLNAME = oInfoWDPosition.FullName;
        approver.IDROLE = oldApprover.IDROLE;
        approver.DESCROLE = oldApprover.DESCROLE;
        approver.ISMANAGER = oInfoWDPosition.IsManager;
        approversEntries.push(approver);
        let insertRequest = await INSERT.into(ApprovalFlow).entries(approversEntries);
        // let insertRequestResponse = await iCdsTx.run(insertRequest);

        return insertRequest;
        //return insertRequestResponse;
    } catch (error) {
        iRequest.error(450, error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }
}

async function assignTaskto(iRequest, iRequestId, iWfInstaceID, iEmail) {
    LOG.info("Assegnazione Task" + iRequestId);

    let lReturn = new Object();
    let tryCounter = 0;
    let maxattempts = 0;

    try {

        responseTaskInstance = await UserTaskInstancesApi.updateV1TaskInstancesByTaskInstanceId(
            iWfInstaceID,
            { "recipientUsers": iEmail }
        ).execute({
            destinationName: consts.API_WF_DESTINATION
        });

        return responseTaskInstance;
    } catch (error) {
        let errMEssage = "error:" + error.message + " REQUESTID: " + iRequestId;
        lReturn
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }


}

async function emailStartedProcess(iRequestId, iRequest) {

    let recipient = [];
    let reqData;
    let oBundle;
    let startedFullName = "";
    try {

        oBundle = getTextBundle(iRequest);
        //recupero request data
        reqData = await getRequestData(iRequestId, iRequest)
        if (reqData.errors) {
            return reqData;
        }

        //recupero l'approvatore della versione
        let approval = await SELECT.one.from(ApprovalHistory).
            where({
                REQUEST_ID: iRequestId,
                VERSION: reqData.VERSION,
                To_StepStatus_STEP_STATUS: consts.stepStatus.COMPLETED
            });

        if (approval !== null) {
            startedFullName = approval.REAL_FULLNAME;
        }

        let returnGetApprovers = await getNextApprovers(iRequestId, 0, iRequest);
        if (returnGetApprovers.errors) {
            return returnGetApprovers;
        }

        returnGetApprovers.approvalFlow.forEach(element => {
            if (element.MAIL !== null) {
                recipient.push(element.MAIL);
            }
        });

        recipient = _.uniq(recipient);

        /*
        let retMailstart = await mailStartedCompleted(iRequestId, reqData, recipient, startedFullName, iRequest)
        if (retMailstart.errors) {
            return retMailstart;
        }
            */

    } catch (error) {
        let errMEssage = "ERROR emailStartProcess " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}


async function emailCompletedProcess(iRequestId, iRequest) {

    let recipient = [];
    let ccrecipient = [];
    let aAttach = [];
    let reqData;
    let oBundle;

    try {

        oBundle = getTextBundle(iRequest);

        reqData = await getRequestData(iRequestId, iRequest)
        if (reqData.errors) {
            return reqData;
        }

        let approval = await SELECT.from(ApprovalHistory).
            where({
                REQUEST_ID: iRequestId,
                VERSION: reqData.VERSION
            });

        /*
              approval.forEach(element => {
                  if (element.REAL_MAIL !== null) {
                      recipient.push(element.REAL_MAIL);
                  }
              });
      
            
              let returnGetApprovers = await getNextApprovers(iRequestId, 0, iRequest);
              if (returnGetApprovers.errors) {
                  return returnGetApprovers;
              }
              returnGetApprovers.approvalFlow.forEach(element => {
                  if (element.MAIL !== null) {
                      recipient.push(element.MAIL);
                  }
              });
      
              */

        if (reqData.EMAILADDRESS !== null) {
            recipient.push(reqData.EMAILADDRESS);
        }

        if (reqData.EMAILADDRESSCC !== null) {
            ccrecipient = reqData.EMAILADDRESSCC.split(/\s*[\s,;]\s*/);
        }

 

        let columns = ["CONTENT", "MEDIATYPE", "ATTACHMENTTYPE_ATTACHMENTTYPE", "FILENAME"]
        let attachementsRs = await SELECT.columns(columns).from(Attachments).
            where({
                REQUEST_ID: iRequestId
            });
        for (let index = 0; index < attachementsRs.length; index++) {
            const attachement = attachementsRs[index];
            let addAttach = false;
            // switch (attachement.ATTACHMENTTYPE_ATTACHMENTTYPE) {
            //  case consts.attachmentTypes.O2PCOMP:
            addAttach = true;
            //     break;
            // }

            if (addAttach) {
                let oAttach = {};
                //conversione Readable to binary
                let binaryData = await convertToBinaryType(attachement.CONTENT);
                let sXmlBase64 = Buffer.from(binaryData, 'binary').toString('base64');
                oAttach.name = attachement.FILENAME;
                oAttach.contentType = attachement.MEDIATYPE;
                oAttach.contentBytes = sXmlBase64;
                aAttach.push(oAttach);
            }
        }

        let retMailProcedeleted = await mailProcessCompleted(iRequestId, reqData, recipient, aAttach, iRequest, ccrecipient)
        if (retMailProcedeleted.errors) {
            return retMailProcedeleted;
        }

    } catch (error) {
        let errMEssage = "ERROR emailTerminatedProcess " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}

function convertToBinaryType(iData) {
    return new Promise((resolve, reject) => {
        const stream = new PassThrough();
        const chunks = [];

        stream.on('data', function (chunk) {
            chunks.push(chunk)
        })
        stream.on('end', () => {
            resolve(Buffer.concat(chunks))
        })
        stream.on('error', (error) => {
            reject(error)
        })
        iData.pipe(stream)
    });
}

async function emailTerminatedProcess(iRequestId, iRequest) {

    let recipient = [];
    let rejector_full_name = "";
    let requestData;
    let actualUser;
    let note = "";

    try {
        actualUser = iRequest.user.id;//<----DA RIPRISTINARE
        //actualUser = "stsalvat@q8.it";//<----SOLO PER TEST DA BAS
        requestData = await getRequestData(iRequestId, iRequest)
        if (requestData.errors) {
            return requestData;
        }

        /*
        let approval = await SELECT.from(ApprovalHistory).
            where({
                REQUEST_ID: iRequestId,
                STEP_STATUS: consts.stepStatus.COMPLETED
            });

        approval.forEach(element => {
            if (element.REAL_MAIL !== null) {
                recipient.push(element.REAL_MAIL);
            }
        }); 

        recipient = _.reject(recipient, actualUser);

        */

        //recipient.push(iRequest.)
 

        if (recipient.length <= 0) {
            return iRequest;
        }

        let noteElement = await SELECT.from(Notes).
            where({
                REQUEST_ID: iRequestId,
                VERSION: requestData.VERSION,
                createdBy: actualUser
            });
        if (noteElement.length > 0) {
            rejector_full_name = noteElement[0].CREATOR_FULLNAME
            note = noteElement[0].NOTE;
        }

        let retMailProcedeleted = await mailProcessDeleted(iRequestId, recipient, rejector_full_name, note, iRequest, requestData)
        if (retMailProcedeleted.errors) {
            return retMailProcedeleted;
        }

    } catch (error) {
        let errMEssage = "ERROR emailTerminatedProcess " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}


module.exports = {
    getRequestData,
    getStepParams,
    getStepList,
    getStepDescritpion,
    saveUserAction,
    approversControl,
    updateRequestVersion,
    sendTeamsNotification, 
    insertApprovalHistory,
    assignApprover,
    emailStartedProcess,
    emailCompletedProcess,
    emailTerminatedProcess,
    emailRejectedProcessTask,
    convertToBinaryType
}
