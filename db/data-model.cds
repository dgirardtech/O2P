namespace kupit.o2p;

using {
  managed,
  sap.common.CodeList,
  sap.common.Currencies,
} from '@sap/cds/common';

entity Request : managed, Currencies {
  key REQUEST_ID                     : REQUEST_ID;
     // O2P_REQUEST_ID                 : O2P_REQUEST_ID;
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
      WAERS                          : Association to Currencies;
      PRIORITY                       : Boolean;
      PRIORITY_CURR                  : String(10);
      PRIORITY_MOTIV                 : String(50);
      URGENT                         : Boolean;
      EXTRA_MANAGER_REQUIRED         : Boolean;
      EXTRA_MANAGER_NAME             :  String(12);
      TOTAL                          : AMOUNT;
      TOTAL_DOCS                     : Decimal(3, 0);
      F23_SIGN_CONFIRM               : Boolean;
      BANK_ACCOUNT                   : String(10);
      VALUE_DATE                     : Date;
      BENEFICIARY_DATE               : Date;
      PAYMENT_CONFIRM                : Boolean;

      //---> open text
      //COMPOUND_ID
      //PDF_ID
      //


      //EXPIRY_DATE_MAV
      //EXPIRY_DATE_FLUSSI_BON
      //EXPIRY_DATE_F24
      //EXPIRY_DATE_F23
      //---> tutti gli expire date unico campo

      EXPIRY_DATE: Date;

      SKIP_COORD                     : Boolean;
      TYPE_F24_ENTRATEL              : String(10); // forse associata a tabella F24_ENTRATEL dominio ZFI_O2P_D_F24_ENTRATEL_TYPE
      F24_ENTRATEL_CLEARING_ACCOUNT  : String(10);
      NEW_PROC_DOC_TYPE              : String(1); // forse associata a tabella DOC_TYPE dominio ZFI_O2P_D_DOC_PROC_TYPE
      ADDITIONAL_CRO_MAIL_RECIPIENTS : String(255);


      to_Attachments                 : Composition of many Attachments
                                         on to_Attachments.to_Request = $self;
      to_Notes                       : Composition of many Notes
                                         on to_Notes.to_Request = $self;
      to_ApprovalHistory             : Composition of many ApprovalHistory
                                         on to_ApprovalHistory.to_Request = $self;
      to_ApprovalFlow                : Composition of many ApprovalFlow
                                         on to_ApprovalFlow.to_Request = $self;
}

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


entity Attachments : managed {
  key to_Request         : Association to Request;
  key ID                 : Integer;
      CONTENT            : LargeBinary @Core.MediaType: MEDIATYPE;
      MEDIATYPE          : String      @Core.IsMediaType;
      FILENAME           : String;
      SIZE               : Integer;
      URL                : String;
      ATTACHMENTTYPE     : Association to one AttachmentType;
      CREATOR_FULLNAME   : String(100);
      virtual ISEDITABLE : Boolean;
      virtual ATTACHDESC : String(40);

}

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


entity YearRequest {
  key YEAR       : String(4);
      REQUEST_ID : REQUEST_ID_PROG;
}

entity StepDescription {
  key STEP             : STEP_ID;
      STEP_DESCRIPTION : localized STEP_DESCRIPTION;
      STEP_RO          : Boolean default false;
}


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

@cds.odata.valuelist
entity AttachmentType {
  key ATTACHMENTTYPE : String(20);
  //key STEP           : STEP;
      ORDER          : Integer;
      DESCRIPTION    : localized String(40);
}


entity Requester : managed, Currencies {
  key REQUESTER           : String(10);
      REQUESTER_NAME      : String(50);
      BUKRS               : String(4);
      WAERS               : Association to Currencies;
      SEND_TASK           : Boolean;
      MANAGE_SPECIAL_GL   : Boolean;
      MANAGE_ENTE_TRIBUTO : Boolean;
      CHECK_PV_AREA       : Boolean;
      DUMMY_CDC           : Boolean;
      PV_MANDATORY        : Boolean;
      CONTROLLER_CHECK    : Boolean;
      SKIP_COORD          : Boolean;
      INACTIVE            : Boolean;
}

entity Paymode : managed {
  key PAYMENT_MODE         : String(10);
      PAYMENT_NAME         : String(50);
      PAYMENT_NAME_SHORT   : String(20);
      TREASURY_CODE        : String(4);
      MAX_ROW              : Decimal(2, 0); 

}


@cds.persistence.skip
entity UpdateTaskId {
  key REQUEST_ID : REQUEST_ID;
  key STEP       : STEP_ID;
  key MAIL_LIST  : String(250)
}


@cds.persistence.skip
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
}

@cds.persistence.skip
entity UpdateRequestVersion {
  key REQUEST_ID : REQUEST_ID;
}


@cds.persistence.skip
entity StepList {
  key STEP : STEP_ID;
}


type STEP             : Integer;
type VERSION          : Integer;
type BPA_TASKID_ID    : String(40);
type FNAME            : String(50);
type LNAME            : String(50);
type FULLNAME         : String(100);
type MAIL             : String(150);
type STEP_STATUS      : StepStatusenum;
type USER_ACTION      : UserActionenum;
type O2P_REQUEST_ID   : String(10);
type SEQUENCE         : Integer;
type IDROLE           : String(150);
type DESCROLE         : String(50);
type ISMANAGER        : Boolean;
type WDID             : String(50); //PERNR
type SAPUSER          : String(15);
type AMOUNT           : Decimal(13, 2) default null;

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
}

@assert.range
type Actionenum       : String(1) enum {
  Approve     = 'A';
  Reject      = 'R';
  Terminate   = 'T';
  Start       = 'S';
}
