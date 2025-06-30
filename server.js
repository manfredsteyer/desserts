import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'desserts.json');

app.use(cors());
app.use(express.json());

app.get('/desserts', async (req, res) => {
  const { originalName, englishName } = req.query;
  const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));

  const filtered = data.filter(dessert => {
    return (!originalName || dessert.originalName.toLowerCase().includes(originalName.toLowerCase())) &&
           (!englishName || dessert.englishName.toLowerCase().includes(englishName.toLowerCase()));
  });

  res.json(filtered);
});

app.get('/desserts/:id', async (req, res) => {
  const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
  const dessert = data.find(d => d.id === parseInt(req.params.id));

  if (!dessert) {
    return res.status(404).json({ error: 'Dessert not found' });
  }

  res.json(dessert);
});

app.patch('/desserts/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;

  const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
  const index = data.findIndex(d => d.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Dessert not found' });
  }

  data[index] = { ...data[index], ...updates };
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

  res.json(data[index]);
});

const server = app.listen(PORT, () => {
  console.log(`Dessert API runs on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌', err.message);
  process.exit(1); 
});
