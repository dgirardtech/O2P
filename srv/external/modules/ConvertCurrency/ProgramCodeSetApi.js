"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramCodeSetApi = void 0;
/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
const ProgramCodeSet_1 = require("./ProgramCodeSet");
const ProgramCodeSetRequestBuilder_1 = require("./ProgramCodeSetRequestBuilder");
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
class ProgramCodeSetApi {
    constructor(deSerializers = odata_v2_1.defaultDeSerializers) {
        this.entityConstructor = ProgramCodeSet_1.ProgramCodeSet;
        this.deSerializers = deSerializers;
    }
    /**
     * Do not use this method or the constructor directly.
     * Use the service function as described in the documentation to get an API instance.
     */
    static _privateFactory(deSerializers = odata_v2_1.defaultDeSerializers) {
        return new ProgramCodeSetApi(deSerializers);
    }
    _addNavigationProperties(linkedApis) {
        this.navigationPropertyFields = {};
        return this;
    }
    requestBuilder() {
        return new ProgramCodeSetRequestBuilder_1.ProgramCodeSetRequestBuilder(this);
    }
    entityBuilder() {
        return (0, odata_v2_1.entityBuilder)(this);
    }
    customField(fieldName, isNullable = false) {
        return new odata_v2_1.CustomField(fieldName, this.entityConstructor, this.deSerializers, isNullable);
    }
    get fieldBuilder() {
        if (!this._fieldBuilder) {
            this._fieldBuilder = new odata_v2_1.FieldBuilder(ProgramCodeSet_1.ProgramCodeSet, this.deSerializers);
        }
        return this._fieldBuilder;
    }
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
                APPROVALYEAR: fieldBuilder.buildEdmTypeField('Approvalyear', 'Edm.String', false),
                /**
                 * Static representation of the {@link description} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DESCRIPTION: fieldBuilder.buildEdmTypeField('Description', 'Edm.String', true),
                /**
                 * Static representation of the {@link responsible} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                RESPONSIBLE: fieldBuilder.buildEdmTypeField('Responsible', 'Edm.String', true),
                /**
                 * Static representation of the {@link fyVariant} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                FY_VARIANT: fieldBuilder.buildEdmTypeField('FyVariant', 'Edm.String', false),
                /**
                 * Static representation of the {@link currency} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CURRENCY: fieldBuilder.buildEdmTypeField('Currency', 'Edm.String', false),
                /**
                 * Static representation of the {@link currencyIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CURRENCY_ISO: fieldBuilder.buildEdmTypeField('CurrencyIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link programType} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PROGRAM_TYPE: fieldBuilder.buildEdmTypeField('ProgramType', 'Edm.String', false),
                /**
                 * Static representation of the {@link budgCategIndic} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BUDG_CATEG_INDIC: fieldBuilder.buildEdmTypeField('BudgCategIndic', 'Edm.Boolean', true),
                /**
                 * Static representation of the {@link yearDistIndic} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                YEAR_DIST_INDIC: fieldBuilder.buildEdmTypeField('YearDistIndic', 'Edm.Boolean', true),
                /**
                 * Static representation of the {@link defLangu} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DEF_LANGU: fieldBuilder.buildEdmTypeField('DefLangu', 'Edm.String', true),
                /**
                 * Static representation of the {@link defLanguIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DEF_LANGU_ISO: fieldBuilder.buildEdmTypeField('DefLanguIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link language} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                LANGUAGE: fieldBuilder.buildEdmTypeField('Language', 'Edm.String', true),
                /**
                 * Static representation of the {@link languageIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                LANGUAGE_ISO: fieldBuilder.buildEdmTypeField('LanguageIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link assgBlockedIndic} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                ASSG_BLOCKED_INDIC: fieldBuilder.buildEdmTypeField('AssgBlockedIndic', 'Edm.Boolean', true),
                /**
                 * Static representation of the {@link parent} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PARENT: fieldBuilder.buildEdmTypeField('Parent', 'Edm.String', true),
                /**
                 * Static representation of the {@link predecessor} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PREDECESSOR: fieldBuilder.buildEdmTypeField('Predecessor', 'Edm.String', true),
                /**
                 * Static representation of the {@link position} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                POSITION: fieldBuilder.buildEdmTypeField('Position', 'Edm.String', false),
                /**
                 * Static representation of the {@link level} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                LEVEL: fieldBuilder.buildEdmTypeField('Level', 'Edm.String', false),
                /**
                 * Static representation of the {@link descriptionPos} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                DESCRIPTION_POS: fieldBuilder.buildEdmTypeField('DescriptionPos', 'Edm.String', true),
                /**
                 * Static representation of the {@link validFromFy} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VALID_FROM_FY: fieldBuilder.buildEdmTypeField('ValidFromFy', 'Edm.String', true),
                /**
                 * Static representation of the {@link validToFy} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VALID_TO_FY: fieldBuilder.buildEdmTypeField('ValidToFy', 'Edm.String', true),
                /**
                 * Static representation of the {@link scale} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                SCALE: fieldBuilder.buildEdmTypeField('Scale', 'Edm.String', true),
                /**
                 * Static representation of the {@link priority} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PRIORITY: fieldBuilder.buildEdmTypeField('Priority', 'Edm.String', true),
                /**
                 * Static representation of the {@link reason} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                REASON: fieldBuilder.buildEdmTypeField('Reason', 'Edm.String', true),
                /**
                 * Static representation of the {@link createdOn} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CREATED_ON: fieldBuilder.buildEdmTypeField('CreatedOn', 'Edm.DateTime', true),
                /**
                 * Static representation of the {@link createdBy} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CREATED_BY: fieldBuilder.buildEdmTypeField('CreatedBy', 'Edm.String', true),
                /**
                 * Static representation of the {@link coArea} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CO_AREA: fieldBuilder.buildEdmTypeField('CoArea', 'Edm.String', false),
                /**
                 * Static representation of the {@link profitCenter} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PROFIT_CENTER: fieldBuilder.buildEdmTypeField('ProfitCenter', 'Edm.String', true),
                /**
                 * Static representation of the {@link costCenter} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                COST_CENTER: fieldBuilder.buildEdmTypeField('CostCenter', 'Edm.String', true),
                /**
                 * Static representation of the {@link company} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                COMPANY: fieldBuilder.buildEdmTypeField('Company', 'Edm.String', true),
                /**
                 * Static representation of the {@link companyCode} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                COMPANY_CODE: fieldBuilder.buildEdmTypeField('CompanyCode', 'Edm.String', true),
                /**
                 * Static representation of the {@link businessArea} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BUSINESS_AREA: fieldBuilder.buildEdmTypeField('BusinessArea', 'Edm.String', true),
                /**
                 * Static representation of the {@link balSheetItem} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BAL_SHEET_ITEM: fieldBuilder.buildEdmTypeField('BalSheetItem', 'Edm.String', true),
                /**
                 * Static representation of the {@link plant} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PLANT: fieldBuilder.buildEdmTypeField('Plant', 'Edm.String', true),
                /**
                 * Static representation of the {@link plantSection} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                PLANT_SECTION: fieldBuilder.buildEdmTypeField('PlantSection', 'Edm.String', true),
                /**
                 * Static representation of the {@link functLocation} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                FUNCT_LOCATION: fieldBuilder.buildEdmTypeField('FunctLocation', 'Edm.String', true),
                /**
                 * Static representation of the {@link country} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                COUNTRY: fieldBuilder.buildEdmTypeField('Country', 'Edm.String', true),
                /**
                 * Static representation of the {@link countryIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                COUNTRY_ISO: fieldBuilder.buildEdmTypeField('CountryIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link budgDistIndic} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BUDG_DIST_INDIC: fieldBuilder.buildEdmTypeField('BudgDistIndic', 'Edm.Boolean', true),
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
                USER_04_QUANTITY: fieldBuilder.buildEdmTypeField('User04Quantity', 'Edm.Decimal', true),
                /**
                 * Static representation of the {@link user04Unit} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_04_UNIT: fieldBuilder.buildEdmTypeField('User04Unit', 'Edm.String', true),
                /**
                 * Static representation of the {@link user04UnitIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_04_UNIT_ISO: fieldBuilder.buildEdmTypeField('User04UnitIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link user05Quantity} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_05_QUANTITY: fieldBuilder.buildEdmTypeField('User05Quantity', 'Edm.Decimal', true),
                /**
                 * Static representation of the {@link user05Unit} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_05_UNIT: fieldBuilder.buildEdmTypeField('User05Unit', 'Edm.String', true),
                /**
                 * Static representation of the {@link user05UnitIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_05_UNIT_ISO: fieldBuilder.buildEdmTypeField('User05UnitIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link user06Value} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_06_VALUE: fieldBuilder.buildEdmTypeField('User06Value', 'Edm.Decimal', true),
                /**
                 * Static representation of the {@link user06Curr} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_06_CURR: fieldBuilder.buildEdmTypeField('User06Curr', 'Edm.String', true),
                /**
                 * Static representation of the {@link user06CurrIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_06_CURR_ISO: fieldBuilder.buildEdmTypeField('User06CurrIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link user07Value} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_07_VALUE: fieldBuilder.buildEdmTypeField('User07Value', 'Edm.Decimal', true),
                /**
                 * Static representation of the {@link user07Curr} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_07_CURR: fieldBuilder.buildEdmTypeField('User07Curr', 'Edm.String', true),
                /**
                 * Static representation of the {@link user07CurrIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_07_CURR_ISO: fieldBuilder.buildEdmTypeField('User07CurrIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link user08Date} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_08_DATE: fieldBuilder.buildEdmTypeField('User08Date', 'Edm.DateTime', true),
                /**
                 * Static representation of the {@link user09Date} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_09_DATE: fieldBuilder.buildEdmTypeField('User09Date', 'Edm.DateTime', true),
                /**
                 * Static representation of the {@link user10Indicator} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_10_INDICATOR: fieldBuilder.buildEdmTypeField('User10Indicator', 'Edm.Boolean', true),
                /**
                 * Static representation of the {@link user11Indicator} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_11_INDICATOR: fieldBuilder.buildEdmTypeField('User11Indicator', 'Edm.Boolean', true),
                /**
                 * Static representation of the {@link user12AccPer} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_12_ACC_PER: fieldBuilder.buildEdmTypeField('User12AccPer', 'Edm.String', true),
                /**
                 * Static representation of the {@link user13AccPer} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                USER_13_ACC_PER: fieldBuilder.buildEdmTypeField('User13AccPer', 'Edm.String', true),
                /**
                 * Static representation of the {@link objectCurrency} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                OBJECT_CURRENCY: fieldBuilder.buildEdmTypeField('ObjectCurrency', 'Edm.String', true),
                /**
                 * Static representation of the {@link objectCurrencyIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                OBJECT_CURRENCY_ISO: fieldBuilder.buildEdmTypeField('ObjectCurrencyIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link roleInHierarchy} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                ROLE_IN_HIERARCHY: fieldBuilder.buildEdmTypeField('RoleInHierarchy', 'Edm.String', true),
                /**
                 * Static representation of the {@link budgetCategory} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                BUDGET_CATEGORY: fieldBuilder.buildEdmTypeField('BudgetCategory', 'Edm.String', true),
                /**
                 * Static representation of the {@link approvalPeriod} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                APPROVAL_PERIOD: fieldBuilder.buildEdmTypeField('ApprovalPeriod', 'Edm.String', false),
                /**
                 * Static representation of the {@link valueType} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VALUE_TYPE: fieldBuilder.buildEdmTypeField('ValueType', 'Edm.String', false),
                /**
                 * Static representation of the {@link fiscalYear} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                FISCAL_YEAR: fieldBuilder.buildEdmTypeField('FiscalYear', 'Edm.String', true),
                /**
                 * Static representation of the {@link version} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                VERSION: fieldBuilder.buildEdmTypeField('Version', 'Edm.String', true),
                /**
                 * Static representation of the {@link activity} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                ACTIVITY: fieldBuilder.buildEdmTypeField('Activity', 'Edm.String', false),
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
                CURRENCY_TRANS: fieldBuilder.buildEdmTypeField('CurrencyTrans', 'Edm.String', true),
                /**
                 * Static representation of the {@link currencyTransIso} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                CURRENCY_TRANS_ISO: fieldBuilder.buildEdmTypeField('CurrencyTransIso', 'Edm.String', true),
                /**
                 * Static representation of the {@link isLower} property for query construction.
                 * Use to reference this property in query operations such as 'select' in the fluent request API.
                 */
                IS_LOWER: fieldBuilder.buildEdmTypeField('IsLower', 'Edm.String', false),
                ...this.navigationPropertyFields,
                /**
                 *
                 * All fields selector.
                 */
                ALL_FIELDS: new odata_v2_1.AllFields('*', ProgramCodeSet_1.ProgramCodeSet)
            };
        }
        return this._schema;
    }
}
exports.ProgramCodeSetApi = ProgramCodeSetApi;
//# sourceMappingURL=ProgramCodeSetApi.js.map