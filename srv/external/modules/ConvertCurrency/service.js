"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCurrency = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const ProgramCodeSetApi_1 = require("./ProgramCodeSetApi");
const AmountCurrencySetApi_1 = require("./AmountCurrencySetApi");
const AfeDetailSetApi_1 = require("./AfeDetailSetApi");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
const BatchRequest_1 = require("./BatchRequest");
function convertCurrency(deSerializers = odata_v2_1.defaultDeSerializers) {
    return new ConvertCurrency((0, odata_v2_1.mergeDefaultDeSerializersWith)(deSerializers));
}
exports.convertCurrency = convertCurrency;
class ConvertCurrency {
    constructor(deSerializers) {
        this.apis = {};
        this.deSerializers = deSerializers;
    }
    initApi(key, entityApi) {
        if (!this.apis[key]) {
            this.apis[key] = entityApi._privateFactory(this.deSerializers);
        }
        return this.apis[key];
    }
    get programCodeSetApi() {
        return this.initApi('programCodeSetApi', ProgramCodeSetApi_1.ProgramCodeSetApi);
    }
    get amountCurrencySetApi() {
        return this.initApi('amountCurrencySetApi', AmountCurrencySetApi_1.AmountCurrencySetApi);
    }
    get afeDetailSetApi() {
        return this.initApi('afeDetailSetApi', AfeDetailSetApi_1.AfeDetailSetApi);
    }
    get batch() {
        return BatchRequest_1.batch;
    }
    get changeset() {
        return BatchRequest_1.changeset;
    }
}
//# sourceMappingURL=service.js.map