'use strict';

import NodeCouchDb from 'node-couchdb';

class CouchDb {
    constructor() {
        this.couch = new NodeCouchDb({
            port: 5984,
            auth: {
                user: 'admin',
                pass: 'adminpw'
            }
        });
        this.dbUsers = 'users';
        this.dbOrders = 'orders';
        this.dbComplaints = 'complaints';
    }

    async createDb() {
        const hasDb = await this.couch.createDatabase(this.dbUsers).then(() => {
            console.log(`Database ${this.dbUsers} has been created for org1.`);
            return false;
        }, err => {
            if (err.code == 'EDBEXISTS') {
                console.log(`Database ${this.dbUsers} already exists`);
                return true;
            }
            else {
                console.log(err);
            }
        });
        await this.couch.createDatabase(this.dbOrders).then(() => {
            console.log(`Database ${this.dbOrders} has been created for org1.`);
        }, err => { console.log((err.code == 'EDBEXISTS') ? `Database ${this.dbOrders} already exists` : err) });
        await this.couch.createDatabase(this.dbComplaints).then(() => {
            console.log(`Database ${this.dbComplaints} has been created for org1.`);
        }, err => { console.log((err.code == 'EDBEXISTS') ? `Database ${this.dbComplaints} already exists` : err) });
        return hasDb;
    }

    async initDb() {
        // users
        await this.couch.insert(this.dbUsers, {
            "_id": "MDMCBA",
            "email": "mdmcba@gmail.com",
            "password": "123",
            "name": "Mercury Drug Makati City Bel-Air",
            "address": "Bel-Air, Makati city",
            "accountType": "Retailer",
            "verified": "yes"
        });
        await this.couch.insert(this.dbUsers, {
            "_id": "MDMCJ",
            "email": "mdmcj@gmail.com",
            "password": "123",
            "name": "Mercury Drug Makati City Jupiter",
            "address": "Jupiter, Makati city",
            "accountType": "Retailer",
            "verified": "yes"
        });
        await this.couch.insert(this.dbUsers, {
            "_id": "SDB",
            "email": "sdb@gmail.com",
            "password": "123",
            "name": "Southstar Drug Boni",
            "address": "Boni, Mandaluyong city",
            "accountType": "Retailer",
            "verified": "yes"
        });
        await this.couch.insert(this.dbUsers, {
            "_id": "TGPBL",
            "email": "tgpbl@gmail.com",
            "password": "123",
            "name": "The Generics Pharmacy Better Living",
            "address": "Better Living Subdv, Paranaque city",
            "accountType": "Retailer",
            "verified": "yes"
        });
        await this.couch.insert(this.dbUsers, {
            "_id": "RPCBH",
            "email": "rpcbh@gmail.com",
            "password": "123",
            "name": "Rose Pharmacy Cebu Bacayan Hills",
            "address": "Bacayan Hills, Cebu city",
            "accountType": "Retailer",
            "verified": "yes"
        });
        await this.couch.insert(this.dbUsers, {
            "_id": "API",
            "email": "api@gmail.com",
            "password": "123",
            "name": "Alman Pharmaceuticals Incorporated",
            "address": "EDSA, Makati city",
            "accountType": "Distributor",
            "verified": "yes"
        });
        await this.couch.insert(this.dbUsers, {
            "_id": "MPD",
            "email": "mpd@gmail.com",
            "password": "123",
            "name": "Melacare Pharma Distributor",
            "address": "Valenzuela city",
            "accountType": "Distributor",
            "verified": "yes"
        });
        await this.couch.insert(this.dbUsers, {
            "_id": "HAPD",
            "email": "hapd@gmail.com",
            "password": "123",
            "name": "Health Asia Pharma Distributor",
            "address": "Las Pinas",
            "accountType": "Distributor",
            "verified": "yes"
        });
        await this.couch.insert(this.dbUsers, {
            "_id": "EGPD",
            "email": "egpd@gmail.com",
            "password": "123",
            "name": "EJHL General Pharma Distributor",
            "address": "Valenzuela city",
            "accountType": "Distributor",
            "verified": "yes"
        });
        await this.couch.insert(this.dbUsers, {
            "_id": "ZPI",
            "email": "zpi@gmail.com",
            "password": "123",
            "name": "Zenaust Pharma Inc.",
            "address": "Chino Roces, Makati city",
            "accountType": "Distributor",
            "verified": "yes"
        });

        // orders
        await this.couch.insert(this.dbOrders, {
            "_id": "7247821589363O",
            "description": "Zinc",
            "distributor": "Alman Pharmaceuticals Incorporated",
            "retailerId": "RPCBH",
            "retailer": "Rose Pharmacy Cebu Bacayan Hills",
            "date": "12/4/2022",
            "time": "11:15:12 AM",
            "orderId": "7247821589363O",
            "status": "Pending"
        });
        await this.couch.insert(this.dbOrders, {
            "_id": "2148546007918O",
            "description": "Ascorbic Acid",
            "distributor": "Alman Pharmaceuticals Incorporated",
            "retailerId": "SDB",
            "retailer": "Southstar Drug Boni",
            "date": "12/12/2022",
            "time": "01:22:39 PM",
            "orderId": "2148546007918O",
            "status": "Pending"
        });
        await this.couch.insert(this.dbOrders, {
            "_id": "5852395472456O",
            "description": "Zinc",
            "distributor": "Alman Pharmaceuticals Incorporated",
            "retailerId": "SDB",
            "retailer": "Southstar Drug Boni",
            "date": "12/4/2022",
            "time": "11:20:05 AM",
            "orderId": "5852395472456O",
            "status": "Pending"
        });

        // complaint
        await this.couch.insert(this.dbComplaints, {
            "_id": "1212456998521C",
            "batchNum": "73TSN2",
            "reason": "Defective",
            "distributor": "Alman Pharmaceuticals Incorporated",
            "retailer": "Southstar Drug Boni",
            "retailerId": "SDB",
            "date": "12/12/2022",
            "time": "08:18:24 PM",
            "complainId": "6191920480851C",
            "response": "None",
            "status": "Open"
        });
        await this.couch.insert(this.dbComplaints, {
            "_id": "1205825446974C",
            "batchNum": "E5Z67T",
            "reason": "Defective",
            "distributor": "Alman Pharmaceuticals Incorporated",
            "retailer": "Southstar Drug Boni",
            "retailerId": "SDB",
            "date": "12/5/2022",
            "time": "02:30:05 PM",
            "complainId": "5482693751884C",
            "response": "Ignored",
            "status": "Closed"
        });
        console.log('Documents have been inserted.');
    }

    async checkLogin(email, password) {
        const match = await this.couch.mango(this.dbUsers, {
            selector: {
                email: {
                    $eq: email
                }
            }
        }).then(({ data, headers, status }) => {
            if (data.docs.length == 0) {
                return 'Email does not exist.';
            }
            else {
                return (data.docs[0].email == email && data.docs[0].password == password) ? true : false;
            }
        }, err => {
            console.log('An error checking login has occurred: ', err);
            process.exit(1);
        });
        return match;
    }

    async checkId(id) {
        let obj = {};
        await this.couch.mango(this.dbUsers, {
            selector: {
                _id: {
                    $eq: id
                }
            }
        }).then(({ data, headers, status }) => {
            if (data.docs.length == 0) {
                obj.exists = false;
            }
            else {
                obj.exists = true;
                obj.datalen = data.docs.length;
            }
        }, err => {
            if (err.code == 'EDOCMISSING') {
                obj.exists = false;
            }
            else {
                console.log('An error checking id has occured: ', err);
                process.exit(1);
            }
        });
        return obj;
    }

    async insertUser(user) {
        const status = await this.couch.insert(this.dbUsers, user).then(({ data, headers, status }) => {
            console.log(`User data has been sucessfully added to the database.`);
            return status;
        }, err => {
            if (err.code == 'EDOCCONFLICT') {
                return 'Email is already in use.';
            }
            console.log('Error in inserting to database.', err);
            process.exit(1);
        });
        return status;
    }

    async insertOrder(data) {
        const status = await this.couch.insert(this.dbOrders, data).then(({ data, headers, status }) => {
            console.log(`Data has been sucessfully added to the database.`);
            return status;
        }, err => {
            console.log('Error inserting data to database.', err);
            process.exit(1);
        });
        return status;
    }

    async insertComplaint(data) {
        const status = await this.couch.insert(this.dbComplaints, data).then(({ data, headers, status }) => {
            console.log(`Data has been sucessfully added to the database.`);
            return status;
        }, err => {
            console.log('Error inserting data to database.', err);
            process.exit(1);
        });
        return status;
    }

    async getId(email) {
        const id = await this.couch.mango(this.dbUsers, {
            selector: {
                email: {
                    $eq: email
                }
            }
        }).then(({ data, headers, status }) => {
            return data.docs[0].userId;
        }, err => {
            console.log('Error getting id from the database.', err);
            process.exit(1);
        });
        return id;
    }

    async getUser(email) {
        const data = await this.couch.mango(this.dbUsers, {
            selector: {
                email: {
                    $eq: email
                }
            }
        }).then(({ data, headers, status }) => {
            return (data.docs.length == 0) ? 'Email does not exist.' : data.docs[0];
        }, err => {
            console.log('Error getting data from database. ', err);
            process.exit(1);
        });
        return data;
    }

    async getDst() {
        const mangoQuery = {
            selector: {
                accountType: {
                    $eq: 'Distributor'
                }
            },
            fields: ['name']
        }
        const data = await this.couch.mango(this.dbUsers, mangoQuery).then(({ data, headers, status }) => {
            const dst = data.docs.map(names => { return names.name});
            return dst;
        }, err => {
            console.log('Error getting distributors.', err);
        })
        return data;
    }

    async getRtl() {
        const mangoQuery = {
            selector: {
                accountType: {
                    $eq: 'Retailer'
                }
            },
            fields: ['_id', 'name']
        }
        const data = await this.couch.mango(this.dbUsers, mangoQuery).then(({ data, headers, status }) => {
            const rtlId = data.docs.map(ids => { return ids._id });
            const rtlName = data.docs.map(names => { return names.name});
            const rtl = {
                id: rtlId,
                name: rtlName
            }
            return rtl;
        }, err => {
            console.log('Error getting retailers.', err);
        })
        return data;
    }

    async getAllOrders_RTL(rtl) {
        const mangoQuery = {
            selector: {
                retailerId: {
                    $eq: rtl
                }
            }
        }
        const data = await this.couch.mango(this.dbOrders, mangoQuery).then(({ data, headers, status }) => {
            return data.docs;
        }, err => {
            console.log('Error getting orders by retailer.', err);
        })
        return data;
    }

    async getAllOrders_DST(dst) {
        const mangoQuery = {
            selector: {
                distributor: {
                    $eq: dst
                }
            }
        }
        const data = await this.couch.mango(this.dbOrders, mangoQuery).then(({ data, headers, status }) => {
            return data.docs;
        }, err => {
            console.log('Error getting orders by distributor.', err);
        })
        return data;
    }

    async getComplaints_DST(dst) {
        const mangoQuery = {
            selector: {
                distributor: {
                    $eq: dst
                }
            }
        }
        const data = await this.couch.mango(this.dbComplaints, mangoQuery).then(({ data, headers, status }) => {
            return data.docs;
        }, err => {
            console.log('Error getting complaints by distributor.', err);
        })
        return data;
    }

    async getComplaints_RTL(rtl) {
        const mangoQuery = {
            selector: {
                retailerId: {
                    $eq: rtl
                }
            }
        }
        const data = await this.couch.mango(this.dbComplaints, mangoQuery).then(({ data, headers, status }) => {
            return data.docs;
        }, err => {
            console.log('Error getting complaints by retailer.', err);
        })
        return data;
    }
    
    async updateUser(user) {
        const status = await this.couch.update(this.dbUsers, {
            _id: user._id,
            _rev: user._rev,
            email: user.email,
            password: user.password,
            name: user.name,
            address: user.address,
            verified: user.verified,
            accountType: user.accountType
        }).then(({ data, headers, status }) => {
            console.log('Data has been successfully updated.');
            return status;
        }, err => {
            console.log('Error updating data to database.', err);
            process.exit(1);
        });
        return status;
    }

    async updateOrder(order) {
        const status = await this.couch.update(this.dbOrders, {
            _id: order._id,
            _rev: order._rev,
            description: order.description,
            distributor: order.distributor,
            retailerId: order.retailerId,
            retailer: order.retailer,
            date: order.date,
            time: order.time,
            orderId: order.orderId,
            status: order.status,
        }).then(({ data, headers, status }) => {
            console.log('Order has been successfully updated.');
        }, err => {
            console.log('Error updating order to database.', err);
            process.exit(1);
        });
        return status;
    }

    async updateComplaint(complaint) {
        const status = await this.couch.update(this.dbComplaints, {
            _id: complaint._id,
            _rev: complaint._rev,
            batchNum: complaint.batchNum,
            reason: complaint.reason,
            distributor: complaint.distributor,
            retailerId: complaint.retailerId,
            retailer: complaint.retailer,
            date: complaint.date,
            time: complaint.time,
            complainId: complaint.orderId,
            status: complaint.status,
            response: complaint.response,
        }).then(({ data, headers, status }) => {
            console.log('Complaint has been successfully updated.');
        }, err => {
            console.log('Error updating complaint to database.', err);
            process.exit(1);
        });
        return status;
    }
    
    async getBatchId(dst) {
        console.log("dst: ", dst);
        const mangoQuery = {
            "selector": {
                "distributor": {
                    "$eq": dst
                },
                "state": {
                    "$eq": "Distribution"
                },
                "availableStock": {
                    "$gt": 0
                }
            }
        }
        const data = await this.couch.mango('mychannel_drugcontract', mangoQuery).then(({data, headers, status}) => {
            const batches = data.docs.map(batch => { return batch.batchNum });
            return batches;
        }, err => {
            console.log('Error getting drug batches. ', err);
        });
        return data;
    }
}
module.exports.CouchDb = CouchDb;