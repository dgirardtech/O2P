
const cds = require('@sap/cds');
const LOG = cds.log('KupitO2PSrv');
const { createProcess, checkTaskCreated, getMonitorTaskLink, userTaskCounter } = require('./lib/createProcess');
const { createAttachment, readAttachment, deleteAttachment, createNote, readNote, deleteNote, getYear, getMonth, updateRequest, getSalesPoint, getSalesPointRevocation, getTemplate, getSalesPointCessation, getRejectInfo } = require('./lib/Handler');
const { getStepParams, getStepList, saveUserAction, assignApprover, genereteDocument, emailStartedProcess, emailCompletedProcess, emailTerminatedProcess, emailRejectedProcessTask } = require('./lib/TaskHandler');


module.exports = cds.service.impl(async function () {

    global.that = this;

    global.MailHandler = await cds.connect.to('MailHandler');
    global.MoaExtraction = await cds.connect.to('MoaExtraction');
    global.WorkDayProxy = await cds.connect.to('WorkDayProxy');

    /////////////////////////////////////////////////////////////////////////////////////

    const { SalesPoints, AttachmentType, Attachments, Notes, ApprovalHistory, Year, ApprovalFlow, StepDescription, ApprovalView } = this.entities;
    const { WorkDay } = this.entities;
    const { YearRequest, UserTaskCounter } = this.entities;
    const { Request } = this.entities;

    global.ApprovalView = ApprovalView;
    global.StepDescription = StepDescription;
    global.ApprovalFlow = ApprovalFlow;
    global.AttachmentType = AttachmentType;
    global.Attachments = Attachments;
    global.Notes = Notes;
    global.SalesPoints = SalesPoints;
    global.WorkDay = WorkDay;
    global.YearRequest = YearRequest;
    global.ApprovalHistory = ApprovalHistory;
    global.Request = Request;
    global.UserTaskCounter = UserTaskCounter;


    /////////////////////////////////////////////////////////////////////////////////////

    this.after('READ', 'UserTaskCounter', userTaskCounter);

    this.on('*', [WorkDay], async (req) => {

        let result = await WorkDayProxy.run(req.query);
        return result;

    });

    //-------------ACTION AVVIO PROCESSO-------------------
    this.on('createProcess', createProcess);

  
    //-------------ACTION RECUPERO URL BPA-------------------
    // this.on('checkTaskCreated', checkTaskCreated);
    this.on('checkTaskCreated', async (req) => {

        let requestId = req.data.REQUEST_ID;
        return await checkTaskCreated(req)

    });

    //-------------ACTION AZIONI Approva\Rifiuta\Termina PROCESSO-------------------
    this.on('saveUserAction', saveUserAction);

    //this.after('READ', 'Request', getRequest);
    this.after('UPDATE', 'Request', updateRequest);

    //-------------FUNCTION Get PDF O2P-----------
    this.on('getPDFContent', async (req) => {
        let requestId = req.data.REQUEST_ID;
        return await genereteDocument(requestId, req, false);
    });


    //-------------ATTACHMENTS-------------------
    this.before('CREATE', 'Attachments', createAttachment);
    this.after('READ', 'Attachments', readAttachment);
    this.before('DELETE', 'Attachments', deleteAttachment);

    //-------------NOTES-------------------
    this.before('CREATE', 'Notes', createNote);
    this.after('READ', 'Notes', readNote);
    this.before('DELETE', 'Notes', deleteNote);

    this.on('READ', 'Year', getYear);
    this.on('READ', 'Month', getMonth);


    this.on('getSalesPoint', getSalesPoint);
    this.on('getSalesPointRevocation', getSalesPointRevocation);
    this.on('getSalesPointCessation',  getSalesPointCessation);
   

    this.on('getTemplate', getTemplate);

   // this.on('getRevocManager', getRevocManager);



    this.on('getMonitorTaskLink', async (req) => {
        let requestId = req.data.REQUEST_ID;
        return await getMonitorTaskLink(requestId, req);
    });


    //---------Function Reject info----
    this.on('getRejectInfo', getRejectInfo);


}
) 