const WebSocket = require('ws');
const prompt = require('prompt-sync')({ sigint: true });

const SERVER_URL = 'ws://192.168.100.120:4000';

let MAX_CONNECTIONS = 10;
let wsArr = [];
var id = "";
var errMsgId = "";
var errMsg = "";
var msg = "";


const connectionNumber = Number(prompt('Enter MAX_CONNECTIONS: '));

if (!isNaN(connectionNumber) && connectionNumber !== 0) {
  MAX_CONNECTIONS = connectionNumber
}



let intervalId = setInterval(() => {
  if (wsArr.length >= MAX_CONNECTIONS) {
    return clearInterval(intervalId);
  }

  const wo = addNewClient();


  wo.ws.on('open', () => { });

  wo.ws.on('close', () => {
    removeClient(wo);
  });

  wo.ws.on('message', (message) => {
    wo.newMsg = message.toString();

    if (msg !== message.toString()) {
      msg = message.toString();
      id = wo.id + "";
    }
  });

  wo.ws.on('error', (error) => {
    errMsg = error.toString();
    errMsgId = wo.id + "";
    wo.newMsg = errMsg
  });
  wsArr.push(wo);
}, 20);

setInterval(() => {
  console.clear()
  console.log("msg from ws id      : " + id);
  console.log("Received MSG        : " + msg);
  // check if all the msg is same 
  console.log("Is all the msg same : " + allSame(wsArr))

  console.log("total ws count  : " + wsArr.length)
  console.log("error MsgId     : " + errMsgId)
  console.log("error Msg       : " + errMsg)
  printCount(wsArr.map((w) => w.newMsg))
}, 10);

function addNewClient() {
  const id = wsArr.length;
  const ws = new WebSocket(SERVER_URL);
  return { id: id, ws: ws, newMsg: "" };
}

function removeClient(wo) {
  wsArr = wsArr.filter((item) => item !== wo);
}

process.on('SIGINT', () => {
  console.log('Closing all connections');
  wsArr.forEach((wo) => wo.ws.close());
  process.exit();
});

function allSame(arr) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].newMsg !== arr[0].newMsg) {
      return false;
    }
  }
  return true;
}

function printCount(arr) {
  const countMap = {};
  for (const item of arr) {
    countMap[item] = countMap[item] ? countMap[item] + 1 : 1;
  }
  for (const [item, count] of Object.entries(countMap)) {
    console.log(`${item} * ${count}`);
  }
}
