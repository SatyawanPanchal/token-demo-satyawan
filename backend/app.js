require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const users = []; // Temporary in-memory user store

// SECRET for signing JWTs
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Route to register a user
app.post('/api/register', async (req, res) => {
    const { username,admin, password } = req.body;
    console.log('usernam and password recieved are ',username ,"and ", password,admin);
    

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('hashed password',hashedPassword);
    

    // Save user
    users.push({ username,admin, password: hashedPassword });
    
    res.status(201).send({ message: "User registered successfully!" });
});

// Route to login
app.post('/api/login', async (req, res) => {
    const { username,admin, password } = req.body;

    const user = users.find(u => u.username === username);
console.log('details of user we found while login ', user);



    if (!user) {
        return res.status(400).send({ error: "User not found!" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).send({ error: "Invalid credentials!" });
    }

    // Generate JWT
    const token = jwt.sign({ username,admin }, JWT_SECRET, { expiresIn: '1h' });
    console.log('token send through registraion',token);
    
    res.status(200).send({ token });
});

// Protected route
app.get('/api/protected', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: "No token provided!" });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: "Welcome to the protected route!", user: decoded });
    } catch (err) {
        res.status(401).send({ error: "Invalid or expired token!" });
    }
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
