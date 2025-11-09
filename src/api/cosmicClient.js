require('dotenv').config();
const { createBucketClient } = require('@cosmicjs/sdk');

const bucket = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG,
  readKey: process.env.COSMIC_READ_KEY,
  writeKey: process.env.COSMIC_WRITE_KEY
});

module.exports = bucket;