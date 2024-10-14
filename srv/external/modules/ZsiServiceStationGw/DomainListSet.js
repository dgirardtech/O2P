"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainListSet = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * This class represents the entity "DomainListSet" of service "ZSI_SERVICE_STATION_GW_SRV".
 */
class DomainListSet extends odata_v2_1.Entity {
    constructor(_entityApi) {
        super(_entityApi);
    }
}
exports.DomainListSet = DomainListSet;
/**
 * Technical entity name for DomainListSet.
 */
DomainListSet._entityName = 'DomainListSet';
/**
 * Default url path for the according service.
 */
DomainListSet._defaultBasePath = '/sap/opu/odata/sap/ZSI_SERVICE_STATION_GW_SRV';
/**
 * All key fields of the DomainListSet entity
 */
DomainListSet._keys = ['DomainName', 'Spras'];
//# sourceMappingURL=DomainListSet.js.map