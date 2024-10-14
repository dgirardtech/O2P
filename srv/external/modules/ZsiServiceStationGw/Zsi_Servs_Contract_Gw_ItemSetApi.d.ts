/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { Zsi_Servs_Contract_Gw_ItemSet } from './Zsi_Servs_Contract_Gw_ItemSet';
import { Zsi_Servs_Contract_Gw_ItemSetRequestBuilder } from './Zsi_Servs_Contract_Gw_ItemSetRequestBuilder';
import {
  CustomField,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField
} from '@sap-cloud-sdk/odata-v2';
export declare class Zsi_Servs_Contract_Gw_ItemSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>, DeSerializersT>
{
  deSerializers: DeSerializersT;
  private constructor();
  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(
    deSerializers?: DeSerializersT
  ): Zsi_Servs_Contract_Gw_ItemSetApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(linkedApis: []): this;
  entityConstructor: typeof Zsi_Servs_Contract_Gw_ItemSet;
  requestBuilder(): Zsi_Servs_Contract_Gw_ItemSetRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<
    typeof Zsi_Servs_Contract_Gw_ItemSet,
    DeSerializersT
  >;
  private _schema?;
  get schema(): {
    SERV_SID: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SALES_ORG: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DISTR_CH: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIVISION: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CONTRACT_NUMBER: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CONTRACT_START: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    CONTRACT_END: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    VALIDITY_PERIOD: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    VALIDITY_PERIOD_DESC: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ALL_FIELDS: AllFields<
      Zsi_Servs_Contract_Gw_ItemSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >
    >;
  };
}
