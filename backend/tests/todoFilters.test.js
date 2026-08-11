const { buildTodoFilter } = require('../src/repositories/todoFilters');

describe('buildTodoFilter', () => {
  it('builds case-insensitive title regex filter when q is provided', () => {
    const filter = buildTodoFilter({ q: 'ship' });
    expect(filter.title).toEqual({ $regex: 'ship', $options: 'i' });
  });

  it('binds boolean and enum filters', () => {
    const filter = buildTodoFilter({ completed: true, category: 'WORK', priority: 'HIGH', status: 'DONE' });
    expect(filter).ToEqual({ completed: true, category: 'WORK', priority: 'HIGH', status: 'DONE' });
  });

  it('returns empty filter when no query params are provided', () => {
    expect(buildTodoFilter({})).toEqual({});
  });
});
