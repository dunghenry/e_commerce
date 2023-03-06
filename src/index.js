const express = require('express');
const rfs = require('rotating-file-stream');
const path = require('path');
const morgan = require('morgan');
const whitelist = ['http://localhost:3000'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';
const accessLogStream = rfs.createStream('pro.log', {
    interval: '2d',
    path: path.join(__dirname, 'logs'),
});
const devLogStream = rfs.createStream('dev.log', {
    interval: '1d',
    path: path.join(__dirname, 'logs'),
});
const app = express();
app.use(
    isProduction
        ? morgan('combined', { stream: accessLogStream })
        : morgan('tiny', { stream: devLogStream }),
);
app.use(cors(corsOptions));
app.use(morgan('combined'));
app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to server',
    });
});
app.all('/*', (req, res) => {
    return res.status(404).json({
        message: `Route not found: ${req.originalUrl}`,
    });
});

app.listen(port, () => {
    console.log('Server listening on http://localhost:%d', port);
});
