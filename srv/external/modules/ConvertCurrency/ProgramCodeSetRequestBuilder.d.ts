/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import {
  CreateRequestBuilder,
  DeSerializers,
  DefaultDeSerializers,
  DeserializedType,
  GetAllRequestBuilder,
  GetByKeyRequestBuilder,
  RequestBuilder
} from '@sap-cloud-sdk/odata-v2';
import { ProgramCodeSet } from './ProgramCodeSet';
/**
 * Request builder class for operations supported on the {@link ProgramCodeSet} entity.
 */
export declare class ProgramCodeSetRequestBuilder<
  T extends DeSerializers = DefaultDeSerializers
> extends RequestBuilder<ProgramCodeSet<T>, T> {
  /**
   * Returns a request builder for querying all `ProgramCodeSet` entities.
   * @returns A request builder for creating requests to retrieve all `ProgramCodeSet` entities.
   */
  getAll(): GetAllRequestBuilder<ProgramCodeSet<T>, T>;
  /**
   * Returns a request builder for creating a `ProgramCodeSet` entity.
   * @param entity The entity to be created
   * @returns A request builder for creating requests that create an entity of type `ProgramCodeSet`.
   */
  create(entity: ProgramCodeSet<T>): CreateRequestBuilder<ProgramCodeSet<T>, T>;
  /**
   * Returns a request builder for retrieving one `ProgramCodeSet` entity based on its keys.
   * @param program Key property. See {@link ProgramCodeSet.program}.
   * @param approvalyear Key property. See {@link ProgramCodeSet.approvalyear}.
   * @param position Key property. See {@link ProgramCodeSet.position}.
   * @returns A request builder for creating requests to retrieve one `ProgramCodeSet` entity based on its keys.
   */
  getByKey(
    program: DeserializedType<T, 'Edm.String'>,
    approvalyear: DeserializedType<T, 'Edm.String'>,
    position: DeserializedType<T, 'Edm.String'>
  ): GetByKeyRequestBuilder<ProgramCodeSet<T>, T>;
}
