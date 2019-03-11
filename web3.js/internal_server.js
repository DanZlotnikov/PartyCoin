const express = require('express')
const app = express()
const web3_api = require('./web3_api')
const send_pty = require('./send_pty')

app.use((request, response, next) => 
{
  console.log(request.headers)
  next()
})

app.use((request, response, next) => 
{
  request.chance = Math.random()
  next()
})

app.get('/', (request, response) => 
{
  response.json({
    chance: request.chance
  })
})

app.get('/getBalance', async (request, response) => 
{
  var address = request.query.address 
  var balance = await web3_api.getBalance(address)
  response.json({
    balance: balance
  })
})

app.get('/balanceOf', async (request, response) => 
{
  var address = request.query.address 
  var balance = await web3_api.balanceOf(address)
  response.json({
    balance: balance
  })
})


app.get('/totalSupply', async (request, response) => 
{
  var totalSupply = await web3_api.totalSupply()
  response.json({
    totalSupply: totalSupply
  })
})

app.post('/transfer', async (request, response) => 
{
  var address = request.query.address
  var amount = parseInt(request.query.amount)
  send_pty.transferPty(address, amount)
  response.json({
    success: "success"
  })
})


app.listen(3001)