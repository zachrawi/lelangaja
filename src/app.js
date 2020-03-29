const express = require('express');
const path = require('path');
const dbUser = require('./db/user');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json());

app.post('/register', (req, res) => {
    if (req.body.name.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Nama mesti diisi'
        });
    } else if (req.body.email.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Email mesti diisi'
        });
    } else if (req.body.password.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Password mesti diisi'
        });
    } else if (req.body.password2.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Password mesti diketik ulang'
        });
    } else if (req.body.password != req.body.password2) {
        res.send({
            status: 'error',
            message: 'Password yang anda masukkan tidak sama'
        });
    } else if (dbUser.doesEmailExists(req.body.email)) {
        res.send({
            status: 'error',
            message: 'Email sudah pernah digunakan'
        });
    } else {
        const {name, email, password} = req.body;

        dbUser.addUser({
            name: name,
            email: email,
            password: password
        });

        res.send({
            status: 'success'
        });
    }
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || email.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Email mesti diisi'
        });
    } else if (!password || password.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Password mesti diisi'
        });
    } else {
        const user = dbUser.login(email, password);

        if (!user) {
            res.send({
                status: 'error',
                message: 'Email dan atau password yang anda masukan salah'
            });
        } else {
            res.setHeader('Set-Cookie', `id=${user.id}`);
            res.send({
                status: 'success'
            });
        }
    }
});

app.get('/check-login', (req, res) => {
    if (req.headers.cookie && req.headers.cookie.trim().length > 0) {
        const id = req.headers.cookie.split('=')[1];

        let user = dbUser.getUser(id);

        if (user) {
            // jangan mengikutsertakan password
            delete user.password;

            res.send({
                status: 'success',
                user: user,
            });

            return;
        }
    }

    res.send({
        status: 'error',
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
