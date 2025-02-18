const moment = require('moment');
const TextBundle = require('@sap/textbundle').TextBundle;
const LOG = cds.log('KupitO2PSrv');

async function getNameMotivationAction(iRequestId, iUserAction, iVersion) {

    let oldVersion = 0;

    let oResult = { name: "", motivation: "", createby: "" , error : "" }

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

        let errorText = "ERROR getNameMotivationAction: " + oRequest.REQUEST_ID + ". " + error.message
        oResult.error = errorText
        LOG.error(errorText);
        return oResult

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


function checkMail(iMail) {

    if (typeof iMail === "string" && iMail.length === 0) {
        return false;
    } else if (iMail === null) {
        return false;
    } else if (iMail === undefined) {
        return false;
    } else if (iMail === 'null') {
        return false;
    } else {
        return true;
    }
}



async function getTaskComposedUrl(iTaskId, iRequest) {

    let oResult = { absoluteUrl : '', relativeUrl : '' , error : ''}
 

    try {

        let host = iRequest.headers.origin
      
        //Debug da BAS
        if (host === undefined) {
            host = 'https://cf-kupit-dev-yy6gs83h.launchpad.cfapps.eu10.hana.ondemand.com'
        }

        let urlWzSite = getEnvParam("URL_WZ_SITE", false)
        let urlTask1 = getEnvParam("URL_TASK_WF1", false)
        let urlTask2 = getEnvParam("URL_TASK_WF2", false)

        let taskUrl = urlTask1 + urlTask2

        taskUrl = taskUrl.replaceAll("<TASKID>", iTaskId)

        oResult.relativeUrl = taskUrl
        oResult.absoluteUrl = host + urlWzSite + taskUrl

        return oResult

    } catch (error) {

        let errMEssage = "ERROR getTaskComposedUrl:" + error.message
        oResult.error = errMEssage
        LOG.error(errMEssage)
        
    }
  
}

module.exports = {
    getEnvParam,
    getTextBundle,
    getNameMotivationAction,
    checkMail,
    getTaskComposedUrl,
}