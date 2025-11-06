import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const app = express()
const PORT = 3003

// Middleware
app.use(cors())
app.use(express.json())

// Inicjalizacja bazy danych
let db
async function initializeDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  })

  // Stwórz tabele
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(author_id) REFERENCES users(id)
    );
  `)

  // Wstaw przykładowe dane
  const userCount = await db.get('SELECT COUNT(*) as count FROM users')
  if (userCount.count === 0) {
    await db.run(
      'INSERT INTO users (name, email) VALUES (?, ?), (?, ?)',
      ['Jan Kowalski', 'jan@example.com', 'Anna Nowak', 'anna@example.com']
    )
  }
}

// Routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.all('SELECT * FROM users ORDER BY created_at DESC')
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/users', async (req, res) => {
  try {
    const { name, email } = req.body
    const result = await db.run(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    )
    const newUser = await db.get('SELECT * FROM users WHERE id = ?', result.lastID)
    res.status(201).json(newUser)
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'Email already exists' })
    } else {
      res.status(500).json({ error: error.message })
    }
  }
})

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.all(`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      ORDER BY p.created_at DESC
    `)
    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, authorId } = req.body
    const result = await db.run(
      'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)',
      [title, content, authorId]
    )
    const newPost = await db.get(`
      SELECT p.*, u.name as author_name 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      WHERE p.id = ?
    `, result.lastID)
    res.status(201).json(newPost)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Uruchom serwer
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Advanced server running on http://localhost:${PORT}`)
  })
})