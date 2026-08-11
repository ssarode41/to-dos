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

  static filterMatches(todo, filter) {
    return Object.entries(filter).every(([key, value]) => {
      if (key === '$or' && Array.isArray(value)) {
        return value.some((clause) => {
          const [field] = Object.keys(clause);
          if (!field) return true;
          const condition = clause[field];
          if (condition && typeof condition.$regex === 'string') {
            const regexp = new RegExp(condition.$regex, condition.$options || 'i');
            return regexp.test(String(todo[field] || ''));
          }
          return true;
        });
      }

      return todo[key] === value;
    });
  }

  static buildComparator(sort) {
    const [field] = Object.keys(sort || {});
    const direction = field ? sort[field] : -1;
    const effectiveField = field || 'createdDate';

    return (left, right) => {
      const leftValue = left[effectiveField];
      const rightValue = right[effectiveField];

      if (leftValue == null && rightValue == null) return 0;
      if (leftValue == null) return 1;
      if (rightValue == null) return -1;

      if (leftValue > rightValue) return direction;
      if (leftValue < rightValue) return -direction;
      return 0;
    };
  }

  async list(options = {}) {
    const { filter = {}, sort = { createdDate: -1 } } = options;

    if (!this.isDatabaseReady()) {
      return this.fallbackTodos
        .filter((todo) => TodoRepository.filterMatches(todo, filter))
        .sort(TodoRepository.buildComparator(sort));
    }

    return Todo.find(filter).sort(sort);
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
      const index = this.fallbackTodos
        .findIndex((todo) => todo._id === id);
      if (index === -1) {
        return null;
      }

      const [deletedTodo] = this.fallbackTodos
        .splice(index, 1);
      return deletedTodo;
    }

    return Todo.findByIdAndDelete(id);
  }

  async complete(id) {
    if (!this.isDatabaseReady()) {
      const index = this.fallbackTodos
        .findIndex((todo) => todo._id === id);
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

    return Todo.findByIdAndUpdate(
      id,
      { completed: true, status: 'DONE', updatedDate: new Date() },
      { new: true }
    );
  }
}

module.exports = new TodoRepository();
