import express from 'express';

const app: express.Application = express();

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Hello World!' });
});

app.listen(3000, (err: Error) => {
  if (err) {
    throw err;
  }
  console.log('Server listening on port 3000');
});
