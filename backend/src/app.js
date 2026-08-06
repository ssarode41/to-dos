const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const logger = require('./config/logger');
const todoRoutes = require('./routes/todo.routes');
const errorHandler = require('./middlewares/errorHandler');
const { connectToDatabase } = require('./config/database');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'elitea-todos-backend' });
});

app.use('/api/v1/todos', todoRoutes);

app.use(errorHandler);

connectToDatabase().catch((err) => {
  logger.error('Database initialization failed', { error: err.message });
});

module.exports = app;
