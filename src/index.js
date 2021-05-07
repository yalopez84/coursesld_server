import app from './app';
import '@babel/polyfill';
const serverConfig = require('../config_files/server_config');
const port = serverConfig.port;

async function main() {
    await app.listen(port);
    console.log(`Server listening on port ${port}`);
};
main();