const LOG = cds.log('KupitO2PSrv');
const client = require('@sap-cloud-sdk/http-client');
const connectivity = require('@sap-cloud-sdk/connectivity');
const _ = require('underscore');
const moment = require('moment');
const consts = require("./Constants");
const SequenceHelper = require("./SequenceHelper");
const { convertAmount } = require('./ConvertCurrency');
const { getEnvParam, getTextBundle } = require('./Utils');
const { row, forEach, not, number } = require('mathjs');
const { RequestBuilder } = require('@sap-cloud-sdk/odata-v2');
const { xDnsPrefetchControl } = require('helmet');
const { updateMoaApprovers, insertApprovalHistory } = require('./createProcess');



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



async function getLayout(iRequest) {

    //let requester   = iRequest.data.REQUESTER
    // let paymentMode = iRequest.data.PAYMENT_MODE
    // let F24EntratelType =  iRequest.data.F24_ENTRATEL_TYPE
    // let priority = iRequest.data.PRIORITY


    const oBundle = getTextBundle(iRequest);


    let visPriority = false
    let visAddCroMail = false
    let visBeneficiaryDate = false
    let labExpireDate = ''
    let visExpireDate = false
    let visF24EntratelTypeClAccount = false
    let visF24EntratelType = false

    let oRequester = await SELECT.one.from(Requester).
        where({ CODE: iRequest.data.REQUESTER });

    /*
if (!oRequester) {
    let errMEssage = "ERROR get layout " + iRequest.data.REQUESTER + ". Requester not found";
    iRequest.error(450, errMEssage, null, 450);
    LOG.error(errMEssage);
    return iRequest;
}
    */


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
        visPriority = true
        visAddCroMail = true
    }

    if (iRequest.data.PRIORITY === true) {
        visBeneficiaryDate = true
    }


    if (iRequest.data.PAYMENT_MODE === consts.Paymode.F24) {

        labExpireDate = oBundle.getText("LAB_EXPIRE_DATE_F24")
        visExpireDate = true

    }

    if (iRequest.data.PAYMENT_MODE === consts.Paymode.F23) {

        labExpireDate = oBundle.getText("LAB_EXPIRE_DATE_F23")
        visExpireDate = true

    }

    if (iRequest.data.PAYMENT_MODE === consts.Paymode.MAV) {

        labExpireDate = oBundle.getText("LAB_EXPIRE_DATE_MAV")
        visExpireDate = true

    }

    if (iRequest.data.PAYMENT_MODE === consts.Paymode.FLBONIFIC) {

        labExpireDate = oBundle.getText("LAB_EXPIRE_DATE_FLBONIFIC")
        visExpireDate = true

    }


    if (iRequest.data.PAYMENT_MODE === consts.Paymode.ENTRATEL) {

        labExpireDate = oBundle.getText("LAB_EXPIRE_DATE_F24")
        visExpireDate = true

        visF24EntratelType = true

        if (iRequest.data.F24_ENTRATEL_TYPE === 'DEBTOFFSET') {
            visF24EntratelTypeClAccount = true
        }

    }


    return {
        VIS_PRIORITY: visPriority,
        VIS_ADD_CRO_MAIL: visAddCroMail,
        VIS_EXPIRE_DATE: visExpireDate,
        LAB_EXPIRE_DATE: labExpireDate,
        VIS_BENEFICIARY_DATE: visBeneficiaryDate,
        VIS_F24_ENTRATEL_TYPE: visF24EntratelType,
        VIS_F24_ENTRATEL_TYPE_CL_ACCOUNT: visF24EntratelTypeClAccount

    }


}

async function checkData(iRequest) {

    const oBundle = getTextBundle(iRequest);


    let oRequest = iRequest.data.request;
    let aDocument = iRequest.data.document




    if (!oRequest.TITLE) {
        let errMEssage = oBundle.getText("TITLE_MAND") //"Title field is mandatory";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);

    }

    if (!oRequest.AREA_CODE) {
        let errMEssage = oBundle.getText("AREA_MAND")  //"Area field is mandatory";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);

    }



    if (!oRequest.WAERS_code) {
        let errMEssage = oBundle.getText("CURR_MAND") //"Currency is mandatory";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);

    } else {


        let oCurrencies = await SELECT.one.from(Currencies).
            where({ code: oRequest.WAERS_code });
        if (!oCurrencies) {
            let errMEssage = oBundle.getText("CURR_NVAL")// "Currency is not valid";
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);

        }
    }

    if (!oRequest.PAYMENT_MODE_CODE) {
        let errMEssage = oBundle.getText("PAYMODE_MAND") //"Payment mode is mandatory";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
    }

    if (oRequest.PRIORITY === true && !oRequest.BENEFICIARY_DATE) {
        let errMEssage = oBundle.getText("BEN_DATE_MAND") //"For prior orders, insert a desired Beneficiary Date";
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
    }



    // da rivedere controllo totali
    /* if (aDocument) {
         let errMEssage = "Order with total amount null!";
         iRequest.error(450, errMEssage, null, 450);
         LOG.error(errMEssage);
     } */

    return iRequest;

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


async function formatMonitoring(iData, iRequest) {
    LOG.info("formatMonitorng");
    try {
        let now = moment(new Date());
        //let requestID = new Array();

        iData.forEach(data => {
            let started = moment(data.ASSIGNED_AT);
            let dayDiff = now.diff(started, 'days')
            data.DAYS_SPENT = dayDiff;

            if (data.to_Status_code === consts.requestStatus.Refused ||
                data.to_Status_code === consts.requestStatus.Deleted ||
                data.to_Status_code === consts.requestStatus.Completed) {
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



async function fromDocumentToTree(iRequest) {

    let oHeader = {}
    let oResult = {}
    let first001DocId = false

    let aDocument = iRequest.data.DOCUMENT


    oResult.HEADER = []

    for (let i = 0; i < aDocument.length; i++) {
        if (aDocument[i].ID == 1) {

            oResult.REQUEST_ID = aDocument[i].to_Request_REQUEST_ID

            if (first001DocId === true) {
                oResult.HEADER.push(oHeader)
            }

            oHeader = {

                DOC_ID: aDocument[i].DOC_ID,
                VENDOR: aDocument[i].VENDOR,
                VENDOR_NAME: "",
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
            AMOUNT: aDocument[i].AMOUNT

        })

        if (i === aDocument.length - 1) {
            oResult.HEADER.push(oHeader)
        }

    }


    return oResult


}
async function fromRequestIdToTree(iRequest) {

    let oHeader = {}
    let oResult = {}
    let first001DocId = false


    let aDocument = await SELECT.from(Document).
        where({ to_Request_REQUEST_ID: iRequest.data.REQUEST_ID }).orderBy('DOC_ID asc', 'ID asc');

    oResult.REQUEST_ID = iRequest.data.REQUEST_ID
    oResult.HEADER = []

    for (let i = 0; i < aDocument.length; i++) {
        if (aDocument[i].ID == 1) {

            if (first001DocId === true) {
                oResult.HEADER.push(oHeader)
            }

            oHeader = {

                DOC_ID: aDocument[i].DOC_ID,
                VENDOR: aDocument[i].VENDOR,
                VENDOR_NAME: "",
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
            AMOUNT: aDocument[i].AMOUNT

        })

        if (i === aDocument.length - 1) {
            oResult.HEADER.push(oHeader)
        }

    }


    return oResult

}



async function fromTreeToDocument(iRequest) {

    let aResult = [] 

    let aHeader = iRequest.data.DOC_TREE.HEADER

    for (let i = 0; i < aHeader.length; i++) {

        let aPosition = aHeader[i].POSITION

        for (let x = 0; x < aPosition.length; x++) {

            aResult.push({
                DOC_ID: aHeader[i].DOC_ID,
                VENDOR: aHeader[i].VENDOR,
                //  VENDOR_NAME : aHeader[i].VENDOR_NAME 
                REASON: aHeader[i].REASON,
                ID: aPosition[x].ID,
                ACCOUNT: aPosition[x].ACCOUNT,
                COST_CENTER: aPosition[x].COST_CENTER,
                INT_ORDER: aPosition[x].INT_ORDER,
                AMOUNT: aPosition[x].AMOUNT
            })
        }

    }

    return aResult

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
    fromDocumentToTree,
    fromRequestIdToTree,
    fromTreeToDocument

}