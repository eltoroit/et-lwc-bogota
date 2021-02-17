require('dotenv').config();
const PUBLIC_DIR = './public';
const HOST = process.env.HOST || 'localhost';
const HTTP_PORT = process.env.PORT || 3002;
const HTTPS_PORT = process.env.PORT || 3003;
const isLocalhost = HOST === 'localhost';

const fs = require('fs');
const ejs = require('ejs');
const cors = require('cors');
const path = require('path');
const express = require('express'); const app = express();
const Util = require("./Util"); const util = new Util();
const SF = require("./Salesforce"); const sf = new SF(util);
const API = require("./API"); const api = new API(sf, util);

function createServer() {
    const corsConfig = {
        origin: [
            /\.force\.com$/,
            /\.herokuapp\.com$/,
            "http://localhost:3001"
        ],
        methods: ["GET", "POST"]
    };

    app.set('view engine', 'ejs');
    app.use(express.static('public'));

    // HTTPs
    if (isLocalhost) {
        const serverHTTPS = require('https').createServer({
            key: fs.readFileSync('../BLOG_@ELTOROIT/key.pem'),
            cert: fs.readFileSync('../BLOG_@ELTOROIT/cert.pem')
        }, app);
        serverHTTPS.listen(HTTPS_PORT, () => console.log(`✅ HTTPS Server started: https://${HOST}:${HTTPS_PORT}`));
    }

    // HTTP
    const http = require('http').Server(app);
    http.listen(HTTP_PORT, () => console.log(`✅ HTTP  Server started:  http://${HOST}:${HTTP_PORT}`));

    // Configure Express server
    app.use(express.json());
    app.use(cors(corsConfig));
    app.get('/api/:action', api.handle.bind(api));
    app.post('/api/:action', api.handle.bind(api));
    app.get('/localhost.cer', (req, res) => {
        res.sendFile(path.resolve('../@ELTOROIT/localhost.cer'));
    });
    app.get('/salesforce', (req, res) => {
        let data = {
            SF_LoginServer: process.env.SF_SERVER,
            SF_MyDomain: sf.serverSF
        };
        res.render("index", { data });
    });
}
createServer();