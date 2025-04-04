/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
/**
 * Representation of the 'WorkflowInstancesUpdatePayload' schema.
 */
export type WorkflowInstancesUpdatePayload =
  | {
      /**
       * If set to true, the workflow instance and related data (for example, execution logs) are deleted.
       */
      deleted?: boolean;
      /**
       * The ID of the workflow instance, which should be modified. The ID of a workflow instance is 36 characters long.
       * Max Length: 36.
       * Min Length: 36.
       */
      id: string;
    }
  | Record<string, any>;
