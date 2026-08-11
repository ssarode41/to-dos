const mongoose = require('mongoose');
const Todo = require('../models/Todo');
const { buildTodoFilter } = require('./todoFilters');

class TodoRepository {
  constructor() {
    this.fallbackTodos = [];
    this.fallbackId = 1;
  }

  isDatabaseReady() {
    return mongoose.connection.readyState === 1;
  }

  buildTodo(payload) {
    const now = new Date();
    return {
      _id: `fallback-${this.fallbackId++}`,
      title: payload.title || '',
      description: payload.description || '',
      priority: payload.priority || 'MEDIUM',
      status: payload.status || 'OPEN',
      category: payload.category || 'GENERAL',
      completed: Boolean(payload.completed),
      createdBy: payload.createdBy || 'admin',
      createdDate: now,
      updatedDate: now,
      ...payload
    };
  }

  async list(query = {}) {
    const filter = buildTodoFilter(query || {});

    if (!this.isDatabaseReady()) {
      return this.fallbackTodos
        .filter((todo) => {
          if (filter.title && filter.title.$regex) {
            const needle = String(filter.title.$regex).toLowerCase();
            const haystack = String(todo.title || '').toLowerCase();
            if (!haystack.includes(needle) ) return false;
          }

          const { title, ...rest } = filter;
          return Object.entries(rest).every(([key, value]) => todo[key] === value);
        })
        .sort((left, right) => right.createdDate - left.createdDate);
    }

    return Todo.find(filter).sort({ createdDate: -1 });
  }

  async getById(id) {
    if (!this.isDatabaseReady()) {
      return this.fallbackTodos.find((todo) => todo._id === id) || null;
    }

    return Todo.findById(id);
  }

  async create(payload) {
    if (!this.isDatabaseReady()) {
      const todo = this.buildTodo(payload);
      this.fallbackTodos.unshift(todo);
      return todo;
    }

    const todo = new Todo(payload);
    return todo.save();
  }

  async update(id, payload) {
    if (!this.isDatabaseReady()) {
      const index = this.fallbackTodos.findIndex((todo) => todo._id === id);
      if (index === -1) {
        return null;
      }

      const updatedTodo = {
        ...this.fallbackTodos[index],
        ...payload,
        updatedDate: new Date()
      };
      this.fallbackTodos[index] = updatedTodo;
      return updatedTodo;
    }

    return Todo.findByIdAndUpdate(id, payload, { new: true });
  }

  async delete(id) {
    if (!this.isDatabaseReady()) {
      const index = this.fallbackTodos.findIndex((todo) => todo._id === id);
      if (index === -1) {
        return null;
      }

      const [deletedTodo] = this.fallbackTodos.splice(index, 1);
      return deletedTodo;
    }

    return Todo.findByIdAndDelete(id);
  }

  async complete(id) {
    if (!this.isDatabaseReady()) {
      const index = this.fallbackTodos.findIndex((todo) => todo._id === id);
      if (index === -1) {
        return null;
      }

      const updatedTodo = {
        ...this.fallbackTodos[index],
        completed: true,
        status: 'DONE',
        updatedDate: new Date()
      };
      this.fallbackTodos[index] = updatedTodo;
      return updatedTodo;
    }

    return Todo.findByIdAndUpdate(id, { completed: true, status: 'DONE', updatedDate: new Date() }, { new: true });
  }

  async reopen(id) {
    if (!this.isDatabaseReady()) {
      const index = this.fallbackTodos.findIndex((todo) => todo._id === id);
      if (index === -1) {
        return null;
      }

      const updatedTodo = {
        ...this.fallbackTodos[index],
        completed: false,
        status: 'OPEN',
        updatedDate: new Date()
      };
      this.fallbackTodos[index] = updatedTodo;
      return updatedTodo;
    }

    return Todo.findByIdAndUpdate(id, { completed: false, status: 'OPEN', updatedDate: new Date() }, { new: true });
  }
}

module.exports = new TodoRepository();
