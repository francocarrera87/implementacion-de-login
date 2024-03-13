const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const messageModel = require('./dao/models/message');
const ItemsManager = require('./dao/dbManagers/ItemManager');
const manager = new ItemsManager();
const session = require('express-session');
const MongoStore = require('connect-mongo');

mongoose.connect('mongodb+srv://hola1234:hola1234@clustercoder.k5czlhe.mongodb.net/ecommerce').then(() => {
    console.log('Conectado a la red de Atlas');
});

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'perrito', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://localhost:27017/usuarios',
        ttl: 24 * 60 * 60 // Duración de la sesión en segundos (un día)
    })
}));

const hbs = exphbs.create({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
});

app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', async (socket) => {
    console.log('Socket connected');

    socket.on('new item', async (newItem) => {
        await manager.addItem(newItem);
        const items = await manager.getItems();
        io.emit('list updated', items);
    });

    socket.on('delete item', async ({ id }) => {
        await manager.deleteItem(id);
        const items = await manager.getItems();
        io.emit('list updated', items);
        io.emit('item deleted', id);
    });

    // Apartado chat
    const messages = await messageModel.find().lean();
    io.emit('chat messages', { messages });

    socket.on('new message', async (messageInfo) => {
        await messageModel.create(messageInfo);
        const updatedMessages = await messageModel.find().lean();
        io.emit('chat messages', { messages: updatedMessages });
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get('/', async (req, res) => {
    const items = await manager.getItems();
    res.render('home', { items });
});

app.get('/table', async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5; 
    const items = await manager.getItemsPaginated(page, limit);
    res.render('table', { items: items.docs, ...items });
});

app.get('/chat', (req, res) => {
    res.render('chat', {});
});
app.get('/login', (req, res) => {
    res.render('login', {}); 
});
app.get('/registro', (req, res) => {
    res.render('registro', {}); 
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});