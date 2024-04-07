const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./db');
const path = require("path");


const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, './blog/build')))

//routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/blog', blogRoutes)


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, './blog/build/index.html'));
})


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log('server is running on port 8080');
})