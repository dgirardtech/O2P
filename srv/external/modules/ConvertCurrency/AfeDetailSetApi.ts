/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { AfeDetailSet } from './AfeDetailSet';
import { AfeDetailSetRequestBuilder } from './AfeDetailSetRequestBuilder';
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
export class AfeDetailSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<AfeDetailSet<DeSerializersT>, DeSerializersT>
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
  ): AfeDetailSetApi<DeSerializersT> {
    return new AfeDetailSetApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = AfeDetailSet;

  requestBuilder(): AfeDetailSetRequestBuilder<DeSerializersT> {
    return new AfeDetailSetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    AfeDetailSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<AfeDetailSet<DeSerializersT>, DeSerializersT>(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<AfeDetailSet<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<typeof AfeDetailSet, DeSerializersT>;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(AfeDetailSet, this.deSerializers);
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    IV_APPROVALYEAR: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    IV_AUFNR: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    IV_BUKRS: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    IV_KOKRS: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    IV_PROGRAM_CODE: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    APPROVALYEAR: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    AUFNR: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    KTEXT: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    IDAT_1: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    PROGRAM_CODE: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    POST_1: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    IZWEK: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    AFE_VALUE: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      false,
      true
    >;
    AFE_VALUE_SPENT_UP_TO: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      false,
      true
    >;
    AFE_VALUE_SPENT_FROM: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      false,
      true
    >;
    LCL_AFE_VALUE: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      false,
      true
    >;
    LCL_AFE_VALUE_SPENT_T: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      false,
      true
    >;
    LCL_AFE_VALUE_SPENT_F: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      false,
      true
    >;
    WAERS: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    LOCAL_WAERS: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    STATUS: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    USR_00: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    BUKRS: OrderableEdmTypeField<
      AfeDetailSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ALL_FIELDS: AllFields<AfeDetailSet<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link ivApprovalyear} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IV_APPROVALYEAR: fieldBuilder.buildEdmTypeField(
          'IvApprovalyear',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link ivAufnr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IV_AUFNR: fieldBuilder.buildEdmTypeField(
          'IvAufnr',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link ivBukrs} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IV_BUKRS: fieldBuilder.buildEdmTypeField(
          'IvBukrs',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link ivKokrs} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IV_KOKRS: fieldBuilder.buildEdmTypeField(
          'IvKokrs',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link ivProgramCode} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IV_PROGRAM_CODE: fieldBuilder.buildEdmTypeField(
          'IvProgramCode',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link approvalyear} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        APPROVALYEAR: fieldBuilder.buildEdmTypeField(
          'Approvalyear',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link aufnr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        AUFNR: fieldBuilder.buildEdmTypeField('Aufnr', 'Edm.String', false),
        /**
         * Static representation of the {@link ktext} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        KTEXT: fieldBuilder.buildEdmTypeField('Ktext', 'Edm.String', false),
        /**
         * Static representation of the {@link idat1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IDAT_1: fieldBuilder.buildEdmTypeField('Idat1', 'Edm.DateTime', false),
        /**
         * Static representation of the {@link programCode} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PROGRAM_CODE: fieldBuilder.buildEdmTypeField(
          'ProgramCode',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link post1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        POST_1: fieldBuilder.buildEdmTypeField('Post1', 'Edm.String', false),
        /**
         * Static representation of the {@link izwek} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IZWEK: fieldBuilder.buildEdmTypeField('Izwek', 'Edm.String', false),
        /**
         * Static representation of the {@link afeValue} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        AFE_VALUE: fieldBuilder.buildEdmTypeField(
          'AfeValue',
          'Edm.Decimal',
          false
        ),
        /**
         * Static representation of the {@link afeValueSpentUpTo} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        AFE_VALUE_SPENT_UP_TO: fieldBuilder.buildEdmTypeField(
          'AfeValueSpentUpTo',
          'Edm.Decimal',
          false
        ),
        /**
         * Static representation of the {@link afeValueSpentFrom} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        AFE_VALUE_SPENT_FROM: fieldBuilder.buildEdmTypeField(
          'AfeValueSpentFrom',
          'Edm.Decimal',
          false
        ),
        /**
         * Static representation of the {@link lclAfeValue} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LCL_AFE_VALUE: fieldBuilder.buildEdmTypeField(
          'LclAfeValue',
          'Edm.Decimal',
          false
        ),
        /**
         * Static representation of the {@link lclAfeValueSpentT} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LCL_AFE_VALUE_SPENT_T: fieldBuilder.buildEdmTypeField(
          'LclAfeValueSpentT',
          'Edm.Decimal',
          false
        ),
        /**
         * Static representation of the {@link lclAfeValueSpentF} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LCL_AFE_VALUE_SPENT_F: fieldBuilder.buildEdmTypeField(
          'LclAfeValueSpentF',
          'Edm.Decimal',
          false
        ),
        /**
         * Static representation of the {@link waers} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        WAERS: fieldBuilder.buildEdmTypeField('Waers', 'Edm.String', false),
        /**
         * Static representation of the {@link localWaers} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LOCAL_WAERS: fieldBuilder.buildEdmTypeField(
          'LocalWaers',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link status} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        STATUS: fieldBuilder.buildEdmTypeField('Status', 'Edm.String', false),
        /**
         * Static representation of the {@link usr00} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USR_00: fieldBuilder.buildEdmTypeField('Usr00', 'Edm.String', false),
        /**
         * Static representation of the {@link bukrs} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        BUKRS: fieldBuilder.buildEdmTypeField('Bukrs', 'Edm.String', false),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', AfeDetailSet)
      };
    }

    return this._schema;
  }
}
