"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const openapi_1 = require("@sap-cloud-sdk/openapi");
/**
 * Representation of the 'MessagesApi'.
 * This API is part of the 'SPA_Workflow_Runtime' service.
 */
exports.MessagesApi = {
    /**
     * Sends a message to a set of workflow instances for consumption in intermediate message events. The message is identified by the name specified in the workflow model (request body parameter 'definitionId')
     * and parameters identifying the workflow instances that should consume the message.
     *
     * From the process builder of SAP Build Process Automation, you currently cannot model intermediate message events. This API exists for workflows that originate from other editors.
     *
     * The message is consumed by the workflow instances that match the following criteria:
     *
     * * The instance can be a specific match when using its workflow instance ID (request body parameter 'workflowInstanceId').
     * Or the instance is a generic match when using the ID of the workflow model together with the business key (request body parameters 'workflowDefinitionId' respectively 'businessKey').
     * You can either use the specific or generic match but not both in the same call.
     *
     * * The workflow instance is not in the SUSPENDED state.
     *
     * * The workflow instance currently waits at the intermediate message event referring to the specified message.
     *
     * The business key of a workflow instance matches if the business key specified in the request body is the same.
     *
     * Roles permitted to execute this operation:
     *  - Global roles: WorkflowMessageSender
     * @param body - Specify the request body according to the given schema.
     * The length of the request body is limited to ensure optimal operation of the service.
     * @returns The request builder, use the `execute()` method to trigger the request.
     */
    createV1Messages: (body) => new openapi_1.OpenApiRequestBuilder('post', '/v1/messages', {
        body
    })
};
//# sourceMappingURL=messages-api.js.map