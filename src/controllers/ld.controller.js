const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;
const fs = require("fs");
const util = require('util');
const readfile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
import serverConfig from '../../config_files/server_config';
const hostname = serverConfig.hostname;

export async function getCatalog(req, res) {
    let catalog = {
        "@context": {
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "dcat": "http://www.w3.org/ns/dcat#",
            "dct": "http://purl.org/dc/terms",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
            "cc": "http://creativecommons.org/ns#",
            "foaf": "http://xmlns.com/foaf/0.1/",
            "teach": "http://linkedscience.org/teach/ns#",
            "aiiso": "http://purl.org/vocab/aiiso/schema#",
            "access": "http://publications.europa.eu/resource/authority/access-right/",
            "ianaMediaType": "https://www.iana.org/assignments/media-types/media-types.xhtml#",
            "Catalog": "dcat:Catalog",
            "Dataset": "dcat:Dataset",
            "mediaType": "dcat:mediaType",
            "Distribution": "dcat:Distribution",
            "Institution": "aiiso:Institution",
            "Course": "teach:Course",
            "TimePeriod": "dct:PeriodOfTime",
            "name": "foaf:name",
            "label": "rdfs:label",
            "title": "dct:title",
            "description": "dct:description",
            "lastModified": "dct:modified",
            "license": "cc:license",
            "publisher": "dct:publisher",
            "spatial": "dct:spatial",
            "conformsTo": "dct:conformsTo",
            "issued": "dct:issued",
            "temporalRange": "dct:temporal",
            "keyword": "dcat:keyword",
            "accessURL": "dcat:accessURL",
            "startDate": "dcat:startDate",
            "endDate": "dcat:endDate",
            "accessRights": {
                "@id": "dcat:accessRights",
                "@type": "@id"
            },
            "subject": {
                "@id": "dct:subject",
                "@type": "@id"
            }

        },
        "@id": `https://${hostname}/ld/catalog`,
        "@type": "Catalog",
        "title": "Catalog of University of the Informatics Science linked datasets",
        "description": "List of linked datasets",
        "modified": new Date().toISOString(),
        "license": "http://creativecommons.org/publicdomain/zero/1.0/",
        "accessRights": "access:PUBLIC",
        "publisher": {
            "@id": `http://${hostname}/ld/universities/uci`,
            "@type": "Institution",
            "name": "University of the Informatics Science"
        },
        "dataset": []
    };

    let dataset_courses = {
        "@id": `http://${hostname}/ld/courses`,
        "@type": "Dataset",
        "subject": "Course",
        "description": "Courses dataset of UCI",
        "title": "Courses dataset of UCI",
        "spatial": "",
        "keyword": "course",
        "conformsTo": `http://${hostname}/ld/courses/ontology`,
        "accessRights": "access:PUBLIC",
        "license": "http://creativecommons.org/publicdomain/zero/1.0/",
        "temporalRange": {
            "@type": "TimePeriod",
            "startDate": "01/01/2021",
            "endDate": "31/12/2025"
        },
        "dcat:distribution": {
            "@id": `http://${hostname}/ld/courses/distributions/01`,
            "@type": "Distribution",
            "accessURL": `http://${hostname}/ld/courses`,
            "mediaType": ["ianaMediaType:application/ld+json", "ianaMediaType:text/turtle", "ianaMediaType: text/n3", "ianaMediaType: text/csv"]
        }
    };
    catalog['dataset'].push(dataset_courses);
    saveDatasets();

    res.header("Content-Type", "application/ld+json; charset=utf-8");
    res.json(catalog);
}
function saveDatasets() {
    if (fs.existsSync('./files/raw_data/courses.json')) {
        mkdirIfNotExists('./files/ld/courses');
        saveCoursesldJsonLD();
        saveCoursesldTurtle();
        saveCoursesldn3();
        saveCoursesldCSV();
    }
}
async function saveCoursesldJsonLD() {
    let container_coursesld = {};

    const context = {
        "teach": "http://linkedscience.org/teach/ns#",
        "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
        "gn": "http://www.geonames.org/ontology/",
        "dbpedia": "http://dbpedia.org/ontology/",
        "aiiso": "http://purl.org/vocab/aiiso/schema#",
        "dcterm": "http://purl.org/dc/terms/",
        "course": `http://${hostname}/ld/courses/ontology#`,
        "foaf": "http://xmlns.com/foaf/spec/#",
        "cc": "http://creativecommons.org/ns#",
        "courseTeach": "teach:Course",
        "weeklyHours": "teach:weeklyHours",
        "title": "teach:courseTitle",
        "description": "teach: courseDescription",
        "academicTerm": "teach: academicTerm",
        "longitude": "geo:long",
        "latitude": "geo:lat",
        "startDate": "dbpedia: startDate",
        "endDate": "dbpedia: endDate",
        "numberOfCredits": "course:numberOfCredits",
        "level": "course:level",
        "relatedToInstitution": "course:relatedToInstitution",
        "relatedToFaculty": "course:relatedToFaculty",
        "relatedToDepartment": "course:relatedToDepartment",
        "relatedToMaterial": "course:relatedToMaterial",
        "relatedToStudent": "course:relatedToStudent",
        "building": "teach:building",
        "room": "teach:room",
        "country": "gn:parentCountry",
        "language": "dcterm:language",
        "teacher": "teach:teacher",
        "subject": "dcterm:subject",
        "teachingMethod": "course:hasTeachingMethod",
        "assessmentMethod": "course:assessmentMethod",
        "teachingLevel": "course:teachingLevel",
        "license": "cc:license"
    }
    container_coursesld['@context'] = context;


    let aux = await readfile("./files/raw_data/courses.json", 'utf8');

    let coursesld_graph = [];
    let courses_rawdata = JSON.parse(aux);

    courses_rawdata.forEach(course => {
        let courseld = {};
        courseld['@id'] = course['uri'];
        courseld['@type'] = 'courseTeach';
        courseld['title'] = course['denomination'];
        courseld['description'] = course['description'];
        courseld['numberOfCredits'] = course['numberofcredits'];
        courseld['level'] = course['level'];
        courseld['weeklyHours'] = course['weeklyhours'];
        courseld['startDate'] = course['startdate'];
        courseld['endDate'] = course['enddate'];
        courseld['language'] = course['language']['uri'];
        courseld['subject'] = course['subject']['uci_uri'];
        courseld['relatedToInstitution'] = course['university']['uri'];
        courseld['relatedToFaculty'] = course['faculty']['uri'];
        courseld['relatedToDepartment'] = course['department']['uri'];
        courseld['teachingMethod'] = course['teachingmethod']['uri'];
        courseld['building'] = course['building']['uri'];
        courseld['room'] = course['room']['uri'];
        courseld['longitude'] = course['lonposition'];
        courseld['latitude'] = course['latposition'];
        courseld['country'] = course['country'];
        courseld['assessmentMethod'] = course['assessmentmethod']['uri'];
        courseld['teachingLevel'] = course['teachinglevel'];
        courseld['license'] = course['license'];

        let teachers = [];
        course['courses_teachers'].forEach(course_teacher => {
            teachers.push(course_teacher['teacher']['uri']);
        })
        courseld['teacher'] = teachers;

        let materials = [];
        course['courses_materials'].forEach(course_material => {
            materials.push(course_material['material']['uri']);
        })
        courseld['relatedToMaterial'] = materials;

        let students = [];
        course['courses_students'].forEach(course_student => {
            students.push(course_student['student']['uri']);
        })
        courseld['relatedToStudent'] = students;

        let academicterms = [];
        course['courses_academicterms'].forEach(course_academicterm => {
            academicterms.push(course_academicterm['academicterm']['uci_uri']);
        })
        courseld['academicTerm'] = academicterms;

        coursesld_graph.push(courseld);

    });
    container_coursesld['@graph'] = coursesld_graph;
    await writeFile('./files/ld/courses/courses.jsonld', JSON.stringify(container_coursesld));

}
async function saveCoursesldTurtle() {

    let aux = await readfile("./files/raw_data/courses.json", 'utf8');
    let courses_rawdata = JSON.parse(aux);
    let tripleArrayString = [];

    courses_rawdata.forEach(course => {
        let tripleString = '';
        let space = ' ';
        let point = '.';

        tripleString = `<${course['uri']}>${space}<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>${space}<http://linkedscience.org/teach/ns#Course>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://linkedscience.org/teach/ns#courseTitle>${space}"${course['denomination']}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://linkedscience.org/teach/ns#courseDescription>${space}"${course['description']}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#numberOfCredits>${space}"${course['numberofcredits'].toString()}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#level>${space}"${course['level']}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://linkedscience.org/teach/ns#weeklyHours>${space}"${course['weeklyhours'].toString()}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://dbpedia.org/ontology/startDate>${space}"${course['startdate']}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://dbpedia.org/ontology/endDate>${space}"${course['enddate']}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://purl.org/dc/terms/language>${space}<${course['language']['uri']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://purl.org/dc/terms/subject>${space}<${course['subject']['uci_uri']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#relatedToInstitution>${space}<${course['university']['uri']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#relatedToFaculty>${space}<${course['faculty']['uri']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#relatedToDepartment>${space}<${course['department']['uri']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#hasTeachingMethod>${space}<${course['teachingmethod']['uri']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://linkedscience.org/teach/ns#building>${space}<${course['building']['uri']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://linkedscience.org/teach/ns#room>${space}<${course['room']['uri']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://www.w3.org/2003/01/geo/wgs84_pos#long>${space}"${course['lonposition'].toString()}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://www.w3.org/2003/01/geo/wgs84_pos#lat>${space}"${course['latposition'].toString()}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://www.geonames.org/ontology/parentCountry>${space}<${course['country']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#assessmentMethod>${space}<${course['assessmentmethod']['uri']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#teachingLevel>${space}"${course['teachinglevel']}"${space}${point}\n`;
        tripleArrayString.push(tripleString);

        tripleString = `<${course['uri']}>${space}<http://creativecommons.org/ns#license>${space}<${course['license']}>${space}${point}\n`;
        tripleArrayString.push(tripleString);

        let teachers = [];
        course['courses_teachers'].forEach(course_teacher => {
            teachers.push(course_teacher['teacher']);
        })
        teachers.forEach(teacher => {
            tripleString = `<${course['uri']}>${space}<http://linkedscience.org/teach/ns#teacher>${space}<${teacher['uri']}>${space}${point}\n`;
            tripleArrayString.push(tripleString);
        });

        let materials = [];
        course['courses_materials'].forEach(course_material => {
            materials.push(course_material['material']);
        })
        materials.forEach(material => {
            tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#relatedToMaterial>${space}<${material['uri']}>${space}${point}\n`;
            tripleArrayString.push(tripleString);
        });

        let students = [];
        course['courses_students'].forEach(course_student => {
            students.push(course_student['student']);
        })
        students.forEach(student => {
            tripleString = `<${course['uri']}>${space}<http://${hostname}/ld/courses/ontology#relatedToStudent>${space}<${student['uri']}>${space}${point}\n`;
            tripleArrayString.push(tripleString);
        });

        let academicterms = [];
        course['courses_academicterms'].forEach(course_academicterm => {
            academicterms.push(course_academicterm['academicterm']);
        })
        academicterms.forEach(academicterm => {
            tripleString = `<${course['uri']}>${space}<http://linkedscience.org/teach/ns#academicTerm>${space}<${academicterm['uci_uri']}>${space}${point}\n`;
            tripleArrayString.push(tripleString);
        });

    });
    let stringResult = '';
    tripleArrayString.forEach(aux => {
        stringResult += aux;
    });
    await writeFile('./files/ld/courses/courses.ttl', stringResult);

}
async function saveCoursesldn3(req, res) {

    let aux = await readfile("./files/raw_data/courses.json", 'utf8');
    let courses_rawdata = JSON.parse(aux);
    const writer = new N3.Writer();

    courses_rawdata.forEach(course => {
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('http://linkedscience.org/teach/ns#Course')
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://linkedscience.org/teach/ns#courseTitle'),
            literal(course['denomination'], namedNode('http://www.w3.org/2001/XMLSchema#string'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://linkedscience.org/teach/ns#courseDescription'),
            literal(course['description'], namedNode('http://www.w3.org/2001/XMLSchema#string'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode(`http://${hostname}/ld/courses/ontology#numberOfCredits`),
            literal(course['numberofcredits'], namedNode('http://www.w3.org/2001/XMLSchema#integer'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode(`http://${hostname}/ld/courses/ontology#level`),
            literal(course['level'], namedNode('http://www.w3.org/2001/XMLSchema#string'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://linkedscience.org/teach/ns#weeklyHours'),
            literal(course['weeklyhours'], namedNode('http://www.w3.org/2001/XMLSchema#integer'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://dbpedia.org/ontology/startDate'),
            literal(course['startdate'], namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://dbpedia.org/ontology/endDate'),
            literal(course['enddate'], namedNode('http://www.w3.org/2001/XMLSchema#dateTime'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://purl.org/dc/terms/language'),
            namedNode(course['language']['uri'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://purl.org/dc/terms/subject'),
            namedNode(course['subject']['uci_uri'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode(`http://${hostname}/ld/courses/ontology#relatedToInstitution`),
            namedNode(course['university']['uri'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode(`http://${hostname}/ld/courses/ontology#relatedToFaculty`),
            namedNode(course['faculty']['uri'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode(`http://${hostname}/ld/courses/ontology#relatedToDepartment`),
            namedNode(course['department']['uri'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode(`http://${hostname}/ld/courses/ontology#hasTeachingMethod`),
            namedNode(course['teachingmethod']['uri'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://linkedscience.org/teach/ns#building'),
            namedNode(course['building']['uri'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://linkedscience.org/teach/ns#room'),
            namedNode(course['room']['uri'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://www.w3.org/2003/01/geo/wgs84_pos#long'),
            literal(course['lonposition'], namedNode('http://www.w3.org/2001/XMLSchema#long'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://www.w3.org/2003/01/geo/wgs84_pos#lat'),
            literal(course['latposition'], namedNode('http://www.w3.org/2001/XMLSchema#long'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://www.geonames.org/ontology/parentCountry'),
            namedNode(course['country'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode(`http://${hostname}/ld/courses/ontology#assessmentMethod`),
            namedNode(course['assessmentmethod']['uri'])
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode(`http://${hostname}/ld/courses/ontology#teachingLevel`),
            literal(course['teachinglevel'], namedNode('http://www.w3.org/2001/XMLSchema#string'))
        );
        writer.addQuad(
            namedNode(course['uri']),
            namedNode('http://creativecommons.org/ns#license'),
            namedNode(course['license'])
        );

        let teachers = [];
        course['courses_teachers'].forEach(course_teacher => {
            teachers.push(course_teacher['teacher']);
        })
        teachers.forEach(teacher => {
            writer.addQuad(
                namedNode(course['uri']),
                namedNode('http://linkedscience.org/teach/ns#teacher'),
                namedNode(teacher['uri'])
            );
        });

        let materials = [];
        course['courses_materials'].forEach(course_material => {
            materials.push(course_material['material']);
        })
        materials.forEach(material => {
            writer.addQuad(
                namedNode(course['uri']),
                namedNode(`http://${hostname}/ld/courses/ontology#relatedToMaterial`),
                namedNode(material['uri'])
            );
        });

        let students = [];
        course['courses_students'].forEach(course_student => {
            students.push(course_student['student']);
        })
        students.forEach(student => {
            writer.addQuad(
                namedNode(course['uri']),
                namedNode(`http://${hostname}/ld/courses/ontology#relatedToStudent`),
                namedNode(student['uri'])
            );
        });

        let academicterms = [];
        course['courses_academicterms'].forEach(course_academicterm => {
            academicterms.push(course_academicterm['academicterm']);
        })
        academicterms.forEach(academicterm => {
            writer.addQuad(
                namedNode(course['uri']),
                namedNode('http://linkedscience.org/teach/ns#academicTerm'),
                namedNode(academicterm['uci_uri'])
            );
        });
    });
    writer.end((error, aux) => fs.writeFile("./files/ld/courses/courses.n3", aux, function (err) {
        if (err) {
            return console.log(err);
        }
    }));

}
async function saveCoursesldCSV() {

    let aux = await readfile("./files/raw_data/courses.json", 'utf8');
    let courses_rawdata = JSON.parse(aux);
    let csv = [];

    courses_rawdata.forEach(course => {
        let csvrow = '';
        let coma = ',';

        csvrow = `${course['uri']}${coma}${course['denomination']}${coma}${course['description']}${coma}${course['numberofcredits'].toString()}${coma}${course['level']}${coma}${course['weeklyhours'].toString()}${coma}${course['startdate'].toString()}${coma}${course['enddate'].toString()}${coma}${course['language']['uri']}${coma}${course['subject']['uci_uri']}${coma}${course['university']['uri']}${coma}${course['faculty']['uri']}${coma}${course['department']['uri']}${coma}${course['teachingmethod']['uri']}${coma}${course['building']['uri']}${coma}${course['room']['uri']}${coma}${course['lonposition'].toString()}${coma}${course['latposition'].toString()}${coma}${course['country']}${coma}${course['assessmentmethod']['uri']}${coma}${course['teachinglevel']}${coma}${course['license']}\n`;
        csv.push(csvrow);
    });
    let csvResult = '';
    csv.forEach(row => {
        csvResult += row;
    });
    await writeFile('./files/ld/courses/courses.csv', csvResult);
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