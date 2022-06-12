'use strict'
const fetch = require('node-fetch')
const querystring = require('querystring')


const apiPost = (host, resource, data, accessToken) => {
  const headers = {'Content-Type': 'application/json',
  'Accept': 'application/json'}

  if (accessToken) {
    headers['Authorization'] = 'Bearer ' + accessToken
  }
  let url = host + resource;
  return fetch(url, { method: 'post', headers: headers, 
    body: JSON.stringify(data) })
}

module.exports = { apiPost }