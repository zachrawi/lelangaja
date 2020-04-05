const uuid = require('uuid/v4');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:jakarta123@localhost:5432/lelangaja'
;
console.log(process.env.DATABASE_URL);
const client = new Client({
    connectionString: connectionString,
    ssl: process.env.DATABASE_URL ? true : false,
});

client.connect();

exports.addUser = async (user) => {
    user.id = uuid();

    const sql = 'insert into users (id, name, email, password) values ($1, $2, $3, $4)';
    const values = [user.id, user.name, user.email, user.password];

    await client.query(sql, values);
};

exports.doesEmailExists = async (email) => {
    const sql = 'select * from users where email = $1';
    const values = [email];
    let results = await client.query(sql, values);

    console.log(results.rows);
    console.log(results.rows.length);

    return results.rows.length > 0;
};

exports.login = async (email, password) => {
    const sql = 'select * from users where email = $1 and password = $2';
    const values = [email, password];

    let results = await client.query(sql, values);

    if ( results.rows.length > 0) {
        return results.rows[0];
    } else {
        return false;
    }
};

exports.getUser = async (id) => {
    const sql = 'select * from users where id = $1';
    const values = [id];

    let results = await client.query(sql, values);

    if (results.rows.length > 0) {
        return results.rows[0];
    } else {
        return undefined;
    }
};

exports.updateUser = async (id, {name, email, password}) => {
    if ( await exports.getUser(id) ) {
        if ( name ) {
            const sql = 'update users set name = $1 where id = $2';
            const values = [name, id];

            await client.query(sql, values);
        }

        if ( email ) {
            const sql = 'update users set email = $1 where id = $2';
            const values = [email, id];

            await client.query(sql, values);
        }

        if ( password ) {
            const sql = 'update users set password = $1 where id = $2';
            const values = [password, id];

            await client.query(sql, values);
        }

        return true;
    } else {
        return false;
    }
};

exports.getAllUsers = async () => {
    const sql = 'select * from users';

    let results = await client.query(sql);

    return results.rows;
};
