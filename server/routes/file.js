const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const streamifier = require('streamifier');
const fs = require("fs");

router.post('/upload', async(req, res) => {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'reports' });
    let id = new mongoose.mongo.ObjectId();
    console.log(id);
    streamifier.createReadStream(req.file.buffer).pipe(
        bucket.openUploadStreamWithId(id, req.file.originalname)
    );

    res.send({
        data: "RECIEVED"
    })
})

router.get('/download', async(req, res) => {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'reports' });
    bucket.openDownloadStream(new mongoose.Types.ObjectId("6589d33ff9fe041a450b807c")).pipe(res);
})

module.exports = router;