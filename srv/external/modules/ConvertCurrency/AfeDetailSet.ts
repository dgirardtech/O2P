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
export class AfeDetailSet<T extends DeSerializers = DefaultDeSerializers>
  extends Entity
  implements AfeDetailSetType<T>
{
  /**
   * Technical entity name for AfeDetailSet.
   */
  static _entityName = 'AfeDetailSet';
  /**
   * Default url path for the according service.
   */
  static _defaultBasePath = '/sap/opu/odata/sap/ZFA_AFE_COMMON_SRV';
  /**
   * All key fields of the AfeDetailSet entity
   */
  static _keys = ['IvApprovalyear', 'IvAufnr', 'IvBukrs'];
  /**
   * Fiscal Year.
   * Maximum length: 4.
   */
  declare ivApprovalyear: DeserializedType<T, 'Edm.String'>;
  /**
   * Order.
   * Maximum length: 12.
   */
  declare ivAufnr: DeserializedType<T, 'Edm.String'>;
  /**
   * Company Code.
   * Maximum length: 4.
   */
  declare ivBukrs: DeserializedType<T, 'Edm.String'>;
  /**
   * CO Area.
   * Maximum length: 4.
   */
  declare ivKokrs: DeserializedType<T, 'Edm.String'>;
  /**
   * Position ID.
   * Maximum length: 24.
   */
  declare ivProgramCode: DeserializedType<T, 'Edm.String'>;
  /**
   * Fiscal Year.
   * Maximum length: 4.
   */
  declare approvalyear: DeserializedType<T, 'Edm.String'>;
  /**
   * Order.
   * Maximum length: 12.
   */
  declare aufnr: DeserializedType<T, 'Edm.String'>;
  /**
   * Description.
   * Maximum length: 40.
   */
  declare ktext: DeserializedType<T, 'Edm.String'>;
  /**
   * Date.
   */
  declare idat1: DeserializedType<T, 'Edm.DateTime'>;
  /**
   * Position ID.
   * Maximum length: 24.
   */
  declare programCode: DeserializedType<T, 'Edm.String'>;
  /**
   * Name.
   * Maximum length: 40.
   */
  declare post1: DeserializedType<T, 'Edm.String'>;
  /**
   * Invest. reason.
   * Maximum length: 2.
   */
  declare izwek: DeserializedType<T, 'Edm.String'>;
  /**
   * Total.
   */
  declare afeValue: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Val/COArea Crcy.
   */
  declare afeValueSpentUpTo: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Val/COArea Crcy.
   */
  declare afeValueSpentFrom: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Overall.
   */
  declare lclAfeValue: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Value/Obj. Crcy.
   */
  declare lclAfeValueSpentT: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Value/Obj. Crcy.
   */
  declare lclAfeValueSpentF: DeserializedType<T, 'Edm.Decimal'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  declare waers: DeserializedType<T, 'Edm.String'>;
  /**
   * Currency.
   * Maximum length: 5.
   */
  declare localWaers: DeserializedType<T, 'Edm.String'>;
  /**
   * Status.
   * Maximum length: 6.
   */
  declare status: DeserializedType<T, 'Edm.String'>;
  /**
   * Org. Unit.
   * Maximum length: 20.
   */
  declare usr00: DeserializedType<T, 'Edm.String'>;
  /**
   * Company Code.
   * Maximum length: 4.
   */
  declare bukrs: DeserializedType<T, 'Edm.String'>;

  constructor(_entityApi: AfeDetailSetApi<T>) {
    super(_entityApi);
  }
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
