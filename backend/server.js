const express = require('express')
import cors from 'cors'
import { join } from 'path'
import { postPizza } from './helpers'

const PORT = process.env.PORT || 9009

const server = express()

server.use(json())

server.use(express.static(join(__dirname, '../dist')))

server.use(cors())

server.post('/api/order', async (req, res) => {
  const { status, data } = await postPizza(req.body)
  res.status(status).json(data)
})

server.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'))
})

server.use((req, res) => {
  res.status(404).json({
    message: `Endpoint [${req.method}] ${req.path} does not exist`,
  })
})

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
