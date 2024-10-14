/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { ProgramCodeSet } from './ProgramCodeSet';
import { ProgramCodeSetRequestBuilder } from './ProgramCodeSetRequestBuilder';
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
export class ProgramCodeSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<ProgramCodeSet<DeSerializersT>, DeSerializersT>
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
  ): ProgramCodeSetApi<DeSerializersT> {
    return new ProgramCodeSetApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = ProgramCodeSet;

  requestBuilder(): ProgramCodeSetRequestBuilder<DeSerializersT> {
    return new ProgramCodeSetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    ProgramCodeSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<ProgramCodeSet<DeSerializersT>, DeSerializersT>(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<ProgramCodeSet<DeSerializersT>, DeSerializersT, NullableT> {
    return new CustomField(
      fieldName,
      this.entityConstructor,
      this.deSerializers,
      isNullable
    ) as any;
  }

  private _fieldBuilder?: FieldBuilder<typeof ProgramCodeSet, DeSerializersT>;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(ProgramCodeSet, this.deSerializers);
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    PROGRAM: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    APPROVALYEAR: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DESCRIPTION: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    RESPONSIBLE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    FY_VARIANT: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CURRENCY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CURRENCY_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PROGRAM_TYPE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    BUDG_CATEG_INDIC: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    YEAR_DIST_INDIC: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    DEF_LANGU: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    DEF_LANGU_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    LANGUAGE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    LANGUAGE_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ASSG_BLOCKED_INDIC: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    PARENT: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PREDECESSOR: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    POSITION: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    LEVEL: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DESCRIPTION_POS: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    VALID_FROM_FY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    VALID_TO_FY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    SCALE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PRIORITY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    REASON: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    CREATED_ON: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    CREATED_BY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    CO_AREA: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    PROFIT_CENTER: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    COST_CENTER: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    COMPANY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    COMPANY_CODE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BUSINESS_AREA: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BAL_SHEET_ITEM: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PLANT: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    PLANT_SECTION: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    FUNCT_LOCATION: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    COUNTRY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    COUNTRY_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BUDG_DIST_INDIC: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    USER_00: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_01: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_02: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_03: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_04_QUANTITY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    USER_04_UNIT: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_04_UNIT_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_05_QUANTITY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    USER_05_UNIT: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_05_UNIT_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_06_VALUE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    USER_06_CURR: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_06_CURR_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_07_VALUE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    USER_07_CURR: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_07_CURR_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_08_DATE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    USER_09_DATE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      true,
      true
    >;
    USER_10_INDICATOR: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    USER_11_INDICATOR: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Boolean',
      true,
      true
    >;
    USER_12_ACC_PER: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    USER_13_ACC_PER: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    OBJECT_CURRENCY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    OBJECT_CURRENCY_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ROLE_IN_HIERARCHY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    BUDGET_CATEGORY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    APPROVAL_PERIOD: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    VALUE_TYPE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    FISCAL_YEAR: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    VERSION: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    ACTIVITY: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    VALUE: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      false,
      true
    >;
    VALUE_1: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    VALUE_2: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    VALUE_3: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    VALUE_4: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    VALUE_5: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    VALUE_6: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.Decimal',
      true,
      true
    >;
    CURRENCY_TRANS: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    CURRENCY_TRANS_ISO: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      true,
      true
    >;
    IS_LOWER: OrderableEdmTypeField<
      ProgramCodeSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ALL_FIELDS: AllFields<ProgramCodeSet<DeSerializers>>;
  };

  get schema() {
    if (!this._schema) {
      const fieldBuilder = this.fieldBuilder;
      this._schema = {
        /**
         * Static representation of the {@link program} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PROGRAM: fieldBuilder.buildEdmTypeField('Program', 'Edm.String', false),
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
         * Static representation of the {@link description} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DESCRIPTION: fieldBuilder.buildEdmTypeField(
          'Description',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link responsible} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        RESPONSIBLE: fieldBuilder.buildEdmTypeField(
          'Responsible',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link fyVariant} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        FY_VARIANT: fieldBuilder.buildEdmTypeField(
          'FyVariant',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link currency} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CURRENCY: fieldBuilder.buildEdmTypeField(
          'Currency',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link currencyIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CURRENCY_ISO: fieldBuilder.buildEdmTypeField(
          'CurrencyIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link programType} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PROGRAM_TYPE: fieldBuilder.buildEdmTypeField(
          'ProgramType',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link budgCategIndic} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        BUDG_CATEG_INDIC: fieldBuilder.buildEdmTypeField(
          'BudgCategIndic',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link yearDistIndic} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        YEAR_DIST_INDIC: fieldBuilder.buildEdmTypeField(
          'YearDistIndic',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link defLangu} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DEF_LANGU: fieldBuilder.buildEdmTypeField(
          'DefLangu',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link defLanguIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DEF_LANGU_ISO: fieldBuilder.buildEdmTypeField(
          'DefLanguIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link language} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LANGUAGE: fieldBuilder.buildEdmTypeField(
          'Language',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link languageIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LANGUAGE_ISO: fieldBuilder.buildEdmTypeField(
          'LanguageIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link assgBlockedIndic} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ASSG_BLOCKED_INDIC: fieldBuilder.buildEdmTypeField(
          'AssgBlockedIndic',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link parent} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PARENT: fieldBuilder.buildEdmTypeField('Parent', 'Edm.String', true),
        /**
         * Static representation of the {@link predecessor} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PREDECESSOR: fieldBuilder.buildEdmTypeField(
          'Predecessor',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link position} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        POSITION: fieldBuilder.buildEdmTypeField(
          'Position',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link level} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LEVEL: fieldBuilder.buildEdmTypeField('Level', 'Edm.String', false),
        /**
         * Static representation of the {@link descriptionPos} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DESCRIPTION_POS: fieldBuilder.buildEdmTypeField(
          'DescriptionPos',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link validFromFy} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALID_FROM_FY: fieldBuilder.buildEdmTypeField(
          'ValidFromFy',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link validToFy} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALID_TO_FY: fieldBuilder.buildEdmTypeField(
          'ValidToFy',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link scale} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SCALE: fieldBuilder.buildEdmTypeField('Scale', 'Edm.String', true),
        /**
         * Static representation of the {@link priority} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PRIORITY: fieldBuilder.buildEdmTypeField(
          'Priority',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link reason} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        REASON: fieldBuilder.buildEdmTypeField('Reason', 'Edm.String', true),
        /**
         * Static representation of the {@link createdOn} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CREATED_ON: fieldBuilder.buildEdmTypeField(
          'CreatedOn',
          'Edm.DateTime',
          true
        ),
        /**
         * Static representation of the {@link createdBy} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CREATED_BY: fieldBuilder.buildEdmTypeField(
          'CreatedBy',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link coArea} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CO_AREA: fieldBuilder.buildEdmTypeField('CoArea', 'Edm.String', false),
        /**
         * Static representation of the {@link profitCenter} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PROFIT_CENTER: fieldBuilder.buildEdmTypeField(
          'ProfitCenter',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link costCenter} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        COST_CENTER: fieldBuilder.buildEdmTypeField(
          'CostCenter',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link company} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        COMPANY: fieldBuilder.buildEdmTypeField('Company', 'Edm.String', true),
        /**
         * Static representation of the {@link companyCode} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        COMPANY_CODE: fieldBuilder.buildEdmTypeField(
          'CompanyCode',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link businessArea} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        BUSINESS_AREA: fieldBuilder.buildEdmTypeField(
          'BusinessArea',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link balSheetItem} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        BAL_SHEET_ITEM: fieldBuilder.buildEdmTypeField(
          'BalSheetItem',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link plant} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PLANT: fieldBuilder.buildEdmTypeField('Plant', 'Edm.String', true),
        /**
         * Static representation of the {@link plantSection} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        PLANT_SECTION: fieldBuilder.buildEdmTypeField(
          'PlantSection',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link functLocation} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        FUNCT_LOCATION: fieldBuilder.buildEdmTypeField(
          'FunctLocation',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link country} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        COUNTRY: fieldBuilder.buildEdmTypeField('Country', 'Edm.String', true),
        /**
         * Static representation of the {@link countryIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        COUNTRY_ISO: fieldBuilder.buildEdmTypeField(
          'CountryIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link budgDistIndic} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        BUDG_DIST_INDIC: fieldBuilder.buildEdmTypeField(
          'BudgDistIndic',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link user00} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_00: fieldBuilder.buildEdmTypeField('User00', 'Edm.String', true),
        /**
         * Static representation of the {@link user01} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_01: fieldBuilder.buildEdmTypeField('User01', 'Edm.String', true),
        /**
         * Static representation of the {@link user02} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_02: fieldBuilder.buildEdmTypeField('User02', 'Edm.String', true),
        /**
         * Static representation of the {@link user03} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_03: fieldBuilder.buildEdmTypeField('User03', 'Edm.String', true),
        /**
         * Static representation of the {@link user04Quantity} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_04_QUANTITY: fieldBuilder.buildEdmTypeField(
          'User04Quantity',
          'Edm.Decimal',
          true
        ),
        /**
         * Static representation of the {@link user04Unit} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_04_UNIT: fieldBuilder.buildEdmTypeField(
          'User04Unit',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link user04UnitIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_04_UNIT_ISO: fieldBuilder.buildEdmTypeField(
          'User04UnitIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link user05Quantity} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_05_QUANTITY: fieldBuilder.buildEdmTypeField(
          'User05Quantity',
          'Edm.Decimal',
          true
        ),
        /**
         * Static representation of the {@link user05Unit} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_05_UNIT: fieldBuilder.buildEdmTypeField(
          'User05Unit',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link user05UnitIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_05_UNIT_ISO: fieldBuilder.buildEdmTypeField(
          'User05UnitIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link user06Value} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_06_VALUE: fieldBuilder.buildEdmTypeField(
          'User06Value',
          'Edm.Decimal',
          true
        ),
        /**
         * Static representation of the {@link user06Curr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_06_CURR: fieldBuilder.buildEdmTypeField(
          'User06Curr',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link user06CurrIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_06_CURR_ISO: fieldBuilder.buildEdmTypeField(
          'User06CurrIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link user07Value} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_07_VALUE: fieldBuilder.buildEdmTypeField(
          'User07Value',
          'Edm.Decimal',
          true
        ),
        /**
         * Static representation of the {@link user07Curr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_07_CURR: fieldBuilder.buildEdmTypeField(
          'User07Curr',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link user07CurrIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_07_CURR_ISO: fieldBuilder.buildEdmTypeField(
          'User07CurrIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link user08Date} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_08_DATE: fieldBuilder.buildEdmTypeField(
          'User08Date',
          'Edm.DateTime',
          true
        ),
        /**
         * Static representation of the {@link user09Date} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_09_DATE: fieldBuilder.buildEdmTypeField(
          'User09Date',
          'Edm.DateTime',
          true
        ),
        /**
         * Static representation of the {@link user10Indicator} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_10_INDICATOR: fieldBuilder.buildEdmTypeField(
          'User10Indicator',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link user11Indicator} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_11_INDICATOR: fieldBuilder.buildEdmTypeField(
          'User11Indicator',
          'Edm.Boolean',
          true
        ),
        /**
         * Static representation of the {@link user12AccPer} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_12_ACC_PER: fieldBuilder.buildEdmTypeField(
          'User12AccPer',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link user13AccPer} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        USER_13_ACC_PER: fieldBuilder.buildEdmTypeField(
          'User13AccPer',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link objectCurrency} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        OBJECT_CURRENCY: fieldBuilder.buildEdmTypeField(
          'ObjectCurrency',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link objectCurrencyIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        OBJECT_CURRENCY_ISO: fieldBuilder.buildEdmTypeField(
          'ObjectCurrencyIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link roleInHierarchy} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ROLE_IN_HIERARCHY: fieldBuilder.buildEdmTypeField(
          'RoleInHierarchy',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link budgetCategory} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        BUDGET_CATEGORY: fieldBuilder.buildEdmTypeField(
          'BudgetCategory',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link approvalPeriod} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        APPROVAL_PERIOD: fieldBuilder.buildEdmTypeField(
          'ApprovalPeriod',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link valueType} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALUE_TYPE: fieldBuilder.buildEdmTypeField(
          'ValueType',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link fiscalYear} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        FISCAL_YEAR: fieldBuilder.buildEdmTypeField(
          'FiscalYear',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link version} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VERSION: fieldBuilder.buildEdmTypeField('Version', 'Edm.String', true),
        /**
         * Static representation of the {@link activity} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        ACTIVITY: fieldBuilder.buildEdmTypeField(
          'Activity',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link value} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALUE: fieldBuilder.buildEdmTypeField('Value', 'Edm.Decimal', false),
        /**
         * Static representation of the {@link value1} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALUE_1: fieldBuilder.buildEdmTypeField('Value1', 'Edm.Decimal', true),
        /**
         * Static representation of the {@link value2} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALUE_2: fieldBuilder.buildEdmTypeField('Value2', 'Edm.Decimal', true),
        /**
         * Static representation of the {@link value3} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALUE_3: fieldBuilder.buildEdmTypeField('Value3', 'Edm.Decimal', true),
        /**
         * Static representation of the {@link value4} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALUE_4: fieldBuilder.buildEdmTypeField('Value4', 'Edm.Decimal', true),
        /**
         * Static representation of the {@link value5} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALUE_5: fieldBuilder.buildEdmTypeField('Value5', 'Edm.Decimal', true),
        /**
         * Static representation of the {@link value6} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VALUE_6: fieldBuilder.buildEdmTypeField('Value6', 'Edm.Decimal', true),
        /**
         * Static representation of the {@link currencyTrans} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CURRENCY_TRANS: fieldBuilder.buildEdmTypeField(
          'CurrencyTrans',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link currencyTransIso} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CURRENCY_TRANS_ISO: fieldBuilder.buildEdmTypeField(
          'CurrencyTransIso',
          'Edm.String',
          true
        ),
        /**
         * Static representation of the {@link isLower} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        IS_LOWER: fieldBuilder.buildEdmTypeField(
          'IsLower',
          'Edm.String',
          false
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', ProgramCodeSet)
      };
    }

    return this._schema;
  }
}
