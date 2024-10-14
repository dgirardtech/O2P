"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zsiServiceStationGw = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const Zsi_Service_Station_GwSetApi_1 = require("./Zsi_Service_Station_GwSetApi");
const Zsi_Servs_Contract_Gw_ItemSetApi_1 = require("./Zsi_Servs_Contract_Gw_ItemSetApi");
const Zsi_Servs_Annual_VolumesSetApi_1 = require("./Zsi_Servs_Annual_VolumesSetApi");
const ChainListSetApi_1 = require("./ChainListSetApi");
const Zsi_Servs_Pv_NonoilSetApi_1 = require("./Zsi_Servs_Pv_NonoilSetApi");
const Zsi_Servs_Address_GwSetApi_1 = require("./Zsi_Servs_Address_GwSetApi");
const Zsi_Servs_Agent_GwSetApi_1 = require("./Zsi_Servs_Agent_GwSetApi");
const Zsi_Servs_Dealer_GwSetApi_1 = require("./Zsi_Servs_Dealer_GwSetApi");
const Zsi_Pid_Root_Pv_InfoSetApi_1 = require("./Zsi_Pid_Root_Pv_InfoSetApi");
const DomainListSetApi_1 = require("./DomainListSetApi");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
const BatchRequest_1 = require("./BatchRequest");
function zsiServiceStationGw(deSerializers = odata_v2_1.defaultDeSerializers) {
    return new ZsiServiceStationGw((0, odata_v2_1.mergeDefaultDeSerializersWith)(deSerializers));
}
exports.zsiServiceStationGw = zsiServiceStationGw;
class ZsiServiceStationGw {
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
    get zsi_Service_Station_GwSetApi() {
        const api = this.initApi('zsi_Service_Station_GwSetApi', Zsi_Service_Station_GwSetApi_1.Zsi_Service_Station_GwSetApi);
        const linkedApis = [
            this.initApi('zsi_Servs_Contract_Gw_ItemSetApi', Zsi_Servs_Contract_Gw_ItemSetApi_1.Zsi_Servs_Contract_Gw_ItemSetApi),
            this.initApi('zsi_Servs_Address_GwSetApi', Zsi_Servs_Address_GwSetApi_1.Zsi_Servs_Address_GwSetApi),
            this.initApi('zsi_Servs_Agent_GwSetApi', Zsi_Servs_Agent_GwSetApi_1.Zsi_Servs_Agent_GwSetApi),
            this.initApi('zsi_Servs_Dealer_GwSetApi', Zsi_Servs_Dealer_GwSetApi_1.Zsi_Servs_Dealer_GwSetApi)
        ];
        api._addNavigationProperties(linkedApis);
        return api;
    }
    get zsi_Servs_Contract_Gw_ItemSetApi() {
        return this.initApi('zsi_Servs_Contract_Gw_ItemSetApi', Zsi_Servs_Contract_Gw_ItemSetApi_1.Zsi_Servs_Contract_Gw_ItemSetApi);
    }
    get zsi_Servs_Annual_VolumesSetApi() {
        return this.initApi('zsi_Servs_Annual_VolumesSetApi', Zsi_Servs_Annual_VolumesSetApi_1.Zsi_Servs_Annual_VolumesSetApi);
    }
    get chainListSetApi() {
        const api = this.initApi('chainListSetApi', ChainListSetApi_1.ChainListSetApi);
        const linkedApis = [
            this.initApi('zsi_Service_Station_GwSetApi', Zsi_Service_Station_GwSetApi_1.Zsi_Service_Station_GwSetApi),
            this.initApi('zsi_Servs_Address_GwSetApi', Zsi_Servs_Address_GwSetApi_1.Zsi_Servs_Address_GwSetApi)
        ];
        api._addNavigationProperties(linkedApis);
        return api;
    }
    get zsi_Servs_Pv_NonoilSetApi() {
        return this.initApi('zsi_Servs_Pv_NonoilSetApi', Zsi_Servs_Pv_NonoilSetApi_1.Zsi_Servs_Pv_NonoilSetApi);
    }
    get zsi_Servs_Address_GwSetApi() {
        return this.initApi('zsi_Servs_Address_GwSetApi', Zsi_Servs_Address_GwSetApi_1.Zsi_Servs_Address_GwSetApi);
    }
    get zsi_Servs_Agent_GwSetApi() {
        return this.initApi('zsi_Servs_Agent_GwSetApi', Zsi_Servs_Agent_GwSetApi_1.Zsi_Servs_Agent_GwSetApi);
    }
    get zsi_Servs_Dealer_GwSetApi() {
        return this.initApi('zsi_Servs_Dealer_GwSetApi', Zsi_Servs_Dealer_GwSetApi_1.Zsi_Servs_Dealer_GwSetApi);
    }
    get zsi_Pid_Root_Pv_InfoSetApi() {
        const api = this.initApi('zsi_Pid_Root_Pv_InfoSetApi', Zsi_Pid_Root_Pv_InfoSetApi_1.Zsi_Pid_Root_Pv_InfoSetApi);
        const linkedApis = [
            this.initApi('zsi_Servs_Annual_VolumesSetApi', Zsi_Servs_Annual_VolumesSetApi_1.Zsi_Servs_Annual_VolumesSetApi),
            this.initApi('zsi_Servs_Pv_NonoilSetApi', Zsi_Servs_Pv_NonoilSetApi_1.Zsi_Servs_Pv_NonoilSetApi)
        ];
        api._addNavigationProperties(linkedApis);
        return api;
    }
    get domainListSetApi() {
        return this.initApi('domainListSetApi', DomainListSetApi_1.DomainListSetApi);
    }
    get batch() {
        return BatchRequest_1.batch;
    }
    get changeset() {
        return BatchRequest_1.changeset;
    }
}
//# sourceMappingURL=service.js.map