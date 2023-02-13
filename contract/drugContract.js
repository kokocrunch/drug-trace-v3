'use strict';

const { Contract } = require('fabric-contract-api');

class DrugContract extends Contract {
	async InitLedger(ctx) {
		console.info('############ Initializing ledger ############');
		const drugs = [
			{
				distributor: 'Alman Pharmaceuticals Incorporated',
				distributorId: 'API',
				manufacturer: 'Sample Manufacturer',
				description: 'Ascorbic Acid 500mg',
				quantity: '10',
				batchNum: 'E5Z67T',
				expiry: '05/28/2023',
				unitPrice: '800',
				availableStock: '10',
				state: 'Distribution',
				owners: []
			},
			{
				distributor: 'Zenaust Pharma Inc.',
				distributorId: 'ZPI',
				manufacturer: 'Sample Manufacturer',
				description: 'Ascorbic Acid 500mg',
				quantity: '5',
				batchNum: 'VG2O4M',
				expiry: '07/18/2024',
				unitPrice: '720',
				availableStock: '5',
				state: 'Distribution',
				owners: []
			},
			{
				distributor: 'Health Asia Pharma Distributor',
				distributorId: 'HAPD',
				manufacturer: 'Sample Manufacturer',
				description: 'Ascorbic Acid 500mg',
				quantity: '8',
				batchNum: '6YSCNN',
				expiry: '02/22/2025',
				unitPrice: '500',
				availableStock: '8',
				state: 'Distribution',
				owners: []
			},
			{
				distributor: 'Alman Pharmaceuticals Incorporated',
				distributorId: 'API',
				manufacturer: 'Sample Manufacturer',
				description: 'Zinc 20mg',
				quantity: '12',
				batchNum: 'PSA89F',
				expiry: '06/07/2024',
				unitPrice: '940',
				availableStock: '12',
				state: 'Distribution',
				owners: []
			},
			{
				distributor: 'Zenaust Pharma Inc.',
				distributorId: 'ZP',
				manufacturer: 'Sample Manufacturer',
				description: 'Cetirizine 5mg',
				quantity: '10',
				batchNum: 'DV5T6E',
				expiry: '09/24/2024',
				unitPrice: '750',
				availableStock: '10',
				state: 'Distribution',
				owners: []
			},
			{
				distributor: 'Melacare Pharma Distributor',
				distributorId: 'MPD',
				manufacturer: 'Sample Manufacturer',
				description: 'Aspirin 300mg',
				quantity: '8',
				batchNum: 'B0BQYC',
				expiry: '11/26/2024',
				unitPrice: '1000',
				availableStock: '8',
				state: 'Recalled',
				owners: []
			},
			{
				distributor: 'EJHL General Pharma Distributor',
				distributorId: 'EGPD',
				manufacturer: 'Sample Manufacturer',
				description: 'Naproxen 500mg',
				quantity: '8',
				batchNum: 'VAXT8H',
				expiry: '07/15/2025',
				unitPrice: '1500',
				availableStock: '8',
				state: 'Recalled',
				owners: []
			},
			{
				distributor: 'Alman Pharmaceuticals Incorporated',
				distributorId: 'API',
				manufacturer: 'Sample Manufacturer',
				description: 'Dipenhydramine 25mg',
				quantity: '15',
				batchNum: '73TSN2',
				expiry: '04/15/2025',
				unitPrice: '680',
				availableStock: '15',
				state: 'Recalled',
				owners: []
			},
		]

		for (let i = 0; i < drugs.length; i++) {
			await ctx.stub.putState(drugs[i].batchNum, Buffer.from(JSON.stringify(drugs[i])));
			console.info('Added batch: ', drugs[i].batchNum);
		}
	}

	// distributor id, distributor, manufacturer, product description, quantity, batch or lot number, expiry date, unit amount
	async addDrug(ctx, data) {
		const request = JSON.parse(data);
		const { batchNum, quantity, distributorId, distributor } = request;

		console.info(`Creating new drug batch ${batchNum}.`);
		// Create individual items of a drug batch
		let ownerArr = [];
		const drugBatch = {
			...request,
			availableStock: quantity,
			state: 'Distribution',
			owners: ownerArr
		};
		await ctx.stub.putState(batchNum, Buffer.from(JSON.stringify(drugBatch)));
		console.info(`Drug batch ${batchNum} has been added to the blockchain.`);
	}

	// batchNum, retailerId, retailer, quantity
	async transferDrug(ctx, data) {
		const request = JSON.parse(data);
		const { batchNum, retailerId, quantity, retailer } = request;
		const drug = await ctx.stub.getState(batchNum);
		const drugBatch = JSON.parse(drug);
		console.info(`Transferring drug batch ${batchNum} to ${retailerId}...`);

		// Add retailer to owners
		const owner = {
			id: retailerId,
			name: retailer,
			qty: quantity
		}
		drugBatch.owners.push(owner);

		const qtyNum = Number(quantity);
		const stockNum = Number(drugBatch.availableStock);
	
		drugBatch.availableStock =  stockNum - qtyNum;
		await ctx.stub.putState(batchNum, Buffer.from(JSON.stringify(drugBatch)));
		console.info(`${quantity} drug batch ${batchNum} has been successfully transferred to ${retailerId}.`);
	}

	async recallDrug(ctx, batchNum) {
		const drug = await ctx.stub.getState(batchNum);
		const drugBatch = JSON.parse(drug);
		drugBatch.state = 'Recalled';
		await ctx.stub.putState(batchNum, Buffer.from(JSON.stringify(drugBatch)));
		console.info(`Drug batch ${batchNum} has been recalled.`);
	}

	/* Query functions */
	async queryBatch(ctx, key) {
		const record = await ctx.stub.getState(key);
		return record.toString();
	}

	async queryDrugHistory(ctx, batchNum) {
		console.info(`Querying transaction history for batch ${batchNum}`);
		let iterator = await ctx.stub.getHistoryForKey(batchNum);
		let results = await this.getAllQueryResults(iterator, true);
		console.info(`Successfully queried transaction history for batch ${batchNum}.`);
		return results;
	}

	async querySelector(ctx, selector) {
		console.info(`Querying list of drugs...`);
		const iterator = await ctx.stub.getQueryResult(selector);
		const results = await this.getAllQueryResults(iterator, false);
		console.info(`Successfully queried list of drugs.`);
		return JSON.stringify(results);
	}

	async getAllQueryResults(iterator, isHistory) {
		let allResults = [];
		let res = await iterator.next();
		while (!res.done) {
			if (res.value && res.value.value.toString()) {
				let jsonRes = {};
				if (isHistory && isHistory === true) {
					console.log('res.value.txid: ', res.value.txId);
					console.log('res.value.timestamp: ', res.value.timestamp);
					jsonRes.TxId = res.value.txId;
					jsonRes.Timestamp = res.value.timestamp;
					jsonRes.Timestamp = new Date((res.value.timestamp.seconds * 1000));
					let ms = res.value.timestamp.nanos / 1000000;
					jsonRes.Timestamp.setMilliseconds(ms);
					try {
						jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
					} catch (err) {
						console.log(err);
						jsonRes.Value = res.value.value.toString('utf8');
					}
				} else {
					console.log(`Key: ${res.value.key}`);
					jsonRes.Key = res.value.key;
					try {
						jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
						console.log(`Value: ${jsonRes.Record}`);
					} catch (err) {
						console.log(err);
						jsonRes.Record = res.value.value.toString('utf8');
					}
				}
				console.log('jsonres: ', jsonRes);
				allResults.push(jsonRes);
			}
			res = await iterator.next();
		}
		iterator.close();
		console.log(JSON.stringify('allResults: ', allResults));
		return allResults;
	}

	/* Other functions */
	async assetExists(ctx, batchNum) {
		console.info(`Checking if drug batch ${batchNum} exists.`);
		let assetState = await ctx.stub.getState(batchNum);
		return assetState && assetState.length > 0;
	}

	async deleteData(ctx, key) {
		await ctx.stub.deleteState(key);
	}
}
module.exports = DrugContract;