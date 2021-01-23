const AWS = require('aws-sdk');
const _ = require('lodash');
const awsconfig = require('./config').aws;

const gBucketName = awsconfig.bucket || process.env.S3BUCKET;

AWS.config.update({
    accessKeyId: awsconfig.accessKeyId || process.env.S3KEY,         
    secretAccessKey: awsconfig.secretAccessKey || process.env.S3SECRET,
});
const s3 = new AWS.S3();

async function getAllObjects() {
    var params = {
        Bucket: gBucketName
    }; 
    return s3.listObjectsV2(params).promise();
}

function processNode(object) {
    let isFolder = _.endsWith(object.Key, '/');
    let name = getNameFromKey(object.Key);
    let path = getPathFromKey(object.Key);
  
    let node = {
        ...object,
        Name: name,
        Path: path,
        isFolder: isFolder
    };
  
    return node;
}

function getNameFromKey(key) {
    let t = _.trimEnd(key, '/');
    let i = _.findLastIndex( t, x => x === '/' );
    return _.trim( t.substring(i), '/' );
}

function getPathFromKey(key) {
    let t = _.trimEnd(key, '/');
    let i = _.findLastIndex( t, x => x === '/' );
    t = t.substring(0, i);
    let path = _.split(t, '/');
    if(path[0] === '') path = [];
    return path;
}

async function getFiles() {
    return getAllObjects()
    .then(res => {
        let objects = res.Contents;
        let result = [];
        for(let object of objects) {
            let node = processNode(object);
            result.push(node);
        }
        return result;
    })
}

module.exports = {
    getFiles: getFiles,
    bucketName: gBucketName
}
