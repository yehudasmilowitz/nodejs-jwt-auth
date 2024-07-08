require('dotenv').config();

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
    {
        userName: 'johndoe',
        title: 'Post 1'
    },
    {
        userName: 'Yehuda',
        title: 'Post 2'
    }
];

const users = [];


app.get('/posts', authenticateToken, (req, res) => {
    console.log(req.user.user.name);
    res.json(posts.filter(post => post.userName === req.user.user.name));

})


app.get('login', (req, res) => {
    // Authenticate user

})


app.get('/users', (req, res) => {
    // Get all users
    res.json(users);
})

app.post('/users', async (req, res) => {
    try {
        //const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = { name: req.body.name, password: hashedPassword };
        users.push(user);
        res.status(201).send();
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
    }
});


app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name);
    if (user == null) {
        return res.status(400).send('Cannot find user');
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken: accessToken });
        }
        else {
            res.send('Not Allowed');
        }
    }
    catch {
        res.status(500).send();
    }
});


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


app.listen(3000)
