const moment = require('moment');
const TextBundle = require('@sap/textbundle').TextBundle;


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
}