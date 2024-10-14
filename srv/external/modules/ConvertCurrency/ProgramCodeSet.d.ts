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
export declare class ProgramCodeSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements ProgramCodeSetType<T>
{
  /**
   * Technical entity name for ProgramCodeSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the ProgramCodeSet entity
   */
  static _keys: string[];
  /**
   * Inv.program.
   * Maximum length: 8.
   */
  program: DeserializedType<T, 'Edm.String'>;
  /**
   * Fiscal Year.
   * Maximum length: 4.
   */
  approvalyear: DeserializedType<T, 'Edm.String'>;
  /**
   * Name.
   * Maximum length: 40.
   * @nullable
   */
  description?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Person respons.
   * Maximum length: 8.
   * @nullable
   */
  responsible?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Fi.Year Variant.
   * Maximum length: 2.
   */
  fyVariant: DeserializedType<T, 'Edm.String'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  currency: DeserializedType<T, 'Edm.String'>;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  currencyIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Program type.
   * Maximum length: 4.
   */
  programType: DeserializedType<T, 'Edm.String'>;
  /**
   * Budg.catg.
   * @nullable
   */
  budgCategIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Budg.dist annl.
   * @nullable
   */
  yearDistIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Default lang.
   * Maximum length: 2.
   * @nullable
   */
  defLangu?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Lang. (ISO).
   * Maximum length: 2.
   * @nullable
   */
  defLanguIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Language.
   * Maximum length: 2.
   * @nullable
   */
  language?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Lang. (ISO).
   * Maximum length: 2.
   * @nullable
   */
  languageIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Assignment Lock.
   * @nullable
   */
  assgBlockedIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Position ID.
   * Maximum length: 24.
   * @nullable
   */
  parent?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Position ID.
   * Maximum length: 24.
   * @nullable
   */
  predecessor?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Position ID.
   * Maximum length: 24.
   */
  position: DeserializedType<T, 'Edm.String'>;
  /**
   * Level.
   * Maximum length: 2.
   */
  level: DeserializedType<T, 'Edm.String'>;
  /**
   * Name.
   * Maximum length: 40.
   * @nullable
   */
  descriptionPos?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Valid from FY.
   * Maximum length: 4.
   * @nullable
   */
  validFromFy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Valid to FY.
   * Maximum length: 4.
   * @nullable
   */
  validToFy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Scale.
   * Maximum length: 2.
   * @nullable
   */
  scale?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Priority.
   * Maximum length: 1.
   * @nullable
   */
  priority?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Invest. reason.
   * Maximum length: 2.
   * @nullable
   */
  reason?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Created On.
   * @nullable
   */
  createdOn?: DeserializedType<T, 'Edm.DateTime'> | null;
  /**
   * Created By.
   * Maximum length: 12.
   * @nullable
   */
  createdBy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * CO Area.
   * Maximum length: 4.
   */
  coArea: DeserializedType<T, 'Edm.String'>;
  /**
   * Profit Center.
   * Maximum length: 10.
   * @nullable
   */
  profitCenter?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Cost Center.
   * Maximum length: 10.
   * @nullable
   */
  costCenter?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Company.
   * Maximum length: 6.
   * @nullable
   */
  company?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Company Code.
   * Maximum length: 4.
   * @nullable
   */
  companyCode?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Business Area.
   * Maximum length: 4.
   * @nullable
   */
  businessArea?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Bal. sheet item.
   * Maximum length: 10.
   * @nullable
   */
  balSheetItem?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Plant.
   * Maximum length: 4.
   * @nullable
   */
  plant?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Plant section.
   * Maximum length: 3.
   * @nullable
   */
  plantSection?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Functional loc.
   * Maximum length: 40.
   * @nullable
   */
  functLocation?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Ctry of invest.
   * Maximum length: 3.
   * @nullable
   */
  country?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 2.
   * @nullable
   */
  countryIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Budg.dist. ovrl.
   * @nullable
   */
  budgDistIndic?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * Org. Unit.
   * Maximum length: 20.
   * @nullable
   */
  user00?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * USER01.
   * Maximum length: 20.
   * @nullable
   */
  user01?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * USER02.
   * Maximum length: 10.
   * @nullable
   */
  user02?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * USER03.
   * Maximum length: 10.
   * @nullable
   */
  user03?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Payback Period.
   * @nullable
   */
  user04Quantity?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * User field 5.
   * Maximum length: 3.
   * @nullable
   */
  user04Unit?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO code.
   * Maximum length: 3.
   * @nullable
   */
  user04UnitIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Debt Equ Ratio.
   * @nullable
   */
  user05Quantity?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * User field 6.
   * Maximum length: 3.
   * @nullable
   */
  user05Unit?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO code.
   * Maximum length: 3.
   * @nullable
   */
  user05UnitIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  user06Value?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * UserFld 7 crncy.
   * Maximum length: 5.
   * @nullable
   */
  user06Curr?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  user06CurrIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  user07Value?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * User field 8.
   * Maximum length: 5.
   * @nullable
   */
  user07Curr?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  user07CurrIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Exp. Time Compl.
   * @nullable
   */
  user08Date?: DeserializedType<T, 'Edm.DateTime'> | null;
  /**
   * USER09_DATE.
   * @nullable
   */
  user09Date?: DeserializedType<T, 'Edm.DateTime'> | null;
  /**
   * USER10_INDICATOR.
   * @nullable
   */
  user10Indicator?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * USER11_INDICATOR.
   * @nullable
   */
  user11Indicator?: DeserializedType<T, 'Edm.Boolean'> | null;
  /**
   * User fld 13.
   * Maximum length: 6.
   * @nullable
   */
  user12AccPer?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * User fld 14.
   * Maximum length: 6.
   * @nullable
   */
  user13AccPer?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Positn currency.
   * Maximum length: 5.
   * @nullable
   */
  objectCurrency?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  objectCurrencyIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Role in hrchy.
   * Maximum length: 1.
   * @nullable
   */
  roleInHierarchy?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Budget Category.
   * Maximum length: 10.
   * @nullable
   */
  budgetCategory?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Approval period.
   * Maximum length: 4.
   */
  approvalPeriod: DeserializedType<T, 'Edm.String'>;
  /**
   * Ext. val. type.
   * Maximum length: 8.
   */
  valueType: DeserializedType<T, 'Edm.String'>;
  /**
   * Fiscal Year.
   * Maximum length: 4.
   * @nullable
   */
  fiscalYear?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Version.
   * Maximum length: 3.
   * @nullable
   */
  version?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Plan/budg. activity.
   * Maximum length: 10.
   */
  activity: DeserializedType<T, 'Edm.String'>;
  /**
   * Currency amount.
   */
  value: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Currency amount.
   * @nullable
   */
  value1?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  value2?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  value3?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  value4?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  value5?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency amount.
   * @nullable
   */
  value6?: DeserializedType<T, 'Edm.Decimal'> | null;
  /**
   * Currency.
   * Maximum length: 5.
   * @nullable
   */
  currencyTrans?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * ISO Code.
   * Maximum length: 3.
   * @nullable
   */
  currencyTransIso?: DeserializedType<T, 'Edm.String'> | null;
  /**
   * Is Lower.
   * Maximum length: 1.
   */
  isLower: DeserializedType<T, 'Edm.String'>;
  constructor(_entityApi: ProgramCodeSetApi<T>);
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
