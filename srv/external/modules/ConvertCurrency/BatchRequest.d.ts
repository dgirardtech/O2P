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
import { ProgramCodeSet, AmountCurrencySet, AfeDetailSet } from './index';
/**
 * Batch builder for operations supported on the ConvertCurrency.
 * @param requests The requests of the batch
 * @returns A request builder for batch.
 */
export declare function batch<DeSerializersT extends DeSerializers>(
  ...requests: Array<
    | ReadConvertCurrencyRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT>;
export declare function batch<DeSerializersT extends DeSerializers>(
  requests: Array<
    | ReadConvertCurrencyRequestBuilder<DeSerializersT>
    | BatchChangeSet<DeSerializersT>
  >
): ODataBatchRequestBuilder<DeSerializersT>;
/**
 * Change set constructor consists of write operations supported on the ConvertCurrency.
 * @param requests The requests of the change set
 * @returns A change set for batch.
 */
export declare function changeset<DeSerializersT extends DeSerializers>(
  ...requests: Array<WriteConvertCurrencyRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT>;
export declare function changeset<DeSerializersT extends DeSerializers>(
  requests: Array<WriteConvertCurrencyRequestBuilder<DeSerializersT>>
): BatchChangeSet<DeSerializersT>;
export declare const defaultConvertCurrencyPath =
  '/sap/opu/odata/sap/ZFA_AFE_COMMON_SRV';
export type ReadConvertCurrencyRequestBuilder<
  DeSerializersT extends DeSerializers
> =
  | GetAllRequestBuilder<ProgramCodeSet<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<AmountCurrencySet<DeSerializersT>, DeSerializersT>
  | GetAllRequestBuilder<AfeDetailSet<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<ProgramCodeSet<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<AmountCurrencySet<DeSerializersT>, DeSerializersT>
  | GetByKeyRequestBuilder<AfeDetailSet<DeSerializersT>, DeSerializersT>;
export type WriteConvertCurrencyRequestBuilder<
  DeSerializersT extends DeSerializers
> =
  | CreateRequestBuilder<ProgramCodeSet<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<ProgramCodeSet<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<ProgramCodeSet<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<AmountCurrencySet<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<AmountCurrencySet<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<AmountCurrencySet<DeSerializersT>, DeSerializersT>
  | CreateRequestBuilder<AfeDetailSet<DeSerializersT>, DeSerializersT>
  | UpdateRequestBuilder<AfeDetailSet<DeSerializersT>, DeSerializersT>
  | DeleteRequestBuilder<AfeDetailSet<DeSerializersT>, DeSerializersT>;
