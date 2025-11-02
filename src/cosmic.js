const axios = require('axios');
require('dotenv').config();

const COSMIC_BUCKET_SLUG = process.env.COSMIC_BUCKET_SLUG;
const COSMIC_READ_KEY = process.env.COSMIC_READ_KEY;

console.log('Bucket:', COSMIC_BUCKET_SLUG);
console.log('Read Key:', COSMIC_READ_KEY ? 'Loaded' : 'Missing');

async function getObjects(type) {
  try {
    const res = await axios.get(
      `https://api.cosmicjs.com/v3/buckets/${COSMIC_BUCKET_SLUG}/objects`,
      {
        params: { type },
        headers: {
          Authorization: `Bearer ${COSMIC_READ_KEY}`,
        },
      }
    );
    return res.data.objects;
  } catch (err) {
    console.error('Error fetching Cosmic objects:', err.response?.data || err.message);
    return [];
  }
}

module.exports = { getObjects };