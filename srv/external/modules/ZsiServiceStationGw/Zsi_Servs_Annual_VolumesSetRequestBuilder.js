"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zsi_Servs_Annual_VolumesSetRequestBuilder = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * Request builder class for operations supported on the {@link Zsi_Servs_Annual_VolumesSet} entity.
 */
class Zsi_Servs_Annual_VolumesSetRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `Zsi_Servs_Annual_VolumesSet` entities.
     * @returns A request builder for creating requests to retrieve all `Zsi_Servs_Annual_VolumesSet` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for retrieving one `Zsi_Servs_Annual_VolumesSet` entity based on its keys.
     * @param servSid Key property. See {@link Zsi_Servs_Annual_VolumesSet.servSid}.
     * @param salesOrg Key property. See {@link Zsi_Servs_Annual_VolumesSet.salesOrg}.
     * @param distrCh Key property. See {@link Zsi_Servs_Annual_VolumesSet.distrCh}.
     * @param division Key property. See {@link Zsi_Servs_Annual_VolumesSet.division}.
     * @returns A request builder for creating requests to retrieve one `Zsi_Servs_Annual_VolumesSet` entity based on its keys.
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
exports.Zsi_Servs_Annual_VolumesSetRequestBuilder = Zsi_Servs_Annual_VolumesSetRequestBuilder;
//# sourceMappingURL=Zsi_Servs_Annual_VolumesSetRequestBuilder.js.map