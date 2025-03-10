const cds = require('@sap/cds');
const LOG = cds.log('KupitO2PSrv');
const { getStepParams, getStepList, updateRequestVersion, updateTaskId,
    sendTeamsNotificationAfterUpdateTaskId } = require('./lib/TaskHandler');
const { generateO2PDocument, deleteO2PDocument } = require('./lib/PDFHandler');
const consts = require("./lib/Constants");

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

        //let o2pDocument = await generateO2PDocument(request, true)

        // background for performance
        cds.spawn({ after: 1000 }, async (tx) => {

            if (request.data.STEP !== 10) {
                let o2pDocument = await generateO2PDocument(request, true)
            } else {
                let deleteo2pDocument = await deleteO2PDocument(request, request.data.REQUEST_ID)
            }

            let oResponse = await sendTeamsNotificationAfterUpdateTaskId(oUpdateTaskId)
        })

        return request

    });



});