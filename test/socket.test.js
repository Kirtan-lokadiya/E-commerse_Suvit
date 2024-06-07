const io = require('socket.io-client');
const http = require('http');
const socketIo = require('socket.io');

let server, ioServer;

beforeAll(async () => {
  const app = http.createServer();
  ioServer = socketIo(app);
  ioServer.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('chat message', async (msg) => {
      ioServer.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  server = app.listen(() => {
    console.log(`Test server running on port ${server.address().port}`);
  });
}, 30000); // Set timeout to 30 seconds

afterAll(async () => {
  await ioServer.close();
  await server.close();
}, 30000); // Set timeout to 30 seconds

test('should receive message from server', (done) => {
  const clientSocket = io.connect(`http://localhost:${server.address().port}`);

  clientSocket.on('connect', () => {
    clientSocket.emit('chat message', {
      sender: '665eb5222bdef77f17251c45',
      receiver: '66585eebc38e9cf64317fb6c',
      message: 'Hello Server'
    });
  });

  clientSocket.on('chat message', (msg) => {
    expect(msg.message).toBe('Hello Server');
    clientSocket.disconnect();
    done();
  });
}, 30000); // Set timeout to 30 seconds
