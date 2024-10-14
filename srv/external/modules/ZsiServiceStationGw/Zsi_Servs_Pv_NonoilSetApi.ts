/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { Zsi_Servs_Pv_NonoilSet } from './Zsi_Servs_Pv_NonoilSet';
import { Zsi_Servs_Pv_NonoilSetRequestBuilder } from './Zsi_Servs_Pv_NonoilSetRequestBuilder';
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
export class Zsi_Servs_Pv_NonoilSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<Zsi_Servs_Pv_NonoilSet<DeSerializersT>, DeSerializersT>
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
  ): Zsi_Servs_Pv_NonoilSetApi<DeSerializersT> {
    return new Zsi_Servs_Pv_NonoilSetApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = Zsi_Servs_Pv_NonoilSet;

  requestBuilder(): Zsi_Servs_Pv_NonoilSetRequestBuilder<DeSerializersT> {
    return new Zsi_Servs_Pv_NonoilSetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    Zsi_Servs_Pv_NonoilSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<
      Zsi_Servs_Pv_NonoilSet<DeSerializersT>,
      DeSerializersT
    >(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<
    Zsi_Servs_Pv_NonoilSet<DeSerializersT>,
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
    typeof Zsi_Servs_Pv_NonoilSet,
    DeSerializersT
  >;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        Zsi_Servs_Pv_NonoilSet,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    SERV_SID: OrderableEdmTypeField<
      Zsi_Servs_Pv_NonoilSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SALES_ORG: OrderableEdmTypeField<
      Zsi_Servs_Pv_NonoilSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DISTR_CH: OrderableEdmTypeField<
      Zsi_Servs_Pv_NonoilSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIVISION: OrderableEdmTypeField<
      Zsi_Servs_Pv_NonoilSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    RENTAL_UNIT: OrderableEdmTypeField<
      Zsi_Servs_Pv_NonoilSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    LEASE_OUT_NUMBER: OrderableEdmTypeField<
      Zsi_Servs_Pv_NonoilSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    RENTAL_START: OrderableEdmTypeField<
      Zsi_Servs_Pv_NonoilSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    RENTAL_END: OrderableEdmTypeField<
      Zsi_Servs_Pv_NonoilSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    RENT_AMOUNT: OrderableEdmTypeField<
      Zsi_Servs_Pv_NonoilSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ALL_FIELDS: AllFields<Zsi_Servs_Pv_NonoilSet<DeSerializers>>;
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
         * Static representation of the {@link rentalUnit} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        RENTAL_UNIT: fieldBuilder.buildEdmTypeField(
          'RENTAL_UNIT',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link leaseOutNumber} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LEASE_OUT_NUMBER: fieldBuilder.buildEdmTypeField(
          'LEASE_OUT_NUMBER',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link rentalStart} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        RENTAL_START: fieldBuilder.buildEdmTypeField(
          'RENTAL_START',
          'Edm.DateTime',
          false
        ),
        /**
         * Static representation of the {@link rentalEnd} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        RENTAL_END: fieldBuilder.buildEdmTypeField(
          'RENTAL_END',
          'Edm.DateTime',
          false
        ),
        /**
         * Static representation of the {@link rentAmount} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        RENT_AMOUNT: fieldBuilder.buildEdmTypeField(
          'RENT_AMOUNT',
          'Edm.String',
          false
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', Zsi_Servs_Pv_NonoilSet)
      };
    }

    return this._schema;
  }
}
