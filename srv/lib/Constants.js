exports.SEQUENCE = "REQUESTID";
exports.SEQUENCEO2P = "REQUESTIDO2P";
exports.API_WF_DESTINATION_XSUAA = "sap_process_automation_api_xsuaa";
exports.PATH_API_WF = "../external/modules/SPA_Workflow_Runtime";
exports.API_WF_DESTINATION = "sap_process_automation_api";
exports.WF_DEFINITION_ID = "eu10.cf-kupit-dev-yy6gs83h.kupito2p.o2PProcess";

exports.firstId = "001"


// --------------
exports.SUCCESS = "S";
exports.ERROR = "E";
exports.WARNING = "W";
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


exports.PDFPath = Object.freeze({
    DOCUMENT: 'kupit_o2p_document/kupito2pdocument',
    F23AUT: 'kupit_o2p_document/kupito2pf23aut',
    ACCOUNTING: 'kupit_o2p_document/kupito2paccounting'
});


exports.Paymode = Object.freeze({
    BONIFICO: 'BONIFICO',
    ENTRATEL: 'ENTRATEL',
    F23: 'F23',
    F24: 'F24',
    FLBONIFIC: 'FLBONIFIC',
    MAE: "MAE",
    PAGOPA: "PAGOPA",
    ASSCIRC_NT: 'ASSCIRC_NT'
});

exports.creaDocType = Object.freeze({
    ACCOUNTING: 'A',
    CLEARING: 'C'
});

exports.transaction = Object.freeze({
    FB01: 'FB01',
    FBZ2: 'FBZ2'
});


exports.stepStatus = Object.freeze({
    READY: 'READY',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR',
    NOTASSIGNED: 'NOTASSIGNED'
});




exports.idProcessMail = "O2PPROCESS"

exports.mailId = Object.freeze({
    MISSING_APPROVERS: "MISSING_APPROVERS",
    REFUSE_REQUEST: "REFUSE_REQUEST",
    MODIFY_REQUEST: "MODIFY_REQUEST",
    KA_KB_CREATED: "KA_KB_CREATED",
    KZ_KY_CREATED: "KZ_KY_CREATED",
    ONERIPV: "ONERIPV",
    PRIORITY: "PRIORITY",
    COUNTING: "COUNTING"
});


exports.idProcessNotification = "O2PPROCESS"

// NOTIFICATION ID LIST
exports.notificationId = Object.freeze({
    TASK_READY: "TEAMSNOTIFICATION",
    TASK_REJECTED: "REJECTNOTIFICATION",
});

exports.documentType = Object.freeze({
    KB: "KB",
    KA: "KA",
    KY: "KY",
    KZ: "KZ"
});

// SOSTITUTION PATTERNS 
exports.mailPatterns = Object.freeze({

    REQUEST_ID: "<<REQUEST_ID>>",
    DOC_ID: "<<DOC_ID>>",
    TOT_AMOUNT: "<<TOT_AMOUNT>>",
    ADDRESS : "<<ADDRESS>>",
    PV : "<<PV>>",
    REASON: "<<REASON>>",
    CRO : "<<CRO>>",
    REQUESTER: "<<REQUESTER>>",
    REF_USER: "<<REF_USER>>",
    REF_MOTIVATION: "<<REF_MOTIVATION>>",
    N_DOC: "<<N_DOC>>",
    PRIORITY_TEXT: "<<PRIORITY_TEXT>>",
    MOD_USER: "<<MOD_USER>>",
    MOD_MOTIVATION: "<<MOD_MOTIVATION>>",
    PAYMENT_MODE: "<<PAYMENT_MODE>>",
    FULL_NAME: "<<FULL_NAME>>",
    FULL_NAME_COMPILER: "<<FULL_NAME_COMPILER>>",
    TASK_URL: '<<TASK_URL>>'

});

//Attachment Format
exports.attachmentFormat = Object.freeze({
    PDF: "application/pdf" ,
    CSV : "text/csv"
});


//Attachment Type
exports.attachmentTypes = Object.freeze({
    CAPI: "CAPI",
    FLBONIFIC: "FLBONIFIC",
    F24: "F24",
    F23_CONC: "F23_CONC",
    F23_UFF: "F23_UFF",
    F23_VERS: "F23_VERS",
    COUNTING: "COUNTING",
    DOC : "DOC"
});