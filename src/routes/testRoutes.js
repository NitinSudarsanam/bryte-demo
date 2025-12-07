const express = require('express');
const router = express.Router();
const bucket = require('../api/cosmicClient');

router.get('/test', async (req, res) => {
  try {
    const { objects } = await bucket.objects.find({ type: 'image' });
    res.json(objects);
  } catch (err) {
    console.error('Error fetching koala:', err.message);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

module.exports = router;