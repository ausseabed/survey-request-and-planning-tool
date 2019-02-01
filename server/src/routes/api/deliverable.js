var express = require('express');
var _ = require('lodash');
const boom = require('boom');

import { getConnection } from 'typeorm';

import { asyncMiddleware, isAuthenticated }
  from '../utils';

const deliverableDefinitionList = [
  {
    id: "a",
    name: "Coverage extent",
    description: "foo bar",
    public: true,
    organisation: "org1",
    fields: [
      {
        name: "format",
        type: "deliverable-field-option-single",
        options: ["kml", "xml", "shp"]
      },
    ]
  },
  {
    id: "b",
    name: "Navigation data",
    fields: [
      {
        name: "format",
        type: "deliverable-field-option-single",
        options: ["kml", "xml", "shp"]
      },
    ]
  },
  {
    id: "c",
    name: "Vessel track",
    fields: [
      {
        name: "format",
        type: "deliverable-field-option-single",
        options: ["kml", "xml", "shp"]
      },
    ]
  },
  {
    id: "d",
    name: "Transit data",
    fields: [
      {
        name: "format",
        type: "deliverable-field-option-single",
        options: ["kml", "xml", "shp"]
      },
      {
        name: "Requirements",
        type: "deliverable-field-text"
      },
    ]
  },
  {
    id: "e",
    name: "Bathymetric chart (contours)",
    fields: [
      {
        name: "format",
        type: "deliverable-field-option-single",
        options: ["kml", "xml", "shp"]
      },
      {
        name: "Requirements",
        type: "deliverable-field-text"
      },
    ]
  },
  {
    id: "f",
    name: "Processed Backscatter",
    fields: [
      {
        name: "format",
        type: "deliverable-field-option-single",
        options: ["kml", "xml", "shp"]
      },
      {
        name: "formatMultiple",
        label: "format like above, but multiple",
        type: "deliverable-field-option-multiple",
        options: ["kml", "xml", "shp", "zip", "foo", "bar"]
      },
      {
        name: "acceptedAndRejectedXYZ",
        label: "Supply accepted and rejected XYZ data separately",
        type: "deliverable-field-checkbox",
      },
      {
        name: "Requirements",
        type: "deliverable-field-text"
      },
    ]
  },
];


const deliverableList = [
  {
    id:'1',
    definitionId:'a',
    data: {},
  },
  {
    id:'2',
    definitionId:'b',
    data: {format:"xml"},
  },
  {
    id:'3',
    definitionId:'c',
    data: {},
  },
  {
    id:'4',
    definitionId:'e',
    data: {},
  },
  {
    id:'5',
    definitionId:'f',
    data: {},
  },
];


var router = express.Router();

// Gets a list of all deliverables that are available within the application
router.get('/definition-list', asyncMiddleware(async function (req, res) {
  res.json(deliverableDefinitionList);
}));

// Gets a  list of all deliverables assigned to this survey
router.get('/:id/list', asyncMiddleware(async function (req, res) {
  res.json(deliverableList);
}));

router.post(
  '/:id/list', isAuthenticated, asyncMiddleware(async function (req, res) {

  console.log("deliverable list post request");
  console.log(req.body);

  res.end();

}));


module.exports = router;
