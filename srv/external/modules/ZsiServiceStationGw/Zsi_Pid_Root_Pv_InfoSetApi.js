"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zsi_Pid_Root_Pv_InfoSetApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const Zsi_Pid_Root_Pv_InfoSet_1 = require("./Zsi_Pid_Root_Pv_InfoSet");
const Zsi_Pid_Root_Pv_InfoSetRequestBuilder_1 = require("./Zsi_Pid_Root_Pv_InfoSetRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class Zsi_Pid_Root_Pv_InfoSetApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = Zsi_Pid_Root_Pv_InfoSet_1.Zsi_Pid_Root_Pv_InfoSet;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new Zsi_Pid_Root_Pv_InfoSetApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {
            SERV_PID_TO_ANNUAL_VOLUMS: new odata_v2_1.Link('ServPidToAnnualVolums', this, linkedApis[0]),
            SERV_PID_TO_PV_NON_OIL: new odata_v2_1.Link('ServPidToPvNonOil', this, linkedApis[1])
        };
        return this;
    }
    requestBuilder() {
        return new Zsi_Pid_Root_Pv_InfoSetRequestBuilder_1.Zsi_Pid_Root_Pv_InfoSetRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(Zsi_Pid_Root_Pv_InfoSet_1.Zsi_Pid_Root_Pv_InfoSet, this.deSerializers);
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
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', Zsi_Pid_Root_Pv_InfoSet_1.Zsi_Pid_Root_Pv_InfoSet)
            };
        }
        return this._schema;
    }
}
exports.Zsi_Pid_Root_Pv_InfoSetApi = Zsi_Pid_Root_Pv_InfoSetApi;
//# sourceMappingURL=Zsi_Pid_Root_Pv_InfoSetApi.js.map