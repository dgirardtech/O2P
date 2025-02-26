const LOG = cds.log('KupitO2PSrv');
const _ = require('underscore');
const moment = require('moment');
const client = require('@sap-cloud-sdk/http-client');
const consts = require("./Constants");
const { getEnvParam } = require('./Utils');




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

    var EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');
    const { TibanSet } = EccServiceO2P.entities;
    const { VendorBankSet } = EccServiceO2P.entities;

    let aHeader = iRequest.data.DOC_TREE.HEADER

    for (let i = 0; i < aHeader.length; i++) {

        let aPosition = aHeader[i].POSITION

        for (let x = 0; x < aPosition.length; x++) {

            let partnBnkType = ''

            if (Boolean(aHeader[i].IBAN) && Boolean(aHeader[i].VENDOR)) {

                let aVendorBank = await EccServiceO2P.run(
                    SELECT.from(VendorBankSet).columns(['Lifnr', 'Banks', 'Bankl', 'Bankn', 'Bvtyp'])
                        .where({ Lifnr: aHeader[i].VENDOR }));

                for (let z = 0; z < aVendorBank.length; z++) {

                    let oTibanSet = await EccServiceO2P.run(
                        SELECT.one.from(TibanSet).columns(['Banks', 'Bankl', 'Bankn', 'Iban'])
                            .where({
                                Banks: aVendorBank[z].Banks,
                                Bankl: aVendorBank[z].Bankl,
                                Bankn: aVendorBank[z].Bankn,
                                Iban: aHeader[i].IBAN
                            }));


                    if (oTibanSet) {
                        partnBnkType = aVendorBank[z].Bvtyp
                        break
                    }
                }

            }

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

                // PARTN_BNK_TYPE: aHeader[i].PARTN_BNK_TYPE,
                PARTN_BNK_TYPE: partnBnkType,
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
                ACCOUNT_ADVANCE: aPosition[x].ACCOUNT_ADVANCE,

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

                let oVendor = await EccServiceO2P.run(
                    SELECT.one.from(VendorSet).columns(['Name1']).
                        where({ Lifnr: aDocument[i].VENDOR }));

                if (oVendor) {
                    vendorDesc = oVendor.Name1
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
                CRO: aDocument[i].CRO,
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
            ACCOUNT_ADVANCE: aDocument[i].ACCOUNT_ADVANCE,
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



async function formatDocument(iData, iRequest) {

    let callECC = getEnvParam("CALL_ECC", false);
    if (callECC === "true") {

        var EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');
        const { VendorSet } = EccServiceO2P.entities;



        for (let i = 0; i < iData.length; i++) {

            let oVendor = await EccServiceO2P.run(
                SELECT.one.from(VendorSet).columns(['Name1']).
                    where({ Lifnr: iData[i].VENDOR }));

            if (oVendor) {
                iData[i].VENDOR_DESC = oVendor.Name1
            }


        }

    }


}


async function createFIDocument(iRequest) {


    let aResult = []
    let aDocLog = []
    let error = false
    let errorText
    let oBodyReq = {}
    let urlPost = ""


    let oRequest = await SELECT.one.from(Request).
        where({ REQUEST_ID: iRequest.data.REQUEST_ID });

    let aAccountreq = await SELECT.from(Accountreq).
        where({
            REQUESTER_CODE: oRequest.REQUESTER_CODE
        });





    let callECC = getEnvParam("CALL_ECC", false);
    if (callECC === "true") {

        try {

            let oDocProp = await getDocumentProp(iRequest.data.REQUEST_ID, iRequest.data.DOC_ID, iRequest.data.STEPID)

            if(Boolean(oDocProp.isCreationStep)) {

            if (oDocProp.transaction === consts.transaction.FB01) {

                urlPost = "/sap/opu/odata/sap/ZFI_O2P_COMMON_SRV/AccDocPostSet"

                oBodyReq = await fillTableFIDocument(iRequest, oDocProp)

                ////////////////////////////////////////////////////////////////////////

                let noCheckFIDocument = getEnvParam("NO_CHECK_FI_DOCUMENT", false);
                if (noCheckFIDocument !== "true") {


                    let errPreviousDoc = await checkBeforeFIDocument(oBodyReq)
                    if (Boolean(errPreviousDoc)) {
                        aResult.push({
                            MTYPE: consts.ERROR,
                            TEXT: errPreviousDoc
                        })

                        return aResult
                    }
                }

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

                            let oAccountreq = aAccountreq.find(oAccountreq => oAccountreq.ACCOUNT === aDocument[i].ACCOUNT)
                            aDocument[i].ACCOUNT_ADVANCE = oAccountreq.ACCOUNT_ADVANCE

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

        } else {

 
            aResult.push({
                MTYPE: consts.ERROR,
                TEXT: 'No Creation Step'
            })
             

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

async function getDocumentDetail(iRequestId, iDocId) {

    let oDocument = await SELECT.one.from(Document).
        where({
            to_Request_REQUEST_ID: iRequestId,
            DOC_ID: iDocId
        })


    let oResult = {
        augbl: '',
        xblnr: '',
        blart: '',
        valut: '',
        batch: '',
        datum: '',
        uiban: '',
        executionDate: '',
        bukrs: oDocument.DOCUMENT_COMP_CODE,
        requestId: iRequestId,
        docId: iDocId,
        documentNumber: oDocument.DOCUMENT_NUMBER
    }


    let EccServiceO2P = await cds.connect.to('ZFI_O2P_COMMON_SRV');

    const { AccDocPosVendClearSet } = EccServiceO2P.entities;
    const { AccDocHeaderSet } = EccServiceO2P.entities;
    const { WorkingDaySet } = EccServiceO2P.entities;
    const { PaySettlementSet } = EccServiceO2P.entities;


    let oAccDocPosVendClear


    if (oDocument.ACCOUNT_ADVANCE === true) {

        oAccDocPosVendClear = await EccServiceO2P.run(
            SELECT.one.from(AccDocPosVendClearSet).columns(['Augbl', 'Bukrs', 'Gjahr'])
                .where({
                    Belnr: oDocument.DOCUMENT_NUMBER,
                    Bukrs: oDocument.DOCUMENT_COMP_CODE,
                    Gjahr: oDocument.DOCUMENT_FISCAL_YEAR,
                    Lifnr: oDocument.VENDOR,
                    Bschl: '31'
                }));


    } else {

        oAccDocPosVendClear = await EccServiceO2P.run(
            SELECT.one.from(AccDocPosVendClearSet).columns(['Augbl', 'Bukrs', 'Gjahr'])
                .where({
                    Belnr: oDocument.DOCUMENT_NUMBER,
                    Bukrs: oDocument.DOCUMENT_COMP_CODE,
                    Gjahr: oDocument.DOCUMENT_FISCAL_YEAR,
                    Lifnr: oDocument.VENDOR
                }));

    }

    // per TEST 
    let fakeClearDoc = getEnvParam("FAKE_CLEAR_DOC", false);
    if (fakeClearDoc) {

        let aSplit = fakeClearDoc.split(',')

        oAccDocPosVendClear = { Bukrs: aSplit[0], Augbl: aSplit[1], Gjahr: aSplit[2] }

        // oAccDocPosVendClear = { Bukrs: 'IT02', Augbl : '5210674586', Gjahr : '2021'}

    }


    if (oAccDocPosVendClear) {

        oResult.augbl = oAccDocPosVendClear.Augbl


        let oAccDocHeader = await EccServiceO2P.run(
            SELECT.one.from(AccDocHeaderSet).columns(['Xblnr', 'Blart', 'Bktxt']).where({
                Belnr: oAccDocPosVendClear.Augbl,
                Bukrs: oAccDocPosVendClear.Bukrs,
                Gjahr: oAccDocPosVendClear.Gjahr
            }));

        if (oAccDocHeader) {

            oResult.xblnr = oAccDocHeader.Xblnr
            oResult.blart = oAccDocHeader.Blart

            let checkOk = false
            if (fakeClearDoc) {
                if (Boolean(oAccDocHeader.Xblnr)) {
                    checkOk = true
                }
            } else {
                if (Boolean(oAccDocHeader.Xblnr) && oAccDocHeader.Blart === 'ZP') {
                    checkOk = true
                }
            }


            if (Boolean(checkOk)) {

                // oAccDocHeader.Bktxt = '20240519-EST01'

                oResult.datum = oAccDocHeader.Bktxt.substring(0, 8)
                oResult.batch = oAccDocHeader.Bktxt.substring(9, 14)



                let oPaySettlement = await EccServiceO2P.run(
                    SELECT.one.from(PaySettlementSet).columns(['Uiban']).where({
                        Laufd: oResult.datum,
                        Laufi: oResult.batch,
                        Vblnr: oAccDocPosVendClear.Augbl
                    }));
                if (oPaySettlement) {
                    oResult.uiban = oPaySettlement.Uiban
                }

                const { AccDocPositionSet } = EccServiceO2P.entities;

                let oAccDocPosition = await EccServiceO2P.run(
                    SELECT.one.from(AccDocPositionSet).columns(['Valut']).where({
                        Belnr: oAccDocPosVendClear.Augbl,
                        Bukrs: oAccDocPosVendClear.Bukrs,
                        Gjahr: oAccDocPosVendClear.Gjahr,
                        Koart: 'S'
                    }));

                if (oAccDocPosition) {

                    oResult.valut = oAccDocPosition.Valut

                    let oWorkingDay = await EccServiceO2P.run(
                        SELECT.one.from(WorkingDaySet).byKey({
                            IDate: oResult.valut,
                            IDays: '-1',
                            ICalendar1: 'IT',
                            ICalendar2: ''
                        }));

                    if (oWorkingDay) {
                        oResult.executionDate = oWorkingDay.Edate
                    }
                }
            }
        }
    }


    return oResult
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
        const { VendorCompanySet } = EccServiceO2P.entities;


        if (Boolean(aAccountPayable[0].VendorNo)) {

            let oVendor = await EccServiceO2P.run(
                SELECT.one.from(VendorCompanySet).where({
                    Lifnr: aAccountPayable[0].VendorNo,
                    Bukrs: aAccountPayable[0].CompCode
                }));

            if (oVendor.length > 0 && oVendor.Reprf === 'X') {

                for (let i = 0; i < aCurrencyAmount.length; i++) {

                    let aAccDocHeader = await EccServiceO2P.run(
                        SELECT.from(AccDocHeaderSet).columns(['Bukrs', 'Belnr', 'Gjahr']).where({
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

                        let oAccDocPosition = await EccServiceO2P.run(
                            SELECT.one.from(AccDocPositionSet).columns(['Bukrs', 'Belnr', 'Gjahr']).where({
                                Belnr: aAccDocHeader[x].Belnr,
                                Bukrs: aAccDocHeader[x].Bukrs,
                                Gjahr: aAccDocHeader[x].Gjahr,
                                Koart: 'K',
                                Lifnr: aAccountPayable[0].VendorNo,
                                Wrbtr: wrbtr,
                                Shkzg: shkzg
                            }));

                        if (oAccDocPosition) {
                            let previousDoc = [oAccDocPosition.Bukrs, oAccDocPosition.Belnr, oAccDocPosition.Gjahr].join(' ')
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


    let aDocparam = await SELECT.from(Docparam).
    where({
        PAYMENT_MODE_CODE: oRequest.PAYMENT_MODE_CODE, 
        STEP: iStep,
        ACCOUNT_ADVANCE: oAccountreq.ACCOUNT_ADVANCE,
        PRIORITY: oRequest.PRIORITY,
        URGENT: oRequest.URGENT
    });

    let oDocparam = ''

    for (let i = 0; i < aDocument.length; i++) {

        let oDocparam = aDocparam.find(oDocparam => oDocparam.ACCOUNT === aDocument[i].ACCOUNT)


        if (oDocparam && exception_exist === false) {

            exception_exist = true
            oResult.docType = oDocparam.DOC_TYPE
            oResult.docProcType = oDocparam.DOC_PROC_TYPE

        }

    }

    if (exception_exist === false) {
        //   Non esiste nessuna eccezione quindi procedo alla valorizzazione classica

         oDocparam = aDocparam.find(oDocparam => oDocparam.ACCOUNT === '')

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

    if (!oResult.docProcType ) {
        oResult.docProcType = ""
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
        TransDate: consts.initialDate,
        DocType: oDocProp.docType,
        RefDocNo: aDocument[0].REF_ID,
        Vatdate: consts.initialDate,
        InvoiceRecDate: consts.initialDate
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
                    PmntBlock: pmntBlock,
                    TaxDate: consts.initialDate
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
                TaxDate: consts.initialDate

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
                    PymtMeth: pymtMeth,
                    TaxDate: consts.initialDate
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


                    let oGlAccountCompany = await EccServiceO2P.run(
                        SELECT.one.from(GlAccountCompanySet).columns(['Mitkz', 'Mwskz']).where({
                            Saknr: aDocument[i].ACCOUNT,
                            Bukrs: oRequester.BUKRS
                        }))

                    if (oGlAccountCompany &&
                        !Boolean(oGlAccountCompany.Mitkz) &&
                        !Boolean(oGlAccountCompany.Mwskz)) {
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
                        AsvalDate: consts.initialDate,
                        BillingPeriodStartDate: consts.initialDate,
                        BillingPeriodEndDate: consts.initialDate
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
                    PymtMeth: pymtMeth,
                    TaxDate: consts.initialDate
                })


                aAccountGL.push({
                    ItemnoAcc: '2',
                    GlAccount: oRequest.BANK_ACCOUNT,
                    ValueDate: moment(oRequest.VALUE_DATE).format('YYYYMMDD'),
                    AllocNmbr: oPayMode.TREASURY_CODE,
                    ItemText: oPayMode.TREASURY_CODE +
                        moment(oRequest.VALUE_DATE).format('YYYYMMDD').substring(6, 8) +
                        moment(oRequest.VALUE_DATE).format('YYYYMMDD').substring(4, 6) +
                        moment(oRequest.VALUE_DATE).format('YYYYMMDD').substring(2, 4),
                    PstngDate: moment(new Date).format('YYYYMMDD'),
                    AsvalDate: consts.initialDate,
                    BillingPeriodStartDate: consts.initialDate,
                    BillingPeriodEndDate: consts.initialDate


                })

                let index = 0

                for (let i = 0; i < aDocument.length; i++) {

                    let index = Number(i) + 2

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
                            Orderid: aDocument[i].INT_ORDER,
                            AsvalDate: consts.initialDate,
                            BillingPeriodStartDate: consts.initialDate,
                            BillingPeriodEndDate: consts.initialDate,
                            ValueDate: consts.initialDate,
                            PstngDate: consts.initialDate
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

    let valut = consts.initialDate
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


module.exports = {
    transcodeDocumentToTree,
    fromTreeToDocument,
    fromDocumentToTree,
    fromRequestIdToTree,
    formatDocument,
    createFIDocument,
    getDocumentProp,
    getDocumentDetail
}