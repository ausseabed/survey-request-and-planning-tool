var _ = require('lodash')
var s3 = require('./s3manager')
let Engine = require('json-rules-engine').Engine
let Rule = require('json-rules-engine').Rule
var logger = require('./logger').logger;
var logIdGen = require('./logger').logId;
var rules = require('./rules.json')

module.exports = {
    get_tender(survey) {
        var industry_name = survey.answers && survey.answers.industry ? survey.answers.industry.toLowerCase() : null;
        var application_name = null;
        
        switch (industry_name) {
            case "mining": application_name = survey.answers.pickApp1; break;
            case "env-mon": application_name = survey.answers.pickApp2; break;
            case "agri": application_name = survey.answers.pickApp3; break;
            case "emg-mng": application_name = survey.answers.pickApp4; break;
            case "local-gov": application_name = survey.answers.pickApp5; break;
            case "survey": application_name = survey.answers.pickApp6; break;
            case "const": application_name = survey.answers.pickApp7; break;
            case "infra": application_name = survey.answers.pickApp8; break;
            case "forest": application_name = survey.answers.pickApp9; break;
            case "oil": application_name = survey.answers.pickApp10; break;
            case "heritage": application_name = survey.answers.pickApp11; break;
            case "water": application_name = survey.answers.pickApp12; break;
        }

        var default_tender_spec = module.exports.default_tender(); 
        if (industry_name && application_name) {
            var s3_kb_path = "kb/uav/sectors/" + industry_name + "/" + application_name + "/specifications.json"
            return s3.readFileAsJson(s3_kb_path)
                .catch((e) => {
                    // Key is missing, that's fine return the default tender
                    return default_tender_spec;
                })
                .then((output) => {
                    output.id = survey.id;

                    let engine = new Engine()
                    engine.addFact('survey_answers', survey.answers)      // add all the survey answers as facts
                    // initialise rules
                    for (var idx = 0; idx <= rules.length - 1; idx++) {
                        engine.addRule(rules[idx])
                    }

                    return engine.run()
                        .then((events) => {
                            for (var eIdx = 0; eIdx <= events.length - 1; eIdx++) {
                                if (events[eIdx].params.element_source == 'survey_output') {
                                    if (events[eIdx].params.action == 'set') {
                                        if (events[eIdx].params.hasOwnProperty("fixed_value")) {

                                            // means the fixed value is provided, use the fixed_value array
                                            for (var idx = 0; idx < events[eIdx].params.output_element_key_path.length; idx++) {
                                                _.set(output, events[eIdx].params.output_element_key_path[idx], events[eIdx].params.fixed_value[idx])
                                            }
                                        }
                                        else {
                                            for (var idx = 0; idx < events[eIdx].params.output_element_key_path.length; idx++) {
                                                _.set(output, events[eIdx].params.output_element_key_path[idx], _.get(survey.answers, events[eIdx].params.element_source_key_path[idx]))
                                            }
                                        }
                                    }
                                    else if (events[eIdx].params.action == "append") {

                                        if (events[eIdx].params.hasOwnProperty("fixed_value")) {

                                            for (var idx = 0; idx < events[eIdx].params.output_element_key_path.length; idx++) {

                                                if (!_.includes(_.get(output, events[eIdx].params.output_element_key_path[idx]), events[eIdx].params.fixed_value[idx])) {
                                                    _.get(output, events[eIdx].params.output_element_key_path[idx]).push(events[eIdx].params.fixed_value[idx])
                                                }
                                            }
                                        }
                                        else if (events[eIdx].params.element_source_key_path != null) {
                                            for (var idx = 0; idx < events[eIdx].params.output_element_key_path.length; idx++) {
                                                var val = _.get(survey.answers, events[eIdx].params.element_source_key_path[idx])

                                                if (events[eIdx].params.element_source_key_path[idx] === 'tile_size') {
                                                    var val_split = val.split(',');
                                                    val = _.reduce(_.map(val_split, _.trim), (accumulator, v) => {
                                                        accumulator.push(v + ' km');
                                                        return accumulator;
                                                    }, []);
                                                }

                                                if (Object.prototype.toString.call(val) === '[object Array]') {
                                                    for (var cnt = 0; cnt < val.length; cnt++) {
                                                        if (!_.includes(_.get(output, events[eIdx].params.output_element_key_path[idx]), val[cnt])) {
                                                            _.get(output, events[eIdx].params.output_element_key_path[idx]).push(val[cnt])
                                                        }
                                                    }
                                                }
                                                else {
                                                    if (!_.includes(_.get(output, events[eIdx].params.output_element_key_path[idx]), events[eIdx].params.element_source_key_path[idx])) {
                                                        _.get(output, events[eIdx].params.output_element_key_path[idx]).push(_.get(survey.answers, events[eIdx].params.element_source_key_path[idx]))
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            return output;
                        })
                })
        }
        else {
            // Return empty json, default in client will be used
            return new Promise(function (resolve, reject) { resolve(default_tender_spec); });
        }
    },
    default_tender() {
        return {
            id: "",
            project_name: null,
            contract_no: "",
            aoi: "",
            collection: {
                time_sensitive: { is_sensitive: false, time_range: null, comment: null },
                time_series_data: false,
                environmental_consideration: null,
                gps_positioning: true,
                image_overlap: {
                    forward: 30, side: 50
                },
                standoff: null
            },
            delivery: {
                date: null,
                method: [],
                method_comment: null,
                ancillary_data: [],
                naming_convention: null
            },
            spatial_reference: {
                hcs: null,
                vcs: [],
                accuracy: {
                    horizontal: { abs: null, rel: null },
                    vertical: { abs: null, rel: null }
                }
            },
            point_cloud: {
                required: false,
                formats: [],
                types: [],
                full_wave_form: null,
                version: -1,
                pdrf: -1,
                classification: null,
                tile_sizes: [],
                density: null,
                scan_angle: null,
                file_size: null,
            },
            imagery: {
                required: false,
                types: [],
                capture_angle: null,
                resolutions: [],
                formats: [],
                tile_sizes: []
            },
            dem: {
                required: false,
                hydro_flatten: false,
                resolutions: [],
                formats: [],
                tile_sizes: []
            },
            dsm: {
                required: false,
                resolutions: [],
                formats: [],
                tile_sizes: []
            },
            contours: {
                required: false,
                interval: null,
                attributes: [],
                formats: [],
                tile_sizes: []
            },
            video: {
                required: false,
                formats: [],
                resolution: null
            },
            metadata: {
                formats: []
            },
            trajectory: {
                required: false,
                formats: [],
                attributes: []
            },
            project_report: {
                formats: [],
                notes: null
            },
            tile_index: {
                required: false,
                formats: [],
                tile_sizes: []
            },
            custom_datasets: [
            ],
            additional: {
                client_needed: false,
                background: null,
                raw_data: null,
                features: null,
                flight_pattern: null,
                landing_takeoff: null,
                flight_height: null,
                flight_risk: null,
                permits: null,
                safety_approvals: null,
                casa_requirements: null,
                site_access: null,
                vantage_point: null,
                vegetation: null,
                environment_terrain: null,
                others: null
            }
        }
    }
}