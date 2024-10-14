"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zsi_Servs_Contract_Gw_ItemSetApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const Zsi_Servs_Contract_Gw_ItemSet_1 = require("./Zsi_Servs_Contract_Gw_ItemSet");
const Zsi_Servs_Contract_Gw_ItemSetRequestBuilder_1 = require("./Zsi_Servs_Contract_Gw_ItemSetRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class Zsi_Servs_Contract_Gw_ItemSetApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = Zsi_Servs_Contract_Gw_ItemSet_1.Zsi_Servs_Contract_Gw_ItemSet;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new Zsi_Servs_Contract_Gw_ItemSetApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new Zsi_Servs_Contract_Gw_ItemSetRequestBuilder_1.Zsi_Servs_Contract_Gw_ItemSetRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(Zsi_Servs_Contract_Gw_ItemSet_1.Zsi_Servs_Contract_Gw_ItemSet, this.deSerializers);
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
                 * Static representation of the {@link contractNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CONTRACT_NUMBER: fieldBuilder.buildEdmTypeField('CONTRACT_NUMBER', 'Edm.String', false),
                /**
                 * Static representation of the {@link contractStart} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CONTRACT_START: fieldBuilder.buildEdmTypeField('CONTRACT_START', 'Edm.DateTime', false),
                /**
                 * Static representation of the {@link contractEnd} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CONTRACT_END: fieldBuilder.buildEdmTypeField('CONTRACT_END', 'Edm.DateTime', false),
                /**
                 * Static representation of the {@link validityPeriod} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VALIDITY_PERIOD: fieldBuilder.buildEdmTypeField('VALIDITY_PERIOD', 'Edm.String', false),
                /**
                 * Static representation of the {@link validityPeriodDesc} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VALIDITY_PERIOD_DESC: fieldBuilder.buildEdmTypeField('VALIDITY_PERIOD_DESC', 'Edm.String', false),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', Zsi_Servs_Contract_Gw_ItemSet_1.Zsi_Servs_Contract_Gw_ItemSet)
            };
        }
        return this._schema;
    }
}
exports.Zsi_Servs_Contract_Gw_ItemSetApi = Zsi_Servs_Contract_Gw_ItemSetApi;
//# sourceMappingURL=Zsi_Servs_Contract_Gw_ItemSetApi.js.map