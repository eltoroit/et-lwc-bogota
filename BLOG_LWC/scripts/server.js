require('dotenv').config();
const fs = require('fs')
const path = require('path');
const express = require('express');
const compression = require('compression');

const app = express();
app.use(compression());

const HOST = process.env.HOST || 'localhost'; // eslint-disable-line no-undef
const PORT = process.env.PORT || 3001; // eslint-disable-line no-undef
const DIST_DIR = './dist';

app.use(express.static(DIST_DIR));

app.get('/version', (req, res) => {
    let output = {
        now: new Date(),
        fileTimestamp: fs.statSync(path.resolve(DIST_DIR, 'index.html')).mtime
    }
    let diff = output.now - output.fileTimestamp;

    let dd = Math.floor(diff / 1000 / 60 / 60 / 24);
    diff -= dd * 1000 * 60 * 60 * 24;

    let hh = Math.floor(diff / 1000 / 60 / 60);
    diff -= hh * 1000 * 60 * 60;

    let mm = Math.floor(diff / 1000 / 60);
    diff -= mm * 1000 * 60;

    let ss = Math.floor(diff / 1000);
    diff -= ss * 1000;

    output.age = `${dd} days, ${hh} hours, ${mm} minutes, ${ss} seconds, ${diff} milliseconds ago`;
    res.send(JSON.stringify(output, null, 2));
});
// app.use('*', (req, res) => {
    app.get('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});

app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);
