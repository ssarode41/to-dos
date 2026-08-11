const express = require('express');
const { createTodo, listTodos, getTodo, updateTodo, deleteTodo, completeTodo, reopenTodo } = require('../controllers/todo.controller');
const validate = require('../middlewares/validation');
const { createTodoSchema, updateTodoSchema } = require('../validators/todo.validator');
const { todoQuerySchema } = require('../validators/todoQuery.validator');

const router = express.Router();

router.get('/', validate(todoQuerySchema, 'query'), listTodos);
router.get('/:id', getTodo);
router.post('/', validate(createTodoSchema), createTodo);
router.put('/:id', validate(updateTodoSchema), updateTodo);
router.patch('/:id/complete', completeTodo);
router.patch('/:id/reopen', reopenTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
