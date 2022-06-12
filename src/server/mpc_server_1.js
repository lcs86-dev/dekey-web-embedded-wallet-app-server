'use strict'
const WebSocketServer = require('ws').Server
const serverName = 'MPC-Server-1'
const port = '8080'

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
    const jwt = JSON.parse(req.headers['jwt'])
    console.log(datelog() + 'connected by this user, ' + jwt.uid + '...')
    ws.send(datelog() + 'connected by this user, ' + jwt.uid + '...')
  
    ws.on('message', function incoming(message) {
        console.log(datelog() + 'received from ' + jwt.uid + ': ' +  message)
        ws.send(datelog() + 'received from ' + jwt.uid + ': ' +  message)
    })
})

