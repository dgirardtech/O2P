/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'FormMetadata' schema.
 */
export type FormMetadata = {
  /**
   * The time when the form definition version was deployed.
   * Format: "date-time".
   */
  createdAt?: string;
  /**
   * The ID of the user who deployed the form definition version.
   */
  createdBy?: string;
  /**
   * The definition ID of the form definition. The ID is at most 255 characters long.
   *
   * Max Length: 255.
   */
  id?: string;
  /**
   * The name of the form definition, in the original language.
   */
  name?: string;
  /**
   * The revision of the form definition version.
   */
  revision?: string;
  /**
   * The type of the form definition version.
   */
  type?: 'start' | 'task';
  /**
   * The technical version of the form definition version.
   */
  version?: number;
  /**
   * A list of workflow definitions in case the form definition version is of type 'start'
   */
  workflowDefinitions?: {
    /**
     * ID of the workflow definition
     */
    Id?: string;
  } & Record<string, any>[];
} & Record<string, any>;
