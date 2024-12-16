const LOG = cds.log('KupitO2PSrv');
const client = require('@sap-cloud-sdk/http-client');
const connectivity = require('@sap-cloud-sdk/connectivity');
const _ = require('underscore');
const moment = require('moment');
const consts = require("./Constants");
const SequenceHelper = require("./SequenceHelper");
const { convertAmount } = require('./ConvertCurrency');
const { getEnvParam, getTextBundle } = require('./Utils');
const { row, forEach, not, number, and } = require('mathjs');
const { RequestBuilder } = require('@sap-cloud-sdk/odata-v2');
const { xDnsPrefetchControl } = require('helmet');
const { updateMoaApprovers, insertApprovalHistory } = require('./createProcess');
const { INSERT } = require('@sap/cds/lib/ql/cds-ql');
const { resolve } = require('path');
const { log } = require('console');



async function updateRequest(iData, iRequest) {

    let requestId = iData.REQUEST_ID;
    let userCompiler = iRequest.user.id;;

    let requestData = await getRequestData(requestId, iRequest)
    if (requestData.errors) {
        return requestData;
    }


    //Aggiornamento approvatori MOA

    /*
    let returnUpdateMoa = await updateMoaApprovers(requestId, userCompiler, iRequest);
    if (returnUpdateMoa.errors) {
        return returnUpdateMoa;
    }
        */


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



async function createAttachment(iRequest) {
    try {
        LOG.info("Attachments - BEFORE CREATE Event handler")

        let actualUser = iRequest.user.id;
        let RequestId = iRequest.data.REQUEST_ID;

        let queryMaxResult = await SELECT.one.from(Attachments).columns(["max(ID) as maxId"])
            .where({ REQUEST_ID: RequestId });

        let maxId = queryMaxResult.maxId + 10;
        iRequest.data.to_Request_REQUEST_ID = RequestId;
        iRequest.data.ID = maxId;
        iRequest.data.URL = "/odata/v2/kupito2pmodel-srv/Attachments(REQUEST_ID=" + RequestId + ",ID=" + maxId + ")/CONTENT";




        let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
            .where({ MailDipendente: actualUser }));

        if (oInfoWDPosition === undefined) {
            iRequest.data.CREATOR_FULLNAME = actualUser;
        } else {
            iRequest.data.CREATOR_FULLNAME = oInfoWDPosition.FullName;
        }


    } catch (error) {
        let errMEssage = "ERROR Save info attach: " + iRequest.data.REQUEST_ID + ". " + error.message;
        iRequest.error(450, errMEssage, Attachments, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
}



async function deleteAttachment(iRequest) {
    try {
        LOG.info("Attachments - BEFORE Delete Event handler")

        let RequestId = iRequest.data.REQUEST_ID;
        iRequest.data.to_Request_REQUEST_ID = RequestId;

    } catch (error) {
        let errMEssage = "ERROR Delete info attach: " + iRequest.data.REQUEST_ID + ". " + error.message;
        iRequest.error(450, errMEssage, Attachments, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
}

async function readAttachment(iData, iRequest) {

    let actualUser = iRequest.user.id;
    let attachDesc = await SELECT.from(AttachmentType);
    let requestStatus;

    if (iData.length > 0) {
        requestStatus = await SELECT.one.from(Request)
            .where({
                REQUEST_ID: iData[0].REQUEST_ID
            });

        //Caso 2, esce    
        if (requestStatus === undefined) {
            return iData;
        }
    }

    iData.forEach((attach) => {
        let attachElement = _.findWhere(attachDesc, { ATTACHMENTTYPE: attach.ATTACHMENTTYPE_ATTACHMENTTYPE });
        if (attachElement === undefined) {
            attach.ATTACHDESC = attach.ATTACHMENTTYPE_ATTACHMENTTYPE;
        } else {
            attach.ATTACHDESC = attachElement.DESCRIPTION;
        }

        attach.ISEDITABLE = true;
        if (attach.createdBy !== actualUser) {
            attach.ISEDITABLE = false;
        }

        if (requestStatus.STATUS_code !== consts.requestStatus.Progress) {
            attach.ISEDITABLE = false;
        }
    });
}


async function createNote(iRequest) {
    try {
        LOG.info("Notes - BEFORE CREATE Event handler")

        let actualUser = iRequest.user.id;
        let RequestId = iRequest.data.REQUEST_ID;
        iRequest.data.to_Request_REQUEST_ID = RequestId;
        let requestdb = await SELECT.one.from(Request).columns(["VERSION"])
            .where({
                REQUEST_ID: iRequest.data.REQUEST_ID
            });

        let queryMaxResult = await SELECT.one.from(Notes).columns(["max(ID) as maxId"])
            .where({ REQUEST_ID: RequestId });

        let maxId = queryMaxResult.maxId + 10;

        iRequest.data.ID = maxId;
        iRequest.data.VERSION = requestdb.VERSION;


        let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
            .where({ MailDipendente: actualUser }));

        if (oInfoWDPosition === undefined) {
            iRequest.data.CREATOR_FULLNAME = actualUser;
        } else {
            iRequest.data.CREATOR_FULLNAME = oInfoWDPosition.FullName;
        }


    } catch (error) {
        let errMEssage = "ERROR Save info note: " + iRequest.data.REQUEST_ID + ". " + error.message;
        iRequest.error(450, errMEssage, Notes, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
}

async function readNote(iData, iRequest) {

    //Valido per singola richiesta
    if (iData.length <= 0) {
        return iData;
    }
    let isUniqRequest = _.uniq(iData, 'REQUEST_ID');
    if (isUniqRequest.length > 1) {
        return iData;
    }

    let requestId = iData[0].REQUEST_ID;

    let actualUser = iRequest.user.id;
    let requestdb = await SELECT.one.from(Request).columns(["VERSION"])
        .where({
            REQUEST_ID: requestId
        });

    iData.forEach((note) => {
        note.ISEDITABLE = false;

        if (note.VERSION === requestdb.VERSION && note.createdBy === actualUser) {
            //if (note.createdBy === actualUser) {
            note.ISEDITABLE = true;
        }
    });
}

async function deleteNote(iRequest) {
    try {
        LOG.info("Note - BEFORE Delete Event handler")

        let RequestId = iRequest.data.REQUEST_ID;
        iRequest.data.to_Request_REQUEST_ID = RequestId;

    } catch (error) {
        let errMEssage = "ERROR Delete info note: " + iRequest.data.REQUEST_ID + ". " + error.message;
        iRequest.error(450, errMEssage, Attachments, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
}


async function getRejectorName(iRequest, iO2PRequest) {
    try {
        let rejectorInfo = {};
        let oldVersion = 0;
        if (iO2PRequest.VERSION === 1) {
            oldVersion = iO2PRequest.VERSION;
        } else {
            oldVersion = iO2PRequest.VERSION - 1;
        }

        ;

        let aRequest = await SELECT.one.from(ApprovalHistory).
            where({
                REQUEST_ID: iO2PRequest.REQUEST_ID,
                VERSION: oldVersion,
                To_Action_ACTION: consts.UserAction.REJECTED
            });

        if (aRequest == undefined) {
            return "";


        }

        rejectorInfo.rejectorName = aRequest.REAL_FULLNAME;
        if (rejectorInfo.rejectorName === null) {
            rejectorInfo.rejectorName = aRequest.REAL_MAIL;
        }
        rejectorInfo.createby = aRequest.REAL_MAIL;
        return rejectorInfo;


    } catch (error) {
        let errMEssage = "ERROR getRejectorName: " + iO2PRequest.data.REQUEST_ID + ". " + error.message;
        iRequest.error(450, errMEssage, iO2PRequest, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

}

async function getRejectMotivation(iRequest, iCreatedby) {

    let oldVersion = 0;
    if (iRequest.VERSION === 1) {
        oldVersion = iRequest.VERSION;
    } else {
        oldVersion = iRequest.VERSION - 1;
    }

    ;

    let reqData = await SELECT.one.from(Notes).
        where({
            to_Request_REQUEST_ID: iRequest.REQUEST_ID,
            VERSION: oldVersion,
            createdBy: iCreatedby
        });

    if (reqData !== undefined && reqData.NOTE !== null) {
        return reqData.NOTE;
    } else {
        return ""
    }

}


async function getRejectInfo(iRequest) {
    //LOG.info("getRejectInfo");
    //let now = moment(new Date());

    let reqData = await SELECT.one.from(Request).
        where({
            REQUEST_ID: iRequest.data.REQUEST_ID
        });

    if (reqData === null || reqData == undefined) {
        let errMEssage = "ERROR get request " + iRequest.data.REQUEST_ID + ". Request not found";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    let returninfo = {};
    let returnReject = await getRejectorName(iRequest, reqData);
    if (returnReject == "") {
        return returnReject;
    }
    //if( returninfo !== ""){ 
    returninfo.REJECTOR_NAME = returnReject.rejectorName;
    returninfo.MOTIVATION = await getRejectMotivation(reqData, returnReject.createby);
    //}
    return returninfo;
}

async function manageData(iRequest) {


    const oBundle = getTextBundle(iRequest);


    let oResult = {
        VIS_PRIORITY: false,
        VIS_ADD_CRO_MAIL: false,
        VIS_EXPIRE_DATE: false,
        REQ_EXPIRE_DATE: false,
        LAB_EXPIRE_DATE: '',
        VIS_BENEFICIARY_DATE: false,
        REQ_BENEFICIARY_DATE: false,
        VIS_F24_ENTRATEL_TYPE: false,
        REQ_F24_ENTRATEL_TYPE: false,
        VIS_F24_ENTRATEL_TYPE_CL_ACCOUNT: false,
        REQ_F24_ENTRATEL_TYPE_CL_ACCOUNT: false,
        VIS_SEND_TASK_BTN: false

    }


    let oRequester = await SELECT.one.from(Requester).
        where({ CODE: iRequest.data.REQUESTER });


    /*   let oPayMode = await SELECT.one.from(Paymode).
           where({ PAYMENT_MODE: iRequest.data.PAYMENT_MODE });
   
    
      if (!oPayMode) {
           let errMEssage = "ERROR get layout " + iRequest.data.PAYMENT_MODE + ". Payment Mode not found";
           iRequest.error(450, errMEssage, null, 450);
           LOG.error(errMEssage);
           return iRequest;
       }
          */

    //set check priority visibility
    if (iRequest.data.PAYMENT_MODE === consts.Paymode.BONIFICO) {
        oResult.VIS_PRIORITY = true
        oResult.VIS_ADD_CRO_MAIL = true
    }

    if (iRequest.data.PRIORITY === true) {
        oResult.VIS_BENEFICIARY_DATE = true
        oResult.REQ_BENEFICIARY_DATE = true
    }


    if (iRequest.data.PAYMENT_MODE === consts.Paymode.F24) {

        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_F24")
        oResult.VIS_EXPIRE_DATE = true

    }

    if (iRequest.data.PAYMENT_MODE === consts.Paymode.F23) {

        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_F23")
        oResult.VIS_EXPIRE_DATE = true

    }

    if (iRequest.data.PAYMENT_MODE === consts.Paymode.MAV) {

        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_MAV")
        oResult.VIS_EXPIRE_DATE = true

    }

    if (iRequest.data.PAYMENT_MODE === consts.Paymode.FLBONIFIC) {

        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_FLBONIFIC")
        oResult.VIS_EXPIRE_DATE = true

    }


    if (iRequest.data.PAYMENT_MODE === consts.Paymode.ENTRATEL) {

        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_F24")
        oResult.VIS_EXPIRE_DATE = true

        oResult.VIS_F24_ENTRATEL_TYPE = true
        oResult.REQ_F24_ENTRATEL_TYPE = true

        if (iRequest.data.F24_ENTRATEL_TYPE === 'DEBTOFFSET') {
            oResult.VIS_F24_ENTRATEL_TYPE_CL_ACCOUNT = true
            oResult.REQ_F24_ENTRATEL_TYPE_CL_ACCOUNT = true
        }

    }

    if (oRequester.SEND_TASK === true) {
        oResult.VIS_SEND_TASK_BTN = true
    }

    if (oResult.VIS_EXPIRE_DATE === true) {
        oResult.REQ_EXPIRE_DATE = true
    }

    return oResult

}

async function getLayout(iRequest) {

    let oLayout = await manageData(iRequest)
    return oLayout

}

async function checkData(iRequest) {

    const oBundle = getTextBundle(iRequest);

    let oRequest = iRequest.data.request
    let aDocument = iRequest.data.document
    let aAttachment = iRequest.data.attachment

    let aResult = []


    let oImpLayout = {
        data: {
            REQUESTER: oRequest.REQUESTER_CODE,
            PAYMENT_MODE: oRequest.PAYMENT_MODE_CODE,
            PRIORITY: oRequest.PRIORITY,
            TYPE_F24_ENTRATEL: oRequest.TYPE_F24_ENTRATEL

        }
    }

    let oLayout = await manageData(oImpLayout)

    // check 1
    if (!Boolean(oRequest.TITLE)) {
        aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "TITLE", TEXT: oBundle.getText("TITLE_MAND") }) //"Title field is mandatory"
    }

    // check 2
    if (!Boolean(oRequest.AREA_CODE)) {
        aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "AREA", TEXT: oBundle.getText("AREA_MAND") }) //"Area field is mandatory";
    }

    // check 3
    if (Boolean(!oRequest.WAERS_CODE)) {
        aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "WAERS_CODE", TEXT: oBundle.getText("CURR_MAND") }) //"Currency is mandatory";
    }
    else {
        let oCurrency = await SELECT.one.from(Currency).where({ code: oRequest.WAERS_CODE });

        if (!oCurrency) {
            aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "WAERS_CODE", TEXT: oBundle.getText("CURR_NVAL") }) // "Currency is not valid";
        }
    }

    // check 4
    if (Boolean(!oRequest.PAYMENT_MODE_CODE)) {
        aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "PAYMENT_MODE_CODE", TEXT: oBundle.getText("PAYMODE_MAND") }) //"Payment mode is mandatory";
    }


    // check 5
    if (Boolean(!oRequest.EXPIRY_DATE) && oLayout.REQ_EXPIRE_DATE === true) {
        aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "EXPIRY_DATE", TEXT: oBundle.getText("EXPIRY_DATE_MAND") }) //"Expire Date is mandatory";
    }


    // check 6
    if (Boolean(!oRequest.F24_ENTRATEL_TYPE) && oLayout.REQ_F24_ENTRATEL_TYPE) {
        aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "F24_ENTRATEL_TYPE", TEXT: oBundle.getText("F24_ENTRATEL_TYPE_MAND") }) //Attenzione, per gli F24 ENTRATEL è necessario indicare la tipologia
    }

    // check 7
    if (Boolean(!oRequest.F24_ENTRATEL_CLEARING_ACCOUNT) && oLayout.REQ_F24_ENTRATEL_TYPE_CL_ACCOUNT) {
        aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "F24_ENTRATEL_CLEARING_ACCOUNT", TEXT: oBundle.getText("F24_ENTRATEL_TYPE_CL_ACCOUNT_MAND") }) //"Attenzione, il conto di compensazione è un dato obbligatorio.
    }


    // check 8
    if (oRequest.EXTRA_MANAGER_REQUIRED === true) {

        oApproval = await SELECT.one.from(ApprovalHistory).
            where({
                REQUEST_ID: oRequest.REQUEST_ID,
                VERSION: oRequest.VERSION,
                To_Action_ACTION: 'READY'
            });


        if (oApproval && oApproval.STEP === '20') {
            let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay).where({ MailDipendente: oRequest.EXTRA_MANAGER_NAME }));
            if (!oInfoWDPosition) {
                aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "EXTRA_MANAGER_NAME", TEXT: oBundle.getText("EXTRA_MANAGER_NAME_MAND") }) //"Further manager has been requested but not inserted
            }
        }
    }




    if (Boolean(!oRequest.BENEFICIARY_DATE) && oLayout.REQ_BENEFICIARY_DATE === true) {
        aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "BENEFICIARY_DATE", TEXT: oBundle.getText("BEN_DATE_MAND") }) //"For prior orders, insert a desired Beneficiary Date";
    }






    // da rivedere controllo totali
    /* if (aDocument) {
         let errMEssage = "Order with total amount null!";
         iRequest.error(450, errMEssage, null, 450);
         LOG.error(errMEssage);
     } */

    // return iRequest;


    //iDocData

    let checkAttachCapi = false



if (aDocument.length > 0) {
    
    for (let i = 0; i < aDocument.length; i++) {

        let iDocData = {
            data: {
                PAYMODE: oRequest.PAYMENT_MODE_CODE,
                REQUEST_ID: oRequest.REQUEST_ID,
                DOC_ID: aDocument[i].DOC_ID,
                ID: aDocument[i].ID,
                LOCATION: aDocument[i].LOCATION,
                VENDOR: aDocument[i].VENDOR,
                COST_CENTER: aDocument[i].COST_CENTER,
                INT_ORDER: aDocument[i].INT_ORDER,
                ACCOUNT: aDocument[i].ACCOUNT,
                AMOUNT: aDocument[i].AMOUNT,
                REASON: aDocument[i].REASON,
                IBAN: aDocument[i].IBAN,
                NOTE: aDocument[i].NOTE,
                ATTRIBUZIONE: aDocument[i].ATTRIBUZIONE
            }
        }

        let oDocData = await manageDocPopupData(iDocData)

        if (oDocData.CHECK_ATTACH_CAPI === true && checkAttachCapi === false) {
            checkAttachCapi = oDocData.CHECK_ATTACH_CAPI
        }

        let aError = oDocData.ERROR

        for (let x = 0; x < aError.length; x++) {
            aResult.push(aError[x])
        }

    }

} else {

    aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "DOCUMENT", TEXT: oBundle.getText("DOCUMENT_MAND") }) //“Attenzione, inserire almeno un documento
     
}


    if (Boolean(checkAttachCapi)) {

        let oAttachment = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.CAPI)
        if (!oAttachment) {
            aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "ATTACHMENTTYPE", TEXT: oBundle.getText("ATTACH_CAPI_MAND") }) //“Attenzione, per i conti che prevedono l’Ordine interno è necessario inserire l’allegato : Giustificativo Capitalizzazione”.
        }

    }

    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.FLBONIFIC) {
        let oAttachment = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.FLBONIFIC)
        if (!oAttachment) {
            aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "ATTACHMENTTYPE", TEXT: oBundle.getText("ATTACH_FLBONIFIC_MAND") }) //“Attenzione, per il flusso bonifici è necessario allegare il relativo documento”.
        }
    }


    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.F24) {
        let oAttachment = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.F24)
        if (!oAttachment) {
            aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "ATTACHMENTTYPE", TEXT: oBundle.getText("ATTACH_F24_MAND") }) //“Attenzione, per gli F24 è necessario allegare il relativo documento.
        }
    }

    

    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.F23) {
        let oAttachmentF23Conc = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.F23_CONC)
        let oAttachmentF23Uff = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.F23_UFF)
        let oAttachmentF23Vers = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.F23_VERS)
        
        if (!oAttachmentF23Conc || !oAttachmentF23Uff || !oAttachmentF23Vers ) {
            aResult.push({ MTYPE: consts.ERROR, REF_FIELD: "ATTACHMENTTYPE", TEXT: oBundle.getText("ATTACH_F23_MAND") }) //    “Attenzione, per gli F23 è necessario allegare i documenti relativi”.
        }
    }
 


    return aResult

}


async function getTemplate(iRequest) {

    return '1'

    var i = 1
    const fs = require('fs');

    var vBuffer = fs.readFileSync('srv/Template_ListaCessatiO2P.xlsx')
    //var bufferOne = vBuffer.toString('base64');
    var oOutput =

    {

        CONTENT: vBuffer.toString(),
        MEDIATYPE: 'xlsx',
        CONTENTSTRING: vBuffer.toString('base64')

    }

    return oOutput

}

async function formatDocument(iData, iRequest) {

    let callECC = getEnvParam("CALL_ECC", false);
    if (callECC === "true") {

        var EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');
        const { VendorSet } = EccServiceO2P.entities;



        for (let i = 0; i < iData.length; i++) {

            let aVendor = await EccServiceO2P.run(
                SELECT.from(VendorSet).where({ Lifnr: iData[i].VENDOR }));

            if (aVendor.length > 0) {
                iData[i].VENDOR_DESC = aVendor[0].Name1
            }


        }

    }


}


async function formatMonitoring(iData, iRequest) {
    LOG.info("formatMonitorng");
    try {
        let now = moment(new Date());
        //let requestID = new Array();

        iData.forEach(data => {
            let started = moment(data.ASSIGNED_AT);
            let dayDiff = now.diff(started, 'days')
            data.DAYS_SPENT = dayDiff;

            if (data.STATUS_code === consts.requestStatus.Refused ||
                data.STATUS_code === consts.requestStatus.Deleted ||
                data.STATUS_code === consts.requestStatus.Completed) {
                data.DAYS_SPENT = 0;
                data.STEP_TO_END = 0;
                data.SHOW_ASSIGNED_AT = false;
            }


        });

    } catch (error) {
        let errMEssage = "ERROR monitoring: " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
}


async function formatMonitoringDetail(iData, iRequest) {

    /*
     LOG.info("formatMonitoringDetail");
      try {
          let now = moment(new Date());
          //let requestID = new Array();
  
          iData.forEach(data => {
              let started = moment(data.ASSIGNED_AT);
              let dayDiff = now.diff(started, 'days')
              data.DAYS_SPENT = dayDiff;
  
              if (data.STATUS_code === consts.requestStatus.Refused ||
                  data.STATUS_code === consts.requestStatus.Deleted ||
                  data.STATUS_code === consts.requestStatus.Completed) {
                  data.DAYS_SPENT = 0;
                  data.STEP_TO_END = 0;
                  data.SHOW_ASSIGNED_AT = false;
              }
  
  
          });
  
      } catch (error) {
          let errMEssage = "ERROR monitoring detail: " + error.message;
          iRequest.error(450, errMEssage, null, 450);
          LOG.error(errMEssage);
          return iRequest;
      }
         */


}

async function transcodeDocumentToTree(iRequestId, aDocument) {

    let oHeader = {}
    let oResult = {}
    let first001DocId = false
    let lastId = ""


    var EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');
    const { VendorSet } = EccServiceO2P.entities;


    oResult.HEADER = []
    oResult.REQUEST_ID = iRequestId

    for (let i = 0; i < aDocument.length; i++) {
        //if (aDocument[i].ID == 1) {

        if (aDocument[i].DOC_ID !== lastId) {

            lastId = aDocument[i].DOC_ID


            if (first001DocId === true) {
                oResult.HEADER.push(oHeader)
            }

            let vendorDesc = ""

            let callECC = getEnvParam("CALL_ECC", false);
            if (callECC === "true") {

                let aVendor = await EccServiceO2P.run(
                    SELECT.from(VendorSet).where({ Lifnr: aDocument[i].VENDOR }));

                if (aVendor.length > 0) {
                    vendorDesc = aVendor[0].Name1
                }

            }

            oHeader = {
                DOC_ID: aDocument[i].DOC_ID,
                VENDOR: aDocument[i].VENDOR,
                VENDOR_DESC: vendorDesc,
                REASON: aDocument[i].REASON,
                LOCATION: aDocument[i].LOCATION,
                REF_ID: aDocument[i].REF_ID,
                IBAN: aDocument[i].IBAN,
                //
                AUTHORITY: aDocument[i].AUTHORITY,
                TRIBUTE: aDocument[i].TRIBUTE,
                DOC_YEAR: aDocument[i].DOC_YEAR,
                YEAR: aDocument[i].YEAR,
                PARTN_BNK_TYPE: aDocument[i].PARTN_BNK_TYPE,
                DOCUMENT_COMP_CODE: aDocument[i].DOCUMENT_COMP_CODE,
                DOCUMENT_FISCAL_YEAR: aDocument[i].DOCUMENT_FISCAL_YEAR,
                DOCUMENT_NUMBER: aDocument[i].DOCUMENT_NUMBER,
                CLEARING_NUMBER: aDocument[i].CLEARING_NUMBER,
                REASON: aDocument[i].REASON,


                POSITION: []

            }

            first001DocId = true
        }

        oHeader.POSITION.push({

            PARENT_ID: aDocument[i].DOC_ID,
            ID: aDocument[i].ID,
            ACCOUNT: aDocument[i].ACCOUNT,
            COST_CENTER: aDocument[i].COST_CENTER,
            INT_ORDER: aDocument[i].INT_ORDER,
            AMOUNT: aDocument[i].AMOUNT,
            //
            SPECIAL_GL_IND: aDocument[i].SPECIAL_GL_IND,
            //ACCOUNT_ADVANCE: aDocument[i].ACCOUNT_ADVANCE,
            NOTE: aDocument[i].NOTE,
            TEXT: aDocument[i].TEXT,
            CONTABILE_NICKNAME: aDocument[i].CONTABILE_NICKNAME,
            CONTABILE_SEND_DATE: aDocument[i].CONTABILE_SEND_DATE,
            ATTRIBUZIONE: aDocument[i].ATTRIBUZIONE,
            RIFERIMENTO: aDocument[i].RIFERIMENTO,
            REFKEY2: aDocument[i].REFKEY2,
            VALUT: aDocument[i].VALUT,
            IS_FROM_EXCEL: aDocument[i].IS_FROM_EXCEL,

        })

        if (i === aDocument.length - 1) {
            oResult.HEADER.push(oHeader)
        }

    }


    return oResult

}

async function fromDocumentToTree(iRequest) {

    let oResult = await transcodeDocumentToTree(iRequest.data.REQUEST_ID, iRequest.data.DOCUMENT)

    return oResult

}
async function fromRequestIdToTree(iRequest) {

    let aDocument = await SELECT.from(Document).
        where({ to_Request_REQUEST_ID: iRequest.data.REQUEST_ID }).orderBy('DOC_ID asc', 'ID asc');

    let oResult = await transcodeDocumentToTree(iRequest.data.REQUEST_ID, aDocument)

    return oResult

}



async function fromTreeToDocument(iRequest) {

    let aResult = []

    let aHeader = iRequest.data.DOC_TREE.HEADER

    for (let i = 0; i < aHeader.length; i++) {

        let aPosition = aHeader[i].POSITION

        for (let x = 0; x < aPosition.length; x++) {

            aResult.push({
                to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                DOC_ID: aHeader[i].DOC_ID,
                VENDOR: aHeader[i].VENDOR,
                //  VENDOR_DESC : aHeader[i].VENDOR_DESC 
                REASON: aHeader[i].REASON,
                LOCATION: aHeader[i].LOCATION,
                REF_ID: aHeader[i].REF_ID,
                IBAN: aHeader[i].IBAN,


                AUTHORITY: aHeader[i].AUTHORITY,
                TRIBUTE: aHeader[i].TRIBUTE,
                DOC_YEAR: aHeader[i].DOC_YEAR,
                PARTN_BNK_TYPE: aHeader[i].PARTN_BNK_TYPE,
                DOCUMENT_COMP_CODE: aHeader[i].DOCUMENT_COMP_CODE,
                DOCUMENT_FISCAL_YEAR: aHeader[i].DOCUMENT_FISCAL_YEAR,
                DOCUMENT_NUMBER: aHeader[i].DOCUMENT_NUMBER,
                CLEARING_NUMBER: aHeader[i].CLEARING_NUMBER,
                REASON: aHeader[i].REASON,


                ///////////////////////////////////////

                ID: aPosition[x].ID,
                ACCOUNT: aPosition[x].ACCOUNT,
                COST_CENTER: aPosition[x].COST_CENTER,
                INT_ORDER: aPosition[x].INT_ORDER,
                AMOUNT: aPosition[x].AMOUNT,

                SPECIAL_GL_IND: aPosition[x].SPECIAL_GL_IND,
                // ACCOUNT_ADVANCE: aPosition[x].ACCOUNT_ADVANCE,

                NOTE: aPosition[x].NOTE,
                TEXT: aPosition[x].TEXT,
                CONTABILE_NICKNAME: aPosition[x].CONTABILE_NICKNAME,
                CONTABILE_SEND_DATE: aPosition[x].CONTABILE_SEND_DATE,
                ATTRIBUZIONE: aPosition[x].ATTRIBUZIONE,
                RIFERIMENTO: aPosition[x].RIFERIMENTO,
                REFKEY2: aPosition[x].REFKEY2,
                VALUT: aPosition[x].VALUT,
                IS_FROM_EXCEL: aPosition[x].IS_FROM_EXCEL,


            })
        }

    }

    return aResult

}



async function manageDocPopupData(iRequest) {

    var EccServiceAfe = await cds.connect.to('ZFI_AFE_COMMON_SRV');

    const { AfeSet } = EccServiceAfe.entities;
    const { AfeLocationSet } = EccServiceAfe.entities;
    const { CostCenterTextSet } = EccServiceAfe.entities;


    var EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');

    const { VendorBankSet } = EccServiceO2P.entities;
    const { VendorSet } = EccServiceO2P.entities;
    const { OrderTypeSet } = EccServiceO2P.entities;



    const oBundle = getTextBundle(iRequest);

    let oResult = {

        REF_ID: "",
        LOCATION_DESC: "",
        VENDOR_DESC: "",
        COST_CENTER_DESC: "",
        INT_ORDER_DESC: "",
        REQ_LOCATION: false,
        VIS_COGE: false,
        VIS_TRIBUTO: false,
        VIS_COST_CENTER: false,
        REQ_COST_CENTER: false,
        VIS_INT_ORDER: false,
        REQ_INT_ORDER: false,
        VIS_CDC_DUMMY: false,
        VIS_NOTE: false,
        REQ_NOTE: false,
        VIS_REFKEY2: false,
        VIS_RIFERIMENTO: false,
        VIS_ATTRIBUZIONE: false,
        REQ_ATTRIBUZIONE: false,
        REQ_IBAN: false,
        VIS_IBAN: false,
        CHECK_ATTACH_CAPI: false,
        REQ_REASON: true,
        VIS_REASON: true,
        REQ_AMOUNT: true,
        VIS_AMOUNT: true,
        REQ_VENDOR: true,
        VIS_VENDOR: true,
        IBAN: [],
        ACCOUNT: [],
        ERROR: []

    }


    ///////////////////////////////////////////////////
    //  get Layout Data


    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID });


    let oRequester = await SELECT.one.from(Requester).
        where({ CODE: oRequest.REQUESTER_CODE });

    if (oRequester) {

        if (oRequester.PV_MANDATORY === true) {
            oResult.REQ_LOCATION = true
        }

        if (oRequester.MANAGE_SPECIAL_GL === true) {
            oResult.VIS_COGE = true
        }


        if (oRequester.MANAGE_ENTE_TRIBUTO === true) {
            oResult.VIS_TRIBUTO = true
        }

    }


    let oAccountreq = await SELECT.one.from(Accountreq).
        where({
            REQUESTER_CODE: oRequest.REQUESTER_CODE,
            ACCOUNT: iRequest.data.ACCOUNT

        });


    if (oAccountreq) {

        if (oAccountreq.REQUEST_CDC === true) {
            oResult.VIS_COST_CENTER = true
            oResult.REQ_COST_CENTER = true
        }

        if (oAccountreq.REQUEST_INTERNAL_ORDER === true) {
            oResult.VIS_INT_ORDER = true
            oResult.REQ_INT_ORDER = true
        }

        if (oAccountreq.ACCOUNT_ADVANCE === true) {
            oResult.VIS_NOTE = true
            oResult.REQ_NOTE = true
        }

        if (oAccountreq.REFKEY2 === true) {
            oResult.VIS_REFKEY2 = true
        }

        if (oAccountreq.REFKEY3 === true) {
            oResult.VIS_RIFERIMENTO = true
        }

        if (oAccountreq.MANDATORY_ATTRIB === true) {
            oResult.VIS_ATTRIBUZIONE = true
            oResult.REQ_ATTRIBUZIONE = true
        }

    }


    if (Boolean(oAccountreq) && oAccountreq.REQUEST_CDC &&
        oRequester && oRequester.DUMMY_CDC === true) {
        oResult.VIS_CDC_DUMMY = true
    }


    if (iRequest.data.PAYMODE === consts.Paymode.BONIFICO) {
        oResult.REQ_IBAN = true
        oResult.VIS_IBAN = true
    }


    //////////////////////////////////////////////////////
    // get and check data


    oResult.REF_ID = 'BPM' + iRequest.data.REQUEST_ID + iRequest.data.DOC_ID


    let callECC = getEnvParam("CALL_ECC", false);
    if (callECC === "true") {

        if (Boolean(iRequest.data.COST_CENTER)) {

            let costCenter = iRequest.data.COST_CENTER

            if (Boolean(/^\d+$/.test(costCenter))) {
                costCenter = iRequest.data.COST_CENTER.padStart(10, '0')
            }

            let aCostCenter = await EccServiceAfe.run(
                SELECT.from(CostCenterTextSet).where({ Kostl: costCenter }));
            if (aCostCenter.length > 0) {
                oResult.COST_CENTER_DESC = aCostCenter[0].Ltext
            }
            else {
                oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "COST_CENTER", TEXT: oBundle.getText("COST_CENTER_NVAL") }) //"Cost Center is not valid"
            }
        }

        else {

            if (oResult.REQ_COST_CENTER === true) {
                oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "COST_CENTER", TEXT: oBundle.getText("COST_CENTER_MAND") }) //"Cost Center is mandatory"
            }

        }


        if (Boolean(iRequest.data.LOCATION)) {

            let aLocation = await EccServiceAfe.run(
                SELECT.from(AfeLocationSet).where({ Kunnr: iRequest.data.LOCATION, Objpos: '001' }));

            if (aLocation.length > 0) {
                oResult.LOCATION_DESC = aLocation[0].Stras
            }
            else {
                oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "LOCATION", TEXT: oBundle.getText("LOCATION_NVAL") }) //"Location is not valid
            }
        }
        else {
            if (oResult.REQ_LOCATION === true) {
                oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "LOCATION", TEXT: oBundle.getText("LOCATION_MAND") }) //"Location is mandatory
            }
        }


        if (Boolean(iRequest.data.INT_ORDER)) {

            let aOrder = await EccServiceAfe.run(
                SELECT.from(AfeSet).where({ Order: iRequest.data.INT_ORDER.padStart(12, '0') }));

            if (aOrder.length > 0) {
                oResult.INT_ORDER_DESC = aOrder[0].OrderName


                let aOrderType = await EccServiceO2P.run(
                    SELECT.from(OrderTypeSet).where({ Auart: aOrder[0].OrderType }));
                if (aOrderType.length > 0) {
                    if (aOrderType[0].Aprof === '000050') {

                        oResult.CHECK_ATTACH_CAPI = true

                        let budget = Number(aOrder[0].LclAfeValue) +
                            (Number(aOrder[0].LclAfeValue) / 10) -
                            Number(aOrder[0].LclAfeValueSpent)

                        if (Number(budget) < Number(iRequest.data.AMOUNT)) {

                            // Order &1: Residual budget: &2 - Required in the mandate: &3
                            // Attention, for the internal Order & the budget has been exceeded

                            oResult.ERROR.push({
                                MTYPE: consts.ERROR, REF_FIELD: "AMOUNT",
                                TEXT: oBundle.getText("RESID_BUDGET", [iRequest.data.INT_ORDER, budget, iRequest.data.AMOUNT])
                            })

                            oResult.ERROR.push({
                                MTYPE: consts.ERROR, REF_FIELD: "AMOUNT",
                                TEXT: oBundle.getText("EXCEED_BUDGET", [iRequest.data.INT_ORDER])
                            })
                        }
                    }
                }

            } else {
                oResult.ERROR.push({
                    MTYPE: consts.ERROR, REF_FIELD: "INT_ORDER",
                    TEXT: oBundle.getText("INT_ORDER_NVAL")
                }) // Internal order is not valid
            }

        } else {

            if (oResult.REQ_INT_ORDER === true) {
                oResult.ERROR.push({
                    MTYPE: consts.ERROR, REF_FIELD: "INT_ORDER",
                    TEXT: oBundle.getText("INT_ORDER_MAND")
                }) // Internal order is mandatory.
            }

        }

        /////////////////////////////////////////////////////////////////////////////

        let aVendor = await EccServiceO2P.run(
            SELECT.from(VendorSet).where({ Lifnr: iRequest.data.VENDOR, Bukrs: oRequester.BUKRS }));

        if (aVendor.length > 0) {
            oResult.VENDOR_DESC = aVendor[0].Name1
        } else {
            //  Vendor does not exist or it is not created for company code &
            oResult.ERROR.push({
                MTYPE: consts.ERROR, REF_FIELD: "VENDOR",
                TEXT: oBundle.getText("VENDOR_NVAL", [oRequester.BUKRS])
            })
        }


        let aVendorBank = await EccServiceO2P.run(
            SELECT.from(VendorBankSet).where({ Lifnr: iRequest.data.VENDOR }));

        if (aVendorBank.length > 0) {
            for (let i = 0; i < aVendorBank.length; i++) {
                oResult.IBAN.push({ CODE: aVendorBank[i].Iban })
            }
        } else {

            if (iRequest.data.PAYMODE === consts.Paymode.BONIFICO) {
                oResult.ERROR.push({
                    MTYPE: consts.ERROR, REF_FIELD: "IBAN",
                    TEXT: oBundle.getText("NO_VENDOR_IBAN")
                }) // For Vendor selected there are no IBANs
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////

    let aAccountreq = await SELECT.from(Accountreq).
        where({
            REQUESTER_CODE: oRequest.REQUESTER_CODE
        });

    for (let i = 0; i < aAccountreq.length; i++) {
        if (aAccountreq[i].ACCOUNT_ADVANCE === true && iRequest.data.ID !== consts.firstId) {
            continue
        }

        oResult.ACCOUNT.push({
            CODE: aAccountreq[i].ACCOUNT,
            ACCOUNT: aAccountreq[i].ACCOUNT_TEXT,
            CONCAT_DESC: [aAccountreq[i].ACCOUNT, aAccountreq[i].ACCOUNT_TEXT].join(' - ')
        })

    }


    if (oResult.REQ_NOTE === true && !Boolean(iRequest.data.NOTE)) {
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "NOTE", TEXT: oBundle.getText("NOTE_MAND") }) // Note is mandatory. 
    }

    if (oResult.REQ_ATTRIBUZIONE === true && !Boolean(iRequest.data.ATTRIBUZIONE)) {
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "ATTRIBUZIONE", TEXT: oBundle.getText("ATTRIBUZIONE_MAND") }) // Attribuzione is mandatory. 
    }

    if (oResult.REQ_IBAN === true && !Boolean(iRequest.data.IBAN)) {
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "IBAN", TEXT: oBundle.getText("IBAN_MAND") }) // Iban is mandatory. 
    }

    if (oResult.REQ_REASON === true && !Boolean(iRequest.data.REASON)) {
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "REASON", TEXT: oBundle.getText("REASON_MAND") }) // Reason is mandatory. 
    }

    if (oResult.REQ_AMOUNT === true && !Boolean(Number(iRequest.data.AMOUNT))) {
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "AMOUNT", TEXT: oBundle.getText("AMOUNT_MAND") }) // Amount is mandatory. 
    }

    return oResult

}




async function getEccServices(request, servName) {

    const service = await cds.connect.to(servName);
    const response = await service.tx(request).run(request.query);
    return response;

}

async function getDocStatus(iRequest) {

    let aResult = []

    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID });

    let aDocument = await SELECT.from(Document).
        where({
            to_Request_REQUEST_ID: iRequest.data.REQUEST_ID
        }).orderBy('to_Request_REQUEST_ID asc', 'DOC_ID asc', 'ID asc');

    let aDocLog = await SELECT.from(Doclog).
        where({
            to_Request_REQUEST_ID: iRequest.data.REQUEST_ID
        }).orderBy('to_Request_REQUEST_ID asc', 'DOC_ID asc', 'LOG_TIME desc');


    let first001DocId = false
    let oResult = {}
    let lastId = ""
    let amountTot = 0
    let vendorDesc = ""
    let docType = ''
    let docNumber = ''
    let status = ''
    let statusText = ''


    var EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');
    const { VendorSet } = EccServiceO2P.entities;

    for (let i = 0; i < aDocument.length; i++) {

        if (aDocument[i].DOC_ID !== lastId) {

            lastId = aDocument[i].DOC_ID


            if (first001DocId === true) {
                aResult.push(oResult)

                vendorDesc = ""
                docType = ''
                docNumber = ''
                status = ''
                statusText = ''

            }


            let callECC = getEnvParam("CALL_ECC", false);
            if (callECC === "true") {

                let aVendor = await EccServiceO2P.run(
                    SELECT.from(VendorSet).where({ Lifnr: aDocument[i].VENDOR }));

                if (aVendor.length > 0) {
                    vendorDesc = aVendor[0].Name1
                }
            }


            let oDocLog

            let oDocProp = await getDocumentProp(iRequest.data.REQUEST_ID, aDocument[i].DOC_ID, iRequest.data.STEPID)

            if (oDocProp.creaType === 'A') {

                oDocLog = aDocLog.find(oDocLog => oDocLog.DOC_ID === aDocument[i].DOC_ID &&
                    oDocLog.CLEARING === false)

            }

            if (oDocProp.creaType === 'C') {

                oDocLog = aDocLog.find(oDocLog => oDocLog.DOC_ID === aDocument[i].DOC_ID &&
                    oDocLog.CLEARING === true)

            }


            if (oDocLog) {

                docType = oDocLog.DOC_TYPE
                docNumber = oDocLog.DOC_NUMBER
                status = oDocLog.STATUS
                statusText = oDocLog.STATUS_TEXT

            } else {

                docType = oDocProp.docType

            }


            oResult = {
                REQUEST_ID: iRequest.data.REQUEST_ID,
                DOC_ID: aDocument[i].DOC_ID,
                VENDOR: aDocument[i].VENDOR,
                VENDOR_DESC: vendorDesc,
                DOC_TYPE: docType,
                DOC_NUMBER: docNumber,
                STATUS: status,
                STATUS_TEXT: statusText

            }

            first001DocId = true

        }

        amountTot = Number(amountTot) + Number(aDocument[i].AMOUNT)
        oResult.AMOUNT_TOT = amountTot

        if (i === aDocument.length - 1) {
            aResult.push(oResult)
        }
    }

    return aResult

}

async function checkBeforeFIDocument(oDocumentHeader, aAccountPayable, aCurrencyAmount) {

    let callECC = getEnvParam("CALL_ECC", false);
    if (callECC === "true") {

        let EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');

        const { AccDocHeaderSet } = EccServiceO2P.entities;
        const { AccDocPositionSet } = EccServiceO2P.entities;
        const { VendorSet } = EccServiceO2P.entities;


        if (Boolean(aAccountPayable[0].VendorNo)) {

            let aVendor = await EccServiceO2P.run(
                SELECT.from(VendorSet).where({
                    Lifnr: aAccountPayable[0].VendorNo,
                    Bukrs: aAccountPayable[0].CompCode
                }));

            if (aVendor.length > 0 && aVendor[0].Reprf === 'X') {

                for (let i = 0; i < aCurrencyAmount.length; i++) {

                    let aAccDocHeader = await EccServiceO2P.run(
                        SELECT.from(AccDocHeaderSet).where({
                            Bldat: oDocumentHeader.DocDate,
                            Bukrs: oDocumentHeader.CompCode,
                            Xblnr: oDocumentHeader.RefDocNo.toUpperCase(),
                            Waers: aCurrencyAmount[i].Currency
                        }));

                    for (let x = 0; x < aAccDocHeader.length; x++) {

                        let shkzg = ''
                        let wrbtr = ''

                        if (aCurrencyAmount[i].AmtDoccur < 0) {
                            shkzg = 'H'
                            wrbtr = '-' + aCurrencyAmount[i].AmtDoccur.toString()
                        } else {
                            shkzg = 'S'
                            wrbtr = aCurrencyAmount[i].AmtDoccur.toString()
                        }

                        let aAccDocPosition = await EccServiceO2P.run(
                            SELECT.from(AccDocPositionSet).where({
                                Bukrs: aAccDocHeader[x].Bukrs,
                                Gjahr: aAccDocHeader[x].Gjahr,
                                // Koart: 'K',
                                Lifnr: aAccountPayable[0].VendorNo,
                                Wrbtr: wrbtr,
                                Shkzg: shkzg
                            }));

                        if (aAccDocPosition.length > 0) {
                            let previousDoc = [aAccDocPosition[0].Bukrs, aAccDocPosition[0].Belnr, aAccDocPosition[0].Gjahr].join(' ')
                            return ['Check whether document has already been entered under number', previousDoc].join(' ')
                        }

                    }
                }

            }
        }
    }

}

async function getDocumentProp(iRequestID, iDocID, iStep) {

    let exception_exist = false

    let oResult = { docType: "", docProcType: "", creaType: "" }

    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequestID });

    let aDocument = await SELECT.from(Document).
        where({
            to_Request_REQUEST_ID: iRequestID,
            DOC_ID: iDocID
        }).orderBy('DOC_ID asc', 'ID asc');

    if (aDocument.length === 0) {
        return oResult
    }

    //    Prima di valorizzare il tipo di documento che verrà creato (DOC_TYPE) ed il tipo di registrazione (PROC_DOC_TYPE), controllo se c'è un'eccezione per i conti utilizzati
    //   Se esistono più conti con eccezioni diverse verrà considerata solo la prima eccezione trovata

    let aAccountreq = await SELECT.from(Accountreq).
        where({
            REQUESTER_CODE: oRequest.REQUESTER_CODE
        });


    let oAccountreq = aAccountreq.find(oAccountreq => oAccountreq.ACCOUNT === aDocument[0].ACCOUNT)


    for (let i = 0; i < aAccountreq.length; i++) {

        let oDocparam = await SELECT.one.from(Docparam).
            where({
                PAYMENT_MODE_CODE: oRequest.PAYMENT_MODE_CODE,
                ACCOUNT: aAccountreq[i].ACCOUNT,
                STEP: iStep,
                ACCOUNT_ADVANCE: oAccountreq.ACCOUNT_ADVANCE,
                PRIORITY: oRequest.PRIORITY,
                URGENT: oRequest.URGENT
            });

        if (oDocparam && exception_exist === false) {

            exception_exist = true
            oResult.docType = oDocparam.DOC_TYPE
            oResult.docProcType = oDocparam.DOC_PROC_TYPE

        }

    }

    if (exception_exist === false) {
        //   Non esiste nessuna eccezione quindi procedo alla valorizzazione classica

        let oDocparam = await SELECT.one.from(Docparam).
            where({
                PAYMENT_MODE_CODE: oRequest.PAYMENT_MODE_CODE,
                ACCOUNT: '',
                STEP: iStep,
                ACCOUNT_ADVANCE: oAccountreq.ACCOUNT_ADVANCE,
                PRIORITY: oRequest.PRIORITY,
                URGENT: oRequest.URGENT
            });

        if (oDocparam) {
            oResult.docType = oDocparam.DOC_TYPE
            oResult.docProcType = oDocparam.DOC_PROC_TYPE
        }
    }

    if (Boolean(oResult.docType)) {
        if (((oResult.docType === consts.documentType.KA || oResult.docType === consts.documentType.KB) &&
            oResult.docProcType === "" &&
            oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL &&
            Boolean(aDocument[0].DOCUMENT_NUMBER)

        ) || ((oResult.docType === consts.documentType.KZ || oResult.docType === consts.documentType.KY) &&
            oResult.docProcType !== "S"
            )

        ) {
            oResult.creaType = 'C'
        } else {

            oResult.creaType = 'A'

        }



    }



    return oResult

}


async function fillTableFIDocument(iRequest, iDocProp) {

    let initiator = ''


    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID });

    let aDocument = await SELECT.from(Document).
        where({
            to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
            DOC_ID: iRequest.data.DOC_ID
        }).orderBy('DOC_ID asc', 'ID asc');


    let oRequester = await SELECT.one.from(Requester).
        where({ CODE: oRequest.REQUESTER_CODE });


    //  let oTree = await transcodeDocumentToTree(iRequest.data.REQUEST_ID, aDocument)



    let oApproval = await SELECT.one.from(ApprovalHistory).
        where({
            REQUEST_ID: iRequest.data.REQUEST_ID,
            VERSION: oRequest.VERSION,
            To_Action_ACTION: 'STARTED'
        });

    if (oApproval) {

        let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay).where({ MailDipendente: oApproval.REAL_MAIL }));
        if (oInfoWDPosition) {
            // initiator = oInfoWDPosition.UtenteSAP
        }
    }


    let oAccountreq = await SELECT.one.from(Accountreq).
        where({
            REQUESTER_CODE: oRequest.REQUESTER_CODE,
            ACCOUNT: aDocument[0].ACCOUNT,
        });


    // let oDocProp = await getDocumentProp(iRequest, "50")
    let oDocProp = iDocProp


    ////////////////////////////////////////////////////////////////////////////////
    // Header

    let oDocumentHeader = {}


    // if (oDocProp.docType === consts.documentType.KA || oDocProp.docType === consts.documentType.KB ) {

    if (Boolean(aDocument[0].DOCUMENT_NUMBER &&
        oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL)) {

    } else {

        oDocumentHeader = {

            BusAct: 'RFBU',
            Username: initiator,
            HeaderTxt: ['BPM', iRequest.data.REQUEST_ID].join(' '),
            CompCode: oRequester.BUKRS,
            DocDate: moment(oRequest.START_APPROVAL_FLOW).format('YYYYMMDD'),
            PstngDate: moment(new Date).format('YYYYMMDD'),
            TransDate: '00000000',
            DocType: oDocProp.docType,
            RefDocNo: aDocument[0].REF_ID,
            Vatdate: moment(new Date).format('YYYYMMDD'),
        }

    }
    // }


    //////////////////////////////////////////////////////////////////////////
    // Tables

    let aAccountPayable = []
    let aAccountGL = []
    let aCurrencyAmount = []

    let specialGLInd = ''
    let pmntTrms = ''
    let pymtMeth = ''
    let pmntBlock = ''
    let partnBnkType = ''
    let itemNo = 1
    let itemText = ''
    let allocNmbr = ''
    let valueDate = ''
    let refKey1 = ''
    let totAmount = 0



    for (let i = 0; i < aDocument.length; i++) {

        totAmount = Number(totAmount) + Number(aDocument[i].AMOUNT)
        totAmount = totAmount.toFixed(2)

    }


    if (oRequest.PRIORITY === true && oRequest.URGENT === true) {
        pymtMeth = 'C'
    } else {
        pymtMeth = '['
    }


    if (oDocProp.docType === consts.documentType.KA || oDocProp.docType === consts.documentType.KB) {

        if (Boolean(oAccountreq.SPECIAL_GL_IND)) {
            specialGLInd = oAccountreq.SPECIAL_GL_IND
        } else {
            if (Boolean(aDocument[0].SPECIAL_GL_IND)) {
                specialGLInd = aDocument[0].SPECIAL_GL_IND
            }
        }


        if (Boolean(aDocument[0].PARTN_BNK_TYPE)) {
            partnBnkType = aDocument[0].PARTN_BNK_TYPE
        }


        if (oDocProp.docProcType === 'V') {

            if (oRequest.PRIORITY === true) {
                pmntBlock = 'A'
            }


            if (aDocument[0].ACCOUNT === '4000100000' || oDocProp.docType === consts.documentType.KB) {


                aAccountPayable.push({
                    ItemnoAcc: '1',
                    VendorNo: aDocument[0].VENDOR,
                    CompCode: oRequester.BUKRS,
                    BlineDate: moment(new Date).format('YYYYMMDD'),
                    ItemText: aDocument[0].REASON,
                    SpGlInd: specialGLInd,
                    PartnerBk: partnBnkType,
                    AllocNmbr: moment(new Date).format('MM/YYYY'),
                    PmntBlock: pmntBlock
                })



            } else { // gestione KA


            }


            aAccountPayable.push({
                ItemnoAcc: '2',
                VendorNo: aDocument[0].VENDOR,
                CompCode: oRequester.BUKRS,
                BlineDate: moment(new Date).format('YYYYMMDD'),
                ItemText: aDocument[0].REASON,
                PartnerBk: partnBnkType,
                AllocNmbr: moment(new Date).format('MM/YYYY'),
                Pmnttrms: '1000',
                PymtMeth: pymtMeth,

            })



            let totAmountString = totAmount.toString()

            aCurrencyAmount.push({
                ItemnoAcc: '1',
                Currency: oRequest.WAERS_CODE,
                AmtDoccur: totAmountString,
                AmtBase: totAmountString
            })


            totAmountString = '-' + totAmountString

            aCurrencyAmount.push({
                ItemnoAcc: '2',
                Currency: oRequest.WAERS_CODE,
                AmtDoccur: totAmountString,
                AmtBase: totAmountString
            })




        } else { // gestione docProcType blank 


            if (!Boolean(oDocProp.docProcType)) {

                if (specialGLInd === '') {
                    pmntTrms = '1000'
                }

                if (oDocProp.docType !== consts.documentType.KB) {
                    pymtMeth = ''
                }


                aAccountPayable.push({
                    ItemnoAcc: '1',
                    VendorNo: aDocument[0].VENDOR,
                    CompCode: oRequester.BUKRS,
                    BlineDate: moment(new Date).format('YYYYMMDD'),
                    ItemText: aDocument[0].REASON,
                    SpGlInd: specialGLInd,
                    PartnerBk: partnBnkType,
                    AllocNmbr: moment(new Date).format('MM/YYYY'),
                    Pmnttrms: pmntTrms,
                    PymtMeth: pymtMeth
                })


                ////////////////////////////////////////////////////////////////



                if (oRequest.REQUESTER_CODE === 'COMMIS') {
                    refKey1 = aDocument[0].LOCATION
                }


                for (let i = 0; i < aDocument.length; i++) {

                    if (Boolean(aDocument[i].TEXT)) {
                        itemText = aDocument[i].TEXT
                    } else {
                        if (Boolean(aDocument[i].REASON)) {
                            itemText = aDocument[i].REASON
                        }
                    }

                    if (Boolean(aDocument[i].ATTRIBUZIONE)) {
                        allocNmbr = aDocument[i].ATTRIBUZIONE
                    } else {
                        allocNmbr = moment(new Date).format('MM/YYYY')
                    }


                    if (oDocProp.docType === consts.documentType.KA) {
                        if (Boolean(oRequest.EXPIRY_DATE)) {
                            valueDate = moment(oRequest.EXPIRY_DATE).format('YYYYMMDD')
                        }

                    } else {
                        if (Boolean(aDocument[i].VALUT)) {
                            valueDate = moment(aDocument[i].VALUT).format('YYYYMMDD')
                        }
                    }


                    itemNo = itemNo + 1
                    let itemNoString = itemNo.toString()

                    let riferimento = ''
                    if (Boolean(aDocument[i].RIFERIMENTO)) {
                        riferimento = aDocument[i].RIFERIMENTO
                    }

                    let refKey2 = ''
                    if (Boolean(aDocument[i].REFKEY2)) {
                        refKey2 = aDocument[i].REFKEY2
                    }


                    let taxCode = 'XX'

                    var EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');
                    const { GlAccountCompanySet } = EccServiceO2P.entities;


                    let aGlAccountCompany = await EccServiceO2P.run(SELECT.from(GlAccountCompanySet).where({
                        Saknr: aDocument[i].ACCOUNT,
                        Bukrs: oRequester.BUKRS
                    }))

                    if (aGlAccountCompany > 0 &&
                        !Boolean(aGlAccountCompany[0].Mitkz) &&
                        !Boolean(aGlAccountCompany[0].Mwskz)) {
                        taxCode = ''
                    }

                    let costCenter = ''
                    let orderId = ''

                    if (Boolean(aDocument[i].COST_CENTER)) { // 10 

                        costCenter = aDocument[i].COST_CENTER

                        if (Boolean(/^\d+$/.test(costCenter))) {
                            costCenter = aDocument[i].COST_CENTER.padStart(10, '0')
                        }

                    }

                    if (Boolean(aDocument[i].INT_ORDER)) { // 12
                        orderId = aDocument[i].INT_ORDER.padStart(12, '0')
                    }

                    aAccountGL.push({
                        ItemnoAcc: itemNoString,
                        GlAccount: aDocument[i].ACCOUNT,
                        ItemText: itemText,
                        TaxCode: taxCode,
                        Costcenter: costCenter,
                        PstngDate: moment(new Date).format('YYYYMMDD'),
                        ValueDate: valueDate,
                        Orderid: orderId,
                        AllocNmbr: allocNmbr,
                        RefKey3: riferimento,
                        RefKey2: refKey2,
                        RefKey1: refKey1,

                    })

                    aCurrencyAmount.push({
                        ItemnoAcc: itemNoString,
                        Currency: oRequest.WAERS_CODE,
                        AmtDoccur: aDocument[i].AMOUNT,
                        AmtBase: aDocument[i].AMOUNT
                    })


                }

                ///////////////////////////////////////////////////////////////  


                let totAmountString = totAmount.toString()
                totAmountString = '-' + totAmountString

                aCurrencyAmount.push({
                    ItemnoAcc: '1',
                    Currency: oRequest.WAERS_CODE,
                    AmtDoccur: totAmountString,
                    AmtBase: totAmountString
                })

            }

        }

    } else { //   docType diverso da KA e docType KB

    }

    oResult = {
        ObjKey: "",
        Simulate: iRequest.data.SIMULATE,
        ToDocumentHeader: oDocumentHeader,
        ToAccountGL: aAccountGL,
        ToAccountPayable: aAccountPayable,
        ToCurrencyAmount: aCurrencyAmount,
        ToAccReturn: []
    }

    return oResult

}


async function fillTableClearFIDocument(iRequest, iDocProp) {

    let valut = '00000000'
    //let wrbtr = '0.00'
    let vendorReg = ''
    let doctoclear1 = ''
    let totAmount = 0
    let kontoXref1 = ''
    let sgtxt = ''

    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID });

    let aDocument = await SELECT.from(Document).
        where({
            to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
            DOC_ID: iRequest.data.DOC_ID
        }).orderBy('DOC_ID asc', 'ID asc');


    let oAccountreq = await SELECT.one.from(Accountreq).
        where({
            REQUESTER_CODE: oRequest.REQUESTER_CODE,
            ACCOUNT: aDocument[0].ACCOUNT,
        });

    let oRequester = await SELECT.one.from(Requester).
        where({ CODE: oRequest.REQUESTER_CODE });

    let oPayMode = await SELECT.one.from(Paymode).
        where({ CODE: oRequest.PAYMENT_MODE_CODE });


    // let oDocProp = await getDocumentProp(iRequest, "60")

    let oDocProp = iDocProp

    if (Boolean(oRequest.VALUE_DATE)) {
        valut = moment(oRequest.VALUE_DATE).format('YYYYMMDD')
    } else {
        valut = moment(new Date).format('YYYYMMDD')
    }




    for (let i = 0; i < aDocument.length; i++) {

        totAmount = Number(totAmount) + Number(aDocument[i].AMOUNT)
        totAmount = totAmount.toFixed(2)

    }


    if (oDocProp.docType === 'KZ' && oDocProp.docProcType === 'V') {
        vendorReg = 'X'
    }


    if (oDocProp.docType === 'KA' || oDocProp.docType === 'KB') {
        if (oDocProp.docProcType === '') {

        }

        if (oDocProp.docProcType === 'V') {
            if (Boolean(oAccountreq.SPECIAL_GL_IND)) {
                specialGLInd = oAccountreq.SPECIAL_GL_IND
            } else {
                if (Boolean(aDocument[0].SPECIAL_GL_IND)) {
                    specialGLInd = aDocument[0].SPECIAL_GL_IND
                }
            }

        }
    }


    if (oDocProp.docType === 'KZ' || oDocProp.docType === 'KY') {
        if (oDocProp.docProcType === '' || oDocProp.docProcType === 'V') {

            let aDocLog = await SELECT.from(Doclog).
                where({
                    to_Request_REQUEST_ID: iRequest.data.REQUEST_ID, DOC_ID: iRequest.data.DOC_ID, STATUS: 'C'
                }).orderBy('to_Request_REQUEST_ID asc', 'DOC_ID asc', 'LOG_TIME desc');
            if (aDocLog.length > 0) {
                doctoclear1 = aDocLog[0].DOC_NUMBER
            }

            if (oRequest.PRIORITY_CURR === 'Y') {
                kontoXref1 = 'URGENTE'
            }

            if (Boolean(oRequest.BENEFICIARY_DATE)) {
                sgtxt = oPayMode.TREASURY_CODE + moment(oRequest.BENEFICIARY_DATE).format('MMYYYY')
            } else {

                sgtxt = oPayMode.TREASURY_CODE + moment(valut).format('MMYYYY')
            }

        }

        if (oDocProp.docProcType === 'S') { }
    }




    let oDocumentHeader = {
        Bldat: moment(new Date).format('YYYYMMDD'),
        Budat: moment(new Date).format('YYYYMMDD'),
        Blart: oDocProp.docType,
        Bukrs: oRequester.BUKRS,
        Waers: oRequest.WAERS_CODE,
        Konto: oRequest.BANK_ACCOUNT,
        Wrbtr: totAmount.toString(),
        Valut: valut,
        Augtx: '',
        Sgtxt: sgtxt,
        Xblnr: 'BPM' + iRequest.data.REQUEST_ID + iRequest.data.DOC_ID,
        Bktxt: 'BPM' + iRequest.data.REQUEST_ID,
        Gsber: '',
        Prctr: '',
        Zuonr: oPayMode.TREASURY_CODE,
        Agkon: aDocument[0].VENDOR,
        Agkoa: 'K',
        Doctoclear1: doctoclear1,
        Doctoclear2: '',
        Doctoclear3: '',
        KontoXref1: kontoXref1,
        KontoXref2: '',
        ObjKey: '',
        VendorReg: vendorReg
    }




    oResult = {
        ObjKey: "",
        ToDocumentHeader: oDocumentHeader,
        ToAccReturn: []
    }

    return oResult

}

async function isCreationStep(iRequest) {


    let oDocProp = await getDocumentProp(iRequest.data.REQUEST_ID, iRequest.data.DOC_ID, iRequest.data.STEPID)
    return oDocProp.creaType

}


async function createFIDocument(iRequest) {


    let aResult = []
    let aDocLog = []
    let error = false
    let errorText
    let oBodyReq = {}
    let urlPost = ""

    let callECC = getEnvParam("CALL_ECC", false);
    if (callECC === "true") {

        try {

            let oDocProp = await getDocumentProp(iRequest.data.REQUEST_ID, iRequest.data.DOC_ID, iRequest.data.STEPID)

            if (Boolean(iRequest.data.CLEARING)) {

                urlPost = "/sap/opu/odata/sap/ZFI_O2P_COMMON_SRV/ClearAccDocPostSet"

                oBodyReq = await fillTableClearFIDocument(iRequest, oDocProp)

            } else {

                urlPost = "/sap/opu/odata/sap/ZFI_O2P_COMMON_SRV/AccDocPostSet"

                oBodyReq = await fillTableFIDocument(iRequest, oDocProp)

                ////////////////////////////////////////////////////////////////////////

                /*
                let errPreviousDoc = await checkBeforeFIDocument(oDocumentHeader, aAccountPayable, aCurrencyAmount)
                if (Boolean(errPreviousDoc)) {
                    aResult.push({
                        MTYPE: consts.ERROR,
                        TEXT: errPreviousDoc
                    })
        
                    return aResult
                }
                    */

                ///////////////////////////////////////////////////////////////  

            }


            let oResponse = await new Promise(async (resolve, reject) => {

                client.executeHttpRequest(
                    { destinationName: 'ECC' },
                    {
                        method: 'POST',
                        url: urlPost,
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                            "Accept": "application/json"
                        },
                        data: oBodyReq,
                    }
                ).then((result) => {
                    resolve(result)
                }).catch((err) => {
                    reject(err)
                })
            })


            let aDocLog = []
            let error = false
            let errorText


            if (oResponse.data.d.ToAccReturn.results.length !== 0) {

                let aMessage = oResponse.data.d.ToAccReturn.results
                for (let i = 0; i < aMessage.length; i++) {

                    aResult.push({
                        MTYPE: consts.ERROR,
                        TEXT: aMessage[i].Message
                    })

                    if (!Boolean(errorText) &&
                        aMessage[i].Id !== 'RW' &&
                        aMessage[i].Number !== '609') {

                        errorText = aMessage[i].Message

                    }

                }

                error = true

            }

            if (!Boolean(iRequest.data.SIMULATE)) {

                if (error === false) { // success log

                    let compCode = oResponse.data.d.ObjKey.substring(14, 10);
                    let docNumber = oResponse.data.d.ObjKey.substring(0, 10);
                    let fiscYear = oResponse.data.d.ObjKey.substring(18, 14);



                    let aDocument = await SELECT.from(Document).
                        where({
                            to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                            DOC_ID: iRequest.data.DOC_ID
                        }).orderBy('DOC_ID asc', 'ID asc');


                    for (let i = 0; i < aDocument.length; i++) {

                        if (Boolean(iRequest.data.CLEARING)) {
                            aDocument[i].CLEARING_NUMBER = docNumber

                            let upsertDocument = await UPSERT.into(Document).entries(aDocument);

                            aDocLog.push({

                                to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                                DOC_ID: iRequest.data.DOC_ID,
                                LOG_TIME: new Date().toISOString(),
                                CREATOR_USER: iRequest.user.id,
                                DOC_TYPE: oDocProp.docType,
                                DOC_NUMBER: docNumber,
                                COMPANY_CODE: compCode,
                                FISCAL_YEAR: fiscYear,
                                STATUS: 'C',
                                STATUS_TEXT: '',
                                CLEARING: true
                            })

                            let upsertDocLog = await UPSERT.into(Doclog).entries(aDocLog);

                        } else {


                            aDocument[i].DOCUMENT_COMP_CODE = compCode
                            aDocument[i].DOCUMENT_NUMBER = docNumber
                            aDocument[i].DOCUMENT_FISCAL_YEAR = fiscYear

                            let upsertDocument = await UPSERT.into(Document).entries(aDocument);

                            aDocLog.push({

                                to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                                DOC_ID: iRequest.data.DOC_ID,
                                LOG_TIME: new Date().toISOString(),
                                CREATOR_USER: iRequest.user.id,
                                DOC_TYPE: oDocProp.docType,
                                DOC_NUMBER: docNumber,
                                COMPANY_CODE: compCode,
                                FISCAL_YEAR: fiscYear,
                                STATUS: 'C',
                                STATUS_TEXT: '',
                                CLEARING: false
                            })

                            let upsertDocLog = await UPSERT.into(Doclog).entries(aDocLog);

                        }
                    }


                } else // error log
                {

                    let clearing = false

                    if (Boolean(iRequest.data.CLEARING)) {
                        clearing = true
                    }

                    aDocLog.push({

                        to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                        DOC_ID: iRequest.data.DOC_ID,
                        LOG_TIME: new Date().toISOString(),
                        CREATOR_USER: iRequest.user.id,
                        DOC_TYPE: oDocProp.docType,
                        STATUS: 'E',
                        STATUS_TEXT: errorText,
                        CLEARING: clearing
                    })

                    let upsertDocLog = await UPSERT.into(Doclog).entries(aDocLog);

                }


            }




        } catch (error) {
            let errMEssage = "ERROR createFIDocument " + iRequest.data.REQUEST_ID + " :" + error.message;
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

    }


    return aResult

}


async function getAssignInfo(iRequest) {
    LOG.info("getAssignInfo");

    let reqData = await SELECT.one.from(Request).
        where({
            REQUEST_ID: iRequest.data.REQUEST_ID
        });

    if (reqData === null || reqData == undefined) {
        let errMEssage = "ERROR get request " + iRequest.data.REQUEST_ID + ". Request not found";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    let returninfo = {};
    returninfo.COMPILER_NAME = "";
    returninfo.MOTIVATION = "";

    if (reqData.OLD_COMPILER_FULLNAME) {
        returninfo.COMPILER_NAME = reqData.OLD_COMPILER_FULLNAME;
    } else {
        return returninfo;
    }

    let reqNote = await SELECT.one.from(Notes).
        where({
            to_Request_REQUEST_ID: reqData.REQUEST_ID,
            VERSION: reqData.VERSION,
            createdBy: reqData.OLD_COMPILER_MAIL
        });

    if (reqNote !== undefined && reqNote.NOTE !== null) {
        returninfo.MOTIVATION = reqNote.NOTE;
    }

    return returninfo;
}




module.exports = {
    createAttachment,
    readAttachment,
    deleteAttachment,
    createNote,
    readNote,
    deleteNote,
    getRejectInfo,
    updateRequest,
    getRejectorName,
    getRejectMotivation,
    getTemplate,
    getLayout,
    checkData,
    formatMonitoring,
    formatMonitoringDetail,
    formatDocument,
    fromDocumentToTree,
    fromRequestIdToTree,
    fromTreeToDocument,
    manageDocPopupData,
    getEccServices,
    createFIDocument,
    getDocStatus,
    getAssignInfo,
    isCreationStep

}