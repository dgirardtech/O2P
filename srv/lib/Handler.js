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

    if (iRequest.data.PROCESSTYPE === consts.processType.Annuale ||
        iRequest.data.PROCESSTYPE === consts.processType.Cessazione
    ) {
        //Aggiornamento approvatori MOA
        let returnUpdateMoa = await updateMoaApprovers(requestId, userCompiler, iRequest, requestData.PROCESSTYPE_code);
        if (returnUpdateMoa.errors) {
            return returnUpdateMoa;
        }
    }

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

async function getYear(iRequest) {

    var aYear = []
    var date = new Date()

    aYear.push({ name: date.getFullYear() - 3, descr: date.getFullYear() - 3, code: date.getFullYear() - 3, })
    aYear.push({ name: date.getFullYear() - 2, descr: date.getFullYear() - 2, code: date.getFullYear() - 2, })
    aYear.push({ name: date.getFullYear() - 1, descr: date.getFullYear() - 1, code: date.getFullYear() - 1, })
    aYear.push({ name: date.getFullYear(), descr: date.getFullYear(), code: date.getFullYear() })
    aYear.push({ name: date.getFullYear() + 1, descr: date.getFullYear() + 1, code: date.getFullYear() + 1 })

    aYear.$count = aYear.length

    return aYear

}

async function getMonth(iRequest) {

    let aMonth = []
    let i = 0;

    do {

        let monthCode = new Date(1900, i).toLocaleString(iRequest.locale, { month: "2-digit" })

        let monthDesc = new Date(1900, i).toLocaleString(iRequest.locale, { month: "long" });
        monthDesc = monthDesc[0].toUpperCase() + monthDesc.slice(1);

        aMonth.push({
            name: monthDesc,
            descr: monthDesc,
            code: monthCode
        })

        i = i + 1;

    } while (i < 12);

    aMonth.$count = aMonth.length

    return aMonth

}


async function getSalesPoint(iRequest) {

    var EccService = await cds.connect.to('ZSI_SERVICE_STATION_GW_SRV');


    const { AgreementSet } = EccService.entities;

    let query = SELECT.from(AgreementSet).where(
        {
            MONTH: iRequest.data.MONTH,
            YEAR: iRequest.data.YEAR,
            COMPANY_CODE: 'IT02'
        })

    let aSalesPoint = await EccService.run(query);

    for (let i = 0; i < aSalesPoint.length; i++) {
        // aSalesPoint[i].ID = Number(i) + Number(1)
        aSalesPoint[i].ID = i
    }

    aSalesPoint.$count = aSalesPoint.length

    return aSalesPoint

}

async function getSalesPointCessation(iRequest) {

    var EccService = await cds.connect.to('ZSI_SERVICE_STATION_GW_SRV');


    const { CessationSet } = EccService.entities;

    let query = SELECT.from(CessationSet).where(
        {
            MONTH: iRequest.data.MONTH,
            YEAR: iRequest.data.YEAR,
            COMPANY_CODE: 'IT02'
        })

    let aSalesPoint = await EccService.run(query);

    for (let i = 0; i < aSalesPoint.length; i++) {
        // aSalesPoint[i].ID = Number(i) + Number(1)
        aSalesPoint[i].ID = i
    }

    aSalesPoint.$count = aSalesPoint.length

    return aSalesPoint

}

// async function getRevocManager(iRequest) {
async function getSalesPointRevocation(iRequest) {


    var EccService = await cds.connect.to('ZSI_SERVICE_STATION_GW_SRV');


    const { ZSI_SERVICE_STATION_GWSet } = EccService.entities;

    try {

        let query = SELECT.one.from(ZSI_SERVICE_STATION_GWSet).byKey(
            {
                SERV_SID: iRequest.data.SALES_POINT,
                SALES_ORG: 'IT01',
                DISTR_CH: '01',
                DIVISION: '01'
            })

        let response = await EccService.run(query);

    } catch (error) {
        let errMEssage = iRequest.data.SALES_POINT + ' unexists';
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    /////////////////////////////////////////////////////////////////////////////////

    var EccServiceDealer = await cds.connect.to('ZSI_SERV_STATION_DEALER_SRV');


    const { ZSI_SERV_STATION_DEALERSet } = EccServiceDealer.entities;

    ////////////////////////////////////////

    let queryDealer = SELECT.from(ZSI_SERV_STATION_DEALERSet).where(
        {
            SERV_SID: iRequest.data.SALES_POINT,
            OIL: true
        })

    // let responseDealerOil = await EccServiceDealer.run(queryDealer);

    ////////////////////////////////

    let queryDealerNotOil = SELECT.from(ZSI_SERV_STATION_DEALERSet).where(
        {
            SERV_SID: iRequest.data.SALES_POINT,
            OIL: false
        })

    let responseDealerNotOil = await EccServiceDealer.run(queryDealerNotOil);

    /////////////////////////////////////////

    // let aResponseDealer = [].concat(responseDealerNotOil, responseDealerOil);

    let aResponseDealer = responseDealerNotOil

    if (aResponseDealer.length === 0) {
        let errMEssage = 'No dealers for ' + iRequest.data.SALES_POINT + ' sales point';
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    ///////////////////////////////////////////////////////

    var EccServiceDealerGenData = await cds.connect.to('ZSERVICE_STATION_SRV');
    const { GeneralDataSet } = EccServiceDealerGenData.entities;

 
//////////////////////////////////////////////////////////////////////////////////////

    let aSalesPoint = []


    for (let i = 0; i < aResponseDealer.length; i++) {


        let queryDealerGenData = SELECT.one.from(GeneralDataSet).byKey(
            {
                Kunnr: aResponseDealer[i].CODE 
            })
    
        let responseDealerGenData = await EccServiceDealerGenData.run(queryDealerGenData);

        aSalesPoint.push({
            ID: i,
            SALES_POINT: aResponseDealer[i].SERV_SID,
            CUSTOMER_NAME: aResponseDealer[i].NAME,
            DEALER: aResponseDealer[i].CODE,
            TAX_CODE: responseDealerGenData.Stceg

        })
    }

    aSalesPoint.$count = aSalesPoint.length

    return aSalesPoint

    /////////////////////////////////////////////////////////////



    /*
        const { PVDealerRevSet } = EccService.entities;
    
        let query = SELECT.from(PVDealerRevSet).where(
            {
                SALES_POINT: iRequest.data.SALES_POINT 
            })
    
            */

    /////////////////////////////////////////////////////
    /* let aSalesPoint = []
    
     if (iRequest.data.PV === "00PV001569") {
 
         aSalesPoint = [
             {
                 "SALES_POINT": "00PV001569", "CUSTOMER_NAME": "ACISTAR NOVE SAS 62",
                 "DEALER": "0020337982", "TAX_CODE": "05379160962"
             },
             {
                 "SALES_POINT": "00PV001569", "CUSTOMER_NAME": "ACISTAR NOVE SAS 63",
                 "DEALER": "0020337983", "TAX_CODE": "05379160963"
             },
             {
                 "SALES_POINT": "00PV001569", "CUSTOMER_NAME": "ACISTAR NOVE SAS 64",
                 "DEALER": "0020337984", "TAX_CODE": "05379160964"
             }
         ]
     }
 
 
     if (iRequest.data.PV === "00PV001570") {
         aSalesPoint = [
             {
                 "SALES_POINT": "00PV001570", "CUSTOMER_NAME": "ACISTAR NOVE SAS 65",
                 "DEALER": "0020337985", "TAX_CODE": "05379160965"
             }
         ]
     } */

    /*
    00PV000001	V.LE DELL'OCEANO INDIANO	ROMA	V.LE DELL'OCEANO INDIANO	RM	00144
    00PV000002	V.LE DELL'OCEANO INDIANO 13	ROMA	V.LE DELL'OCEANO INDIANO 13	RM	00144
    00PV000003	TAMOIL ITALIA SPA  (14)	MILANO	VIA ANDREA COSTA 17	MI	20131
    00PV000004	SERVIZI & GESTIONI ITALIA S.R.	GENOVA	LUNGOMARE CANEPA, 2 R	GE	16149
    00PV000005	STRUPPA 113/A	GENOVA	STRUPPA 113/A	GE	16165
    00PV000006	SECONDO RICHIESTA	*	SECONDO RICHIESTA	GE	16100
    00PV000007	SERVIZI & GESTIONI ITALIA SRL	GENOVA	C.SO ITALIA/VIA MINZONI	GE	16145
    00PV000008	SERVIZI & GESTIONI ITALIA SRL	BOGLIASCO	VIA AURELIA KM 512+025	GE	16031
    00PV000009	P.ZZA ERNESTO SAVIO	GENOVA	P.ZZA ERNESTO SAVIO	GE	16152
    

    aSalesPoint.$count = aSalesPoint.length

    return aSalesPoint

    */
}


/*
async function getSalesPointRevocation(iRequest) {

    var EccService = await cds.connect.to('ZSI_SERVICE_STATION_GW_SRV');


    const { AgreementSet } = EccService.entities;

    let query = SELECT.from(AgreementSet).where(
        {
            MONTH: iRequest.data.MONTH,
            YEAR: iRequest.data.YEAR,
            COMPANY_CODE: 'IT02'
        })

    let aSalesPoint = await EccService.run(query);

    for (let i = 0; i < aSalesPoint.length; i++) {
        aSalesPoint[i].ID = i
    }

    aSalesPoint.$count = aSalesPoint.length

    return aSalesPoint

}
*/


async function getTemplate(iRequest) {

return '1'

var i = 1
const fs = require('fs');

var vBuffer = fs.readFileSync('srv/Template_ListaCessatiO2P.xlsx')
//var bufferOne = vBuffer.toString('base64');
var oOutput = 

{

    CONTENT   : vBuffer.toString() ,
    MEDIATYPE : 'xlsx',
    CONTENTSTRING: vBuffer.toString('base64') 

}

return oOutput
 
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
    getSalesPoint,
    getSalesPointRevocation,
    getSalesPointCessation,
    getTemplate,
    getYear,
    getMonth

}