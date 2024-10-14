/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { Zsi_Service_Station_GwSet } from './Zsi_Service_Station_GwSet';
import { Zsi_Service_Station_GwSetRequestBuilder } from './Zsi_Service_Station_GwSetRequestBuilder';
import { Zsi_Servs_Contract_Gw_ItemSetApi } from './Zsi_Servs_Contract_Gw_ItemSetApi';
import { Zsi_Servs_Address_GwSetApi } from './Zsi_Servs_Address_GwSetApi';
import { Zsi_Servs_Agent_GwSetApi } from './Zsi_Servs_Agent_GwSetApi';
import { Zsi_Servs_Dealer_GwSetApi } from './Zsi_Servs_Dealer_GwSetApi';
import {
  CustomField,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField,
  Link,
  OneToOneLink
} from '@sap-cloud-sdk/odata-v2';
export declare class Zsi_Service_Station_GwSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<Zsi_Service_Station_GwSet<DeSerializersT>, DeSerializersT>
{
  deSerializers: DeSerializersT;
  private constructor();
  /**
   * Do not use this method or the constructor directly.
   * Use the service function as described in the documentation to get an API instance.
   */
  static _privateFactory<
    DeSerializersT extends DeSerializers = DefaultDeSerializers
  >(
    deSerializers?: DeSerializersT
  ): Zsi_Service_Station_GwSetApi<DeSerializersT>;
  private navigationPropertyFields;
  _addNavigationProperties(
    linkedApis: [
      Zsi_Servs_Contract_Gw_ItemSetApi<DeSerializersT>,
      Zsi_Servs_Address_GwSetApi<DeSerializersT>,
      Zsi_Servs_Agent_GwSetApi<DeSerializersT>,
      Zsi_Servs_Dealer_GwSetApi<DeSerializersT>
    ]
  ): this;
  entityConstructor: typeof Zsi_Service_Station_GwSet;
  requestBuilder(): Zsi_Service_Station_GwSetRequestBuilder<DeSerializersT>;
  entityBuilder(): EntityBuilderType<
    Zsi_Service_Station_GwSet<DeSerializersT>,
    DeSerializersT
  >;
  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable?: NullableT
  ): CustomField<
    Zsi_Service_Station_GwSet<DeSerializersT>,
    DeSerializersT,
    NullableT
  >;
  private _fieldBuilder?;
  get fieldBuilder(): FieldBuilder<
    typeof Zsi_Service_Station_GwSet,
    DeSerializersT
  >;
  private _schema?;
  get schema(): {
    SERV_SID: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
      Zsi_Service_Station_GwSet<
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
      Zsi_Service_Station_GwSet<
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
      Zsi_Service_Station_GwSet<
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
    LOC_VALUE: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    LOC_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    AREA_Q_8: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    AREA_Q_8_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    STATUS: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    STATUS_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    SALES_DISTRICT: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    EASY_STATION: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    HIGHWAY_STATION: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    CHAIN_CODE: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    CHAIN_CODE_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    DIFFERENTIATOR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    DIFFERENTIATOR_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    DNA: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    DNA_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    VOLUME: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
    UNITOF_MES: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<
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
     * Static representation of the one-to-many navigation property {@link servStationToContractItem} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    SERV_STATION_TO_CONTRACT_ITEM: Link<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT,
      Zsi_Servs_Contract_Gw_ItemSetApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-one navigation property {@link servStationToAddress} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    SERV_STATION_TO_ADDRESS: OneToOneLink<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT,
      Zsi_Servs_Address_GwSetApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-one navigation property {@link servStationToAgent} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    SERV_STATION_TO_AGENT: OneToOneLink<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT,
      Zsi_Servs_Agent_GwSetApi<DeSerializersT>
    >;
    /**
     * Static representation of the one-to-one navigation property {@link servStationToDealer} for query construction.
     * Use to reference this property in query operations such as 'select' in the fluent request API.
     */
    SERV_STATION_TO_DEALER: OneToOneLink<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT,
      Zsi_Servs_Dealer_GwSetApi<DeSerializersT>
    >;
    ALL_FIELDS: AllFields<
      Zsi_Service_Station_GwSet<
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
