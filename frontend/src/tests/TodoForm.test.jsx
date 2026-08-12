import { render, screen, fireEvent } from '@testing-library/react';
import TodoForm from '../components/TodoForm';

describe('TodoForm – create mode', () => {
  it('renders create heading and all fields', () => {
    render(<TodoForm onSubmit={jest.fn()} />);

    expect(screen.getByText('Create todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo title')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo description')).toBeInTheDocument();
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
    expect(screen.getByLabelText('Due date')).toBeInTheDocument();
  });

  it('calls onSubmit with all metadata fields', () => {
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Todo title'), { target: { value: 'Test task' } });
    fireEvent.change(screen.getByLabelText('Todo description'), { target: { value: 'A description' } });
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'HIGH' } });
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'WORK' } });
    fireEvent.change(screen.getByLabelText('Due date'), { target: { value: '2026-12-31' } });
    fireEvent.submit(screen.getByRole('form') || screen.getByText('Save').closest('form'));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Test task',
      description: 'A description',
      priority: 'HIGH',
      category: 'WORK',
      dueDate: '2026-12-31'
    });
  });

  it('does not call onSubmit when title is blank', () => {
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('resets fields after successful submit', () => {
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText('Todo title');
    fireEvent.change(titleInput, { target: { value: 'My task' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(titleInput.value).toBe('');
  });

  it('sends null dueDate when field is empty', () => {
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Todo title'), { target: { value: 'Task' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ dueDate: null }));
  });
});

describe('TodoForm – edit mode', () => {
  const todo = {
    _id: '1',
    title: 'Existing task',
    description: 'Old description',
    priority: 'LOW',
    category: 'PERSONAL',
    dueDate: '2026-06-15T00:00:00.000Z'
  };

  it('renders edit heading and pre-fills fields', () => {
    render(<TodoForm onSubmit={jest.fn()} initialValues={todo} />);

    expect(screen.getByText('Edit todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo title').value).toBe('Existing task');
    expect(screen.getByLabelText('Todo description').value).toBe('Old description');
    expect(screen.getByLabelText('Priority').value).toBe('LOW');
    expect(screen.getByLabelText('Category').value).toBe('PERSONAL');
  });

  it('shows Update and Cancel buttons in edit mode', () => {
    render(<TodoForm onSubmit={jest.fn()} onCancel={jest.fn()} initialValues={todo} />);

    expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('calls onSubmit with updated values', () => {
    const onSubmit = jest.fn();
    render(<TodoForm onSubmit={onSubmit} onCancel={jest.fn()} initialValues={todo} />);

    fireEvent.change(screen.getByLabelText('Todo title'), { target: { value: 'Updated task' } });
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'HIGH' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Updated task', priority: 'HIGH' })
    );
  });

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = jest.fn();
    render(<TodoForm onSubmit={jest.fn()} onCancel={onCancel} initialValues={todo} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not call onSubmit when Cancel is clicked', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    render(<TodoForm onSubmit={onSubmit} onCancel={onCancel} initialValues={todo} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
