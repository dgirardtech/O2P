"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramCodeSet = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * This class represents the entity "ProgramCodeSet" of service "ZFA_AFE_COMMON_SRV".
 */
class ProgramCodeSet extends odata_v2_1.Entity {
    constructor(_entityApi) {
        super(_entityApi);
    }
}
exports.ProgramCodeSet = ProgramCodeSet;
/**
 * Technical entity name for ProgramCodeSet.
 */
ProgramCodeSet._entityName = 'ProgramCodeSet';
/**
 * Default url path for the according service.
 */
ProgramCodeSet._defaultBasePath = '/sap/opu/odata/sap/ZFA_AFE_COMMON_SRV';
/**
 * All key fields of the ProgramCodeSet entity
 */
ProgramCodeSet._keys = ['Program', 'Approvalyear', 'Position'];
//# sourceMappingURL=ProgramCodeSet.js.map