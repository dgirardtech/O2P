const LOG = cds.log('KupitO2PSrv-OT-service');
const _ = require('underscore');
const client = require('@sap-cloud-sdk/http-client');
const { Readable, PassThrough } = require('stream');
const { retrieveJwt } = require('@sap-cloud-sdk/connectivity');
const { getEnvParam, getTextBundle, getDbParam, getPidData } = require('./Utils');
const consts = require("./Constants");

const sPROCESSID = "PIDSIMPLIFIED";
const sPOINTOFSALE = "POINTOFSALE";

async function _getDestination(request) {
    let oDest = {};
    let bJWT;

    try {
        bJWT = JSON.parse(await getDbParam("USE_JWT"));
    } catch (error) {
        let errMEssage = "ERROR KRC_parameters USE_JWT :" + error.message;
        request.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return request;
    }
    if (bJWT) {
        oDest = {
            destinationName: "OT_Handler_Common_JWT",
            jwt: retrieveJwt(request)
        };
    } else {
        oDest = {
            destinationName: "OT_Handler_Common"
        };
    }

    return oDest;
}

function _startRead(data) {
    return new Promise((resolve, reject) => {
        const stream = new PassThrough();
        const chunks = [];
        stream.on('data', function (chunk) {
            chunks.push(chunk);
        });
        stream.on('end', function () {
            resolve(Buffer.concat(chunks));
        });
        stream.on('error', function (error) {
            reject(error);
        });
        data.pipe(stream);
    });
}

function _convertToBlobType(oData, sContentType) {
    let base64Data = Buffer.from(oData, 'binary').toString('base64');

    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        let begin = sliceIndex * sliceSize;
        let end = Math.min(begin + sliceSize, bytesLength);

        let bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    let blobData = new Blob(byteArrays, {
        type: sContentType
    });

    return blobData;
}

function _convertToBase64(oData) {
    return Buffer.from(oData, 'binary').toString('base64');
}

async function createDbAttachment(iRequest) {
    LOG.info("PID_Attachments - DB BEFORE CREATE Event handler")

    let pidRequestId;
    try {

        let actualUser = iRequest.user.id;

        //Procedura di debug per test da BAS
        //Non viene utilizzato su richieste reali
        if (iRequest.data.REQUEST_ID === undefined) {

            iRequest.data.REQUEST_ID = 1000000530;
            iRequest.data.ID = 0;
            iRequest.data.FILENAME = "zz5bRFPLus03.pdf";
            iRequest.data.ATTACHMENTTYPE_ATTACHMENTTYPE = "LAYOUT";
            iRequest.data.MEDIATYPE = 'application/pdf';
        }

        // Check Attachment Type
        if (iRequest.data.MEDIATYPE === undefined) {
            iRequest.error(450, consts.MISSING_MEDIATYPE, Attachments, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        pidRequestId = iRequest.data.REQUEST_ID;

        //check duplicate file name 
        let fileNameUp = String(iRequest.data.FILENAME).toUpperCase();
        let queryCheckDuplicated = await SELECT.one.from(Attachments).
            columns(["FILENAMEUP"])
            .where({ REQUEST_ID: pidRequestId, FILENAMEUP: fileNameUp });
        if (queryCheckDuplicated !== undefined) {
            iRequest.error(450, consts.FILE_DUPLICATED, Attachments, 450);
            return iRequest;
        }

        let queryMaxResult = await SELECT.one.from(Attachments).columns(["max(ID) as maxId"])
            .where({ REQUEST_ID: pidRequestId });

        let maxId = queryMaxResult.maxId + 10;

        iRequest.data.ID = maxId;
        iRequest.data.URL = "/odata/v2/pidmodel-srv/Attachments(REQUEST_ID=" + pidRequestId + ",ID=" + maxId + ")/CONTENT";

        if (iRequest.data.ATTACHMENTTYPE_ATTACHMENTTYPE === '') {
            iRequest.data.ATTACHMENTTYPE_ATTACHMENTTYPE = consts.attachmentTypes.GENERAL;
        }

        let oInfoWDPosition = await WorkDayProxy.run(SELECT.one.from(WorkDay)
            .where({ MailDipendente: actualUser }));

        if (oInfoWDPosition === undefined) {
            iRequest.data.CREATOR_FULLNAME = actualUser;
        } else {
            iRequest.data.CREATOR_FULLNAME = oInfoWDPosition.FullName;
        }

    } catch (error) {
        let errMEssage = "ERROR PID Save DB attach: " + pidRequestId + ". " + error.message;
        iRequest.error(450, consts.DB_SAVE_FILE_GENERAL_ERROR, Attachments, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}


async function saveFileonOT(iRequest) {

    let oFileDbKey = {};
    let oBody = {};
    let metadata = [];
    let headMetaDataValue;
    let fileMetaDataValue;
    let openTextFileID;

    try {
        oFileDbKey = {
            REQUEST_ID: iRequest.data.REQUEST_ID,
            ID: iRequest.data.ID
        };

        headMetaDataValue = await getMetaDataValue(iRequest);
        if (headMetaDataValue.errors) {
            return headMetaDataValue;
        }

        fileMetaDataValue = await SELECT.one.from(Attachments).byKey(oFileDbKey);

        oBody.ProcessId_ProcessId = consts.BPROCESS_DEFINITION;
        oBody.ParentID = Number(fileMetaDataValue.OPENTEXTFILEFOLDER);
        oBody.FileName = fileMetaDataValue.FILENAME;
        oBody.mediaType = fileMetaDataValue.MEDIATYPE;
        oBody.Metadata = metadata;

        // oBody.Metadata.push(getMetaDataElement("OperatingUnit", consts.OU_KUPIT));
        // oBody.Metadata.push(getMetaDataElement("InvestmentType", headMetaDataValue.investmentType));//Obbligatorio
        // oBody.Metadata.push(getMetaDataElement("Location", headMetaDataValue.location));//Obbligatorio
        // if (headMetaDataValue.pidRequestdData.OUTLET_CODE !== null) {
        //     oBody.Metadata.push(getMetaDataElement("PointOfSales", headMetaDataValue.pointOfSales));
        //     oBody.Metadata.push(getMetaDataElement("PointOfSalesDescr", headMetaDataValue.pointOfSalesDescr));
        // }
        // oBody.Metadata.push(getMetaDataElement("ProcessName", consts.OT_PROCESS_NAME));
        // oBody.Metadata.push(getMetaDataElement("ProcessNumber", String(headMetaDataValue.pidRequestdData.REQUEST_ID)));
        // oBody.Metadata.push(getMetaDataElement("ProcessTechnicalKey", consts.OT_PROCESS_NAME));
        // oBody.Metadata.push(getMetaDataElement("ProjectDescription", consts.OT_PROCESS_DESC));
        // oBody.Metadata.push(getMetaDataElement("ProjectTitle", headMetaDataValue.pidRequestdData.PROJECT_TITLE));
        // oBody.Metadata.push(getMetaDataElement("SourceApplication", consts.BPROCESS_DEFINITION));
        oBody = getCommonMetaData(iRequest,oBody,headMetaDataValue)
        
        
        
        oBody.contentBase64 = _convertToBase64(await _startRead(iRequest.data.CONTENT));
        
        let oRespCreateFile = await client.executeHttpRequest(await _getDestination(iRequest), {
            method: 'POST',
            url: `/odata/v2/catalog/OpenTextFile`, 
            data: oBody
        });

        openTextFileID = getOpenTextFileID(iRequest,oRespCreateFile);
        if (openTextFileID.errors) {
            return openTextFileID;
        }

        let resultUpdate = await UPDATE(Attachments).set({ OPENTEXTNODEID: openTextFileID }).byKey(oFileDbKey);

    } catch (error) {
        let deleteInsert = cds.tx();
        let deleteDbFile = await deleteInsert.run(DELETE.from(Attachments).byKey(oFileDbKey));
        await deleteInsert.commit();

        let errMEssage = "ERROR PID Save OT attach: " + iRequest.data.REQUEST_ID + ". " + error.message;
        iRequest.error(450, consts.OT_SAVE_FILE_GENERAL_ERROR, Attachments, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
}

function getCommonMetaData(iRequest,oBody,headMetaDataValue){

    oBody.Metadata.push(getMetaDataElement("OperatingUnit", consts.OU_KUPIT));
    oBody.Metadata.push(getMetaDataElement("InvestmentType", headMetaDataValue.investmentType));//Obbligatorio
    oBody.Metadata.push(getMetaDataElement("Location", headMetaDataValue.location));//Obbligatorio
    if (headMetaDataValue.pidRequestdData.OUTLET_CODE !== null) {
        oBody.Metadata.push(getMetaDataElement("PointOfSales", headMetaDataValue.pointOfSales));
        oBody.Metadata.push(getMetaDataElement("PointOfSalesDescr", headMetaDataValue.pointOfSalesDescr));
    }
    oBody.Metadata.push(getMetaDataElement("ProcessName", consts.OT_PROCESS_NAME));
    oBody.Metadata.push(getMetaDataElement("ProcessNumber", String(headMetaDataValue.pidRequestdData.REQUEST_ID)));
    oBody.Metadata.push(getMetaDataElement("ProcessTechnicalKey", consts.OT_PROCESS_NAME));
    oBody.Metadata.push(getMetaDataElement("ProjectDescription", consts.OT_PROCESS_DESC));
    oBody.Metadata.push(getMetaDataElement("ProjectTitle", headMetaDataValue.pidRequestdData.PROJECT_TITLE));
    oBody.Metadata.push(getMetaDataElement("SourceApplication", consts.BPROCESS_DEFINITION));

    return oBody;

}

function getOpenTextFileID(iRequest, iServiceResult) {
    let openTextFileId;
    try {
        openTextFileId = iServiceResult.data.d.OpenTextFileID;

        if (openTextFileId.length <=0){
            let errMEssage = "ERROR getOpenTextFileID: OpenTextFileID is empty";
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;    
        }
    } catch (error) {
        let errMEssage = "ERROR getOpenTextFileID: " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return String(openTextFileId);
}

async function getFileFromOT(iRequest) {
    let oFileDbKey;

    try {

        oFileDbKey = {
            REQUEST_ID: iRequest.data.REQUEST_ID,
            ID: iRequest.data.ID
        };

        // let oKey = {
        //     ID: request.data.ID,
        //     parent_WF_ID_WF_ID: request.data.parent_WF_ID_WF_ID,
        //     parent_Task_Instance_ID: request.data.parent_Task_Instance_ID
        // };

        let oSelect = await SELECT.one.from(Attachments).byKey(oFileDbKey);
        // if (!oSelect) {
        //     throw { code: 499, message: "NoValidData" };
        // }

        let sUrl = `/odata/v2/catalog/OpenTextFile(ProcessId_ProcessId='${sPROCESSID}',ParentID=0,OpenTextFileID='${oSelect.OPENTEXTNODEID}',FileName='${oSelect.FILENAME}',Version='')/content`;

        let oResp = await new Promise(async (resolve, reject) => {
            client.executeHttpRequest(await _getDestination(iRequest), {
                method: 'GET',
                url: sUrl,
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": oSelect.MEDIATYPE,
                    "Content-Disposition": `attachment; filename="${oSelect.FILENAME}"`
                }
            },
                {
                    fetchCsrfToken: false
                }
            ).then((result) => {
                resolve(result);
            }).catch((e) => {
                LOG.error(e);
                reject(e);
            });
        });

        if (oResp && oResp.data) {
            return {
                value: Readable.from(oResp.data),
                $mediaContentType: oSelect.MEDIATYPE,
                $mediaContentDispositionFilename: oSelect.FILENAME
            };
        }

    } catch (error) {
        if (error.response && error.response.data && error.response.data.error
            && error.response.data.error.message && error.response.data.error.message.value) {
            error.message = error.response.data.error.message.value;
        }
        iRequest.reject(499, error.message ? error.message : "ReadingFileError");
    }
}

async function sendDeleteToDMS(request) {
    try {

        let oKey = {
            ID: request.data.ID,
            parent_WF_ID_WF_ID: request.data.parent_WF_ID_WF_ID,
            parent_Task_Instance_ID: request.data.parent_Task_Instance_ID
        };

        let oSelect = await SELECT.from(KRC_Attachments).byKey(oKey);
        if (!oSelect) {
            throw { code: 499, message: "NoValidData" };
        } else if (!oSelect.openTextNodeId) {
            //Se non esiste vuol dire che non è stato mai caricato su OT quindi deve essere soltanto cancellato dalla tabella nel db locale
            return null;
        }

        let sUrl = `/odata/v2/catalog/OpenTextFile(ProcessId_ProcessId='${sPROCESSID}',ParentID=0,OpenTextFileID='${oSelect.openTextNodeId}',FileName='${oSelect.fileName}',Version='')`;

        let oResp = await new Promise(async (resolve, reject) => {
            client.executeHttpRequest(await _getDestination(request), {
                method: 'DELETE',
                url: sUrl,
            },
                {
                    fetchCsrfToken: false //https://sap.github.io/cloud-sdk/docs/js/features/connectivity/csrf
                }
            ).then((result) => {
                resolve(result);
            }).catch((e) => {
                LOG.error(e);
                reject(e);
            });
        });

    } catch (error) {
        if (error.response && error.response.data && error.response.data.error
            && error.response.data.error.message && error.response.data.error.message.value) {
            error.message = error.response.data.error.message.value;
        }
        request.reject(499, error.message ? error.message : "DeletingFileError");
    }
}

async function createAttachment(iRequest) {

    let retCreateDbAttachment = await createDbAttachment(iRequest);
    if (retCreateDbAttachment.errors) {
        return retCreateDbAttachment;
    }
    await createBusinessWorkspaceOT(iRequest);
}

function getMetaDataElement(iKey, iValue) {

    let metadataElement = {};

    try {
        metadataElement.ProcessAttribute = iKey;
        metadataElement.OTAttributeValue = iValue;
    } catch (error) {
        metadataElement.ProcessAttribute = "";
        metadataElement.OTAttributeValue = "";
    }
    return metadataElement;
}

async function getMetaDataValue(iRequest) {
    let metaDataValue = {};
    let pointOfSales;
    let pointOfSalesDescr;
    let investmentType;
    let location;
    let pidRequestId;

    try {
        pidRequestId = iRequest.data.REQUEST_ID;

        let returnPidData = await getPidData(pidRequestId, iRequest);
        if (returnPidData.errors) {
            return returnPidData;
        }

        if (returnPidData.OUTLET_CODE !== null) {
            pointOfSales = returnPidData.OUTLET_CODE;
            pointOfSalesDescr = returnPidData.OUTLET_CODE_DESCRIPTION
            location = pointOfSales;
        } else {
            location = "blank"
        }

        if (returnPidData.INVESTMENT_TYPE === null) {
            investmentType = "BLANKET"
        } else {
            investmentType = returnPidData.INVESTMENT_TYPE;
        }


        metaDataValue.pointOfSales = pointOfSales;
        metaDataValue.pointOfSalesDescr = pointOfSalesDescr;
        metaDataValue.investmentType = investmentType;
        metaDataValue.location = location;
        metaDataValue.pidRequestdData = returnPidData;
    } catch (error) {
        let errMEssage = "ERROR getMetaDataValue: " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    return metaDataValue;
}

async function createBusinessWorkspaceOT(iRequest) {

    let oRespCreateBw;
    let openTexNodeIDs;
    let oBody = {};
    let childs = [];
    let metadata = [];
    let headMetaDataValue;

    try {
        headMetaDataValue = await getMetaDataValue(iRequest);
        if (headMetaDataValue.errors) {
            return headMetaDataValue;
        }

        oBody.ProcessId_ProcessId = consts.BPROCESS_DEFINITION;
        oBody.ParentID = 0;
        oBody.template_id = 0;
        oBody.wksp_type_id = 0;
        oBody.childs = childs;
        oBody.Metadata = metadata;

        // oBody.Metadata.push(getMetaDataElement("OperatingUnit", consts.OU_KUPIT));
        // oBody.Metadata.push(getMetaDataElement("InvestmentType", metaDataValue.investmentType));//Obbligatorio
        // oBody.Metadata.push(getMetaDataElement("Location", metaDataValue.location));//Obbligatorio    
        // if (metaDataValue.pidRequestdData.OUTLET_CODE !== null) {
        //     oBody.Metadata.push(getMetaDataElement("PointOfSales", metaDataValue.pointOfSales));
        //     oBody.Metadata.push(getMetaDataElement("PointOfSalesDescr", metaDataValue.pointOfSalesDescr));
        // }
        // oBody.Metadata.push(getMetaDataElement("ProcessName", consts.OT_PROCESS_NAME));
        // oBody.Metadata.push(getMetaDataElement("ProcessNumber", String(metaDataValue.pidRequestdData.REQUEST_ID)));
        // oBody.Metadata.push(getMetaDataElement("ProcessTechnicalKey", consts.OT_PROCESS_NAME));
        // oBody.Metadata.push(getMetaDataElement("ProjectDescription", consts.OT_PROCESS_DESC));
        // oBody.Metadata.push(getMetaDataElement("ProjectTitle", metaDataValue.pidRequestdData.PROJECT_TITLE));
        // oBody.Metadata.push(getMetaDataElement("SourceApplication", consts.BPROCESS_DEFINITION));

        oBody = getCommonMetaData(iRequest,oBody,headMetaDataValue)

        oBody.Metadata.push(getMetaDataElement("AFEAmount", String(headMetaDataValue.pidRequestdData.AFE_IMPORT)));
        oBody.Metadata.push(getMetaDataElement("AFEType", headMetaDataValue.pidRequestdData.AFE_CATEGORY_AFECATEGORY));
        oBody.Metadata.push(getMetaDataElement("AFENumber", String(headMetaDataValue.pidRequestdData.AFE_REQUEST_ID)));

        // Creazione del BW in OT relativamente alla chiave del PV
        oRespCreateBw = await client.executeHttpRequest(await _getDestination(iRequest), {
            method: 'POST',
            url: `/odata/v2/catalog/OpenTextBusinessWorkspace`,
            data: oBody
        });

        openTexNodeIDs = getOpenTexNodeIDs(iRequest,oRespCreateBw);
        if (openTexNodeIDs.errors) {
            return openTexNodeIDs;
        }

        iRequest.data.OPENTEXTFILEFOLDER = openTexNodeIDs.OPENTEXTFILEFOLDER;
        let resultUpdate = await UPDATE(PidRequest).set({ OPENTEXTNODEID: openTexNodeIDs.OPENTEXTNODEID }).
            where({
                REQUEST_ID: headMetaDataValue.pidRequestdData.REQUEST_ID,
            });

    } catch (error) {
        let errMEssage = "ERROR PID CREATE BW OT: " + headMetaDataValue.pidRequestdData.REQUEST_ID + ". " + error.message;
        iRequest.error(450, consts.OT_CREATE_BW_GENERAL_ERROR, Attachments, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
}

function getOpenTexNodeIDs(iRequest, iServiceResult) {
    let openTexNodeIDs = {};
    let createBwResult
    try {
        createBwResult = iServiceResult.data.d.childs.results;

        let documentsFolderNodeId = _.findWhere(createBwResult, { Name: "Documents" });
        if(documentsFolderNodeId === undefined){
            let errMEssage = "ERROR getOpenTexNodeIDs: Folder Documents not found"; 
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        openTexNodeIDs.OPENTEXTFILEFOLDER = String(documentsFolderNodeId.NodeId);
        openTexNodeIDs.OPENTEXTNODEID = String(documentsFolderNodeId.ParentID);
 
    } catch (error) {
        let errMEssage = "ERROR getOpenTexNodeIDs: " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return openTexNodeIDs;
}

async function updateOtProcessAttribute(iRequest) {
    let pointOfSales = "00PV00";
    let pointOfSalesDescr = "00PV00";
    let investmentType = "BLANKET";//Lista valori OT
    let oRespBwUpdate;
    let oRespBwUpdateResults;
    let pidRequestId;

    try {

        pidRequestId = iRequest.data.REQUEST_ID;

        let returnPidData = await getPidData(pidRequestId, iRequest);
        if (returnPidData.errors) {
            return returnPidData;
        }

        if (returnPidData.OUTLET_CODE !== null) {
            pointOfSales = returnPidData.OUTLET_CODE;
            pointOfSalesDescr = returnPidData.OUTLET_CODE_DESCRIPTION
        }

        // if(returnPidData.INVESTMENT_TYPE !== null){
        //     investmentType = returnPidData.INVESTMENT_TYPE;
        // }

        let oBodyPointOfSale = {
            "ProcessId_ProcessId": "PIDSIMPLIFIED",
            // "ParentID": 5619070,
            "ParentID": 0,//Deve essere 0
            "OpenTextBusinessWorkspaceID": "",
            "Name": "",
            "Description": "test 2 bw",
            "template_id": 0,
            "wksp_type_id": 0,
            "Nickname": "",
            "childs": [], // return directly all the childs
            "Metadata": [
                {
                    "ProcessAttribute": "InvestmentType",
                    "OTAttributeValue": investmentType
                },
                {
                    "ProcessAttribute": "Location",
                    "OTAttributeValue": pointOfSales
                },
                {
                    "ProcessAttribute": "OperatingUnit",
                    "OTAttributeValue": "KUPIT"
                },
                {
                    "ProcessAttribute": "PointOfSales",
                    "OTAttributeValue": pointOfSales
                },
                {
                    "ProcessAttribute": "PointOfSalesDescr",
                    "OTAttributeValue": pointOfSalesDescr
                },
                {
                    "ProcessAttribute": "ProcessName",
                    "OTAttributeValue": "PID"
                },
                {
                    "ProcessAttribute": "ProcessNumber",
                    "OTAttributeValue": String(iRequest.data.REQUEST_ID),
                },
                {
                    "ProcessAttribute": "ProcessTechnicalKey",
                    "OTAttributeValue": "PID"
                },
                {
                    "ProcessAttribute": "ProjectDescription",
                    "OTAttributeValue": "PID Simplified"
                },
                {
                    "ProcessAttribute": "ProjectTitle",
                    "OTAttributeValue": "ff" //returnPidData.PROJECT_TITLE
                },
                {
                    "ProcessAttribute": "SourceApplication",//Categoria controllata
                    "OTAttributeValue": "PIDSIMPLIFIED"
                }
            ]
        };

        // Update del BW in OT e degli attributi nei file presenti
        let uRL = "/odata/v2/catalog/OpenTextBusinessWorkspace(ProcessId_ProcessId=" + consts.BPROCESS_DEFINITION +
            ",OpenTextBusinessWorkspaceID='5695481')";
        oRespBwUpdate = await client.executeHttpRequest(await _getDestination(iRequest), {
            method: 'PUT',
            url: uRL,
            data: oBodyPointOfSale
        });

        oRespBwUpdateResults = oRespBwUpdate.data.d.childs.results;
        //    let oRespBWChildsProcess = _.findWhere(oRespBwUpdateResults, { Name: "Documents" });

        // iRequest.data.OPENTEXTFILEFOLDER = oRespBwUpdateResults.NodeId;

    } catch (error) {
        let errMEssage = "ERROR PID CREATE BW OT: " + pidRequestId + ". " + error.message;
        iRequest.error(450, consts.OT_CREATE_BW_GENERAL_ERROR, Attachments, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
}

function backupCode() {

    // let oBodyPointOfSale = {
    //     "ProcessId_ProcessId": "PIDSIMPLIFIED",
    //     // "ParentID": 5619070,
    //     "ParentID": 0,//Deve essere 0
    //     "OpenTextBusinessWorkspaceID": "",
    //     "Name": "",
    //     "Description": "test 2 bw",
    //     "template_id": 0,
    //     "wksp_type_id": 0,
    //     "Nickname": "",
    //     "childs": [], // return directly all the childs
    //     "Metadata": [
    //         {
    //             "ProcessAttribute": "InvestmentType",
    //             "OTAttributeValue": investmentType
    //         },
    //         {
    //             "ProcessAttribute": "Location",
    //             "OTAttributeValue": pointOfSales
    //         },
    //         {
    //             "ProcessAttribute": "OperatingUnit",
    //             "OTAttributeValue": "KUPIT"
    //         },
    //         {
    //             "ProcessAttribute": "PointOfSales",
    //             "OTAttributeValue": pointOfSales
    //         },
    //         {
    //             "ProcessAttribute": "PointOfSalesDescr",
    //             "OTAttributeValue": pointOfSalesDescr
    //         },
    //         {
    //             "ProcessAttribute": "ProcessName",
    //             "OTAttributeValue": "PID"
    //         },
    //         {
    //             "ProcessAttribute": "ProcessNumber",
    //             "OTAttributeValue": String(iRequest.data.REQUEST_ID),
    //         },
    //         {
    //             "ProcessAttribute": "ProcessTechnicalKey",
    //             "OTAttributeValue": "PID"
    //         },
    //         {
    //             "ProcessAttribute": "ProjectDescription",
    //             "OTAttributeValue": "PID Simplified"
    //         },
    //         {
    //             "ProcessAttribute": "ProjectTitle",
    //             "OTAttributeValue": "ff" //returnPidData.PROJECT_TITLE
    //         },
    //         {
    //             "ProcessAttribute": "SourceApplication",//Categoria controllata
    //             "OTAttributeValue": "PIDSIMPLIFIED"
    //         }
    //     ]
    // };

    // oBody = {
    //     "ProcessId_ProcessId": sPROCESSID,
    //     "ParentID": Number(oSelect.OPENTEXTFILEFOLDER),
    //     "FileName": oSelect.FILENAME,
    //     "mediaType": oSelect.MEDIATYPE,
    //     "Metadata": [
    //         {
    //             "ProcessAttribute": "InvestmentType",
    //             "OTAttributeValue": "BLANKET"
    //         },
    //         {
    //             "ProcessAttribute": "Location",
    //             "OTAttributeValue": "a"
    //         },
    //         {
    //             "ProcessAttribute": "OperatingUnit",
    //             "OTAttributeValue": "KUPIT"
    //         },
    //         {
    //             "ProcessAttribute": "PointOfSales",
    //             "OTAttributeValue": "00PV000013"
    //         },
    //         {
    //             "ProcessAttribute": "PointOfSalesDescr",
    //             "OTAttributeValue": "12345"
    //         },
    //         {
    //             "ProcessAttribute": "ProcessName",
    //             "OTAttributeValue": "PID"
    //         },
    //         {
    //             "ProcessAttribute": "ProcessNumber",
    //             "OTAttributeValue": String(iRequest.data.REQUEST_ID),
    //         },
    //         {
    //             "ProcessAttribute": "ProcessTechnicalKey",
    //             "OTAttributeValue": "PID"
    //         },
    //         {
    //             "ProcessAttribute": "ProjectDescription",
    //             "OTAttributeValue": "a"
    //         },
    //         {
    //             "ProcessAttribute": "ProjectTitle",
    //             "OTAttributeValue": "Titolo progetto molto prolisso e descrittivo"
    //         },
    //         {
    //             "ProcessAttribute": "SourceApplication",
    //             "OTAttributeValue": "PIDSIMPLIFIED"
    //         }
    //     ],
    //     "contentBase64": _convertToBase64(await _startRead(iRequest.data.CONTENT))
    // };


}

module.exports = {
    saveFileonOT,
    getFileFromOT,
    sendDeleteToDMS,
    createAttachment,
    updateOtProcessAttribute
}