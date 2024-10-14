"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfeDetailSetRequestBuilder = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * Request builder class for operations supported on the {@link AfeDetailSet} entity.
 */
class AfeDetailSetRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `AfeDetailSet` entities.
     * @returns A request builder for creating requests to retrieve all `AfeDetailSet` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for retrieving one `AfeDetailSet` entity based on its keys.
     * @param ivApprovalyear Key property. See {@link AfeDetailSet.ivApprovalyear}.
     * @param ivAufnr Key property. See {@link AfeDetailSet.ivAufnr}.
     * @param ivBukrs Key property. See {@link AfeDetailSet.ivBukrs}.
     * @returns A request builder for creating requests to retrieve one `AfeDetailSet` entity based on its keys.
     */
    getByKey(ivApprovalyear, ivAufnr, ivBukrs) {
        return new odata_v2_1.GetByKeyRequestBuilder(this.entityApi, {
            IvApprovalyear: ivApprovalyear,
            IvAufnr: ivAufnr,
            IvBukrs: ivBukrs
        });
    }
}
exports.AfeDetailSetRequestBuilder = AfeDetailSetRequestBuilder;
//# sourceMappingURL=AfeDetailSetRequestBuilder.js.map