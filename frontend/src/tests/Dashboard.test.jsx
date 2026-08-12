import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { useTodos } from '../hooks/useTodos';

jest.mock('../hooks/useTodos', () => ({
  useTodos: jest.fn()
}));

const makeMockHook = (overrides = {}) => ({
  todos: [],
  loading: false,
  error: '',
  addTodo: jest.fn().mockResolvedValue(null),
  editTodo: jest.fn().mockResolvedValue(null),
  removeTodo: jest.fn().mockResolvedValue(true),
  markComplete: jest.fn().mockResolvedValue(null),
  ...overrides
});

describe('Dashboard', () => {
  it('renders the dashboard heading and search input', () => {
    useTodos.mockReturnValue(makeMockHook({
      todos: [{ _id: '1', title: 'Ship release', completed: false, priority: 'HIGH', category: 'WORK' }]
    }));

    render(<Dashboard />);

    expect(screen.getByText('Todo dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Search todos')).toBeInTheDocument();
  });

  it('shows Create todo form by default', () => {
    useTodos.mockReturnValue(makeMockHook());

    render(<Dashboard />);

    expect(screen.getByText('Create todo')).toBeInTheDocument();
  });

  it('switches to edit form when Edit button is clicked', () => {
    useTodos.mockReturnValue(makeMockHook({
      todos: [{ _id: '1', title: 'My task', priority: 'LOW', category: 'GENERAL', completed: false }]
    }));

    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByText('Edit todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo title').value).toBe('My task');
  });

  it('calls editTodo with updated payload on save', async () => {
    const editTodo = jest.fn().mockResolvedValue({ _id: '1', title: 'Updated' });
    useTodos.mockReturnValue(makeMockHook({
      todos: [{ _id: '1', title: 'My task', priority: 'LOW', category: 'GENERAL', completed: false }],
      editTodo
    }));

    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.change(screen.getByLabelText('Todo title'), { target: { value: 'Updated task' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(editTodo).toHaveBeenCalledWith('1', expect.objectContaining({ title: 'Updated task' }));
  });

  it('returns to create form after Cancel in edit mode', () => {
    useTodos.mockReturnValue(makeMockHook({
      todos: [{ _id: '1', title: 'My task', priority: 'LOW', category: 'GENERAL', completed: false }]
    }));

    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByText('Edit todo')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Create todo')).toBeInTheDocument();
  });

  it('does not call editTodo when Cancel is clicked', () => {
    const editTodo = jest.fn();
    useTodos.mockReturnValue(makeMockHook({
      todos: [{ _id: '1', title: 'My task', priority: 'LOW', category: 'GENERAL', completed: false }],
      editTodo
    }));

    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(editTodo).not.toHaveBeenCalled();
  });
});
