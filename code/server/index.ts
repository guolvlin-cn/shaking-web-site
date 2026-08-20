import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
  console.log(`[shaking-web-api] listening on :${env.port} (env=${env.nodeEnv})`);
});
