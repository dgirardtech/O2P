/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  CreateRequestBuilder,
  DeleteRequestBuilder,
  DeSerializers,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  ODataBatchRequestBuilder,
  UpdateRequestBuilder,
  BatchChangeSet
} from '@sap-cloud-sdk/odata-v2';
import { transformVariadicArgumentToArray } from '@sap-cloud-sdk/util';
import {
  Zsi_Service_Station_GwSet,
  Zsi_Servs_Contract_Gw_ItemSet,
  Zsi_Servs_Annual_VolumesSet,
  ChainListSet,
  Zsi_Servs_Pv_NonoilSet,
  Zsi_Servs_Address_GwSet,
  Zsi_Servs_Agent_GwSet,
  Zsi_Servs_Dealer_GwSet,
  Zsi_Pid_Root_Pv_InfoSet,
  DomainListSet
} from './index';

/**
 * Batch builder for operations supported on the ZsiServiceStationGw.
 * @param requests The requests of the batch
 * @returns A request builder for batch.
 */
export function batch<DeSerializersT extends DeSerializers>(
  ...requests: Array<
    | ReadZsiServiceStationGwRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT>;
export function batch<DeSerializersT extends DeSerializers>(
  requests: Array<
    | ReadZsiServiceStationGwRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT>;
export function batch<DeSerializersT extends DeSerializers>(
  first:
    | undefined
    | ReadZsiServiceStationGwRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
    | Array<
        | ReadZsiServiceStationGwRequestBuilder<DeSerializersT>
        | BatchChangeSet<DeSerializersT>
      >,
  ...rest: Array<
    | ReadZsiServiceStationGwRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT> {
  return new ODataBatchRequestBuilder(
    defaultZsiServiceStationGwPath,
    transformVariadicArgumentToArray(first, rest)
  );
}

/**
 * Change set constructor consists of write operations supported on the ZsiServiceStationGw.
 * @param requests The requests of the change set
 * @returns A change set for batch.
 */
export function changeset<DeSerializersT extends DeSerializers>(
  ...requests: Array<WriteZsiServiceStationGwRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT>;
export function changeset<DeSerializersT extends DeSerializers>(
  requests: Array<WriteZsiServiceStationGwRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT>;
export function changeset<DeSerializersT extends DeSerializers>(
  first:
    | undefined
    | WriteZsiServiceStationGwRequestBuilder<DeSerializersT>
    | Array<WriteZsiServiceStationGwRequestBuilder<DeSerializersT>>,
  ...rest: Array<WriteZsiServiceStationGwRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT> {
  return new BatchChangeSet(transformVariadicArgumentToArray(first, rest));
}

export const defaultZsiServiceStationGwPath =
  '/sap/opu/odata/sap/ZSI_SERVICE_STATION_GW_SRV';
export type ReadZsiServiceStationGwRequestBuilder<
  DeSerializersT extends DeSerializers
> =
  | GetAllRequestBuilder<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | GetAllRequestBuilder<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
      DeSerializersT
    >
  | GetAllRequestBuilder<
      Zsi_Servs_Annual_VolumesSet<DeSerializersT>,
      DeSerializersT
    >
  | GetAllRequestBuilder<ChainListSet<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<Zsi_Servs_Pv_NonoilSet<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<
      Zsi_Servs_Address_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | GetAllRequestBuilder<Zsi_Servs_Agent_GwSet<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<Zsi_Servs_Dealer_GwSet<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
      DeSerializersT
    >
  | GetAllRequestBuilder<DomainListSet<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | GetByKeyRequestBuilder<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
      DeSerializersT
    >
  | GetByKeyRequestBuilder<
      Zsi_Servs_Annual_VolumesSet<DeSerializersT>,
      DeSerializersT
    >
  | GetByKeyRequestBuilder<ChainListSet<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<
      Zsi_Servs_Pv_NonoilSet<DeSerializersT>,
      DeSerializersT
    >
  | GetByKeyRequestBuilder<
      Zsi_Servs_Address_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | GetByKeyRequestBuilder<
      Zsi_Servs_Agent_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | GetByKeyRequestBuilder<
      Zsi_Servs_Dealer_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | GetByKeyRequestBuilder<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
      DeSerializersT
    >
  | GetByKeyRequestBuilder<DomainListSet<DeSerializersT>, DeSerializersT>;
export type WriteZsiServiceStationGwRequestBuilder<
  DeSerializersT extends DeSerializers
> =
  | CreateRequestBuilder<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | UpdateRequestBuilder<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | DeleteRequestBuilder<
      Zsi_Service_Station_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | CreateRequestBuilder<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
      DeSerializersT
    >
  | UpdateRequestBuilder<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
      DeSerializersT
    >
  | DeleteRequestBuilder<
      Zsi_Servs_Contract_Gw_ItemSet<DeSerializersT>,
      DeSerializersT
    >
  | CreateRequestBuilder<
      Zsi_Servs_Annual_VolumesSet<DeSerializersT>,
      DeSerializersT
    >
  | UpdateRequestBuilder<
      Zsi_Servs_Annual_VolumesSet<DeSerializersT>,
      DeSerializersT
    >
  | DeleteRequestBuilder<
      Zsi_Servs_Annual_VolumesSet<DeSerializersT>,
      DeSerializersT
    >
  | CreateRequestBuilder<ChainListSet<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<ChainListSet<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<ChainListSet<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<Zsi_Servs_Pv_NonoilSet<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Zsi_Servs_Pv_NonoilSet<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Zsi_Servs_Pv_NonoilSet<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<
      Zsi_Servs_Address_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | UpdateRequestBuilder<
      Zsi_Servs_Address_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | DeleteRequestBuilder<
      Zsi_Servs_Address_GwSet<DeSerializersT>,
      DeSerializersT
    >
  | CreateRequestBuilder<Zsi_Servs_Agent_GwSet<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Zsi_Servs_Agent_GwSet<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Zsi_Servs_Agent_GwSet<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<Zsi_Servs_Dealer_GwSet<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<Zsi_Servs_Dealer_GwSet<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<Zsi_Servs_Dealer_GwSet<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
      DeSerializersT
    >
  | UpdateRequestBuilder<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
      DeSerializersT
    >
  | DeleteRequestBuilder<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
      DeSerializersT
    >
  | CreateRequestBuilder<DomainListSet<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<DomainListSet<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<DomainListSet<DeSerializersT>, DeSerializersT>;
