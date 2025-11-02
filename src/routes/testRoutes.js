const express = require('express');
const router = express.Router();
const { getObjects } = require('../cosmic');

router.get('/test', async (req, res) => {
  const objects = await getObjects('Posts'); // replace 'posts' with your object type
  res.json(objects);
});

module.exports = router;