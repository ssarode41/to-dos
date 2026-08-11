import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { useTodos } from '../hooks/useTodos';

jest.mock('../hooks/useTodos', () => ({
  useTodos: jest.fn()
}));

const mockTodo = {
  _id: '1',
  title: 'Ship release',
  description: 'Deploy to prod',
  completed: false,
  priority: 'HIGH',
  category: 'WORK',
  status: 'OPEN',
  dueDate: '2026-09-01T00:00:00.000Z'
};

function defaultHook(overrides = {}) {
  return {
    todos: [mockTodo],
    loading: false,
    error: '',
    addTodo: jest.fn(),
    removeTodo: jest.fn(),
    markComplete: jest.fn(),
    editTodo: jest.fn(),
    ...overrides
  };
}

describe('Dashboard', () => {
  it('renders the dashboard heading and search input', () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    expect(screen.getByText('Todo dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Search todos')).toBeInTheDocument();
  });

  it('renders an Edit button for each todo', () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('clicking Edit switches form to edit mode and pre-fills fields', async () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    fireEvent.click(screen.getByText('Edit'));

    await waitFor(() => {
      expect(screen.getByText('Edit todo')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Todo title').value).toBe('Ship release');
    expect(screen.getByLabelText('Todo description').value).toBe('Deploy to prod');
    expect(screen.getByLabelText('Todo status').value).toBe('OPEN');
  });

  it('submitting the edit form calls editTodo and closes the form', async () => {
    const editTodo = jest.fn().mockResolvedValue({});
    useTodos.mockReturnValue(defaultHook({ editTodo }));

    render(<Dashboard />);

    fireEvent.click(screen.getByText('Edit'));

    await waitFor(() => screen.getByText('Edit todo'));

    fireEvent.change(screen.getByLabelText('Todo title'), { target: { value: 'Updated title' } });
    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(editTodo).toHaveBeenCalledWith('1', expect.objectContaining({ title: 'Updated title' }));
    });

    await waitFor(() => {
      expect(screen.queryByText('Edit todo')).not.toBeInTheDocument();
    });
  });

  it('Cancel button closes the edit form without saving', async () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    fireEvent.click(screen.getByText('Edit'));

    await waitFor(() => screen.getByText('Edit todo'));

    fireEvent.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Edit todo')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Create todo')).toBeInTheDocument();
  });
});
