import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { useTodos } from '../hooks/useTodos';

jest.mock('../hooks/useTodos', () => ({
  useTodos: jest.fn()
}));

describe('Dashboard', () => {
  it('renders the dashboard heading and search input', () => {
    useTodos.mockReturnValue({
      todos: [{ _id: '1', title: 'Ship release', completed: false, priority: 'HIGH', category: 'WORK' }],
      loading: false,
      error: '',
      addTodo: jest.fn(),
      removeTodo: jest.fn(),
      markComplete: jest.fn()
    });

    render(<Dashboard />);

    expect(screen.getByText('Todo dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Search todos')).toBeInTheDocument();
  });
});
