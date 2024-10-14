"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainListSetApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const ChainListSet_1 = require("./ChainListSet");
const ChainListSetRequestBuilder_1 = require("./ChainListSetRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class ChainListSetApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = ChainListSet_1.ChainListSet;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new ChainListSetApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {
            CHAIN_TO_SERVICE_STATION: new odata_v2_1.Link('ChainToServiceStation', this, linkedApis[0]),
            CHAIN_TO_ADDRESS: new odata_v2_1.Link('ChainToAddress', this, linkedApis[1])
        };
        return this;
    }
    requestBuilder() {
        return new ChainListSetRequestBuilder_1.ChainListSetRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(ChainListSet_1.ChainListSet, this.deSerializers);
        }
        return this._fieldBuilder;
    }
    get schema() {
        if (!this._schema) {
            const fieldBuilder = this.fieldBuilder;
            this._schema = {
                /**
                 * Static representation of the {@link chainCode} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CHAIN_CODE: fieldBuilder.buildEdmTypeField('ChainCode', 'Edm.String', false),
                /**
                 * Static representation of the {@link chainDesc} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CHAIN_DESC: fieldBuilder.buildEdmTypeField('ChainDesc', 'Edm.String', true),
                /**
                 * Static representation of the {@link spras} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                SPRAS: fieldBuilder.buildEdmTypeField('Spras', 'Edm.String', true),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', ChainListSet_1.ChainListSet)
            };
        }
        return this._schema;
    }
}
exports.ChainListSetApi = ChainListSetApi;
//# sourceMappingURL=ChainListSetApi.js.map