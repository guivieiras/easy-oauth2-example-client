import easy from 'easy-oauth2'
import express from 'express'
import server from 'http'
const app = express()


let serverImpl = server.createServer(app)

let server = easy.createServer()
