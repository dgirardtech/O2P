using kupit.o2p as KupitO2PModel from '../db/data-model';
using {WorkDayProxy as WorkDayService} from './external/WorkDayProxy.csn'; 

@path: 'kupito2pmodel-srv'
service O2PModelService @(requires: [
    'kupito2p_scope',
    'system-user'
]) {
 
    entity Request         as projection on KupitO2PModel.Request
                              order by
                                  REQUEST_ID desc ;


    

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

    entity YearRequest     as projection on KupitO2PModel.YearRequest;
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



   view MonitorRequest as
        select from Request as request
        left outer join ApprovalHistory as approvalHistory
            on  approvalHistory.to_Request.REQUEST_ID     = request.REQUEST_ID
            and approvalHistory.VERSION                   = request.VERSION
            and approvalHistory.To_StepStatus.STEP_STATUS = 'READY'
        left outer join ApprovalFlow as approvalFlow
            on  approvalFlow.REQUEST_ID = approvalHistory.to_Request.REQUEST_ID
            and approvalFlow.STEP       = approvalHistory.STEP 
      
    {
        key request.REQUEST_ID as REQID, 
            request.*,     
            request.createdAt as CREATEDAT_TO,     
            approvalFlow.MAIL,
            approvalFlow.DESCROLE,
            approvalFlow.FULLNAME, 
            virtual null as PV : String       
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

 
 
    function getTemplate() returns getTemplateReturn;

    action   createProcess(MONTH : String, YEAR : String, PROCESSTYPE : String) returns Message;


    action   saveUserAction(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                            STEPID : KupitO2PModel.STEP_ID,
                            ACTION : KupitO2PModel.Actionenum, )             returns Message;


    action   checkTaskCreated(REQUEST_ID : KupitO2PModel.REQUEST_ID,
                              WF_INSTACE_ID : String)                           returns Message;


    function getMonitorTaskLink(REQUEST_ID : KupitO2PModel.REQUEST_ID)       returns Message;
    function getRejectInfo(REQUEST_ID : KupitO2PModel.REQUEST_ID)            returns RejectInfo;

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
    type  getTemplateReturn{

        CONTENT            : LargeBinary @Core.MediaType: MEDIATYPE;
        MEDIATYPE          : String      @Core.IsMediaType;
        CONTENTSTRING : LargeString

    }


}
