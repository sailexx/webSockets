const express = require('express');
const WebSocket = require('ws');

console.clear()

var clientList = []
const app = express();
var data = "";


const server = app.listen(4000, () => {
    console.log('Server is listening on port 4000');
});

const wss = new WebSocket.Server({ server });

app.use(express.json());

app.get('/api', (req, res) => {
    data = req.query.data;
    if (!data) {
        res.json("failed please pass the query data as https://xxx.xxx?data=XXX")
        return;
    }
    console.log("Received Data: " + data)
    clientList.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data)
        } else {
            clientList = clientList.filter((item) => item != client);
        }
    });
    res.json(data);
});

wss.on('connection', (ws) => {
    clientList.push(ws)
    if(data) ws.send(data)
    console.log('Client connected count: ' + clientList.length);


    ws.on('close', () => {
        clientList = clientList.filter((item) => item != ws);
        console.log('Client disconnected count: ' + clientList.length);

    });
});



