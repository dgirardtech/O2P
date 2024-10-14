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
  DeSerializers,
  DefaultDeSerializers,
  Time
} from '@sap-cloud-sdk/odata-v2';
import { batch, changeset } from './BatchRequest';
export declare function zsiServiceStationGw<
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
  deSerializers?: Partial<
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
  >
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
>;
declare class ZsiServiceStationGw<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> {
  private apis;
  private deSerializers;
  constructor(deSerializers: DeSerializersT);
  private initApi;
  get zsi_Service_Station_GwSetApi(): Zsi_Service_Station_GwSetApi<DeSerializersT>;
  get zsi_Servs_Contract_Gw_ItemSetApi(): Zsi_Servs_Contract_Gw_ItemSetApi<DeSerializersT>;
  get zsi_Servs_Annual_VolumesSetApi(): Zsi_Servs_Annual_VolumesSetApi<DeSerializersT>;
  get chainListSetApi(): ChainListSetApi<DeSerializersT>;
  get zsi_Servs_Pv_NonoilSetApi(): Zsi_Servs_Pv_NonoilSetApi<DeSerializersT>;
  get zsi_Servs_Address_GwSetApi(): Zsi_Servs_Address_GwSetApi<DeSerializersT>;
  get zsi_Servs_Agent_GwSetApi(): Zsi_Servs_Agent_GwSetApi<DeSerializersT>;
  get zsi_Servs_Dealer_GwSetApi(): Zsi_Servs_Dealer_GwSetApi<DeSerializersT>;
  get zsi_Pid_Root_Pv_InfoSetApi(): Zsi_Pid_Root_Pv_InfoSetApi<DeSerializersT>;
  get domainListSetApi(): DomainListSetApi<DeSerializersT>;
  get batch(): typeof batch;
  get changeset(): typeof changeset;
}
export {};
