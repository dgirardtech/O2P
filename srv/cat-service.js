
const cds = require('@sap/cds');
const LOG = cds.log('KupitO2PSrv');
const { createProcess, checkTaskCreated, getMonitorTaskLink, userTaskCounter, getMOAParams } = require('./lib/createProcess');
const { createAttachment, readAttachment, deleteAttachment, createNote, readNote, deleteNote,
    updateRequest,  getMonitorRequest, manageDocPopupData, getDocStatus,
    getEccServices, getAssignInfo, isCreationStep, manageMainData, enrichCountingCreate,enrichCountingSend } = require('./lib/Handler');
const { saveUserAction, assignApprover } = require('./lib/TaskHandler');
const { testMail } = require('./lib/MailHandler');
const { fromDocumentToTree, fromRequestIdToTree,
    fromTreeToDocument, formatDocument, createFIDocument } = require('./lib/ManageDocument');
    const { getEnvParam, getTextBundle,getNameMotivationAction } = require('./lib/Utils');

const { generateO2PF23Aut } = require('./lib/HandlerPDF');
const { constants } = require('@sap/xssec');


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
        Doclog, Docparam, Orgunitreq, Parameters, Proclog, Tribreq, Currency, Param, F24Entratel } = this.entities;
    const { WorkDay } = this.entities;
    const { UserTaskCounter } = this.entities;
    const { CostCenterTextSet, AfeLocationSet } = this.entities;
    const { VendorSet,VendorSHSet, AccDocHeaderSet, AccDocPositionSet, GlAccountCompanySet } = this.entities;



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
    global.F24Entratel = F24Entratel;
    global.Param = Param;

    global.CostCenterTextSet = CostCenterTextSet;
    global.AfeLocationSet = AfeLocationSet;

    global.VendorSet = VendorSet
    global.VendorSHSet = VendorSHSet

    global.AccDocHeaderSet = AccDocHeaderSet
    global.AccDocPositionSet = AccDocPositionSet
    global.GlAccountCompanySet = GlAccountCompanySet




    /////////////////////////////////////////////////////////////////////////////////////

    this.after('READ', 'UserTaskCounter', userTaskCounter);

    this.on('*', [WorkDay], async (req) => {
        return await WorkDayProxy.run(req.query);
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


    //---------Function Assign info----
    this.on('getAssignInfo', getAssignInfo);

    this.on('getMOAParams', async (req) => {
        return await getMOAParams(req.data.REQUEST_ID);
    });


    //-------------ATTACHMENTS-------------------
    this.before('CREATE', 'Attachments', createAttachment);
    this.after('READ', 'Attachments', readAttachment);
    this.before('DELETE', 'Attachments', deleteAttachment);

    //-------------NOTES-------------------
    this.before('CREATE', 'Notes', createNote);
    this.after('READ', 'Notes', readNote);
    this.before('DELETE', 'Notes', deleteNote);


    this.on('printF23Aut', async (req) => {
        // return await generateO2PF23Aut(req);
        let o2pF23Aut = await generateO2PF23Aut(req, false)

        let oResult =

        {

            CONTENT: o2pF23Aut.binary.toString(),
            MEDIATYPE: o2pF23Aut.type,
            CONTENTSTRING: o2pF23Aut.toString('base64')

        }

        return oResult

    });


    this.on('manageMainData', async (req) => {
        return await manageMainData(req);
    });



    this.on('manageDocPopupData', async (req) => {
        return await manageDocPopupData(req, false);
    });


    this.on('getDocStatus', getDocStatus);

    this.on('isCreationStep', isCreationStep);


    //-------------MONITORING--------------

    this.on('READ', 'MonitorRequest', async (request, next) => {
        return await getMonitorRequest(request, next);
    });

    this.on('READ', 'MonitorRequestDetail', async (request, next) => {
        return await getMonitorRequest(request, next);
    });

  

    this.on('READ', 'CountingCreate', async (request, next) => {

        let aCounting = await next()
 
    
        if (aCounting.length > 0 && !Boolean(aCounting[0].REQUEST_ID)) {
            return aCounting
        }

        let aResult = await enrichCountingCreate(request, aCounting);

        return aResult

    });


    
    this.on('READ', 'CountingSend', async (request, next) => {

        let aCounting = await next()
 
        if (aCounting.length > 0 && !Boolean(aCounting[0].REQUEST_ID)) {
            return aCounting
        }

        let aResult = await enrichCountingSend(request, aCounting);

        return aResult

    });



    this.after('READ', 'Document', formatDocument);



    this.on('getMonitorTaskLink', async (req) => {
        return await getMonitorTaskLink(req.data.REQUEST_ID, req);
    });


    //---------Function Reject info----
    this.on('getRejectInfo', async (req) => {

        let oResultNameMotivation = await getNameMotivationAction(req, req.data.REQUEST_ID, "REJECTED", "");

        return {
            REJECTOR_NAME: oResultNameMotivation.name,
            MOTIVATION: oResultNameMotivation.motivation
        }

    });



    this.on('fromDocumentToTree', fromDocumentToTree);
    this.on('fromRequestIdToTree', fromRequestIdToTree);
    this.on('fromTreeToDocument', fromTreeToDocument);

    this.on('createFIDocument', createFIDocument)

    //-------------ACTION AZIONE ASSEGNAZIONE NUOVO UTENTE-------------------
    this.on('assignApprover', assignApprover);


    this.on('testMail', testMail)


    this.on('READ', CostCenterTextSet, async (request) => {
        return await getEccServices(request, 'ZFI_AFE_COMMON_SRV');
    });

    this.on('READ', AfeLocationSet, async (request) => {
        return await getEccServices(request, 'ZFI_AFE_COMMON_SRV');
    });


    this.on('READ', VendorSet, async (request) => {
        return await getEccServices(request, 'ZFI_O2P_COMMON_SRV');
    });

    this.on('READ', VendorSHSet, async (request) => {
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