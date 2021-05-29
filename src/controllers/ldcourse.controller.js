const fs = require("fs");
const util = require('util');
const readfile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
import serverConfig from '../../config_files/server_config';
const hostname = serverConfig.hostname;


export async function getCourseOntology(req, res) {
    let courseOntologyDir = "./files/ld/ontologies/courseontology.ttl";
    if (fs.existsSync(courseOntologyDir)) {
        let aux = await readfile(courseOntologyDir, 'utf8');
        res.set({
            'Content-Type': 'text/plain'
        });
        res.send(aux);
    }
    else {
        res.json({ "Message": "The file courseontology.ttl does not exist" });

    }
}

export async function getCourses(req, res) {

    let result = {};

    if (req['headers']['accept'] === 'text/plain') {
        if (fs.existsSync('./files/ld/courses/courses.ttl')) {
            let aux = await readfile("./files/ld/courses/courses.ttl", 'utf8');
            res.set({
                'Content-Type': 'text/plain'
            });
            res.send(aux);
        }
        else {
            res.json({ "Message": "The file courses.ttl does not exist" });

        }
    }
    else if (req['headers']['accept'] === 'text/n3') {
        if (fs.existsSync('./files/ld/courses/courses.n3')) {
            let aux = await readfile("./files/ld/courses/courses.n3", 'utf8');
            res.set({
                'Content-Type': 'text/n3'
            });
            res.send(aux);
        }
        else {
            res.json({ "Message": "The file courses.n3 does not exist" });

        }
    }
    else if (req['headers']['accept'] === 'text/csv') {
        if (fs.existsSync('./files/ld/courses/courses.csv')) {
            let aux = await readfile("./files/ld/courses/courses.csv", 'utf8');
            res.set({
                'Content-Type': 'text/csv'
            });
            res.send(aux);
        }
        else {
            res.json({ "Message": "The file courses.csv does not exist" });

        }


    }
    else {

        let startDateQuery = new Date(req.query.startDate);
        if (startDateQuery.toString() === 'Invalid Date')
            startDateQuery = new Date("2009");

        let subjectQuery = "";
        let subjectFlag = false;
        if (req.query.subject) {
            subjectQuery = req.query.subject;
            subjectFlag = true;
        }

        let index = 0;
        if (req.query.index)
            if (parseInt(req.query.index))
                index = parseInt(req.query.index);


        let dirInput = await getDir(startDateQuery, subjectQuery);
        let createDir = true;
        checkIfDirectoryExists(dirInput, function () {
            createDir = false;
        }, function () {
        });

        let dirFragment = await getDirFragment(startDateQuery, subjectQuery, index);
        if (!fs.existsSync(dirFragment))
            createDir = true;


        let dirAllCourses = "./files/ld/courses/courses.jsonld";
        let tempCourses = "";
        if (fs.existsSync(dirAllCourses)) {
            tempCourses = await readfile(dirAllCourses, 'utf8');
        }
        let coursesld = JSON.parse(tempCourses);
        let courses = coursesld['@graph'];
        let coursesQuery = [];
        let tempArrayCourses = [];

        let dir_save_fragments = "";
        let startDateString = startDateQuery.toISOString();
        if (subjectFlag)
            dir_save_fragments = `./fragments/both/${startDateString}/${subjectQuery}/`;
        else
            dir_save_fragments = `./fragments/startDates/${startDateString}/`;


        if (createDir) {
            coursesQuery = courses.slice();
            if (subjectFlag)
                coursesQuery = await coursesBySubject(courses, subjectQuery);

            tempArrayCourses = coursesQuery.slice();
            tempArrayCourses = await sortByStartDate(coursesQuery, startDateQuery);

            coursesQuery = tempArrayCourses.slice();

            if (coursesQuery.length > 0) {

                //crear directorios
                let dir_save_fragments_array = dir_save_fragments.split('/');
                for (let i = 1; i < dir_save_fragments_array.length - 1; i++) {
                    let dir_aux = await concatenarHastaPos(dir_save_fragments, i);
                    mkdirIfNotExists(dir_aux);
                }

                let temp_dir = '';
                let aux_courses_fragments = [];
                let aux = [];
                let index_aux = 0;


                //Crear fragmentos
                for (let i = 0; i < coursesQuery.length; i++) {
                    temp_dir = dir_save_fragments;
                    aux_courses_fragments.push(coursesQuery[i]);
                    if (i !== 0 && (i + 1) % 5 === 0) {
                        temp_dir += index_aux.toString();
                        await writeFile(temp_dir + '.json', JSON.stringify(aux_courses_fragments));
                        aux_courses_fragments = aux.slice();
                        index_aux++;
                    }
                    if (i === coursesQuery.length - 1) {
                        if (aux_courses_fragments.length > 0) {
                            temp_dir += index_aux.toString();
                            await writeFile(temp_dir + '.json', JSON.stringify(aux_courses_fragments));
                        }
                    }

                }
            }
        }

        let params = {
            hostname: hostname,
            startDate: startDateQuery,
            subject: subjectQuery,
            index: index,
            dir: dir_save_fragments
        }
        result = await addHydraMetada(params);
        //result = await addTreeMetada(params);
        res.json(result);
    }
}
async function addHydraMetada(params) {
    let result = {};
    try {
        let template = await readfile('./config_files/skeleton.jsonld', { encoding: 'utf8' });
        let jsonld_skeleton = JSON.parse(template);
        let hostname = params.hostname;
        let startDate = params.startDate;
        let subject = params.subject;
        let index = params.index;
        let dir = params.dir + index.toString() + '.json';
        let dir_next = params.dir + (index + 1).toString() + '.json';
        let dir_previous = params.dir + (index - 1).toString() + '.json';
        let existNextFragment = false;
        let existPreviousFragment = false;
        let courses_ld = {};
        let urlResult = "";

        if (fs.existsSync(dir)) {
            if (fs.existsSync(dir_next)) existNextFragment = true;
            if (fs.existsSync(dir_previous)) existPreviousFragment = true;

            let courses_fragment = await readfile(dir, { encoding: 'utf8' });
            courses_ld = JSON.parse(courses_fragment);

            if (subject !== "")
                urlResult = `http://${hostname}/ld/courses?startDate=${startDate.toISOString()}&subject=${subject}`;
            else
                urlResult = `http://${hostname}/ld/courses?startDate=${startDate.toISOString()}`;


            jsonld_skeleton['@id'] = urlResult + `&index=${index.toString()}`;

            if (existNextFragment) {
                jsonld_skeleton['hydra:next'] = urlResult + `&index=${(index + 1).toString()}`;
            } else {
                delete jsonld_skeleton['hydra:next'];
            }
            if (existPreviousFragment) {
                jsonld_skeleton['hydra:previous'] = urlResult + `&index=${(index - 1).toString()}`;
            } else {
                delete jsonld_skeleton['hydra:previous'];
            }
            jsonld_skeleton['hydra:search']['hydra:template'] = hostname + '/ld/courses?startDate={startDate}&subject={subject}';
            jsonld_skeleton['@graph'] = courses_ld;
            result['Courses hydra jsonld'] = jsonld_skeleton;

        }
        return result;

    } catch (err) {
        console.error(err);
        throw err;
    }
}
async function addTreeMetada(params) {
    let result = {};
    try {
        let template = await readfile('./config_files/skeleton_tree.jsonld', { encoding: 'utf8' });
        let jsonld_skeleton = JSON.parse(template);
        let hostname = params.hostname;
        let startDate = params.startDate;
        let subject = params.subject;
        let index = params.index;
        let dir = params.dir + index.toString() + '.json';
        let dir_next = params.dir + (index + 1).toString() + '.json';
        let dir_previous = params.dir + (index - 1).toString() + '.json';

        let existNextFragment = false;
        let existPreviousFragment = false;
        let courses_ld = {};
        let urlResult = "";
        let leastDateActualFragment = "";
        let greaterDateActualFragment = "";
        let cantCourses = 0;
        let params_relation = {};

        if (fs.existsSync(dir)) {
            if (fs.existsSync(dir_next)) existNextFragment = true;
            if (fs.existsSync(dir_previous)) existPreviousFragment = true;

            let courses_fragment = await readfile(dir, { encoding: 'utf8' });
            courses_ld = JSON.parse(courses_fragment);
            cantCourses = Object.keys(courses_ld).length;

            if (cantCourses > 0) {
                leastDateActualFragment = courses_ld[0]['startDate'];
                greaterDateActualFragment = courses_ld[cantCourses - 1]['startDate'];
            }

            if (subject !== "")
                urlResult = `http://${hostname}/ld/courses?startDate=${startDate.toISOString()}&subject=${subject}`;
            else
                urlResult = `http://${hostname}/ld/courses?startDate=${startDate.toISOString()}`;

            jsonld_skeleton['@id'] = urlResult;
            jsonld_skeleton['rdfs:label'] = `Courses collection by startdate ${startDate} and subject ${subject}`,
                jsonld_skeleton['tree:view']['@id'] = urlResult + `&index=${index.toString()}`;


            if (existNextFragment) {

                params_relation = {
                    type: "tree:GreaterThanOrEqualToRelation",
                    node: urlResult + `&index=${(index + 1).toString()}`,
                    path: "startDate",
                    value: greaterDateActualFragment

                };
                jsonld_skeleton['tree:view']['tree:relation'].push(await getTreeRelation(params_relation));

                params_relation = {
                    type: "tree:EqualThanRelation",
                    node: urlResult + `&index=${(index + 1).toString()}`,
                    path: "subject",
                    value: subject

                };
                jsonld_skeleton['tree:view']['tree:relation'].push(await getTreeRelation(params_relation));
            }

            if (existPreviousFragment) {

                params_relation = {
                    type: "tree:LessThanOrEqualToRelation",
                    node: urlResult + `&index=${(index - 1).toString()}`,
                    path: "startDate",
                    value: leastDateActualFragment

                };
                jsonld_skeleton['tree:view']['tree:relation'].push(await getTreeRelation(params_relation));

                params_relation = {
                    type: "tree:EqualThanRelation",
                    node: urlResult + `&index=${(index - 1).toString()}`,
                    path: "subject",
                    value: subject

                };
                jsonld_skeleton['tree:view']['tree:relation'].push(await getTreeRelation(params_relation));

            }
            jsonld_skeleton['hydra:member'] = courses_ld;
            result['Courses tree jsonld'] = jsonld_skeleton;

        }
        return result;

    } catch (err) {
        console.error(err);
        throw err;
    }
}
async function getTreeRelation(params) {
    let result = {};
    let type = params.type;
    let node = params.node;
    let path = params.path;
    let value = params.value;
    result["@type"] = type;
    result["tree:node"] = node;
    result["tree:path"] = path;
    result["tree:value"] = value;
    return result;
}
async function getDir(startDateQuery, subjectQuery) {
    let dir_save_fragments = "";
    let startDateString = startDateQuery.toISOString();
    if (subjectQuery !== "")
        dir_save_fragments = `./fragments/both/${startDateString}/${subjectQuery}/`;
    else
        dir_save_fragments = `./fragments/startDates/${startDateString}/`;

    return dir_save_fragments;
}
async function getDirFragment(startDateQuery, subjectQuery, index) {
    let dir_save_fragments = "";
    let startDateString = startDateQuery.toISOString();
    if (subjectQuery !== "")
        dir_save_fragments = `./fragments/both/${startDateString}/${subjectQuery}/`;
    else
        dir_save_fragments = `./fragments/startDates/${startDateString}/`;
    dir_save_fragments += `${index.toString()}.json`

    return dir_save_fragments;
}

async function concatenarHastaPos(dirPath, pos) {
    let result = '';
    let a = dirPath.split('/');
    for (let i = 0; i <= pos; i++) {
        result += a[i] + '/';
    }
    return result;
}
async function mkdirIfNotExists(dirPath) {
    return new Promise(function (resolve, reject) {
        checkIfDirectoryExists(dirPath, function () {
            resolve();
        }, function () {
            fs.mkdirSync(dirPath);
            resolve();
        });
    });
}
async function checkIfDirectoryExists(dirPath, successCallback, errorCallback) {
    try {
        // Query the entry
        var stats = fs.lstatSync(dirPath);
        // Is it a directory?
        if (stats.isDirectory()) {
            successCallback();
        }
    } catch (e) {
        errorCallback();
    }
}

async function sortByStartDate(courses, startDateQuery) {
    let result = [];
    courses.forEach(course => {
        console.log("course['startDate']" + course['startDate'] + "         " + "startDateQuery" + startDateQuery)
        if (new Date(course['startDate']) >= startDateQuery)
            result.push(course)
    });
    result.sort((a, b) => {
        if (a['startDate'] < b['startDate']) return -1;
    });
    return result;
}
async function coursesBySubject(courses, subject) {
    let result = [];
    courses.forEach(course => {
        let array_len = course['subject'].split('/').length;
        let subjectDenomination = course['subject'].split('/')[array_len - 1];
        if (subjectDenomination.toLowerCase() === subject.toLowerCase()) {
            result.push(course);
        }
    })
    return result;
}





