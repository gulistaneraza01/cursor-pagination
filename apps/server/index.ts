import express from 'express';

const app = express();
const port = process.env.PORT ?? 3000;

// Disable the 'X-Powered-By' header to avoid disclosing express version
app.disable('x-powered-by');

app.get('/', (_req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
