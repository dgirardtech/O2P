/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
/**
 * Representation of the 'CustomAttributeList' schema.
 * Max Items: 15.
 */
export type CustomAttributeList =
  | {
      /**
       * The ID of the attribute.
       * Max Length: 255.
       */
      id?: string;
      /**
       * The label which represents how the attribute should be presented to end users.
       * Max Length: 255.
       */
      label?: string;
      /**
       * The type of the attribute.
       */
      type?: 'string';
      /**
       * The value of the attribute.
       * Max Length: 4000.
       */
      value?: string;
    }
  | Record<string, any>[];
