import express from 'express';
import settingsRoutes from './routes/settings.routes';
import dotenv from "dotenv"

dotenv.config();

const app = express();

app.use(express.json());

// Register API routes
app.use('/api', settingsRoutes);

export default app;
