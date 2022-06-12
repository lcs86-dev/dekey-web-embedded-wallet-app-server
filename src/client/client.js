'use strict'
var window //for detecting browser

if (window) { //browser
  var WebSocket = window.WebSocket
  var fetch = window.fetch 
  var db = window.localStorage
  db.__proto__.set = (k, v) => { db.setItem(k, JSON.stringify(v)) }
  db.__proto__.get = (k) => { return JSON.parse(db.getItem(k)) }
} else  { // node
  var WebSocket = require('ws');
  var fetch = require('node-fetch')
  var JSONdb = require('simple-json-db')
  var db = new JSONdb('client-data.json') 
}

const defaultApi = 'http://localhost:9000/api/v1/'
const defaultWs = 'ws://localhost:9000/ws'

const apiPost = (host, resource, data, accessToken) => {
  const headers = { 'Content-Type': 'application/json',
                   'Accept': 'application/json' 
                  }
  if (accessToken) {
    headers['Authorization'] = 'Bearer ' + accessToken
  }
  const url = host + resource;
  return fetch(url, { method: 'post', headers: headers, 
    body: JSON.stringify(data) })
}

const msgHandler = (event, socket) => {
  let msg
  let msgParty1
  try {
    msgParty1 = JSON.parse(event.data)
  } catch(err) {
    msgParty1 = event.data
  }
  if (!msgParty1.cmd) {
    console.log(msgParty2)
  }
  let [party, op, step] = msgParty1.cmd.split('-')
  console.log(step)
  switch (op) {
    case 'gen':
      if (step == 'step1') {
        msg = { cmd: 'p2-gen-step1', data: ''}
      }
      else if (step == 'step2') {
        msg = { cmd: 'p2-gen-step2', data: ''}
      }
      else if (step == 'stepF') {
        msg = { cmd: 'p2-gen-stepF', data: ''}
        socket.close()
      }
      else {
        msg = { cmd: 'error', data: 'step info missing'}
      }
      break
    case 'sign':
        if (step == 'step1') {
            msg = { cmd: 'p2-sign-step1', data: ''}
        }
        else if (step == 'step2') {
            msg = { cmd: 'p2-sign-step2', data: ''}
        }
        else if (step == 'stepF') {
          msg = { cmd: 'p2-sign-stepF', data: ''}
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
            msg = { cmd: 'p1-regen-step2', data: ''}
        }
        else if (step == 'step2') {
            msg = { cmd: 'p1-regen-stepF', data: ''}
        }
        else {
            msg = { cmd: 'error', data: 'step info missing'}
        }
        break
    default: 
        msg = { cmd: 'error', data: 'No or incoreect op specified'}                            
  }
  socket.send(JSON.stringify(msg))
  if (msg.cmd == 'error') socket.close()
  console.log(event.data)
}

const socketRequest = (mpcToken) => {

  const socket = new WebSocket(defaultWs, mpcToken);
  socket.onopen = (event) => {
    console.log('socket opened')
    //socket.send('Hello Server!')
  }
  socket.onmessage = (event) => {
    msgHandler(event, socket)
  }
  socket.onclose = (event) => {
    console.log("WebSocket is closed now.")
  }
  socket.onerror = (event) => {
    console.error("WebSocket error observed:", event)
  }
  return socket
  //socket.send('test message')
}


class User {
  constructor(uid, userData) {
    this.uid = uid
    this.data = userData
    this.accessToken = ''
    this.mpcToken = ''
  }
  static async create(email, password) {
    const api = new ApiClient()
    const { userData, accessToken, mpcToken } = await api.register(email, password)
    userData.password = password
    const uid = userData.uid
    db.set(uid, userData)
    let user = new User(uid, userData)
    user.accessToken = accessToken
    user.mpcToken = mpcToken
    user.api = api
    return user
  }

  static get(uid) {
    const user = new User(uid, db.get(uid))
    user.api = new ApiClient()
    return user
  }

  async login() {
    const accessToken = await this.api.login(this.uid, this.data.password)
    this.accessToken = accessToken
    return this.accessToken
  }

  async genAddress() {
    if (!this.mpcToken) {
      this.mpcToken = await this.api.addressAuthGen(this.accessToken)
    }
  }

  save() {
    db.set(this.uid, this.data)
  }
}

class ApiClient {
  constructor(api) {
    this.api = api || defaultApi
  }
  async register(email, password) {
    try {
      const data = {email, password}
      const res = await apiPost(this.api, 'user/register', data)
      if (res.status === 200) {
        const rjson = await res.json()
        return {
          userData: rjson.user,
          accessToken: rjson.accessToken,
          mpcToken: rjson.mpcToken
        }
      } else {
        console.log(res.status)
        console.log(await res.text())
        return 
      }
    } catch(err) {
      console.log(err)     
    }
  }
  async login(uid, password) {
    try {
      const data = {uid, password}
      const res = await apiPost(this.api, 'user/login', data)
      if (res.status === 200) {
        const rjson = await res.json()
        return rjson.accessToken
      } else {
        console.log(res.status)
        console.log(await res.text())
        return 
      } 
    } catch(err) {
      console.log(err)     
    }
  }

  async addressAuthGen(accessToken) {
    try {
      const data = {}
      const res = await apiPost(this.api, 'address/auth/gen', data, accessToken)
      if (res.status === 200) {
        const rjson = await res.json()
        return rjson.mpcJwt
      } else {
        console.log(res.status)
        console.log(await res.text())
        return 
      } 
    } catch(err) {
      console.log(err)
    }
  }

}