const mongoose = require('mongoose');
const Todo = require('../models/Todo');

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
      dueDate: payload.dueDate || null,
      completed: Boolean(payload.completed),
      createdBy: payload.createdBy || 'admin',
      createdDate: now,
      updatedDate: now,
      ...payload
    };
  }

  _reset() {
    this.fallbackTodos = [];
    this.fallbackId = 1;
  }

  async list(query = {}) {
    const { q, completed, priority, category, page, limit } = query;

    if (!this.isDatabaseReady()) {
      let result = [...this.fallbackTodos];

      if (q) {
        const lower = q.toLowerCase();
        result = result.filter((t) => t.title.toLowerCase().includes(lower));
      }
      if (completed !== undefined) {
        result = result.filter((t) => t.completed === completed);
      }
      if (priority) {
        result = result.filter((t) => t.priority === priority);
      }
      if (category) {
        result = result.filter((t) => t.category === category);
      }

      result.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

      if (page !== undefined && limit !== undefined && limit > 0) {
        const total = result.length;
        const skip = page * limit;
        const items = result.slice(skip, skip + limit);
        return { items, page, limit, total };
      }

      return result;
    }

    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (completed !== undefined) filter.completed = completed;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;

    if (page !== undefined && limit !== undefined && limit > 0) {
      const skip = page * limit;
      const [items, total] = await Promise.all([
        Todo.find(filter).sort({ createdDate: -1 }).skip(skip).limit(limit),
        Todo.countDocuments(filter)
      ]);
      return { items, page, limit, total };
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
}

module.exports = new TodoRepository();
