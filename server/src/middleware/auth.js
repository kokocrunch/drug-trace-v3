'use strict';

const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const webConfig = require('../config/websiteConfig');
// const { RequestWithEmail } = require('../types');
const { GatewayBc } = require('../database/gatewayBc');

module.exports.authenticate = async (req, res, next) => {
    const { auth } = req.cookies;
    if (auth) {
        jwt.verify(auth, jwtConfig.secret, async (err, signedData) => {
            if (err) {
                console.log('Something is wrong with cookie');
                res.clearCookie('auth');
                res.redirect(webConfig.baseUrl + '/api/login'); 
                return;
            }

            req.email = signedData.email;
            next();
        });
    }
    else {
        res.redirect(webConfig.baseUrl + '/api/login'); 
    }
};

module.exports.distributorCheck = async (req, res, next) => {
    const gateway = new GatewayBc();
    const account = await gateway.getUser(req);
    if (account) {
        const { accountType } = account;
        if (accountType == 'Distributor') {
            next();
        }
        else {
            res.clearCookie('auth');
            res.redirect(webConfig.baseUrl + '/api/login'); 
        }
    }
};

module.exports.retailerCheck = async (req, res, next) => {
    const gateway = new GatewayBc();
    const account = await gateway.getUser(req);
    if (account) {
        const { accountType } = account;
        if (accountType == 'Retailer') {
            next();
        }
        else {
            res.clearCookie('auth');
            res.redirect(webConfig.baseUrl + '/api/login');
        }
    }
};

module.exports.getDST = async (req, res, next) => {
    
};

module.exports.getRTL = async (req, res, next) => {

};