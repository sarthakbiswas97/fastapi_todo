import React, { useState, useEffect } from "react";
import { Todo, TodoCreate, TodoUpdate } from "../types/todo";
import { todoApi } from "../api/todoApi";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<TodoCreate>({
    title: "",
    description: "",
    status: false,
  });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await todoApi.getAllTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      if (err instanceof Error && err.message !== 'Failed to fetch todos') {
        setError("Failed to fetch todos");
        console.error(err);
      }
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await todoApi.createTodo(newTodo);
      setTodos([...todos, created]);
      setNewTodo({ title: "", description: "", status: false });
    } catch (err) {
      setError("Failed to create todo");
      console.error(err);
    }
  };

  const handleUpdateTodo = async (id: string, updates: TodoUpdate) => {
    try {
        // Create a clean update object
        const updateData: TodoUpdate = {};
        
        if (typeof updates.status === 'boolean') {
            updateData.status = updates.status;
        }
        if (updates.title !== undefined) {
            updateData.title = updates.title;
        }
        if (updates.description !== undefined) {
            updateData.description = updates.description;
        }

        await todoApi.updateTodo(id, updateData);
        
        setTodos(prevTodos => 
            prevTodos.map(todo => 
                todo.id === id ? { ...todo, ...updateData } : todo
            )
        );
        await fetchTodos();
        
        setEditingTodo(null);
    } catch (err) {
        console.error('Update error:', err);
        setError(err instanceof Error ? err.message : 'Failed to update todo');
        // Refresh todos to ensure UI is in sync with server
        await fetchTodos();
    }
};

  const handleDeleteTodo = async (id: string) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}

      {/* Create Todo Form */}
      <form onSubmit={handleCreateTodo} className="mb-6">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            placeholder="Title"
            className="border p-2 rounded flex-1"
            required
          />
          <input
            type="text"
            value={newTodo.description || ""}
            onChange={(e) =>
              setNewTodo({ ...newTodo, description: e.target.value })
            }
            placeholder="Description"
            className="border p-2 rounded flex-1"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Todo
          </button>
        </div>
      </form>

      {/* Todo List */}
      <div className="space-y-4">
        {todos.map((todo) => (
          <div key={todo.id} className="border p-4 rounded">
            {editingTodo?.id === todo.id ? (
              // Edit Form
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingTodo.title}
                  onChange={(e) =>
                    setEditingTodo({ ...editingTodo, title: e.target.value })
                  }
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="text"
                  value={editingTodo.description || ""}
                  onChange={(e) =>
                    setEditingTodo({
                      ...editingTodo,
                      description: e.target.value,
                    })
                  }
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={() =>
                    handleUpdateTodo(todo.id, {
                      title: editingTodo.title,
                      description: editingTodo.description,
                      status: editingTodo.status,
                    })
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingTodo(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              // Display Todo
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{todo.title}</h3>
                  <p className="text-gray-600">{todo.description}</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={todo.status}
                    onChange={() =>
                      handleUpdateTodo(todo.id, {
                        status: !todo.status,
                      })
                    }
                    className="mr-2"
                  />
                  <button
                    onClick={() => setEditingTodo(todo)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
