'use strict';

import { GatewayBc } from '../database/gatewayBc';

export async function queryBatch(req, res) {
    const gateway = await GatewayBc.startNetwork();

    // Check if batch exists
    // const exists = gateway.exists(req.body.batchNum);
    // if (!exists) {
    //     res.status(400).send({
    //         success: false,
    //         error: 'Drug batch does not exist.',
    //     });
    // }
    const result = await gateway.queryBatch(req.query.batchNum);

    res.status(200).send({
        success: true,
        ...result
    });
    return;
}

export async function queryOwnedDistributor(req, res) {
    const selector = {
        selector: {
            distributorId: req.query.distributorId
        },
        use_index: 'indexQuery'
    };
    const gateway = await GatewayBc.startNetwork();
    const results = await gateway.querySelector(JSON.stringify(selector));
    const resultSet = [];
    for (let i = 0; i < results.length; i++) {
        const value = results[i].Record;
        resultSet.push(value);
    }
    res.status(200).send({
        success: true,
        result: resultSet
    });
    return;
}

export async function queryOwnedRetailer(req, res) {
    const selector = {
        selector: {
            owners: {
                $elemMatch: {
                    id: req.query.retailerId
                }
            }
        },
        use_index: 'indexQuery'
    };
    const gateway = await GatewayBc.startNetwork();
    const results = await gateway.querySelector(JSON.stringify(selector));
    const resultSet = [];
    for (let i = 0; i < results.length; i++) {
        const value = results[i].Record;
        resultSet.push(value);
    }
    res.status(200).send({
        success: true,
        result: resultSet
    });
    return;
}