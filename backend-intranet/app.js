const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger_output.json');
app.use(express.json());
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const https = require('https');
const http = require('http').Server(app);
const cron = require('node-cron');
const nocache = require('nocache');
const cors = require('cors');
const fs = require('fs');
const helmet = require("helmet");
const bodyParser = require('body-parser');
const basicAuth = require('./middleware/basic-auth.js');
const { authenticate } = require('./middleware/auth.middleware.js');
require('dotenv').config();


// app.options('/*', cors());

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(function(req, res, next) {
    //Enabling CORS
    // res.header("Access-Control-Allow-Origin", req.headers.origin);
//    res.header("Access-Control-Allow-Origin", "*");
  //  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE");
    //res.setHeader('Access-Control-Allow-Methods', 'Content-Type', 'Authorization');
    //res.header("Access-Control-Allow-Credentials", true);
    //res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '0');
    res.header('Pragma', 'no-cache');
    // res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
    res.header('X-Frame-Options', 'sameorigin');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self';");
    next();
});

const corsOptions = {
  origin: [
    'http://10.104.1.24',
    'http://10.104.1.24:4200',
    'http://localhost:4200'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    originAgentCluster: false
  })
);
app.use(nocache());

app.get("/", (req, res) => {
    res.json({ message: "Japfa Intranet Application Node Api running Succesfully...." });
    res.end();
});
app.use(
  '/intranet-swagger/api-docs',
  (req, res, next) => {
    res.removeHeader('Content-Security-Policy');
    next();
  },
  basicAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      urls: [
        {
          url: 'http://localhost:3000/intranet-swagger/api-docs',
          name: 'Japfa Intranet API'
        }
      ]
    }
  })
);

app.use('/api/master', require('./routes/master.routes'));
app.use('/api/requests', authenticate,require('./routes/request.routes'));
app.use('/api/auth', basicAuth, require('./routes/auth.routes'));
app.use('/api/policy', require('./routes/policy.routes'));
app.use('/api/audit',     require('./routes/car.audit.routes'));
app.use('/api/packaging', require('./routes/packaging.routes'));


app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));

module.exports = app;
