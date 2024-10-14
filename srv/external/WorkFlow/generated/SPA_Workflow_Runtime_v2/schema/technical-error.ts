/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */

/**
 * Representation of the 'TechnicalError' schema.
 */
export type TechnicalError =
  | {
      error?:
        | {
            /**
             * The error category.
             */
            code?: string;
            details?:
              | {
                  /**
                   * The detailed error message.
                   */
                  message?: string;
                  /**
                   * The severity of the error.
                   */
                  severity?: string;
                }
              | Record<string, any>[];
            /**
             * The log ID referring to the error.
             */
            logId?: string;
            /**
             * The error message.
             */
            message: string;
          }
        | Record<string, any>;
    }
  | Record<string, any>;
