import express, { json } from 'express';
import morgan from 'morgan';
import serverconfig from '../config_files/server_config';
const hostname = serverconfig.hostname;

import ldRoutes from './routes/ld';
import ldcourseRoutes from './routes/ldcourses';


const app = express();

app.use(morgan('dev'));
app.use(json());

app.use('/ld/', ldRoutes);
app.use('/ld/courses', ldcourseRoutes);

app.use((req, res) => {
    res.status(404).write(`Page not found, try http://${hostname}/ld/`);
    res.end();
});

export default app;




