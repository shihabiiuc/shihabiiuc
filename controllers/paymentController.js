const Payment = require('../models/Payment')

const paypal = require('paypal-rest-sdk')

exports.payment = function (req, res) {
    //console.log(req.body.price)
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://shihabiiuc.herokuapp.com/success",
            "cancel_url": "https://shihabiiuc.herokuapp.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Landing Page",
                    "sku": "001",
                    "price": req.body.price,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": req.body.price
            },
            "description": "Payment for creating Landing page."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    res.redirect(payment.links[i].href)
                }
            }
        }
    });
}

exports.success = function (req, res) {
    const payerId = req.query.PayerID
    const paymentId = req.query.paymentId

    const execute_payment_json = {
        "payer_id": payerId,
        // "transactions": [{
        //     "amount": {
        //         "currency": "USD",
        //         "total": "20"
        //     }
        // }]
    };


    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            //console.log(JSON.stringify(payment));
            let paymentInfo = JSON.stringify(payment)
            //res.send(paymentInfo)
            res.render('success-payment')
        }
    });
}

exports.cancel = function (req, res) {
    res.render('cancel-payment')
}