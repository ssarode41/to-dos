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

  async list(options = {}) {
    const { status, priority, category, q, sortBy = 'createdDate', sortOrder = 'desc', page = 1, limit = 20 } = options;
    const sortDir = sortOrder === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;

    if (!this.isDatabaseReady()) {
      let results = [...this.fallbackTodos];
      if (status) results = results.filter((t) => t.status === status);
      if (priority) results = results.filter((t) => t.priority === priority);
      if (category) results = results.filter((t) => t.category === category);
      if (q) {
        const lq = q.toLowerCase();
        results = results.filter((t) => t.title.toLowerCase().includes(lq) || (t.description || '').toLowerCase().includes(lq));
      }
      results.sort((a, b) => {
        const av = a[sortBy] || 0;
        const bv = b[sortBy] || 0;
        return sortDir * (av > bv ? 1 : av < bv ? -1 : 0);
      });
      const total = results.length;
      return { data: results.slice(skip, skip + limit), total };
    }

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];

    const [data, total] = await Promise.all([
      Todo.find(filter).sort({ [sortBy]: sortDir }).skip(skip).limit(limit),
      Todo.countDocuments(filter)
    ]);
    return { data, total };
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
