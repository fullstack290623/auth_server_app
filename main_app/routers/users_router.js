const express = require('express')
const users_dal = require('../dals/users_dal')

const router = express.Router()

// --- /api/users
router.get('', async(request, response) => {
    const result = await users_dal.get_all_users()
    // 200 = success
    // 201 created 204 no content
    response.status(200).json(result.data)
})


// ============================================== FIX THIS CODE + TEST

// prefix: /api/users/:id
// example: /api/users/3
router.get('/:id', async (request, response) => {
    const id = request.params.id
    const result = await users_dal.get_user_by_id(id)
    response.status(200).json(result.data ? result.data : {})
})

router.post('', async (request, response) => {
        const new_user = request.body
        const result = await users_dal.insert_user(new_user)
       if (result.status == "success") 
            response.status(201).json({ new_user: result.data, url: `/api/users/${result.data.id}` })
        else
            response.status(result.internal ? 500: 400).json({ status: "Failed to insert new user", error: result.error })
})

router.delete('/:id', async (request, response) => {
    const id = request.params.id
    const result = await users_dal.delete_user(id)
    response.status(200).json({ result: result.data ? "user deleted" : "user not found" })
})

router.delete('/table/users-delete-table', async (request, response) => {
    const result = await users_dal.delete_table()
    response.status(200).json({ status: "table-deleted" })
})

router.post('/table/users-create-table', async (request, response) => {
    const result = await users_dal.create_table()
    if (result.status == "success") 
        response.status(201).json({ status: "table-created" })
    else
        response.status(result.internal? 500 : 400).json({ error: result.error })
})

router.post('/table/users-create5', async (request, response) => {
    const result = await users_dal.insert_users5()
    response.status(201).json({ result: "5 new users created" })
})

module.exports = router