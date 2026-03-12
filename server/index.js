const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration for production and development
// Prefer environment-driven origins so we don't have to change code for each deployment URL.
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)
  .concat([
    // sensible defaults
    'http://localhost:3000',
    'https://enerstore.vercel.app',
    'https://ener-store-6csp.vercel.app',
    'https://enerstore-production-ce91.up.railway.app'
  ]);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

// Enhanced Socket.IO configuration for Railway
const io = new Server(server, { 
  cors: { 
    origin: [
      'http://localhost:3000',
      'https://enerstore.vercel.app',
      'https://ener-store-6csp.vercel.app',
      'https://enerstore-production.up.railway.app'
    ],
    credentials: true,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

let viewerCount = 0;

// Enhanced Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  viewerCount++;
  io.emit('viewerCount', viewerCount);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    viewerCount = Math.max(0, viewerCount - 1);
    io.emit('viewerCount', viewerCount);
  });

  // Handle admin authentication
  socket.on('adminAuth', (data) => {
    console.log('Admin auth attempt:', data.username);
    // You can add admin verification here if needed
    socket.emit('adminAuthResponse', { success: true });
  });
});

// Socket.IO error handling
io.engine.on('connection_error', (err) => {
  console.log('Socket.IO connection error:', err);
});

// Connect to MongoDB Atlas
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/enerstore';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('EnerStore API Running');
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    socketConnections: io.engine.clientsCount,
    viewerCount: viewerCount
  });
});

// Socket.IO status endpoint
app.get('/socket-status', (req, res) => {
  res.json({
    connected: io.engine.clientsCount,
    viewerCount: viewerCount,
    transports: io.engine.transports
  });
});

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const companyRoutes = require('./routes/companies');
app.use('/api/companies', companyRoutes);

const customerUserRoutes = require('./routes/customerUsers');
app.use('/api/customer-users', customerUserRoutes);


const carouselRoutes = require('./routes/carousel');
app.use('/api/carousel', carouselRoutes);

const brandRoutes = require('./routes/brands');
app.use('/api/brands', brandRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Socket.IO server running`);
  console.log(`CORS origins:`, process.env.CORS_ORIGINS || 'http://localhost:3000');
}); 