'use strict';

import { GatewayBc } from '../database/gatewayBc';
import { CouchDb } from '../database/couchDb';

export async function add(req, res) {
    const gateway = await GatewayBc.startNetwork();
    await gateway.add(req.body);
    res.status(201).send({
        sucess: true
    });
    return;
}

export async function distribute(req, res) {
    const drugBatch = req.body;
    const gateway = await GatewayBc.startNetwork();

    // Check if batch exists
    // const exists = gateway.exists(batchNum);
    // if (!exists) {
    //     res.status(400).send({
    //         success: false,
    //         error: 'Drug batch does not exist.',
    //     });
    // }

    await gateway.distribute(drugBatch);
    res.status(200).send({
        success: true
    });
    return;
}

export async function recall(req, res) {
    const drugBatch = req.body;
    const { batchNum } = drugBatch;
    const gateway = await GatewayBc.startNetwork();

    // Check if batch exists
    // const exists = gateway.exists(batchNum);
    // if (!exists) {
    //     res.status(400).send({
    //         success: false,
    //         error: 'Drug batch does not exist.',
    //     });
    // }
    await gateway.recall(batchNum);
    res.status(200).send({
        success: true
    });
    return;
}

export async function updateOrder(req, res) {
    const couch = new CouchDb();
    await couch.updateOrder(req.body);
    res.status(200).send({
        success: true
    });
}

export async function getBatch(req, res) {
    const couch = new CouchDb();
    const data = await couch.getBatchId(req.query.distributor);
    res.status(200).send({
        success: true,
        ...data
    });
}

export async function getAllOrders_DST(req, res) {
    const couch = new CouchDb();
    const data = await couch.getAllOrders_DST(req.query.distributor);
    res.status(200).send({
        sucess: true,
        ...data
    });
}

export async function getComplaints_DST(req, res) {
    const couch = new CouchDb();
    const data = await couch.getComplaints_DST(req.query.distributor);
    res.status(200).send({
        sucess: true,
        ...data
    });
}

export async function updateComplaint(req, res) {
    const couch = new CouchDb();
    await couch.updateComplaint(req.body);
    res.status(200).send({
        success: true
    });
}