"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataExportApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const openapi_1 = require("@sap-cloud-sdk/openapi");
/**
 * Representation of the 'DataExportApi'.
 * This API is part of the 'SPA_Workflow_Runtime_v2' service.
 */
exports.DataExportApi = {
    /**
     * Requests the export of workflow definitions metadata, form definitions metadata, workflow instances, and task instances. The file and data structures used are subject to change.
     *
     * Roles permitted to execute this operation:
     *  - Global roles: ProcessAutomationAdmin
     *
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getV1Export: () => new openapi_1.OpenApiRequestBuilder('get', '/v1/export')
};
//# sourceMappingURL=data-export-api.js.map