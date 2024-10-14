"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zsi_Servs_Annual_VolumesSetApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const Zsi_Servs_Annual_VolumesSet_1 = require("./Zsi_Servs_Annual_VolumesSet");
const Zsi_Servs_Annual_VolumesSetRequestBuilder_1 = require("./Zsi_Servs_Annual_VolumesSetRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class Zsi_Servs_Annual_VolumesSetApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = Zsi_Servs_Annual_VolumesSet_1.Zsi_Servs_Annual_VolumesSet;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new Zsi_Servs_Annual_VolumesSetApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new Zsi_Servs_Annual_VolumesSetRequestBuilder_1.Zsi_Servs_Annual_VolumesSetRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(Zsi_Servs_Annual_VolumesSet_1.Zsi_Servs_Annual_VolumesSet, this.deSerializers);
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
                 * Static representation of the {@link fromDate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                FROM_DATE: fieldBuilder.buildEdmTypeField('FROM_DATE', 'Edm.DateTime', false),
                /**
                 * Static representation of the {@link toDate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                TO_DATE: fieldBuilder.buildEdmTypeField('TO_DATE', 'Edm.DateTime', false),
                /**
                 * Static representation of the {@link matGroup} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                MAT_GROUP: fieldBuilder.buildEdmTypeField('MAT_GROUP', 'Edm.String', false),
                /**
                 * Static representation of the {@link material} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                MATERIAL: fieldBuilder.buildEdmTypeField('MATERIAL', 'Edm.String', false),
                /**
                 * Static representation of the {@link matVol} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                MAT_VOL: fieldBuilder.buildEdmTypeField('MAT_VOL', 'Edm.String', false),
                /**
                 * Static representation of the {@link matYear} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                MAT_YEAR: fieldBuilder.buildEdmTypeField('MAT_YEAR', 'Edm.String', false),
                /**
                 * Static representation of the {@link matMonth} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                MAT_MONTH: fieldBuilder.buildEdmTypeField('MAT_MONTH', 'Edm.String', false),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', Zsi_Servs_Annual_VolumesSet_1.Zsi_Servs_Annual_VolumesSet)
            };
        }
        return this._schema;
    }
}
exports.Zsi_Servs_Annual_VolumesSetApi = Zsi_Servs_Annual_VolumesSetApi;
//# sourceMappingURL=Zsi_Servs_Annual_VolumesSetApi.js.map