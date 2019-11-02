import 'reflect-metadata';
import { createConnection } from 'typeorm';
import app from './server';

const PORT = 3000;

createConnection()
  .then(() => {
    app.listen(PORT, () => console.log('Listening on port: ', PORT));
  })
  .catch(e => console.log('Something went wrong while establishing db connection.'));
