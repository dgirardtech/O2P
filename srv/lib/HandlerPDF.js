const LOG = cds.log('KupitO2PSrv');
const _ = require('underscore');
const convert = require('xml-js'); // https://www.npmjs.com/package/xml-js
const moment = require('moment');
const client = require('@sap-cloud-sdk/http-client');
const connectivity = require('@sap-cloud-sdk/connectivity');
const consts = require("./Constants");
const { _getEnvParam, _getTextBundle } = require('./Utils');


async function _getDestination() {
    let dest = await connectivity.getDestination({ destinationName: "Form_Services_Adobe" });
    return dest;
}

async function createPdf(jsonData, iId, iRequest) {

    let pdfOutput;

    try {
        let sXml = convert.json2xml(jsonData, { compact: true, spaces: 4 });
        sXml = '<?xml version="1.0" encoding="UTF-8"?>' + sXml;

        let sXmlBase64 = Buffer.from(sXml, 'utf8').toString('base64');

        let oBody = {
            "xdpTemplate": consts.XDPTEMPLATE,
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

module.exports = {
    createPdf
}