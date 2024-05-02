const express = require('express')
const users_dal = require('../dals/users_dal')

const router = express.Router()

router.get('/', async (request, response) => {
    if (!request.cookies.auth) {
        response.status(200).redirect('./login.html')
        return
    }
    else {
        response.status(200).redirect('./questions.html')
        return
    }
})

router.post('/signup_post', async (request, response) => {
    const { email, password } = request.body
    console.log(request.body);
    const result = await users_dal.insert_user({ email, password })
    if (result.status === "success") {
        response.cookie('auth', `${email}_${result.data.id}`)
        response.status(200).redirect('./questions.html')
    }
    else {
        console.log(result.error);
        response.status(200).redirect('./error_signup.html')
    }
})

router.post('/login_post', async (request, response) => {
    const { email, password } = request.body
    console.log(request.body);
    const result = await users_dal.try_login(email, password)
    if (result.status === "success") {
        response.cookie('auth', `${email}_${result.id}`)
        response.status(200).redirect('./questions.html')
    }
    else {
        response.status(200).redirect(`./error_login.html?error=${result.status}`)
    }
})

module.exports = router