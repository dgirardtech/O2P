using kupit.o2p as KupitO2PModel from '../db/data-model';
using {WorkDayProxy as WorkDayService} from './external/WorkDayProxy.csn';


@path: 'kupito2pmodel-srv'
service O2PModelService @(requires: [
    'kupito2p_scope',
    'system-user'
]) {


    entity Request         as projection on KupitO2PModel.Request
                              order by
                                  REQUEST_ID desc;


    entity Attachments     as
        projection on KupitO2PModel.Attachments {
                to_Request,
            key to_Request.REQUEST_ID as REQUEST_ID,
            key ID,
                *
        }

    entity Notes           as
        projection on KupitO2PModel.Notes {
                to_Request,
            key to_Request.REQUEST_ID as REQUEST_ID,
            key ID,
            key SEQUENCE,
                *

        }


    entity ApprovalHistory as
        projection on KupitO2PModel.ApprovalHistory {
                to_Request,
            key to_Request.REQUEST_ID as REQUEST_ID,
            key STEP,
            key VERSION,
                *
        }


    entity ApprovalFlow    as
        projection on KupitO2PModel.ApprovalFlow {
                to_Request,
            key to_Request.REQUEST_ID as REQUEST_ID,
            key STEP,
            key SEQUENCE,
                *
        }

    entity WorkDay         as projection on WorkDayService.wdEmployeeExtended;

    @readonly
    entity Status          as projection on KupitO2PModel.Status
                              where
                                     code = 'PRO'
                                  or code = 'REJ'
                                  or code = 'COM'
                                  or code = 'DEL';


    @readonly
    entity AttachmentType  as projection on KupitO2PModel.AttachmentType;


    entity StepDescription as projection on KupitO2PModel.StepDescription;
    entity UserTaskCounter as projection on KupitO2PModel.UserTaskCounter;
    entity Parameters      as projection on KupitO2PModel.Parameters;

    ///////////////////////////////////////////////////////////////////////////////////

    entity Requester       as projection on KupitO2PModel.Requester;
    entity Paymode         as projection on KupitO2PModel.Paymode;
    entity Accountreq      as projection on KupitO2PModel.Accountreq;
    entity Bank            as projection on KupitO2PModel.Bank;
    entity Bankreq         as projection on KupitO2PModel.Bankreq;
    entity Bankexc         as projection on KupitO2PModel.Bankexc;
    entity Bankdefault     as projection on KupitO2PModel.Bankdefault;
    entity Clearacc        as projection on KupitO2PModel.Clearacc;
    entity Doclog          as projection on KupitO2PModel.Doclog;
    entity Docparam        as projection on KupitO2PModel.Docparam;
    entity Document        as projection on KupitO2PModel.Document;
    entity Orgunitreq      as projection on KupitO2PModel.Orgunitreq;
    entity Proclog         as projection on KupitO2PModel.Proclog;
    entity Tribreq         as projection on KupitO2PModel.Tribreq;
    entity Trib            as projection on KupitO2PModel.Trib;
    entity Currency        as projection on KupitO2PModel.Currency;


    ////////////////////////////////////////////////////////////////////////////////////

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

        left outer join (
            select distinct
                key to_Request.REQUEST_ID as REQUEST_ID,
                    AUTHORITY,
                    DOC_YEAR,
                    TRIBUTE
            from Document as documentint
        ) as document
            on document.REQUEST_ID = request.REQUEST_ID

        left outer join (
            select
                count( * ) as STEP_TO_END : KupitO2PModel.STEP_TO_END,
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
                virtual null       as PV  : String

        }
        order by
            request.REQUEST_ID desc;


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


    function getTemplate()                                              returns getTemplateReturn;

    function getLayout(REQUESTER : String,
                       PAYMENT_MODE : String,
                       PRIORITY : Boolean,
                       F24_ENTRATEL_TYPE : String)                      returns getLayoutReturn;

    action   createProcess(REQUESTER : String)                          returns Message;
    action   checkData(request : Request, document : array of Document) returns array of Message;

    action   saveUserAction(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                            STEPID : KupitO2PModel.STEP_ID,
                            ACTION : KupitO2PModel.Actionenum, )        returns Message;


    action   checkTaskCreated(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                              WF_INSTACE_ID : String)                   returns Message;


    function getMonitorTaskLink(REQUEST_ID : KupitO2PModel.REQUEST_ID)  returns Message;
    function getRejectInfo(REQUEST_ID : KupitO2PModel.REQUEST_ID)       returns RejectInfo;
    action   fromDocumentToTree(DOCUMENT : array of Document)           returns DocTree;
    action   fromRequestIdToTree(REQUEST_ID : KupitO2PModel.REQUEST_ID) returns DocTree;
    action   fromTreeToDocument(DOC_TREE : DocTree)                     returns array of Document;


    type DocTree      : {
        REQUEST_ID : KupitO2PModel.REQUEST_ID;
        HEADER     : array of DocHead
    }

    type DocHead      : {

        DOC_ID      : KupitO2PModel.DOC_ID;
        VENDOR      : KupitO2PModel.VENDOR;
        VENDOR_NAME : String(250);
        REASON      : KupitO2PModel.REASON;
        POSITION    : array of DocPos

    }

    type DocPos       : {

        PARENT_ID   : KupitO2PModel.DOC_ID;
        ID          : KupitO2PModel.DOC_ID_POS;
        ACCOUNT     : KupitO2PModel.ACCOUNT;
        COST_CENTER : KupitO2PModel.COST_CENTER;
        INT_ORDER   : KupitO2PModel.INT_ORDER;
        AMOUNT      : KupitO2PModel.AMOUNT;

    }


    type Message      : {
        MTYPE         : MessageType;
        TEXT          : String(250);
        WF_INSTACE_ID : WfInstanceId;
        TASKURL       : String(250);
        TASKID        : String(150);
        REQUESTID     : String(10);
        CONTENT       : String;
    };

    type RejectInfo   : {
        REJECTOR_NAME : String;
        MOTIVATION    : String;
    }

    @assert.range
    type MessageType  : String enum {
        Error   = 'E';
        Warning = 'W';
        Info    = 'I';
        success = 'S'
    }

    type WfInstanceId : String(250);


    @open
    type getTemplateReturn {

        CONTENT       : LargeBinary @Core.MediaType: MEDIATYPE;
        MEDIATYPE     : String      @Core.IsMediaType;
        CONTENTSTRING : LargeString

    }

    @open
    type getLayoutReturn {

        VIS_PRIORITY                     : Boolean;
        VIS_ADD_CRO_MAIL                 : Boolean;
        VIS_EXPIRE_DATE                  : Boolean;
        LAB_EXPIRE_DATE                  : String;
        VIS_BENEFICIARY_DATE             : Boolean;
        VIS_F24_ENTRATEL_TYPE            : Boolean;
        VIS_F24_ENTRATEL_TYPE_CL_ACCOUNT : Boolean;

    }

}
