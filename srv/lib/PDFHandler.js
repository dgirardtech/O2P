const LOG = cds.log('KupitO2PSrv');
const _ = require('underscore');
const convert = require('xml-js'); // https://www.npmjs.com/package/xml-js
const moment = require('moment');
const { getTextBundle } = require('./Utils');
const { transcodeDocumentToTree } = require('./DocumentHandler')
const fs = require('fs')
const consts = require("./Constants");
const client = require('@sap-cloud-sdk/http-client');
const connectivity = require('@sap-cloud-sdk/connectivity');
const { saveFileonOT, updateFileonOT,deleteFileToOt,eventDeleteFileToOt } = require('./OTHandler');



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
        oBankreq = await SELECT.one.from(Bankreq).
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


        let vendorIbanText = ''
        if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.BONIFICO) {
            vendorIbanText = aDocHeader[i].VENDOR + ' - ' + aDocHeader[i].VENDOR_DESC + '\r\n' +
                '( ' + aDocHeader[i].IBAN + ' )'
        } else {
            vendorIbanText = aDocHeader[i].VENDOR + ' - ' + aDocHeader[i].VENDOR_DESC
        }



        let aDocPos = aDocHeader[i].POSITION

        for (let x = 0; x < aDocPos.length; x++) {


            let costcenterIntorder = ''
            if (Boolean(aDocPos[x].INT_ORDER)) {
                costcenterIntorder = aDocPos[x].INT_ORDER
            }
            else {
                costcenterIntorder = aDocPos[x].COST_CENTER
            }


            let accountText = ''
            let oAccountreq = await SELECT.one.from(Accountreq).
                where({
                    REQUESTER_CODE: oRequest.REQUESTER_CODE,
                    ACCOUNT: aDocPos[x].ACCOUNT
                });
            if (oAccountreq) {
                accountText = oAccountreq.ACCOUNT + ' ( ' + oAccountreq.ACCOUNT_TEXT + ' )'
            }



            aGtDocument.push({
                DOC_ID_TEXT: aDocHeader[i].DOC_ID,
                COSTCENTER_INTORDER: costcenterIntorder,
                VENDOR_IBAN_TEXT: vendorIbanText,
                ACCOUNT_TEXT: accountText,
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
        consts.PDFPath.DOCUMENT);



    if (Boolean(iSaveAttach)) {

        let filename = "O2P_" + iRequest.data.REQUEST_ID + ".pdf"
        let oResponseSaveAttach = await saveAttach(returnCreatePdf,
            iRequest.data.REQUEST_ID, iRequest, consts.attachmentFormat.PDF, consts.attachmentTypes.DOC, filename, '')
    }

    return { binary: returnCreatePdf, type: consts.attachmentFormat.PDF }



}


async function generateO2PF23Aut(iRequest, iSaveAttach) {

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



    let bankCode = ''
    let bankName = ''
    let bankIban = ''
    let bankAddress1 = ''
    let bankAddress2 = ''
    let bankAddress3 = ''

    let oBankreq = await SELECT.one.from(Bankreq).
        where({ REQUESTER_CODE: oRequest.REQUESTER_CODE, BANK_CODE: oRequest.BANK_ACCOUNT });
    if (!oBankreq) {
        oBankreq = await SELECT.one.from(Bankreq).
            where({ REQUESTER_CODE: '*', BANK_CODE: oRequest.BANK_ACCOUNT });
    }



    if (oBankreq) {

        bankCode = oBankreq.BANK_CODE
        bankName = oBankreq.BANK_NAME
        bankIban = oBankreq.IBAN

        let oBank = await SELECT.one.from(Bank).
            where({ CODE: bankCode });

        if (oBank) {
            bankAddress1 = oBank.ADDRESS1
            bankAddress2 = oBank.ADDRESS2
            bankAddress3 = oBank.ADDRESS3
        }

    }

    let oGsBankDet = {

        BANK_CODE: bankCode,
        ADDRESS1: bankAddress1,
        ADDRESS2: bankAddress2,
        ADDRESS3: bankAddress3,
        BANK_NAME: bankName

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
    oGsRequest.PAYMENT_MODE_TEXT = paymentModeText

    let docQuantity = 0
    let aDocument = await SELECT.from(Document).
        where({ to_Request_REQUEST_ID: iRequest.data.REQUEST_ID }).orderBy('DOC_ID asc', 'ID asc');

    let oTree = await transcodeDocumentToTree(iRequest.data.REQUEST_ID, aDocument)

    let aDocHeader = oTree.HEADER
    for (let i = 0; i < aDocHeader.length; i++) {
        let aPosition = aDocHeader[i].POSITION
        for (let x = 0; x < aPosition.length; x++) {
            //aPosition[x];
            docQuantity = docQuantity + 1
        }
    }


    let gvDate = moment(new Date).format('YYYYMMDD')

    let gvSignature = ''
    var EccServiceAfe = await cds.connect.to('ZFI_AFE_COMMON_SRV');
    const { CompanySet } = EccServiceAfe.entities;
    let aCompany = await EccServiceAfe.run(
        SELECT.from(CompanySet).where({ Bukrs: oRequester.BUKRS }));

    if (aCompany.length > 0) {
        gvSignature = aCompany[0].Butxt
    }



    //

    let startIndex = bankIban.length - 8
    //let endIndex = bankIban.length
    let subStrIban = bankIban.substring(startIndex)

    let gvBody1 = ['Con la presente si autorizza il pagamento di n.',
        docQuantity.toString(),
        'F23',
        oRequest.ADDITIONAL_MAIL_TEXT,
        'sul conto',
        gvSignature,
        'c/o',
        bankName,
        'n.',
        subStrIban,
        'per un importo di euro',
        oRequest.TOTAL.toString(),
        'a favore di',
        aDocHeader[0].VENDOR_DESC,
        'in data',
        moment(oRequest.VALUE_DATE).format('DD/MM/YYYY'),
        'e causale',
        aDocHeader[0].REASON,
        '\r\n',
        '\r\n'
    ].join(' ')


    let gvBody2 = [
        'La suddetta operazione, certificata dal rilascio di Vs. Contabile Bancaria, dovrà essere addebbitata sul conto corrente',
        bankName,
        'n.',
        bankIban,
        'operativo per',
        gvSignature,
        '.'
    ].join(' ')

    let gvBody = gvBody1 + gvBody2

    let oCreatePDF = {
        data: {
            GS_REQUEST: oGsRequest,
            GS_BANK_DET: oGsBankDet,
            GV_BODY: gvBody,
            GV_DATE: gvDate,
            GV_SIGNATURE: gvSignature
        }
    }



    try {

        let sCreatePDF = JSON.stringify(oCreatePDF);

        jsonData = JSON.parse(sCreatePDF);

    } catch (error) {
        let errMEssage = "ERROR generateO2PF23Aut " + iRequest.data.REQUEST_ID + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }



    returnCreatePdf = await createPdf(jsonData, iRequest.data.REQUEST_ID, iRequest,
        consts.PDFPath.F23AUT);



    if (Boolean(iSaveAttach)) {
        // let oResponseSaveAttach = await saveAttach(returnCreatePdf,
        //     iRequest.data.REQUEST_ID, iRequest, consts.attachmentFormat.PDF, '', '')
    }

    return { binary: returnCreatePdf, type: consts.attachmentFormat.PDF }



}


async function generateO2PAccounting(iRequest, iDocumentDetail, iSaveAttach) {


    let oReturn = {
        binary: '',
        type: '',
        error: []
    }

    let bankText = ''
    let beneficiaryDate = ''
    let orderingABI = ''
    let beneficiaryABI = ''
    let directingLocation = ''
    let directingName = ''
    let directingStreet = ''
    let transferType = ''

    const oBundle = getTextBundle(iRequest);

    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iDocumentDetail.requestId })


    let aDocument = await SELECT.from(Document).
        where({
            to_Request_REQUEST_ID: iDocumentDetail.requestId,
            DOC_ID: iDocumentDetail.docId
        })
        .orderBy('DOC_ID asc', 'ID asc');

    let oTree = await transcodeDocumentToTree(iDocumentDetail.requestId, aDocument)

    let oDocHeader = oTree.HEADER[0]



    let oBankreq = await SELECT.one.from(Bankreq).
        where({ REQUESTER_CODE: oRequest.REQUESTER_CODE, BANK_CODE: oRequest.BANK_ACCOUNT });
    if (!oBankreq) {
        oBankreq = await SELECT.one.from(Bankreq).
            where({ REQUESTER_CODE: '*', BANK_CODE: oRequest.BANK_ACCOUNT });
    }

    if (oBankreq) {
        bankText = oBankreq.BANK_NAME
    }



    if (Boolean(iDocumentDetail.uiban)) {
        orderingABI = iDocumentDetail.uiban.substring(5, 10)
    }

    if (Boolean(oDocHeader.IBAN)) {
        beneficiaryABI = oDocHeader.IBAN.substring(5, 10)
    }

    let oBankexc = await SELECT.one.from(Bankexc).
        where({ ABI_Q8: orderingABI, ABI_VENDOR: beneficiaryABI });

    if (oBankexc || orderingABI === beneficiaryABI) {
        beneficiaryDate = iDocumentDetail.executionDate
    } else {
        beneficiaryDate = iDocumentDetail.valut
    }


    let aParam = await SELECT.from(Param).where({ PARAMNAME: 'ACCOUNT_PDF_' + iDocumentDetail.bukrs });

    if (aParam.length === 0) {
        aParam = await SELECT.from(Param).where({ PARAMNAME: 'ACCOUNT_PDF' });
    }



    for (let i = 0; i < aParam.length; i++) {

        if (aParam[i].VAL_INPUT === 'DIRECTING_LOCATION') {
            directingLocation = aParam[i].VAL_OUTPUT
        }

        if (aParam[i].VAL_INPUT === 'DIRECTING_NAME') {
            directingName = aParam[i].VAL_OUTPUT
        }

        if (aParam[i].VAL_INPUT === 'DIRECTING_STREET') {
            directingStreet = aParam[i].VAL_OUTPUT
        }

        if (aParam[i].VAL_INPUT === 'TRANSFER_TYPE') {
            transferType = aParam[i].VAL_OUTPUT
        }
    }


    let oGsAccountingPdf = {
        REQUEST_ID: iDocumentDetail.requestId,
        DOCUMENT: oDocHeader.DOCUMENT_NUMBER,
        COMPANY_CODE: oDocHeader.DOCUMENT_COMP_CODE,
        FISCAL_YEAR: oDocHeader.DOCUMENT_FISCAL_YEAR,
        VENDOR: oDocHeader.VENDOR,
        VENDOR_NAME: oDocHeader.VENDOR_DESC,
        VENDOR_IBAN: oDocHeader.IBAN,
        AMOUNT: oDocHeader.TOT_AMOUNT,
        CURRENCY: oRequest.WAERS_CODE,
        REASON: oDocHeader.REASON,
        CRO: iDocumentDetail.xblnr,

        DIRECTING_BANK_CODE: oRequest.BANK_ACCOUNT,
        DIRECTING_BANK_NAME: bankText,

        DIRECTING_NAME: directingName,
        DIRECTING_STREET: directingStreet,
        DIRECTING_LOCATION: directingLocation,
        DIRECTING_BANK_IBAN: iDocumentDetail.uiban,
        TRANSFER_TYPE: transferType,

        VALUE_DATE: iDocumentDetail.executionDate,
        BENEFICIARY_DATE: beneficiaryDate,

    }


    let gvLogoQuaser = fs.readFileSync('srv/file/pdf/images/ZLOGO_Q8_BW_3.bmp').toString('base64')

    let oCreatePDF = {
        data: {
            GS_ACCOUNTING_PDF: oGsAccountingPdf,
            GV_LOGO_QUASER: gvLogoQuaser
        }
    }


    try {

        let sCreatePDF = JSON.stringify(oCreatePDF);

        jsonData = JSON.parse(sCreatePDF);

        returnCreatePdf = await createPdf(jsonData, iDocumentDetail.requestId, iRequest, consts.PDFPath.ACCOUNTING)

        if (Boolean(iSaveAttach)) {

            let filename = "Contabile " + iDocumentDetail.requestId + iDocumentDetail.docId + ".pdf"

            let oResponseSaveAttach = await saveAttach(returnCreatePdf, iDocumentDetail.requestId,
                iRequest, consts.attachmentFormat.PDF, consts.attachmentTypes.COUNTING, filename, iDocumentDetail.docId)
            if (oResponseSaveAttach.errors) {
                return oResponseSaveAttach;
            }

            let resUpdate = await UPDATE(Document).set({ CONTABILE_NICKNAME: '1', CRO: iDocumentDetail.xblnr }).where({
                to_Request_REQUEST_ID: iDocumentDetail.requestId,
                DOC_ID: iDocumentDetail.docId

            });

        }

        oReturn = { binary: returnCreatePdf, type: consts.attachmentFormat.PDF, error: [] }

    } catch (error) {

        oReturn.error.push(error.message)
    }



    return oReturn


}

async function saveAttach(iPdfContent, iRequestId, iRequest, iAttachFormat, iAttachType, iFileName, iDocId) {

    let fullName;
    let attach = {};
    let attachUpdate = new Array();

    let actualUser = iRequest.user.id;
    var fileSizeInBytes = iPdfContent.length;
    let filename = ''
    let attachFormat = ''

    if (Boolean(iFileName)) {
        filename = iFileName
    } else {
        filename = "O2P_" + iRequestId + ".pdf";
    }

    if (Boolean(iAttachFormat)) {
        attachFormat = iAttachFormat
    } else {
        attachFormat = consts.attachmentFormat.PDF
    }

    try {

        let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
            .where({ MailDipendente: actualUser }));
        if (oInfoWDPosition === undefined) {
            fullName = actualUser;
        } else {
            fullName = oInfoWDPosition.FullName;
        }



        let oAttachmentDb

        if (Boolean(iDocId)) {

            oAttachmentDb = await SELECT.one.from(Attachments)
                .where({
                    REQUEST_ID: iRequestId,
                    ATTACHMENTTYPE_ATTACHMENTTYPE: iAttachType,
                    DOC_ID: iDocId
                });

        } else {

            oAttachmentDb = await SELECT.one.from(Attachments)
                .where({
                    REQUEST_ID: iRequestId,
                    ATTACHMENTTYPE_ATTACHMENTTYPE: iAttachType
                });

        }

        let returnSaveFileOnOt;


        if (oAttachmentDb) {

            returnSaveFileOnOt = await updateFileonOT(iRequest, iRequestId, oAttachmentDb.ID, iPdfContent, false)

        } else {

            let queryMaxResult = await SELECT.one.from(Attachments).columns(["max(ID) as maxId"])
                .where({ REQUEST_ID: iRequestId });

            let maxId = queryMaxResult.maxId + 10

            attach.to_Request_REQUEST_ID = iRequestId;
            attach.ID = maxId
            attach.DOC_ID = iDocId;
            // attach.CONTENT = iPdfContent;
            attach.MEDIATYPE = attachFormat;
            attach.FILENAME = filename
            attach.SIZE = fileSizeInBytes
            attach.URL = "/odata/v2/kupito2pmodel-srv/Attachments(REQUEST_ID=" + iRequestId + ",ID=" + maxId + ")/CONTENT";
            attach.ATTACHMENTTYPE_ATTACHMENTTYPE = iAttachType;
            //attach.CREATOR_FULLNAME = fullName;
            attach.CREATOR_FULLNAME = 'System';
            attach.createdAt = new Date();
            //attach.createdBy = actualUser;
            attach.createdBy = 'SYSTEM'
            attachUpdate.push(attach);

            let upsertAttch = await INSERT.into(Attachments).entries(attachUpdate);

            returnSaveFileOnOt = await saveFileonOT(iRequest, iRequestId, maxId, iPdfContent, false);

        }

        if (returnSaveFileOnOt.errors) {
            return returnSaveFileOnOt;
        }



        /*
        const cdsTx = cds.tx(); 
        let upsertAttch = UPSERT.into(Attachments).entries(attachUpdate);
        let upsertResponse = await cdsTx.run(upsertAttch);
        await cdsTx.commit();
        */

    } catch (error) {
        let errMEssage = "ERROR saveAttach " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}

async function deleteO2PDocument(iRequest, iRequestId) {

    let oAttachment = await SELECT.one.from(Attachments).where({
        REQUEST_ID: iRequestId,
        ATTACHMENTTYPE_ATTACHMENTTYPE: consts.attachmentTypes.DOC
    });
    if (oAttachment) {
        let deleteFileToOt = await eventDeleteFileToOt(iRequest, iRequestId, oAttachment.ID)
        if (deleteFileToOt.hasOwnProperty("error"))  { } else {

            let deleteDbFile = await DELETE.from(Attachments).where(
                {
                    REQUEST_ID: iRequestId,
                    ATTACHMENTTYPE_ATTACHMENTTYPE: consts.attachmentTypes.DOC
                })
        }

    }

}

module.exports = {
    createPdf,
    generateO2PDocument,
    generateO2PF23Aut,
    generateO2PAccounting,
    saveAttach,
    deleteO2PDocument
}