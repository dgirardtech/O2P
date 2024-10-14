namespace kupit.o2p;

using {
    managed,
    sap.common.CodeList
} from '@sap/cds/common';

entity Request : managed {
    key REQUEST_ID     : REQUEST_ID;
        O2P_REQUEST_ID : O2P_REQUEST_ID ; 
        STATUS         : Association to one Status;
        STARDATE       : DateTime;
        ENDDATE        : DateTime; 
        VERSION        : VERSION; 
        BPA_PROCESS_ID : String(40); 
        REQUEST_OWNER  : FULLNAME;
        START_APPROVAL_FLOW:  Timestamp;



        
        to_Attachments : Composition of many Attachments
                             on to_Attachments.to_Request = $self;
        to_Notes       : Composition of many Notes
                             on to_Notes.to_Request = $self;
        to_ApprovalHistory: Composition of many ApprovalHistory        
                             on to_ApprovalHistory.to_Request = $self;  
        to_ApprovalFlow :   Composition of many ApprovalFlow           
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
  key to_Request : Association to Request;
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
  key to_Request       : Association to Request;
  key ID               : Integer;
  key SEQUENCE         : Integer default 10;
      VERSION          : Integer;
      NOTE             : String;
      CREATOR_FULLNAME :  String(100);
      TYPE             : NoteType;
      virtual ISEDITABLE: Boolean;
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


entity YearRequest{
  key YEAR                     : String(4); 
  REQUEST_ID                   : REQUEST_ID_PROG;
}


 

@assert.range
entity Status : CodeList { 
  Key code: String(3) enum {
  InCorso               = 'PRO';
  Cancellato            = 'DEL';
  Completato            = 'COM';
  Rifiutato             = 'REJ';
  InApprovazione        = 'APP';
  }
}

 
entity UserTaskCounter {
  key TASKID : BPA_TASKID_ID;
      USERID : MAIL;
}

@cds.odata.valuelist
entity AttachmentType {
  key ATTACHMENTTYPE : String(20);
  key PROCESSTYPE    : Association to one ProcessType;
  key STEP           : STEP;
      ORDER          : Integer;
      DESCRIPTION    : localized String(40);
}

 
@assert.range
entity ProcessType: CodeList {
  Key code: String(3) enum {
  Adesione     = 'ADE';
  Iscrizione   = 'ISC'; 
  Revoca       = 'REV'; 
  Cessazione   = 'CES'; 
  }
}

@cds.persistence.skip
entity UpdateTaskId {
  key REQUEST_ID : REQUEST_ID;
  key STEP       : STEP_ID;
  key MAIL_LIST  : String(250)
}

entity StepDescription {
  key PROCESSTYPE      : Association to one ProcessType;
  key STEP             : STEP_ID;
      STEP_DESCRIPTION : localized STEP_DESCRIPTION;
      STEP_RO          : Boolean default false;
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



type STEP                  : Integer;
type VERSION               : Integer;
type BPA_TASKID_ID         : String(40);
type FNAME                 : String(50);
type LNAME                 : String(50);
type FULLNAME              : String(100);
type MAIL                  : String(150);
type STEP_STATUS           : StepStatusenum;
type USER_ACTION           : UserActionenum;
TYPE O2P_REQUEST_ID        : String(10);
type SEQUENCE              : Integer;
type IDROLE                : String(150);
type DESCROLE              : String(50);
type ISMANAGER             : Boolean;
type WDID                  : String(50); //PERNR
type SAPUSER               : String(15);
type AMOUNT                : Decimal(13, 2) default null;

@assert.range
type StepStatusenum : String(15) enum {
  Ready                    = 'READY';
  Completed                = 'COMPLETED';
  Error                    = 'ERROR';
  NotAssigned              = 'NOTASSIGNED';
}

@assert.range
type UserActionenum : String(15) enum {
  Approved                 = 'APPROVED';
  Rejected                 = 'REJECTED';
  Started                  = 'STARTED';
  Terminated               = 'TERMINATED';
}

type STEP_DESCRIPTION      : String(250);
type REQUEST_ID            : Integer;
type REQUEST_ID_PROG       : Integer;
type STEP_ID               : Integer;

type NoteType: String(1) enum {
  Process               = '';
  Mod                   = 'M';
  Reject                = 'R';
  Assign                = 'A';
  F24                   = 'F';
}

@assert.range
type Actionenum                : String(1) enum {
  Approve                  = 'A';
  Reject                   = 'R';
  Terminate                = 'T';
  Start                    = 'S';
}

