const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRouter = require('./routes/authRouter');
const contactRoutes = require('./routes/contactRoutes');
const listRoutes = require('./routes/listRoutes');
const memberRoutes = require('./routes/memberRoutes');
const teamRouter = require('./routes/teamRouter');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/contacts', contactRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/member', memberRoutes);
app.use('/api/team', teamRouter);


app.get('/', (req,res)=>{
    res.send("WELCOME TO BACKEND");
});

app.get('/api/auth/login', (req,res)=>{
    res.send("WELCOME TO Login Page");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));