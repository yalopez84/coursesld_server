import { Router } from 'express';
const router = Router();
import { getCourses, getCourseOntology} from '../controllers/ldcourse.controller';

router.get('/', getCourses);
router.get('/ontology', getCourseOntology);

router.options('/*', (req, res) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'

    });
    res.sendStatus(200);
});
export default router;