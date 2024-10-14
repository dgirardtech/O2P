/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  Entity,
  DefaultDeSerializers,
  DeSerializers,
  DeserializedType
} from '@sap-cloud-sdk/odata-v2';
import type { ProgramCodeSetApi } from './ProgramCodeSetApi';

/**
 * This class represents the entity "ProgramCodeSet" of service "ZFA_AFE_COMMON_SRV".
 */
export class ProgramCodeSet<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements ProgramCodeSetType<T>
{
  /**
   * Technical entity name for ProgramCodeSet.
   */
  static _entityName = 'ProgramCodeSet';
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath = '/sap/opu/odata/sap/ZFA_AFE_COMMON_SRV';
  /**
   * All key fields of the ProgramCodeSet entity
   */
  static _keys = ['Program', 'Approvalyear', 'Position'];
  /**
   * Inv.program.
   * Maximum length: 8.
   */
  declare program: DeserializedType<T, 'Edm.String'>;
  /**
   * Fiscal Year.
   * Maximum length: 4.
   */
  declare approvalyear: DeserializedType<T, 'Edm.String'>;
  /**
   * Name.
   * Maximum length: 40.
   * @nullable
   */
  declare description?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Person respons.
   * Maximum length: 8.
   * @nullable
   */
  declare responsible?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Fi.Year Variant.
   * Maximum length: 2.
   */
  declare fyVariant: DeserializedType<T, 'Edm.String'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  declare currency: DeserializedType<T, 'Edm.String'>;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  declare currencyIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Program type.
   * Maximum length: 4.
   */
  declare programType: DeserializedType<T, 'Edm.String'>;
  /**
   * Budg.catg.
   * @nullable
   */
  declare budgCategIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Budg.dist annl.
   * @nullable
   */
  declare yearDistIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Default lang.
   * Maximum length: 2.
   * @nullable
   */
  declare defLangu?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Lang. (ISO).
   * Maximum length: 2.
   * @nullable
   */
  declare defLanguIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Language.
   * Maximum length: 2.
   * @nullable
   */
  declare language?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Lang. (ISO).
   * Maximum length: 2.
   * @nullable
   */
  declare languageIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Assignment Lock.
   * @nullable
   */
  declare assgBlockedIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Position ID.
   * Maximum length: 24.
   * @nullable
   */
  declare parent?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Position ID.
   * Maximum length: 24.
   * @nullable
   */
  declare predecessor?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Position ID.
   * Maximum length: 24.
   */
  declare position: DeserializedType<T, 'Edm.String'>;
  /**
   * Level.
   * Maximum length: 2.
   */
  declare level: DeserializedType<T, 'Edm.String'>;
  /**
   * Name.
   * Maximum length: 40.
   * @nullable
   */
  declare descriptionPos?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Valid from FY.
   * Maximum length: 4.
   * @nullable
   */
  declare validFromFy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Valid to FY.
   * Maximum length: 4.
   * @nullable
   */
  declare validToFy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Scale.
   * Maximum length: 2.
   * @nullable
   */
  declare scale?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Priority.
   * Maximum length: 1.
   * @nullable
   */
  declare priority?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Invest. reason.
   * Maximum length: 2.
   * @nullable
   */
  declare reason?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Created On.
   * @nullable
   */
  declare createdOn?: DeserializedType<T, 'Edm.DateTime'> | null;
  /**
   * Created By.
   * Maximum length: 12.
   * @nullable
   */
  declare createdBy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * CO Area.
   * Maximum length: 4.
   */
  declare coArea: DeserializedType<T, 'Edm.String'>;
  /**
   * Profit Center.
   * Maximum length: 10.
   * @nullable
   */
  declare profitCenter?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Cost Center.
   * Maximum length: 10.
   * @nullable
   */
  declare costCenter?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Company.
   * Maximum length: 6.
   * @nullable
   */
  declare company?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Company Code.
   * Maximum length: 4.
   * @nullable
   */
  declare companyCode?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Business Area.
   * Maximum length: 4.
   * @nullable
   */
  declare businessArea?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Bal. sheet item.
   * Maximum length: 10.
   * @nullable
   */
  declare balSheetItem?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Plant.
   * Maximum length: 4.
   * @nullable
   */
  declare plant?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Plant section.
   * Maximum length: 3.
   * @nullable
   */
  declare plantSection?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Functional loc.
   * Maximum length: 40.
   * @nullable
   */
  declare functLocation?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Ctry of invest.
   * Maximum length: 3.
   * @nullable
   */
  declare country?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 2.
   * @nullable
   */
  declare countryIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Budg.dist. ovrl.
   * @nullable
   */
  declare budgDistIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Org. Unit.
   * Maximum length: 20.
   * @nullable
   */
  declare user00?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * USER01.
   * Maximum length: 20.
   * @nullable
   */
  declare user01?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * USER02.
   * Maximum length: 10.
   * @nullable
   */
  declare user02?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * USER03.
   * Maximum length: 10.
   * @nullable
   */
  declare user03?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Payback Period.
   * @nullable
   */
  declare user04Quantity?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * User field 5.
   * Maximum length: 3.
   * @nullable
   */
  declare user04Unit?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO code.
   * Maximum length: 3.
   * @nullable
   */
  declare user04UnitIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Debt Equ Ratio.
   * @nullable
   */
  declare user05Quantity?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * User field 6.
   * Maximum length: 3.
   * @nullable
   */
  declare user05Unit?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO code.
   * Maximum length: 3.
   * @nullable
   */
  declare user05UnitIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  declare user06Value?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * UserFld 7 crncy.
   * Maximum length: 5.
   * @nullable
   */
  declare user06Curr?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  declare user06CurrIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  declare user07Value?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * User field 8.
   * Maximum length: 5.
   * @nullable
   */
  declare user07Curr?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  declare user07CurrIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Exp. Time Compl.
   * @nullable
   */
  declare user08Date?: DeserializedType<T, 'Edm.DateTime'> | null;
  /**
   * USER09_DATE.
   * @nullable
   */
  declare user09Date?: DeserializedType<T, 'Edm.DateTime'> | null;
  /**
   * USER10_INDICATOR.
   * @nullable
   */
  declare user10Indicator?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * USER11_INDICATOR.
   * @nullable
   */
  declare user11Indicator?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * User fld 13.
   * Maximum length: 6.
   * @nullable
   */
  declare user12AccPer?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * User fld 14.
   * Maximum length: 6.
   * @nullable
   */
  declare user13AccPer?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Positn currency.
   * Maximum length: 5.
   * @nullable
   */
  declare objectCurrency?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  declare objectCurrencyIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Role in hrchy.
   * Maximum length: 1.
   * @nullable
   */
  declare roleInHierarchy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Budget Category.
   * Maximum length: 10.
   * @nullable
   */
  declare budgetCategory?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Approval period.
   * Maximum length: 4.
   */
  declare approvalPeriod: DeserializedType<T, 'Edm.String'>;
  /**
   * Ext. val. type.
   * Maximum length: 8.
   */
  declare valueType: DeserializedType<T, 'Edm.String'>;
  /**
   * Fiscal Year.
   * Maximum length: 4.
   * @nullable
   */
  declare fiscalYear?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Version.
   * Maximum length: 3.
   * @nullable
   */
  declare version?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Plan/budg. activity.
   * Maximum length: 10.
   */
  declare activity: DeserializedType<T, 'Edm.String'>;
  /**
   * Currency amount.
   */
  declare value: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Currency amount.
   * @nullable
   */
  declare value1?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  declare value2?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  declare value3?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  declare value4?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  declare value5?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  declare value6?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency.
   * Maximum length: 5.
   * @nullable
   */
  declare currencyTrans?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  declare currencyTransIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Is Lower.
   * Maximum length: 1.
   */
  declare isLower: DeserializedType<T, 'Edm.String'>;

  constructor(_entityApi: ProgramCodeSetApi<T>) {
    super(_entityApi);
  }
}

export interface ProgramCodeSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  program: DeserializedType<T, 'Edm.String'>;
  approvalyear: DeserializedType<T, 'Edm.String'>;
  description?: DeserializedType<T, 'Edm.String'> | null;
  responsible?: DeserializedType<T, 'Edm.String'> | null;
  fyVariant: DeserializedType<T, 'Edm.String'>;
  currency: DeserializedType<T, 'Edm.String'>;
  currencyIso?: DeserializedType<T, 'Edm.String'> | null;
  programType: DeserializedType<T, 'Edm.String'>;
  budgCategIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  yearDistIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  defLangu?: DeserializedType<T, 'Edm.String'> | null;
  defLanguIso?: DeserializedType<T, 'Edm.String'> | null;
  language?: DeserializedType<T, 'Edm.String'> | null;
  languageIso?: DeserializedType<T, 'Edm.String'> | null;
  assgBlockedIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  parent?: DeserializedType<T, 'Edm.String'> | null;
  predecessor?: DeserializedType<T, 'Edm.String'> | null;
  position: DeserializedType<T, 'Edm.String'>;
  level: DeserializedType<T, 'Edm.String'>;
  descriptionPos?: DeserializedType<T, 'Edm.String'> | null;
  validFromFy?: DeserializedType<T, 'Edm.String'> | null;
  validToFy?: DeserializedType<T, 'Edm.String'> | null;
  scale?: DeserializedType<T, 'Edm.String'> | null;
  priority?: DeserializedType<T, 'Edm.String'> | null;
  reason?: DeserializedType<T, 'Edm.String'> | null;
  createdOn?: DeserializedType<T, 'Edm.DateTime'> | null;
  createdBy?: DeserializedType<T, 'Edm.String'> | null;
  coArea: DeserializedType<T, 'Edm.String'>;
  profitCenter?: DeserializedType<T, 'Edm.String'> | null;
  costCenter?: DeserializedType<T, 'Edm.String'> | null;
  company?: DeserializedType<T, 'Edm.String'> | null;
  companyCode?: DeserializedType<T, 'Edm.String'> | null;
  businessArea?: DeserializedType<T, 'Edm.String'> | null;
  balSheetItem?: DeserializedType<T, 'Edm.String'> | null;
  plant?: DeserializedType<T, 'Edm.String'> | null;
  plantSection?: DeserializedType<T, 'Edm.String'> | null;
  functLocation?: DeserializedType<T, 'Edm.String'> | null;
  country?: DeserializedType<T, 'Edm.String'> | null;
  countryIso?: DeserializedType<T, 'Edm.String'> | null;
  budgDistIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  user00?: DeserializedType<T, 'Edm.String'> | null;
  user01?: DeserializedType<T, 'Edm.String'> | null;
  user02?: DeserializedType<T, 'Edm.String'> | null;
  user03?: DeserializedType<T, 'Edm.String'> | null;
  user04Quantity?: DeserializedType<T, 'Edm.Decimal'> | null;
  user04Unit?: DeserializedType<T, 'Edm.String'> | null;
  user04UnitIso?: DeserializedType<T, 'Edm.String'> | null;
  user05Quantity?: DeserializedType<T, 'Edm.Decimal'> | null;
  user05Unit?: DeserializedType<T, 'Edm.String'> | null;
  user05UnitIso?: DeserializedType<T, 'Edm.String'> | null;
  user06Value?: DeserializedType<T, 'Edm.Decimal'> | null;
  user06Curr?: DeserializedType<T, 'Edm.String'> | null;
  user06CurrIso?: DeserializedType<T, 'Edm.String'> | null;
  user07Value?: DeserializedType<T, 'Edm.Decimal'> | null;
  user07Curr?: DeserializedType<T, 'Edm.String'> | null;
  user07CurrIso?: DeserializedType<T, 'Edm.String'> | null;
  user08Date?: DeserializedType<T, 'Edm.DateTime'> | null;
  user09Date?: DeserializedType<T, 'Edm.DateTime'> | null;
  user10Indicator?: DeserializedType<T, 'Edm.Boolean'> | null;
  user11Indicator?: DeserializedType<T, 'Edm.Boolean'> | null;
  user12AccPer?: DeserializedType<T, 'Edm.String'> | null;
  user13AccPer?: DeserializedType<T, 'Edm.String'> | null;
  objectCurrency?: DeserializedType<T, 'Edm.String'> | null;
  objectCurrencyIso?: DeserializedType<T, 'Edm.String'> | null;
  roleInHierarchy?: DeserializedType<T, 'Edm.String'> | null;
  budgetCategory?: DeserializedType<T, 'Edm.String'> | null;
  approvalPeriod: DeserializedType<T, 'Edm.String'>;
  valueType: DeserializedType<T, 'Edm.String'>;
  fiscalYear?: DeserializedType<T, 'Edm.String'> | null;
  version?: DeserializedType<T, 'Edm.String'> | null;
  activity: DeserializedType<T, 'Edm.String'>;
  value: DeserializedType<T, 'Edm.Decimal'>;
  value1?: DeserializedType<T, 'Edm.Decimal'> | null;
  value2?: DeserializedType<T, 'Edm.Decimal'> | null;
  value3?: DeserializedType<T, 'Edm.Decimal'> | null;
  value4?: DeserializedType<T, 'Edm.Decimal'> | null;
  value5?: DeserializedType<T, 'Edm.Decimal'> | null;
  value6?: DeserializedType<T, 'Edm.Decimal'> | null;
  currencyTrans?: DeserializedType<T, 'Edm.String'> | null;
  currencyTransIso?: DeserializedType<T, 'Edm.String'> | null;
  isLower: DeserializedType<T, 'Edm.String'>;
}
