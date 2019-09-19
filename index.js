import express from 'express'
import server from 'http'
import mustacheExpress from 'mustache-express'
import bodyParser from 'body-parser'
import bcrypt from 'bcryptjs'

const app = express()

app.engine('mst', mustacheExpress())
app.set('view engine', 'mst')
app.set('views', __dirname + '/views')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/login', login)

app.get('/auth/smash/callback', callback)

async function login(req, res, next) {
	res.render('login', {
		client_id: 'smash_client_id',
		redirect_uri: 'http://localhost:2000/auth/smash/callback',
		response_type: 'code',
		state: 'batata',
		scope: 'escopo'
	})
}

async function callback(req, res, next) {
	let { param, query, body } = req
	res.send({ param, query, body })
}

let serverInstance = server.createServer(app)
serverInstance.listen(2000, () => {
	console.log('listening')
})
