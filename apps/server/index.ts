import express from 'express';
import helmet from 'helmet';
import { userRoutes } from './src/routes/user.routes';

const app = express();
const port = process.env.PORT ?? 3000;

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'server is running!' });
});

app.use('/v1/seed', userRoutes);
app.use('/v1/users', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
