const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 

const taskRoutes = require('./routes/taskRoutes');
const boardRoutes = require('./routes/boardRoutes'); // <<< YENİ SATIR

dotenv.config();

connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

const PORT = process.env.PORT || 3001;

app.get('/api', (req, res) => {
  res.json({ message: 'ZenFlow API sunucusuna hoş geldiniz!' });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/board', boardRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} üzerinde çalışıyor`);
});