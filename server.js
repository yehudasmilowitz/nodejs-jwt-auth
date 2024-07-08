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

app.get('/posts', authenticateToken, (req, res) => {
    console.log(req.user);
    res.json(posts.filter(post => post.userName === req.user.name));

})

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
