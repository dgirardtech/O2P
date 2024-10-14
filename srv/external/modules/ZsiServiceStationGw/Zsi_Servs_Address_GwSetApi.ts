/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { Zsi_Servs_Address_GwSet } from './Zsi_Servs_Address_GwSet';
import { Zsi_Servs_Address_GwSetRequestBuilder } from './Zsi_Servs_Address_GwSetRequestBuilder';
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
export class Zsi_Servs_Address_GwSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<Zsi_Servs_Address_GwSet<DeSerializersT>, DeSerializersT>
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
  ): Zsi_Servs_Address_GwSetApi<DeSerializersT> {
    return new Zsi_Servs_Address_GwSetApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = Zsi_Servs_Address_GwSet;

  requestBuilder(): Zsi_Servs_Address_GwSetRequestBuilder<DeSerializersT> {
    return new Zsi_Servs_Address_GwSetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    Zsi_Servs_Address_GwSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<
      Zsi_Servs_Address_GwSet<DeSerializersT>,
      DeSerializersT
    >(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<
    Zsi_Servs_Address_GwSet<DeSerializersT>,
    DeSerializersT,
    NullableT
  > {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<
    typeof Zsi_Servs_Address_GwSet,
    DeSerializersT
  >;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        Zsi_Servs_Address_GwSet,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    SERV_SID: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SALES_ORG: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DISTR_CH: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIVISION: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    LOC_NAME: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    STREET: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    STREET_NUMB: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CITY: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ZIP_CODE: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    REGION: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    PROVINCE: OrderableEdmTypeField<
      Zsi_Servs_Address_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ALL_FIELDS: AllFields<Zsi_Servs_Address_GwSet<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link servSid} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SERV_SID: fieldBuilder.buildEdmTypeField(
          'SERV_SID',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link salesOrg} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SALES_ORG: fieldBuilder.buildEdmTypeField(
          'SALES_ORG',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link distrCh} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DISTR_CH: fieldBuilder.buildEdmTypeField(
          'DISTR_CH',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link division} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DIVISION: fieldBuilder.buildEdmTypeField(
          'DIVISION',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link locName} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LOC_NAME: fieldBuilder.buildEdmTypeField(
          'LOC_NAME',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link street} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        STREET: fieldBuilder.buildEdmTypeField('STREET', 'Edm.String', false),
        /**
         * Static representation of the {@link streetNumb} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        STREET_NUMB: fieldBuilder.buildEdmTypeField(
          'STREET_NUMB',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link city} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CITY: fieldBuilder.buildEdmTypeField('CITY', 'Edm.String', false),
        /**
         * Static representation of the {@link zipCode} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ZIP_CODE: fieldBuilder.buildEdmTypeField(
          'ZIP_CODE',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link region} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        REGION: fieldBuilder.buildEdmTypeField('REGION', 'Edm.String', false),
        /**
         * Static representation of the {@link province} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PROVINCE: fieldBuilder.buildEdmTypeField(
          'PROVINCE',
          'Edm.String',
          false
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', Zsi_Servs_Address_GwSet)
      };
    }

    return this._schema;
  }
}
