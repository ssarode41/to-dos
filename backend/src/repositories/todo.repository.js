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
      completed: Boolean(payload.completed),
      createdBy: payload.createdBy || 'admin',
      createdDate: now,
      updatedDate: now,
      ...payload
    };
  }

  async list(params = {}) {
    const { q, completed, status, page = 1, limit = 20, sort = 'desc' } = params;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = sort === 'asc' ? 1 : -1;

    if (!this.isDatabaseReady()) {
      let results = [...this.fallbackTodos];
      if (q) results = results.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
      if (completed !== undefined) {
        const bool = completed === 'true' || completed === true;
        results = results.filter((t) => t.completed === bool);
      }
      if (status) results = results.filter((t) => t.status === status);
      results.sort((a, b) => sortOrder * (a.createdDate - b.createdDate));
      const total = results.length;
      return { items: results.slice(skip, skip + limitNum), total };
    }

    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (completed !== undefined) filter.completed = completed === 'true' || completed === true;
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Todo.find(filter).sort({ createdDate: sortOrder }).skip(skip).limit(limitNum),
      Todo.countDocuments(filter)
    ]);
    return { items, total };
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

    return Todo.findByIdAndUpdate(id, { ...payload, updatedDate: new Date() }, { new: true });
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
