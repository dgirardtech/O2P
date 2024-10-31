using kupit.o2p as KupitO2PModel from '../db/data-model';

@path: 'kupito2pbpa-srv'
service O2PBpaService @(requires: [
    'kupito2p_scope',
    'system-user'
]) {

    @cds.persistence.skip
    entity UpdateRequestVersion as projection on KupitO2PModel.UpdateRequestVersion;

    @cds.persistence.skip
    entity StepParams           as projection on KupitO2PModel.StepParams;

    @cds.persistence.skip
    entity StepList             as projection on KupitO2PModel.StepList;


    action UpdateTaskId(REQUEST_ID : Integer,
                        STEP : Integer,
                        MAIL_LIST : String) returns UpdateTaskIdReturn;

    type UpdateTaskIdReturn : {
        REQUEST_ID : Integer;
        STEP       : Integer;
        MAIL_LIST  : String
    }
    /*
      @cds.persistence.skip
      entity UpdateTaskId  as projection on KupitO2PModel.UpdateTaskId;
  */

    type Message      : {
        MTYPE   : MessageType;
        TEXT    : String(250);
        TASKURL : String(250);
        TASKID  : String(150);
    };

    @assert.range
    type MessageType  : String enum {
        Error   = 'E';
        Warning = 'W';
        Info    = 'I';
        success = 'S'
    }

}
