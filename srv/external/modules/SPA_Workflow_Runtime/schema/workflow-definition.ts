/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import type { WorkflowDefinitionJob } from './workflow-definition-job';
/**
 * Representation of the 'WorkflowDefinition' schema.
 */
export type WorkflowDefinition = {
  /**
   * The scope to which the definition belongs. Either "own", "shared" or a named scope.
   */
  applicationScope: string;
  /**
   * The time when the workflow definition was deployed.
   * Format: "date-time".
   */
  createdAt: string;
  /**
   * The user who deployed the workflow definition. The user ID is at most 255 characters long.
   * This property may not be included for workflow definitions that were deployed before May 21, 2018.
   * Max Length: 255.
   */
  createdBy?: string;
  /**
   * The workflow definition ID. The ID is at most 64 characters long.
   * Max Length: 64.
   */
  id: string;
  /**
   * The jobs related to the workflow definition.
   */
  jobs: WorkflowDefinitionJob[];
  /**
   * The workflow definition name. The name is at most 255 characters long.
   * Max Length: 255.
   */
  name: string;
  /**
   * The workflow definition version.
   */
  version: string;
} & Record<string, any>;
