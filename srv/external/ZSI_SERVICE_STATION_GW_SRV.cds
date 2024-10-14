@cds.external
@m.IsDefaultEntityContainer : 'true'
@sap.supported.formats : 'atom json xlsx'
service ZSI_SERVICE_STATION_GW_SRV
{
    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ZSI_SERVICE_STATION_GWSet
    {
        key SERV_SID : String(10)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key SALES_ORG : String(4)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DISTR_CH : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DIVISION : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        LOC_VALUE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        LOC_DESCR : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        AREA_Q8 : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        AREA_Q8DESCR : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        STATUS : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        STATUS_DESCR : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        SALES_DISTRICT : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        EASY_STATION : String(5) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        HIGHWAY_STATION : String(5) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CHAIN_CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CHAIN_CODE_DESCR : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DIFFERENTIATOR : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DIFFERENTIATOR_DESCR : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DNA : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DNA_DESCR : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        VOLUME : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        UNITOF_MES : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ServStationToContractItem : Association to many ZSI_SERVS_CONTRACT_GW_ITEMSet;
        ServStationToAddress : Association to one ZSI_SERVS_ADDRESS_GWSet;
        ServStationToAgent : Association to one ZSI_SERVS_AGENT_GWSet;
        ServStationToDealer : Association to one ZSI_SERVS_DEALER_GWSet;
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ZSI_SERVS_CONTRACT_GW_ITEMSet
    {
        key SERV_SID : String(10)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key SALES_ORG : String(4)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DISTR_CH : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DIVISION : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CONTRACT_NUMBER : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CONTRACT_START : DateTime not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CONTRACT_END : DateTime not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        VALIDITY_PERIOD : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        VALIDITY_PERIOD_DESC : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ZSI_SERVS_ANNUAL_VOLUMESSet
    {
        key SERV_SID : String(10)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key SALES_ORG : String(4)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DISTR_CH : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DIVISION : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        FROM_DATE : Timestamp not null
            @odata.Precision : 7
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        TO_DATE : Timestamp not null
            @odata.Precision : 7
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MAT_GROUP : String(9) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Gr. materiali'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MATERIAL : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MAT_VOL : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MAT_YEAR : String(4) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Collegamento'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MAT_MONTH : String(2) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'C.Tx02'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.addressable : 'false'
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ChainListSet
    {
        key ChainCode : String(10)
            @sap.creatable : 'false'
            @sap.label : 'Cd.sett.ind.'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ChainDesc : LargeString
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Spras : String(2)
            @sap.creatable : 'false'
            @sap.label : 'Lingua'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ChainToAddress : Association to many ZSI_SERVS_ADDRESS_GWSet;
        ChainToServiceStation : Association to many ZSI_SERVICE_STATION_GWSet;
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity RentReceivedTypeSet
    {
        key ServiceStationId : String(10)
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key CompanyCode : String(4)
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key Language : String(2)
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        RentalUnit : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        LeaseOutNumber : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        RentalStart : DateTime not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        RentalEnd : DateTime not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        RentAmount : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        RentalUnitDesc : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ServiceStationDataSet
    {
        key ServiceStationId : String(10)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key SalesOrg : String(4)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DistrChanel : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key Division : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        LocValue : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        LocDescr : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        AreaQ8 : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        AreaQ8descr : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Status : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        StatusDescr : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        SalesDistrict : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        EasyStation : String(5) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        HighwayStation : String(5) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ChainCode : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ChainCodeDescr : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Differentiator : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DifferentiatorDescr : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Dna : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DnaDescr : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Volume : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        UnitOfMes : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        LocName : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Street : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        StreetNumb : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        City : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ZipCode : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Region : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Province : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Code : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Name : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Address : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Zip : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Piva : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Fcode : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity GestorePVCodeSet
    {
        key SERV_SID : String(10)
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key SALES_ORG : String(4)
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DISTR_CH : String(2)
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DIVISION : String(2)
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key PARTNER : String(20)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        PARTNER_FUNC : String(10) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        PARTNER_DESCRIPTION : String(100) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ACTIVE : String(1) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        START_DATE : DateTime
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        END_DATE : DateTime
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity OrganizationalUnitSet
    {
        key Vkgrp : String(3)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Gr.add.vendite'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Spras : String(2) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Lingua'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Bezei : String(20) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Descrizione'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.addressable : 'false'
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity PVDealerRevSet
    {
        key SALES_POINT : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DEALER : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CUSTOMER_NAME : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        TAX_CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ZSI_SERVS_ADDRESS_GWSet
    {
        key SERV_SID : String(10)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key SALES_ORG : String(4)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DISTR_CH : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DIVISION : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        LOC_NAME : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        STREET : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        STREET_NUMB : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CITY : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ZIP_CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        REGION : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        PROVINCE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ZSI_SERVS_AGENT_GWSet
    {
        key SERV_SID : String(10)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key SALES_ORG : String(4)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DISTR_CH : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DIVISION : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        AGENT_ID : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        LAST_NAME : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        FIRST_NAME : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        USER_ID : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ZSI_SERVS_DEALER_GWSet
    {
        key SERV_SID : String(10)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key SALES_ORG : String(4)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DISTR_CH : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DIVISION : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        NAME : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ADDRESS : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CITY : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        REGION : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ZIP : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        PIVA : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        FCODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.addressable : 'false'
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity DomainListSet
    {
        key DomainName : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key Spras : String(2)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Lingua'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DomainCode : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DomainValue : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ProductSupplyByPeriodSet
    {
        key ServiceStationId : LargeString
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DateFrom : LargeString
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DateTo : LargeString
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key UoM : LargeString
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Material : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MaterialDesc : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Volume : Decimal(12,2) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ProdGroup : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ProdGroupDesc : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MatGroup : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MatGroupDesc : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MatGroup3 : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MatGroup3desc : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        Alias : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.addressable : 'false'
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity ServiceStationProductSet
    {
        key SERV_SID : String(10)
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key LANGUAGE : String(2)
            @sap.creatable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key REFERENCE_DATE : DateTime
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key PRODGROUP : String(3)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        PRODGROUPTEXT : String(100) not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.addressable : 'false'
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity AgreementSet
    {
        key SALES_POINT : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        COMPANY_CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MONTH : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        YEAR : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DEALER : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CUSTOMER_NAME : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        TAX_CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        START_DATE_ACCESS_MEMBER : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ACCES_TYPE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        AGREEMENT : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        OLD_AGREEMENT : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        START_DATE_OLD_AGREEMENT : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        END_DATE_ACCESS_MEMBER : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        PV_ADDRESS : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.addressable : 'false'
    @sap.content.version : '1'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity AmountCurrencySet
    {
        key Date : Timestamp
            @odata.Precision : 7
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key ForeignCurrency : String(5)
            @sap.filterable : 'false'
            @sap.label : 'Divisa'
            @sap.semantics : 'currency-code'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key LocalCurrency : String(5)
            @sap.filterable : 'false'
            @sap.label : 'Divisa'
            @sap.semantics : 'currency-code'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ForeignAmount : Decimal(23,4) not null
            @sap.filterable : 'false'
            @sap.label : 'Importo'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        LocalAmount : Decimal(23,4)
            @sap.filterable : 'false'
            @sap.label : 'Importo'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        TypeOfRate : String(4)
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Tipo di cambio'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        DateExchangeRate : Timestamp
            @odata.Precision : 7
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.label : 'Data'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }

    @cds.external
    @cds.persistence.skip
    @sap.addressable : 'false'
    @sap.content.version : '1'
    @sap.creatable : 'false'
    @sap.deletable : 'false'
    @sap.pageable : 'false'
    @sap.updatable : 'false'
    entity CessationSet
    {
        key SALES_POINT : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        key DEALER : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        COMPANY_CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        MONTH : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        YEAR : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CUSTOMER_NAME : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        INDUSTRY_CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        TAX_CODE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        AGREEMENT : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        END_DATE_AGREEMENT : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        CIPREG_ACCES_DATE : LargeString
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ACCRUAL_AMOUNT : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        PAYED_AMOUNT : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
        ACCRUAL_BALANCE : LargeString not null
            @sap.creatable : 'false'
            @sap.filterable : 'false'
            @sap.sortable : 'false'
            @sap.unicode : 'false'
            @sap.updatable : 'false';
    }
}
