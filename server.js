require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./configs/corsOptions');
const { logger } = require('./middlewares/logEvents');
const errorHandler = require('./middlewares/errorHandler');
const verifyJWT = require('./middlewares/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/credentials');
const mongoose = require('mongoose');
const connectDB = require('./configs/dbConn');
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 7580;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//FIle upload
app.use(fileUpload());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/auth', require('./routes/auth'));
app.use('/register', require('./routes/registration'));

app.use('/backend_controller', require('./routes/backendController'));


app.use(verifyJWT);
app.use('/users', require('./routes/user'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
});