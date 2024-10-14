"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainListSetRequestBuilder = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * Request builder class for operations supported on the {@link ChainListSet} entity.
 */
class ChainListSetRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `ChainListSet` entities.
     * @returns A request builder for creating requests to retrieve all `ChainListSet` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for retrieving one `ChainListSet` entity based on its keys.
     * @param chainCode Key property. See {@link ChainListSet.chainCode}.
     * @returns A request builder for creating requests to retrieve one `ChainListSet` entity based on its keys.
     */
    getByKey(chainCode) {
        return new odata_v2_1.GetByKeyRequestBuilder(this.entityApi, {
            ChainCode: chainCode
        });
    }
}
exports.ChainListSetRequestBuilder = ChainListSetRequestBuilder;
//# sourceMappingURL=ChainListSetRequestBuilder.js.map