"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zsi_Pid_Root_Pv_InfoSetRequestBuilder = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * Request builder class for operations supported on the {@link Zsi_Pid_Root_Pv_InfoSet} entity.
 */
class Zsi_Pid_Root_Pv_InfoSetRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `Zsi_Pid_Root_Pv_InfoSet` entities.
     * @returns A request builder for creating requests to retrieve all `Zsi_Pid_Root_Pv_InfoSet` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for retrieving one `Zsi_Pid_Root_Pv_InfoSet` entity based on its keys.
     * @param servSid Key property. See {@link Zsi_Pid_Root_Pv_InfoSet.servSid}.
     * @param salesOrg Key property. See {@link Zsi_Pid_Root_Pv_InfoSet.salesOrg}.
     * @param distrCh Key property. See {@link Zsi_Pid_Root_Pv_InfoSet.distrCh}.
     * @param division Key property. See {@link Zsi_Pid_Root_Pv_InfoSet.division}.
     * @returns A request builder for creating requests to retrieve one `Zsi_Pid_Root_Pv_InfoSet` entity based on its keys.
     */
    getByKey(servSid, salesOrg, distrCh, division) {
        return new odata_v2_1.GetByKeyRequestBuilder(this.entityApi, {
            SERV_SID: servSid,
            SALES_ORG: salesOrg,
            DISTR_CH: distrCh,
            DIVISION: division
        });
    }
}
exports.Zsi_Pid_Root_Pv_InfoSetRequestBuilder = Zsi_Pid_Root_Pv_InfoSetRequestBuilder;
//# sourceMappingURL=Zsi_Pid_Root_Pv_InfoSetRequestBuilder.js.map