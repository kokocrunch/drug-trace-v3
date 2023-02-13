# drug-trace-v2

## Blockchain setup
1) Follow Hyperledger Fabric documentation for installation of prerequisites and fabric samples https://hyperledger-fabric.readthedocs.io/en/latest/getting_started.html. Choose the latest version. <br/>
2) Go to **drug-trace-v2/contract** and run this command:
```
npm i
```
3) Change directory to **fabric-samples/test-network**. <br/>
4) Run the following commands:
```
./network.sh up createChannel -ca -s couchdb
./network.sh deployCC -ccn drugcontract -ccp ../../drug-trace-v2/contract -ccl javascript
```

### To clean up the network
Delete the **wallet** folder under **/server** and run this command:
```
./network.sh down
```

## Server setup
From drug-trace-v2:

```
cd server
npm i
npm run dev
```

## Client setup
From drug-trace-v2/server
```
cd client
npm i
npm run serve
```

Website: http://localhost:8080 <br/>
CouchDB: http://localhost:5984/_utils/ <br/>
- User: *admin*
- Pass: *adminpw*

### Notes:
- Server, client, and contract run on separate terminals.
- Use "Ctrl + C" on a specific terminal to stop its environment (not applicable to blockchain).
- To check client webpages individually, stop the server from running.
- Users, orders, and complaints are stored in **drugtrace** database.
- Drug batches are stored in **mychannel_drugcontract** database.
- **ALWAYS** clean up the network after use.
