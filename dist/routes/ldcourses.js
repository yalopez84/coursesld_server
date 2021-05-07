"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _ldcourse = require("../controllers/ldcourse.controller");

var router = (0, _express.Router)();
router.get('/', _ldcourse.getCourses);
router.get('/ontology', _ldcourse.getCourseOntology);
router.options('/*', function (req, res) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*'
  });
  res.sendStatus(200);
});
var _default = router;
exports["default"] = _default;