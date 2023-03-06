'use strict';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import webconfig from './config/websiteConfig';
import { EnrollBc } from './database/enrollBc';
import { CouchDb } from './database/couchDb';
import { GatewayBc } from './database/gatewayBc';
import { parseCookies } from './middleware/cookies';
import routes from './routes/apiRoute';

const enroll = new EnrollBc();
const couch = new CouchDb();

const app = express();
const PORT = webconfig.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(parseCookies);
app.use('/api', routes);


// Handle production
// app.use('/', express.static(__dirname + '/../public'));
// app.get(/.*/, (req, res) => res.sendFile(__dirname + '/../public/index.html'));

enroll.enrollAdmin().then(() => {
	enroll.registerUser().then(() => {
		couch.createDb().then(async exist => {
			app.listen(PORT, () => console.log(`Server started at port: ${PORT}`));
			if (!exist) {
				const gateway = await GatewayBc.startNetwork();
				await gateway.initLedger();
				await couch.initDb();
			}
		});
	});
});