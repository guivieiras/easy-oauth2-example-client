import easy from 'easy-oauth2'
import express from 'express'
import server from 'http'
import mustacheExpress from 'mustache-express'
import bodyParser from 'body-parser'

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
		username: 'Dev Gui'
	}
]
let users = [
	{
		id: 'user123',
		username: 'User Gui'
	}
]
const applications = [
	{
		name: 'New Used Media',
		website: 'www.newusedmedia.com',
		logo: 'https://dev.newusedmedia.com/static/media/logo_white.e0ee2117.png',
		redirectURI: 'http://localhost:2000/auth/smash/callback',
		devUserId: 'dev123',
		clientID: 'smash_client_id_2338f67542fe119d01c5',
		clientSecret: 'smash_client_secret_944c07d5f5246036c4a2'
	}
]

const authorizationCodes = []
const accessTokens = []

easyInstance.saveApplication = async function({ name, website, logo, redirectURI, devUserId, clientID, clientSecret }) {
	applications.push({ name, website, logo, redirectURI, devUserId, clientID, clientSecret })
}

easyInstance.getApplication = async function(clientID) {
	return applications.find(x => x.clientID === clientID)
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

easyInstance.getAuthorizationCode = async function(code) {
	return authorizationCodes.find(x => x.code === code)
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

easyInstance.initViews()

let serverInstance = server.createServer(app)

serverInstance.listen(3000, () => {
	console.log('listening')
})
