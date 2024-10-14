/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { Zsi_Pid_Root_Pv_InfoSet } from './Zsi_Pid_Root_Pv_InfoSet';
import { Zsi_Pid_Root_Pv_InfoSetRequestBuilder } from './Zsi_Pid_Root_Pv_InfoSetRequestBuilder';
import { Zsi_Servs_Annual_VolumesSetApi } from './Zsi_Servs_Annual_VolumesSetApi';
import { Zsi_Servs_Pv_NonoilSetApi } from './Zsi_Servs_Pv_NonoilSetApi';
import {
  CustomField,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField,
  Link
} from '@sap-cloud-sdk/odata-v2';
export declare class Zsi_Pid_Root_Pv_InfoSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>, DeSerializersT>
{
  deSerializers: DeSerializersT;
  private constructor();
  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(deSerializers?: DeSerializersT): Zsi_Pid_Root_Pv_InfoSetApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(
    linkedApis: [
      Zsi_Servs_Annual_VolumesSetApi<DeSerializersT>,
      Zsi_Servs_Pv_NonoilSetApi<DeSerializersT>
    ]
  ): this;
  entityConstructor: typeof Zsi_Pid_Root_Pv_InfoSet;
  requestBuilder(): Zsi_Pid_Root_Pv_InfoSetRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<
    typeof Zsi_Pid_Root_Pv_InfoSet,
    DeSerializersT
  >;
  private _schema?;
  get schema(): {
    SERV_SID: OrderableEdmTypeField<
      Zsi_Pid_Root_Pv_InfoSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SALES_ORG: OrderableEdmTypeField<
      Zsi_Pid_Root_Pv_InfoSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DISTR_CH: OrderableEdmTypeField<
      Zsi_Pid_Root_Pv_InfoSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIVISION: OrderableEdmTypeField<
      Zsi_Pid_Root_Pv_InfoSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    /**
     * Static representation of the one-to-many navigation property {@link servPidToAnnualVolums} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    SERV_PID_TO_ANNUAL_VOLUMS: Link<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
      DeSerializersT,
      Zsi_Servs_Annual_VolumesSetApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-many navigation property {@link servPidToPvNonOil} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    SERV_PID_TO_PV_NON_OIL: Link<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
      DeSerializersT,
      Zsi_Servs_Pv_NonoilSetApi<DeSerializersT>
    >;
    ALL_FIELDS: AllFields<
      Zsi_Pid_Root_Pv_InfoSet<
        DeSerializers<
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any,
          any
        >
      >
    >;
  };
}
