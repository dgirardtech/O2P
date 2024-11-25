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
    ENTRATEL: 'ENTRATEL'

});


exports.stepStatus = Object.freeze({
    READY: 'READY',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR',
    NOTASSIGNED: 'NOTASSIGNED'
});

 
//exports.idProcessNotification = "O2PPROCESS"
exports.idProcessNotification = "CIPREGAPPYEARLY" //per test

//exports.idProcessMail = "O2PPROCESS"
exports.idProcessMail = "CIPREGPROCESS"

 

exports.mailId = Object.freeze({
    PROCESS_COMPLETED: "PROCESS_COMPLETED",
    MODIFY_REQUEST:    "MODIFY_REQUEST",
    MISSING_APPROVERS: "MISSING_APPROVERS"
});

/*
exports.mailId = Object.freeze({
    MISSING_APPROVERS: "MISSING_APPROVERS",
    PROCESS_DELETED:   "PROCESS_DELETED",
    MODIFY_REQUEST:    "MODIFY_REQUEST",
    PROCESS_COMPLETED_MONTLY: "PROCESS_COMPLETED_MONTLY",
    PROCESS_COMPLETED_YEARLY: "PROCESS_COMPLETED_YEARLY",
    PROCESS_COMPLETED_CESSATION: "PROCESS_COMPLETED_CESSATION",
    PROCESS_APPROVED_CESSATION: "PROCESS_APPROVED_CESSATION",
    PROCESS_COMPLETED_REVOCATION: "PROCESS_COMPLETED_REVOCATION",
    PROCESS_STARTED:   "PROCESS_STARTED"
});

*/

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
    DATA: "<<DATA>>",
    MESE: "<<MESE>>",
    ANNO: "<<ANNO>>",
    NADESIONI: "<<NADESIONI>>",
    REQUESTID: "<<REQUEST_ID>>",
    FULL_NAME_COMPILER: "<<FULL_NAME_COMPILER>>",
    FULL_NAME: "<<FULL_NAME>>",
    TASK_URL: "<<TASK_URL>>",
    IMP2SOMMA: "<<IMP2SOMMA>>",
    AFAVORE: "<<AFAVORE>>", // chiedere
    NUM_BON: "<<NUM_BON>>",
    DATAVECCHIADER: "<<DATAVECCHIADER>>",
    IMPVECCHIADER: "<<IMPVECCHIADER>>",
    DATANUOVIADER: "<<DATANUOVIADER>>",
    IMPNUOVIADER: "<<IMPNUOVIADER>>",
    DATAINTEGR: "<<DATAINTEGR>>",
    IMPINTEGR: "<<IMPINTEGR>>",
    IMPTOT: "<<IMPTOT>>",
    INTEGR: "<<INTEGR>>",
    NOTE: "<<NOTE>>",
    TAB_GESTORI: "<<TAB_GESTORI>>",
    DATA_FINE: "<<DATA_FINE>>"

});




//Attachment Type
exports.attachmentTypes = Object.freeze({
    ADESIONE: "ADESIONE",
    GENERICO: "GENERICO"
});