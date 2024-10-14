"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zsi_Servs_Pv_NonoilSetApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const Zsi_Servs_Pv_NonoilSet_1 = require("./Zsi_Servs_Pv_NonoilSet");
const Zsi_Servs_Pv_NonoilSetRequestBuilder_1 = require("./Zsi_Servs_Pv_NonoilSetRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class Zsi_Servs_Pv_NonoilSetApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = Zsi_Servs_Pv_NonoilSet_1.Zsi_Servs_Pv_NonoilSet;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new Zsi_Servs_Pv_NonoilSetApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new Zsi_Servs_Pv_NonoilSetRequestBuilder_1.Zsi_Servs_Pv_NonoilSetRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(Zsi_Servs_Pv_NonoilSet_1.Zsi_Servs_Pv_NonoilSet, this.deSerializers);
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
                 * Static representation of the {@link rentalUnit} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                RENTAL_UNIT: fieldBuilder.buildEdmTypeField('RENTAL_UNIT', 'Edm.String', false),
                /**
                 * Static representation of the {@link leaseOutNumber} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                LEASE_OUT_NUMBER: fieldBuilder.buildEdmTypeField('LEASE_OUT_NUMBER', 'Edm.String', false),
                /**
                 * Static representation of the {@link rentalStart} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                RENTAL_START: fieldBuilder.buildEdmTypeField('RENTAL_START', 'Edm.DateTime', false),
                /**
                 * Static representation of the {@link rentalEnd} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                RENTAL_END: fieldBuilder.buildEdmTypeField('RENTAL_END', 'Edm.DateTime', false),
                /**
                 * Static representation of the {@link rentAmount} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                RENT_AMOUNT: fieldBuilder.buildEdmTypeField('RENT_AMOUNT', 'Edm.String', false),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', Zsi_Servs_Pv_NonoilSet_1.Zsi_Servs_Pv_NonoilSet)
            };
        }
        return this._schema;
    }
}
exports.Zsi_Servs_Pv_NonoilSetApi = Zsi_Servs_Pv_NonoilSetApi;
//# sourceMappingURL=Zsi_Servs_Pv_NonoilSetApi.js.map