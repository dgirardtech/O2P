const cds = require('@sap/cds');
const LOG = cds.log('KupitO2PSrv');
const { getStepParams, getStepList,updateRequestVersion,sendTeamsNotification } = require('./lib/TaskHandler');

module.exports = cds.service.impl(async function () {
    global.that = this;

    const { StepParams, StepList,UpdateRequestVersion, UpdateTaskId } = this.entities;

    global.StepParams = StepParams;
    global.StepList = StepList;
    global.UpdateRequestVersion = UpdateRequestVersion;
    global.UpdateTaskId = UpdateTaskId;

    this.on('READ', StepParams, async (request) => {
        return await getStepParams(request);
    });

    this.on('READ', StepList, async (request) => {
        return await getStepList(request);
    });

    this.on('READ', UpdateRequestVersion, async (request) => {
        return await updateRequestVersion(request);
    });


    this.on('UpdateTaskId', async (request) => {
        return await sendTeamsNotification(request); 
    });

    

});