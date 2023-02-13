'use strict';

import { CouchDb } from '../database/couchDb';

export async function order(req, res) {
    const couch = new CouchDb();
    const order = req.body;
    const date = new Date().valueOf();
    const id = date.toString().concat('O');
    order['orderId'] = id;
    order['_id'] = id;

    const status = await couch.insertOrder(order);

    if (status === 201) {
        res.status(200).send({
            success: true
        });
        return;
    }
}

export async function complain(req, res) {
    const couch = new CouchDb();
    const complaint = req.body;
    const date = new Date().valueOf();
    const id = date.toString().concat('C');
    complaint['complainId'] = id;
    complaint['_id'] = id;

    const status = await couch.insertComplaint(complaint);

    if (status === 201) {
        res.status(200).send({
            success: true
        });
        return;
    }
}

export async function getAllOrders_RTL(req, res) {
    const couch = new CouchDb();
    const data = await couch.getAllOrders_RTL(req.query.retailerId);
    res.status(200).send({
        sucess: true,
        ...data
    });
}

export async function getComplaints_RTL(req, res) {
    const couch = new CouchDb();
    const data = await couch.getComplaints_RTL(req.query.retailerId);
    res.status(200).send({
        sucess: true,
        ...data
    });
}