import React, { useState, useEffect } from 'react';
import './App.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

const LOCAL_STORAGE_KEY = 'todos';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) setTodos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([{ id: Date.now(), text: input.trim(), completed: false }, ...todos]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos => todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos => todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-app">
      <h1>To-Do App</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="add-btn">Add</button>
      </form>
      <div className="filters">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <ul className="todo-list">
        {filteredTodos.length === 0 && <li className="empty">No tasks</li>}
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo.id)} className="todo-text">{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)} className="delete-btn">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
