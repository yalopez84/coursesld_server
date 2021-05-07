import { Router } from 'express';
const router = Router();
import { getCatalog } from '../controllers/ld.controller';


router.get('/', getCatalog);

router.options('/*', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/ld+json'
    });

    res.sendStatus(200);
});

export default router;