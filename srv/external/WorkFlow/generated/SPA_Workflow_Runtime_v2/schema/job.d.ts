/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
/**
 * Representation of the 'Job' schema.
 */
export type Job =
  | {
      /**
       * The details of the job.
       */
      details?: Record<string, any>;
      error?:
        | {
            /**
             * The error category.
             */
            code?: string;
            /**
             * The log ID referring to the error.
             */
            logId?: string;
            /**
             * The error message.
             */
            message?: string;
          }
        | Record<string, any>;
      /**
       * The status of the job.
       */
      status?: 'RUNNING' | 'ERRONEOUS';
    }
  | Record<string, any>;
