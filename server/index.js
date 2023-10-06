const express = require('express');
const app = express();

const cors = require('cors');
const pool = require('./db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');

const nodemailer = require('nodemailer');

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/users', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM Users');
        res.json(users.rows)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error')
    }
})





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})