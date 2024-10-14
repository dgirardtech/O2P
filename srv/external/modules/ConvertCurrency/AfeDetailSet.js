"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfeDetailSet = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * This class represents the entity "AfeDetailSet" of service "ZFA_AFE_COMMON_SRV".
 */
class AfeDetailSet extends odata_v2_1.Entity {
    constructor(_entityApi) {
        super(_entityApi);
    }
}
exports.AfeDetailSet = AfeDetailSet;
/**
 * Technical entity name for AfeDetailSet.
 */
AfeDetailSet._entityName = 'AfeDetailSet';
/**
 * Default url path for the according service.
 */
AfeDetailSet._defaultBasePath = '/sap/opu/odata/sap/ZFA_AFE_COMMON_SRV';
/**
 * All key fields of the AfeDetailSet entity
 */
AfeDetailSet._keys = ['IvApprovalyear', 'IvAufnr', 'IvBukrs'];
//# sourceMappingURL=AfeDetailSet.js.map