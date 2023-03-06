'use strict';

import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import jwtConfig from '../config/jwtConfig';
import webConfig from '../config/websiteConfig';
import { CouchDb } from '../database/couchDb';

export async function signUp(req, res) {
    const couch = new CouchDb();
    const userData = req.body;
    const { email, password, name, address } = req.body;

    // Check if all fields complete
    if (!email || !password || !name || !address) {
        res.status(400).send({
            success: false,
            error: "Please fill in all fields.",
        });
        return;
    }

    // Generate unique id using business name initials for batchnum
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');
    let userId = [...name.matchAll(rgx)] || [];
    userId = (
        (userId.shift()?.[1] || '') + (userId.pop()?.[1] || '')
    ).toUpperCase();

    // Check if userId exist, if exist add number at the end
    const idExists = await couch.checkId(userId);
    console.log('idexists: ', idExists);
    let id = '';
    if (idExists.status == true) {
        const num = idExists.datalen + 1;
        id = userId.concat(num.toString());
    }
    else {
        id = userId;
    }

    // Insert user in database
    userData['_id'] = id;
    userData['userId'] = id;
    userData['verified'] = 'no';
    const status = await couch.insertUser(userData);

    if (status === 201) {
        // Email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "pharmanet2022@gmail.com",
                pass: "crkvsgtfaecokkjt",
            }
        });
        let base64 = Buffer.from(email).toString('base64');
        transporter.sendMail({
            from: `"PharmaNet" <pharmanet2022@gmail.com>`,
            to: `${email}`,
            subject: "PharmaNet email confirmation",
            text: `Please confirm your email by clicking the following link: ${webConfig.clientURL}/api/verified/${base64}`,
            html: `Please confirm your email by clicking the following link: ${webConfig.clientURL}/api/verified/${base64}`,
        }).then((info) => {
            console.log('Transporter mail info ', info);
        }).catch(console.error);

        const accessToken = jwt.sign(
            { email, iat: Date.now() / 1000 },
            jwtConfig.secret,
            { expiresIn: jwtConfig.duration }
        );
        res.cookie("auth", accessToken);
        res.status(201).send({
            success: true,
            token: accessToken
        });
        return;
    }
    else {
        res.status(400).send({
            success: false,
            error: status
        });
        return;
    }
}

export async function signIn(req, res) {
    const couch = new CouchDb();
    const { email, password } = req.body;
    console.log('email: ', email, ' password: ', password);

    // Check if all fields contain anything
    if (!email || !password) {
        res.status(400).send({
            success: false,
            error: "Please fill in all fields.",
        });
        return;
    }

    // Check if email and password is correct
    const match = await couch.checkLogin(email, password);
    console.log('match ', match);
    if (!match) {
        res.status(401).send({
            success: false,
            error: 'Email or password is incorrect.'
        });
        return;
    } else if(match == 'Email does not exist.') {
        res.status(401).send({
            success: false,
            error: match
        });
        return;
    }

    // Create and sign authorization cookie
    const account = await couch.getUser(email);
    const accessToken = jwt.sign(
        { email, iat: Date.now() / 1000 },
        jwtConfig.secret,
        { expiresIn: jwtConfig.duration }
    );
    res.cookie("auth", accessToken);
    delete account.password;
    res.status(200).send({
        success: true,
        token: accessToken,
        ...account
    });
}

export async function signOut(req, res) {
    res.clearCookie('auth');
    res.redirect(webConfig.baseUrl + '/api/logout');
}

export async function getUser(req, res) {
    const couch = new CouchDb();
    const data = await couch.getUser(req.body.email);
    res.status(200).send({
        success: true,
        ...data
    })
}

export async function verifyEmail(req, res) {
    const couch = new CouchDb();
    let email = Buffer.from(req.params['verifyCode'], 'base64').toString('utf-8');
    console.log('verif email: ', email);

    const data = await couch.getUser(email);
    if (data.verified != 'yes') {
        data.verified = 'yes';
        await couch.updateUser(data);
        return;
    }
    res.status(200).send({
        success: true,
    });
}

export async function getDst(req, res) {
    const couch = new CouchDb();
    const dst = await couch.getDst();
    res.status(200).send({
        sucess: true,
        ...dst
    });
}

export async function getRtl(req, res) {
    const couch = new CouchDb();
    const rtl = await couch.getRtl();
    res.status(200).send({
        sucess: true,
        ...rtl
    });
}