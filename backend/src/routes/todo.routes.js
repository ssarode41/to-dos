const express = require('express');
const { createTodo, listTodos, getTodo, updateTodo, deleteTodo, completeTodo } = require('../controllers/todo.controller');
const validate = require('../middlewares/validation');
const { createTodoSchema, updateTodoSchema } = require('../validators/todo.validator');

const router = express.Router();

router.get('/', listTodos);
router.get('/:id', getTodo);
router.post('/', validate(createTodoSchema), createTodo);
router.put('/:id', validate(updateTodoSchema), updateTodo);
router.patch('/:id/complete', completeTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
