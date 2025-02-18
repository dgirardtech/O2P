using kupit.o2p as KupitO2PModel from '../db/data-model';
using {WorkDayProxy as WorkDayService} from './external/WorkDayProxy.csn';
using {ZFI_AFE_COMMON_SRV as ZFI_AFE_COMMON_SRV} from './external/ZFI_AFE_COMMON_SRV.csn';
using {ZFI_O2P_COMMON_SRV as ZFI_O2P_COMMON_SRV} from './external/ZFI_O2P_COMMON_SRV.csn';


@path: 'kupito2pmodel-srv'
service O2PModelService @(requires: [
    'kupito2p_scope',
    'system-user'
]) {


    entity Request             as projection on KupitO2PModel.Request
                                  order by
                                      REQUEST_ID desc;


    entity Attachments         as
        projection on KupitO2PModel.Attachments {
                to_Request,
            key to_Request.REQUEST_ID as REQUEST_ID,
            key ID,
                *
        }

    entity Notes               as
        projection on KupitO2PModel.Notes {
                to_Request,
            key to_Request.REQUEST_ID as REQUEST_ID,
            key ID,
            key SEQUENCE,
                *

        }


    entity ApprovalHistory     as
        projection on KupitO2PModel.ApprovalHistory {
                to_Request,
            key to_Request.REQUEST_ID as REQUEST_ID,
            key STEP,
            key VERSION,
                *
        }


    entity ApprovalFlow        as
        projection on KupitO2PModel.ApprovalFlow {
                to_Request,
            key to_Request.REQUEST_ID as REQUEST_ID,
            key STEP,
            key SEQUENCE,
                *
        }

    entity WorkDay             as projection on WorkDayService.wdEmployeeExtended;

    @readonly
    entity Status              as projection on KupitO2PModel.Status
                                  where
                                         code = 'PRO'
                                      or code = 'REJ'
                                      or code = 'COM'
                                      or code = 'DEL';


    @readonly
    entity AttachmentType      as projection on KupitO2PModel.AttachmentType;


    entity StepDescription     as projection on KupitO2PModel.StepDescription;
    entity UserTaskCounter     as projection on KupitO2PModel.UserTaskCounter;
    entity Parameters          as projection on KupitO2PModel.Parameters;

    ///////////////////////////////////////////////////////////////////////////////////

    entity Requester           as projection on KupitO2PModel.Requester;
    entity Paymode             as projection on KupitO2PModel.Paymode;
    entity Accountreq          as projection on KupitO2PModel.Accountreq;
    entity Bank                as projection on KupitO2PModel.Bank;
    entity Bankreq             as projection on KupitO2PModel.Bankreq;
    entity Bankexc             as projection on KupitO2PModel.Bankexc;
    entity Bankdefault         as projection on KupitO2PModel.Bankdefault;
    entity Clearacc            as projection on KupitO2PModel.Clearacc;
    entity Doclog              as projection on KupitO2PModel.Doclog;
    entity Docparam            as projection on KupitO2PModel.Docparam;
    entity Document            as projection on KupitO2PModel.Document;
    entity Orgunitreq          as projection on KupitO2PModel.Orgunitreq;
    entity Tribreq             as projection on KupitO2PModel.Tribreq;
    entity Trib                as projection on KupitO2PModel.Trib;
    entity Currency            as projection on KupitO2PModel.Currency;
    entity Param               as projection on KupitO2PModel.Param;
    entity F24Entratel         as projection on KupitO2PModel.F24Entratel;
    entity JobRunHeader        as projection on KupitO2PModel.JobRunHeader;
    entity JobRunItem          as projection on KupitO2PModel.JobRunItem;
    entity JobRunVariant       as projection on KupitO2PModel.JobRunVariant;


    ////////////////////////////////////////////////////////////////////////////////////

    @cds.persistence.skip
    entity CostCenterTextSet   as projection on ZFI_AFE_COMMON_SRV.CostCenterTextSet;

    @cds.persistence.skip
    entity AfeLocationSet      as projection on ZFI_AFE_COMMON_SRV.AfeLocationSet;


    @cds.persistence.skip
    entity VendorSet           as projection on ZFI_O2P_COMMON_SRV.VendorSet;

    @cds.persistence.skip
    entity VendorSHSet         as projection on ZFI_O2P_COMMON_SRV.VendorSHSet;

    @cds.persistence.skip
    entity AccDocHeaderSet     as projection on ZFI_O2P_COMMON_SRV.AccDocHeaderSet;


    @cds.persistence.skip
    entity AccDocPositionSet   as projection on ZFI_O2P_COMMON_SRV.AccDocPositionSet;


    @cds.persistence.skip
    entity GlAccountCompanySet as projection on ZFI_O2P_COMMON_SRV.GlAccountCompanySet;


    //////////////////////////////////////////////////////////////////////////////////


    view CountingSend as
        select from Request as request
        inner join Document as document
            on  document.to_Request.REQUEST_ID =      request.REQUEST_ID
            and ID                             =      '001'
            and DOCUMENT_NUMBER                is not null
            and CONTABILE_NICKNAME             <>     '0'
            and CONTABILE_NICKNAME             is not null
            and CONTABILE_SEND_DATE            is     null
        {
            key request.REQUEST_ID,
            key document.DOC_ID,
                document.DOCUMENT_NUMBER,
                document.CONTABILE_NICKNAME,
                request.ENDDATE,
                request.REQUESTER.CODE    as REQUESTER_CODE,
                request.PAYMENT_MODE.CODE as PAYMENT_MODE_CODE,
                request.STATUS.code       as STATUS_CODE,
                request.PRIORITY,
                virtual null              as RESULT_TEXT    : String,
                virtual null              as RESULT_TYPE    : String(1),
                virtual null              as TEST           : Boolean,
                virtual null              as RECIPIENT_ROLE : String,
                virtual null              as RECIPIENT_ADD  : String
        }
        where
                request.PAYMENT_MODE.CODE = 'BONIFICO'
            and request.STATUS.code       = 'COM'
            and request.PRIORITY          = false

        order by
            request.REQUEST_ID desc,
            document.DOC_ID    asc ;


    view CountingCreate as
        select from Request as request
        inner join Document as document
            on  document.to_Request.REQUEST_ID =      request.REQUEST_ID
            and ID                             =      '001'
            and DOCUMENT_NUMBER                is not null
            and (
                   CONTABILE_NICKNAME =  '0'
                or CONTABILE_NICKNAME is null
            )
        {
            key request.REQUEST_ID,
            key document.DOC_ID,
                document.DOCUMENT_NUMBER,
                document.CONTABILE_NICKNAME,
                request.ENDDATE,
                request.REQUESTER.CODE    as REQUESTER_CODE,
                request.PAYMENT_MODE.CODE as PAYMENT_MODE_CODE,
                request.STATUS.code       as STATUS_CODE,
                request.PRIORITY,
                virtual null              as RESULT_TEXT : String,
                virtual null              as RESULT_TYPE : String(1),
                virtual null              as TEST        : Boolean
        }
        where
                request.PAYMENT_MODE.CODE = 'BONIFICO'
            and request.STATUS.code       = 'COM'
            and request.PRIORITY          = false

        order by
            request.REQUEST_ID desc,
            document.DOC_ID    asc ;


    view MonitorRequest as
        select from Request as request
        left outer join ApprovalHistory as approvalHistory
            on  approvalHistory.to_Request.REQUEST_ID     = request.REQUEST_ID
            and approvalHistory.VERSION                   = request.VERSION
            and approvalHistory.To_StepStatus.STEP_STATUS = 'READY'
        left outer join ApprovalFlow as approvalFlow
            on  approvalFlow.REQUEST_ID = approvalHistory.to_Request.REQUEST_ID
            and approvalFlow.STEP       = approvalHistory.STEP

        left outer join Orgunitreq as orgunitreq
            on  orgunitreq.REQUESTER.CODE = request.REQUESTER.CODE
            and orgunitreq.ORGUNIT        = request.AREA_CODE

        left outer join Attachments as attachments
            on  attachments.to_Request.REQUEST_ID         = request.REQUEST_ID
            and attachments.ATTACHMENTTYPE.ATTACHMENTTYPE = 'DOC'

        left outer join (
            select
                to_Request.REQUEST_ID as REQUEST_ID,
                DOC_ID,
                ID,
                AUTHORITY,
                DOC_YEAR,
                TRIBUTE
            from Document as documentint order by
                DOC_ID             asc ,
                ID                 asc
            limit 1
        ) as document
            on document.REQUEST_ID = request.REQUEST_ID

        left outer join (
            select
                count( * ) as STEP_TO_END     : KupitO2PModel.STEP_TO_END,
                to_Request.REQUEST_ID,
                VERSION
            from ApprovalHistory as history
            where
                   To_StepStatus.STEP_STATUS = 'NOTASSIGNED'
                or To_StepStatus.STEP_STATUS = 'READY'
            group by
                to_Request.REQUEST_ID,
                VERSION
        ) as approvalNotAssigned
            on  approvalNotAssigned.REQUEST_ID = request.REQUEST_ID
            and approvalNotAssigned.VERSION    = request.VERSION

        {
            key request.REQUEST_ID as REQID,
                request.*,
                request.createdAt  as CREATEDAT_TO,
                orgunitreq.NOTE    as AREA_DESC,
                approvalFlow.MAIL,
                approvalFlow.DESCROLE,
                approvalFlow.FULLNAME,
                document.AUTHORITY,
                document.DOC_YEAR,
                document.TRIBUTE,
                approvalHistory.ASSIGNED_AT,
                approvalNotAssigned.STEP_TO_END,
                approvalHistory.DAYS_SPENT,
                approvalHistory.SHOW_ASSIGNED_AT,
                attachments.ATTACHMENTTYPE.ATTACHMENTTYPE,
                virtual null       as PC      : Boolean,
                virtual null       as NC      : Boolean,
                virtual null       as AC      : Boolean,
                virtual null       as CLEARED : String,


        }
        order by
                request.REQUEST_ID desc;


    ///////////////////////////////////////////////////////////////////////////////


    view MonitorRequestDetail as
        select from Request as request
        inner join (
            select
                documentint.to_Request.REQUEST_ID as REQUEST_ID,
                documentint.DOC_ID,
                count(
                    documentint.AMOUNT
                )                                 as TOT_AMOUNT_DOC : KupitO2PModel.AMOUNT
            from Document as documentint
            group by
                documentint.to_Request.REQUEST_ID,
                documentint.DOC_ID
        ) as document_count
            on document_count.REQUEST_ID = request.REQUEST_ID


        inner join Document as document
            on  document.to_Request.REQUEST_ID = document_count.REQUEST_ID
            and document.DOC_ID                = document_count.DOC_ID


        left outer join ApprovalHistory as approvalHistory
            on  approvalHistory.to_Request.REQUEST_ID     = request.REQUEST_ID
            and approvalHistory.VERSION                   = request.VERSION
            and approvalHistory.To_StepStatus.STEP_STATUS = 'READY'
        left outer join ApprovalFlow as approvalFlow
            on  approvalFlow.REQUEST_ID = approvalHistory.to_Request.REQUEST_ID
            and approvalFlow.STEP       = approvalHistory.STEP
        //  excluding {  document.createdAt , document.createdBy, document.modifiedAt,  document.modifiedBy }
        {
            key request.REQUEST_ID as REQID,
            key document.DOC_ID    as DOCID, // key document.ID as POSDOCID,
                document_count.TOT_AMOUNT_DOC,
                request.*,
                // document.ID,
                document.DOC_ID,
                document.AUTHORITY,
                document.TRIBUTE,
                document.DOC_YEAR,
                document.LOCATION,
                document.VENDOR,
                document.IBAN,
                document.PARTN_BNK_TYPE,
                document.REF_ID,
                document.SPECIAL_GL_IND,
                document.ACCOUNT,
                document.REASON,
                document.AMOUNT,
                document.TEXT,
                document.COST_CENTER,
                document.INT_ORDER,
                document.DOCUMENT_COMP_CODE,
                document.DOCUMENT_FISCAL_YEAR,
                document.DOCUMENT_NUMBER,
                document.CLEARING_NUMBER,
                document.CONTABILE_NICKNAME,
                document.CONTABILE_SEND_DATE,
                document.NOTE,
                document.ATTRIBUZIONE,
                document.RIFERIMENTO,
                document.REFKEY2,
                document.VALUT,
                document.IS_FROM_EXCEL,
                approvalFlow.FULLNAME,
                virtual null       as VENDOR_DESC                   : String,
                virtual null       as VENDOR_IBAN                   : String,
                virtual null       as PAYMODE_DESC                  : String,
                virtual null       as PC                            : Boolean,
                virtual null       as NC                            : Boolean,
                virtual null       as AC                            : Boolean,

        }
        where
            document.ID = 1
        order by
            request.REQUEST_ID desc,
            document.DOC_ID    asc ; //, document.ID asc;


    ///////////////////////////////////////////////////////////////////////////////
    view ApprovalView as
        select from ApprovalFlow as approvalFlow
        inner join ApprovalHistory as approvalHistory
            on  approvalFlow.REQUEST_ID = approvalHistory.REQUEST_ID
            and approvalFlow.STEP       = approvalHistory.STEP
        inner join Request as request
            on  approvalHistory.REQUEST_ID = request.REQUEST_ID
            and approvalHistory.VERSION    = request.VERSION
        {
            key request.REQUEST_ID,
            key approvalFlow.STEP,
            key approvalFlow.SEQUENCE,
                request.VERSION,
                approvalFlow.WDID,
                approvalFlow.MAIL,
                approvalFlow.FNAME,
                approvalFlow.LNAME,
                approvalFlow.FULLNAME,
                approvalFlow.IDROLE,
                approvalFlow.DESCROLE,
                approvalHistory.To_StepStatus.STEP_STATUS,
                approvalHistory.To_StepStatus.STEP_TEXT,
                approvalHistory.To_Action.ACTION,
                approvalHistory.To_Action.ACTION_TEXT,
                approvalHistory.REAL_MAIL,
                approvalHistory.REAL_FNAME,
                approvalHistory.REAL_LNAME,
                approvalHistory.REAL_FULLNAME,
                approvalHistory.ASSIGNED_AT,
                approvalHistory.EXECUTED_AT,
                virtual null as SHOW_ASSIGNED_AT : Boolean
        };


    action   saveVariant(ENTITY : String,
                         FILTER_VARIANT : String,
                         NAME_VARIANT : String,
                         ACTIVE_VARIANT : array of String)              returns checkDataReturn;


    action   scheduleRun(INPUT : scheduleRunInput)                      returns checkDataReturn;


    action   createScheduledRun(INPUT : scheduleRunInput,
                                HEADER_ID : String,
                                CRON : String)                          returns checkDataReturn;

    type scheduleRunInput         : {

        CREATION_DATE     : String;
        CREATION_TIME     : String;
        CREATION_WEEK     : String;
        REPETITION_PERIOD : Integer;
        ENTITY            : String;
        FILTER            : String;
        VARIANT           : String;
        PREFIX_JOB_NAME   : String;
    }

    function getAssignInfo(REQUEST_ID : KupitO2PModel.REQUEST_ID)       returns AssignInfo;
    function printF23Aut(REQUEST_ID : KupitO2PModel.REQUEST_ID)         returns fileReturn;
    function downloadDocTemplate()                                      returns fileReturn;
    action   createProcess(REQUESTER : String)                          returns Message;

    action   testMail(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                      DOC_ID : KupitO2PModel.DOC_ID,
                      STEPID : KupitO2PModel.STEP_ID,
                      ACTION : KupitO2PModel.Actionenum,
                      EVENT : String)                                   returns Message;


    action   saveUserAction(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                            STEPID : KupitO2PModel.STEP_ID,
                            ACTION : KupitO2PModel.Actionenum, )        returns Message;


    action   checkTaskCreated(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                              WF_INSTACE_ID : String)                   returns Message;


    action   createFIDocument(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                              DOC_ID : KupitO2PModel.DOC_ID,
                              SIMULATE : String(1),
                              STEPID : KupitO2PModel.STEP_ID)           returns array of createFIDocumentReturn;

    function getMOAParams(REQUEST_ID : KupitO2PModel.REQUEST_ID)        returns getMOAParamsReturn;
    function getMonitorTaskLink(REQUEST_ID : KupitO2PModel.REQUEST_ID)  returns Message;
    function getRejectInfo(REQUEST_ID : KupitO2PModel.REQUEST_ID)       returns RejectInfo;

    function getDocStatus(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                          STEPID : KupitO2PModel.STEP_ID)               returns array of getDocStatusReturn;

    function isCreationStep(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                            DOC_ID : KupitO2PModel.DOC_ID,
                            STEPID : KupitO2PModel.STEP_ID)             returns isCreationStepReturn;

    action   fromDocumentToTree(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                                DOCUMENT : array of Document)           returns DocTree;

    action   fromRequestIdToTree(REQUEST_ID : KupitO2PModel.REQUEST_ID) returns DocTree;

    action   fromTreeToDocument(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                                DOC_TREE : DocTree)                     returns array of Document;

    action   assignApprover(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                            NOTE : String,
                            EMAIL : String)                             returns Message;


    action   manageMainData(request : Request,
                            document : array of Document,
                            attachment : array of Attachments)          returns array of manageMainDataReturn;


    type manageMainDataReturn     : {

        VIS_PRIORITY                     : Boolean;
        VIS_ADD_CRO_MAIL                 : Boolean;
        VIS_EXPIRE_DATE                  : Boolean;
        LAB_EXPIRE_DATE                  : String;
        VIS_BENEFICIARY_DATE             : Boolean;
        VIS_F24_ENTRATEL_TYPE            : Boolean;
        VIS_F24_ENTRATEL_TYPE_CL_ACCOUNT : Boolean;
        VIS_SEND_TASK_BTN                : Boolean;
        ERROR                            : array of checkDataReturn

    }

    action   manageDocPopupData(PAYMODE : String,
                                REQUEST_ID : KupitO2PModel.REQUEST_ID,
                                DOC_ID : KupitO2PModel.DOC_ID,
                                ID : KupitO2PModel.DOC_ID_POS,
                                LOCATION : KupitO2PModel.LOCATION,
                                VENDOR : KupitO2PModel.VENDOR,
                                COST_CENTER : KupitO2PModel.COST_CENTER,
                                INT_ORDER : KupitO2PModel.INT_ORDER,
                                ACCOUNT : KupitO2PModel.ACCOUNT,
                                AMOUNT : Decimal(13, 2),
                                REASON : KupitO2PModel.REASON,
                                IBAN : KupitO2PModel.IBAN,
                                NOTE : String,
                                ATTRIBUZIONE : String(18))              returns manageDocPopupDataReturn;


    type manageDocPopupDataReturn : {

        LOCATION_DESC    : String;
        VENDOR_DESC      : String;
        REF_ID           : String;
        COST_CENTER_DESC : String;
        INT_ORDER_DESC   : String;
        REQ_LOCATION     : Boolean default false;
        VIS_COGE         : Boolean default false;
        VIS_TRIBUTO      : Boolean default false;
        VIS_COST_CENTER  : Boolean default false;
        REQ_COST_CENTER  : Boolean default false;
        VIS_INT_ORDER    : Boolean default false;
        REQ_INT_ORDER    : Boolean default false;
        VIS_CDC_DUMMY    : Boolean default false;
        VIS_NOTE         : Boolean default false;
        REQ_NOTE         : Boolean default false;
        VIS_REFKEY2      : Boolean default false;
        VIS_RIFERIMENTO  : Boolean default false;
        VIS_ATTRIBUZIONE : Boolean default false;
        REQ_ATTRIBUZIONE : Boolean default false;
        REQ_IBAN         : Boolean default false;
        VIS_IBAN         : Boolean default false;
        REQ_REASON       : Boolean default true;
        VIS_REASON       : Boolean default true;
        REQ_AMOUNT       : Boolean default true;
        VIS_AMOUNT       : Boolean default true;
        REQ_VENDOR       : Boolean default true;
        VIS_VENDOR       : Boolean default true;
        IBAN             : array of IBAN;
        ACCOUNT          : array of ACCOUNT;
        ERROR            : array of checkDataReturn

    }

    type isCreationStepReturn     : String;

    type AssignInfo               : {
        COMPILER_NAME : String;
        MOTIVATION    : String;
    }

    type getMOAParamsReturn       : {

        depreAccount        : String;
        addStep30Coord      : String;
        addStep30CoordLinea : String;
        managerExceptStep40 : String;
        addStep40           : String;
        managerStep42       : String;
        addStep45           : String;
        addStep60Controller : String;
        addStep60Cassa      : String;
        addStep60Finanza    : String;
        addStep70           : String;
        addStep80           : String;

    }

    type getDocStatusReturn       : {
        REQUEST_ID  : KupitO2PModel.REQUEST_ID;
        DOC_ID      : KupitO2PModel.DOC_ID;
        VENDOR      : KupitO2PModel.VENDOR;
        VENDOR_DESC : String;
        AMOUNT_TOT  : KupitO2PModel.AMOUNT;
        DOC_TYPE    : KupitO2PModel.DOCTYPE;
        DOC_NUMBER  : KupitO2PModel.DOCNUM;
        STATUS      : String;
        STATUS_TEXT : String
    }


    type IBAN                     : {
        CODE           : KupitO2PModel.IBAN;
        PARTN_BNK_TYPE : KupitO2PModel.PARTN_BNK_TYPE
    }

    type ACCOUNT                  : {
        CODE        : KupitO2PModel.ACCOUNT;
        DESC        : String;
        CONCAT_DESC : String;
    }

    type DocTree                  : {
        REQUEST_ID : KupitO2PModel.REQUEST_ID;
        HEADER     : array of DocHead
    }

    type DocHead                  : {
        DOC_ID               : KupitO2PModel.DOC_ID;
        VENDOR               : KupitO2PModel.VENDOR;
        VENDOR_DESC          : String;
        REASON               : KupitO2PModel.REASON;
        LOCATION             : KupitO2PModel.LOCATION;
        REF_ID               : String;
        IBAN                 : KupitO2PModel.IBAN;
        //
        AUTHORITY            : String(40);
        TRIBUTE              : Decimal(2, 0);
        DOC_YEAR             : KupitO2PModel.YEAR;
        PARTN_BNK_TYPE       : KupitO2PModel.PARTN_BNK_TYPE;
        DOCUMENT_COMP_CODE   : KupitO2PModel.COMPANY;
        DOCUMENT_FISCAL_YEAR : KupitO2PModel.YEAR;
        DOCUMENT_NUMBER      : KupitO2PModel.DOCNUM;
        CLEARING_NUMBER      : KupitO2PModel.DOCNUM;
        POSITION             : array of DocPos
    }

    type DocPos                   : {
        PARENT_ID           : KupitO2PModel.DOC_ID;
        ID                  : KupitO2PModel.DOC_ID_POS;
        ACCOUNT             : KupitO2PModel.ACCOUNT;
        COST_CENTER         : KupitO2PModel.COST_CENTER;
        INT_ORDER           : KupitO2PModel.INT_ORDER;
        AMOUNT              : KupitO2PModel.AMOUNT;
        //
        SPECIAL_GL_IND      : KupitO2PModel.SPECIAL_GL_IND;
        ACCOUNT_ADVANCE     : Boolean;
        NOTE                : String(250);
        TEXT                : String(50);
        CONTABILE_NICKNAME  : String(10);
        CONTABILE_SEND_DATE : Date;
        ATTRIBUZIONE        : String(18);
        RIFERIMENTO         : String(20);
        REFKEY2             : String(12);
        VALUT               : Date;
        IS_FROM_EXCEL       : Boolean
    }


    type checkDataReturn          : {
        MTYPE     : MessageType;
        TEXT      : String;
        REF_FIELD : String
    }

    type createFIDocumentReturn   : {
        MTYPE : MessageType;
        TEXT  : String;
    }

    type Message                  : {
        MTYPE         : MessageType;
        TEXT          : String(250);
        WF_INSTACE_ID : WfInstanceId;
        TASKURL       : String(250);
        TASKID        : String(150);
        REQUESTID     : String(10);
        CONTENT       : String;
    };

    type RejectInfo               : {
        REJECTOR_NAME : String;
        MOTIVATION    : String;
    }

    @assert.range
    type MessageType              : String enum {
        Error   = 'E';
        Warning = 'W';
        Info    = 'I';
        success = 'S'
    }

    type WfInstanceId             : String(250);


    @open
    type fileReturn {

        CONTENT       : String;
        MEDIATYPE     : String @Core.IsMediaType;
        CONTENTSTRING : LargeString

    }


}
