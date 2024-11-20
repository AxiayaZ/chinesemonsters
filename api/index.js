import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import monsterRoutes from './routes/monsters.js';

dotenv.config();

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// MongoDB连接配置
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000, // 超时时间设置为15秒
  socketTimeoutMS: 45000, // Socket超时设置为45秒
  dbName: 'monster-encyclopedia' // 指定数据库名称
};

// MongoDB连接
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// 路由
app.use('/api/monsters', monsterRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});