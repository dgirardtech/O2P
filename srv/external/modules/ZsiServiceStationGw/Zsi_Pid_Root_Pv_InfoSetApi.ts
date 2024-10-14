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
  defaultDeSerializers,
  DefaultDeSerializers,
  DeSerializers,
  AllFields,
  entityBuilder,
  EntityBuilderType,
  EntityApi,
  FieldBuilder,
  OrderableEdmTypeField,
  Link
} from '@sap-cloud-sdk/odata-v2';
export class Zsi_Pid_Root_Pv_InfoSetApi<
  DeSerializersT extends DeSerializers = DefaultDeSerializers
> implements EntityApi<Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>, DeSerializersT>
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
  ): Zsi_Pid_Root_Pv_InfoSetApi<DeSerializersT> {
    return new Zsi_Pid_Root_Pv_InfoSetApi(deSerializers);
  }

  private navigationPropertyFields!: {
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
  };

  _addNavigationProperties(
    linkedApis: [
      Zsi_Servs_Annual_VolumesSetApi<DeSerializersT>,
      Zsi_Servs_Pv_NonoilSetApi<DeSerializersT>
    ]
  ): this {
    this.navigationPropertyFields = {
      SERV_PID_TO_ANNUAL_VOLUMS: new Link(
        'ServPidToAnnualVolums',
        this,
        linkedApis[0]
      ),
      SERV_PID_TO_PV_NON_OIL: new Link('ServPidToPvNonOil', this, linkedApis[1])
    };
    return this;
  }

  entityConstructor = Zsi_Pid_Root_Pv_InfoSet;

  requestBuilder(): Zsi_Pid_Root_Pv_InfoSetRequestBuilder<DeSerializersT> {
    return new Zsi_Pid_Root_Pv_InfoSetRequestBuilder<DeSerializersT>(this);
  }

  entityBuilder(): EntityBuilderType<
    Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
    DeSerializersT
  > {
    return entityBuilder<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
      DeSerializersT
    >(this);
  }

  customField<NullableT extends boolean = false>(
    fieldName: string,
    isNullable: NullableT = false as NullableT
  ): CustomField<
    Zsi_Pid_Root_Pv_InfoSet<DeSerializersT>,
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
    typeof Zsi_Pid_Root_Pv_InfoSet,
    DeSerializersT
  >;
  get fieldBuilder() {
    if (!this._fieldBuilder) {
      this._fieldBuilder = new FieldBuilder(
        Zsi_Pid_Root_Pv_InfoSet,
        this.deSerializers
      );
    }
    return this._fieldBuilder;
  }

  private _schema?: {
    SERV_SID: OrderableEdmTypeField<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    SALES_ORG: OrderableEdmTypeField<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DISTR_CH: OrderableEdmTypeField<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializers>,
      DeSerializersT,
      'Edm.String',
      false,
      true
    >;
    DIVISION: OrderableEdmTypeField<
      Zsi_Pid_Root_Pv_InfoSet<DeSerializers>,
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
    ALL_FIELDS: AllFields<Zsi_Pid_Root_Pv_InfoSet<DeSerializers>>;
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
        ...this.navigationPropertyFields,
        /**
         *
         * All fields selector.
         */
        ALL_FIELDS: new AllFields('*', Zsi_Pid_Root_Pv_InfoSet)
      };
    }

    return this._schema;
  }
}
