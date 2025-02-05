const moment = require('moment');
const TextBundle = require('@sap/textbundle').TextBundle;

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

function getEnvParam(name, isObj) {
    if (isObj) {
        let param = (process.env[name] || cds.env[name]);
        if (typeof param === "string") {
            return JSON.parse(process.env[name] || cds.env[name])
        } else {
            return param;
        }
    } else {
        return (process.env[name] || cds.env[name])
    }
}

function getTextBundle(req) {
    // let sLocale = req.user.locale;
    let sLocale = req.locale;
    const oBundle = new TextBundle('../_i18n/i18n', sLocale);
    return oBundle;
}


module.exports = {
    getEnvParam,
    getTextBundle,
    getNameMotivationAction
}