"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmountCurrencySet = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * This class represents the entity "AmountCurrencySet" of service "ZFA_AFE_COMMON_SRV".
 */
class AmountCurrencySet extends odata_v2_1.Entity {
    constructor(_entityApi) {
        super(_entityApi);
    }
}
exports.AmountCurrencySet = AmountCurrencySet;
/**
 * Technical entity name for AmountCurrencySet.
 */
AmountCurrencySet._entityName = 'AmountCurrencySet';
/**
 * Default url path for the according service.
 */
AmountCurrencySet._defaultBasePath = '/sap/opu/odata/sap/ZFA_AFE_COMMON_SRV';
/**
 * All key fields of the AmountCurrencySet entity
 */
AmountCurrencySet._keys = ['Date', 'ForeignCurrency', 'LocalCurrency'];
//# sourceMappingURL=AmountCurrencySet.js.map