namespace kupit.o2p;

using {
  managed,
  sap.common.CodeList,
} from '@sap/cds/common';


//ZFI_O2P_REQUEST
entity Request : managed {
  key REQUEST_ID                     : REQUEST_ID;
      STATUS                         : Association to one Status;
      STARDATE                       : DateTime;
      ENDDATE                        : DateTime;
      VERSION                        : VERSION;
      BPA_PROCESS_ID                 : String(40);
      REQUEST_OWNER                  : FULLNAME;
      START_APPROVAL_FLOW            : Timestamp;
      REQUESTER                      : Association to one Requester;
      TITLE                          : String(100);
      AREA_CODE                      : String(10);
      PAYMENT_MODE                   : Association to one Paymode;
      WAERS                          : Association to one Currency;
      PRIORITY                       : Boolean default false;
      PRIORITY_CURR                  : String(10);
      PRIORITY_MOTIV                 : String(50);
      URGENT                         : Boolean default false;
      EXTRA_MANAGER_REQUIRED         : Boolean default false;
      EXTRA_MANAGER_NAME             : String(12);
      TOTAL                          : AMOUNT;
      TOTAL_DOCS                     : Decimal(3, 0);
      F23_SIGN_CONFIRM               : Boolean default false;
      BANK_ACCOUNT                   : String(10);
      VALUE_DATE                     : Date;
      BENEFICIARY_DATE               : Date;
      PAYMENT_CONFIRM                : Boolean default false;

      //---> open text
      //COMPOUND_ID                  : String(20);
      //PDF_ID                       : Integer;
      //


      //EXPIRY_DATE_MAV
      //EXPIRY_DATE_FLUSSI_BON
      //EXPIRY_DATE_F24
      //EXPIRY_DATE_F23
      //---> tutti gli expire date unico campo

      OLD_COMPILER_MAIL              : MAIL;
      OLD_COMPILER_FULLNAME          : FULLNAME;
      EXPIRY_DATE                    : Date;
      PAYMENT_NOTE                   : String;
      SKIP_COORD                     : Boolean default false;
      SKIP_COORD_TEXT                : String;
      TYPE_F24_ENTRATEL              : Association to one F24Entratel; //dominio ZFI_O2P_D_F24_ENTRATEL_TYPE
      F24_ENTRATEL_CLEARING_ACCOUNT  : String(10);
      NEW_PROC_DOC_TYPE              : String(1); // forse associata a tabella DOC_TYPE dominio ZFI_O2P_D_DOC_PROC_TYPE
      ADDITIONAL_CRO_MAIL_RECIPIENTS : String(255);
      ADDITIONAL_MAIL_TEXT           : String;

      to_Attachments                 : Composition of many Attachments
                                         on to_Attachments.to_Request = $self;
      to_Notes                       : Composition of many Notes
                                         on to_Notes.to_Request = $self;
      to_ApprovalHistory             : Composition of many ApprovalHistory
                                         on to_ApprovalHistory.to_Request = $self;
      to_ApprovalFlow                : Composition of many ApprovalFlow
                                         on to_ApprovalFlow.to_Request = $self;
      to_Document                    : Composition of many Document
                                         on to_Document.to_Request = $self;
}

//ZFI_O2P_DOCUMENT
entity Document : managed {
  key to_Request           : Association to Request;
  key DOC_ID               : DOC_ID;
  key ID                   : DOC_ID_POS;
      AUTHORITY            : String(40);
      TRIBUTE              : Decimal(2, 0);
      DOC_YEAR             : YEAR;
      LOCATION             : LOCATION;
      VENDOR               : VENDOR;
      IBAN                 : IBAN;
      PARTN_BNK_TYPE       : PARTN_BNK_TYPE;
      REF_ID               : String(16);
      SPECIAL_GL_IND       : SPECIAL_GL_IND;
      ACCOUNT              : ACCOUNT;
      REASON               : REASON;
      AMOUNT               : AMOUNT;
      TEXT                 : String(50);
      COST_CENTER          : COST_CENTER;
      INT_ORDER            : INT_ORDER;
      DOCUMENT_COMP_CODE   : COMPANY;
      DOCUMENT_FISCAL_YEAR : YEAR;
      DOCUMENT_NUMBER      : DOCNUM;
      CLEARING_NUMBER      : DOCNUM;
      ACCOUNT_ADVANCE      : Boolean default false;
      CONTABILE_NICKNAME   : String(10) default '0';
      CONTABILE_SEND_DATE  : Timestamp;
      NOTE                 : String(250);
      ATTRIBUZIONE         : String(18);
      RIFERIMENTO          : String(20);
      REFKEY2              : String(12);
      VALUT                : Date;
      CRO                  : String(16);
      IS_FROM_EXCEL        : Boolean default false;
      virtual VENDOR_DESC  : String;
}

//ZFI_O2P_APPRFLOW
entity ApprovalFlow {
  key to_Request : Association to Request;
  key STEP       : STEP;
  key SEQUENCE   : SEQUENCE;
      WDID       : WDID; //PERNR
      SAPUSER    : SAPUSER;
      MAIL       : MAIL; //USERID
      FNAME      : FNAME;
      LNAME      : LNAME;
      FULLNAME   : FULLNAME;
      IDROLE     : IDROLE;
      DESCROLE   : DESCROLE;
      ISMANAGER  : ISMANAGER;
}

//ZFI_O2P_APP_HIST
entity ApprovalHistory {
  key to_Request               : Association to Request;
  key STEP                     : STEP;
  key VERSION                  : VERSION;
      To_StepStatus            : Association to StepStatus;
      To_Action                : Association to UserAction;
      REAL_MAIL                : MAIL; //USERID
      REAL_FNAME               : FNAME;
      REAL_LNAME               : LNAME;
      REAL_FULLNAME            : FULLNAME;
      ASSIGNED_AT              : DateTime;
      EXECUTED_AT              : DateTime;
      BPA_TASKID_ID            : BPA_TASKID_ID;
      virtual DAYS_SPENT       : String(3);
      virtual SHOW_ASSIGNED_AT : Boolean;
}


//ZFI_O2P_ATTACH
entity Attachments : managed {
  key to_Request         : Association to Request;
  key ID                 : Integer;
      CONTENT            : LargeBinary @Core.MediaType: MEDIATYPE;
      MEDIATYPE          : String      @Core.IsMediaType;
      FILENAME           : String;
      FILENAMEUP         : String = upper(FILENAME);
      SIZE               : Integer;
      URL                : String;
      OPENTEXTNODEID     : String;
      ATTACHMENTTYPE     : Association to one AttachmentType;
      CREATOR_FULLNAME   : String(100);
      DOC_ID             : DOC_ID;
      virtual ISEDITABLE : Boolean;
      virtual ATTACHDESC : String(40);

}

entity OtNodeIds : managed {
  key REQUEST_ID                 : REQUEST_ID;
      OPENTEXTNODEID             : String;
      OPENTEXTFILEFOLDER         : String;
}

//ZFI_O2P_NOTE
entity Notes : managed {
  key to_Request         : Association to Request;
  key ID                 : Integer;
  key SEQUENCE           : Integer default 10;
      VERSION            : Integer;
      NOTE               : String;
      CREATOR_FULLNAME   : String(100);
      TYPE               : NoteType;
      virtual ISEDITABLE : Boolean;
}


@cds.odata.valuelist
entity StepStatus {
  key STEP_STATUS : STEP_STATUS;
      STEP_TEXT   : localized String(40);
}


@cds.odata.valuelist
entity UserAction {
  key ACTION      : USER_ACTION;
      ACTION_TEXT : localized String(40);
}


//ZFI_O2P_TASKNAME
entity StepDescription {
  key STEP             : STEP_ID;
      STEP_DESCRIPTION : localized STEP_DESCRIPTION;
      STEP_RO          : Boolean default false;
}


//ZFI_O2P_D_STATUS ( dominio )
@assert.range
entity Status : CodeList {
  key code : String(3) enum {
        InCorso        = 'PRO';
        Cancellato     = 'DEL';
        Completato     = 'COM';
        Rifiutato      = 'REJ';
        InApprovazione = 'APP';
      }
}

//ZFI_O2P_D_ATTACH_TYPE ( dominio )
@cds.odata.valuelist
entity AttachmentType {
  key ATTACHMENTTYPE : String(20); 
      ORDER          : Integer;
      DESCRIPTION    : localized String(40);
      ISEDITABLE     : Boolean;
}


entity Parameters : managed {
  key PARAMETER : String;
      DESCR     : String;
      VALUE     : String;
      ORDER     : Integer;
}

// ZFI_O2P_PARAM

entity Param : managed {
  key PARAMNAME  : String(50);
  key VAL_INPUT  : String(50);
  key PARAMNUM   : Decimal(2, 0);
      VAL_OUTPUT : String(50);
}


///////////////////////////////////////////////////////

//ZFI_O2P_REQUESTR + ZFI_O2P_REQ_CUST
entity Requester : managed {
  key CODE                : REQUESTER;
      REQUESTER_NAME      : String(50);
      BUKRS               : COMPANY;
      WAERS               : Association to one Currency;
      SEND_TASK           : Boolean default false;
      MANAGE_SPECIAL_GL   : Boolean default false;
      MANAGE_ENTE_TRIBUTO : Boolean default false;
      CHECK_PV_AREA       : Boolean default false;
      DUMMY_CDC           : Boolean default false;
      PV_MANDATORY        : Boolean default false;
      CONTROLLER_CHECK    : Boolean default false;
      SKIP_COORD          : Boolean default false;
      INACTIVE            : Boolean default false;
}

//ZFI_O2P_PAYMODE
entity Paymode : managed {
  key CODE               : String(10);
      PAYMENT_NAME       : String(50);
      PAYMENT_NAME_SHORT : String(20);
      TREASURY_CODE      : String(4);
      MAX_ROW            : Decimal(2, 0);

}


//ZFI_O2P_ACCOUNTS + ZFI_O2P_MAN_REF3
entity Accountreq : managed {
  key REQUESTER              : Association to one Requester;
  key ACCOUNT                : ACCOUNT;
      ACCOUNT_TEXT           : String(50);
      REQUEST_CDC            : Boolean default false;
      REQUEST_INTERNAL_ORDER : Boolean default false;
      COORDINATOR_LIMIT      : Decimal(11, 2);
      DIRECTOR_TRESHOLD      : Decimal(11, 2);
      SPECIAL_GL_IND         : SPECIAL_GL_IND;
      ACCOUNT_ADVANCE        : Boolean default false;
      POSTAL_ACCOUNT         : Boolean default false;
      VALUE_DATE             : Boolean default false;
      MANDATORY_ATTRIB       : Boolean default false;
      REFKEY2                : Boolean default false;
      REFKEY3                : Boolean default false;
      ACTIVE_CHECK           : Boolean default false;

}

//ZFI_O2P_BANK_DET
entity Bank : managed {
  key CODE     : String(10);
      NAME     : String(40);
      ADDRESS1 : String(100);
      ADDRESS2 : String(100);
      ADDRESS3 : String(100);

}

//ZFI_O2P_BANKS
entity Bankreq : managed {
  key REQUESTER : Association to one Requester;
  key BANK      : Association to one Bank;
      BANK_NAME : String(40);
      IBAN      : String(34);
      ITEM      : Decimal(4, 0);
}


//ZFI_O2P_BANK_EXC
entity Bankexc : managed {
  key ABI_Q8     : String(5);
  key ABI_VENDOR : String(5);
}


// ZFI_O2P_DEF_BANK
entity Bankdefault : managed {
  key REQUESTER    : Association to one Requester;
  key PAYMENT_MODE : Association to one Paymode;
      BANK         : Association to one Bank;
}

// ZFI_O2P_CLEARACC
entity Clearacc : managed {
  key CODE        : String(10);
      DESCRIPTION : String(200);
}


// ZFI_O2P_DOC_LOG
entity Doclog : managed {
  key to_Request   : Association to Request;
  key DOC_ID       : DOC_ID;
  key LOG_TIME     : String;
      CREATOR_USER : String(22);
      DOC_TYPE     : DOCTYPE;
      DOC_NUMBER   : DOCNUM;
      COMPANY_CODE : COMPANY;
      FISCAL_YEAR  : YEAR;
      STATUS       : String;
      STATUS_TEXT  : String;
      CLEARING     : Boolean;
      STEP         : STEP;
}

// ZFI_O2P_DOCPARAM
entity Docparam : managed {
  key PAYMENT_MODE    : Association to one Paymode;
  key ACCOUNT         : ACCOUNT;
  key STEP            : STEP;
  key ACCOUNT_ADVANCE : Boolean default false;
  key PRIORITY        : Boolean default false;
  key URGENT          : Boolean default false;
      DOC_TYPE        : DOCTYPE;
      DOC_PROC_TYPE   : String(1)
}


//ZFI_O2P_OU_REQ
entity Orgunitreq : managed {
  key REQUESTER : Association to one Requester;
      //key ORGUNIT   : Decimal(8, 0);
  key ORGUNIT   : String;
      NOTE      : String(50)

}


//ZFI_O2P_TRIB_SPL
entity Tribreq : managed {
  key REQUESTER      : Association to one Requester;
  key TRIBUTE        : Association to one Trib;
      SPECIAL_GL_IND : SPECIAL_GL_IND
}


////////////////////////////////////////////////////////////

//ZFI_O2P_TRIB_SPL
entity Trib : managed {
  key CODE        : Decimal(2, 0);
      DESCRIPTION : localized String(40);
}

entity Currency : managed {
  key CODE        : String(3);
      DESCRIPTION : String(40);
}

// domain F24_ENTRATEL_TYPE
entity F24Entratel : managed {
  key CODE        : String(10);
      DESCRIPTION : localized String(40);
}

////////////////////////////////////////////////////////////
//JOB

entity JobRunHeader : managed {
  key ID               : UUID @Core.Computed;
      ENTITY           : String;
      VARIANT          : String;
      FILTER           : String;
      JOB_NAME         : String;
      RUN_ID           : Integer;
      SCHEDULED_AT     : String;
      STATUS_JOB       : String;
      STATUS           : String;
      STATUS_TEXT      : String;
      JOB_ID           : Integer;
      JOB_SCHEDULED_ID : String;
      JOB_RUN_ID       : String;
      to_JobRunItem    : Composition of many JobRunItem
                           on to_JobRunItem.to_JobRunHeader = $self
}


entity JobRunItem : managed {
  key to_JobRunHeader : Association to JobRunHeader;
  key ID              : Integer;
      ENTITY          : String;
      VARIANT         : String;
      RUN_ID          : Integer;
      JOB_NAME        : String;
      RESULT_TYPE     : String(1);
      RESULT_TEXT     : String;
}


entity JobRunVariant : managed {
  key ENTITY  : String;
  key VARIANT : String;
      FILTER  : String;

}


////////////////////////////////////////////////////////////


/*
@cds.persistence.skip
entity UpdateTaskId {
  key REQUEST_ID : REQUEST_ID;
  key STEP       : STEP_ID;
  key MAIL_LIST  : String(250)
}
*/


entity UserTaskCounter {
  key TASKID : BPA_TASKID_ID;
      USERID : MAIL;
}


@cds.persistence.skip
entity StepParams {
  key REQUEST_ID       : REQUEST_ID;
  key STEP             : STEP_ID;
      STEP_EXIST       : Boolean;
      MAIL_LIST        : String(150); //USERID
      STEP_DESCRIPTION : STEP_DESCRIPTION;
      STEP_RO          : Boolean;
      PAYMODE          : String;
}

@cds.persistence.skip
entity UpdateRequestVersion {
  key REQUEST_ID : REQUEST_ID;
}


@cds.persistence.skip
entity StepList {
  key STEP : STEP_ID;
}


type COST_CENTER      : String(10);
type INT_ORDER        : String(12);
type REASON           : String(140);
type VENDOR           : String(10);
type COMPANY          : String(4);
type DOCNUM           : String(10);
type SPECIAL_GL_IND   : String(1);
type YEAR             : Decimal(4, 0);
type DOC_ID           : String(3);
type DOC_ID_POS       : String(3);
type DOCTYPE          : String(2);
type ACCOUNT          : String(10);
type REQUESTER        : String(10);
type STEP             : Integer;
type VERSION          : Integer;
type BPA_TASKID_ID    : String(40);
type FNAME            : String(50);
type LNAME            : String(50);
type FULLNAME         : String(100);
type MAIL             : String(150);
type STEP_STATUS      : StepStatusenum;
type USER_ACTION      : UserActionenum;
type SEQUENCE         : Integer;
type IDROLE           : String(150);
type DESCROLE         : String(50);
type ISMANAGER        : Boolean;
type WDID             : String(50); //PERNR
type SAPUSER          : String(15);
type AMOUNT           : Decimal(13, 2) default null;
type STEP_TO_END      : Integer default 0;
type LOCATION         : String(10);
type IBAN             : String(34);
type PARTN_BNK_TYPE   : String(4);


@assert.range
type StepStatusenum   : String(15) enum {
  Ready       = 'READY';
  Completed   = 'COMPLETED';
  Error       = 'ERROR';
  NotAssigned = 'NOTASSIGNED';
}

@assert.range
type UserActionenum   : String(15) enum {
  Approved    = 'APPROVED';
  Rejected    = 'REJECTED';
  Started     = 'STARTED';
  Terminated  = 'TERMINATED';
}

type STEP_DESCRIPTION : String(250);
type REQUEST_ID       : Integer;
type REQUEST_ID_PROG  : Integer;
type STEP_ID          : Integer;

type NoteType         : String(1) enum {
  Process     = '';
  Mod         = 'M';
  Reject      = 'R';
  Assign      = 'A';
  F24         = 'F';
  Terminate   = 'T';
}

@assert.range
type Actionenum       : String(1) enum {
  Approve     = 'A';
  Reject      = 'R';
  Terminate   = 'T';
  Start       = 'S';
}
