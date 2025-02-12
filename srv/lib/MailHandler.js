const LOG = cds.log('KupitO2PSrv');
const _ = require('underscore');
const consts = require("./Constants");
const { transcodeDocumentToTree, getDocumentProp } = require('./DocumentHandler')
const { getEnvParam, getTextBundle, getNameMotivationAction } = require('./Utils');
const { generateO2PF23Aut } = require('./HandlerPDF');
const { PassThrough } = require("stream");
const axios = require('axios')





async function getBodyNotification(iRequestId, iNotification) {

    let oResult = { bodyNotification: '', error: '' }
    let getResponse

    try {

        let request = "/Teams?$filter=idapplication eq '" + consts.idProcessNotification + "' and idteams eq '" + iNotification + "'";

        getResponse = await MailHandler.send('GET', request);

        oResult.bodyNotification = getResponse.d.results[0]
     


    } catch (error) {

        let errorText = "ERROR getBodyNotification ID: " + iNotification + " Request" + iRequestId + " :" + error.message;
        oResult.error = errorText
        LOG.error(errorText);
        return oResult

    }

    if (getResponse.d.results[0] === undefined) {

        let errorText = "ERROR getBodyNotification ID: " + iNotification + " Request" + iRequestId + " :" + "Body Notification not found"
        oResult.error = errorText
        LOG.error(errorText);
        return oResult

    }

    return oResult



}


async function getBodyMail(iParamForMail) {

    let oResult = { bodyMail: '', error: '' }
    let getResponse

    try {

        let request = "/Mail?$filter=idapplication eq '" + consts.idProcessMail +
            "' and idmail eq '" + iParamForMail.mailId + "'";

        getResponse = await MailHandler.send('GET', request);

    } catch (error) {

        oResult.error = 'ERROR getBodyMail: ' + error.message
        return oResult

    }

    if (getResponse.d.results[0] === undefined) {

        oResult.error = 'ERROR getBodyMail: ' + "Body mail not found"
        return oResult

    }

    oResult.bodyMail = getResponse.d.results[0]
    return oResult
}

async function sendTeamsNotification(iRequestId, iIdNotification, iNotificationBody) {

    let oResult = { error: '' }

    let oSendMailResponse;

    try {

        let sendFakeMail = getEnvParam("SEND_FAKE_MAIL", false);
        if (sendFakeMail) {
            iNotificationBody = getTeamsFakeBody(iNotificationBody);
        }

        oSendMailResponse = await MailHandler.send('POST', '/sendTeams', iNotificationBody);
        return oResult

    } catch (error) {

        let errorText = "ERROR sendTeamsNotification ID: " + iIdNotification + " Request" + iRequestId + " :" + error.message;

        LOG.error(errorText);
        oResult.error = errorText
        return oResult
    }



}



async function sendMailNew(iRequest, iParamForMail, iMailBody) {

    let oResult = { error: '' }

    let sendMailResponse

    try {

        let sendFakeMail = getEnvParam("SEND_FAKE_MAIL", false)
        if (sendFakeMail) {
            iMailBody = getFakeBody(iMailBody)
        }

        sendMailResponse = await MailHandler.send('POST', '/sendMail', iMailBody)

        return oResult

    } catch (error) {
        oResult.error = 'ERROR sendMail ID: ' + error.message
        return oResult

    }

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

    let oResponseSendAllMail = await sendAllMail(iRequest, iRequest.data.REQUEST_ID,
        iRequest.data.DOC_ID, iRequest.data.EVENT, false)

}





async function getRecipient(iRequest, iParamForMail) {

    let oRecipient = { to: [], cc: [], error: '' }


    try {

        let oRequest = await SELECT.one.from(Request).
            where({ REQUEST_ID: iParamForMail.requestId })


        let aApproval = await SELECT.from(ApprovalHistory).
            where({
                REQUEST_ID: oRequest.REQUEST_ID,
                VERSION: oRequest.VERSION
            }).orderBy('STEP asc');


        if (iParamForMail.mailId === consts.mailId.REFUSE_REQUEST ||
            iParamForMail.mailId === consts.mailId.MODIFY_REQUEST
        ) {

            for (let i = 0; i < aApproval.length; i++) {
                if (Boolean(aApproval[i].REAL_MAIL)) {
                    oRecipient.to.push(aApproval[i].REAL_MAIL);
                }
            }

            oRecipient.to = _.reject(oRecipient.to, iParamForMail.actualUser)

        }

        if (iParamForMail.mailId === consts.mailId.KA_KB_CREATED ||
            iParamForMail.mailId === consts.mailId.KZ_KY_CREATED ||
            iParamForMail.mailId === consts.mailId.ONERIPV) {

            let paramName = ""

            if (iParamForMail.mailId === consts.mailId.KA_KB_CREATED) {
                paramName = "KA_KB_MAIL"
            }

            if (iParamForMail.mailId === consts.mailId.KZ_KY_CREATED) {
                paramName = "KZ_KY_MAIL"
            }

            if (iParamForMail.mailId === consts.mailId.ONERIPV) {
                paramName = "ONERIPV_MAIL"
            }



            var aParam = await SELECT.from(Param).
                where({
                    PARAMNAME: paramName
                });

            for (let i = 0; i < aParam.length; i++) {

                if (Boolean(aParam[i]) && Boolean(aParam[i].VAL_OUTPUT)) {
                    oRecipient.to.push(aParam[i].VAL_OUTPUT);
                }
            }

        }


        if (iParamForMail.mailId === consts.mailId.PRIORITY) {

            let oApprovalInitiator = await SELECT.one.from(ApprovalHistory).
                where({
                    REQUEST_ID: oRequest.REQUEST_ID,
                    VERSION: oRequest.VERSION,
                    To_Action_ACTION: 'STARTED'
                });

            if (oApprovalInitiator) {
                oRecipient.to.push(oApprovalInitiator.REAL_MAIL)
            }

        }

        if (iParamForMail.mailId === consts.mailId.MISSING_APPROVERS) {

            let sapLocalSupport = getEnvParam("SAP_LOCAL_SUPPORT", false);
            let aSapLocalSupport = sapLocalSupport.split(',');

            for (let i = 0; i < aSapLocalSupport.length; i++) {
                oRecipient.to.push(aSapLocalSupport[i])
            }

        }


        if (iParamForMail.mailId === consts.mailId.COUNTING) {


            let oRequest = await SELECT.one.from(Request).where({
                REQUEST_ID: iParamForMail.requestId
            });


            oRecipient.to.push('davide.girard@avvale.com');
            oRecipient.cc.push('davide.girard@avvale.com');

            if (Boolean(iParamForMail.countingRecAdd)) {
                let aRecAdd = iParamForMail.countingRecAdd.split(';');

                for (let i = 0; i < aRecAdd.length; i++) {
                    oRecipient.to.push(aRecAdd[i])
                }
            }

            if (Boolean(iParamForMail.countingRecRole)) {



                let aApprovalFlow = await SELECT.from(ApprovalFlow).columns(['STEP', 'IDROLE'])
                    .where({
                        REQUEST_ID: iParamForMail.requestId
                    }).orderBy('STEP asc')

                let aApprovalH = await SELECT.from(ApprovalHistory).columns(['STEP', 'REAL_MAIL'])
                    .where({
                        REQUEST_ID: iParamForMail.requestId,
                        VERSION: oRequest.VERSION
                    }).orderBy('STEP asc')


                let aRecRole = iParamForMail.countingRecRole.split(';');
                for (let i = 0; i < aRecRole.length; i++) {


                    let oApprovalFlow = aApprovalFlow.find(oApprovalFlow => oApprovalFlow.IDROLE === Number(aRecRole[i]))

                    if (oApprovalFlow) {

                        let oApprovalH = aApprovalH.find(oApprovalH => oApprovalH.STEP === Number(oApprovalFlow.STEP))
                        if (oApprovalH && Boolean(oApprovalH.REAL_MAIL)) {
                            oRecipient.to.push(oApprovalH.REAL_MAIL)
                        }

                    }
                }
            }

            if (Boolean(oRequest.ADDITIONAL_CRO_MAIL_RECIPIENTS)) {
                let aRecCC = oRequest.ADDITIONAL_CRO_MAIL_RECIPIENTS.split(';');

                for (let i = 0; i < aRecCC.length; i++) {
                    oRecipient.cc.push(aRecCC[i])
                }
            }


        }


        if (oRecipient.to.length <= 0) {
            oRecipient.error = "ERROR getRecipient: " + "Mail address not found"
            return oRecipient

        }


        oRecipient.to = _.uniq(oRecipient.to, false)
        oRecipient.cc = _.uniq(oRecipient.cc, false)

        return oRecipient

    } catch (error) {

        oResult.error = 'ERROR getRecipient: ' + error.message
        return oResult

    }

}

async function getSubjectContentfromBody(iRequest, iParamForMail, iBodyMail) {

    let oResult = { subject: '', content: '', error: '' }

    const oBundle = getTextBundle(iRequest);

    try {
        let oRequest = await SELECT.one.from(Request).
            where({ REQUEST_ID: iParamForMail.requestId })

        let oRequester = await SELECT.one.from(Requester).
            where({ CODE: oRequest.REQUESTER_CODE });

        let oPayMode = await SELECT.one.from(Paymode).
            where({ CODE: oRequest.PAYMENT_MODE_CODE });

        let aDocument = await SELECT.from(Document).
            where({ to_Request_REQUEST_ID: iParamForMail.requestId }).orderBy('DOC_ID asc', 'ID asc');

        let oTree = await transcodeDocumentToTree(iParamForMail.requestId, aDocument)


        let subject = iBodyMail.id_subject
        subject = subject.replaceAll(consts.mailPatterns.REQUEST_ID, iParamForMail.requestId);
        subject = subject.replaceAll(consts.mailPatterns.DOC_ID, iParamForMail.docId);




        let content = iBodyMail.id_object
        content = content.replaceAll(consts.mailPatterns.REQUEST_ID, iParamForMail.requestId);
        content = content.replaceAll(consts.mailPatterns.REQUESTER, oRequester.REQUESTER_NAME);

        if (oPayMode) {
            content = content.replaceAll(consts.mailPatterns.PAYMENT_MODE, oPayMode.PAYMENT_NAME);
        }


        let oResultNameMotivation = await getNameMotivationAction(iParamForMail.requestId, consts.UserAction.REJECTED, oRequest.VERSION)
        content = content.replaceAll(consts.mailPatterns.MOD_USER, oResultNameMotivation.name);
        content = content.replaceAll(consts.mailPatterns.MOD_MOTIVATION, oResultNameMotivation.motivation);


        oResultNameMotivation = await getNameMotivationAction(iParamForMail.requestId, consts.UserAction.TERMINATED, oRequest.VERSION)
        content = content.replaceAll(consts.mailPatterns.REF_USER, oResultNameMotivation.name);
        content = content.replaceAll(consts.mailPatterns.REF_MOTIVATION, oResultNameMotivation.motivation);


        content = content.replaceAll(consts.mailPatterns.N_DOC, oTree.HEADER.length);

        if (Boolean(oRequest.PRIORITY)) {
            content = content.replaceAll(consts.mailPatterns.PRIORITY_TEXT, oBundle.getText("PRIORITY_YES_TEXT"))
        }
        else {
            content = content.replaceAll(consts.mailPatterns.PRIORITY_TEXT, oBundle.getText("PRIORITY_NO_TEXT"))
        }

        if (Boolean(iParamForMail.docId)) {

            let oDocHeader = oTree.HEADER.find(oDocHeader => oDocHeader.DOC_ID === iParamForMail.docId)

            // let oDocDetail = await getDocumentDetail(iParamForMail.requestId, iParamForMail.docId) 

            let address = oDocHeader.VENDOR_DESC + ' ( ' + oDocHeader.VENDOR + ' )'
            content = content.replaceAll(consts.mailPatterns.ADDRESS, address)

            if (Boolean(oDocHeader.LOCATION)) {
                content = content.replaceAll(consts.mailPatterns.PV, oDocHeader.LOCATION)
            } else {
                content = content.replaceAll(consts.mailPatterns.PV, '')
            }

            content = content.replaceAll(consts.mailPatterns.REASON, oDocHeader.REASON)
            content = content.replaceAll(consts.mailPatterns.CRO, oDocHeader.CRO)

            let oCurrency = await SELECT.one.from(Currency).where({ code: oRequest.WAERS_CODE });

            let totAmount = oDocHeader.TOT_AMOUNT + ' ' + oCurrency.DESCRIPTION
            content = content.replaceAll(consts.mailPatterns.TOT_AMOUNT, totAmount)

        }


        oResult.subject = subject
        oResult.content = content

        return oResult


    } catch (error) {

        oResult.error = 'ERROR getBodyMail: ' + error.message
        return oResult

    }

}

async function getParamForMail(iRequest, iRequestId, iDocId, iRequestPath) {

    let mailId = ""

    if (iRequestPath === 'saveUserAction') {

        let oRequest = await SELECT.one.from(Request).
            where({ REQUEST_ID: iRequestId })


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

    }



    if (iRequestPath === 'CountingSend') {
        mailId = consts.mailId.COUNTING
    }


    if (iRequestPath === 'MissingApprover') {
        mailId = consts.mailId.MISSING_APPROVERS
    }


    let oResult = {
        requestId: iRequestId,
        docId: iDocId,
        mailId: mailId,
        action: iRequest.data.ACTION,
        stepId: iRequest.data.STEPID,
        actualUser: iRequest.user.id,
        requestPath: iRequestPath,
        countingRecRole: iRequest.RECIPIENT_ROLE,
        countingRecAdd: iRequest.RECIPIENT_ADD

    }

    return oResult

}



async function getAttachment(iRequest, iParamForMail) {

    let oResult = { attach: [], error: '' }


    try {

        if (iParamForMail.requestPath === 'CountingSend') {

            let oAttachment = await SELECT.one.from(Attachments).where({
                REQUEST_ID: iParamForMail.requestId,
                //DOC_ID: iParamForMail.docId,
                ATTACHMENTTYPE_ATTACHMENTTYPE: consts.attachmentTypes.COUNTING
            });


            let authorization = iRequest.headers.authorization;
            let url = 'http://' + iRequest.headers.host + oAttachment.URL
            //'/odata/v2/kupito2pmodel-srv/Attachments(REQUEST_ID=1000000218,ID=20)/CONTENT'


            var content = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: {
                    "content-type": "application/json",
                    "Authorization": authorization
                }
            })
                .then(response => Buffer.from(response.data, 'binary').toString('base64'));



            oResult.attach.push({
                name: oAttachment.FILENAME,
                contentType: oAttachment.MEDIATYPE,
                contentBytes: content,
            })


        }

    } catch (error) {

        oResult.error = 'ERROR getAttachment: ' + error.message
        return oResult

    }

    return oResult


}

async function sendAllNotification(iNotification, iRequestId, iRecipients, iTaskUrl) {

    let oResult = { error: '' }

    try {

    let sendMail = getEnvParam("SEND_MAIL", false);
    if (sendMail === "true") {


        let oRequest = await SELECT.one.from(Request).
            where({ REQUEST_ID: iRequestId })


        let oBodyNotification = await getBodyNotification(iRequestId, iNotification)
        if (oBodyNotification.error) {
            oResult.error = oBodyNotification.error
            return oResult
        }



        let subject = oBodyNotification.bodyNotification.title
        subject = subject.replaceAll(consts.mailPatterns.REQUEST_ID, iRequestId);


        let content = oBodyNotification.bodyNotification.message
        content = content.replaceAll(consts.mailPatterns.REQUEST_ID, iRequestId);

        let fullNameCompiler = "";
        let approvalH = await SELECT.one.from(ApprovalHistory).
            where({
                REQUEST_ID: iRequestId,
                VERSION: oRequest.VERSION,
                STEP: 10
            });

        if (approvalH && Boolean(approvalH.REAL_FULLNAME)) {
            fullNameCompiler = approvalH.REAL_FULLNAME;
        }

        content = content.replaceAll(consts.mailPatterns.FULL_NAME_COMPILER, fullNameCompiler);


        let oResultNameMotivation = await getNameMotivationAction(iRequestId, consts.UserAction.REJECTED, "")
        content = content.replaceAll(consts.mailPatterns.FULL_NAME, oResultNameMotivation.name);


        content = content.replaceAll(consts.mailPatterns.TASK_URL, iTaskUrl);


        let oBody = {
            "toRecipients": iRecipients,
            "title": subject,
            "message": content,
            "idapplication": consts.idProcessNotification
        };

        let oSendTeamsNotification = await sendTeamsNotification(iRequestId, iNotification, oBody);
        if (oSendTeamsNotification.error) {
            oResult.error = oSendTeamsNotification.error
        }

    }

    return oResult

} catch (error) {

    let errorText = "ERROR sendTeamsNotificationAfterUpdateTaskId ID: " + consts.notificationId.TASK_READY + 
    " Step " + iUpdateTaskId.stepId + 
    " Request " + iUpdateTaskId.requestId + " :" + error.message;

    LOG.error(errorText);
    oResult.error = errorText
    return oResult


}
}

async function sendAllMail(iRequest, iRequestId, iDocId, iPath) {

    let oResult = { error: '' }

    try {

        let sendMail = getEnvParam("SEND_MAIL", false);
        if (sendMail === "true") {

            let oGetParamForMail = await getParamForMail(iRequest, iRequestId, iDocId, iPath)


            if (Boolean(oGetParamForMail.mailId)) {

                let oRecipient = await getRecipient(iRequest, oGetParamForMail)
                if (oRecipient.error) {
                    oResult.error = oRecipient.error
                    return oResult
                }

                let oBodyMail = await getBodyMail(oGetParamForMail)
                if (oBodyMail.error) {
                    oResult.error = oBodyMail.error
                    return oResult
                }


                let oMailText = await getSubjectContentfromBody(iRequest, oGetParamForMail, oBodyMail.bodyMail)
                if (oMailText.error) {
                    oResult.error = oMailText.error
                    return oResult
                }

                let oAttach = await getAttachment(iRequest, oGetParamForMail)
                if (oAttach.error) {
                    oResult.error = oAttach.error
                    return oResult
                }

                let oMail = {
                    "subject": oMailText.subject,
                    "content": oMailText.content,
                    "toRecipients": oRecipient.to,
                    "ccRecipients": oRecipient.cc,
                    "aAttachment": oAttach.attach
                }

                let oSendMail = await sendMailNew(iRequest, oGetParamForMail, oMail)
                if (oSendMail.error) {
                    oResult.error = oSendMail.error
                    return oResult
                }

            }

        }

        return oResult

    } catch (error) {
        let errMEssage = "ERROR sendAllMail " + iRequestId + " :" + error.message;
        oResult.error = errMEssage
        LOG.error(errMEssage);
        return oResult;
    }

}




module.exports = {
    testMail,
    sendAllMail,
    sendAllNotification,
    sendMailNew
}