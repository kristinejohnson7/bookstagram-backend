const aws = require("aws-sdk");
const { randomBytes, ...crypto } = require("crypto");
const { promisify } = require("util");
const fs = require("fs");

const region = "us-east-1";
const bucketName = "bookstagram-direct-upload-s3";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const readUploadedFile = (imagePath) => {
  console.log("dirname", __dirname);
  const data = fs.readFileSync(__dirname + "/" + imagePath);
  return data;
};

const deleteUploadedFile = (imagePath) => {
  fs.unlinkSync(__dirname + "/" + imagePath);
};

module.exports = function generateUploadURL(imageName, imagePath, callback) {
  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: readUploadedFile(imagePath),
    Expires: 60,
  };

  s3.upload(params, (error, data) => {
    console.log("data", data);
    console.log(error);
    deleteUploadedFile(imagePath);
    callback(data.Location);
  });
};
