"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const openapi_1 = require("@sap-cloud-sdk/openapi");
/**
 * Representation of the 'JobsApi'.
 * This API is part of the 'SPA_Workflow_Runtime_v2' service.
 */
exports.JobsApi = {
    /**
     * Tracks the status of API requests, which the server executed asynchronously.
     * Roles permitted to execute this operation:
     *  - Global roles: ProcessAutomationAdmin
     *
     * @param jobId - The ID of the job for which you check the status.
     * Typically, the ID has been retrieved from another API request that was processed asynchronously.
     * The ID is at most 36 characters long.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getV1JobsByJobId: (jobId) => new openapi_1.OpenApiRequestBuilder('get', '/v1/jobs/{jobId}', {
        pathParameters: { jobId }
    })
};
//# sourceMappingURL=jobs-api.js.map