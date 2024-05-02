const knex = require('knex')
const config = require('config')
const bcrypt = require('bcrypt');

const data_base = knex({
    client: 'pg',
    connection: {
        host: config.db_connection.host,
        user: config.db_connection.user,
        password: config.db_connection.password,
        database: config.db_connection.database
    }
})

async function create_table() {
    try {
        const result = await data_base.raw(`CREATE TABLE if not exists users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                CHECK (char_length(password) >= 6)
            );`)
        console.log('create finished successfully');
        return {
            status: "success",
        }
    }
    catch (e) {
        console.log('create failed');
        console.log(e.message);
    }
}

async function insert_users5() {
    // Homework: 
    // change the code to array of json [{email: 'jon.snow@winterfell.com', password: 'LongCl4w'}]
    // run over the array and call user_insert- so all o fthe password will be encrypted
    try {
        `INSERT INTO users (email, password) VALUES ('jon.snow@winterfell.com', 'LongCl4w');
        INSERT INTO users (email, password) VALUES ('daenerys.targaryen@dragonstone.com', 'Dracarys7');
        INSERT INTO users (email, password) VALUES ('tyrion.lannister@casterlyrock.com', 'VineV1ntage');
        INSERT INTO users (email, password) VALUES ('arya.stark@winterfell.com', 'NoOne9');
        INSERT INTO users (email, password) VALUES ('cersei.lannister@kingslanding.com', 'GreenFire');`
            .replaceAll('\n    ', '')
            .split(';')
            .filter(query => query)
            .forEach(async query => { await data_base.raw(query + ';') })
        return {
            status: "success",
        }
    }
    catch (e) {
        console.log('insert 5 failed');
        console.log(e.message);
    }

}

async function get_all_users() {
    // add try catch
    const users = await data_base.raw("select * from users")
    //console.log(users.rows.map(s => `[${s.id}] ${s.name}`));
    return {
        status: "success",
        data: users.rows
    }
}

async function get_user_by_id(id) {
    const users = await data_base.raw(`select * from users where id = ${id}`)
    console.log(`By id = [${users.rows[0].id}] ${users.rows[0].name}`);
    console.log(users.rows[0]);
    return {
        status: "success",
        data: users.rows[0]
    }
}

async function try_login(email, password) {
    const user = await data_base.raw(`select * from users where email LIKE '${email}';`)
    if (user.rowCount > 0) {
        console.log(user.rows[0].password);
        const result = await bcrypt.compare(password, user.rows[0].password)
        if (result)
            return {
                status: "success",
                id: user.rows[0].id
            }
        else
            return {
                status: "wrong_password"
            }
    }
    else
        return {
            status: "user_does_not_exist"
        }
}


async function insert_user(new_user) {
    try {
        delete new_user.id

        // encryption
        const salt = await bcrypt.genSalt();
        new_user.password = await bcrypt.hash(new_user.password, salt);

        const result_ids = await data_base('users').insert(new_user).returning('id');
        //console.log(result_ids[0]);

        const id = result_ids[0].id // the new id
        return {
            status: "success",
            data: { id, ...new_user }
        }
        // url: `/api/users/${id}`
        console.log('insert successed!');
    }
    catch (e) {
        console.log('insert failed!');
        console.log(e);
        return {
            status: "error",
            internal: false,
            error: e.message.replaceAll("\"", "'")
        }
    }
}

async function delete_user(id) {
    const result = await data_base.raw(`DELETE from users where id=${id}`)
    console.log(result.rowCount);
    return {
        status: "success",
        data: result.rowCount
    }
}

async function delete_table() {
    // delete table
    // try catch in case table does not exist
    await data_base.raw(`DROP table if exists users`)
    return {
        status: "success"
    }
}
/*
    CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        order_date DATE NOT NULL,
        user_id INTEGER,
        CONSTRAINT fk_user
            FOREIGN KEY(user_id) 
            REFERENCES users(user_id)
            ON DELETE CASCADE
    );
*/

module.exports = {
    get_all_users, get_user_by_id, insert_user,
    delete_user, delete_table,
    create_table, insert_users5, try_login
}