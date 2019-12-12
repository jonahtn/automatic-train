import api from '../api/chargeApi'

let apiData = new api()

var arrCreditCard = ['4000000000009979', '4000000000009995', '4000000000009987', '4100000000000019']
var arrReason = ['stolen_card', 'insufficient_funds', 'lost_card', 'highest_risk_level']
const outcomes = {
    'issuer_declined': "The Charge has been rejected by the credit card issuer. See the reason for why it was declined.",
    'blocked': "The Charge has been blocked, to proceed with it, you need to update and acknowledge the risk.",
    'authorized': "The Charge has been accepted and will be used for settlement.",
    'stolen_card': "The payment has been declined because the card is reported stolen.",
    'insufficient_funds': "The card has insufficient funds to complete the purchase.",
    'lost_card': "The payment has been declined because the card is reported lost.",
    'highest_risk_level': "Reports payments as high risk when we believe they are likely to be fraudulent. Payments of this risk level are blocked by default.",
    'invalid_request_error': "Invalid credit card number",
    'succeeded': "Successful"
}
const amount = 999
const currency = "usd"

fixture`Test Charge API`

test('Functional | [POST] Charge API - Successful Payment ', async (t) => {
    let resp = await apiData.postCharge(4242424242424242, amount, currency)
    await t
        .expect(resp.status).eql(201)
        .expect(resp.data.currency).eql(currency)
        .expect(resp.data.amount).eql(amount)
        .expect(resp.data.outcome.network_status).eql("approved_by_network")
        .expect(resp.data.source.last4).eql("4242")
        .expect(resp.data.status).eql("succeeded")

    let result = {
        CreditCardNumber: 4242424242424242,
        Type: outcomes[resp.data.outcome.type],
        Reason: outcomes[resp.data.status]
    }
    console.log(result)
})

test('Functional | [POST] Charge API - Failed Payment', async (t) => {
    for (var i = 0; i < arrCreditCard.length; i++) {
        let resp = await apiData.postCharge(arrCreditCard[i], amount, currency)
        await t
            .expect(resp.status).eql(201)
            .expect(resp.data.outcome.reason).eql(arrReason[i])

        let result = {
            CreditCardNumber: parseInt(arrCreditCard[i]),
            Type: outcomes[resp.data.outcome.type],
            Reason: outcomes[resp.data.outcome.reason]
        }
        console.log(result)
    }
})

test('Functional | [POST] Charge API - Invalid Credit Card Number', async (t) => {
    let resp = await apiData.postCharge(40000007600000, amount, currency)
    await t
        .expect(resp.status).eql(201)
        .expect(resp.data.error.type).eql('invalid_request_error')

    let result = {
        CreditCardNumber: 40000007600000,
        Type: outcomes[resp.data.error.type]
    }
    console.log(result)
})

test('Functional | [POST] Charge API - Successful Payment with IDR Currency', async (t) => {
    let resp = await apiData.postCharge(4242424242424242, amount, "idr")
    await t
        .expect(resp.status).eql(201)
        .expect(resp.data.currency).eql("idr")
        .expect(resp.data.amount).eql(amount)
        .expect(resp.data.outcome.network_status).eql("approved_by_network")
        .expect(resp.data.source.last4).eql("4242")
        .expect(resp.data.status).eql("succeeded")

    let result = {
        CreditCardNumber: 4242424242424242,
        Type: outcomes[resp.data.outcome.type],
        Reason: outcomes[resp.data.status]
    }
    console.log(result)
})

test('Functional | [POST] Charge API - Payment with Different Amount', async (t) => {
    let resp = await apiData.postCharge(4242424242424242, 100, currency)
    await t
        .expect(resp.status).eql(201)
        .expect(resp.data.currency).eql(currency)
        .expect(resp.data.amount).eql(100)
        .expect(resp.data.outcome.network_status).eql("approved_by_network")
        .expect(resp.data.source.last4).eql("4242")
        .expect(resp.data.status).eql("succeeded")

    let result = {
        CreditCardNumber: 4242424242424242,
        Type: outcomes[resp.data.outcome.type],
        Reason: outcomes[resp.data.status]
    }
    console.log(result)
})

test('Functional | [POST] Charge API - No Currency and Amount in Request Params', async (t) => {
    let resp = await apiData.postCharge(4242424242424242, "", "")
    await t
        .expect(resp.status).eql(201)
        .expect(resp.data.outcome.network_status).eql("declined_by_network")

    let result = {
        CreditCardNumber: 4242424242424242,
        Type: outcomes[resp.data.outcome.type],
        Reason: outcomes[resp.data.status]
    }
    console.log(result)
})