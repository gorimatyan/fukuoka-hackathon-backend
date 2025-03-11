import app from './app';
import ENV from './config/env';
import {startEmailListener} from "./middlewares/email-receiver";

app.listen(ENV.PORT, () => {
  startEmailListener();
  console.log(`🚀 Server running at http://localhost:${ENV.PORT}`);
});