const express = require('express')
const body_parser = require('body-parser')
const cors = require('cors')
const config = require('config')
const path = require('path')
const cookieParser = require('cookie-parser');
const users_router = require('./routers/users_router')
const page_router = require('./routers/page_router')
const poll_router = require('./routers/poll_router')

const app = express()

app.use(body_parser.json())

app.use(cors())
// request.headers = "cookies: auhcookie='user@email.com'""
// request.cookies
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// the request will pass here each time
app.get('*', (request, response, next) => {
    console.log(request.url);
    if (request.url == "/questions.html") {
        if (!request.cookies.auth) {
            response.status(200).redirect('./login.html')
            return
        }
    }
    if (request.url == "/signup.html") {
        if (request.cookies.auth) {
            response.status(200).redirect('./questions.html')
            return
        }
    }   
    if (request.url == "/login.html") {
        if (request.cookies.auth) {
            response.status(200).redirect('./questions.html')
            return
        }
    }       
    if (request.url == "/logout.html") {
        response.clearCookie('auth')
    }        

    next()
})

app.use(express.static(path.join('.', '/static/')))

app.use('/api/users', users_router)
app.use('', page_router)
app.use('/api/poll', poll_router)

 const server_api = app.listen(config.server.port, () => {
     console.log(`====== express server is running on port ${config.server.port} =======`);
 })

