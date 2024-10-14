"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainListSetApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const DomainListSet_1 = require("./DomainListSet");
const DomainListSetRequestBuilder_1 = require("./DomainListSetRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class DomainListSetApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = DomainListSet_1.DomainListSet;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new DomainListSetApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new DomainListSetRequestBuilder_1.DomainListSetRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(DomainListSet_1.DomainListSet, this.deSerializers);
        }
        return this._fieldBuilder;
    }
    get schema() {
        if (!this._schema) {
            const fieldBuilder = this.fieldBuilder;
            this._schema = {
                /**
                 * Static representation of the {@link domainName} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DOMAIN_NAME: fieldBuilder.buildEdmTypeField('DomainName', 'Edm.String', false),
                /**
                 * Static representation of the {@link spras} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                SPRAS: fieldBuilder.buildEdmTypeField('Spras', 'Edm.String', false),
                /**
                 * Static representation of the {@link domainCode} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DOMAIN_CODE: fieldBuilder.buildEdmTypeField('DomainCode', 'Edm.String', true),
                /**
                 * Static representation of the {@link domainValue} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DOMAIN_VALUE: fieldBuilder.buildEdmTypeField('DomainValue', 'Edm.String', true),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', DomainListSet_1.DomainListSet)
            };
        }
        return this._schema;
    }
}
exports.DomainListSetApi = DomainListSetApi;
//# sourceMappingURL=DomainListSetApi.js.map