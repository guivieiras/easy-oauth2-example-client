import easy from 'easy-oauth2'
import express from 'express'
import server from 'http'
import mustacheExpress from 'mustache-express'

const app = express()

app.engine('mst', mustacheExpress())
app.set('view engine', 'mst')
app.set('views', __dirname + '/views')

let easyInstance = new easy(app)

let applications = []
easyInstance.saveApplication = async function(application) {
	applications.push(application)
	console.log(applications)
}

easyInstance.renderAuthorizationView = async function(req, res, next) {
	res.render('main', { oie: 'Batata frita é mt bom' + req.query.teste })
}

easyInstance.initViews()

let serverInstance = server.createServer(app)

serverInstance.listen(3000, () => {
	console.log('listening')
})
