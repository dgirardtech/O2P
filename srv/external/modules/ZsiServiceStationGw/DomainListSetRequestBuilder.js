"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainListSetRequestBuilder = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * Request builder class for operations supported on the {@link DomainListSet} entity.
 */
class DomainListSetRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `DomainListSet` entities.
     * @returns A request builder for creating requests to retrieve all `DomainListSet` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for retrieving one `DomainListSet` entity based on its keys.
     * @param domainName Key property. See {@link DomainListSet.domainName}.
     * @param spras Key property. See {@link DomainListSet.spras}.
     * @returns A request builder for creating requests to retrieve one `DomainListSet` entity based on its keys.
     */
    getByKey(domainName, spras) {
        return new odata_v2_1.GetByKeyRequestBuilder(this.entityApi, {
            DomainName: domainName,
            Spras: spras
        });
    }
}
exports.DomainListSetRequestBuilder = DomainListSetRequestBuilder;
//# sourceMappingURL=DomainListSetRequestBuilder.js.map