"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCourseOntology = getCourseOntology;
exports.getCourses = getCourses;

var _server_config = _interopRequireDefault(require("../../config_files/server_config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require("fs");

var util = require('util');

var readfile = util.promisify(fs.readFile);
var writeFile = util.promisify(fs.writeFile);
var hostname = _server_config["default"].hostname;

function getCourseOntology(_x, _x2) {
  return _getCourseOntology.apply(this, arguments);
}

function _getCourseOntology() {
  _getCourseOntology = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var courseOntologyDir, aux;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            courseOntologyDir = "./files/ld/ontologies/courseontology.ttl";

            if (!fs.existsSync(courseOntologyDir)) {
              _context.next = 9;
              break;
            }

            _context.next = 4;
            return readfile(courseOntologyDir, 'utf8');

          case 4:
            aux = _context.sent;
            res.set({
              'Content-Type': 'text/plain'
            });
            res.send(aux);
            _context.next = 10;
            break;

          case 9:
            res.json({
              "Message": "The file courseontology.ttl does not exist"
            });

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getCourseOntology.apply(this, arguments);
}

function getCourses(_x3, _x4) {
  return _getCourses.apply(this, arguments);
}

function _getCourses() {
  _getCourses = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var result, aux, _aux, _aux2, startDateQuery, subjectQuery, subjectFlag, index, dirInput, createDir, dirFragment, dirAllCourses, tempCourses, coursesld, courses, coursesQuery, tempArrayCourses, dir_save_fragments, startDateString, dir_save_fragments_array, i, dir_aux, temp_dir, aux_courses_fragments, _aux3, index_aux, _i, params;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            result = {};

            if (!(req['headers']['accept'] === 'text/plain')) {
              _context2.next = 13;
              break;
            }

            if (!fs.existsSync('./files/ld/courses/courses.ttl')) {
              _context2.next = 10;
              break;
            }

            _context2.next = 5;
            return readfile("./files/ld/courses/courses.ttl", 'utf8');

          case 5:
            aux = _context2.sent;
            res.set({
              'Content-Type': 'text/plain'
            });
            res.send(aux);
            _context2.next = 11;
            break;

          case 10:
            res.json({
              "Message": "The file courses.ttl does not exist"
            });

          case 11:
            _context2.next = 115;
            break;

          case 13:
            if (!(req['headers']['accept'] === 'text/n3')) {
              _context2.next = 25;
              break;
            }

            if (!fs.existsSync('./files/ld/courses/courses.n3')) {
              _context2.next = 22;
              break;
            }

            _context2.next = 17;
            return readfile("./files/ld/courses/courses.n3", 'utf8');

          case 17:
            _aux = _context2.sent;
            res.set({
              'Content-Type': 'text/n3'
            });
            res.send(_aux);
            _context2.next = 23;
            break;

          case 22:
            res.json({
              "Message": "The file courses.n3 does not exist"
            });

          case 23:
            _context2.next = 115;
            break;

          case 25:
            if (!(req['headers']['accept'] === 'text/csv')) {
              _context2.next = 37;
              break;
            }

            if (!fs.existsSync('./files/ld/courses/courses.csv')) {
              _context2.next = 34;
              break;
            }

            _context2.next = 29;
            return readfile("./files/ld/courses/courses.csv", 'utf8');

          case 29:
            _aux2 = _context2.sent;
            res.set({
              'Content-Type': 'text/csv'
            });
            res.send(_aux2);
            _context2.next = 35;
            break;

          case 34:
            res.json({
              "Message": "The file courses.csv does not exist"
            });

          case 35:
            _context2.next = 115;
            break;

          case 37:
            startDateQuery = new Date(req.query.startDate);
            if (startDateQuery.toString() === 'Invalid Date') startDateQuery = new Date();
            subjectQuery = "";
            subjectFlag = false;

            if (req.query.subject) {
              subjectQuery = req.query.subject;
              subjectFlag = true;
            }

            index = 0;
            if (req.query.index) if (parseInt(req.query.index)) index = parseInt(req.query.index);
            _context2.next = 46;
            return getDir(startDateQuery, subjectQuery);

          case 46:
            dirInput = _context2.sent;
            createDir = true;
            checkIfDirectoryExists(dirInput, function () {
              createDir = false;
            }, function () {});
            _context2.next = 51;
            return getDirFragment(startDateQuery, subjectQuery, index);

          case 51:
            dirFragment = _context2.sent;
            if (!fs.existsSync(dirFragment)) createDir = true;
            dirAllCourses = "./files/ld/courses/courses.jsonld";
            tempCourses = "";

            if (!fs.existsSync(dirAllCourses)) {
              _context2.next = 59;
              break;
            }

            _context2.next = 58;
            return readfile(dirAllCourses, 'utf8');

          case 58:
            tempCourses = _context2.sent;

          case 59:
            coursesld = JSON.parse(tempCourses);
            courses = coursesld['@graph'];
            coursesQuery = [];
            tempArrayCourses = [];
            dir_save_fragments = "";
            startDateString = startDateQuery.toISOString();
            if (subjectFlag) dir_save_fragments = "./fragments/both/".concat(startDateString, "/").concat(subjectQuery, "/");else dir_save_fragments = "./fragments/startDates/".concat(startDateString, "/");

            if (!createDir) {
              _context2.next = 110;
              break;
            }

            coursesQuery = courses.slice();

            if (!subjectFlag) {
              _context2.next = 72;
              break;
            }

            _context2.next = 71;
            return coursesBySubject(courses, subjectQuery);

          case 71:
            coursesQuery = _context2.sent;

          case 72:
            tempArrayCourses = coursesQuery.slice();
            _context2.next = 75;
            return sortByStartDate(coursesQuery, startDateQuery);

          case 75:
            tempArrayCourses = _context2.sent;
            coursesQuery = tempArrayCourses.slice();

            if (!(coursesQuery.length > 0)) {
              _context2.next = 110;
              break;
            }

            //crear directorios
            dir_save_fragments_array = dir_save_fragments.split('/');
            i = 1;

          case 80:
            if (!(i < dir_save_fragments_array.length - 1)) {
              _context2.next = 88;
              break;
            }

            _context2.next = 83;
            return concatenarHastaPos(dir_save_fragments, i);

          case 83:
            dir_aux = _context2.sent;
            mkdirIfNotExists(dir_aux);

          case 85:
            i++;
            _context2.next = 80;
            break;

          case 88:
            temp_dir = '';
            aux_courses_fragments = [];
            _aux3 = [];
            index_aux = 0; //Crear fragmentos

            _i = 0;

          case 93:
            if (!(_i < coursesQuery.length)) {
              _context2.next = 110;
              break;
            }

            temp_dir = dir_save_fragments;
            aux_courses_fragments.push(coursesQuery[_i]);

            if (!(_i !== 0 && (_i + 1) % 5 === 0)) {
              _context2.next = 102;
              break;
            }

            temp_dir += index_aux.toString();
            _context2.next = 100;
            return writeFile(temp_dir + '.json', JSON.stringify(aux_courses_fragments));

          case 100:
            aux_courses_fragments = _aux3.slice();
            index_aux++;

          case 102:
            if (!(_i === coursesQuery.length - 1)) {
              _context2.next = 107;
              break;
            }

            if (!(aux_courses_fragments.length > 0)) {
              _context2.next = 107;
              break;
            }

            temp_dir += index_aux.toString();
            _context2.next = 107;
            return writeFile(temp_dir + '.json', JSON.stringify(aux_courses_fragments));

          case 107:
            _i++;
            _context2.next = 93;
            break;

          case 110:
            params = {
              hostname: hostname,
              startDate: startDateQuery,
              subject: subjectQuery,
              index: index,
              dir: dir_save_fragments
            }; //result = await addHydraMetada(params);

            _context2.next = 113;
            return addTreeMetada(params);

          case 113:
            result = _context2.sent;
            res.json(result);

          case 115:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getCourses.apply(this, arguments);
}

function addHydraMetada(_x5) {
  return _addHydraMetada.apply(this, arguments);
}

function _addHydraMetada() {
  _addHydraMetada = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(params) {
    var result, template, jsonld_skeleton, _hostname, startDate, subject, index, dir, dir_next, dir_previous, existNextFragment, existPreviousFragment, courses_ld, urlResult, courses_fragment;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            result = {};
            _context3.prev = 1;
            _context3.next = 4;
            return readfile('./config_files/skeleton.jsonld', {
              encoding: 'utf8'
            });

          case 4:
            template = _context3.sent;
            jsonld_skeleton = JSON.parse(template);
            _hostname = params.hostname;
            startDate = params.startDate;
            subject = params.subject;
            index = params.index;
            dir = params.dir + index.toString() + '.json';
            dir_next = params.dir + (index + 1).toString() + '.json';
            dir_previous = params.dir + (index - 1).toString() + '.json';
            existNextFragment = false;
            existPreviousFragment = false;
            courses_ld = {};
            urlResult = "";

            if (!fs.existsSync(dir)) {
              _context3.next = 31;
              break;
            }

            if (fs.existsSync(dir_next)) existNextFragment = true;
            if (fs.existsSync(dir_previous)) existPreviousFragment = true;
            _context3.next = 22;
            return readfile(dir, {
              encoding: 'utf8'
            });

          case 22:
            courses_fragment = _context3.sent;
            courses_ld = JSON.parse(courses_fragment);
            if (subject !== "") urlResult = "http://".concat(_hostname, "/ld/courses?startDate=").concat(startDate.toISOString(), "&subject=").concat(subject);else urlResult = "http://".concat(_hostname, "/ld/courses?startDate=").concat(startDate.toISOString());
            jsonld_skeleton['@id'] = urlResult + "&index=".concat(index.toString());

            if (existNextFragment) {
              jsonld_skeleton['hydra:next'] = urlResult + "&index=".concat((index + 1).toString());
            } else {
              delete jsonld_skeleton['hydra:next'];
            }

            if (existPreviousFragment) {
              jsonld_skeleton['hydra:previous'] = urlResult + "&index=".concat((index - 1).toString());
            } else {
              delete jsonld_skeleton['hydra:previous'];
            }

            jsonld_skeleton['hydra:search']['hydra:template'] = _hostname + '/ld/courses?startDate={startDate}&subject={subject}';
            jsonld_skeleton['@graph'] = courses_ld;
            result['Courses hydra jsonld'] = jsonld_skeleton;

          case 31:
            return _context3.abrupt("return", result);

          case 34:
            _context3.prev = 34;
            _context3.t0 = _context3["catch"](1);
            console.error(_context3.t0);
            throw _context3.t0;

          case 38:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 34]]);
  }));
  return _addHydraMetada.apply(this, arguments);
}

function addTreeMetada(_x6) {
  return _addTreeMetada.apply(this, arguments);
}

function _addTreeMetada() {
  _addTreeMetada = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(params) {
    var result, template, jsonld_skeleton, _hostname2, startDate, subject, index, dir, dir_next, dir_previous, existNextFragment, existPreviousFragment, courses_ld, urlResult, leastDateActualFragment, greaterDateActualFragment, cantCourses, params_relation, courses_fragment;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            result = {};
            _context4.prev = 1;
            _context4.next = 4;
            return readfile('./config_files/skeleton_tree.jsonld', {
              encoding: 'utf8'
            });

          case 4:
            template = _context4.sent;
            jsonld_skeleton = JSON.parse(template);
            _hostname2 = params.hostname;
            startDate = params.startDate;
            subject = params.subject;
            index = params.index;
            dir = params.dir + index.toString() + '.json';
            dir_next = params.dir + (index + 1).toString() + '.json';
            dir_previous = params.dir + (index - 1).toString() + '.json';
            existNextFragment = false;
            existPreviousFragment = false;
            courses_ld = {};
            urlResult = "";
            leastDateActualFragment = "";
            greaterDateActualFragment = "";
            cantCourses = 0;
            params_relation = {};

            if (!fs.existsSync(dir)) {
              _context4.next = 61;
              break;
            }

            if (fs.existsSync(dir_next)) existNextFragment = true;
            if (fs.existsSync(dir_previous)) existPreviousFragment = true;
            _context4.next = 26;
            return readfile(dir, {
              encoding: 'utf8'
            });

          case 26:
            courses_fragment = _context4.sent;
            courses_ld = JSON.parse(courses_fragment);
            cantCourses = Object.keys(courses_ld).length;

            if (cantCourses > 0) {
              leastDateActualFragment = courses_ld[0]['startDate'];
              greaterDateActualFragment = courses_ld[cantCourses - 1]['startDate'];
            }

            if (subject !== "") urlResult = "http://".concat(_hostname2, "/ld/courses?startDate=").concat(startDate.toISOString(), "&subject=").concat(subject);else urlResult = "http://".concat(_hostname2, "/ld/courses?startDate=").concat(startDate.toISOString());
            jsonld_skeleton['@id'] = urlResult;
            jsonld_skeleton['rdfs:label'] = "Courses collection by startdate ".concat(startDate, " and subject ").concat(subject), jsonld_skeleton['tree:view']['@id'] = urlResult + "&index=".concat(index.toString());

            if (!existNextFragment) {
              _context4.next = 46;
              break;
            }

            params_relation = {
              type: "tree:GreaterThanOrEqualToRelation",
              node: urlResult + "&index=".concat((index + 1).toString()),
              path: "startDate",
              value: greaterDateActualFragment
            };
            _context4.t0 = jsonld_skeleton['tree:view']['tree:relation'];
            _context4.next = 38;
            return getTreeRelation(params_relation);

          case 38:
            _context4.t1 = _context4.sent;

            _context4.t0.push.call(_context4.t0, _context4.t1);

            params_relation = {
              type: "tree:EqualThanRelation",
              node: urlResult + "&index=".concat((index + 1).toString()),
              path: "subject",
              value: subject
            };
            _context4.t2 = jsonld_skeleton['tree:view']['tree:relation'];
            _context4.next = 44;
            return getTreeRelation(params_relation);

          case 44:
            _context4.t3 = _context4.sent;

            _context4.t2.push.call(_context4.t2, _context4.t3);

          case 46:
            if (!existPreviousFragment) {
              _context4.next = 59;
              break;
            }

            params_relation = {
              type: "tree:LessThanOrEqualToRelation",
              node: urlResult + "&index=".concat((index - 1).toString()),
              path: "startDate",
              value: leastDateActualFragment
            };
            _context4.t4 = jsonld_skeleton['tree:view']['tree:relation'];
            _context4.next = 51;
            return getTreeRelation(params_relation);

          case 51:
            _context4.t5 = _context4.sent;

            _context4.t4.push.call(_context4.t4, _context4.t5);

            params_relation = {
              type: "tree:EqualThanRelation",
              node: urlResult + "&index=".concat((index - 1).toString()),
              path: "subject",
              value: subject
            };
            _context4.t6 = jsonld_skeleton['tree:view']['tree:relation'];
            _context4.next = 57;
            return getTreeRelation(params_relation);

          case 57:
            _context4.t7 = _context4.sent;

            _context4.t6.push.call(_context4.t6, _context4.t7);

          case 59:
            jsonld_skeleton['hydra:member'] = courses_ld;
            result['Courses tree jsonld'] = jsonld_skeleton;

          case 61:
            return _context4.abrupt("return", result);

          case 64:
            _context4.prev = 64;
            _context4.t8 = _context4["catch"](1);
            console.error(_context4.t8);
            throw _context4.t8;

          case 68:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 64]]);
  }));
  return _addTreeMetada.apply(this, arguments);
}

function getTreeRelation(_x7) {
  return _getTreeRelation.apply(this, arguments);
}

function _getTreeRelation() {
  _getTreeRelation = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(params) {
    var result, type, node, path, value;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            result = {};
            type = params.type;
            node = params.node;
            path = params.path;
            value = params.value;
            result["@type"] = type;
            result["tree:node"] = node;
            result["tree:path"] = path;
            result["tree:value"] = value;
            return _context5.abrupt("return", result);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getTreeRelation.apply(this, arguments);
}

function getDir(_x8, _x9) {
  return _getDir.apply(this, arguments);
}

function _getDir() {
  _getDir = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(startDateQuery, subjectQuery) {
    var dir_save_fragments, startDateString;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            dir_save_fragments = "";
            startDateString = startDateQuery.toISOString();
            if (subjectQuery !== "") dir_save_fragments = "./fragments/both/".concat(startDateString, "/").concat(subjectQuery, "/");else dir_save_fragments = "./fragments/startDates/".concat(startDateString, "/");
            return _context6.abrupt("return", dir_save_fragments);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _getDir.apply(this, arguments);
}

function getDirFragment(_x10, _x11, _x12) {
  return _getDirFragment.apply(this, arguments);
}

function _getDirFragment() {
  _getDirFragment = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(startDateQuery, subjectQuery, index) {
    var dir_save_fragments, startDateString;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            dir_save_fragments = "";
            startDateString = startDateQuery.toISOString();
            if (subjectQuery !== "") dir_save_fragments = "./fragments/both/".concat(startDateString, "/").concat(subjectQuery, "/");else dir_save_fragments = "./fragments/startDates/".concat(startDateString, "/");
            dir_save_fragments += "".concat(index.toString(), ".json");
            return _context7.abrupt("return", dir_save_fragments);

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));
  return _getDirFragment.apply(this, arguments);
}

function concatenarHastaPos(_x13, _x14) {
  return _concatenarHastaPos.apply(this, arguments);
}

function _concatenarHastaPos() {
  _concatenarHastaPos = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(dirPath, pos) {
    var result, a, i;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            result = '';
            a = dirPath.split('/');

            for (i = 0; i <= pos; i++) {
              result += a[i] + '/';
            }

            return _context8.abrupt("return", result);

          case 4:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
  return _concatenarHastaPos.apply(this, arguments);
}

function mkdirIfNotExists(_x15) {
  return _mkdirIfNotExists.apply(this, arguments);
}

function _mkdirIfNotExists() {
  _mkdirIfNotExists = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(dirPath) {
    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            return _context9.abrupt("return", new Promise(function (resolve, reject) {
              checkIfDirectoryExists(dirPath, function () {
                resolve();
              }, function () {
                fs.mkdirSync(dirPath);
                resolve();
              });
            }));

          case 1:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9);
  }));
  return _mkdirIfNotExists.apply(this, arguments);
}

function checkIfDirectoryExists(_x16, _x17, _x18) {
  return _checkIfDirectoryExists.apply(this, arguments);
}

function _checkIfDirectoryExists() {
  _checkIfDirectoryExists = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(dirPath, successCallback, errorCallback) {
    var stats;
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
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
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _checkIfDirectoryExists.apply(this, arguments);
}

function sortByStartDate(_x19, _x20) {
  return _sortByStartDate.apply(this, arguments);
}

function _sortByStartDate() {
  _sortByStartDate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(courses, startDateQuery) {
    var result;
    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            result = [];
            courses.forEach(function (course) {
              console.log("course['startDate']" + course['startDate'] + "         " + "startDateQuery" + startDateQuery);
              if (new Date(course['startDate']) >= startDateQuery) result.push(course);
            });
            result.sort(function (a, b) {
              if (a['startDate'] < b['startDate']) return -1;
            });
            return _context11.abrupt("return", result);

          case 4:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11);
  }));
  return _sortByStartDate.apply(this, arguments);
}

function coursesBySubject(_x21, _x22) {
  return _coursesBySubject.apply(this, arguments);
}

function _coursesBySubject() {
  _coursesBySubject = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(courses, subject) {
    var result;
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            result = [];
            courses.forEach(function (course) {
              var array_len = course['subject'].split('/').length;
              var subjectDenomination = course['subject'].split('/')[array_len - 1];

              if (subjectDenomination.toLowerCase() === subject.toLowerCase()) {
                result.push(course);
              }
            });
            return _context12.abrupt("return", result);

          case 3:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));
  return _coursesBySubject.apply(this, arguments);
}