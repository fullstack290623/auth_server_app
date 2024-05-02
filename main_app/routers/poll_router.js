const express = require('express')
const users_dal = require('../dals/users_dal')

const router = express.Router()

router.post('/', async (request, response) => {
    const { answer } = request.body
    const id = request.cookies.auth.split('_')[1]
    console.log('id = ' + id);
    console.log(request.body);

    // insert user's answer into the db
    // user_id, answer_id, answer, question_id
    // +Datetime()

    response.status(200).json({ status: `added to db. user id = ${id} answer = ${answer}` })
})

module.exports = router