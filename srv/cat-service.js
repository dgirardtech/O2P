
const cds = require('@sap/cds');
const LOG = cds.log('KupitO2PSrv');
const { createProcess, checkTaskCreated, getMonitorTaskLink, userTaskCounter,getMOAParams } = require('./lib/createProcess');
const { createAttachment, readAttachment, deleteAttachment, createNote, readNote, deleteNote, getLayout, checkData,
    updateRequest, getTemplate, getRejectInfo, formatMonitoring, formatMonitoringDetail, formatDocument,manageDocPopupData, getDocStatus,
    fromDocumentToTree, fromRequestIdToTree, fromTreeToDocument, getEccServices, createFIDocument,getAssignInfo,isCreationStep } = require('./lib/Handler');
const { getStepParams, getStepList, saveUserAction, assignApprover, genereteDocument,
    emailStartedProcess, emailCompletedProcess, emailTerminatedProcess, emailRejectedProcessTask } = require('./lib/TaskHandler');


module.exports = cds.service.impl(async function () {

    global.that = this;

    global.MailHandler = await cds.connect.to('MailHandler');
    global.MoaExtraction = await cds.connect.to('MoaExtraction');
    global.WorkDayProxy = await cds.connect.to('WorkDayProxy');
    global.ZFI_AFE_COMMON_SRV = await cds.connect.to('ZFI_AFE_COMMON_SRV');
 

    /////////////////////////////////////////////////////////////////////////////////////

    const { Requester, Paymode, AttachmentType, Attachments, Notes,
        ApprovalHistory, ApprovalFlow, StepDescription, ApprovalView,
        Request, Document, Currencies, Accountreq, Bank, Bankexc, Bankreq, Bankdefault, Clearacc,
        Doclog, Docparam, Orgunitreq, Parameters, Proclog, Tribreq, Currency, Param } = this.entities;
    const { WorkDay } = this.entities;
    const { UserTaskCounter } = this.entities;
    const { CostCenterTextSet, AfeLocationSet } = this.entities;
    const { VendorSet,AccDocHeaderSet, AccDocPositionSet,GlAccountCompanySet} = this.entities;
 


    global.ZFI_AFE_COMMON_SRV = await cds.connect.to('ZFI_AFE_COMMON_SRV');
    global.ZFI_O2P_COMMON_SRV = await cds.connect.to('ZFI_O2P_COMMON_SRV');
 

    global.ApprovalView = ApprovalView;
    global.StepDescription = StepDescription;
    global.ApprovalFlow = ApprovalFlow;
    global.AttachmentType = AttachmentType;
    global.Attachments = Attachments;
    global.Notes = Notes;
    global.WorkDay = WorkDay;
    global.ApprovalHistory = ApprovalHistory;
    global.Request = Request;
    global.UserTaskCounter = UserTaskCounter;
    global.Requester = Requester
    global.Paymode = Paymode;
    global.Currencies = Currencies;
    global.Accountreq = Accountreq;
    global.Bank = Bank;
    global.Bankexc = Bankexc;
    global.Bankreq = Bankreq;
    global.Clearacc = Clearacc;
    global.Bankdefault = Bankdefault;
    global.Document = Document;
    global.Doclog = Doclog;
    global.Docparam = Docparam;
    global.Orgunitreq = Orgunitreq;
    global.Parameters = Parameters;
    global.Proclog = Proclog;
    global.Tribreq = Tribreq;
    global.Currency = Currency;
    global.Param = Param;

    global.CostCenterTextSet = CostCenterTextSet;
    global.AfeLocationSet = AfeLocationSet;

    global.VendorSet = VendorSet

    global.AccDocHeaderSet = AccDocHeaderSet
    global.AccDocPositionSet = AccDocPositionSet
    global.GlAccountCompanySet = GlAccountCompanySet

 


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

       //---------Function Assign info----
   this.on('getAssignInfo', getAssignInfo);   

   this.on('getMOAParams', async (req) => {
    let requestId = req.data.REQUEST_ID;
    return await getMOAParams(requestId);
});
  

    //-------------ATTACHMENTS-------------------
    this.before('CREATE', 'Attachments', createAttachment);
    this.after('READ', 'Attachments', readAttachment);
    this.before('DELETE', 'Attachments', deleteAttachment);

    //-------------NOTES-------------------
    this.before('CREATE', 'Notes', createNote);
    this.after('READ', 'Notes', readNote);
    this.before('DELETE', 'Notes', deleteNote);

    this.on('getLayout', getLayout);

    this.on('getTemplate', getTemplate);

    this.on('checkData', checkData);

    this.on('manageDocPopupData', manageDocPopupData)

    this.on('getDocStatus', getDocStatus);

    this.on('isCreationStep', isCreationStep);
    

    //-------------MONITORING--------------
    this.after('READ', 'MonitorRequest', formatMonitoring);

    this.after('READ', 'MonitorRequestDetail', formatMonitoringDetail);

    this.after('READ', 'Document', formatDocument);



    this.on('getMonitorTaskLink', async (req) => {
        let requestId = req.data.REQUEST_ID;
        return await getMonitorTaskLink(requestId, req);
    });


    //---------Function Reject info----
    this.on('getRejectInfo', getRejectInfo);


    this.on('fromDocumentToTree', fromDocumentToTree);
    this.on('fromRequestIdToTree', fromRequestIdToTree);
    this.on('fromTreeToDocument', fromTreeToDocument);

    this.on('createFIDocument', createFIDocument)

    //-------------ACTION AZIONE ASSEGNAZIONE NUOVO UTENTE-------------------
    this.on('assignApprover', assignApprover);


    this.on('READ', CostCenterTextSet, async (request) => {
        return await getEccServices(request, 'ZFI_AFE_COMMON_SRV');
    });

    this.on('READ', AfeLocationSet, async (request) => {
        return await getEccServices(request, 'ZFI_AFE_COMMON_SRV');
    });


    this.on('READ', VendorSet, async (request) => {
        return await getEccServices(request, 'ZFI_O2P_COMMON_SRV');
    });

    this.on('READ', AccDocHeaderSet, async (request) => {
        return await getEccServices(request, 'ZFI_O2P_COMMON_SRV');
    });


    this.on('READ', AccDocPositionSet, async (request) => {
        return await getEccServices(request, 'ZFI_O2P_COMMON_SRV');
    });

    this.on('READ', GlAccountCompanySet, async (request) => {
        return await getEccServices(request, 'ZFI_O2P_COMMON_SRV');
    });

   
    

}
) 