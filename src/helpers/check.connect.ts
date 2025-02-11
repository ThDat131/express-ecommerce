import mongoose from 'mongoose';
import os from 'node:os';

const SECONDS = 5000;

const countConnect = () => {
  const numConnection = mongoose.connections.length;

  console.log(`Number of connections: ${numConnection}`);

  return numConnection;
};

const checkOverload = () => {
  setInterval(() => {
    const numConnection = countConnect();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    const maxConnection = numCores * numConnection;

    console.log(`Active connection: ${numConnection}`);
    console.log(`Memory used: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnection) {
      console.log('OVERLOAD');
    }
  }, SECONDS);
};

export { checkOverload };
