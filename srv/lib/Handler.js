const LOG = cds.log('KupitO2PSrv');
const _ = require('underscore');
const moment = require('moment');

const consts = require("./Constants");
const { getEnvParam, getTextBundle } = require('./Utils');
const { getMoaApprovers } = require('./createProcess');
const { generateO2PAccounting } = require('./HandlerPDF');
const { getDocumentProp, getDocumentDetail } = require('./ManageDocument')
const {  sendAllMail } = require('./MailHandler');


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






async function getMonitorRequest(iRequest, next) {

    let aResponse = await next()

    if (aResponse.length === 0) {
        return aResponse
    }

    if (!Boolean(aResponse[0].REQID)) {
        return aResponse
    }

    let aSplit = iRequest.entity.split('.');
    let entity = aSplit[1]

    let now = moment(new Date());

    let aFilter = await getClearingFilter(iRequest);


    for (let i = 0; i < aResponse.length; i++) {


        if (aFilter.length > 0) {

            // let requestId = aResponse[i].REQUEST_ID

            let requestId = aResponse[i].REQID

            let oClearingStatus = await getClearingStatus(requestId);

            let oFilter = aFilter.find(oFilter => oFilter.field === oClearingStatus.field
                // &&  oFilter.value === "true"
            )
            if (!oFilter) {
                aResponse = aResponse.filter(oResponse => oResponse.REQID !== requestId)
                continue
            }

            aResponse[i].NC = oClearingStatus.NC
            aResponse[i].PC = oClearingStatus.PC
            aResponse[i].OC = oClearingStatus.OC

        }


        if (entity === 'MonitorRequest') {

            let started = moment(aResponse[i].ASSIGNED_AT);
            let dayDiff = now.diff(started, 'days')

            aResponse[i].DAYS_SPENT = dayDiff;

            if (aResponse[i].STATUS_code === consts.requestStatus.Refused ||
                aResponse[i].STATUS_code === consts.requestStatus.Deleted ||
                aResponse[i].STATUS_code === consts.requestStatus.Completed) {
                aResponse[i].DAYS_SPENT = 0;
                aResponse[i].STEP_TO_END = 0;
                aResponse[i].SHOW_ASSIGNED_AT = false;
            }

        }

    }


    return aResponse

}






async function manageDocPopupData(iRequest, fromMain) {

    var EccServiceAfe = await cds.connect.to('ZFI_AFE_COMMON_SRV');

    const { AfeSet } = EccServiceAfe.entities;
    const { AfeLocationSet } = EccServiceAfe.entities;
    const { CostCenterTextSet } = EccServiceAfe.entities;


    var EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');

    const { VendorBankSet } = EccServiceO2P.entities;
    const { TibanSet } = EccServiceO2P.entities;
    const { VendorSet } = EccServiceO2P.entities;
    const { VendorCompanySet } = EccServiceO2P.entities;

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

            let oVendorCompany = await EccServiceO2P.run(
                SELECT.one.from(VendorCompanySet).columns(['Bukrs'])
                    .where({ Lifnr: iRequest.data.VENDOR, Bukrs: oRequester.BUKRS }));


            if (oVendorCompany) {

                let oVendor = await EccServiceO2P.run(
                    SELECT.one.from(VendorSet).columns(['Name1'])
                        .where({ Lifnr: iRequest.data.VENDOR }));

                oResult.VENDOR_DESC = oVendor.Name1

            } else {
                //  Vendor does not exist or it is not created for company code &
                aError.push({
                    MTYPE: consts.ERROR, REF_TAB: "DOC_HEAD", REF_FIELD: "VENDOR",
                    TEXT: oBundle.getText("VENDOR_NVAL", [oRequester.BUKRS])
                })
            }


            let aVendorBank = await EccServiceO2P.run(
                SELECT.from(VendorBankSet).columns(['Lifnr', 'Banks', 'Bankl', 'Bankn','Bvtyp'])
                    .where({ Lifnr: iRequest.data.VENDOR }));



            for (let i = 0; i < aVendorBank.length; i++) {

                let oTibanSet = await EccServiceO2P.run(
                    SELECT.one.from(TibanSet).columns(['Banks', 'Bankl', 'Bankn', 'Iban'])
                        .where({
                            Banks: aVendorBank[i].Banks,
                            Bankl: aVendorBank[i].Bankl,
                            Bankn: aVendorBank[i].Bankn
                        }));

                if (oTibanSet) {
                    oResult.IBAN.push({
                        CODE: oTibanSet.Iban,
                        PARTN_BNK_TYPE: aVendorBank[i].Bvtyp
                    })
                }
            }


            if (oResult.IBAN.length === 0) {

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

        let oCostCenter = await EccServiceO2P.run(
            SELECT.one.from(CostCenterSet).columns(['Datbi', 'Prctr']).where({ Kostl: costCenter, Datbi: { '>=': nowDate } }));

        if (oCostCenter) {

            let aCostCenterText = await EccServiceAfe.run(
                SELECT.from(CostCenterTextSet).where({ Kostl: costCenter }));

            if (aCostCenterText.length > 0) {

                oResult.COST_CENTER_DESC = aCostCenterText[0].Ltext

                // "if cost center the cost center is going to be closed soon then a warning message is triggered


                let difference = Number(oCostCenter.Datbi) - Number(nowDate)

                if (difference <= 7) {
                    // The cost center {0} will be not valid from {1}
                    aError.push({
                        MTYPE: consts.WARNING, REF_TAB: "DOC_ITEM", REF_FIELD: "COST_CENTER",
                        TEXT: oBundle.getText("COST_CENTER_VALIDITY", [iRequest.data.COST_CENTER, oCostCenter.Datbi])
                    })
                }

                let oCostCenterCompany = await EccServiceO2P.run(
                    SELECT.one.from(CostCenterCompanySet).columns(['Bukrs']).where({
                        Kokrs: 'KPCA',
                        Prctr: oCostCenter.Prctr,
                        Bukrs: oRequester.BUKRS
                    }));

                if (!oCostCenterCompany) {

                    let oCostCenterCompany = await EccServiceO2P.run(
                        SELECT.one.from(CostCenterCompanySet).columns(['Bukrs']).where({
                            Kokrs: 'KPCA',
                            Prctr: oCostCenter.Prctr
                        }));

                    if (oCostCenterCompany) {
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

            let oOrderType = await EccServiceO2P.run(
                SELECT.one.from(OrderTypeSet).columns(['Aprof']).where({ Auart: aOrder[0].OrderType }));
            if (oOrderType) {
                if (oOrderType.Aprof === '000050') {

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

                let oVendor = await EccServiceO2P.run(
                    SELECT.one.from(VendorSet).columns(['Name1']).
                        where({ Lifnr: aDocument[i].VENDOR }));

                if (oVendor) {
                    vendorDesc = oVendor.Name1
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

async function getClearingFilter(iRequest) {

    let aResponse = []

    if (Boolean(iRequest._queryOptions) && Boolean(iRequest._queryOptions.$filter)) {

        let aSplit = iRequest._queryOptions.$filter.split(' and ')

        for (let i = 0; i < aSplit.length; i++) {

            if (aSplit[i].substring(0, 2) === 'PC' ||
                aSplit[i].substring(0, 2) === 'NC' ||
                aSplit[i].substring(0, 2) === 'OC') {

                if (aSplit[i].substring(6) === "true") {
                    aResponse.push({ field: aSplit[i].substring(0, 2), value: aSplit[i].substring(6) })
                }

            }
        }
    }

    return aResponse

}

async function getClearingStatus(iRequestId) {

    let oResult = {
        NC: false,
        PC: false,
        OC: false,
        field: ""
    }


    let docNum = 0
    let docClearCount = 0


    let oRequest = await SELECT.one.from(Request).
        where({
            REQUEST_ID: iRequestId
        });

    let aDocument = await SELECT.from(Document).
        where({
            to_Request_REQUEST_ID: oRequest.REQUEST_ID
        }).orderBy('DOC_ID asc', 'ID asc')


    let aDoclog = await SELECT.from(Doclog).
        where({
            to_Request_REQUEST_ID: oRequest.REQUEST_ID,
            // STATUS: 'C'
        })


    let aAccountreq = await SELECT.from(Accountreq).
        where({
            REQUESTER_CODE: oRequest.REQUESTER_CODE
        });



    let EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');

    const { AccDocPosVendClearSet } = EccServiceO2P.entities;



    for (let x = 0; x < aDocument.length; x++) {
        if (Boolean(aDocument[x].DOCUMENT_NUMBER)) {

            docNum = docNum + 1

            // let oAccountreq = aAccountreq.find(oAccountreq => oAccountreq.ACCOUNT === aDocument[x].ACCOUNT)

            let oDoclog = aDoclog.find(oDoclog => oDoclog.DOC_NUMBER === aDocument[x].DOCUMENT_NUMBER)


            let oAccDocPosVendClearSet

            if (aDocument[x].ACCOUNT_ADVANCE === true) {

                oAccDocPosVendClearSet = await EccServiceO2P.run(
                    SELECT.one.from(AccDocPosVendClearSet).columns(['Augbl']).where({
                        Belnr: aDocument[x].DOCUMENT_NUMBER,
                        Bukrs: aDocument[x].DOCUMENT_COMP_CODE,
                        Gjahr: aDocument[x].DOCUMENT_FISCAL_YEAR,
                        Bschl: '31'
                    }));


            } else {

                oAccDocPosVendClearSet = await EccServiceO2P.run(
                    SELECT.one.from(AccDocPosVendClearSet).columns(['Augbl']).where({
                        Belnr: aDocument[x].DOCUMENT_NUMBER,
                        Bukrs: aDocument[x].DOCUMENT_COMP_CODE,
                        Gjahr: aDocument[x].DOCUMENT_FISCAL_YEAR

                    }));

            }

            try {

                if (oAccDocPosVendClearSet) {


                    if (oDoclog.DOC_TYPE === 'KA' || oDoclog.DOC_TYPE === 'KB') {
                        docClearCount = docClearCount + 1
                    }

                } else {

                    if (oDoclog.DOC_TYPE === 'KZ' || oDoclog.DOC_TYPE === 'KY') {
                        docClearCount = docClearCount + 1
                    }

                }


            } catch (error) {
                let errMEssage = error.message
                // iRequest.error(450, errMEssage, null, 450);
                // LOG.error(errMEssage);
                // return iRequest;
            }

        }
    }


    if (docClearCount === 0 && docNum > 0) {
        oResult.NC = true
        oResult.field = 'NC'
    } else {
        if (docClearCount > 0 && docClearCount < docNum) {
            oResult.PC = true
            oResult.field = 'PC'
        } else {
            if (docClearCount > 0 && docClearCount === docNum) {
                oResult.OC = true
                oResult.field = 'OC'
            }
        }
    }

    if (!Boolean(oResult.field)) {
        oResult.NC = true
        oResult.field = 'NC'
    }

    return oResult

}



async function isCreationStep(iRequest) {


    let oDocProp = await getDocumentProp(iRequest.data.REQUEST_ID, iRequest.data.DOC_ID, iRequest.data.STEPID)

    return oDocProp.isCreationStep

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

async function isTest(iRequest) {

    let result = false

    if (Boolean(iRequest._queryOptions) && Boolean(iRequest._queryOptions.$filter)) {

        let aSplit = iRequest._queryOptions.$filter.split(' and ')

        for (let i = 0; i < aSplit.length; i++) {

            if (aSplit[i].substring(0, 4) === 'TEST') {

                if (aSplit[i].substring(8) === "true") {
                    result = true
                }

            }
        }
    }

    return result

}

async function enrichCountingSend(iRequest, iCounting) {

    const oBundle = getTextBundle(iRequest);

    let aCounting = iCounting

    let save = true

    let test = await isTest(iRequest)
    if (Boolean(test)) {
        save = false
    }


    for (let x = 0; x < aCounting.length; x++) {


      //  let oResponseSendAllMail = await sendAllMail(iRequest, consts.mailId.COUNTING)


    }




    return aCounting
}

async function enrichCountingCreate(iRequest, iCounting) {

    const oBundle = getTextBundle(iRequest);

    let aCounting = iCounting

    let save = true

    let test = await isTest(iRequest)
    if (Boolean(test)) {
        save = false
    }


    for (let x = 0; x < aCounting.length; x++) {

        let oDocumentDetail = await getDocumentDetail(aCounting[x].REQUEST_ID, aCounting[x].DOC_ID)


        //  if (Boolean(oDocumentDetail.augbl) && Boolean(oDocumentDetail.xblnr) && oDocumentDetail.blart === 'ZP') {
        if (Boolean(oDocumentDetail.augbl) && Boolean(oDocumentDetail.xblnr)) { // per test


            let o2pAccounting = await generateO2PAccounting(iRequest, oDocumentDetail, save)

            let aError = o2pAccounting.error

            if (aError.length > 0) {

                aCounting[x].RESULT_TYPE = consts.ERROR
                aCounting[x].RESULT_TEXT = oBundle.getText("CRO_NOT_CREATED",
                    [oDocumentDetail.requestId, oDocumentDetail.docId, oDocumentDetail.documentNumber, aError.join(' , ')])


            } else {

                aCounting[x].RESULT_TYPE = consts.SUCCESS
                aCounting[x].RESULT_TEXT = oBundle.getText("CRO_CREATED",
                    [oDocumentDetail.requestId, oDocumentDetail.docId, oDocumentDetail.documentNumber])

            }

        } else {

            aCounting[x].RESULT_TYPE = consts.ERROR
            aCounting[x].RESULT_TEXT = oBundle.getText("CRO_NOT_AVAILABLE",
                [oDocumentDetail.requestId, oDocumentDetail.documentNumber])

        }
    }


    if (aCounting.length === 0) {

        aCounting.push({
            REQUEST_ID: '',
            DOC_ID: '',
            RESULT_TYPE: consts.ERROR,
            RESULT_TEXT: oBundle.getText("CRO_NOT_REQUEST")
        })

    }

    return aCounting

}



module.exports = {
    createAttachment,
    readAttachment,
    deleteAttachment,
    createNote,
    readNote,
    deleteNote,
    updateRequest,
    getMonitorRequest,
    manageDocPopupData,
    getEccServices,
    getDocStatus,
    getAssignInfo,
    isCreationStep,
    manageMainData,
    getNameMotivationAction,
    getClearingStatus,
    getClearingFilter,
    enrichCountingCreate,
    enrichCountingSend

}