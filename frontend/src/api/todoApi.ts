import { Todo,TodoCreate,TodoUpdate } from "../types/todo";

const API_BASE_URL = 'http://localhost:8000';

export const todoApi = {
  async getAllTodos(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/todos`);
    if (!response.ok) throw new Error('Failed to fetch todos');
    return response.json();
  },

  async createTodo(todo: TodoCreate): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Failed to create todo');
    return response.json();
  },

  async updateTodo(id: string, todo: TodoUpdate): Promise<Todo> {
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Update failed:', errorData);
            throw new Error(`Failed to update todo: ${errorData.detail || 'Unknown error'}`);
        }
        
        return response.json();
    } catch (error) {
        console.error('Update error details:', error);
        throw error;
    }
},

  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete todo');
  },
};