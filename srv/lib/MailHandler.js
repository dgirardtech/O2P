const LOG = cds.log('KupitO2PSrv');
const _ = require('underscore');
const consts = require("./Constants");
const { getNameMotivationAction } = require('./Handler');
const { transcodeDocumentToTree, getDocumentProp } = require('./ManageDocument')
const { getEnvParam, getTextBundle } = require('./Utils');
const { generateO2PF23Aut } = require('./HandlerPDF');



async function teamsTaskRejectNotification(iO2PRequest, iTaskUrl, iRecipients, iRequest) {

    let returnBodyNotification = await getBodyNotification(iRequest.REQUEST_ID, consts.notificationId.TASK_REJECTED, iRequest)
    if (returnBodyNotification.errors) {
        return returnBodyNotification;
    }




    let subject = returnBodyNotification.title.replaceAll(consts.mailPatterns.REQUESTID, iO2PRequest.REQUEST_ID);

    let content = returnBodyNotification.message.replaceAll(consts.mailPatterns.REQUESTID, iO2PRequest.REQUEST_ID);

    let oResultNameMotivation = await getNameMotivationAction(iRequest, iO2PRequest.REQUEST_ID, consts.UserAction.REJECTED, "")
    content = content.replaceAll(consts.mailPatterns.FULL_NAME, oResultNameMotivation.name);
    content = content.replaceAll(consts.mailPatterns.TASK_URL, iTaskUrl);


    let oBody = {
        "toRecipients": iRecipients,
        "title": subject,
        "message": content,
        "idapplication": consts.idProcessNotification
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
            //   To_StepStatus_STEP_STATUS: consts.stepStatus.COMPLETED
        });

    if (approvalH && Boolean(approvalH.REAL_FULLNAME)) {
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
        "idapplication": consts.idProcessNotification
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

    let subject = returnBodyMail.id_subject
    subject = subject.replaceAll(consts.mailPatterns.REQUESTID, iO2Pdata.REQUEST_ID);

    let content = returnBodyMail.id_object
    content = content.replaceAll(consts.mailPatterns.FULL_NAME, iFullName);
    content = content.replaceAll(consts.mailPatterns.FULL_NAME_COMPILER, iFullNameCompiler);
    content = content.replaceAll(consts.mailPatterns.NOTE, iNotes);






    let oBody = {
        "subject": subject,
        "content": content,
        "toRecipients": iRecipents,
        "ccRecipients": [],
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

        sendMailResponse = await MailHandler.send('POST', '/sendMail', iMailBody);

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



async function testMail(iRequest) {

    let oReturnSendMail = await sendAllMail(iRequest, '')

}


async function getMailId(iRequest) {

    //iRequest.data.ACTION === consts.bpaUserAction.START
    //iRequest.data.ACTION === consts.bpaUserAction.APPROVE
    //iRequest.data.ACTION === consts.bpaUserAction.REJECT
    //iRequest.data.ACTION === consts.bpaUserAction.TERMINATE

    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID })




    let mailId = ""


    if (iRequest.data.ACTION === consts.bpaUserAction.TERMINATE) {
        mailId = consts.mailId.REFUSE_REQUEST
    }


    if (iRequest.data.ACTION === consts.bpaUserAction.REJECT) {
        mailId = consts.mailId.MODIFY_REQUEST
    }

    if (!Boolean(mailId)) {

        let oDocProp = await getDocumentProp(iRequest.data.REQUEST_ID, consts.firstId, iRequest.data.STEPID)

        if (oDocProp.docType === consts.documentType.KA || oDocProp.docType === consts.documentType.KB) {
            mailId = consts.mailId.KA_KB_CREATED
        }

        if (oDocProp.docType === consts.documentType.KZ || oDocProp.docType === consts.documentType.KY) {

            let oDocument = await SELECT.one.from(Document).
                where({
                    to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                    CLEARING_NUMBER: { '!=': null }
                })

            if (oDocument) {
                mailId = consts.mailId.KZ_KY_CREATED
            }
        }
    }

    if (!Boolean(mailId)) {

        let oNextApprover = await SELECT.one.from(ApprovalFlow).
            where({
                to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                STEP: { '>': iRequest.data.STEPID }
            })
            .orderBy('STEP asc');

        if (Boolean(oNextApprover) && oNextApprover.STEP === '50') {

            if (oRequest.PRIORITY === true) {
                mailId = consts.mailId.PRIORITY
            }
 

        }
    }


    return mailId


}


async function getRecipient(iRequest, mailId) {

    let aRecipient = []

    let actualUser = iRequest.user.id;


    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID })


    let aApproval = await SELECT.from(ApprovalHistory).
        where({
            REQUEST_ID: oRequest.REQUEST_ID,
            VERSION: oRequest.VERSION
        }).orderBy('STEP asc');


    if (mailId === consts.mailId.REFUSE_REQUEST ||
        mailId === consts.mailId.MODIFY_REQUEST
    ) {

        for (let i = 0; i < aApproval.length; i++) {
            if (Boolean(aApproval[i].REAL_MAIL)) {
                aRecipient.push(aApproval[i].REAL_MAIL);
            }
        }

        aRecipient = _.reject(aRecipient, actualUser)

    }

    if (mailId === consts.mailId.KA_KB_CREATED ||
        mailId === consts.mailId.KZ_KY_CREATED ||
        mailId === consts.mailId.ONERIPV) {

        let paramName = ""

        if (mailId === consts.mailId.KA_KB_CREATED) {
            paramName = "KA_KB_MAIL"
        }

        if (mailId === consts.mailId.KZ_KY_CREATED) {
            paramName = "KZ_KY_MAIL"
        }

        if (mailId === consts.mailId.ONERIPV) {
            paramName = "ONERIPV_MAIL"
        }



        var aParam = await SELECT.from(Param).
            where({
                PARAMNAME: paramName
            });

        for (let i = 0; i < aParam.length; i++) {

            if (Boolean(aParam[i]) && Boolean(aParam[i].VAL_OUTPUT)) {
                aRecipient.push(aParam[i].VAL_OUTPUT);
            }
        }

    }


    if (mailId === consts.mailId.PRIORITY) {

        let oApprovalInitiator = await SELECT.one.from(ApprovalHistory).
            where({
                REQUEST_ID: iRequest.data.REQUEST_ID,
                VERSION: oRequest.VERSION,
                To_Action_ACTION: 'STARTED'
            });

        if (oApprovalInitiator) {
            aRecipient.push(oApprovalInitiator.REAL_MAIL)
        }

    }


    if (aRecipient.length <= 0) {
        let errMEssage = "ERROR getRecipient: " + " Request" + iRequest.data.REQUEST_ID + " :" + "Mail address not found";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;

    }


    return aRecipient

 
}

async function getSubjectContentfromBody(iRequest, iBodyMail) {

    const oBundle = getTextBundle(iRequest);


    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID })

    let oRequester = await SELECT.one.from(Requester).
        where({ CODE: oRequest.REQUESTER_CODE });

    let oPayMode = await SELECT.one.from(Paymode).
        where({ CODE: oRequest.PAYMENT_MODE_CODE });

    let aDocument = await SELECT.from(Document).
        where({ to_Request_REQUEST_ID: iRequest.data.REQUEST_ID }).orderBy('DOC_ID asc', 'ID asc');

    let oTree = await transcodeDocumentToTree(iRequest.data.REQUEST_ID, aDocument)


    let subject = iBodyMail.id_subject
    subject = subject.replaceAll(consts.mailPatterns.REQUEST_ID, iRequest.data.REQUEST_ID);



    let content = iBodyMail.id_object
    content = content.replaceAll(consts.mailPatterns.REQUEST_ID, iRequest.data.REQUEST_ID);
    content = content.replaceAll(consts.mailPatterns.REQUESTER, oRequester.REQUESTER_NAME);

    if (oPayMode) {
        content = content.replaceAll(consts.mailPatterns.PAYMENT_MODE, oPayMode.PAYMENT_NAME);
    }


    let oResultNameMotivation = await getNameMotivationAction(iRequest, iRequest.data.REQUEST_ID, consts.UserAction.REJECTED, oRequest.VERSION)
    content = content.replaceAll(consts.mailPatterns.MOD_USER, oResultNameMotivation.name);
    content = content.replaceAll(consts.mailPatterns.MOD_MOTIVATION, oResultNameMotivation.motivation);


    oResultNameMotivation = await getNameMotivationAction(iRequest, iRequest.data.REQUEST_ID, consts.UserAction.TERMINATED, oRequest.VERSION)
    content = content.replaceAll(consts.mailPatterns.REF_USER, oResultNameMotivation.name);
    content = content.replaceAll(consts.mailPatterns.REF_MOTIVATION, oResultNameMotivation.motivation);


    content = content.replaceAll(consts.mailPatterns.N_DOC, oTree.HEADER.length);

    if (Boolean(oRequest.PRIORITY)) {
        content = content.replaceAll(consts.mailPatterns.PRIORITY_TEXT, oBundle.getText("PRIORITY_YES_TEXT"))
    }
    else {
        content = content.replaceAll(consts.mailPatterns.PRIORITY_TEXT, oBundle.getText("PRIORITY_NO_TEXT"))
    }

    return { subject: subject, content: content }


}


async function sendAllMail(iRequest, iMailId) {

    let aAttach = []

/*
    if (Boolean(iAddAttach)) {


        let o2pDocument = await generateO2PF23Aut(iRequest, false)

        aAttach = [{
            name: "Document.pdf",
            contentType: o2pDocument.type,
            contentBytes: o2pDocument.binary
        }]

    }
        */

    /////////////////////////////////////////////////////////////////////

    let mailId = ''
    if (Boolean(iMailId)) {
        mailId = iMailId
    } else {
        mailId = await getMailId(iRequest)
    }


    if (Boolean(mailId)) {

        let aRecipient = await getRecipient(iRequest, mailId)
        if (aRecipient.errors) {
            return aRecipient;
        }

        let oBodyMail = await getBodyMail(iRequest.data.REQUEST_ID, mailId, iRequest)
        if (oBodyMail.errors) {
            return oBodyMail;
        }


        let mailText = await getSubjectContentfromBody(iRequest, oBodyMail)


        let oBody = {
            "subject": mailText.subject,
            "content": mailText.content,
            "toRecipients": aRecipient,
            "ccRecipients": [],
            "aAttachment": aAttach,
        };

        let oSendMail = await sendMail(iRequest.data.REQUEST_ID, mailId, oBody, iRequest);
        if (oSendMail.errors) {
            return oSendMail;
        }

    }



}


module.exports = {
    mailMissingApprovers,
    mailProcessDeleted,
    mailProcessCompleted,
    mailTaskRejected,
    teamsTaskNotification,
    teamsTaskRejectNotification,
    testMail,
    sendAllMail
}