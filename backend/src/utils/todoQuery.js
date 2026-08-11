const ALLOWED_SORT_FIELDS = new Set(['createdDate', 'dueDate', 'priority']);

const SORT_DIRECTIONS = {

  ASC: 1
,
  DESC: -1
};

function coerceBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;
  return undefined;
}

function parseSort(sort) {
  const defaultSort = { createdDate: SORT_DIRECTIONS.DESC };
  if (typeof sort !== 'string' || !sort.trim()) return defaultSort;

  const trimmed = sort.trim();
  const isDesc = trimmed.startsWith('-');
  const field = isDesc ? trimmed.slice(1) : trimmed;
  if (!ALLOWED_SORT_FIELDS.has(field)) return defaultSort;

  return { [field]: isDesc ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC };
}

function buildFilterFromQuery(query = {}) {
  const filter = {};

  if (typeof query.status === 'string' && query.status.trim()) {
    filter.status = query.status.trim();
  }

  if (typeof query.category === 'string' && query.category.trim()) {
    filter.category = query.category.trim();
  }

  if (typeof query.priority === 'string' && query.priority.trim()) {
    filter.priority = query.priority.trim();
  }

  const completed = coerceBoolean(query.completed);
  if (completed !== undefined) {
    filter.completed = completed;
  }

  if (typeof query.q === 'string' && query.q.trim()) {
    const search = query.q.trim();
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  return filter;
}

module.exports = {
  parseSort,
  buildFilterFromQuery
};
