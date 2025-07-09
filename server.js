import express from 'express';  
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Load blackspot data (hardcoded values)
const zones = JSON.parse(fs.readFileSync('/data/zone.json', 'utf-8'));
console.log(zones)

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });