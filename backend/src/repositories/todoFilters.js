function buildTodoFilter({`q, completed, status, category, priority }) {
  const filter = {};

  if (q) {
    filter.title = { $regex: q, $options: 'i' };
  }

  if (typeof completed === 'boolean') {
    filter.completed = completed;
  }

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  if (priority) {
    filter.priority = priority;
  }

  return filter;
}

module.exports = { buildTodoFilter };
