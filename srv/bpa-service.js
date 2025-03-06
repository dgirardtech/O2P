const cds = require('@sap/cds');
const LOG = cds.log('KupitO2PSrv');
const { getStepParams, getStepList, updateRequestVersion, updateTaskId,
    sendTeamsNotificationAfterUpdateTaskId } = require('./lib/TaskHandler');
const { generateO2PDocument } = require('./lib/PDFHandler');

module.exports = cds.service.impl(async function () {
    global.that = this;

    const { StepParams, StepList, UpdateRequestVersion, UpdateTaskId } = this.entities;

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

        let oUpdateTaskId = await updateTaskId(request)

        if (oUpdateTaskId.error) {
            request.error(450, oUpdateTaskId.error, null, 450)
            return request
        }

        // background for performance
        cds.spawn({ after: 1000 }, async (tx) => {
            let o2pDocument = await generateO2PDocument(request, true)
            let oResponse = await sendTeamsNotificationAfterUpdateTaskId(oUpdateTaskId) 
        })

        return request

    });



});