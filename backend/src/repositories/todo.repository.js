const Todo = require('../models/Todo');

class TodoRepository {
  async list(query = {}) {
    const filter = { ...query };
    return Todo.find(filter).sort({ createdDate: -1 });
  }

  async getById(id) {
    return Todo.findById(id);
  }

  async create(payload) {
    const todo = new Todo(payload);
    return todo.save();
  }

  async update(id, payload) {
    return Todo.findByIdAndUpdate(id, payload, { new: true });
  }

  async delete(id) {
    return Todo.findByIdAndDelete(id);
  }

  async complete(id) {
    return Todo.findByIdAndUpdate(id, { completed: true, status: 'DONE', updatedDate: new Date() }, { new: true });
  }
}

module.exports = new TodoRepository();
