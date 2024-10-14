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
  defaultDeSerializers,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  entityBuilder,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField,
  Link
} from '@sap-cloud-sdk/odata-v2';
export class ChainListSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<ChainListSet<DeSerializersT>, DeSerializersT>
{
  public deSerializers: DeSerializersT;

  private constructor(
    deSerializers: DeSerializersT = defaultDeSerializers as any
  ) {
    this.deSerializers = deSerializers;
  }

  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  public static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(
    deSerializers: DeSerializersT = defaultDeSerializers as any
  ): ChainListSetApi<DeSerializersT> {
    return new ChainListSetApi(deSerializers);
  }

  private navigationPropertyFields!: {
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
  };

  _addNavigationProperties(
    linkedApis: [
      Zsi_Service_Station_GwSetApi<DeSerializersT>,
      Zsi_Servs_Address_GwSetApi<DeSerializersT>
    ]
  ): this {
    this.navigationPropertyFields = {
      CHAIN_TO_SERVICE_STATION: new Link(
        'ChainToServiceStation',
        this,
        linkedApis[0]
      ),
      CHAIN_TO_ADDRESS: new Link('ChainToAddress', this, linkedApis[1])
    };
    return this;
  }

  entityConstructor = ChainListSet;

  requestBuilder(): ChainListSetRequestBuilder<DeSerializersT> {
    return new ChainListSetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    ChainListSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<ChainListSet<DeSerializersT>, DeSerializersT>(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<ChainListSet<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<typeof ChainListSet, DeSerializersT>;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(ChainListSet, this.deSerializers);
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    CHAIN_CODE: OrderableEdmTypeField<
      ChainListSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CHAIN_DESC: OrderableEdmTypeField<
      ChainListSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    SPRAS: OrderableEdmTypeField<
      ChainListSet<DeSerializers>,
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
    ALL_FIELDS: AllFields<ChainListSet<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link chainCode} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CHAIN_CODE: fieldBuilder.buildEdmTypeField(
          'ChainCode',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link chainDesc} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CHAIN_DESC: fieldBuilder.buildEdmTypeField(
          'ChainDesc',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link spras} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SPRAS: fieldBuilder.buildEdmTypeField('Spras', 'Edm.String', true),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', ChainListSet)
      };
    }

    return this._schema;
  }
}
