import express from 'express';
import multer from 'multer';
import mapRoutes from './routes/mapRoutes'; // Updated to only use one routes file

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

app.use('/api/generate', upload.single('image'), mapRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Map Generator API!');
});

export default app;