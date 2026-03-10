const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const app = require('./app');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const defaultPort = Number(process.env.PORT) || 5000;
const maxPortRetries = 10;

const listenWithPortRetry = (attempt = 0) => {
  const port = defaultPort + attempt;
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && attempt < maxPortRetries) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is in use. Retrying on ${nextPort}...`);
      listenWithPortRetry(attempt + 1);
      return;
    }

    console.error(`Server listen failed: ${error.message}`);
    process.exit(1);
  });
};

const start = async () => {
  try {
    await connectDB();
    listenWithPortRetry();
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

start();
