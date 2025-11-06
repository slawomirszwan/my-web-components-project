/*
server express dla danych dla ajax

*/

import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../dist')))

// Mock data
let users = [
  { id: 1, name: 'Jan Kowalski', email: 'jan@example.com' },
  { id: 2, name: 'Anna Nowak', email: 'anna@example.com' },
  { id: 3, name: 'Piotr Wiśniewski', email: 'piotr@example.com' }
]

let posts = [
  { id: 1, title: 'Pierwszy post', content: 'Treść pierwszego posta', authorId: 1 },
  { id: 2, title: 'Drugi post', content: 'Treść drugiego posta', authorId: 2 }
]

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Users endpoints
app.get('/api/users', (req, res) => {
  res.json(users)
})

app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id)    //int or NaN
  const user = users.find(u => u.id === id)
  if (!user) 
    return res.status(404).json({ error: 'User not found' })
  res.json(user)
})

app.post('/api/users', (req, res) => {
  const lastId = Math.max(...users.map(row => row['id'])) //row.id
  const newId = lastId === -Infinity ? 1 : lastId + 1  
  

  const newUser = {
    id: newId, //users.length + 1,
    name: req.body.name,
    email: req.body.email
  }
  users.push(newUser)
  res.status(201).json(newUser)
})

// Posts endpoints
app.get('/api/posts', (req, res) => {
  const postsWithAuthors = posts.map(post => ({
    ...post,
    author: users.find(user => user.id === post.authorId)
  }))
  res.json(postsWithAuthors)
})

app.post('/api/posts', (req, res) => {
  const newPost = {
    id: posts.length + 1,
    title: req.body.title,
    content: req.body.content,
    authorId: req.body.authorId
  }
  posts.push(newPost)
  res.status(201).json(newPost)
})

// Serve SPA (dla produkcji)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 API available at http://localhost:${PORT}/api`)
})