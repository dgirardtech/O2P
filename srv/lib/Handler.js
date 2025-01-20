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
const { updateMoaApprovers, insertApprovalHistory, getMoaApprovers } = require('./createProcess');
const { INSERT } = require('@sap/cds/lib/ql/cds-ql');
const { resolve } = require('path');
const { log } = require('console');
const { generateO2PF23Aut } = require('./HandlerPDF');






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

async function getNameMotivationAction(iRequest, iRequestId, iUserAction, iVersion) {

    let oldVersion = 0;

    let oResult = { name: "", motivation: "", createby: "" }

    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequestId });

    try {

        if (iVersion) {
            oldVersion = iVersion
        } else {
            if (oRequest.VERSION === 1) {
                oldVersion = oRequest.VERSION;
            } else {
                oldVersion = oRequest.VERSION - 1;
            }

        }


        let oApproval = await SELECT.one.from(ApprovalHistory).
            where({
                REQUEST_ID: oRequest.REQUEST_ID,
                VERSION: oldVersion,
                To_Action_ACTION: iUserAction
            });

        if (oApproval) {

            if (Boolean(oApproval.REAL_FULLNAME)) {
                oResult.name = oApproval.REAL_FULLNAME
            } else {
                oResult.name = oApproval.REAL_MAIL
            }

            oResult.createby = oApproval.REAL_MAIL

        }


        let oNotes = await SELECT.one.from(Notes).
            where({
                to_Request_REQUEST_ID: oRequest.REQUEST_ID,
                VERSION: oldVersion,
                TYPE: iUserAction.substring(0, 1)
            });

        if (oNotes) {
            oResult.motivation = oNotes.NOTE
        }


        return oResult


    } catch (error) {
        let errMEssage = "ERROR getNameMotivationAction: " + oRequest.REQUEST_ID + ". " + error.message;
        iRequest.error(450, errMEssage, oRequest, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

}



async function manageMainData(iRequest) {

    const oBundle = getTextBundle(iRequest);


    let oRequest = iRequest.data.request
    let aDocument = iRequest.data.document
    let aAttachment = iRequest.data.attachment


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
        VIS_SEND_TASK_BTN: false,
        VIS_SKIP_COORD: false,
        ERROR: []

    }


    let oRequester = await SELECT.one.from(Requester).
        where({ CODE: oRequest.REQUESTER_CODE });


    let actualStep = ''
    let oApproval = await SELECT.one.from(ApprovalHistory).
        where({
            REQUEST_ID: oRequest.REQUEST_ID,
            VERSION: oRequest.VERSION,
            To_Action_ACTION: 'READY'
        });

    if (oApproval) {
        actualStep = oApproval.STEP
    }


    if (oRequest.PRIORITY === true) {
        oResult.VIS_BENEFICIARY_DATE = true
        oResult.REQ_BENEFICIARY_DATE = true
    }


    //set check priority visibility
    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.BONIFICO) {
        oResult.VIS_PRIORITY = true
        oResult.VIS_ADD_CRO_MAIL = true
    }

    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.F24) {
        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_F24")
        oResult.VIS_EXPIRE_DATE = true
    }


    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.F23) {
        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_F23")
        oResult.VIS_EXPIRE_DATE = true
    }


    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.MAE) {
        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_MAE")
        oResult.VIS_EXPIRE_DATE = true
    }

    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.FLBONIFIC) {
        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_FLBONIFIC")
        oResult.VIS_EXPIRE_DATE = true
    }


    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL) {
        oResult.LAB_EXPIRE_DATE = oBundle.getText("LAB_EXPIRE_DATE_F24")
        oResult.VIS_EXPIRE_DATE = true

        oResult.VIS_F24_ENTRATEL_TYPE = true
        oResult.REQ_F24_ENTRATEL_TYPE = true

        /*
         if (oRequest.F24_ENTRATEL_TYPE_CODE === 'DEBTOFFSET') {
             oResult.VIS_F24_ENTRATEL_TYPE_CL_ACCOUNT = true
             oResult.REQ_F24_ENTRATEL_TYPE_CL_ACCOUNT = true
         }
             */


    }

    if (oRequester.SEND_TASK === true) {
        oResult.VIS_SEND_TASK_BTN = true
    }

    if (oResult.VIS_EXPIRE_DATE === true) {
        oResult.REQ_EXPIRE_DATE = true
    }


    if (actualStep === "10") {

        let aMoaApprovers = await getMoaApprovers(iRequest, oRequest.REQUEST_ID, iRequest.user.id);

        let oMoaApprovers30 = aMoaApprovers.find(oMoaApprovers => oMoaApprovers.INDEX === "30")
        if (oMoaApprovers30) {
            oResult.VIS_SKIP_COORD = true
        }

    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // check 1
    if (!Boolean(oRequest.TITLE)) {
        //"Title field is mandatory"
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "TITLE", TEXT: oBundle.getText("TITLE_MAND") })
    }

    // check 2
    if (!Boolean(oRequest.AREA_CODE)) {
        //"Area field is mandatory"
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "AREA", TEXT: oBundle.getText("AREA_MAND") })
    }

    // check 3
    if (Boolean(!oRequest.WAERS_CODE)) {
        //"Currency is mandatory"
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "WAERS_CODE", TEXT: oBundle.getText("CURR_MAND") })
    }
    else {
        let oCurrency = await SELECT.one.from(Currency).where({ code: oRequest.WAERS_CODE });

        if (!oCurrency) {
            // "Currency is not valid"
            oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "WAERS_CODE", TEXT: oBundle.getText("CURR_NVAL") })
        }
    }

    // check 4
    if (Boolean(!oRequest.PAYMENT_MODE_CODE)) {
        //"Payment mode is mandatory";
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "PAYMENT_MODE_CODE", TEXT: oBundle.getText("PAYMODE_MAND") })
    }


    // check 5
    if (Boolean(!oRequest.EXPIRY_DATE) && oResult.REQ_EXPIRE_DATE === true) {
        //"Expire Date is mandatory"
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "EXPIRY_DATE", TEXT: oBundle.getText("EXPIRY_DATE_MAND") })
    }


    // check 6 
    if (Boolean(!oRequest.TYPE_F24_ENTRATEL_CODE) && Boolean(oResult.REQ_F24_ENTRATEL_TYPE)) {
        //Attenzione, per gli F24 ENTRATEL è necessario indicare la tipologia
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "TYPE_F24_ENTRATEL_CODE", TEXT: oBundle.getText("F24_ENTRATEL_TYPE_MAND") })
    }

    // check 7
    if (Boolean(!oRequest.F24_ENTRATEL_CLEARING_ACCOUNT) && Boolean(oResult.REQ_F24_ENTRATEL_TYPE_CL_ACCOUNT)) {
        //"Attenzione, il conto di compensazione è un dato obbligatorio.
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "F24_ENTRATEL_CLEARING_ACCOUNT", TEXT: oBundle.getText("F24_ENTRATEL_TYPE_CL_ACCOUNT_MAND") })
    }


    // check 8
    if (oRequest.EXTRA_MANAGER_REQUIRED === true && actualStep === '20') {
        let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay).where({ MailDipendente: oRequest.EXTRA_MANAGER_NAME }));
        if (!oInfoWDPosition) {
            //"Further manager has been requested but not inserted
            oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "EXTRA_MANAGER_NAME", TEXT: oBundle.getText("EXTRA_MANAGER_NAME_MAND") })
        }
    }



    if (Boolean(!oRequest.BENEFICIARY_DATE) && oResult.REQ_BENEFICIARY_DATE === true) {
        //"For prior orders, insert a desired Beneficiary Date"
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "BENEFICIARY_DATE", TEXT: oBundle.getText("BEN_DATE_MAND") })
    }


    let maxRow = 0

    let oPayMode = await SELECT.one.from(Paymode).
        where({ CODE: oRequest.PAYMENT_MODE_CODE });
    if (oPayMode) {
        maxRow = oPayMode.MAX_ROW
    }


    let aDocCheck = []
    let oDocCheck = {}

    let first001DocId = false
    let lastId = ""
    let nRow = 0

    if (aDocument.length > 0) {

        for (let i = 0; i < aDocument.length; i++) {

            nRow = Number(nRow) + 1

            if (aDocument[i].DOC_ID !== lastId) {

                lastId = aDocument[i].DOC_ID

                if (first001DocId === true) {

                    oDocCheck.docId = lastId
                    oDocCheck.numRow = nRow
                    aDocCheck.push(oDocCheck)
                    oDocCheck = {}

                    nRow = 0

                }

                first001DocId = true
            }


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

            let oDocData = await manageDocPopupData(iDocData, true)


            let aError = oDocData.ERROR

            for (let x = 0; x < aError.length; x++) {
                oResult.ERROR.push(aError[x])
            }


            if (oDocData.CHECK_ATTACH_CAPI === true) {
                oDocCheck.checkAttachCapi = true
            }

            if (oDocData.IS_POSTAL_ACCOUNT === true) {
                oDocCheck.existPostalAccount = true
            } else {
                oDocCheck.existNotPostalAccount = true
            }


            if (oDocData.IS_ADVANCE_ACCOUNT === true) {
                oDocCheck.existAdvanceAccount = true
            } else {
                oDocCheck.existNotAdvanceAccount = true
            }


            if (i === aDocument.length - 1) {
                oDocCheck.docId = lastId
                oDocCheck.numRow = nRow
                aDocCheck.push(oDocCheck)
                oDocCheck = {}

                nRow = 0
            }

        }

    } else {

        //“Attenzione, inserire almeno un documento
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "DOCUMENT", TEXT: oBundle.getText("DOCUMENT_MAND") })

    }



    oDocCheck = aDocCheck.find(oDocCheck => oDocCheck.numRow > maxRow)
    if (oDocCheck) {
        // Paym. mode {0} does not allow to have more than {1} details for document
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "DOCUMENT", TEXT: oBundle.getText("MAX_ROW", [oPayMode.PAYMENT_NAME, oPayMode.MAX_ROW]) })

    }


    oDocCheck = aDocCheck.find(oDocCheck => oDocCheck.checkAttachCapi === true)
    if (oDocCheck) {
        let oAttachment = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.CAPI)
        if (!oAttachment) {
            //“Attenzione, per i conti che prevedono l’Ordine interno è necessario inserire l’allegato : Giustificativo Capitalizzazione”.
            oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "ATTACHMENTTYPE", TEXT: oBundle.getText("ATTACH_CAPI_MAND") })
        }
    }

    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.BONIFICO && oRequest.PRIORITY === true) {
        oDocCheck = aDocCheck.find(oDocCheck => oDocCheck.numRow > 1 && oDocCheck.existAdvanceAccount === true)
        if (oDocCheck) {
            //“Priority Orders with advances accounts admit only one row for document
            oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "DOCUMENT", TEXT: oBundle.getText("PRIO_ADVANCE") })
        }
    }



    /*
        if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.CCPOSTALE ||
            oRequest.PAYMENT_MODE_CODE === consts.Paymode.RAV) {
    
            oDocCheck = aDocCheck.find(oDocCheck => oDocCheck.existNotPostalAccount === true)
            if (oDocCheck) {
                // “Attenzione, ci sono dei documenti che non riportano le spese postali”
                oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "DOCUMENT", TEXT: oBundle.getText("NOT_POSTAL_ACCOUNT") })
            }
    
        } else {
    
            */

    oDocCheck = aDocCheck.find(oDocCheck => oDocCheck.existPostalAccount === true)
    if (oDocCheck) {
        // “Attenzione, ci sono dei documenti che riportano le spese postali”
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "DOCUMENT", TEXT: oBundle.getText("POSTAL_ACCOUNT") })
    }

    // }

    oDocCheck = aDocCheck.find(oDocCheck => oDocCheck.existNotAdvanceAccount === true &&
        oDocCheck.existAdvanceAccount === true)
    if (oDocCheck) {
        // It is not possible to create an order with documents referring to advances and "normal" document
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "DOCUMENT", TEXT: oBundle.getText("ADVANCE_AND_NOT_ACCOUNT") })

    }


    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.FLBONIFIC) {
        let oAttachment = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.FLBONIFIC)
        if (!oAttachment) {
            //“Attenzione, per il flusso bonifici è necessario allegare il relativo documento”.
            oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "ATTACHMENTTYPE", TEXT: oBundle.getText("ATTACH_FLBONIFIC_MAND") })
        }
    }


    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.F24) {
        let oAttachment = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.F24)
        if (!oAttachment) {
            //“Attenzione, per gli F24 è necessario allegare il relativo documento.
            oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "ATTACHMENTTYPE", TEXT: oBundle.getText("ATTACH_F24_MAND") })
        }
    }



    if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.F23) {
        let oAttachmentF23Conc = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.F23_CONC)
        let oAttachmentF23Uff = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.F23_UFF)
        let oAttachmentF23Vers = aAttachment.find(oAttachment => oAttachment.ATTACHMENTTYPE_ATTACHMENTTYPE === consts.attachmentTypes.F23_VERS)

        if (!oAttachmentF23Conc || !oAttachmentF23Uff || !oAttachmentF23Vers) {
            //    “Attenzione, per gli F23 è necessario allegare i documenti relativi”.
            oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "ATTACHMENTTYPE", TEXT: oBundle.getText("ATTACH_F23_MAND") })
        }
    }


    if (!Boolean(oRequest.SKIP_COORD_TEXT) && Boolean(oRequest.SKIP_COORD)) {
        // “E’ possibile saltare l’approvazione del Coordinatore solo inserendo una motivazione !
        oResult.ERROR.push({ MTYPE: consts.ERROR, REF_FIELD: "SKIP_COORD_TEXT", TEXT: oBundle.getText("SKIP_COORD_TEXT_MAND") })
    }



    return oResult

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
                TOT_AMOUNT: 0,



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

        oHeader.TOT_AMOUNT = Number(aDocument[i].AMOUNT) + Number(oHeader.TOT_AMOUNT)
        

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



async function manageDocPopupData(iRequest, fromMain) {

    var EccServiceAfe = await cds.connect.to('ZFI_AFE_COMMON_SRV');

    const { AfeSet } = EccServiceAfe.entities;
    const { AfeLocationSet } = EccServiceAfe.entities;
    const { CostCenterTextSet } = EccServiceAfe.entities;


    var EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');

    const { VendorBankSet } = EccServiceO2P.entities;
    const { VendorSet } = EccServiceO2P.entities;
    const { OrderTypeSet } = EccServiceO2P.entities;
    const { CostCenterCompanySet } = EccServiceO2P.entities;
    const { CostCenterSet } = EccServiceO2P.entities;





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
        IS_POSTAL_ACCOUNT: false,
        IS_ADVANCE_ACCOUNT: false,
        REQ_REASON: true,
        VIS_REASON: true,
        REQ_AMOUNT: true,
        VIS_AMOUNT: true,
        REQ_VENDOR: true,
        VIS_VENDOR: true,
        REQ_ACCOUNT: true,
        VIS_ACCOUNT: true,
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

        /*
        if(iRequest.data.ID === consts.firstId) {
            oResult.AccountSpecialGl = oAccountreq.SPECIAL_GL_IND 
            oResult.DocumentSpecialGl = oAccountreq.SPECIAL_GL_IND 
            oDocCheck.firstAccount = aDocument[i].ACCOUNT
        }
         */

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
            oResult.IS_ADVANCE_ACCOUNT = true
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

        if (oAccountreq.POSTAL_ACCOUNT === true) {
            oResult.IS_POSTAL_ACCOUNT = true
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


    let aError = []


    oResult.REF_ID = 'BPM' + iRequest.data.REQUEST_ID + iRequest.data.DOC_ID


    let callECC = getEnvParam("CALL_ECC", false);
    if (callECC === "true") {

        ///////////////// CHECK HEADER


        if (Boolean(iRequest.data.LOCATION)) {

            let aLocation = await EccServiceAfe.run(
                SELECT.from(AfeLocationSet).where({ Kunnr: iRequest.data.LOCATION, Objpos: '001' }));

            if (aLocation.length > 0) {
                oResult.LOCATION_DESC = aLocation[0].Stras
            }
            else {
                //"Location is not valid
                aError.push({
                    MTYPE: consts.ERROR, REF_TAB: "DOC_HEAD", REF_FIELD: "LOCATION",
                    TEXT: oBundle.getText("LOCATION_NVAL")
                })
            }
        }

        else {
            if (oResult.REQ_LOCATION === true) {
                //"Location is mandatory
                aError.push({
                    MTYPE: consts.ERROR, REF_TAB: "DOC_HEAD", REF_FIELD: "LOCATION",
                    TEXT: oBundle.getText("LOCATION_MAND")
                })
            }
        }

        ////////////////

        if (Boolean(iRequest.data.VENDOR)) {

            let aVendor = await EccServiceO2P.run(
                SELECT.from(VendorSet).where({ Lifnr: iRequest.data.VENDOR, Bukrs: oRequester.BUKRS }));

            if (aVendor.length > 0) {
                oResult.VENDOR_DESC = aVendor[0].Name1
            } else {
                //  Vendor does not exist or it is not created for company code &
                aError.push({
                    MTYPE: consts.ERROR, REF_TAB: "DOC_HEAD", REF_FIELD: "VENDOR",
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
                    // For Vendor selected there are no IBANs
                    aError.push({
                        MTYPE: consts.ERROR, REF_TAB: "DOC_HEAD", REF_FIELD: "IBAN",
                        TEXT: oBundle.getText("NO_VENDOR_IBAN")
                    })
                }
            }
        }

        else {

            if (Boolean(oResult.REQ_VENDOR)) {

                // Vendor is mandatory.
                aError.push({
                    MTYPE: consts.ERROR, REF_TAB: "DOC_HEAD", REF_FIELD: "VENDOR",
                    TEXT: oBundle.getText("VENDOR_MAND")
                })

            }
        }

    }

    /////////////////////

    if (oResult.REQ_IBAN === true && !Boolean(iRequest.data.IBAN)) {
        // Iban is mandatory. 
        aError.push({
            MTYPE: consts.ERROR, REF_TAB: "DOC_HEAD", REF_FIELD: "IBAN",
            TEXT: oBundle.getText("IBAN_MAND")
        })
    }

    //////////////////////////////

    if (oResult.REQ_REASON === true && !Boolean(iRequest.data.REASON)) {
        // Reason is mandatory. 
        aError.push({
            MTYPE: consts.ERROR, REF_TAB: "DOC_HEAD", REF_FIELD: "REASON",
            TEXT: oBundle.getText("REASON_MAND")
        })
    }


    if (Boolean(fromMain) && iRequest.data.ID !== consts.firstId) {
        aError = []
    }


    if (Boolean(fromMain)) {
        for (let i = 0; i < aError.length; i++) {
            if (aError[i].REF_TAB === "DOC_HEAD") {
                aError[i].TEXT = oBundle.getText("REF_DOC_HEAD", [iRequest.data.DOC_ID, aError[i].TEXT])
            }
        }
    }



    ///////////////////////////////////////////////////////////////////////////

    // CHECK ITEM

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

    if (oResult.REQ_ACCOUNT && !Boolean(iRequest.data.ACCOUNT)) {
        // Account is mandatory. 
        aError.push({
            MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "ACCOUNT",
            TEXT: oBundle.getText("ACCOUNT_MAND")
        })

    }

    ////////////////////////////////////////////////////////////

    if (Boolean(iRequest.data.COST_CENTER)) {

        let costCenter = iRequest.data.COST_CENTER

        if (Boolean(/^\d+$/.test(costCenter))) {
            costCenter = iRequest.data.COST_CENTER.padStart(10, '0')
        }


        let nowDate = moment(new Date).format('YYYYMMDD')

        let aCostCenterO2P = await EccServiceO2P.run(
            SELECT.from(CostCenterSet).where({ Kostl: costCenter, Datbi: { '>=': nowDate } }));

        if (aCostCenterO2P.length > 0) {

            let aCostCenterText = await EccServiceAfe.run(
                SELECT.from(CostCenterTextSet).where({ Kostl: costCenter }));

            if (aCostCenterText.length > 0) {

                oResult.COST_CENTER_DESC = aCostCenterText[0].Ltext

                // "if cost center the cost center is going to be closed soon then a warning message is triggered


                let difference = Number(aCostCenterO2P[0].Datbi) - Number(nowDate)

                if (difference <= 7) {
                    // The cost center {0} will be not valid from {1}
                    aError.push({
                        MTYPE: consts.WARNING, REF_TAB: "DOC_ITEM", REF_FIELD: "COST_CENTER",
                        TEXT: oBundle.getText("COST_CENTER_VALIDITY", [iRequest.data.COST_CENTER, aCostCenterO2P[0].Datbi])
                    })
                }

                let aCostCenterCompany = await EccServiceO2P.run(
                    SELECT.from(CostCenterCompanySet).where({
                        Kokrs: 'KPCA',
                        Prctr: aCostCenterO2P[0].Prctr,
                        Bukrs: oRequester.BUKRS
                    }));

                if (aCostCenterCompany.length === 0) {

                    let aCostCenterCompany = await EccServiceO2P.run(
                        SELECT.from(CostCenterCompanySet).where({
                            Kokrs: 'KPCA',
                            Prctr: aCostCenterO2P[0].Prctr
                        }));

                    if (aCostCenterCompany.length > 0) {
                        //   "If i have found at least one record then, it means that the profit center is valid for some companies but not mine
                        //   "If i don't find any record then it means that the profit center is valid for all companies

                        // Cost Center with Profit Center not valid for the current company code
                        aError.push({
                            MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "COST_CENTER",
                            TEXT: oBundle.getText("COST_CENTER_PRCTR_NVAL")
                        })

                    }
                }
            }
        }

        else {
            //"Cost Center is not valid"
            aError.push({
                MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "COST_CENTER",
                TEXT: oBundle.getText("COST_CENTER_NVAL")
            })
        }
    }

    else {

        if (oResult.REQ_COST_CENTER === true) {
            //"Cost Center is mandatory"
            aError.push({
                MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "COST_CENTER",
                TEXT: oBundle.getText("COST_CENTER_MAND")
            })
        }

    }

    /////////////////////////////////////////////////////////////


    if (Boolean(iRequest.data.INT_ORDER)) {

        let aOrder = await EccServiceAfe.run(
            SELECT.from(AfeSet).where({ Order: iRequest.data.INT_ORDER.padStart(12, '0') }));

        if (aOrder.length > 0) {
            oResult.INT_ORDER_DESC = aOrder[0].OrderName

            if (aOrder[0].Status !== "RELEASED") {
                //Attention, internal order is not in RELEASED status
                aError.push({
                    MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "INT_ORDER",
                    TEXT: oBundle.getText("INT_ORDER_NRELEASED")
                })
            }

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
                        aError.push({
                            MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "AMOUNT",
                            TEXT: oBundle.getText("RESID_BUDGET", [iRequest.data.INT_ORDER, budget, iRequest.data.AMOUNT])
                        })

                        // Attention, for the internal Order & the budget has been exceeded
                        aError.push({
                            MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "AMOUNT",
                            TEXT: oBundle.getText("EXCEED_BUDGET", [iRequest.data.INT_ORDER])
                        })
                    }
                }
            }

        } else {
            // Internal order is not valid
            aError.push({
                MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "INT_ORDER",
                TEXT: oBundle.getText("INT_ORDER_NVAL")
            })
        }

    } else {

        if (oResult.REQ_INT_ORDER === true) {
            // Internal order is mandatory.
            aError.push({
                MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "INT_ORDER",
                TEXT: oBundle.getText("INT_ORDER_MAND")
            })
        }

    }

    /////////////////////////////////////////////////////////////////////////////

    if (oResult.REQ_AMOUNT === true && !Boolean(Number(iRequest.data.AMOUNT))) {
        // Amount is mandatory. 
        aError.push({
            MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "AMOUNT",
            TEXT: oBundle.getText("AMOUNT_MAND")
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////


    if (oResult.REQ_NOTE === true && !Boolean(iRequest.data.NOTE)) {
        // Note is mandatory. 
        aError.push({
            MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "NOTE",
            TEXT: oBundle.getText("NOTE_MAND")
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////


    if (oResult.REQ_ATTRIBUZIONE === true && !Boolean(iRequest.data.ATTRIBUZIONE)) {
        // Attribuzione is mandatory. 
        aError.push({
            MTYPE: consts.ERROR, REF_TAB: "DOC_ITEM", REF_FIELD: "ATTRIBUZIONE",
            TEXT: oBundle.getText("ATTRIBUZIONE_MAND")
        })
    }

    /////////////////////////////////////////////////////////////////////////////


    if (Boolean(fromMain)) {
        for (let i = 0; i < aError.length; i++) {
            if (aError[i].REF_TAB === "DOC_ITEM") {
                aError[i].TEXT = oBundle.getText("REF_DOC_ITEM", [iRequest.data.DOC_ID, iRequest.data.ID, aError[i].TEXT])
            }
        }
    }


    /////////////////////////////////////////////////////////////////////////////

    oResult.ERROR = aError

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

            if (oDocProp.creaDocType === consts.creaDocType.ACCOUNTING) {

                oDocLog = aDocLog.find(oDocLog => oDocLog.DOC_ID === aDocument[i].DOC_ID &&
                    oDocLog.CLEARING === false && oDocLog.STEP === iRequest.data.STEPID)

            }

            if (oDocProp.creaDocType === consts.creaDocType.CLEARING) {

                oDocLog = aDocLog.find(oDocLog => oDocLog.DOC_ID === aDocument[i].DOC_ID &&
                    oDocLog.CLEARING === true && oDocLog.STEP === iRequest.data.STEPID)

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

async function checkBeforeFIDocument(iBodyReq) {


    let oDocumentHeader = iBodyReq.ToDocumentHeader
    let aAccountPayable = iBodyReq.ToAccountPayable
    let aCurrencyAmount = iBodyReq.ToCurrencyAmount



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

    let oResult = {
        docType: "",
        docProcType: "",
        transaction: "",
        creaDocType: "",
        secondStep: false,
        isCreationStep: ""
    }

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

    /*
    if (Boolean(oResult.docType)) {
        if (((oResult.docType === consts.documentType.KA || 
              oResult.docType === consts.documentType.KB) &&
            oResult.docProcType === "" &&
            oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL &&
            Boolean(aDocument[0].DOCUMENT_NUMBER)

        ) || ((oResult.docType === consts.documentType.KZ || oResult.docType === consts.documentType.KY) &&
            oResult.docProcType !== "S"
            )

        ) {
            oResult.creaDocType = consts.creaDocType.CLEARING 
        } else {

            oResult.creaDocType = consts.creaDocType.ACCOUNTING 

        }
    }
        */

    if (Boolean(oResult.docType)) {

        oResult.isCreationStep = 'X'

        if (oResult.docType === consts.documentType.KZ ||
            oResult.docType === consts.documentType.KY) {

            oResult.creaDocType = consts.creaDocType.CLEARING

            oResult.secondStep = true

            if (oResult.docProcType !== "S") {
                oResult.transaction = 'FBZ2'
            } else {
                oResult.transaction = 'FB01'
            }

        }

        else {

            oResult.creaDocType = consts.creaDocType.ACCOUNTING
            oResult.transaction = 'FB01'

            if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL &&
                // Boolean(aDocument[0].DOCUMENT_NUMBER)) {
                iStep === 60) {

                oResult.creaDocType = consts.creaDocType.CLEARING
                oResult.transaction = 'FBZ2'
                oResult.secondStep = true

            }

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


    let oPayMode = await SELECT.one.from(Paymode).
        where({ CODE: oRequest.PAYMENT_MODE_CODE });

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


    let oDocProp = iDocProp


    ////////////////////////////////////////////////////////////////////////////////
    // Header

    let oDocumentHeader = {}


    //  if (oDocProp.docType === consts.documentType.KA || oDocProp.docType === consts.documentType.KB) {

    /*
    if (Boolean(aDocument[0].DOCUMENT_NUMBER &&
        oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL)) {

    } else {
*/
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

    // }

    //  }

    /*
      if (oDocProp.docType === consts.documentType.KY || oDocProp.docType === consts.documentType.KZ) {
  
          if (oDocProp.docProcType === 'S') {
  
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
  
      }
          */

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


    if (oDocProp.docType === consts.documentType.KA || oDocProp.docType === consts.documentType.KB) {


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


        if (oDocProp.docType === consts.documentType.KY || oDocProp.docType === consts.documentType.KZ) {

            if (oDocProp.docProcType === 'S') {


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


                aAccountGL.push({
                    ItemnoAcc: '2',
                    GlAccount: oRequest.BANK_ACCOUNT,
                    ValueDate: oRequest.VALUE_DATE,
                    AllocNmbr: oPayMode.TREASURY_CODE,
                    ItemText: oPayMode.TREASURY_CODE +
                        moment(oRequest.VALUE_DATE).format('YYYYMMDD').substring(6, 8) +
                        moment(oRequest.VALUE_DATE).format('YYYYMMDD').substring(4, 6) +
                        moment(oRequest.VALUE_DATE).format('YYYYMMDD').substring(2, 4),
                    PstngDate: moment(new Date).format('YYYYMMDD'),


                })

                let index = 0

                for (let i = 0; i < aDocument.length; i++) {

                    let index = number(i) + 2

                    if (aDocument[i].ID !== consts.firstId) {

                        if (Boolean(aDocument[i].TEXT)) {
                            itemText = aDocument[i].TEXT
                        } else {
                            if (Boolean(aDocument[i].REASON)) {
                                itemText = aDocument[i].REASON
                            }
                        }

                        taxCode = 'XX'

                        aAccountGL.push({
                            ItemnoAcc: index.toString(),
                            GlAccount: aDocument[i].ACCOUNT,
                            ItemText: itemText,
                            TaxCode: taxCode,
                            Costcenter: aDocument[i].COST_CENTER,
                            Orderid: aDocument[i].INT_ORDER

                        })

                    }

                    let itemNoAccString = ""
                    if (aDocument[i].ID === consts.firstId) {
                        itemNoAccString = '1'
                    } else {
                        itemNoAccString = index.toString()
                    }

                    aCurrencyAmount.push({
                        ItemnoAcc: itemNoAccString,
                        Currency: oRequest.WAERS_CODE,
                        AmtDoccur: aDocument[i].AMOUNT,
                        AmtBase: aDocument[i].AMOUNT
                    })

                }

                let totAmountString = totAmount.toString()
                totAmountString = '-' + totAmountString

                aCurrencyAmount.push({
                    ItemnoAcc: '2',
                    Currency: oRequest.WAERS_CODE,
                    AmtDoccur: totAmountString,
                    AmtBase: totAmountString
                })


            }
        }

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
    let konto = ''

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

    let aDocLog = await SELECT.from(Doclog).
        where({
            to_Request_REQUEST_ID: iRequest.data.REQUEST_ID, DOC_ID: iRequest.data.DOC_ID, STATUS: 'C'
        }).orderBy('to_Request_REQUEST_ID asc', 'DOC_ID asc', 'LOG_TIME desc');


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





    if (oDocProp.docType === 'KA' || oDocProp.docType === 'KB') {
        if (oDocProp.docProcType === '') {

            if (oRequest.PAYMENT_MODE_CODE === consts.Paymode.ENTRATEL) {

                // if (oRequest.TYPE_F24_ENTRATEL_CODE === 'DEBTOFFSET') {
                //     konto = oRequest.F24_ENTRATEL_CLEARING_ACCOUNT
                // }
                //  else {
                konto = oRequest.BANK_ACCOUNT
                //  }


                if (Boolean(aDocument[0].VALUT)) {
                    valut = aDocument[0].VALUT.format('YYYYMMDD')
                } else {

                    if (Boolean(oRequest.VALUE_DATE)) {

                        if (Boolean(aDocument[0].DOCUMENT_NUMBER) &&
                            Boolean(aDocument[0].CLEARING_NUMBER)) {
                            valut = moment(oRequest.VALUE_DATE).format('YYYYMMDD')
                        }

                    }
                }


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

            if (oDocProp.docProcType === 'V') {
                vendorReg = 'X'
            }

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

        konto = oRequest.BANK_ACCOUNT
    }






    let oDocumentHeader = {
        Bldat: moment(new Date).format('YYYYMMDD'),
        Budat: moment(new Date).format('YYYYMMDD'),
        Blart: oDocProp.docType,
        Bukrs: oRequester.BUKRS,
        Waers: oRequest.WAERS_CODE,
        Konto: konto,
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

    return oDocProp.isCreationStep

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

            if (oDocProp.transaction === consts.transaction.FB01) {

                urlPost = "/sap/opu/odata/sap/ZFI_O2P_COMMON_SRV/AccDocPostSet"

                oBodyReq = await fillTableFIDocument(iRequest, oDocProp)

                ////////////////////////////////////////////////////////////////////////

                /*
                let errPreviousDoc = await checkBeforeFIDocument(oBodyReq)
                if (Boolean(errPreviousDoc)) {
                    aResult.push({
                        MTYPE: consts.ERROR,
                        TEXT: errPreviousDoc
                    })
        
                    return aResult
                }
                    */

                ///////////////////////////////////////////////////////////////  

            } else {

                urlPost = "/sap/opu/odata/sap/ZFI_O2P_COMMON_SRV/ClearAccDocPostSet"

                oBodyReq = await fillTableClearFIDocument(iRequest, oDocProp)

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

                let clearing = false
                if (Boolean(oDocProp.secondStep)) {
                    clearing = true
                }

                if (error === false) { // success log

                    let compCode = oResponse.data.d.ObjKey.substring(14, 10);
                    let docNumber = oResponse.data.d.ObjKey.substring(0, 10);
                    let fiscYear = oResponse.data.d.ObjKey.substring(18, 14);


                    let aDocument = await SELECT.from(Document).
                        where({
                            to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                            DOC_ID: iRequest.data.DOC_ID
                        }).orderBy('DOC_ID asc', 'ID asc');



                    let oResponseText = await new Promise(async (resolve, reject) => {

                        client.executeHttpRequest(
                            { destinationName: 'ECC' },
                            {
                                method: "POST",
                                url: "/sap/opu/odata/sap/ZFI_O2P_COMMON_SRV/StandardTextSet",
                                headers: {
                                    "Content-Type": "application/json; charset=utf-8",
                                    "Accept": "application/json"
                                },
                                data: {
                                    Id: '0003', Spras: 'I', Object: 'BELEG',
                                    Name: compCode + docNumber + fiscYear,
                                    Text: aDocument[0].REASON
                                },
                            }
                        ).then((result) => {
                            resolve(result)
                        }).catch((err) => {
                            reject(err)
                        })
                    })





                    for (let i = 0; i < aDocument.length; i++) {

                        if (Boolean(oDocProp.secondStep === true)) {

                            aDocument[i].CLEARING_NUMBER = docNumber

                        } else {

                            aDocument[i].DOCUMENT_COMP_CODE = compCode
                            aDocument[i].DOCUMENT_NUMBER = docNumber
                            aDocument[i].DOCUMENT_FISCAL_YEAR = fiscYear

                        }


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
                            CLEARING: clearing,
                            STEP: iRequest.data.STEPID
                        })

                        let upsertDocLog = await UPSERT.into(Doclog).entries(aDocLog);


                    }


                } else // error log
                {

                    aDocLog.push({

                        to_Request_REQUEST_ID: iRequest.data.REQUEST_ID,
                        DOC_ID: iRequest.data.DOC_ID,
                        LOG_TIME: new Date().toISOString(),
                        CREATOR_USER: iRequest.user.id,
                        DOC_TYPE: oDocProp.docType,
                        STATUS: 'E',
                        STATUS_TEXT: errorText,
                        CLEARING: clearing,
                        STEP: iRequest.data.STEPID
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
    updateRequest, 
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
    isCreationStep,
    manageMainData,
    getDocumentProp,
    transcodeDocumentToTree,
    getNameMotivationAction

}