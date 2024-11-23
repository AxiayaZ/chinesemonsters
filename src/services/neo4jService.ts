import neo4j, { Driver, Session } from 'neo4j-driver';

class Neo4jService {
  private driver: Driver;

  constructor() {
    // 修改环境变量获取方式
    const neo4jUri = import.meta.env.VITE_NEO4J_URI;
    const neo4jUser = import.meta.env.VITE_NEO4J_USER;
    const neo4jPassword = import.meta.env.VITE_NEO4J_PASSWORD;

    // 添加调试日志
    console.log('Environment:', import.meta.env.MODE);
    console.log('Neo4j Credentials Available:', {
      hasUri: !!neo4jUri,
      hasUser: !!neo4jUser,
      hasPassword: !!neo4jPassword
    });

    if (!neo4jUri || !neo4jUser || !neo4jPassword) {
      throw new Error('Missing Neo4j credentials. Please check environment variables.');
    }

    this.driver = neo4j.driver(
      neo4jUri,
      neo4j.auth.basic(neo4jUser, neo4jPassword),
      {
        maxConnectionLifetime: 3 * 60 * 60 * 1000,
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 2 * 60 * 1000,
      }
    );
  }

  async getBookKnowledgeGraph(bookTitle: string) {
    const session: Session = this.driver.session();
    try {
      // 修改查询语句以匹配你的数据结构
      const result = await session.run(`
        MATCH (book:Book {title: $bookTitle})
        MATCH (n)-[r]-(m)
        WHERE (n)-[:APPEARS_IN]->(book) OR (m)-[:APPEARS_IN]->(book)
        RETURN DISTINCT n, r, m
      `, { bookTitle });

      // 转换查询结果为前端需要的格式
      const nodes = new Map();
      const links: any[] = [];

      result.records.forEach(record => {
        const source = record.get('n');
        const target = record.get('m');
        const relationship = record.get('r');

        // 添加节点（注意：根据实际的节点属性进行调整）
        if (!nodes.has(source.elementId)) {
          nodes.set(source.elementId, {
            id: source.elementId,
            name: source.properties.name || source.properties.title,
            type: source.labels[0], // 使用节点的标签作为类型
            ...source.properties
          });
        }
        if (!nodes.has(target.elementId)) {
          nodes.set(target.elementId, {
            id: target.elementId,
            name: target.properties.name || target.properties.title,
            type: target.labels[0], // 使用节点的标签作为类型
            ...target.properties
          });
        }

        // 添加关系
        links.push({
          source: source.elementId,
          target: target.elementId,
          type: relationship.type,
          ...relationship.properties
        });
      });

      return {
        nodes: Array.from(nodes.values()),
        links
      };
    } catch (error) {
      console.error('Neo4j query failed:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  // 添加一个新方法来获取所有可用的书籍
  async getAvailableBooks() {
    const session: Session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (b:Book)
        RETURN b.title as title, b.era as era
        ORDER BY b.era
      `);

      return result.records.map(record => ({
        title: record.get('title'),
        era: record.get('era')
      }));
    } catch (error) {
      console.error('Failed to fetch books:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async close() {
    await this.driver.close();
  }

  async testConnection() {
    const session = this.driver.session();
    try {
      await session.run('RETURN 1');
      return true;
    } catch (error) {
      console.error('Neo4j connection test failed:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
}

export default new Neo4jService();