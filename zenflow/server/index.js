const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 

dotenv.config();

connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

const PORT = process.env.PORT || 3001;

app.get('/api', (req, res) => {
  res.json({ message: 'ZenFlow API sunucusuna hoş geldiniz!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});