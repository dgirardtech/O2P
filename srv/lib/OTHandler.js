const LOG = cds.log('OTservice');
const _ = require('underscore');
const client = require('@sap-cloud-sdk/http-client');
const { Readable, PassThrough } = require('stream');
const { retrieveJwt } = require('@sap-cloud-sdk/connectivity'); 
const consts = require("./Constants");
const { getEnvParam, getTextBundle} = require('./Utils'); 

const sPROCESSID = "O2P_DOC"


async function testSaveOT(iRequest) {




    await createBusinessWorkspaceOT(iRequest);


}



async function _getDestination(request) {

    let oDest = {}

    let callOTwithJWT = getEnvParam("callOTwithJWT", false)
    if (callOTwithJWT === "true") {

        oDest = {
            destinationName: "OT_Handler_Common_JWT",
            jwt: retrieveJwt(request)
        }

    } else {

        oDest = {
            destinationName: "OT_Handler_Common"
        }

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
    LOG.info("Attachments - DB BEFORE CREATE Event handler")

    let requestId;
    try {

        let actualUser = iRequest.user.id;

        //Procedura di debug per test da BAS
        //Non viene utilizzato su richieste reali
        if (iRequest.data.REQUEST_ID === undefined) {

            iRequest.data.REQUEST_ID = 1000000000;
            iRequest.data.ID = 10;
            iRequest.data.FILENAME = "O2P_1000000000.pdf";
            iRequest.data.ATTACHMENTTYPE_ATTACHMENTTYPE = "DOC";
            iRequest.data.MEDIATYPE = 'application/pdf';
        }

        // Check Attachment Type
        if (iRequest.data.MEDIATYPE === undefined) {
            iRequest.error(450, "MISSING_MEDIATYPE", Attachments, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        requestId = iRequest.data.REQUEST_ID;

        //check duplicate file name 
        let fileNameUp = String(iRequest.data.FILENAME).toUpperCase();
        let queryCheckDuplicated = await SELECT.one.from(Attachments).
            columns(["FILENAMEUP"])
            .where({ REQUEST_ID: requestId, FILENAMEUP: fileNameUp });
        if (queryCheckDuplicated !== undefined) {
            iRequest.error(450, "FILE_DUPLICATED", Attachments, 450);
            return iRequest;
        }

        let queryMaxResult = await SELECT.one.from(Attachments).columns(["max(ID) as maxId"])
            .where({ REQUEST_ID: requestId });

        let maxId = queryMaxResult.maxId + 10;

        iRequest.data.to_Request_REQUEST_ID = requestId;
        iRequest.data.ID = maxId;
        iRequest.data.URL = "/odata/v2/kupito2pmodel-srv/Attachments(REQUEST_ID=" + requestId + ",ID=" + maxId + ")/CONTENT";

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
        let errMEssage = "ERROR Save DB attach: " + requestId + ". " + error.message;
        iRequest.error(450, 'DB_SAVE_FILE_GENERAL_ERROR', Attachments, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iRequest;
}

async function eventSaveFileonOT(iRequest) {

    let requestId = iRequest.data.REQUEST_ID;
    let attachId = iRequest.data.ID;
    let fileContent = iRequest.data.CONTENT;

    return await saveFileonOT(iRequest, requestId, attachId, fileContent, true);
}

async function saveFileonOT(iRequest, iRequestId, attachId, iFileContent, iConvertToBase64) {

    let oFileDbKey = {};
    let oBody = {};
    let metadata = [];
    let headMetaDataValue;
    let fileMetaDataValue;
    let openTextFileID;
    let fileContent;
    let fileDesc = "";

    try {
        oFileDbKey = {
            REQUEST_ID: iRequestId,
            ID: attachId
        };

        headMetaDataValue = await getMetaDataValue(iRequest, iRequestId);
        if (headMetaDataValue.errors) {
            return headMetaDataValue;
        }

        fileMetaDataValue = await SELECT.one.from(Attachments).byKey(oFileDbKey);
        let attchDesc = await SELECT.one.from(AttachmentType)
        .where({ ATTACHMENTTYPE: fileMetaDataValue.ATTACHMENTTYPE_ATTACHMENTTYPE });
        if (attchDesc) {
            fileDesc = attchDesc.DESCRIPTION;
        }

        oBody.ProcessId_ProcessId = consts.idProcess;
        oBody.ParentID = Number(headMetaDataValue.OPENTEXTFILEFOLDER);
        oBody.FileName = fileMetaDataValue.FILENAME;
        oBody.mediaType = fileMetaDataValue.MEDIATYPE;
        oBody.Metadata = metadata;

        oBody = getCommonMetaData(iRequest, oBody, headMetaDataValue)

        oBody.Metadata.push(getMetaDataElement("DocumentType", fileMetaDataValue.ATTACHMENTTYPE_ATTACHMENTTYPE));
        oBody.Metadata.push(getMetaDataElement("DocumentTypeDescr", fileDesc));

        if (iConvertToBase64) {
            fileContent = _convertToBase64(await _startRead(iFileContent));
        } else {
            fileContent = iFileContent;
        }

        oBody.contentBase64 = fileContent;

        let oRespCreateFile = await client.executeHttpRequest(await _getDestination(iRequest), {
            method: 'POST',
            url: `/odata/v2/catalog/OpenTextFile`,
            data: oBody
        }, {
            fetchCsrfToken: false
        });

        openTextFileID = getOpenTextFileID(iRequest, oRespCreateFile);
        if (openTextFileID.errors) {
            return openTextFileID;
        }

        let resultUpdate = await UPDATE(Attachments).set({ OPENTEXTNODEID: openTextFileID }).byKey(oFileDbKey);

    } catch (error) {

        /*
        let deleteInsert = cds.tx();
        let deleteDbFile = await deleteInsert.run(DELETE.from(Attachments).byKey(oFileDbKey));
        await deleteInsert.commit();

        */


        let errMEssage = "ERROR Save OT attach: " + iRequestId + ". " + error.message;
        iRequest.error(450, consts.OT_SAVE_FILE_GENERAL_ERROR, Attachments, 450);
        LOG.error(errMEssage);
        returnInnerErrors(iRequest, iRequestId, error, consts.OT_SAVE_FILE_GENERAL_ERROR);
        return iRequest;
    }
    return iRequest;
}

async function updateFileonOT(iRequest, iRequestId, attachId, iFileContent, iConvertToBase64) {

    let oFileDbKey = {};
    let oBody = {};
    let metadata = [];
    let headMetaDataValue;
    let fileMetaDataValue;
    let openTextFileID;
    let fileContent;
    let fileDesc = "";

    try {
        oFileDbKey = {
            REQUEST_ID: iRequestId,
            ID: attachId
        };

        headMetaDataValue = await getMetaDataValue(iRequest, iRequestId);
        if (headMetaDataValue.errors) {
            return headMetaDataValue;
        }

        fileMetaDataValue = await SELECT.one.from(Attachments).byKey(oFileDbKey);
        let attchDesc = await SELECT.one.from(AttachmentType).where({ ATTACHMENTTYPE: fileMetaDataValue.ATTACHMENTTYPE_ATTACHMENTTYPE });
        if (attchDesc) {
            fileDesc = attchDesc.DESCRIPTION;
        }

        oBody.ProcessId_ProcessId = consts.idProcess;
        oBody.ParentID = Number(headMetaDataValue.OPENTEXTFILEFOLDER);
        oBody.FileName = fileMetaDataValue.FILENAME;
        oBody.mediaType = fileMetaDataValue.MEDIATYPE;
        oBody.Metadata = metadata;

        oBody = getCommonMetaData(iRequest, oBody, headMetaDataValue)

        oBody.Metadata.push(getMetaDataElement("DocumentType", fileMetaDataValue.ATTACHMENTTYPE_ATTACHMENTTYPE));
        oBody.Metadata.push(getMetaDataElement("DocumentTypeDescr", fileDesc));

        if (iConvertToBase64) {
            fileContent = _convertToBase64(await _startRead(iFileContent));
        } else {
            fileContent = iFileContent;
        }

        oBody.contentBase64 = fileContent;

        let sUrl = `/odata/v2/catalog/OpenTextFile(ProcessId_ProcessId='${consts.idProcess}',ParentID=0,OpenTextFileID='${fileMetaDataValue.OPENTEXTNODEID}',FileName='${fileMetaDataValue.FILENAME}',Version='')`;

        let oRespCreateFile = await client.executeHttpRequest(await _getDestination(iRequest), {
            method: 'PUT',
            url: sUrl,
            data: oBody
        }, {
            fetchCsrfToken: false
        });

        openTextFileID = getOpenTextFileID(iRequest, oRespCreateFile);
        if (openTextFileID.errors) {
            return openTextFileID;
        }

    } catch (error) {
        let errMEssage = "ERROR Update OT attach: " + iRequestId + ". " + error.message;
        iRequest.error(450, 'OT_UPDATE_FILE_GENERAL_ERROR', Attachments, 450);
        LOG.error(errMEssage);
        returnInnerErrors(iRequest, iRequestId, error, 'OT_UPDATE_FILE_GENERAL_ERROR');
        return iRequest;
    }
    return iRequest;
}

function getOpenTextFileID(iRequest, iServiceResult) {
    let openTextFileId;
    try {
        openTextFileId = iServiceResult.data.d.OpenTextFileID;

        if (openTextFileId.length <= 0) {
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

function checkGetOtContent(iRequest) {
    let getOtContent = false;
    try {
        for (let index = 0; index < iRequest.query.SELECT.columns.length; index++) {
            element = iRequest.query.SELECT.columns[index];
            if (element.ref[0] === 'CONTENT') {
                return true;
            }
        }

    } catch (error) {
        return getOtContent;
    }
    return getOtContent;
}

async function readAttachments(iData, iRequest) {
    LOG.info("readAttachment");

    if (checkGetOtContent(iRequest)) {
        //E' stata eseguita una richiesta per il recupero del binario da OT
        return iData;
    }

    let actualUser = iRequest.user.id;
    let attachDesc;
    let requestStatus;
    try {

        if (iData.length <= 0) {
            return iData;
        }

        requestStatus = await SELECT.one.from(Request)
            .where({
                REQUEST_ID: iData[0].REQUEST_ID
            });

        attachDesc = await SELECT.from(AttachmentType);

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

            if (requestStatus.to_Status_code !== consts.requestStatus.Progress) {
                attach.ISEDITABLE = false;
            }

            if (attachElement.ISEDITABLE === false) {
                attach.ISEDITABLE = false;
            }

        });
    } catch (error) {
        let errMEssage = "ERROR readAttachment " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return iData;
}

async function eventGetFileFromOT(iRequest, iNext) {

    if (!checkGetOtContent(iRequest)) {
        //Non è stata eseguita una richiesta per il recupero del binario da OT
        return await iNext();
    }

    let requestId = iRequest.data.REQUEST_ID;
    let attachId = iRequest.data.ID;

    return getFileFromOT(iRequest, requestId, attachId);
}

async function getFileFromOT(iRequest, iRequestId, iAttachId) {
    let oFileDbKey;
    let oSelect;

    try {
        oFileDbKey = {
            REQUEST_ID: iRequestId,
            ID: iAttachId
        };

        oSelect = await SELECT.one.from(Attachments).byKey(oFileDbKey);
        if (!oSelect) {
            let errMEssage = "ERROR getting file contents: not entry found for request:" + iRequestId + " ID:" + iAttachId;
            iRequest.error(450, 'OT_GET_FILE_CONTENT', Attachments, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        let sUrl = `/odata/v2/catalog/OpenTextFile(ProcessId_ProcessId='${consts.idProcess}',ParentID=0,OpenTextFileID='${oSelect.OPENTEXTNODEID}',FileName='${oSelect.FILENAME}',Version='')/content`;

        let oResp = await client.executeHttpRequest(await _getDestination(iRequest), {
            method: 'GET',
            url: sUrl,
            responseType: "arraybuffer",
            headers: {
                "Content-Type": oSelect.MEDIATYPE,
                "Content-Disposition": `attachment; filename="${oSelect.FILENAME}"`
            }
        }, {
            fetchCsrfToken: false
        });

        let fileFromOtResponse = getFileFromOtResponse(iRequest, oResp);
        if (fileFromOtResponse.errors) {
            return fileFromOtResponse;
        }

        return {
            value: fileFromOtResponse,
            $mediaContentType: oSelect.MEDIATYPE,
            $mediaContentDispositionFilename: oSelect.FILENAME
        };

    } catch (error) {
        let errMEssage = "ERROR getting file contents from OpenText, OPENTEXTNODEID:" + oSelect.OPENTEXTNODEID + ". " + error.message;;
        iRequest.error(450, "OT_GET_FILE_CONTENT", Attachments, 450);
        LOG.error(errMEssage);
        returnInnerErrors(iRequest, iRequestId, error, "OT_GET_FILE_CONTENT");
        return iRequest;
    }
}

function getFileFromOtResponse(iRequest, otResponse) {
    let otFile;
    try {
        otFile = Readable.from(otResponse.data);
    } catch (error) {
        let errMEssage = "ERROR getFileFromOtResponse: " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return otFile;
}

async function eventDeleteFileToOt(iRequest) {
    return deleteFileToOt(iRequest, iRequest.data.REQUEST_ID, iRequest.data.ID);
}

async function deleteFileToOt(iRequest, iRequestId, iFielId) {

    let oFileDbKey;
    let oSelect;
    // let requestId;
    let oResp;

    try {

        // requestId = iRequest.data.REQUEST_ID

        oFileDbKey = {
            REQUEST_ID: iRequestId,
            ID: iFielId
        };

        oSelect = await SELECT.one.from(Attachments).byKey(oFileDbKey);
        if (!oSelect) {
            let errMEssage = "ERROR error deleting file contents: not entry found for request:" + iRequestId + " ID:" + iFielId;
            iRequest.error(450, "OT_DELETE_FILE_CONTENT", Attachments, 450);
            iRequest.error(450, errMEssage, Attachments, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        let sUrl = `/odata/v2/catalog/OpenTextFile(ProcessId_ProcessId='${consts.idProcess}',ParentID=0,OpenTextFileID='${oSelect.OPENTEXTNODEID}',FileName='${oSelect.FILENAME}',Version='')`;

        oResp = await client.executeHttpRequest(await _getDestination(iRequest), {
            method: 'DELETE',
            url: sUrl,
        },
            {
                fetchCsrfToken: false
            });

    } catch (error) {
        let errMEssage = "ERROR error deleting file contents to OpenText, OPENTEXTNODEID:" + oSelect.OPENTEXTNODEID + ". " + error.message;;
        iRequest.error(450, "OT_DELETE_FILE_CONTENT", Attachments, 450);
        LOG.error(errMEssage);
        returnInnerErrors(iRequest, iRequestId, error, "OT_DELETE_FILE_CONTENT");
        return iRequest;
    }
    return iRequest;
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


async function getMetaDataValue(iRequest, iRequestId) {

    let metaDataValue = {};

    try {

        let oRequest = await SELECT.one.from(Request).
            where({
                REQUEST_ID: iRequestId
            });

        let oRequester = await SELECT.one.from(Requester).
            where({ CODE: oRequest.REQUESTER_CODE });

        metaDataValue.RequestedBy = oRequest.createdBy;
        metaDataValue.UpdatedBy = oRequest.modifiedBy;
        metaDataValue.Company = oRequester.BUKRS;
        metaDataValue.Requester = oRequest.REQUESTER_CODE;
        metaDataValue.OrderDesc = oRequest.TITLE;
        metaDataValue.Paymode = oRequest.PAYMENT_MODE_CODE;
        metaDataValue.OrderAmount = oRequest.TOTAL;

        metaDataValue.requestdData = oRequest;

        let otBwNodeIDs = await SELECT.one.from(OtNodeIds)
            .where({
                REQUEST_ID: iRequestId
            });

        if (otBwNodeIDs) {
            metaDataValue.OPENTEXTNODEID = otBwNodeIDs.OPENTEXTNODEID
            metaDataValue.OPENTEXTFILEFOLDER = otBwNodeIDs.OPENTEXTFILEFOLDER
        }

    } catch (error) {
        let errMEssage = "ERROR getMetaDataValue: " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }

    return metaDataValue;
}

function getCommonMetaData(iRequest, oBody, headMetaDataValue) {

    oBody.Metadata.push(getMetaDataElement("OperatingUnit", consts.OU_KUPIT));
    oBody.Metadata.push(getMetaDataElement("ProcessName", consts.OT_PROCESS_NAME));
    oBody.Metadata.push(getMetaDataElement("ProcessNumber", String(headMetaDataValue.requestdData.REQUEST_ID)));
    oBody.Metadata.push(getMetaDataElement("ProcessTechnicalKey", consts.OT_PROCESS_NAME));
    oBody.Metadata.push(getMetaDataElement("ProjectDescription", consts.OT_PROCESS_DESC));
    oBody.Metadata.push(getMetaDataElement("SourceApplication", consts.idProcess));

    oBody.Metadata.push(getMetaDataElement("RequestedBy", headMetaDataValue.RequestedBy));
    oBody.Metadata.push(getMetaDataElement("UpdatedBy", headMetaDataValue.UpdatedBy));
    oBody.Metadata.push(getMetaDataElement("Company", headMetaDataValue.Company));

    //oBody.Metadata.push({ "ProcessAttribute": "PuntoVendita", OTAttributeValueArray: headMetaDataValue.PuntoVendita });

    return oBody;
}


function checknullValue(iElement, iAttribute) {
    let value;
    try {
        value = iElement[iAttribute];
    } catch (error) {

    }
    return value;
}

async function createBusinessWorkspaceOT(iRequest) {

    let oRespCreateBw;
    let openTexNodeIDs;
    let oBody = {};
    let childs = [];
    let metadata = [];
    let headMetaDataValue;
    let requestId;
    let resInsertOtIds;

    try {

        requestId = iRequest.data.REQUEST_ID;

        headMetaDataValue = await getMetaDataValue(iRequest, requestId);
        if (headMetaDataValue.errors) {
            return headMetaDataValue;
        }

        oBody.ProcessId_ProcessId = consts.idProcess;
        oBody.ParentID = 0;
        oBody.template_id = 0;
        oBody.wksp_type_id = 0;
        oBody.childs = childs;
        oBody.Metadata = metadata;

        oBody = getCommonMetaData(iRequest, oBody, headMetaDataValue)

        // Creazione del BW in OT relativamente alla chiave del PV
        oRespCreateBw = await client.executeHttpRequest(await _getDestination(iRequest), {
            method: 'POST',
            url: `/odata/v2/catalog/OpenTextBusinessWorkspace`,
            data: oBody
        }, {
            fetchCsrfToken: false
        });

        openTexNodeIDs = await getOpenTexNodeIDs(iRequest, oRespCreateBw);
        if (openTexNodeIDs.errors) {
            return openTexNodeIDs;
        }

        resInsertOtIds = await insertOtNodeIds(iRequest, requestId, openTexNodeIDs);
        if (resInsertOtIds.errors) {
            return resInsertOtIds;
        }

    } catch (error) {
        let errMEssage = "ERROR CREATE BW OT: " + requestId + ". " + error.message;
        iRequest.error(450, "OT_CREATE_BW_GENERAL_ERROR", Attachments, 450);
        LOG.error(errMEssage);
        returnInnerErrors(iRequest, requestId, error, "OT_CREATE_BW_GENERAL_ERROR");
        return iRequest;
    }
}

async function insertOtNodeIds(iRequest, iRequestId, openTexNodeIDs) {

    let otNodeIdsCheck;
    let otNodeIdsEntries = new Array();

    try {
        otNodeIdsCheck = await SELECT.one.from(OtNodeIds).where({ REQUEST_ID: iRequestId });
        if (otNodeIdsCheck) {
            return iRequest;
        }

        let otNodeIds = new Object();
        otNodeIds.REQUEST_ID = iRequestId;
        otNodeIds.OPENTEXTNODEID = openTexNodeIDs.OPENTEXTNODEID;
        otNodeIds.OPENTEXTFILEFOLDER = openTexNodeIDs.OPENTEXTFILEFOLDER;
        otNodeIdsEntries.push(otNodeIds);


        let cdsTx = cds.tx();
        let insertIds = await cdsTx.run(INSERT.into(OtNodeIds).entries(otNodeIdsEntries));
        let insertIdsResponse = await cdsTx.commit();

    } catch (error) {
        let errMEssage = "ERROR insertOtNodeIds " + iRequestId + " :" + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        returnInnerErrors(iRequest, iRequestId, error, "insertOtNodeIds");
        return iRequest;
    }
    return iRequest;
}

function getOpenTexNodeIDs(iRequest, iServiceResult) {

    let openTexNodeIDs = {};
    let createBwResult

    try {
        createBwResult = iServiceResult.data.d.childs.results;

        let documentsFolderNodeId = _.findWhere(createBwResult, { Name: "Documents" });
        if (documentsFolderNodeId === undefined) {
            let errMEssage = "ERROR getOpenTexNodeIDs: Folder Documents not found";
            iRequest.error(450, errMEssage, null, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

        openTexNodeIDs.OPENTEXTFILEFOLDER = String(documentsFolderNodeId.NodeId);
        openTexNodeIDs.OPENTEXTNODEID = String(iServiceResult.data.d.OpenTextBusinessWorkspaceID);

    } catch (error) {
        let errMEssage = "ERROR getOpenTexNodeIDs: " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        returnInnerErrors(iRequest, "", error, "getOpenTexNodeIDs");
        return iRequest;
    }

    return openTexNodeIDs;
}

async function updateOtProcessAttribute(iRequest, iRequestId) {

    let oRespUpdateBw;
    let oBody = {};
    let childs = [];
    let metadata = [];
    let headMetaDataValue;
    let otAttachCheck;
    let otBwName;

    try {

        otAttachCheck = await SELECT.one.from(Attachments).where({ REQUEST_ID: iRequestId });
        if (!otAttachCheck) {
            return iRequest;
        }

        headMetaDataValue = await getMetaDataValue(iRequest, iRequestId);
        if (headMetaDataValue.errors) {
            return headMetaDataValue;
        }

        otBwName = getOtBwName(iRequest, iRequestId, headMetaDataValue);
        if (otBwName.errors) {
            return otBwName;
        }

        oBody.ProcessId_ProcessId = consts.idProcess;
        oBody.OpenTextBusinessWorkspaceID = headMetaDataValue.OPENTEXTNODEID;

        oBody.ParentID = 0;
        oBody.template_id = 0;
        oBody.wksp_type_id = 0;
        oBody.Name = otBwName;
        oBody.Description = otBwName;
        oBody.childs = childs;
        oBody.Metadata = metadata;

        oBody = getCommonMetaData(iRequest, oBody, headMetaDataValue)

        let uRL = "/odata/v2/catalog/OpenTextBusinessWorkspace(ProcessId_ProcessId='" + consts.idProcess +
            "',OpenTextBusinessWorkspaceID='" + headMetaDataValue.OPENTEXTNODEID + "')";

        oRespUpdateBw = await client.executeHttpRequest(await _getDestination(iRequest), {
            method: 'PUT',
            url: uRL,
            data: oBody
        }, {
            fetchCsrfToken: false
        });

        if (!oRespUpdateBw) {
            let errMEssage = "ERROR UPDATE BW OT: " + iRequestId + ". UpdateBW STATUS !== 200";
            iRequest.error(450, "OT_UPDATE_BW_GENERAL_ERROR", Attachments, 450);
            LOG.error(errMEssage);
            return iRequest;
        }

    } catch (error) {
        let errMEssage = "ERROR UPDATE BW OT: " + iRequestId + ". " + error.message;
        iRequest.error(450, "OT_UPDATE_BW_GENERAL_ERROR", Attachments, 450);
        LOG.error(errMEssage);
        returnInnerErrors(iRequest, iRequestId, error, "OT_UPDATE_BW_GENERAL_ERROR");
        return iRequest;
    }
    return iRequest;
}

function getOtBwName(iRequest, iRequestId, iRequestData) {

    let bProcess = consts.OT_PROCESS_NAME;
    let requester = "";
    let requestId = "";
    let otBwName = "";

    try {
        requester = iRequestData.Requester;
        requestId = "" + iRequestId;

        otBwName = bProcess + " " + requester + "(Request " + requestId + ")";

    } catch (error) {
        let errMEssage = "ERROR getOtBwName: " + error.message;
        iRequest.error(450, errMEssage, null, 450);
        LOG.error(errMEssage);
        return iRequest;
    }
    return otBwName;
}

function returnInnerErrors(iRequest, iRequestId, iError, iFunction) {
    try {
        iError.response.data.error.innererror.errordetails.forEach(element => {
            let errMEssage = iFunction + ": " + iRequestId + ". " + element.message.value;
            iRequest.error(450, errMEssage, Attachments, 450);
            LOG.error(errMEssage);
        });
    } catch (error) {
        let debug;
        debug++;
    }

    try {
        let errMEssage = iFunction + ": " + iRequestId + ". " + iError.cause.message;
        iRequest.error(450, errMEssage, Attachments, 450);
        LOG.error(errMEssage);
    } catch (error) {
        let debug;
        debug++;
    }

    try {
        let errMEssage = iFunction + ": " + iRequestId + ". " + iError.stack;
        iRequest.error(451, errMEssage, Attachments, 450);
        LOG.error(errMEssage);
    } catch (error) {
        let debug;
        debug++;
    }
}


module.exports = {
    saveFileonOT,
    getFileFromOT,
    readAttachments,
    createAttachment,
    deleteFileToOt,
    updateOtProcessAttribute,
    eventSaveFileonOT,
    eventGetFileFromOT,
    eventDeleteFileToOt,
    updateFileonOT,
    testSaveOT
}