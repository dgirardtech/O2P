"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmountCurrencySetRequestBuilder = void 0;
const odata_v2_1 = require("@sap-cloud-sdk/odata-v2");
/**
 * Request builder class for operations supported on the {@link AmountCurrencySet} entity.
 */
class AmountCurrencySetRequestBuilder extends odata_v2_1.RequestBuilder {
    /**
     * Returns a request builder for querying all `AmountCurrencySet` entities.
     * @returns A request builder for creating requests to retrieve all `AmountCurrencySet` entities.
     */
    getAll() {
        return new odata_v2_1.GetAllRequestBuilder(this.entityApi);
    }
    /**
     * Returns a request builder for creating a `AmountCurrencySet` entity.
     * @param entity The entity to be created
     * @returns A request builder for creating requests that create an entity of type `AmountCurrencySet`.
     */
    create(entity) {
        return new odata_v2_1.CreateRequestBuilder(this.entityApi, entity);
    }
    /**
     * Returns a request builder for retrieving one `AmountCurrencySet` entity based on its keys.
     * @param date Key property. See {@link AmountCurrencySet.date}.
     * @param foreignCurrency Key property. See {@link AmountCurrencySet.foreignCurrency}.
     * @param localCurrency Key property. See {@link AmountCurrencySet.localCurrency}.
     * @returns A request builder for creating requests to retrieve one `AmountCurrencySet` entity based on its keys.
     */
    getByKey(date, foreignCurrency, localCurrency) {
        return new odata_v2_1.GetByKeyRequestBuilder(this.entityApi, {
            Date: date,
            ForeignCurrency: foreignCurrency,
            LocalCurrency: localCurrency
        });
    }
}
exports.AmountCurrencySetRequestBuilder = AmountCurrencySetRequestBuilder;
//# sourceMappingURL=AmountCurrencySetRequestBuilder.js.map