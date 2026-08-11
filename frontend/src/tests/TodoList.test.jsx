import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TodoList from '../components/TodoList';

const TODO = { _id: '1', title: 'Buy groceries', description: 'Milk and bread', priority: 'LOW', category: 'PERSONAL', status: 'OPEN', completed: false };

describe('TodoList', () => {
  it('renders each todo title', () => {
    render(<TodoList todos={[TODO]} onComplete={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('renders empty state when no todos', () => {
    render(<TodoList todos={[]} onComplete={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('renders Edit, Complete, and Delete buttons for each todo', () => {
    render(<TodoList todos={[TODO]} onComplete={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('shows inline edit form pre-filled when Edit is clicked', () => {
    render(<TodoList todos={[TODO]} onComplete={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);

    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByText('Edit todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo title')).toHaveValue('Buy groceries');
  });

  it('cancels edit and restores card view', () => {
    render(<TodoList todos={[TODO]} onComplete={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText('Edit todo')).not.toBeInTheDocument();
    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('calls onEdit and closes form when saved successfully', async () => {
    const onEdit = jest.fn().mockResolvedValue({ _id: '1', title: 'Updated' });
    render(<TodoList todos={[TODO]} onComplete={jest.fn()} onDelete={jest.fn()} onEdit={onEdit} />);

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() => expect(onEdit).toHaveBeenCalledWith('1', expect.objectContaining({ title: 'Buy groceries' })));
    await waitFor(() => expect(screen.queryByText('Edit todo')).not.toBeInTheDocument());
  });

  it('shows error message when onEdit returns null (404)', async () => {
    const onEdit = jest.fn().mockResolvedValue(null);
    render(<TodoList todos={[TODO]} onComplete={jest.fn()} onDelete={jest.fn()} onEdit={onEdit} />);

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() => expect(screen.getByText(/failed to update todo/i)).toBeInTheDocument());
  });

  it('displays formatted due date when present', () => {
    const todoWithDue = { ...TODO, dueDate: '2026-12-31T00:00:00.000Z' };
    render(<TodoList todos={[todoWithDue]} onComplete={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);

    expect(screen.getByText(/Due:/)).toBeInTheDocument();
  });
});
