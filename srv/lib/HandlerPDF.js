const LOG = cds.log('KupitO2PSrv');
const _ = require('underscore');
const convert = require('xml-js'); // https://www.npmjs.com/package/xml-js
const moment = require('moment');
const client = require('@sap-cloud-sdk/http-client');
const connectivity = require('@sap-cloud-sdk/connectivity');
const consts = require("./Constants");
const { getEnvParam, getTextBundle } = require('./Utils');
const { getRejectorName, getDocumentProp, getRejectInfo, getTerminatedInfo, transcodeDocumentToTree } = require('./Handler');



async function _getDestination() {
    let dest = await connectivity.getDestination({ destinationName: "Form_Services_Adobe" });
    return dest;
}

async function createPdf(jsonData, iId, iRequest, iXdpTemplate) {

    let pdfOutput;

    try {
        let sXml = convert.json2xml(jsonData, { compact: true, spaces: 4 });
        sXml = '<?xml version="1.0" encoding="UTF-8"?>' + sXml;

        let sXmlBase64 = Buffer.from(sXml, 'utf8').toString('base64');

        let oBody = {
            "xdpTemplate": iXdpTemplate,
            "xmlData": sXmlBase64,
            "formType": "print",
            "formLocale": "en_US",
            "taggedPdf": 1,
            "embedFont": 0,
            "changeNotAllowed": false,
            "printNotAllowed": false
        };

        pdfOutput = await client.executeHttpRequest(await _getDestination(), {
            url: "/v1/adsRender/pdf?templateSource=storageName&TraceLevel=2",
            method: 'POST',
            data: oBody
        });

    } catch (error) {
        let errMEssage = "ERROR createPdf " + iId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return pdfOutput.data.fileContent;
}


async function generateO2PDocument(iRequest, iSaveAttach) {

    const oBundle = getTextBundle(iRequest);

    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID })

    let requesterText = ''
    let oRequester = await SELECT.one.from(Requester).
        where({ CODE: oRequest.REQUESTER_CODE });
    if (oRequester) {
        requesterText = oRequester.REQUESTER_NAME
    }

    let paymentModeText = ''
    let oPayMode = await SELECT.one.from(Paymode).
        where({ CODE: oRequest.PAYMENT_MODE_CODE });
    if (oPayMode) {
        paymentModeText = oPayMode.PAYMENT_NAME
    }

    let areaText = ''
    let oOrgunitreq = await SELECT.one.from(Orgunitreq).
        where({ REQUESTER_CODE: oRequest.REQUESTER_CODE, ORGUNIT: oRequest.AREA_CODE });
    if (oOrgunitreq) {
        areaText = oOrgunitreq.NOTE
    }

    let bankText = ''
    let oBankreq = await SELECT.one.from(Bankreq).
        where({ REQUESTER_CODE: oRequest.REQUESTER_CODE, BANK_CODE: oRequest.BANK_ACCOUNT });
    if (!oBankreq) {
        let oBankreq = await SELECT.one.from(Bankreq).
            where({ REQUESTER_CODE: '*', BANK_CODE: oRequest.BANK_ACCOUNT });
    }

    if (oBankreq) {
        bankText = oBankreq.BANK_NAME
    }

    let priorityText = ''
    if (Boolean(oRequest.PRIORITY)) {
        priorityText = 'Si'
    }
    else {
        priorityText = 'No'
    }

    let startApprovalFlow = ''
    if (Boolean(oRequest.START_APPROVAL_FLOW)) {
        startApprovalFlow = oRequest.START_APPROVAL_FLOW
    } else {
        startApprovalFlow = moment(new Date).format('YYYYMMDD')
    }


    let oGsRequest = oRequest

    oGsRequest.PAYMENT_MODE = oRequest.PAYMENT_MODE_CODE
    oGsRequest.START_APPROVAL_FLOW = startApprovalFlow
    oGsRequest.WAERS = oRequest.WAERS_CODE
    oGsRequest.REQUESTER_TEXT = requesterText
    oGsRequest.AREA_TEXT = areaText
    oGsRequest.PAYMENT_MODE_TEXT = paymentModeText
    oGsRequest.BANK_TEXT = bankText
    oGsRequest.PRIORITY_TEXT = priorityText


    let aGtDocument = []

    let aDocument = await SELECT.from(Document).
        where({ to_Request_REQUEST_ID: iRequest.data.REQUEST_ID }).orderBy('DOC_ID asc', 'ID asc');

    let oTree = await transcodeDocumentToTree(iRequest.data.REQUEST_ID, aDocument)

    let aDocHeader = oTree.HEADER
    for (let i = 0; i < aDocHeader.length; i++) {

        // aGtDocument.push(aDocHeader[i])

        let aDocPos = aDocHeader[i].POSITION

        for (let x = 0; x < aDocPos.length; x++) {


            let costcenterIntorder = ''
            if (Boolean(aDocPos[x].INT_ORDER)) {
                costcenterIntorder = aDocPos[x].INT_ORDER
            }
            else {
                costcenterIntorder = aDocPos[x].COST_CENTER
            }

            aGtDocument.push({
                DOC_ID_TEXT: aDocHeader[i].DOC_ID,
                COSTCENTER_INTORDER: costcenterIntorder,
                VENDOR_IBAN_TEXT: aDocHeader[i].VENDOR_DESC,
                ACCOUNT_TEXT: aDocPos[x].ACCOUNT,
                REASON: aDocHeader[i].REASON,
                AMOUNT: aDocPos[x].AMOUNT
            })

        }

        aGtDocument.push({
            AMOUNT: aDocHeader[i].TOT_AMOUNT,
            TEXT: 'Totale documento'
        })

    }


    let aGtApprovers = []

    let aApproval = await SELECT.from(ApprovalHistory).
        where({
            REQUEST_ID: oRequest.REQUEST_ID,
            VERSION: oRequest.VERSION
        }).orderBy('STEP asc');

    let aApprovalFlow = await SELECT.from(ApprovalFlow).
        where({
            REQUEST_ID: oRequest.REQUEST_ID
        }).orderBy('STEP asc');




    for (let i = 0; i < aApproval.length; i++) {

        let oApprovalFlow = aApprovalFlow.find(oApprovalFlow => oApprovalFlow.STEP === Number(aApproval[i].STEP))


        aGtApprovers.push({
            REAL_NAME: aApproval[i].REAL_FULLNAME,
            APPROVATION_DATE: aApproval[i].EXECUTED_AT,
            ROLE_TEXT: oApprovalFlow.DESCROLE
        })
    }

    let oCreatePDF = {
        data: {
            GS_REQUEST: oGsRequest,
            GT_APPROVERS: {
                DATA: aGtApprovers
            },
            GT_DOCUMENTS: {
                DATA: aGtDocument
            }
        }
    }



    try {

        let sCreatePDF = JSON.stringify(oCreatePDF);

        jsonData = JSON.parse(sCreatePDF);

    } catch (error) {
        let errMEssage = "ERROR generateO2PDocument " + iRequest.data.REQUEST_ID + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }


    returnCreatePdf = await createPdf(jsonData, iRequest.data.REQUEST_ID, iRequest,
        'kupit_o2p_document/kupito2pdocument');

        
    if (Boolean(iSaveAttach)) {
        let oResponseSaveAttach = await saveAttach(returnCreatePdf, iRequest.data.REQUEST_ID, iRequest)
    }

    return { binary: returnCreatePdf, type: "application/pdf" }

    /*
if (returnCreatePdf.errors) {
return returnCreatePdf;
}
*/

}


async function saveAttach(iPdfContent, iRequestId, iRequest) {

    let fullName;
    let attach = {};
    let attachUpdate = new Array();

    let actualUser = iRequest.user.id;
    var fileSizeInBytes = iPdfContent.length;

    try {

        let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
            .where({ MailDipendente: actualUser }));
        if (oInfoWDPosition === undefined) {
            fullName = actualUser;
        } else {
            fullName = oInfoWDPosition.FullName;
        }

        attach.to_Request_REQUEST_ID = iRequestId;
        attach.ID = 1;
        attach.CONTENT = iPdfContent;
        attach.MEDIATYPE = "application/pdf";
        attach.FILENAME = "O2P_" + iRequestId + ".pdf";
        attach.SIZE = fileSizeInBytes
        attach.URL = "/odata/v2/kupito2pmodel-srv/Attachments(REQUEST_ID=" + iRequestId + ",ID=1)/CONTENT";
        // attach.ATTACHMENTTYPE_ATTACHMENTTYPE = consts.attachmentTypes.O2PCOMP;
        attach.CREATOR_FULLNAME = fullName;
        attach.createdAt = new Date();
        attach.createdBy = actualUser;

        attachUpdate.push(attach);

        const cdsTx = cds.tx(); //-> creo la transaction //gli allegati vengono committati per la gestione della mail
        let upsertAttch = UPSERT.into(Attachments).entries(attachUpdate);
        let upsertResponse = await cdsTx.run(upsertAttch);
        await cdsTx.commit();

    } catch (error) {
        let errMEssage = "ERROR saveAttach " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}


module.exports = {
    createPdf,
    generateO2PDocument,
    saveAttach
}