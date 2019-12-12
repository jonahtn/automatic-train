import axios from 'axios'

const getURL = "http://5c171d31bac6090013c89d8d.mockapi.io/charge/"

export default class chargeApi {
    constructor() {
    }

    postCharge(creditCardId, amount, currency) {
        return axios({
            method: 'POST',
            url: getURL + creditCardId,
            data: {
                "amount": amount,
                "currency": currency
            }
        })
    }
}