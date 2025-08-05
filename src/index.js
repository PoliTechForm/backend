import app from "./app.js";
import { PORT } from './env/env.js';

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});