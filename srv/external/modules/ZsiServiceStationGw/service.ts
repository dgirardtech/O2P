/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { Zsi_Service_Station_GwSetApi } from './Zsi_Service_Station_GwSetApi';
import { Zsi_Servs_Contract_Gw_ItemSetApi } from './Zsi_Servs_Contract_Gw_ItemSetApi';
import { Zsi_Servs_Annual_VolumesSetApi } from './Zsi_Servs_Annual_VolumesSetApi';
import { ChainListSetApi } from './ChainListSetApi';
import { Zsi_Servs_Pv_NonoilSetApi } from './Zsi_Servs_Pv_NonoilSetApi';
import { Zsi_Servs_Address_GwSetApi } from './Zsi_Servs_Address_GwSetApi';
import { Zsi_Servs_Agent_GwSetApi } from './Zsi_Servs_Agent_GwSetApi';
import { Zsi_Servs_Dealer_GwSetApi } from './Zsi_Servs_Dealer_GwSetApi';
import { Zsi_Pid_Root_Pv_InfoSetApi } from './Zsi_Pid_Root_Pv_InfoSetApi';
import { DomainListSetApi } from './DomainListSetApi';
import { BigNumber } from 'bignumber.js';
import { Moment } from 'moment';
import {
  defaultDeSerializers,
  DeSerializers,
  DefaultDeSerializers,
  mergeDefaultDeSerializersWith,
  Time
} from '@sap-cloud-sdk/odata-v2';
import { batch, changeset } from './BatchRequest';

export function zsiServiceStationGw<
  BinaryT = string,
  BooleanT = boolean,
  ByteT = number,
  DecimalT = BigNumber,
  DoubleT = number,
  FloatT = number,
  Int16T = number,
  Int32T = number,
  Int64T = BigNumber,
  GuidT = string,
  SByteT = number,
  SingleT = number,
  StringT = string,
  AnyT = any,
  DateTimeOffsetT = Moment,
  DateTimeT = Moment,
  TimeT = Time
>(
  deSerializers: Partial<
    DeSerializers<
      BinaryT,
      BooleanT,
      ByteT,
      DecimalT,
      DoubleT,
      FloatT,
      Int16T,
      Int32T,
      Int64T,
      GuidT,
      SByteT,
      SingleT,
      StringT,
      AnyT,
      DateTimeOffsetT,
      DateTimeT,
      TimeT
    >
  > = defaultDeSerializers as any
): ZsiServiceStationGw<
  DeSerializers<
    BinaryT,
    BooleanT,
    ByteT,
    DecimalT,
    DoubleT,
    FloatT,
    Int16T,
    Int32T,
    Int64T,
    GuidT,
    SByteT,
    SingleT,
    StringT,
    AnyT,
    DateTimeOffsetT,
    DateTimeT,
    TimeT
  >
> {
  return new ZsiServiceStationGw(mergeDefaultDeSerializersWith(deSerializers));
}
class ZsiServiceStationGw<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> {
  private apis: Record<string, any> = {};
  private deSerializers: DeSerializersT;

  constructor(deSerializers: DeSerializersT) {
    this.deSerializers = deSerializers;
  }

  private initApi(key: string, entityApi: any): any {
    if (!this.apis[key]) {
      this.apis[key] = entityApi._privateFactory(this.deSerializers);
    }
    return this.apis[key];
  }

  get zsi_Service_Station_GwSetApi(): Zsi_Service_Station_GwSetApi<DeSerializersT> {
    const api = this.initApi(
      'zsi_Service_Station_GwSetApi',
      Zsi_Service_Station_GwSetApi
    );
    const linkedApis = [
      this.initApi(
        'zsi_Servs_Contract_Gw_ItemSetApi',
        Zsi_Servs_Contract_Gw_ItemSetApi
      ),
      this.initApi('zsi_Servs_Address_GwSetApi', Zsi_Servs_Address_GwSetApi),
      this.initApi('zsi_Servs_Agent_GwSetApi', Zsi_Servs_Agent_GwSetApi),
      this.initApi('zsi_Servs_Dealer_GwSetApi', Zsi_Servs_Dealer_GwSetApi)
    ];
    api._addNavigationProperties(linkedApis);
    return api;
  }

  get zsi_Servs_Contract_Gw_ItemSetApi(): Zsi_Servs_Contract_Gw_ItemSetApi<DeSerializersT> {
    return this.initApi(
      'zsi_Servs_Contract_Gw_ItemSetApi',
      Zsi_Servs_Contract_Gw_ItemSetApi
    );
  }

  get zsi_Servs_Annual_VolumesSetApi(): Zsi_Servs_Annual_VolumesSetApi<DeSerializersT> {
    return this.initApi(
      'zsi_Servs_Annual_VolumesSetApi',
      Zsi_Servs_Annual_VolumesSetApi
    );
  }

  get chainListSetApi(): ChainListSetApi<DeSerializersT> {
    const api = this.initApi('chainListSetApi', ChainListSetApi);
    const linkedApis = [
      this.initApi(
        'zsi_Service_Station_GwSetApi',
        Zsi_Service_Station_GwSetApi
      ),
      this.initApi('zsi_Servs_Address_GwSetApi', Zsi_Servs_Address_GwSetApi)
    ];
    api._addNavigationProperties(linkedApis);
    return api;
  }

  get zsi_Servs_Pv_NonoilSetApi(): Zsi_Servs_Pv_NonoilSetApi<DeSerializersT> {
    return this.initApi('zsi_Servs_Pv_NonoilSetApi', Zsi_Servs_Pv_NonoilSetApi);
  }

  get zsi_Servs_Address_GwSetApi(): Zsi_Servs_Address_GwSetApi<DeSerializersT> {
    return this.initApi(
      'zsi_Servs_Address_GwSetApi',
      Zsi_Servs_Address_GwSetApi
    );
  }

  get zsi_Servs_Agent_GwSetApi(): Zsi_Servs_Agent_GwSetApi<DeSerializersT> {
    return this.initApi('zsi_Servs_Agent_GwSetApi', Zsi_Servs_Agent_GwSetApi);
  }

  get zsi_Servs_Dealer_GwSetApi(): Zsi_Servs_Dealer_GwSetApi<DeSerializersT> {
    return this.initApi('zsi_Servs_Dealer_GwSetApi', Zsi_Servs_Dealer_GwSetApi);
  }

  get zsi_Pid_Root_Pv_InfoSetApi(): Zsi_Pid_Root_Pv_InfoSetApi<DeSerializersT> {
    const api = this.initApi(
      'zsi_Pid_Root_Pv_InfoSetApi',
      Zsi_Pid_Root_Pv_InfoSetApi
    );
    const linkedApis = [
      this.initApi(
        'zsi_Servs_Annual_VolumesSetApi',
        Zsi_Servs_Annual_VolumesSetApi
      ),
      this.initApi('zsi_Servs_Pv_NonoilSetApi', Zsi_Servs_Pv_NonoilSetApi)
    ];
    api._addNavigationProperties(linkedApis);
    return api;
  }

  get domainListSetApi(): DomainListSetApi<DeSerializersT> {
    return this.initApi('domainListSetApi', DomainListSetApi);
  }

  get batch(): typeof batch {
    return batch;
  }

  get changeset(): typeof changeset {
    return changeset;
  }
}
