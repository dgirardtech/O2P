/*
 * Copyright (c) 2024 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
import { Zsi_Servs_Annual_VolumesSet } from './Zsi_Servs_Annual_VolumesSet';
import { Zsi_Servs_Annual_VolumesSetRequestBuilder } from './Zsi_Servs_Annual_VolumesSetRequestBuilder';
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
  OrderableEdmTypeField
} from '@sap-cloud-sdk/odata-v2';
export class Zsi_Servs_Annual_VolumesSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements
    EntityApi<Zsi_Servs_Annual_VolumesSet<DeSerializersT>, DeSerializersT>
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
  ): Zsi_Servs_Annual_VolumesSetApi<DeSerializersT> {
    return new Zsi_Servs_Annual_VolumesSetApi(deSerializers);
  }

  private navigationPropertyFields!: {};

  _addNavigationProperties(linkedApis: []): this {
    this.navigationPropertyFields = {};
    return this;
  }

  entityConstructor = Zsi_Servs_Annual_VolumesSet;

  requestBuilder(): Zsi_Servs_Annual_VolumesSetRequestBuilder<DeSerializersT> {
    return new Zsi_Servs_Annual_VolumesSetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    Zsi_Servs_Annual_VolumesSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<
      Zsi_Servs_Annual_VolumesSet<DeSerializersT>,
      DeSerializersT
    >(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<
    Zsi_Servs_Annual_VolumesSet<DeSerializersT>,
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
    typeof Zsi_Servs_Annual_VolumesSet,
    DeSerializersT
  >;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        Zsi_Servs_Annual_VolumesSet,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    SERV_SID: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SALES_ORG: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DISTR_CH: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIVISION: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    FROM_DATE: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    TO_DATE: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.DateTime',
      false,
      true
    >;
    MAT_GROUP: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    MATERIAL: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    MAT_VOL: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    MAT_YEAR: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    MAT_MONTH: OrderableEdmTypeField<
      Zsi_Servs_Annual_VolumesSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    ALL_FIELDS: AllFields<Zsi_Servs_Annual_VolumesSet<DeSerializers>>;
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
         * Static representation of the {@link fromDate} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        FROM_DATE: fieldBuilder.buildEdmTypeField(
          'FROM_DATE',
          'Edm.DateTime',
          false
        ),
        /**
         * Static representation of the {@link toDate} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        TO_DATE: fieldBuilder.buildEdmTypeField(
          'TO_DATE',
          'Edm.DateTime',
          false
        ),
        /**
         * Static representation of the {@link matGroup} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MAT_GROUP: fieldBuilder.buildEdmTypeField(
          'MAT_GROUP',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link material} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MATERIAL: fieldBuilder.buildEdmTypeField(
          'MATERIAL',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link matVol} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MAT_VOL: fieldBuilder.buildEdmTypeField('MAT_VOL', 'Edm.String', false),
        /**
         * Static representation of the {@link matYear} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MAT_YEAR: fieldBuilder.buildEdmTypeField(
          'MAT_YEAR',
          'Edm.String',
          false
        ),
        /**
         * Static representation of the {@link matMonth} property for query construction.
         * Use to reference this property in query operations such as 'select' in the fluent request API.
         */
        MAT_MONTH: fieldBuilder.buildEdmTypeField(
          'MAT_MONTH',
          'Edm.String',
          false
        ),
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', Zsi_Servs_Annual_VolumesSet)
      };
    }

    return this._schema;
  }
}
