const express = require('express');
const app = express();
require('dotenv').config();

const testRoutes = require('./routes/testRoutes');
app.use('/api', testRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));