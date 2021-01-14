const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helm = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const compression = require('compression');

const videosRouter = require('./routes/videosRouter');

const app = express();

//SECURITY MIDDLEWARES

//HTTP headers security
app.use(helm());

//Body Parser
app.use(express.json({ limit: '12kb' }));

//Configure trust request IPs (only for production)
//(only IPs added in environment variables file can access the API)
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        const host = req.get('host');
        const authIP = process.env.AUTHORIZE_IP;
        const arrayIPs = authIP.split(',');
        const result = arrayIPs.indexOf(host);

        if (result == -1) {
            return res.status(403).json({
                status: 403,
                statusText: 'Forbidden',
                message: 'Acces denied',
            });
        }

        next();
    });
}

//Request rate limmit ( security vs brute force attacks)
//Config for max of 50 request in 1 h (security)
const limmiter = rateLimit({
    max: 50,
    windowMs: 60 * 60 * 1000,
    message: 'Exceeded request amount for this IP. Please try again later in an hour.',
});
app.use('/api', limmiter);

//Data sanitation vs NoSQL query injections. (security)
//for the type of this project (it is a test only), this APi has no DB, but it is something unusual ... )
app.use(mongoSanitize());

//Data sanitation vs malicious HTML code. (security)
app.use(xss());

//MIDDLEWARES

//For loggin request in DEV ENV
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//To manage access to the API from other domains
app.use(cors());

//For compression of the ressponses.
app.use(compression());

//ROUTES

//just for test comunication
app.get('/', (req, res) => {
    res.send('Hello from the server!!! 👋');
});

app.use('/api/v1/videos/', videosRouter);

module.exports = app;
