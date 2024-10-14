/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { Zsi_Servs_Contract_Gw_ItemSet } from './Zsi_Servs_Contract_Gw_ItemSet';
import { Zsi_Servs_Contract_Gw_ItemSetRequestBuilder } from './Zsi_Servs_Contract_Gw_ItemSetRequestBuilder';
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
export class Zsi_Servs_Contract_Gw_ItemSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>, DeSerializersT>
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
  ): Zsi_Servs_Contract_Gw_ItemSetApi<DeSerializersT> {
    return new Zsi_Servs_Contract_Gw_ItemSetApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = Zsi_Servs_Contract_Gw_ItemSet;

  requestBuilder(): Zsi_Servs_Contract_Gw_ItemSetRequestBuilder<DeSerializersT> {
    return new Zsi_Servs_Contract_Gw_ItemSetRequestBuilder<DeSerializersT>(
      this
    );
  }

  entityBuilder(): EntityBuilderType<
    Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
      DeSerializersT
    >(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<
    Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
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
    typeof Zsi_Servs_Contract_Gw_ItemSet,
    DeSerializersT
  >;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        Zsi_Servs_Contract_Gw_ItemSet,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    SERV_SID: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SALES_ORG: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DISTR_CH: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIVISION: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CONTRACT_NUMBER: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CONTRACT_START: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    CONTRACT_END: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    VALIDITY_PERIOD: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    VALIDITY_PERIOD_DESC: OrderableEdmTypeField<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ALL_FIELDS: AllFields<Zsi_Servs_Contract_Gw_ItemSet<DeSerializers>>;
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
         * Static representation of the {@link contractNumber} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CONTRACT_NUMBER: fieldBuilder.buildEdmTypeField(
          'CONTRACT_NUMBER',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link contractStart} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CONTRACT_START: fieldBuilder.buildEdmTypeField(
          'CONTRACT_START',
          'Edm.DateTime',
          false
        ),
        /**
         * Static representation of the {@link contractEnd} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CONTRACT_END: fieldBuilder.buildEdmTypeField(
          'CONTRACT_END',
          'Edm.DateTime',
          false
        ),
        /**
         * Static representation of the {@link validityPeriod} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALIDITY_PERIOD: fieldBuilder.buildEdmTypeField(
          'VALIDITY_PERIOD',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link validityPeriodDesc} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALIDITY_PERIOD_DESC: fieldBuilder.buildEdmTypeField(
          'VALIDITY_PERIOD_DESC',
          'Edm.String',
          false
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', Zsi_Servs_Contract_Gw_ItemSet)
      };
    }

    return this._schema;
  }
}
