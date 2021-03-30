const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const commons = require('./commons');
const router = express.Router();

router.post('/tfa/setup', (req, res) => {
    console.log('DEBUG: Received TFA setup request');

    const secret = speakeasy.generateSecret({
        length: 10,
        name: commons.userObject.uname,
        issuer: '2 factor authentication example'
    });

    var url = speakeasy.otpauthURL({
        secret: secret.base32,
        label: commons.userObject.uname,
        issuer: '2 factor authentication example',
        encoding: 'base32'
    });

    QRCode.toDataURL(url, (err, dataURL) => {
        commons.userObject.tfa = {
            secret: '',
            tempSecret: secret.base32,
            dataURL,
            tfaURL: url
        };

        return res.json({
            message: 'TFA auth needs to be verified.',
            tempSecret: secret.base32,
            dataURL,
            tfaURL: secret.otpauth_url
        });
    })
});

router.get('/tfa/setup', (req, res) => {
    console.log('DEBUG: Received FETCH TFA request');

    res.json(commons.userObject.tfa ? commons.userObject.tfa : null);
});

router.delete('/tfa/setup', (req, res) => {
    console.log('DEBUG: Received DELETE TFA request');

    delete commons.userObject.tfa;

    res.send({
        status: 200,
        message: 'Success'
    });
})

router.post('/tfa/verify', (req, res) => {
    console.log('DEBUF: Received TFA verify request');

    let isVerified = speakeasy.totp.verify({
        secret: commons.userObject.tfa.tempSecret,
        encoding: 'base32',
        token: req.body.token
    });

    if (isVerified) {
        console.log('DEBUG: TFA is verified to be enabled');

        commons.userObject.tfa.secret = commons.userObject.tfa.tempSecret;

        return res.send({
            status: 200,
            message: 'Two-factor auth is enabled successfully.'
        });
    }

    console.log('ERROR: TFA is verified to be wrong.');

    return res.send({
        status: 403,
        message: 'Invalid auth code, verification failed. Please verify the system date and time'
    });
});

module.exports = router;