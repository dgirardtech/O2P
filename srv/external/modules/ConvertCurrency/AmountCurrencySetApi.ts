/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { AmountCurrencySet } from './AmountCurrencySet';
import { AmountCurrencySetRequestBuilder } from './AmountCurrencySetRequestBuilder';
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
export class AmountCurrencySetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<AmountCurrencySet<DeSerializersT>, DeSerializersT>
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
  ): AmountCurrencySetApi<DeSerializersT> {
    return new AmountCurrencySetApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = AmountCurrencySet;

  requestBuilder(): AmountCurrencySetRequestBuilder<DeSerializersT> {
    return new AmountCurrencySetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    AmountCurrencySet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<AmountCurrencySet<DeSerializersT>, DeSerializersT>(
      this
    );
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<AmountCurrencySet<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<
    typeof AmountCurrencySet,
    DeSerializersT
  >;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        AmountCurrencySet,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    DATE: OrderableEdmTypeField<
      AmountCurrencySet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    FOREIGN_CURRENCY: OrderableEdmTypeField<
      AmountCurrencySet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    LOCAL_CURRENCY: OrderableEdmTypeField<
      AmountCurrencySet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    FOREIGN_AMOUNT: OrderableEdmTypeField<
      AmountCurrencySet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      false,
      true
    >;
    LOCAL_AMOUNT: OrderableEdmTypeField<
      AmountCurrencySet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    TYPE_OF_RATE: OrderableEdmTypeField<
      AmountCurrencySet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    DATE_EXCHANGE_RATE: OrderableEdmTypeField<
      AmountCurrencySet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    ALL_FIELDS: AllFields<AmountCurrencySet<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link date} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DATE: fieldBuilder.buildEdmTypeField('Date', 'Edm.DateTime', false),
        /**
         * Static representation of the {@link foreignCurrency} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        FOREIGN_CURRENCY: fieldBuilder.buildEdmTypeField(
          'ForeignCurrency',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link localCurrency} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LOCAL_CURRENCY: fieldBuilder.buildEdmTypeField(
          'LocalCurrency',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link foreignAmount} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        FOREIGN_AMOUNT: fieldBuilder.buildEdmTypeField(
          'ForeignAmount',
          'Edm.Decimal',
          false
        ),
        /**
         * Static representation of the {@link localAmount} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LOCAL_AMOUNT: fieldBuilder.buildEdmTypeField(
          'LocalAmount',
          'Edm.Decimal',
          true
        ),
        /**
         * Static representation of the {@link typeOfRate} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        TYPE_OF_RATE: fieldBuilder.buildEdmTypeField(
          'TypeOfRate',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link dateExchangeRate} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DATE_EXCHANGE_RATE: fieldBuilder.buildEdmTypeField(
          'DateExchangeRate',
          'Edm.DateTime',
          true
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', AmountCurrencySet)
      };
    }

    return this._schema;
  }
}
