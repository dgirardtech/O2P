const LOG = cds.log('KupitO2PSrv');
const client = require('@sap-cloud-sdk/http-client');
const connectivity = require('@sap-cloud-sdk/connectivity');
const _ = require('underscore');
const consts = require("./Constants");
const { getRejectorName } = require('./Handler');
const { getEnvParam, getTextBundle } = require('./Utils');
const moment = require('moment');




async function teamsTaskRejectNotification(iO2PRequest, iTaskUrl, iRecipients, iRequest) {

    let returnBodyNotification = await getBodyNotification(iRequest.REQUEST_ID, consts.notificationId.TASK_REJECTED, iRequest)
    if (returnBodyNotification.errors) {
        return returnBodyNotification;
    }

    let rejectorName = await getRejectorName(iRequest, iO2PRequest);

    let subject = returnBodyNotification.title.replaceAll(consts.mailPatterns.REQUESTID, iO2PRequest.REQUEST_ID);

    let content = returnBodyNotification.message.replaceAll(consts.mailPatterns.REQUESTID, iO2PRequest.REQUEST_ID);
    content = content.replaceAll(consts.mailPatterns.FULL_NAME, rejectorName.rejectorName);
    content = content.replaceAll(consts.mailPatterns.TASK_URL, iTaskUrl);


    let oBody = {
        "toRecipients": iRecipients,
        "title": subject,
        "message": content,
        "idapplication":  consts.idProcessNotification
    };

    let returnSendTeamsNotification = await sendTeamsNotification(iO2PRequest.REQUEST_ID, consts.notificationId.TASK_READY, oBody, iRequest);
    if (returnSendTeamsNotification.errors) {
        return returnSendTeamsNotification;
    }
    return iRequest;
}


async function teamsTaskNotification(iO2PRequest, iTaskUrl, iRecipients, iRequest) {

 
    let returnBodyNotification = await getBodyNotification(iO2PRequest.REQUEST_ID, consts.notificationId.TASK_READY, iRequest)
    if (returnBodyNotification.errors) {
        return returnBodyNotification;
    }
        

  

    let fullNameCompiler = "";
    let approvalH = await SELECT.one.from(ApprovalHistory).
        where({
            REQUEST_ID: iO2PRequest.REQUEST_ID,
            VERSION: iO2PRequest.VERSION,
            STEP: 10,
            To_StepStatus_STEP_STATUS: consts.stepStatus.COMPLETED
        });

    if (approvalH.REAL_FULLNAME !== null) {
        fullNameCompiler = approvalH.REAL_FULLNAME;
    }

    let subject = returnBodyNotification.title.replaceAll(consts.mailPatterns.REQUESTID, iO2PRequest.REQUEST_ID);

    let content = returnBodyNotification.message.replaceAll(consts.mailPatterns.REQUESTID, iO2PRequest.REQUEST_ID);

    content = content.replaceAll(consts.mailPatterns.FULL_NAME_COMPILER, fullNameCompiler);
    content = content.replaceAll(consts.mailPatterns.TASK_URL, iTaskUrl);


    let oBody = {
        "toRecipients": iRecipients,
        "title": subject,
        "message": content,
        "idapplication":  consts.idProcessNotification
    };

    let returnSendTeamsNotification = await sendTeamsNotification(iRequest.REQUEST_ID, consts.notificationId.TASK_READY, oBody, iRequest);
    if (returnSendTeamsNotification.errors) {
        return returnSendTeamsNotification;
    }
    return iRequest;
}

async function mailProcessCompleted(iRequestId, iO2Prequest, iRecipents, iAattach, iRequest, iCCRecipents) {

    let returnBodyMail

 

        returnBodyMail = await getBodyMail(iRequestId, consts.mailId.PROCESS_COMPLETED, iRequest)
        if (returnBodyMail.errors) {
            return returnBodyMail;
        }

 
 

    var date = new Date()
    //var month = date.toLocaleString('default', { month: 'long' });
    var month = date.getMonth() + 1
    var monthStr = month.toString()
    if (monthStr.length < 2) {
        monthStr = "0" + monthStr
    }

    var day = date.getDate()
    var dayStr = day.toString()
    if (dayStr.length < 2) {
        dayStr = "0" + dayStr
    }

    var year = date.getFullYear()

    var dateString = [dayStr, monthStr, year].join('/');
    content = content.replaceAll(consts.mailPatterns.DATA, dateString);
 
 
  

    let fullNameCompiler = ""
    let approvalH = await SELECT.one.from(ApprovalHistory).
        where({
            REQUEST_ID: iRequestId,
            STEP: 10,
            To_StepStatus_STEP_STATUS: consts.stepStatus.COMPLETED
        });

    if (approvalH.REAL_FULLNAME !== null) {
        fullNameCompiler = approvalH.REAL_FULLNAME;
    }

 
    content = content.replaceAll(consts.mailPatterns.FULL_NAME_COMPILER, fullNameCompiler)
 

    let oBody = {
        "subject": subject,
        "content": content,
        "toRecipients": iRecipents,
        "ccRecipients": iCCRecipents,
        "aAttachment": iAattach,
    };

    let returnSendMail = await sendMail(iRequestId, consts.mailId, oBody, iRequest);
    if (returnSendMail.errors) {
        return returnSendMail;
    }

    return iRequest;
}



async function mailTaskRejected(iRequestId, iO2Pdata, iRecipents, iFullName, iFullNameCompiler, iNotes, iRequest) {


    let returnBodyMail = await getBodyMail(iRequestId, consts.mailId.MODIFY_REQUEST, iRequest)
    if (returnBodyMail.errors) {
        return returnBodyMail;
    }

    let subject = returnBodyMail.id_subject.replaceAll(consts.mailPatterns.REQUESTID, iO2Pdata.REQUEST_ID);

    let content = returnBodyMail.id_object.replaceAll(consts.mailPatterns.FULL_NAME, iFullName);
    content = content.replaceAll(consts.mailPatterns.FULL_NAME_COMPILER, iFullNameCompiler);
    content = content.replaceAll(consts.mailPatterns.NOTE, iNotes);



    let oBody = {
        "subject": subject,
        "content": content,
        "toRecipients": iRecipents,
        "ccRecipients": ["davide.girard@avvale.com", "carlotta.conte@avvale.com"],
        "aAttachment": [],
    };

    let returnSendMail = await sendMail(iRequestId, consts.mailId.MODIFY_REQUEST, oBody, iRequest);
    if (returnSendMail.errors) {
        return returnSendMail;
    }

    return iRequest;
}

async function mailProcessDeleted(iRequestId, iRecipents, iFullName, iNotes, iRequest, iRequestData) {

    /*
    let returnBodyMail = await getBodyMail(iRequestId, consts.mailId.PROCESS_DELETED, iRequest)
    if (returnBodyMail.errors) {
        return returnBodyMail;
    } */


    // let subject = returnBodyMail.id_subject.replaceAll(consts.mailPatterns.REQUESTID, iRequestData.REQUEST_ID);
    //let content = returnBodyMail.id_object.replaceAll(consts.mailPatterns.FULL_NAME, iFullName);
    // content = content.replaceAll(consts.mailPatterns.NOTE, iNotes);


    let subject = "prova"
    let content = "prova body"

    let oBody = {
        "subject": subject,
        "content": content,
        "toRecipients": iRecipents,
        "ccRecipients": [],
        "aAttachment": [],
    };

    let returnSendMail = await sendMail(iRequestId, consts.mailId.PROCESS_DELETED, oBody, iRequest);
    if (returnSendMail.errors) {
        return returnSendMail;
    }

    return iRequest;
}

async function mailMissingApprovers(iRequestData, iRequest) {

 
    let returnBodyMail = await getBodyMail(iRequestData.REQUEST_ID, consts.mailId.MISSING_APPROVERS, iRequest)
    if (returnBodyMail.errors) {
        return returnBodyMail;
    }

    let sapLocalSupport = getEnvParam("SAP_LOCAL_SUPPORT", false);
    let aSapLocalSupport = sapLocalSupport.split(',');
    let toRecipients = [];

    aSapLocalSupport.forEach((mail) => {
        toRecipients.push(mail);
    });


    //toRecipients.push('davide.girard@avvale.com');

    let subject = returnBodyMail.id_subject.replaceAll(consts.mailPatterns.REQUESTID, iRequestData.REQUEST_ID);

    let oBody = {
        "subject": subject,
        "content": returnBodyMail.id_object,
        "toRecipients": toRecipients,
        "ccRecipients": [],
        "aAttachment": [],
    };

    let returnSendMail = await sendMail(iRequestData.REQUEST_ID, idMail, oBody, iRequest);
    if (returnSendMail.errors) {
        return returnSendMail;
    }

    return iRequest;
}

async function getBodyNotification(iRequestId, iIdTeams, iRequest) {
    let getResponse

    try {

        let request = "/Teams?$filter=idapplication eq '" + consts.idProcessNotification + "' and idteams eq '" + iIdTeams + "'";

        getResponse = await MailHandler.send('GET', request);

    } catch (error) {
        let errMEssage = "ERROR getBodyNotification ID: " + iIdTeams + " Request" + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    if (getResponse.d.results[0] === undefined) {
        let errMEssage = "ERROR getBodyNotification ID: " + iIdTeams + " Request" + iRequestId + " :" + "Body Notification not found";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    return getResponse.d.results[0];
}

async function getBodyMail(iRequestId, iIdMail, iRequest) {
    let getResponse

    try {

        let request = "/Mail?$filter=idapplication eq '" + consts.idProcessMail + "' and idmail eq '" + iIdMail + "'";

        getResponse = await MailHandler.send('GET', request);

    } catch (error) {
        let errMEssage = "ERROR getBodyMail ID: " + iIdMail + " Request" + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    if (getResponse.d.results[0] === undefined) {
        let errMEssage = "ERROR getBodyMail ID: " + iIdMail + " Request" + iRequestId + " :" + "Body mail not found";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    return getResponse.d.results[0];
}

async function sendTeamsNotification(iRequestId, iIdNotification, iNotificationBody, iRequest) {
    let sendMailResponse;

    try {

        let sendFakeMail = getEnvParam("SEND_FAKE_MAIL", false);
        if (sendFakeMail) {
            iNotificationBody = getTeamsFakeBody(iNotificationBody);
        }

        sendMailResponse = await MailHandler.send('POST', '/sendTeams', iNotificationBody);

    } catch (error) {
        let errMEssage = "ERROR sendTeamsNotification ID: " + iIdNotification + " Request" + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    return iRequest;
}


async function sendMail(iRequestId, iIdMail, iMailBody, iRequest) {
    let sendMailResponse;

    try {

        let sendFakeMail = getEnvParam("SEND_FAKE_MAIL", false);
        if (sendFakeMail) {
            iMailBody = getFakeBody(iMailBody);
        }

       // sendMailResponse = await MailHandler.send('POST', '/sendMail', iMailBody);

        //// sendMailResponse = await MailHandler.send('POST', '/sendMail',  { contentType: "HTML", content: iMailBody } );


    } catch (error) {
        let errMEssage = "ERROR sendMail ID: " + iIdMail + " Request" + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    return iRequest;
}

function getTeamsFakeBody(iMailBody) {

    let fakeMail = getEnvParam("FAKE_MAIL", false);
    let aFakeMail = fakeMail.split(',');
    let fakeRecipients = [];

    aFakeMail.forEach((mail) => {
        fakeRecipients.push(mail);
    });

    iMailBody.toRecipients = fakeRecipients;

    return iMailBody;
}

function getFakeBody(iMailBody) {

    let fakeMail = getEnvParam("FAKE_MAIL", false);
    let aFakeMail = fakeMail.split(',');
    let fakeRecipients = [];

    aFakeMail.forEach((mail) => {
        fakeRecipients.push(mail);
    });

    iMailBody.toRecipients = fakeRecipients;
    iMailBody.ccRecipients = [];

    return iMailBody;
}

 


module.exports = {
    mailMissingApprovers,
    mailProcessDeleted,
    mailProcessCompleted, 
    mailTaskRejected,
    teamsTaskNotification,
    teamsTaskRejectNotification
}