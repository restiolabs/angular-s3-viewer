const express = require('express')
const app = express();
const cors = require('cors');
const aws = require('./aws');
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/file', (req, res) => {
    aws.getFiles()
    .then(files => {
        res.json({
          bucket: aws.bucketName,
          files: files
        });
    })
});

app.listen(port, () => {
  console.log(`Server listening at port ${port}`)
})
