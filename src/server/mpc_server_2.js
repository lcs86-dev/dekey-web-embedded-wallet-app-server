'use strict'
const WebSocketServer = require('ws').Server
const serverName = 'MPC-Server-2'
const port = '8081'

/**
   The decoded jwt claim contents will be available at 
   req.headers['jwt']
   example: 
   {
    uid: 1601957254228,
    op: 'gen',
    data: { dsa: 'ecdsa', curve: 'secp256k1' },
    iat: 1601962469,
    exp: 1601963069
   }
   The origianl encoded jwt is available at 
   req.headers["sec-websocket-protocol"]
   This jwt can be verified by App Server(Front Server)'s mpcKey' public key.
   This verification is optional but availabe for other use cases.

   op_enum = ['sign', 'gen', 'regen', 'derive']
   sign_data  = { pubkey, txhash }
   gen_data = { dsa: 'ecdsa', curve: 'secp256k1', threshold: '2/2' }
   regen_data = { pubkey } 
   derive_data = { pubkey, path }

 */

const datelog = () => {return (new Date()).toLocaleString() + ' '}

const wss = new WebSocketServer({ port: port, clientTracking: true, perMessageDeflate: true },
  ()=>{console.log(datelog() + serverName + ' started on port ' + port)})

wss.on('connection', function connection(ws, req) {
  //console.log(req.headers['jwt'])
  const jwt = JSON.parse(req.headers['jwt'])
  console.log(jwt)
  let msg
  switch (jwt.op) {
    case 'gen':
      msg = { cmd: 'p1-gen-step1', data: ''}
      break
    case 'sign':
      msg = { cmd: 'p1-sign-step1', data: ''}
      break
    case 'derive':
      msg = { cmd: 'p1-derive-step1', data: ''}
      break
    case 'regen':
      msg = { cmd: 'p1-regen-step1', data: ''}
      break
    default:
      msg = { cmd: 'error', data: 'op in mpcToken is missing'}
  }
      
  
  ws.send(JSON.stringify(msg))
  //ws.send(datelog() + 'connected by this user, ' + jwt.uid + '...')
  ws.on('message', (message) => {
    let msg
    let msgParty2
    try {
      msgParty2 = JSON.parse(message)
    } catch(err) {
      msgParty2 = message
    }
    if (!msgParty2.cmd) {
      console.log(msgParty2)
    }
    console.log(msgParty2)
    let [party, op, step] = msgParty2.cmd.split('-')

    switch (op) {
      case 'gen':
        if (step == 'step1') {
          msg = { cmd: 'p1-gen-step2', data: ''}
        }
        else if (step == 'step2') {
          msg = { cmd: 'p1-gen-stepF', data: ''}
        }
        else {
          msg = { cmd: 'error', data: 'step info missing'}
        }
        break
      case 'sign':
        if (step == 'step1') {
          msg = { cmd: 'p1-sign-step2', data: ''}
        }
        else if (step == 'step2') {
          msg = { cmd: 'p1-sign-stepF', data: ''}
        }
        else {
          msg = { cmd: 'error', data: 'step info missing'}
        }
        break
      case 'derive':
        if (step == 'step1') {
          msg = { cmd: 'p1-derive-step2', data: ''}
        }
        else if (step == 'step2') {
          msg = { cmd: 'p1-derive-stepF', data: ''}
        }
        else {
          msg = { cmd: 'error', data: 'step info missing'}
        }
        break
      case 'regen':
        if (step == 'step1') {
          msg = { cmd: 'p1-derive-step2', data: ''}
        }
        else if (step == 'step2') {
          msg = { cmd: 'p1-derive-stepF', data: ''}
        }
        else {
          msg = { cmd: 'error', data: 'step info missing'}
        }
        break
      default: 
        msg = { cmd: 'error', data: 'No or incorrect op specified'}              
    }

    ws.send(JSON.stringify(msg))
    if (msg.cmd ==='error') ws.close()
    console.log(datelog() + 'received from ' + jwt.uid + ': ' +  message)
  })
  ws.on('close', () => {
    console.log('disconnected');
  })
})




