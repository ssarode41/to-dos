import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { useTodos } from '../hooks/useTodos';

jest.mock('../hooks/useTodos', () => ({
  useTodos: jest.fn()
}));

const defaultMock = {
  todos: [{ _id: '1', title: 'Ship release', completed: false, priority: 'HIGH', category: 'WORK' }],
  loading: false,
  error: '',
  addTodo: jest.fn(),
  editTodo: jest.fn(),
  removeTodo: jest.fn(),
  markComplete: jest.fn()
};

describe('Dashboard', () => {
  beforeEach(() => useTodos.mockReturnValue(defaultMock));

  it('renders the dashboard heading and search input', () => {
    render(<Dashboard />);

    expect(screen.getByText('Todo dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Search todos')).toBeInTheDocument();
  });

  it('passes query to useTodos when search changes', () => {
    const { rerender } = render(<Dashboard />);

    expect(useTodos).toHaveBeenCalledWith(expect.objectContaining({ q: '' }));
  });

  it('passes completed=true when filter is done', () => {
    render(<Dashboard />);

    fireEvent.change(screen.getByLabelText('Filter todos'), { target: { value: 'done' } });

    expect(useTodos).toHaveBeenCalledWith(expect.objectContaining({ completed: true }));
  });

  it('shows error message from hook', () => {
    useTodos.mockReturnValue({ ...defaultMock, error: 'Unable to load todos', todos: [] });
    render(<Dashboard />);

    expect(screen.getByText('Unable to load todos')).toBeInTheDocument();
  });
});
