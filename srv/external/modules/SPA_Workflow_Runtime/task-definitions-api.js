"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskDefinitionsApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const openapi_1 = require("@sap-cloud-sdk/openapi");
/**
 * Representation of the 'TaskDefinitionsApi'.
 * This API is part of the 'SPA_Workflow_Runtime' service.
 */
exports.TaskDefinitionsApi = {
    /**
     * Retrieves task definitions by query parameters.
     *
     * A task definition is identified by the ID of the respective activity within a workflow definition (for example, usertask1) and the workflow definition ID.
     * The workflow definition ID is version independent. That means, this API assumes that task definitions are semantically the same if they span several
     * workflow versions and therefore have the same identifier. The latest workflow definition version is expected to contain the leading property values of
     * the task definition.
     *
     * At the moment, filtering is limited to the $skip and $top parameters for paging through the available task definitions.
     *
     * The returned task definitions are sorted in descending order of their creation time.
     *
     * Roles permitted to execute this operation:
     *   - Global roles: ProcessAutomationAdmin
     * @param queryParameters - Object containing the following keys: $skip, $top, $inlinecount, $expand.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    getV1TaskDefinitions: (queryParameters) => new openapi_1.OpenApiRequestBuilder('get', '/v1/task-definitions', {
        queryParameters
    })
};
//# sourceMappingURL=task-definitions-api.js.map