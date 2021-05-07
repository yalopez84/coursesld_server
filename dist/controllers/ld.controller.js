"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCatalog = getCatalog;

var _server_config = _interopRequireDefault(require("../../config_files/server_config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var N3 = require('n3');

var DataFactory = N3.DataFactory;
var namedNode = DataFactory.namedNode,
    literal = DataFactory.literal;

var fs = require("fs");

var util = require('util');

var readfile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);
var hostname = _server_config["default"].hostname;

function getCatalog(_x, _x2) {
  return _getCatalog.apply(this, arguments);
}

function _getCatalog() {
  _getCatalog = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var catalog, dataset_courses;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            catalog = {
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
              "@id": "https://".concat(hostname, "/ld/catalog"),
              "@type": "Catalog",
              "title": "Catalog of University of the Informatics Science linked datasets",
              "description": "List of linked datasets",
              "modified": new Date().toISOString(),
              "license": "http://creativecommons.org/publicdomain/zero/1.0/",
              "accessRights": "access:PUBLIC",
              "publisher": {
                "@id": "http://".concat(hostname, "/ld/universities/uci"),
                "@type": "Institution",
                "name": "University of the Informatics Science"
              },
              "dataset": []
            };
            dataset_courses = {
              "@id": "http://".concat(hostname, "/ld/courses"),
              "@type": "Dataset",
              "subject": "Course",
              "description": "Courses dataset of UCI",
              "title": "Courses dataset of UCI",
              "spatial": "",
              "keyword": "course",
              "conformsTo": "http://".concat(hostname, "/ld/courses/ontology"),
              "accessRights": "access:PUBLIC",
              "license": "http://creativecommons.org/publicdomain/zero/1.0/",
              "temporalRange": {
                "@type": "TimePeriod",
                "startDate": "01/01/2021",
                "endDate": "31/12/2025"
              },
              "dcat:distribution": {
                "@id": "http://".concat(hostname, "/ld/courses/distributions/01"),
                "@type": "Distribution",
                "accessURL": "http://".concat(hostname, "/ld/courses"),
                "mediaType": ["ianaMediaType:application/ld+json", "ianaMediaType:text/turtle", "ianaMediaType: text/n3", "ianaMediaType: text/csv"]
              }
            };
            catalog['dataset'].push(dataset_courses);
            saveDatasets();
            res.header("Content-Type", "application/ld+json; charset=utf-8");
            res.json(catalog);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getCatalog.apply(this, arguments);
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

function saveCoursesldJsonLD() {
  return _saveCoursesldJsonLD.apply(this, arguments);
}

function _saveCoursesldJsonLD() {
  _saveCoursesldJsonLD = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var container_coursesld, context, aux, coursesld_graph, courses_rawdata;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            container_coursesld = {};
            context = {
              "teach": "http://linkedscience.org/teach/ns#",
              "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
              "gn": "http://www.geonames.org/ontology/",
              "dbpedia": "http://dbpedia.org/ontology/",
              "aiiso": "http://purl.org/vocab/aiiso/schema#",
              "dcterm": "http://purl.org/dc/terms/",
              "course": "http://".concat(hostname, "/ld/courses/ontology#"),
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
            };
            container_coursesld['@context'] = context;
            _context2.next = 5;
            return readfile("./files/raw_data/courses.json", 'utf8');

          case 5:
            aux = _context2.sent;
            coursesld_graph = [];
            courses_rawdata = JSON.parse(aux);
            courses_rawdata.forEach(function (course) {
              var courseld = {};
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
              var teachers = [];
              course['courses_teachers'].forEach(function (course_teacher) {
                teachers.push(course_teacher['teacher']['uri']);
              });
              courseld['teacher'] = teachers;
              var materials = [];
              course['courses_materials'].forEach(function (course_material) {
                materials.push(course_material['material']['uri']);
              });
              courseld['relatedToMaterial'] = materials;
              var students = [];
              course['courses_students'].forEach(function (course_student) {
                students.push(course_student['student']['uri']);
              });
              courseld['relatedToStudent'] = students;
              var academicterms = [];
              course['courses_academicterms'].forEach(function (course_academicterm) {
                academicterms.push(course_academicterm['academicterm']['uci_uri']);
              });
              courseld['academicTerm'] = academicterms;
              coursesld_graph.push(courseld);
            });
            container_coursesld['@graph'] = coursesld_graph;
            _context2.next = 12;
            return writeFile('./files/ld/courses/courses.jsonld', JSON.stringify(container_coursesld));

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _saveCoursesldJsonLD.apply(this, arguments);
}

function saveCoursesldTurtle() {
  return _saveCoursesldTurtle.apply(this, arguments);
}

function _saveCoursesldTurtle() {
  _saveCoursesldTurtle = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var aux, courses_rawdata, tripleArrayString, stringResult;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return readfile("./files/raw_data/courses.json", 'utf8');

          case 2:
            aux = _context3.sent;
            courses_rawdata = JSON.parse(aux);
            tripleArrayString = [];
            courses_rawdata.forEach(function (course) {
              var tripleString = '';
              var space = ' ';
              var point = '.';
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>").concat(space, "<http://linkedscience.org/teach/ns#Course>").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://linkedscience.org/teach/ns#courseTitle>").concat(space, "\"").concat(course['denomination'], "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://linkedscience.org/teach/ns#courseDescription>").concat(space, "\"").concat(course['description'], "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#numberOfCredits>").concat(space, "\"").concat(course['numberofcredits'].toString(), "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#level>").concat(space, "\"").concat(course['level'], "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://linkedscience.org/teach/ns#weeklyHours>").concat(space, "\"").concat(course['weeklyhours'].toString(), "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://dbpedia.org/ontology/startDate>").concat(space, "\"").concat(course['startdate'], "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://dbpedia.org/ontology/endDate>").concat(space, "\"").concat(course['enddate'], "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://purl.org/dc/terms/language>").concat(space, "<").concat(course['language']['uri'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://purl.org/dc/terms/subject>").concat(space, "<").concat(course['subject']['uci_uri'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#relatedToInstitution>").concat(space, "<").concat(course['university']['uri'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#relatedToFaculty>").concat(space, "<").concat(course['faculty']['uri'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#relatedToDepartment>").concat(space, "<").concat(course['department']['uri'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#hasTeachingMethod>").concat(space, "<").concat(course['teachingmethod']['uri'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://linkedscience.org/teach/ns#building>").concat(space, "<").concat(course['building']['uri'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://linkedscience.org/teach/ns#room>").concat(space, "<").concat(course['room']['uri'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://www.w3.org/2003/01/geo/wgs84_pos#long>").concat(space, "\"").concat(course['lonposition'].toString(), "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://www.w3.org/2003/01/geo/wgs84_pos#lat>").concat(space, "\"").concat(course['latposition'].toString(), "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://www.geonames.org/ontology/parentCountry>").concat(space, "<").concat(course['country'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#assessmentMethod>").concat(space, "<").concat(course['assessmentmethod']['uri'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#teachingLevel>").concat(space, "\"").concat(course['teachinglevel'], "\"").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              tripleString = "<".concat(course['uri'], ">").concat(space, "<http://creativecommons.org/ns#license>").concat(space, "<").concat(course['license'], ">").concat(space).concat(point, "\n");
              tripleArrayString.push(tripleString);
              var teachers = [];
              course['courses_teachers'].forEach(function (course_teacher) {
                teachers.push(course_teacher['teacher']);
              });
              teachers.forEach(function (teacher) {
                tripleString = "<".concat(course['uri'], ">").concat(space, "<http://linkedscience.org/teach/ns#teacher>").concat(space, "<").concat(teacher['uri'], ">").concat(space).concat(point, "\n");
                tripleArrayString.push(tripleString);
              });
              var materials = [];
              course['courses_materials'].forEach(function (course_material) {
                materials.push(course_material['material']);
              });
              materials.forEach(function (material) {
                tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#relatedToMaterial>").concat(space, "<").concat(material['uri'], ">").concat(space).concat(point, "\n");
                tripleArrayString.push(tripleString);
              });
              var students = [];
              course['courses_students'].forEach(function (course_student) {
                students.push(course_student['student']);
              });
              students.forEach(function (student) {
                tripleString = "<".concat(course['uri'], ">").concat(space, "<http://").concat(hostname, "/ld/courses/ontology#relatedToStudent>").concat(space, "<").concat(student['uri'], ">").concat(space).concat(point, "\n");
                tripleArrayString.push(tripleString);
              });
              var academicterms = [];
              course['courses_academicterms'].forEach(function (course_academicterm) {
                academicterms.push(course_academicterm['academicterm']);
              });
              academicterms.forEach(function (academicterm) {
                tripleString = "<".concat(course['uri'], ">").concat(space, "<http://linkedscience.org/teach/ns#academicTerm>").concat(space, "<").concat(academicterm['uci_uri'], ">").concat(space).concat(point, "\n");
                tripleArrayString.push(tripleString);
              });
            });
            stringResult = '';
            tripleArrayString.forEach(function (aux) {
              stringResult += aux;
            });
            _context3.next = 10;
            return writeFile('./files/ld/courses/courses.ttl', stringResult);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _saveCoursesldTurtle.apply(this, arguments);
}

function saveCoursesldn3(_x3, _x4) {
  return _saveCoursesldn.apply(this, arguments);
}

function _saveCoursesldn() {
  _saveCoursesldn = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var aux, courses_rawdata, writer;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return readfile("./files/raw_data/courses.json", 'utf8');

          case 2:
            aux = _context4.sent;
            courses_rawdata = JSON.parse(aux);
            writer = new N3.Writer();
            courses_rawdata.forEach(function (course) {
              writer.addQuad(namedNode(course['uri']), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://linkedscience.org/teach/ns#Course'));
              writer.addQuad(namedNode(course['uri']), namedNode('http://linkedscience.org/teach/ns#courseTitle'), literal(course['denomination'], namedNode('http://www.w3.org/2001/XMLSchema#string')));
              writer.addQuad(namedNode(course['uri']), namedNode('http://linkedscience.org/teach/ns#courseDescription'), literal(course['description'], namedNode('http://www.w3.org/2001/XMLSchema#string')));
              writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#numberOfCredits")), literal(course['numberofcredits'], namedNode('http://www.w3.org/2001/XMLSchema#integer')));
              writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#level")), literal(course['level'], namedNode('http://www.w3.org/2001/XMLSchema#string')));
              writer.addQuad(namedNode(course['uri']), namedNode('http://linkedscience.org/teach/ns#weeklyHours'), literal(course['weeklyhours'], namedNode('http://www.w3.org/2001/XMLSchema#integer')));
              writer.addQuad(namedNode(course['uri']), namedNode('http://dbpedia.org/ontology/startDate'), literal(course['startdate'], namedNode('http://www.w3.org/2001/XMLSchema#dateTime')));
              writer.addQuad(namedNode(course['uri']), namedNode('http://dbpedia.org/ontology/endDate'), literal(course['enddate'], namedNode('http://www.w3.org/2001/XMLSchema#dateTime')));
              writer.addQuad(namedNode(course['uri']), namedNode('http://purl.org/dc/terms/language'), namedNode(course['language']['uri']));
              writer.addQuad(namedNode(course['uri']), namedNode('http://purl.org/dc/terms/subject'), namedNode(course['subject']['uci_uri']));
              writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#relatedToInstitution")), namedNode(course['university']['uri']));
              writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#relatedToFaculty")), namedNode(course['faculty']['uri']));
              writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#relatedToDepartment")), namedNode(course['department']['uri']));
              writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#hasTeachingMethod")), namedNode(course['teachingmethod']['uri']));
              writer.addQuad(namedNode(course['uri']), namedNode('http://linkedscience.org/teach/ns#building'), namedNode(course['building']['uri']));
              writer.addQuad(namedNode(course['uri']), namedNode('http://linkedscience.org/teach/ns#room'), namedNode(course['room']['uri']));
              writer.addQuad(namedNode(course['uri']), namedNode('http://www.w3.org/2003/01/geo/wgs84_pos#long'), literal(course['lonposition'], namedNode('http://www.w3.org/2001/XMLSchema#long')));
              writer.addQuad(namedNode(course['uri']), namedNode('http://www.w3.org/2003/01/geo/wgs84_pos#lat'), literal(course['latposition'], namedNode('http://www.w3.org/2001/XMLSchema#long')));
              writer.addQuad(namedNode(course['uri']), namedNode('http://www.geonames.org/ontology/parentCountry'), namedNode(course['country']));
              writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#assessmentMethod")), namedNode(course['assessmentmethod']['uri']));
              writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#teachingLevel")), literal(course['teachinglevel'], namedNode('http://www.w3.org/2001/XMLSchema#string')));
              writer.addQuad(namedNode(course['uri']), namedNode('http://creativecommons.org/ns#license'), namedNode(course['license']));
              var teachers = [];
              course['courses_teachers'].forEach(function (course_teacher) {
                teachers.push(course_teacher['teacher']);
              });
              teachers.forEach(function (teacher) {
                writer.addQuad(namedNode(course['uri']), namedNode('http://linkedscience.org/teach/ns#teacher'), namedNode(teacher['uri']));
              });
              var materials = [];
              course['courses_materials'].forEach(function (course_material) {
                materials.push(course_material['material']);
              });
              materials.forEach(function (material) {
                writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#relatedToMaterial")), namedNode(material['uri']));
              });
              var students = [];
              course['courses_students'].forEach(function (course_student) {
                students.push(course_student['student']);
              });
              students.forEach(function (student) {
                writer.addQuad(namedNode(course['uri']), namedNode("http://".concat(hostname, "/ld/courses/ontology#relatedToStudent")), namedNode(student['uri']));
              });
              var academicterms = [];
              course['courses_academicterms'].forEach(function (course_academicterm) {
                academicterms.push(course_academicterm['academicterm']);
              });
              academicterms.forEach(function (academicterm) {
                writer.addQuad(namedNode(course['uri']), namedNode('http://linkedscience.org/teach/ns#academicTerm'), namedNode(academicterm['uci_uri']));
              });
            });
            writer.end(function (error, aux) {
              return fs.writeFile("./files/ld/courses/courses.n3", aux, function (err) {
                if (err) {
                  return console.log(err);
                }
              });
            });

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _saveCoursesldn.apply(this, arguments);
}

function saveCoursesldCSV() {
  return _saveCoursesldCSV.apply(this, arguments);
}

function _saveCoursesldCSV() {
  _saveCoursesldCSV = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var aux, courses_rawdata, csv, csvResult;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return readfile("./files/raw_data/courses.json", 'utf8');

          case 2:
            aux = _context5.sent;
            courses_rawdata = JSON.parse(aux);
            csv = [];
            courses_rawdata.forEach(function (course) {
              var csvrow = '';
              var coma = ',';
              csvrow = "".concat(course['uri']).concat(coma).concat(course['denomination']).concat(coma).concat(course['description']).concat(coma).concat(course['numberofcredits'].toString()).concat(coma).concat(course['level']).concat(coma).concat(course['weeklyhours'].toString()).concat(coma).concat(course['startdate'].toString()).concat(coma).concat(course['enddate'].toString()).concat(coma).concat(course['language']['uri']).concat(coma).concat(course['subject']['uci_uri']).concat(coma).concat(course['university']['uri']).concat(coma).concat(course['faculty']['uri']).concat(coma).concat(course['department']['uri']).concat(coma).concat(course['teachingmethod']['uri']).concat(coma).concat(course['building']['uri']).concat(coma).concat(course['room']['uri']).concat(coma).concat(course['lonposition'].toString()).concat(coma).concat(course['latposition'].toString()).concat(coma).concat(course['country']).concat(coma).concat(course['assessmentmethod']['uri']).concat(coma).concat(course['teachinglevel']).concat(coma).concat(course['license'], "\n");
              csv.push(csvrow);
            });
            csvResult = '';
            csv.forEach(function (row) {
              csvResult += row;
            });
            _context5.next = 10;
            return writeFile('./files/ld/courses/courses.csv', csvResult);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _saveCoursesldCSV.apply(this, arguments);
}

function mkdirIfNotExists(_x5) {
  return _mkdirIfNotExists.apply(this, arguments);
}

function _mkdirIfNotExists() {
  _mkdirIfNotExists = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(dirPath) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            return _context6.abrupt("return", new Promise(function (resolve, reject) {
              checkIfDirectoryExists(dirPath, function () {
                resolve();
              }, function () {
                fs.mkdirSync(dirPath);
                resolve();
              });
            }));

          case 1:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _mkdirIfNotExists.apply(this, arguments);
}

function checkIfDirectoryExists(_x6, _x7, _x8) {
  return _checkIfDirectoryExists.apply(this, arguments);
}

function _checkIfDirectoryExists() {
  _checkIfDirectoryExists = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(dirPath, successCallback, errorCallback) {
    var stats;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            try {
              // Query the entry
              stats = fs.lstatSync(dirPath); // Is it a directory?

              if (stats.isDirectory()) {
                successCallback();
              }
            } catch (e) {
              errorCallback();
            }

          case 1:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _checkIfDirectoryExists.apply(this, arguments);
}