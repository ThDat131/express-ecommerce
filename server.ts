import { app } from './app';
import config from './src/configs/config';

const { port } = config.app;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

process.on('SIGINT', () => {
  server.close(() => console.log('Exit Server Express'));
});
