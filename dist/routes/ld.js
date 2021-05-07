"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _ld = require("../controllers/ld.controller");

var router = (0, _express.Router)();
router.get('/', _ld.getCatalog);
router.options('/*', function (req, res) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/ld+json'
  });
  res.sendStatus(200);
});
var _default = router;
exports["default"] = _default;