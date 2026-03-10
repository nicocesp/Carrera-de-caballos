const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const { runSchema } = require('./db/database');
const { authMiddleware } = require('./middleware/auth');

runSchema();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/points', require('./routes/points'));

app.get('/api/health', (req, res) => res.json({ ok: true }));

const webPath = path.join(__dirname, '../../web');
const fs = require('fs');
app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(webPath, 'index.html'), 'utf8');
  if (!html.includes('window.API_URL')) html = html.replace('<head>', '<head><script>window.API_URL = "";</script>');
  res.type('html').send(html);
});
app.get('/index.html', (req, res) => {
  let html = fs.readFileSync(path.join(webPath, 'index.html'), 'utf8');
  if (!html.includes('window.API_URL')) html = html.replace('<head>', '<head><script>window.API_URL = "";</script>');
  res.type('html').send(html);
});
app.use(express.static(webPath));

const { setupRoomHandlers } = require('./socket/roomHandler');
setupRoomHandlers(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('Servidor Carreras de Caballos en puerto', PORT);
});
