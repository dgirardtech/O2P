/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { DomainListSet } from './DomainListSet';
import { DomainListSetRequestBuilder } from './DomainListSetRequestBuilder';
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
  OrderableEdmTypeField
} from '@sap-cloud-sdk/odata-v2';
export class DomainListSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<DomainListSet<DeSerializersT>, DeSerializersT>
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
  ): DomainListSetApi<DeSerializersT> {
    return new DomainListSetApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = DomainListSet;

  requestBuilder(): DomainListSetRequestBuilder<DeSerializersT> {
    return new DomainListSetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    DomainListSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<DomainListSet<DeSerializersT>, DeSerializersT>(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<DomainListSet<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<typeof DomainListSet, DeSerializersT>;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(DomainListSet, this.deSerializers);
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    DOMAIN_NAME: OrderableEdmTypeField<
      DomainListSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SPRAS: OrderableEdmTypeField<
      DomainListSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DOMAIN_CODE: OrderableEdmTypeField<
      DomainListSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    DOMAIN_VALUE: OrderableEdmTypeField<
      DomainListSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ALL_FIELDS: AllFields<DomainListSet<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link domainName} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DOMAIN_NAME: fieldBuilder.buildEdmTypeField(
          'DomainName',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link spras} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SPRAS: fieldBuilder.buildEdmTypeField('Spras', 'Edm.String', false),
        /**
         * Static representation of the {@link domainCode} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DOMAIN_CODE: fieldBuilder.buildEdmTypeField(
          'DomainCode',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link domainValue} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DOMAIN_VALUE: fieldBuilder.buildEdmTypeField(
          'DomainValue',
          'Edm.String',
          true
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', DomainListSet)
      };
    }

    return this._schema;
  }
}
