const aws = require("aws-sdk");
const { randomBytes, ...crypto } = require("crypto");
const { promisify } = require("util");
const fs = require("fs");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");

const region = "us-east-1";
// const bucketName = "bookstagram-direct-upload-s3";
const bucketName = "new-bookstagram-bucket";
const accessKeyId = process.env.AWS;
const secretAccessKey = process.env.SECRET;

const s3 = new S3Client({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const storage = multerS3({
  s3: s3,
  bucket: bucketName,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString());
  },
});

module.exports = { storage };
