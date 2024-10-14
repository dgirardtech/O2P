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
import type { AfeDetailSetApi } from './AfeDetailSetApi';
/**
 * This class represents the entity "AfeDetailSet" of service "ZFA_AFE_COMMON_SRV".
 */
export declare class AfeDetailSet<
    T extends DeSerializers = DefaultDeSerializers
  >
  extends Entity
  implements AfeDetailSetType<T>
{
  /**
   * Technical entity name for AfeDetailSet.
   */
  static _entityName: string;
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath: string;
  /**
   * All key fields of the AfeDetailSet entity
   */
  static _keys: string[];
  /**
   * Fiscal Year.
   * Maximum length: 4.
   */
  ivApprovalyear: DeserializedType<T, 'Edm.String'>;
  /**
   * Order.
   * Maximum length: 12.
   */
  ivAufnr: DeserializedType<T, 'Edm.String'>;
  /**
   * Company Code.
   * Maximum length: 4.
   */
  ivBukrs: DeserializedType<T, 'Edm.String'>;
  /**
   * CO Area.
   * Maximum length: 4.
   */
  ivKokrs: DeserializedType<T, 'Edm.String'>;
  /**
   * Position ID.
   * Maximum length: 24.
   */
  ivProgramCode: DeserializedType<T, 'Edm.String'>;
  /**
   * Fiscal Year.
   * Maximum length: 4.
   */
  approvalyear: DeserializedType<T, 'Edm.String'>;
  /**
   * Order.
   * Maximum length: 12.
   */
  aufnr: DeserializedType<T, 'Edm.String'>;
  /**
   * Description.
   * Maximum length: 40.
   */
  ktext: DeserializedType<T, 'Edm.String'>;
  /**
   * Date.
   */
  idat1: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Position ID.
   * Maximum length: 24.
   */
  programCode: DeserializedType<T, 'Edm.String'>;
  /**
   * Name.
   * Maximum length: 40.
   */
  post1: DeserializedType<T, 'Edm.String'>;
  /**
   * Invest. reason.
   * Maximum length: 2.
   */
  izwek: DeserializedType<T, 'Edm.String'>;
  /**
   * Total.
   */
  afeValue: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Val/COArea Crcy.
   */
  afeValueSpentUpTo: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Val/COArea Crcy.
   */
  afeValueSpentFrom: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Overall.
   */
  lclAfeValue: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Value/Obj. Crcy.
   */
  lclAfeValueSpentT: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Value/Obj. Crcy.
   */
  lclAfeValueSpentF: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  waers: DeserializedType<T, 'Edm.String'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  localWaers: DeserializedType<T, 'Edm.String'>;
  /**
   * Status.
   * Maximum length: 6.
   */
  status: DeserializedType<T, 'Edm.String'>;
  /**
   * Org. Unit.
   * Maximum length: 20.
   */
  usr00: DeserializedType<T, 'Edm.String'>;
  /**
   * Company Code.
   * Maximum length: 4.
   */
  bukrs: DeserializedType<T, 'Edm.String'>;
  constructor(_entityApi: AfeDetailSetApi<T>);
}
export interface AfeDetailSetType<
  T extends DeSerializers = DefaultDeSerializers
> {
  ivApprovalyear: DeserializedType<T, 'Edm.String'>;
  ivAufnr: DeserializedType<T, 'Edm.String'>;
  ivBukrs: DeserializedType<T, 'Edm.String'>;
  ivKokrs: DeserializedType<T, 'Edm.String'>;
  ivProgramCode: DeserializedType<T, 'Edm.String'>;
  approvalyear: DeserializedType<T, 'Edm.String'>;
  aufnr: DeserializedType<T, 'Edm.String'>;
  ktext: DeserializedType<T, 'Edm.String'>;
  idat1: DeserializedType<T, 'Edm.DateTime'>;
  programCode: DeserializedType<T, 'Edm.String'>;
  post1: DeserializedType<T, 'Edm.String'>;
  izwek: DeserializedType<T, 'Edm.String'>;
  afeValue: DeserializedType<T, 'Edm.Decimal'>;
  afeValueSpentUpTo: DeserializedType<T, 'Edm.Decimal'>;
  afeValueSpentFrom: DeserializedType<T, 'Edm.Decimal'>;
  lclAfeValue: DeserializedType<T, 'Edm.Decimal'>;
  lclAfeValueSpentT: DeserializedType<T, 'Edm.Decimal'>;
  lclAfeValueSpentF: DeserializedType<T, 'Edm.Decimal'>;
  waers: DeserializedType<T, 'Edm.String'>;
  localWaers: DeserializedType<T, 'Edm.String'>;
  status: DeserializedType<T, 'Edm.String'>;
  usr00: DeserializedType<T, 'Edm.String'>;
  bukrs: DeserializedType<T, 'Edm.String'>;
}
