import mongoose from 'mongoose';
import Monster from '../models/Monster.js';
import dotenv from 'dotenv';

dotenv.config();

// 示例数据
const monsterData = [
  {
    name: '九尾狐',
    type: '妖',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9',
    appearance: '形似狐狸，有九条尾巴，毛色金黄',
    distribution: '长安城郊',
    abilities: ['变化', '蛊惑', '吸取精气'],
    description: '上古神兽，千年修炼而成，善于变化和蛊惑人心',
    sources: [
      {
        book: '山海经',
        content: '九尾狐，其状如狐而九尾，其音如婴儿，能食人...'
      },
      {
        book: '搜神记',
        content: '狐者，能化为人，善蛊惑...'
      }
    ],
    location: {
      lat: 34.2655,
      lng: 108.9508
    }
  },
  // 添加更多妖怪数据...
];

// 连接数据库并导入数据
async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 清空现有数据
    await Monster.deleteMany({});
    console.log('Cleared existing data');

    // 导入新数据
    await Monster.insertMany(monsterData);
    console.log('Data imported successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();