import easy from 'easy-oauth2'
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

let easyInstance = new easy(app)

let devUsers = [
	{
		id: 'dev123',
		username: 'Dev Gui',
		password: bcrypt.hash('abc123', 10)
	}
]
let users = [
	{
		id: 'user123',
		username: 'User Gui',
		password: bcrypt.hash('abc123', 10)
	}
]
const applications = []

const authorizationCodes = []
const accessTokens = []

async function saveApplication({ name, website, logo, redirectURI, devUserId, clientId, clientSecret, clientType }) {
	applications.push({ name, website, logo, redirectURI, devUserId, clientId, clientSecret, clientType })
}

easyInstance.getApplication = async function(clientId) {
	return applications.find(x => x.clientId === clientId)
}

easyInstance.saveAccessToken = async function({
	accessToken,
	accessTokenExpiresOn,
	refreshToken,
	refreshTokenExpiresOn,
	clientId,
	userId,
	scope
}) {
	let token = { accessToken, accessTokenExpiresOn, clientId, refreshToken, refreshTokenExpiresOn, userId, scope }
	accessTokens.push(token)
	return token
}

easyInstance.saveAuthorizationCode = async function({ code, clientId, userId, scope }) {
	authorizationCodes.push({ code, clientId, userId, scope })
}

easyInstance.getAuthorizationCode = async function(clientId, code) {
	return authorizationCodes.find(x => x.code === code && x.clientId === clientId && x.code !== easy.REVOKED_TOKEN)
}

easyInstance.renderAuthorizationView = async function(req, res, next) {
	res.render('main', req.query)
}

easyInstance.getDevUser = async function(devUserId) {
	return devUsers.find(x => x.id === devUserId)
}

easyInstance.getUser = async function(userId) {
	return users.find(x => x.id === userId)
}

easyInstance.getAccessTokenByRefreshToken = async function(clientId, refreshToken) {
	return accessTokens.find(
		x => x.refreshToken === refreshToken && x.clientId === clientId && x.refreshToken !== easy.REVOKED_TOKEN
	)
}

easyInstance.revokeRefreshToken = async function(clientId, refreshToken) {
	let accessToken = await easyInstance.getAccessTokenByRefreshToken(clientId, refreshToken)
	accessToken.refreshToken = easy.REVOKED_TOKEN
}

easyInstance.verifyUsernameAndPassword = async function(username, password) {
	let user = users.find(x => x.username === username)
	let valid = bcrypt.compare(password, user.password)
	return valid ? user.id : undefined
}

easyInstance.revokeAuthorizationCode = async function(clientId, code) {
	let authorizationCode = await easyInstance.getAuthorizationCode(clientId, code)
	authorizationCode.code = easy.REVOKED_TOKEN
}

easyInstance.initViews()

app.get('/register-application', registerApplicationHandler)

async function registerApplicationHandler(req, res, next) {
	//TODO Need to be authenticated
	let { name, logo, redirectURI, userId, website, clientType } = req.body
	await this.registerApplication({ name, logo, redirectURI, userId, website, clientType })
	res.send('Success!')
}

let serverInstance = server.createServer(app)

serverInstance.listen(3000, () => {
	console.log('listening')
})

saveApplication({
	name: 'New Used Media',
	website: 'www.newusedmedia.com',
	logo: 'https://dev.newusedmedia.com/static/media/logo_white.e0ee2117.png',
	redirectURI: 'http://localhost:2000/auth/smash/callback',
	devUserId: 'dev123',
	clientType: 'confidential',
	clientId: 'smash_client_id',
	clientSecret: 'smash_client_secret'
})
