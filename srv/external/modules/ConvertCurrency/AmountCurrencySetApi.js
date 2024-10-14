"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmountCurrencySetApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const AmountCurrencySet_1 = require("./AmountCurrencySet");
const AmountCurrencySetRequestBuilder_1 = require("./AmountCurrencySetRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class AmountCurrencySetApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = AmountCurrencySet_1.AmountCurrencySet;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new AmountCurrencySetApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new AmountCurrencySetRequestBuilder_1.AmountCurrencySetRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(AmountCurrencySet_1.AmountCurrencySet, this.deSerializers);
        }
        return this._fieldBuilder;
    }
    get schema() {
        if (!this._schema) {
            const fieldBuilder = this.fieldBuilder;
            this._schema = {
                /**
                 * Static representation of the {@link date} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DATE: fieldBuilder.buildEdmTypeField('Date', 'Edm.DateTime', false),
                /**
                 * Static representation of the {@link foreignCurrency} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                FOREIGN_CURRENCY: fieldBuilder.buildEdmTypeField('ForeignCurrency', 'Edm.String', false),
                /**
                 * Static representation of the {@link localCurrency} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                LOCAL_CURRENCY: fieldBuilder.buildEdmTypeField('LocalCurrency', 'Edm.String', false),
                /**
                 * Static representation of the {@link foreignAmount} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                FOREIGN_AMOUNT: fieldBuilder.buildEdmTypeField('ForeignAmount', 'Edm.Decimal', false),
                /**
                 * Static representation of the {@link localAmount} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                LOCAL_AMOUNT: fieldBuilder.buildEdmTypeField('LocalAmount', 'Edm.Decimal', true),
                /**
                 * Static representation of the {@link typeOfRate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                TYPE_OF_RATE: fieldBuilder.buildEdmTypeField('TypeOfRate', 'Edm.String', true),
                /**
                 * Static representation of the {@link dateExchangeRate} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DATE_EXCHANGE_RATE: fieldBuilder.buildEdmTypeField('DateExchangeRate', 'Edm.DateTime', true),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', AmountCurrencySet_1.AmountCurrencySet)
            };
        }
        return this._schema;
    }
}
exports.AmountCurrencySetApi = AmountCurrencySetApi;
//# sourceMappingURL=AmountCurrencySetApi.js.map