import express from 'express';
import { getMonsterModel } from '../models/Monster.js';

const router = express.Router();

// 获取所有集合的数据
const getAllMonsters = async (query = {}) => {
  const collections = Array.from({ length: 11 }, (_, i) => i + 1);
  const results = await Promise.all(
    collections.map(async (num) => {
      const Monster = getMonsterModel(num);
      return Monster.find(query).lean();
    })
  );
  return results.flat();
};

// 获取妖怪列表
router.get('/', async (req, res) => {
  try {
    const { type, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const allMonsters = await getAllMonsters(query);
    const total = allMonsters.length;
    
    // 手动处理分页
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const monsters = allMonsters.slice(startIndex, endIndex);

    res.json({
      monsters,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    console.error('Error fetching monsters:', error);
    res.status(500).json({ 
      message: '获取数据失败',
      error: error.message 
    });
  }
});

// 获取单个妖怪
router.get('/:id', async (req, res) => {
  try {
    const collections = Array.from({ length: 11 }, (_, i) => i + 1);
    let monster = null;

    // 在所有集合中查找妖怪
    for (const num of collections) {
      const Monster = getMonsterModel(num);
      monster = await Monster.findById(req.params.id).lean();
      if (monster) break;
    }

    if (!monster) {
      return res.status(404).json({ message: '妖怪不存在' });
    }
    res.json(monster);
  } catch (error) {
    console.error('Error fetching monster:', error);
    res.status(500).json({ 
      message: '获取数据失败',
      error: error.message 
    });
  }
});

// 创建新妖怪
router.post('/', async (req, res) => {
  try {
    // 获取最后一个集合的模型
    const Monster = getMonsterModel(11);
    const monster = new Monster(req.body);
    const newMonster = await monster.save();
    res.status(201).json(newMonster);
  } catch (error) {
    console.error('Error creating monster:', error);
    res.status(400).json({ 
      message: '创建失败',
      error: error.message 
    });
  }
});

// 更新妖怪
router.put('/:id', async (req, res) => {
  try {
    const monster = await Monster.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true,
        maxTimeMS: 30000 // 设置查询超时时间为30秒
      }
    );
    if (!monster) {
      return res.status(404).json({ message: '妖怪不存在' });
    }
    res.json(monster);
  } catch (error) {
    console.error('Error updating monster:', error);
    res.status(400).json({ 
      message: '更新失败',
      error: error.message 
    });
  }
});

// 删除妖怪
router.delete('/:id', async (req, res) => {
  try {
    const monster = await Monster.findByIdAndDelete(req.params.id)
      .maxTimeMS(30000); // 设置查询超时时间为30秒
    
    if (!monster) {
      return res.status(404).json({ message: '妖怪不存在' });
    }
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('Error deleting monster:', error);
    res.status(500).json({ 
      message: '删除失败',
      error: error.message 
    });
  }
});

export default router;