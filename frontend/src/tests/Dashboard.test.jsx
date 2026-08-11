import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { useTodos } from '../hooks/useTodos';

jest.mock('../hooks/useTodos', () => ({
  useTodos: jest.fn()
}));

const defaultHook = (overrides = {}) => ({
  todos: [{ _id: '1', title: 'Ship release', completed: false, priority: 'HIGH', category: 'WORK', status: 'OPEN' }],
  pagination: null,
  loading: false,
  error: '',
  addTodo: jest.fn(),
  editTodo: jest.fn(),
  removeTodo: jest.fn(),
  markComplete: jest.fn(),
  markReopen: jest.fn(),
  refresh: jest.fn(),
  ...overrides
});

describe('Dashboard', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the dashboard heading and search input', () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    expect(screen.getByText('Todo dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Search todos')).toBeInTheDocument();
  });

  it('renders filter controls', () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    expect(screen.getByLabelText('Filter by status')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by category')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort order')).toBeInTheDocument();
  });

  it('renders todo list items', () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    expect(screen.getByText('Ship release')).toBeInTheDocument();
  });

  it('renders Edit button on each todo card', () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('shows Complete button for non-done todos', () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    expect(screen.getByRole('button', { name: 'Complete' })).toBeInTheDocument();
  });

  it('shows Reopen button for completed todos', () => {
    useTodos.mockReturnValue(
      defaultHook({
        todos: [{ _id: '2', title: 'Done task', completed: true, status: 'DONE', priority: 'LOW', category: 'GENERAL' }]
      })
    );

    render(<Dashboard />);

    expect(screen.getByRole('button', { name: 'Reopen' })).toBeInTheDocument();
  });

  it('switches TodoForm to edit mode when Edit is clicked', async () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    await waitFor(() => {
      expect(screen.getByText('Edit todo')).toBeInTheDocument();
    });
  });

  it('pre-fills form title when entering edit mode', async () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Todo title').value).toBe('Ship release');
    });
  });

  it('returns form to Create mode when Cancel is clicked', async () => {
    useTodos.mockReturnValue(defaultHook());

    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await waitFor(() => screen.getByText('Edit todo'));

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => {
      expect(screen.getByText('Create todo')).toBeInTheDocument();
    });
  });

  it('calls editTodo with id and payload on form submit in edit mode', async () => {
    const editTodo = jest.fn().mockResolvedValue({});
    useTodos.mockReturnValue(defaultHook({ editTodo }));

    render(<Dashboard />);

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await waitFor(() => screen.getByText('Edit todo'));

    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    await waitFor(() => {
      expect(editTodo).toHaveBeenCalledWith('1', expect.objectContaining({ title: 'Ship release' }));
    });
  });

  it('shows loading state', () => {
    useTodos.mockReturnValue(defaultHook({ loading: true, todos: [] }));

    render(<Dashboard />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error message', () => {
    useTodos.mockReturnValue(defaultHook({ error: 'Unable to load todos', todos: [] }));

    render(<Dashboard />);

    expect(screen.getByText('Unable to load todos')).toBeInTheDocument();
  });

  it('shows empty state message when no todos', () => {
    useTodos.mockReturnValue(defaultHook({ todos: [] }));

    render(<Dashboard />);

    expect(screen.getByText('No todos yet. Add one to get started.')).toBeInTheDocument();
  });

  it('renders pagination controls when multiple pages exist', () => {
    useTodos.mockReturnValue(
      defaultHook({
        pagination: { total: 50, page: 2, limit: 20, pages: 3 }
      })
    );

    render(<Dashboard />);

    expect(screen.getByRole('button', { name: 'Prev' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('does not render pagination when only one page', () => {
    useTodos.mockReturnValue(
      defaultHook({
        pagination: { total: 5, page: 1, limit: 20, pages: 1 }
      })
    );

    render(<Dashboard />);

    expect(screen.queryByRole('button', { name: 'Prev' })).not.toBeInTheDocument();
  });
});
