'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

class GatewayBc {
    constructor() {
        try {
            this.ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
            this.ccp = JSON.parse(fs.readFileSync(this.ccpPath, 'utf8'));
            this.walletPath = path.join(process.cwd(), 'wallet');
            this.wallet = new Wallets();
            this.identity = null;
        } catch(err) {
            console.error(`Failed to initialize GatewayBc: ${err}`);
            process.exit(1);
        }
        this.utf8Decoder = new TextDecoder();
    }

    async initialize() {
        try {
            this.wallet = await Wallets.newFileSystemWallet(this.walletPath);
            this.identity = await this.wallet.get('pharmanetUser');
            if (!this.identity) {
                console.log('An identity for the user "pharmanetUser" does not exist in the wallet');
                console.log('Run the registerUser.js application before retrying');
                return;
            }
        } catch(err) {
            console.error(`Failed to evaluate wallet transaction: ${err}`);
            process.exit(1);
        }
    }

    static async startNetwork() {
        const network = new GatewayBc();
        await network.initialize();
        return network;
    }

    async initLedger() {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('InitLedger');
            console.log('Ledger has been initialized.');
            await gateway.disconnect();
        } catch (err) {
            console.error(`Failed to submit initLedger: ${err}`);
            process.exit(1);
        }
    }

    async add(batch) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('addDrug', JSON.stringify(batch));
            console.log(`Drug batch ${batch.batchNum} has been added.`);
            await gateway.disconnect();
        } catch(err) {
            console.error(`Failed to submit add transaction: ${err}`);
            process.exit(1);
        }
    }

    async distribute(data) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('transferDrug', JSON.stringify(data));
            await gateway.disconnect();
        } catch(err) {
            console.error(`Failed to submit transfer transaction: ${err}`);
            process.exit(1);
        }
    }

    async recall(batchNum) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            await contract.submitTransaction('recallDrug', batchNum);
            console.log(`Drug batch ${batchNum} has been successfully recalled.`);
            await gateway.disconnect();
        } catch(err) {
            console.error(`Failed to submit recall transaction: ${err}`);
            process.exit(1);
        }
    }

    async queryBatch(batchNum) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            let queryResult = await contract.evaluateTransaction('queryDrugHistory', batchNum);
            let result = JSON.parse(this.utf8Decoder.decode(queryResult));
            console.log('result batch: ', result);

            await gateway.disconnect();

            return result;
        } catch (err) {
            console.error(`Failed to evaluate queryDrugHistory transaction: ${err}`);
            process.exit(1);
        }
    }

    async querySelector(state) {
        try {
            const gateway = new Gateway();
            await gateway.connect(this.ccp, { wallet: this.wallet, identity: 'pharmanetUser', discovery: { enabled: true, asLocalhost: true } });
            const network = await gateway.getNetwork('mychannel');
            const contract = network.getContract('drugcontract');

            let queryResult = await contract.evaluateTransaction('querySelector', state);
            let result = JSON.parse(this.utf8Decoder.decode(queryResult));

            await gateway.disconnect();

            return result;
        } catch(err) {
            console.error(`Failed to evaluate querySelector transaction: ${err}`);
            process.exit(1);
        }
    }
}
module.exports.GatewayBc = GatewayBc;