import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

// 示例知识图谱数据
const graphData = [
  {
    book: '山海经',
    monsters: [
      {
        name: '九尾狐',
        relationships: [
          { target: '白狐', type: '同类', description: '形态相似' },
          { target: '狐仙', type: '演化', description: '修炼所成' }
        ]
      }
      // 添加更多关系...
    ]
  }
];

async function seedKnowledgeGraph() {
  const session = driver.session();
  try {
    // 清空现有数据
    await session.run('MATCH (n) DETACH DELETE n');

    // 创建书籍节点
    for (const book of graphData) {
      await session.run(
        'CREATE (b:Book {name: $name})',
        { name: book.book }
      );

      // 创建妖怪节点和关系
      for (const monster of book.monsters) {
        await session.run(
          'MERGE (m:Monster {name: $name})',
          { name: monster.name }
        );

        // 创建书籍和妖怪的关系
        await session.run(
          `MATCH (b:Book {name: $bookName})
           MATCH (m:Monster {name: $monsterName})
           CREATE (b)-[:CONTAINS]->(m)`,
          { bookName: book.book, monsterName: monster.name }
        );

        // 创建妖怪之间的关系
        for (const rel of monster.relationships) {
          await session.run(
            `MATCH (m1:Monster {name: $source})
             MERGE (m2:Monster {name: $target})
             CREATE (m1)-[:${rel.type} {description: $description}]->(m2)`,
            {
              source: monster.name,
              target: rel.target,
              description: rel.description
            }
          );
        }
      }
    }

    console.log('Knowledge graph data imported successfully');
  } catch (error) {
    console.error('Error seeding knowledge graph:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedKnowledgeGraph();