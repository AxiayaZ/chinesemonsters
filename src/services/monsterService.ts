import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://chinesemonsters.onrender.com/api'
  : 'http://localhost:3000/api';

interface MonsterQuery {
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const getMonsters = async (query: MonsterQuery = {}) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/monsters`, { 
      params: query,
      validateStatus: (status) => status < 500
    });
    return {
      monsters: data.monsters || [],
      totalPages: data.totalPages || 1,
      currentPage: data.currentPage || 1,
      total: data.total || 0
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Error fetching monsters:', error);
    }
    return {
      monsters: [],
      totalPages: 1,
      currentPage: 1,
      total: 0
    };
  }
};

export const getMonsterById = async (id: string) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/monsters/${id}`, {
      validateStatus: (status) => status < 500
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Error fetching monster:', error);
    }
    throw error;
  }
};

export const createMonster = async (monsterData: any) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/monsters`, monsterData, {
      validateStatus: (status) => status < 500
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Error creating monster:', error);
    }
    throw error;
  }
};

export const updateMonster = async (id: string, monsterData: any) => {
  try {
    const { data } = await axios.put(`${API_BASE_URL}/monsters/${id}`, monsterData, {
      validateStatus: (status) => status < 500
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Error updating monster:', error);
    }
    throw error;
  }
};

export const deleteMonster = async (id: string) => {
  try {
    const { data } = await axios.delete(`${API_BASE_URL}/monsters/${id}`, {
      validateStatus: (status) => status < 500
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data || error.message);
    } else {
      console.error('Error deleting monster:', error);
    }
    throw error;
  }
};