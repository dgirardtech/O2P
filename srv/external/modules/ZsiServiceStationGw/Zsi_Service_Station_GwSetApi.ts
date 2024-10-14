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
  defaultDeSerializers,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  entityBuilder,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField,
  Link,
  OneToOneLink
} from '@sap-cloud-sdk/odata-v2';
export class Zsi_Service_Station_GwSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<Zsi_Service_Station_GwSet<DeSerializersT>, DeSerializersT>
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
  ): Zsi_Service_Station_GwSetApi<DeSerializersT> {
    return new Zsi_Service_Station_GwSetApi(deSerializers);
  }

  private navigationPropertyFields!: {
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
  };

  _addNavigationProperties(
    linkedApis: [
      Zsi_Servs_Contract_Gw_ItemSetApi<DeSerializersT>,
      Zsi_Servs_Address_GwSetApi<DeSerializersT>,
      Zsi_Servs_Agent_GwSetApi<DeSerializersT>,
      Zsi_Servs_Dealer_GwSetApi<DeSerializersT>
    ]
  ): this {
    this.navigationPropertyFields = {
      SERV_STATION_TO_CONTRACT_ITEM: new Link(
        'ServStationToContractItem',
        this,
        linkedApis[0]
      ),
      SERV_STATION_TO_ADDRESS: new OneToOneLink(
        'ServStationToAddress',
        this,
        linkedApis[1]
      ),
      SERV_STATION_TO_AGENT: new OneToOneLink(
        'ServStationToAgent',
        this,
        linkedApis[2]
      ),
      SERV_STATION_TO_DEALER: new OneToOneLink(
        'ServStationToDealer',
        this,
        linkedApis[3]
      )
    };
    return this;
  }

  entityConstructor = Zsi_Service_Station_GwSet;

  requestBuilder(): Zsi_Service_Station_GwSetRequestBuilder<DeSerializersT> {
    return new Zsi_Service_Station_GwSetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    Zsi_Service_Station_GwSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT
    >(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<
    Zsi_Service_Station_GwSet<DeSerializersT>,
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
    typeof Zsi_Service_Station_GwSet,
    DeSerializersT
  >;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        Zsi_Service_Station_GwSet,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    SERV_SID: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SALES_ORG: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DISTR_CH: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIVISION: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    LOC_VALUE: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    LOC_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    AREA_Q_8: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    AREA_Q_8_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    STATUS: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    STATUS_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SALES_DISTRICT: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    EASY_STATION: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    HIGHWAY_STATION: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CHAIN_CODE: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    CHAIN_CODE_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIFFERENTIATOR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIFFERENTIATOR_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DNA: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DNA_DESCR: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    VOLUME: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    UNITOF_MES: OrderableEdmTypeField<
      Zsi_Service_Station_GwSet<DeSerializers>,
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
    ALL_FIELDS: AllFields<Zsi_Service_Station_GwSet<DeSerializers>>;
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
         * Static representation of the {@link locValue} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LOC_VALUE: fieldBuilder.buildEdmTypeField(
          'LOC_VALUE',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link locDescr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        LOC_DESCR: fieldBuilder.buildEdmTypeField(
          'LOC_DESCR',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link areaQ8} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        AREA_Q_8: fieldBuilder.buildEdmTypeField(
          'AREA_Q8',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link areaQ8Descr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        AREA_Q_8_DESCR: fieldBuilder.buildEdmTypeField(
          'AREA_Q8DESCR',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link status} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        STATUS: fieldBuilder.buildEdmTypeField('STATUS', 'Edm.String', false),
        /**
         * Static representation of the {@link statusDescr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        STATUS_DESCR: fieldBuilder.buildEdmTypeField(
          'STATUS_DESCR',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link salesDistrict} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        SALES_DISTRICT: fieldBuilder.buildEdmTypeField(
          'SALES_DISTRICT',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link easyStation} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        EASY_STATION: fieldBuilder.buildEdmTypeField(
          'EASY_STATION',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link highwayStation} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        HIGHWAY_STATION: fieldBuilder.buildEdmTypeField(
          'HIGHWAY_STATION',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link chainCode} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CHAIN_CODE: fieldBuilder.buildEdmTypeField(
          'CHAIN_CODE',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link chainCodeDescr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        CHAIN_CODE_DESCR: fieldBuilder.buildEdmTypeField(
          'CHAIN_CODE_DESCR',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link differentiator} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DIFFERENTIATOR: fieldBuilder.buildEdmTypeField(
          'DIFFERENTIATOR',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link differentiatorDescr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DIFFERENTIATOR_DESCR: fieldBuilder.buildEdmTypeField(
          'DIFFERENTIATOR_DESCR',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link dna} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DNA: fieldBuilder.buildEdmTypeField('DNA', 'Edm.String', false),
        /**
         * Static representation of the {@link dnaDescr} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        DNA_DESCR: fieldBuilder.buildEdmTypeField(
          'DNA_DESCR',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link volume} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        VOLUME: fieldBuilder.buildEdmTypeField('VOLUME', 'Edm.String', false),
        /**
         * Static representation of the {@link unitofMes} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        UNITOF_MES: fieldBuilder.buildEdmTypeField(
          'UNITOF_MES',
          'Edm.String',
          false
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', Zsi_Service_Station_GwSet)
      };
    }

    return this._schema;
  }
}
