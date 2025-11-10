import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import app from './app.js';
import { connectDb } from './config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const port = Number(process.env.PORT || 4000);

(async () => {
  const uri = process.env.MONGODB_URI || '';
  await connectDb(uri);
  app.listen(port, () => console.log(`API listening on :${port}`));
})();


