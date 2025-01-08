exports.SEQUENCE = "REQUESTID";
exports.SEQUENCEO2P = "REQUESTIDO2P";
exports.API_WF_DESTINATION_XSUAA = "sap_process_automation_api_xsuaa";
exports.PATH_API_WF = "../external/modules/SPA_Workflow_Runtime";
exports.API_WF_DESTINATION = "sap_process_automation_api";
exports.WF_DEFINITION_ID = "eu10.cf-kupit-dev-yy6gs83h.kupito2p.o2PProcess";

exports.firstId = "001"


// --------------
exports.SUCCESS  = "S";
exports.ERROR    = "E";
exports.WARNING  = "W";
exports.MOAERROR = "Error";

//Staus BPA - O2P
exports.requestStatus = Object.freeze({
    Progress: 'PRO',
    Deleted: 'DEL',
    Refused: 'REJ',
    Completed: 'COM'
});


exports.bpaUserAction = Object.freeze({
    APPROVE: 'A',
    REJECT: 'R',
    TERMINATE: 'T',
    START: 'S'
});


exports.UserAction = Object.freeze({
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    TERMINATED: 'TERMINATED',
    STARTED: 'STARTED',
});


exports.Paymode = Object.freeze({
    BONIFICO : 'BONIFICO',
    BANK_TRANSFER: 'BANK_TRANSFER',
    MAV: 'MAV',
    RAV: 'RAV',
    CCPOSTALE: 'CCPOSTALE',
    ASSCIRC_NT: 'ASSCIRC_NT',
    F24: 'F24',
    F23: 'F23',
    FRECCIA: 'FRECCIA',
    FLBONIFIC: 'FLBONIFIC',
    ENTRATEL: 'ENTRATEL',
    PAGOPA: "PAGOPA",
    MAE : "MAE"

});


exports.stepStatus = Object.freeze({
    READY: 'READY',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR',
    NOTASSIGNED: 'NOTASSIGNED'
});

 
//exports.idProcessNotification = "O2PPROCESS"
exports.idProcessNotification = "CIPREGAPPYEARLY" //per test

exports.idProcessMail = "O2PPROCESS"
//exports.idProcessMail = "CIPREGPROCESS"

 

exports.mailId = Object.freeze({ 
    MISSING_APPROVERS: "MISSING_APPROVERS",
    REFUSE_REQUEST: "REFUSE_REQUEST",
    MODIFY_REQUEST: "MODIFY_REQUEST",
    KA_KB_CREATED: "KA_KB_CREATED",
    KZ_KY_CREATED: "KZ_KY_CREATED",
    ONERIPV: "ONERIPV",
    PRIORITY: "PRIORITY",
});

 
// NOTIFICATION ID LIST
exports.notificationId = Object.freeze({
    TASK_READY: "TEAMSNOTIFICATION",
    TASK_REJECTED: "REJECTNOTIFICATION",
});

exports.documentType  = Object.freeze({
 KB : "KB",
 KA : "KA",
 KY : "KY",
 KZ : "KZ"
});

// SOSTITUTION PATTERNS 
exports.mailPatterns = Object.freeze({

    REQUEST_ID : "<<REQUEST_ID>>",
    REQUESTER : "<<REQUESTER>>",
    REF_USER : "<<REF_USER>>",
    REF_MOTIVATION : "<<REF_MOTIVATION>>", 
    N_DOC: "<<N_DOC>>",
    PRIORITY_TEXT:"<<PRIORITY_TEXT>>",
    MOD_USER:"<<MOD_USER>>",
    MOD_MOTIVATION: "<<MOD_MOTIVATION>>", 
    PAYMENT_MODE: "<<PAYMENT_MODE>>",

});




//Attachment Type
exports.attachmentTypes = Object.freeze({
    CAPI: "CAPI",
    FLBONIFIC: "FLBONIFIC",
    F24: "F24",
    F23_CONC:"F23_CONC",
    F23_UFF:"F23_UFF",
    F23_VERS:"F23_VERS"
});