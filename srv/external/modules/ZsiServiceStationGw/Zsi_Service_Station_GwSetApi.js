"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zsi_Service_Station_GwSetApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const Zsi_Service_Station_GwSet_1 = require("./Zsi_Service_Station_GwSet");
const Zsi_Service_Station_GwSetRequestBuilder_1 = require("./Zsi_Service_Station_GwSetRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class Zsi_Service_Station_GwSetApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = Zsi_Service_Station_GwSet_1.Zsi_Service_Station_GwSet;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new Zsi_Service_Station_GwSetApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {
            SERV_STATION_TO_CONTRACT_ITEM: new odata_v2_1.Link('ServStationToContractItem', this, linkedApis[0]),
            SERV_STATION_TO_ADDRESS: new odata_v2_1.OneToOneLink('ServStationToAddress', this, linkedApis[1]),
            SERV_STATION_TO_AGENT: new odata_v2_1.OneToOneLink('ServStationToAgent', this, linkedApis[2]),
            SERV_STATION_TO_DEALER: new odata_v2_1.OneToOneLink('ServStationToDealer', this, linkedApis[3])
        };
        return this;
    }
    requestBuilder() {
        return new Zsi_Service_Station_GwSetRequestBuilder_1.Zsi_Service_Station_GwSetRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(Zsi_Service_Station_GwSet_1.Zsi_Service_Station_GwSet, this.deSerializers);
        }
        return this._fieldBuilder;
    }
    get schema() {
        if (!this._schema) {
            const fieldBuilder = this.fieldBuilder;
            this._schema = {
                /**
                 * Static representation of the {@link servSid} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                SERV_SID: fieldBuilder.buildEdmTypeField('SERV_SID', 'Edm.String', false),
                /**
                 * Static representation of the {@link salesOrg} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                SALES_ORG: fieldBuilder.buildEdmTypeField('SALES_ORG', 'Edm.String', false),
                /**
                 * Static representation of the {@link distrCh} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DISTR_CH: fieldBuilder.buildEdmTypeField('DISTR_CH', 'Edm.String', false),
                /**
                 * Static representation of the {@link division} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DIVISION: fieldBuilder.buildEdmTypeField('DIVISION', 'Edm.String', false),
                /**
                 * Static representation of the {@link locValue} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                LOC_VALUE: fieldBuilder.buildEdmTypeField('LOC_VALUE', 'Edm.String', false),
                /**
                 * Static representation of the {@link locDescr} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                LOC_DESCR: fieldBuilder.buildEdmTypeField('LOC_DESCR', 'Edm.String', false),
                /**
                 * Static representation of the {@link areaQ8} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                AREA_Q_8: fieldBuilder.buildEdmTypeField('AREA_Q8', 'Edm.String', false),
                /**
                 * Static representation of the {@link areaQ8Descr} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                AREA_Q_8_DESCR: fieldBuilder.buildEdmTypeField('AREA_Q8DESCR', 'Edm.String', false),
                /**
                 * Static representation of the {@link status} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                STATUS: fieldBuilder.buildEdmTypeField('STATUS', 'Edm.String', false),
                /**
                 * Static representation of the {@link statusDescr} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                STATUS_DESCR: fieldBuilder.buildEdmTypeField('STATUS_DESCR', 'Edm.String', false),
                /**
                 * Static representation of the {@link salesDistrict} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                SALES_DISTRICT: fieldBuilder.buildEdmTypeField('SALES_DISTRICT', 'Edm.String', false),
                /**
                 * Static representation of the {@link easyStation} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                EASY_STATION: fieldBuilder.buildEdmTypeField('EASY_STATION', 'Edm.String', false),
                /**
                 * Static representation of the {@link highwayStation} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                HIGHWAY_STATION: fieldBuilder.buildEdmTypeField('HIGHWAY_STATION', 'Edm.String', false),
                /**
                 * Static representation of the {@link chainCode} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CHAIN_CODE: fieldBuilder.buildEdmTypeField('CHAIN_CODE', 'Edm.String', false),
                /**
                 * Static representation of the {@link chainCodeDescr} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CHAIN_CODE_DESCR: fieldBuilder.buildEdmTypeField('CHAIN_CODE_DESCR', 'Edm.String', false),
                /**
                 * Static representation of the {@link differentiator} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DIFFERENTIATOR: fieldBuilder.buildEdmTypeField('DIFFERENTIATOR', 'Edm.String', false),
                /**
                 * Static representation of the {@link differentiatorDescr} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DIFFERENTIATOR_DESCR: fieldBuilder.buildEdmTypeField('DIFFERENTIATOR_DESCR', 'Edm.String', false),
                /**
                 * Static representation of the {@link dna} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DNA: fieldBuilder.buildEdmTypeField('DNA', 'Edm.String', false),
                /**
                 * Static representation of the {@link dnaDescr} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DNA_DESCR: fieldBuilder.buildEdmTypeField('DNA_DESCR', 'Edm.String', false),
                /**
                 * Static representation of the {@link volume} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VOLUME: fieldBuilder.buildEdmTypeField('VOLUME', 'Edm.String', false),
                /**
                 * Static representation of the {@link unitofMes} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                UNITOF_MES: fieldBuilder.buildEdmTypeField('UNITOF_MES', 'Edm.String', false),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', Zsi_Service_Station_GwSet_1.Zsi_Service_Station_GwSet)
            };
        }
        return this._schema;
    }
}
exports.Zsi_Service_Station_GwSetApi = Zsi_Service_Station_GwSetApi;
//# sourceMappingURL=Zsi_Service_Station_GwSetApi.js.map