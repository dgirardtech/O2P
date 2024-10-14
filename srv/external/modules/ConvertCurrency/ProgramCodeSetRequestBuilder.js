"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramCodeSetRequestBuilder = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * Request builder class for operations supported on the {@link ProgramCodeSet} entity.
 */
class ProgramCodeSetRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `ProgramCodeSet` entities.
     * @returns A request builder for creating requests to retrieve all `ProgramCodeSet` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for creating a `ProgramCodeSet` entity.
     * @param entity The entity to be created
     * @returns A request builder for creating requests that create an entity of type `ProgramCodeSet`.
     */
    create(entity) {
        return new odata_v2_1.CreateRequestBuilder(this.entityApi, entity);
    }
    /**
     * Returns a request builder for retrieving one `ProgramCodeSet` entity based on its keys.
     * @param program Key property. See {@link ProgramCodeSet.program}.
     * @param approvalyear Key property. See {@link ProgramCodeSet.approvalyear}.
     * @param position Key property. See {@link ProgramCodeSet.position}.
     * @returns A request builder for creating requests to retrieve one `ProgramCodeSet` entity based on its keys.
     */
    getByKey(program, approvalyear, position) {
        return new odata_v2_1.GetByKeyRequestBuilder(this.entityApi, {
            Program: program,
            Approvalyear: approvalyear,
            Position: position
        });
    }
}
exports.ProgramCodeSetRequestBuilder = ProgramCodeSetRequestBuilder;
//# sourceMappingURL=ProgramCodeSetRequestBuilder.js.map