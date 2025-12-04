const mysql = require('mysql2/promise');
require('dotenv').config();

const initDatabase = async () => {
  let connection;
  
  try {
    // First, connect without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    console.log('📦 Initializing database...');

    const dbName = process.env.DB_NAME || 'task_tracker';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database '${dbName}' ready`);

    await connection.query(`USE \`${dbName}\``);

    // Create tasks table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
        status ENUM('todo', 'in_progress', 'done') NOT NULL DEFAULT 'todo',
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_priority (priority),
        INDEX idx_due_date (due_date)
      )
    `);
    console.log('✅ Tasks table ready');

    // Check if table is empty and add seed data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM tasks');
    if (rows[0].count === 0) {
      console.log('📝 Adding sample data...');
      await connection.query(`
        INSERT INTO tasks (title, description, priority, status, due_date) VALUES
        ('Complete project proposal', 'Write and submit the Q1 project proposal to stakeholders', 'high', 'in_progress', DATE_ADD(CURDATE(), INTERVAL 3 DAY)),
        ('Review code changes', 'Review pull requests from the team', 'medium', 'todo', DATE_ADD(CURDATE(), INTERVAL 1 DAY)),
        ('Update documentation', 'Update API documentation with new endpoints', 'low', 'todo', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
        ('Fix bug in login flow', 'Users reporting issues with password reset', 'urgent', 'in_progress', CURDATE()),
        ('Team meeting preparation', 'Prepare slides for weekly team sync', 'medium', 'done', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
        ('Database optimization', 'Optimize slow queries in production', 'high', 'todo', DATE_ADD(CURDATE(), INTERVAL 5 DAY))
      `);
      console.log('✅ Sample data added');
    }

    await connection.end();
    console.log('✅ Database initialization complete\n');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    if (connection) await connection.end();
    throw error;
  }
};

module.exports = initDatabase;
