const LOG = cds.log('KupitO2PSrv');
const { convertCurrency } = require('../external/modules/ConvertCurrency');
const moment = require('moment');
const { getEnvParam } = require('./Utils');

sICurr="EUR", sIAmount="0", sOCurr="USD"

async function convertAmount(sICurr="EUR", sIAmount="0", sOCurr="USD"){

    let amountCurrencySetApi = convertCurrency().amountCurrencySetApi;
    let tmpDate = null;
    tmpDate = new Date();
    tmpDate = moment(tmpDate);

    let destination = getEnvParam("DESTINATION", false);
    try {
        let response = await amountCurrencySetApi.requestBuilder().create(
                    amountCurrencySetApi.entityBuilder()
                    .date(tmpDate)
                    .localCurrency(sOCurr)
                    .foreignCurrency(sICurr)
                    .foreignAmount(sIAmount)
                    .typeOfRate('Q')
                    //.dateExchangeRate(this.#mDate) //OUTPUT
                    .build()).execute({ destinationName: destination });

        return response;
    } catch (error) {
        iRequest.error(450, error.message, null, 450);
        LOG.error(error.message);
        return iRequest;
    }    

}

module.exports = {
    convertAmount
}