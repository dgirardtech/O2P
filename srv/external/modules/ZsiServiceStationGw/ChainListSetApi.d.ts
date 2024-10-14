/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { ChainListSet } from './ChainListSet';
import { ChainListSetRequestBuilder } from './ChainListSetRequestBuilder';
import { Zsi_Service_Station_GwSetApi } from './Zsi_Service_Station_GwSetApi';
import { Zsi_Servs_Address_GwSetApi } from './Zsi_Servs_Address_GwSetApi';
import {
  CustomField,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField,
  Link
} from '@sap-cloud-sdk/odata-v2';
export declare class ChainListSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<ChainListSet<DeSerializersT>, DeSerializersT>
{
  deSerializers: DeSerializersT;
  private constructor();
  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(deSerializers?: DeSerializersT): ChainListSetApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(
    linkedApis: [
      Zsi_Service_Station_GwSetApi<DeSerializersT>,
      Zsi_Servs_Address_GwSetApi<DeSerializersT>
    ]
  ): this;
  entityConstructor: typeof ChainListSet;
  requestBuilder(): ChainListSetRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    ChainListSet<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<ChainListSet<DeSerializersT>, DeSerializersT, NullableT>;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<typeof ChainListSet, DeSerializersT>;
  private _schema?;
  get schema(): {
    CHAIN_CODE: OrderableEdmTypeField<
      ChainListSet<
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
    CHAIN_DESC: OrderableEdmTypeField<
      ChainListSet<
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
      true,
      true
    >;
    SPRAS: OrderableEdmTypeField<
      ChainListSet<
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
      true,
      true
    >;
    /**
     * Static representation of the one-to-many navigation property {@link chainToServiceStation} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    CHAIN_TO_SERVICE_STATION: Link<
      ChainListSet<DeSerializersT>,
      DeSerializersT,
      Zsi_Service_Station_GwSetApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-many navigation property {@link chainToAddress} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    CHAIN_TO_ADDRESS: Link<
      ChainListSet<DeSerializersT>,
      DeSerializersT,
      Zsi_Servs_Address_GwSetApi<DeSerializersT>
    >;
    ALL_FIELDS: AllFields<
      ChainListSet<
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
