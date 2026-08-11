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

  buildListFilter(query = {}) {
    const filter = {};

    if (query.q) {
      filter.title = { $regex: query.q, $options: 'i' };
    }

    if (typeof query.completed === 'boolean') {
      filter.completed = query.completed;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.category) {
      filter.category = query.category;
    }

    return filter;
  }

  applyFallbackFilter(todos, filter = {}) {
    const normalize = (value) => (value === undefined || value === null ? '' : String(value));

    return todos.filter((todo) => {
      if (filter.title && filter.title.$regex) {
        const pattern = String(filter.title.$regex).toLowerCase();
        const title = normalize(todo.title).toLowerCase();
        if (!title.includes(pattern)) {
          return false;
        }
      }

      if (Object.prototype.hasOwnProperty.call(filter, 'completed')) {
        if (Boolean(todo.completed) !== Boolean(filter.completed)) {
          return false;
        }
      }

      if (filter.priority && normalize(todo.priority) !== normalize(filter.priority)) {
        return false;
      }

      if (filter.category && normalize(todo.category) !== normalize(filter.category)) {
        return false;
      }

      return true;
    });
  }

  toPaginationResult({ items, page, limit, total }) {
    return { items, page, limit, total };
  }

  normalizePagination(query = {}) {
    const hasPagination = query.page !== undefined || query.limit !== undefined;
    if (!hasPagination) {
      return { shouldPaginate: false };
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const normalizedPage = page > 0 ? page : 1;
    const normalizedLimit = limit > 0 ? limit : 10;

    return { shouldPaginate: true, page: normalizedPage, limit: normalizedLimit };
  }

  async list(query = {}) {
    const filter = this.buildListFilter(query);
    const pagination = this.normalizePagination(query);

    if (!this.isDatabaseReady()) {
      const sorted = this.applyFallbackFilter(this.fallbackTodos, filter).sort(
        (left, right) => right.createdDate - left.createdDate
      );

      if (!pagination.shouldPaginate) {
        return sorted;
      }

      const start = (pagination.page - 1) * pagination.limit;
      const items = sorted.slice(start, start + pagination.limit);
      return this.toPaginationResult({
        items,
        page: pagination.page,
        limit: pagination.limit,
        total: sorted.length
      });
    }

    if (!pagination.shouldPaginate) {
      return Todo.find(filter).sort({ createdDate: -1 });
    }

    const skip = (pagination.page - 1) * pagination.limit;
    const [items, total] = await Promise.all([
      Todo.find(filter).sort({ createdDate: -1 }).skip(skip).limit(pagination.limit),
      Todo.countDocuments(filter)
    ]);

    return this.toPaginationResult({
      items,
      page: pagination.page,
      limit: pagination.limit,
      total
    });
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
      const index = this.fallbackDodos.findIndex((todo) => todo._id === id);
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
