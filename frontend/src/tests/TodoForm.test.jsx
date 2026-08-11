import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from '../components/TodoForm';

describe('TodoForm', () => {
  it('renders priority, category, and due date fields', () => {
    render(<TodoForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText('Todo priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo category')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo due date')).toBeInTheDocument();
  });

  it('submits payload including priority, category, and dueDate', () => {
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Todo title'), { target: { value: 'New task' } });
    fireEvent.change(screen.getByLabelText('Todo priority'), { target: { value: 'HIGH' } });
    fireEvent.change(screen.getByLabelText('Todo category'), { target: { value: 'WORK' } });
    fireEvent.change(screen.getByLabelText('Todo due date'), { target: { value: '2026-12-31' } });
    fireEvent.click(screen.getByText('Save'));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'New task',
      description: '',
      priority: 'HIGH',
      category: 'WORK',
      dueDate: '2026-12-31'
    });
  });

  it('shows validation error when title is empty', () => {
    render(<TodoForm onSubmit={jest.fn()} />);

    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Title is required.')).toBeInTheDocument();
  });

  it('does not call onSubmit when title is empty', () => {
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText('Save'));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('renders in edit mode with pre-filled values when initialValues provided', () => {
    const initial = { title: 'Edit me', description: 'Details', priority: 'LOW', category: 'HOME', dueDate: '2026-06-15T00:00:00.000Z' };
    render(<TodoForm onSubmit={jest.fn()} onCancel={jest.fn()} initialValues={initial} />);

    expect(screen.getByText('Edit todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo title')).toHaveValue('Edit me');
    expect(screen.getByLabelText('Todo priority')).toHaveValue('LOW');
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save changes')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel is clicked in edit mode', () => {
    const onCancel = jest.fn();
    render(<TodoForm onSubmit={jest.fn()} onCancel={onCancel} initialValues={{ title: 'X' }} />);

    fireEvent.click(screen.getByText('Cancel'));

    expect(onCancel).toHaveBeenCalled();
  });
});
