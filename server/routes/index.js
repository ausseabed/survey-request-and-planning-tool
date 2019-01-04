'use strict';
var express = require('express');
var auth = require('../lib/auth')();
var tasks = require('../lib/celery')();
var router = express.Router();
var logger = require('../lib/logger').logger;
var logIdGen = require('../lib/logger').logId;
var db = require('../lib/model/db')();
var _ = require('lodash');
var uuid5 = require('uuid/v5');
var uuid4 = require('uuid/v4');
var AWS = require('aws-sdk');
var s3 = require('../lib/s3manager');
var path = require('path');
var hash = require('object-hash');
var config = require('config');
var survey_interpretor = require('../lib/surveyinterpretor');
var RouteError = require('./route-error');

// Raise 401 if user is not authenticated
function isAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        var verified_user = auth.verify(req.headers.authorization);
        if (verified_user) {
            req.user = verified_user;
            return next();
        }
    }

    res.status(401).send('Unauthorized');       // Send unauthrized response if we get here
}

// Appens user to req is authenticated, will not 401
function authenticatedUser(req, res, next) {
    if (req.headers.authorization) {
        var verified_user = auth.verify(req.headers.authorization);
        if (verified_user) {
            req.user = verified_user;
        }
    }

    return next();
}

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

// Create tender, A new project will be created as well
router.post('/api/:type/tender', isAuthenticated, function (req, res) {
    try {
        var tender_id = req.body && req.body.id ? req.body.id : uuid5("tender", uuid4());

        db.projects.query({
            KeyConditionExpression: "#id = :id and #type = :type",
            ExpressionAttributeNames: { "#id": "id", "#type": "type" },
            ExpressionAttributeValues: { ":id": tender_id, ":type": req.params.type }
        })
            .then((results) => {
                // Project does not exist, create one
                if (!(results && results.length > 0)) {
                    return db.projects.create({
                        id: tender_id,
                        type: req.params.type,
                        project_name: req.body.project_name ? req.body.project_name : "",
                        sessions: [],
                        results: null,
                        write_users: [req.user.id],
                        read_users: [req.user.id],
                        created: new Date().toISOString(),
                        created_by: req.user.id,
                        updated: new Date().toISOString(),
                        updated_by: req.user.id,
                    }).then((r) => { return true; })
                }
                else {
                    var user_can_edit =  _.findIndex(results[0].write_users, (u) => {
                        return u.toLowerCase() === req.user.id.toLowerCase()
                    }) > -1;

                    if (user_can_edit) {
                        return db.projects.update({
                            "id": tender_id,
                            "type": req.params.type
                        }, {
                            project_name: req.body.project_name ? req.body.project_name : "",
                            updated: new Date().toISOString(),
                            updated_by: req.user.id,
                        }).then((r) => { return true })
                    }
                    else {
                        return false;
                    }
                }
            })
            .then((can_edit) => {
                if (can_edit) {
                    return db.tenders.query({
                        KeyConditionExpression: "#id = :id",
                        ExpressionAttributeNames: { "#id": "id" },
                        ExpressionAttributeValues: { ":id": tender_id }
                    })
                        .then((results) => {
                            if (results && results.length > 1) {    // Existing tender validate user access
                                // Check if user has write privilege
                                var existing_tender = _.find(results, (r) => {
                                    return _.startsWith(r.version, 'latest')
                                });

                                if (existing_tender) {
                                    return _.merge(req.body, {
                                        version: req.params.type + "_v" + (results.length + 1),
                                        v_no: req.params.type + "_v" + (results.length + 1),
                                    })
                                }
                            }
                            else {                                  // new tendeer, returnb version 1
                                return _.merge(req.body, {
                                    version: req.params.type + "_v1",
                                    v_no: req.params.type + "_v1",
                                    created: new Date().toISOString(),
                                    created_by: req.user.id
                                });
                            }
                        })
                }
                else {
                    res.status(403).send('Not Authorized');
                    return null;
                }
            })
            .then(v => {
                if (!v) { return null }
                // Create an entry for version
                var tender_item = _.merge(v, {
                    id: tender_id,
                    updated: new Date().toISOString(),
                    updated_by: req.user.id
                });

                return db.tenders.create(tender_item).then((result) => { return result; })
            })
            .then((result) => {
                if (!result) { return null }
                return db.tenders.create(_.merge(result, {                // Create latest version
                    version: "latest_" + req.params.type
                }))
                    .then((result) => {
                        return res.json(result)
                    })
            })
            .catch((e) => {
                logger.error(e);
                return res.status(500).send('Error saving tender');
            })
    }
    catch (e) {
        logger.error(e);
        return res.status(500).send('Error saving tender');
    }
})

// Get list of tenders - These are actually projects, restrict to only user's who have access
router.get('/api/:type/tender', isAuthenticated, function (req, res) {
    db.projects.scan({
        FilterExpression: "#type = :type and (contains(#write_users, :user_id) or contains(#read_users, :user_id))",
        ExpressionAttributeNames: { "#type": "type", "#write_users": "write_users", "#read_users": "read_users" },
        ExpressionAttributeValues: { ":type": req.params.type, ":user_id": req.user.id }
    })
        .then((result) => {
            return res.json({
                items: _.reduce(result.Items, (result, item) => {
                    result.push(_.omit(item, ['write_users', 'read_users']));
                    return result;
                }, []),
                last_key: result.LastEvaluatedKey ? result.LastEvaluatedKey : null
            });
        })
        .catch((e) => {
            logger.error(e);
            return res.json([]);
        })
});

// Get latest tender for type & id specified
router.get('/api/:type/tender/:id', isAuthenticated, function (req, res) {
    var version = req.query.version ? req.query.version : "latest_" + req.params.type;

    db.projects.query({
        KeyConditionExpression: "#id = :id and #type = :type",
        ExpressionAttributeNames: { "#id": "id", "#type": "type" },
        ExpressionAttributeValues: { ":id": req.params.id, ":type": req.params.type }
    })
        .then((p) => {
            if (!(p != null && p.length > 0)) {
                res.status(404).send('Requested project does not exists')
                return null;
            }
            else {
                var canRead = _.findIndex(p[0].read_users, (u) => { return u.toLowerCase() === req.user.id.toLowerCase() }) > -1;
                var canWrite = _.findIndex(p[0].write_users, (u) => { return u.toLowerCase() === req.user.id.toLowerCase() }) > -1;

                if (!(canRead || canWrite)) {
                    res.status(403).send('Not authorized');
                    return null;
                }
                else {
                    return canWrite;
                }
            }
        })
        .then((canWrite) => {
            if (canWrite != null) {
                return db.tenders.query({
                    KeyConditionExpression: "#id = :id and #version = :version",
                    ExpressionAttributeNames: { "#id": "id", "#version": "version" },
                    ExpressionAttributeValues: { ":id": req.params.id, ":version": version }
                })
                    .then((result) => {
                        if (result.length > 0) {
                            return s3.getFileList('uav/requirements/' + req.params.id + '/assets/')
                                .then((files) => {
                                    var aoi = files ? _.find(files, (f) => { return f === 'aoi.geojson' }) : null;
                                    return res.json(_.assign(result[0], {
                                        can_edit: canWrite,
                                        assets: files,
                                        aoiUrl: aoi ? s3.getSignedUrl('getObject', 'uav/requirements/' + req.params.id + '/assets/aoi.geojson', { Expires: 60 * 60 * 24 }) : null
                                    }))
                                });
                        }
                        else {
                            return res.status(404).send('Requirement for requested ID & version does not exists')
                        }
                    })
                    .catch((e) => {
                        logger.error(e);
                        return res.status(500).send('Error getting requirements form');
                    })
            }
            else {
                return null;
            }
        })
        .catch((e) => {
            logger.error(e);
            return res.status(500).send('Error getting requirements form');
        })
});

// Create New Session
router.post('/api/:type/:id/session', isAuthenticated, function (req, res) {
    try {
        db.projects.query({
            KeyConditionExpression: "#id = :id and #type = :type",
            ExpressionAttributeNames: { "#id": "id", "#type": "type" },
            ExpressionAttributeValues: { ":id": req.params.id, ":type": req.params.type }
        })
            .then((projects) => {
                if (projects && projects.length > 0) {
                    var user_can_edit = _.findIndex(projects[0].write_users, (u) => {
                        return u.toLowerCase() === req.user.id.toLowerCase()
                    }) > -1;

                    if (!user_can_edit) {
                        throw new RouteError.NotAuthorizedError('Not authorized to edit project.')
                    }

                    return projects[0].sessions;
                }
                else {
                    throw new RouteError.NotFoundError('Project ' + req.params.id + ' does not exists');
                }
            })
            .then((sessions) => {
                return db.tenders.query({
                    KeyConditionExpression: "#id = :id and #version = :version",
                    ExpressionAttributeNames: { "#id": "id", "#version": "version" },
                    ExpressionAttributeValues: { ":id": req.params.id, ":version": "latest_" + req.params.type }
                })
                    .then((result) => {
                        if (result.length > 0) {
                            // Increament max session id by 1
                            var session_id = (sessions && sessions.length > 0 ? _.maxBy(sessions, 'session_id').session_id : 0) + 1

                            return _.merge(req.body, {
                                id: req.params.id,
                                session_id: session_id,
                                created: new Date().toISOString(),
                                created_by: req.user.id,
                                updated: new Date().toISOString(),
                                updated_by: req.user.id,
                                tender: result[0],
                                sessions: sessions ? sessions : []                      // Pass sesssions along for next
                            })
                        }
                        else {
                            throw new RouteError.QA4UError('Requirement form missing')
                        }
                    })
            })
            .then((session) => {
                var sessions = _.get(session, 'sessions', [])
                _.omit(session, 'sessions');

                return db.sessions.create(_.merge(session, {
                    hash: hash(_.pick(session, ['files', 'tender']))
                }))
                    .then((created_session) => {
                        return created_session
                    })
            })
            .then((created_session) => {
                var session_meta = _.pickBy(_.pick(created_session, ['session_id', 'hash', 'notes', 'created', 'created_by', 'notes', 'updated', 'updated_by']), (value, key) => {
                    return value !== null && value !== ''
                });

                logger.info(session_meta)
                // Update project with session
                return db.projects.update({
                    "id": req.params.id,
                    "type": req.params.type
                }, {
                        sessions: [session_meta],
                        updated: new Date().toISOString(),
                        updated_by: req.user.id,
                    },
                    { sessions: 'list_append' }).then((r) => {
                        return res.json(created_session);      // Set create session as response
                    })
            })
            .catch((e) => {
                logger.error(e)
                if (e instanceof RouteError.QA4UError) { res.status(500).send(e.message) }
                else if (e instanceof RouteError.NotFoundError) { res.status(404).send(e.message) }
                else if (e instanceof RouteError.NotAuthorizedError) { res.status(401).send(e.message) }
                else { res.status(500).send('Error creating session'); }
            })
    }
    catch (e) {
        logger.error(e);
        return res.status(500).send('Error creating session');
    }
})

// Get an existing session
router.get('/api/:type/:project_id/session/:session_id', isAuthenticated, function (req, res) {
    db.projects.query({
        KeyConditionExpression: "#id = :id and #type = :type",
        ExpressionAttributeNames: { "#id": "id", "#type": "type" },
        ExpressionAttributeValues: { ":id": req.params.project_id, ":type": req.params.type }
    })
        .then((projects) => {
            if (projects && projects.length > 0) {
                var user_can_view = _.findIndex(projects[0].read_users, (u) => {
                    return u.toLowerCase() === req.user.id.toLowerCase()
                }) > -1;

                if (!user_can_view) {
                    throw new RouteError.NotAuthorizedError('Not authorized to view project.')
                }

                return user_can_view
            }
            else {
                throw new RouteError.NotFoundError('Project ' + req.params.id + ' does not exists');
            }
        })
        .then((user_can_view) => {
            return db.sessions.query({
                KeyConditionExpression: "#id = :id and #session_id = :session_id",
                ExpressionAttributeNames: { "#id": "id", "#session_id": "session_id" },
                ExpressionAttributeValues: { ":id": req.params.project_id, ":session_id": parseInt(req.params.session_id) }
            })
                .then((sessions) => {
                    if (sessions && sessions.length > 0) {
                        return res.json(sessions[0])
                    }
                    else {
                        throw new RouteError.NotFoundError('Session ' + req.params.session_id + ' does not exist for Project ' + req.params.project_id);
                    }
                })
        })
        .catch((e) => {
            logger.error(e)
            if (e instanceof RouteError.QA4UError) { res.status(500).send(e.message) }
            else if (e instanceof RouteError.NotFoundError) { res.status(404).send(e.message) }
            else if (e instanceof RouteError.NotAuthorizedError) { res.status(401).send(e.message) }
            else { res.status(500).send('Error getting project'); }
        })
})

// Delete an existing session
router.delete('/api/:type/:project_id/session/:session_id', isAuthenticated, function (req, res) {
    db.projects.query({
        KeyConditionExpression: "#id = :id and #type = :type",
        ExpressionAttributeNames: { "#id": "id", "#type": "type" },
        ExpressionAttributeValues: { ":id": req.params.project_id, ":type": req.params.type }
    })
        .then((projects) => {
            if (projects && projects.length > 0) {
                var user_can_write = _.findIndex(projects[0].write_users, (u) => {
                    return u.toLowerCase() === req.user.id.toLowerCase()
                }) > -1;

                if (!user_can_write) {
                    throw new RouteError.NotAuthorizedError('Not authorized to delete project.')
                }

                return projects[0];
            }
            else {
                throw new RouteError.NotFoundError('Project ' + req.params.id + ' does not exists');
            }
        })
        .then((project) => {
            var idx = _.findIndex(project.sessions, (s) => { return s.session_id === parseInt(req.params.session_id) });

            if (idx > -1) {
                var sessions = project.sessions;
                sessions.splice(idx, 1);

                return db.projects.update({ id: req.params.project_id, type: req.params.type },
                    { sessions: sessions }, null)
                    .then((project) => {
                        return project;
                    });
            } else {
                return project;
            }
        })
        .then((project) => {
            return db.sessions.query({
                KeyConditionExpression: "#id = :id and #session_id = :session_id",
                ExpressionAttributeNames: { "#id": "id", "#session_id": "session_id" },
                ExpressionAttributeValues: { ":id": req.params.project_id, ":session_id": parseInt(req.params.session_id) }
            })
                .then((sessions) => {
                    if (sessions && sessions.length > 0) {
                        return db.sessions.delete({ id: req.params.project_id, session_id: parseInt(req.params.session_id) })
                            .then(() => {
                                return res.status(200).send('deleted!');
                            })
                    }
                    else {
                        throw new RouteError.NotFoundError('Session ' + req.params.session_id + ' does not exist for Project ' + req.params.project_id);
                    }
                })
        })
        .catch((e) => {
            logger.error(e)
            if (e instanceof RouteError.QA4UError) { res.status(500).send(e.message) }
            else if (e instanceof RouteError.NotFoundError) { res.status(404).send(e.message) }
            else if (e instanceof RouteError.NotAuthorizedError) { res.status(401).send(e.message) }
            else { res.status(500).send('Error getting project'); }
        })
})

// Update dataset values for session
router.put('/api/:type/:project_id/session/:session_id/dataset', isAuthenticated, function (req, res) {
    db.projects.query({
        KeyConditionExpression: "#id = :id and #type = :type",
        ExpressionAttributeNames: { "#id": "id", "#type": "type" },
        ExpressionAttributeValues: { ":id": req.params.project_id, ":type": req.params.type }
    })
        .then((projects) => {
            if (projects && projects.length > 0) {
                var user_can_write = _.findIndex(projects[0].write_users, (u) => {
                    return u.toLowerCase() === req.user.id.toLowerCase()
                }) > -1;

                if (!user_can_write) {
                    throw new RouteError.NotAuthorizedError('Not authorized to write to project.')
                }

                return user_can_write
            }
            else {
                throw new RouteError.NotFoundError('Project ' + req.params.id + ' does not exists');
            }
        })
        .then((user_can_write) => {
            return db.sessions.query({
                KeyConditionExpression: "#id = :id and #session_id = :session_id",
                ExpressionAttributeNames: { "#id": "id", "#session_id": "session_id" },
                ExpressionAttributeValues: { ":id": req.params.project_id, ":session_id": parseInt(req.params.session_id) }
            })
                .then((sessions) => {
                    if (sessions && sessions.length > 0) {
                        return db.sessions.update(
                            { id: req.params.project_id, session_id: parseInt(req.params.session_id) },
                            req.body, null)
                            .then((session) => {
                                return res.json(session)
                            })
                    }
                    else {
                        throw new RouteError.NotFoundError('Session ' + req.params.session_id + ' does not exist for Project ' + req.params.project_id);
                    }
                })
        })
        .catch((e) => {
            logger.error(e)
            if (e instanceof RouteError.QA4UError) { res.status(500).send(e.message) }
            else if (e instanceof RouteError.NotFoundError) { res.status(404).send(e.message) }
            else if (e instanceof RouteError.NotAuthorizedError) { res.status(401).send(e.message) }
            else { res.status(500).send('Error getting project'); }
        })
})

// Post session results for checks
router.post('/api/:type/:project_id/session/:session_id/result', isAuthenticated, function (req, res) {
    db.projects.query({
        KeyConditionExpression: "#id = :id and #type = :type",
        ExpressionAttributeNames: { "#id": "id", "#type": "type" },
        ExpressionAttributeValues: { ":id": req.params.project_id, ":type": req.params.type }
    })
        .then((projects) => {
            if (projects && projects.length > 0) {
                var user_can_write = _.findIndex(projects[0].write_users, (u) => {
                    return u.toLowerCase() === req.user.id.toLowerCase()
                }) > -1;

                if (!user_can_write) {
                    throw new RouteError.NotAuthorizedError('Not authorized to write to project.')
                }

                return user_can_write
            }
            else {
                throw new RouteError.NotFoundError('Project ' + req.params.id + ' does not exists');
            }
        })
        .then((user_can_write) => {
            return db.sessions.query({
                KeyConditionExpression: "#id = :id and #session_id = :session_id",
                ExpressionAttributeNames: { "#id": "id", "#session_id": "session_id" },
                ExpressionAttributeValues: { ":id": req.params.project_id, ":session_id": parseInt(req.params.session_id) }
            })
                .then((sessions) => {
                    if (sessions && sessions.length > 0) {
                        var existing_results = sessions[0].results ? sessions[0].results : {};
                        existing_results[req.body.result.check_id] = _.omit(req.body.result, ['check_id']);

                        return db.sessions.update(
                            { id: req.params.project_id, session_id: parseInt(req.params.session_id) },
                            { results: existing_results}, null)
                            .then((session) => {
                                return res.json(session)
                            })
                    }
                    else {
                        throw new RouteError.NotFoundError('Session ' + req.params.session_id + ' does not exist for Project ' + req.params.project_id);
                    }
                })
        })
        .catch((e) => {
            logger.error(e)
            if (e instanceof RouteError.QA4UError) { res.status(500).send(e.message) }
            else if (e instanceof RouteError.NotFoundError) { res.status(404).send(e.message) }
            else if (e instanceof RouteError.NotAuthorizedError) { res.status(401).send(e.message) }
            else { res.status(500).send('Error getting project'); }
        })
})

// Get Project
router.get('/api/:type/project/:id', isAuthenticated, function (req, res) {
    db.projects.query({
        KeyConditionExpression: "#id = :id and #type = :type",
        ExpressionAttributeNames: { "#id": "id", "#type": "type" },
        ExpressionAttributeValues: { ":id": req.params.id, ":type": req.params.type }
    })
        .then((projects) => {
            if (projects && projects.length > 0) {
                var user_can_view = _.findIndex(projects[0].read_users, (u) => {
                    return u.toLowerCase() === req.user.id.toLowerCase()
                }) > -1;

                if (!user_can_view) {
                    throw new RouteError.NotAuthorizedError('Not authorized to view project.')
                }

                var project = projects[0];
                project.sessions = project.sessions ? _.reverse(project.sessions) : project.sessions;
                return res.json(project);
            }
            else {
                throw new RouteError.NotFoundError('Project ' + req.params.id + ' does not exists');
            }
        })
        .catch((e) => {
            logger.error(e)
            if (e instanceof RouteError.QA4UError) { res.status(500).send(e.message) }
            else if (e instanceof RouteError.NotFoundError) { res.status(404).send(e.message) }
            else if (e instanceof RouteError.NotAuthorizedError) { res.status(401).send(e.message) }
            else { res.status(500).send('Error getting project'); }
        })
})

router.delete('/api/:type/project/:id', isAuthenticated, function (req, res) {
    db.projects.query({
        KeyConditionExpression: "#id = :id and #type = :type",
        ExpressionAttributeNames: { "#id": "id", "#type": "type" },
        ExpressionAttributeValues: { ":id": req.params.id, ":type": req.params.type }
    })
        .then((projects) => {
            if (projects && projects.length > 0) {
                var user_can_edit = _.findIndex(projects[0].write_users, (u) => {
                    return u.toLowerCase() === req.user.id.toLowerCase()
                }) > -1;

                if (!user_can_edit) {
                    throw new RouteError.NotAuthorizedError('Not authorized to edit project.')
                }

                return true
            }
            else {
                throw new RouteError.NotFoundError('Project ' + req.params.id + ' does not exists');
            }
        })
        .then((canDelete) => {
            // Delete sessions
            return db.sessions.query({
                KeyConditionExpression: "#id = :id",
                ExpressionAttributeNames: { "#id": "id" },
                ExpressionAttributeValues: { ":id": req.params.id }
            })
                .then((sessions) => {
                    return _.each(sessions, (session) => {
                        return db.sessions.delete({ id: session.id, session_id: session.session_id })
                    })
                })
        })
        .then(() => {
            return db.tenders.query({
                KeyConditionExpression: "#id = :id",
                ExpressionAttributeNames: { "#id": "id" },
                ExpressionAttributeValues: { ":id": req.params.id }
            })
                .then((tenders) => {
                    return _.each(tenders, (tender) => {
                        return db.tenders.delete({ id: tender.id, version: tender.version })
                    })
                })
        })
        .then(() => {
            return db.projects.delete({ id: req.params.id, type: req.params.type })
        })
        .then(() => { res.json('ok') })
        .catch((e) => {
            logger.error(e)
            if (e instanceof RouteError.QA4UError) { res.status(500).send(e.message) }
            else if (e instanceof RouteError.NotFoundError) { res.status(404).send(e.message) }
            else if (e instanceof RouteError.NotAuthorizedError) { res.status(401).send(e.message) }
            else { res.status(500).send('Error deleting project'); }
        })
});

// Save what users answered in survey
router.post('/api/survey', authenticatedUser, function (req, res) {
    var aoi_geojson = req.body.MAP;

    db.survey.create({
        id: req.body && req.body.surveyId ? req.body.surveyId : uuid5("survey", uuid4()),
        created_by: req.user && req.user.id ? req.user.id : 'anonymous',
        created_on: new Date().toISOString(),
        answers: _.omit(req.body, ['MAP'])
    })
        .then((result) => {
            logger.debug(JSON.stringify(result));
            return survey_interpretor.get_tender(result);
        })
        .then((tender) => {
            if (aoi_geojson) {
                return s3.upload_file('uav/requirements/' + tender.id + '/assets/aoi.geojson', aoi_geojson, 'application/json')
                    .then((file_path) => {
                        tender.assets = ['aoi.geojson'];
                        tender.aoiUrl = s3.getSignedUrl('getObject', 'uav/requirements/' + tender.id + '/assets/aoi.geojson', { Expires: 60 * 60 * 24 })
                        return tender;
                    })
            }
            return tender;
        })
        .then((tender) => {
            if (req.body.assets && req.body.assets) {
                tender = _.mergeWith(tender, { assets: req.body.assets }, (objValue, srcValue, key) => {
                    if (key === 'assets' && _.isArray(objValue)) {
                        return objValue.concat(srcValue);
                    }
                });
            }
            logger.debug(JSON.stringify(tender));
            return res.json(tender)
        })
        .catch((e) => {
            logger.error(e);
            return res.status(500).send('Error creating dataset');
        })
})

// Create Custsom dataset
router.post('/api/dataset/:type', isAuthenticated, function (req, res) {
    db.definitions.create({
        id: uuid5("dataset", uuid4()),
        type: req.params.type,
        created_by: req.user.id,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        definition: _.omit(req.body, ['id', 'type'])
    })
        .then((result) => {
            return res.json(result.definition)
        })
        .catch((e) => {
            logger.error(e);
            return res.status(500).send('Error creating dataset');
        })
})

router.put('/api/dataset/:type/:id', isAuthenticated, function (req, res) {
    if (!req.body) { return res.status(400).send('Missing post data.'); }

    if (!('id' in req.body)) { return res.status(400).send('Data does not have an id property, cannot put object use post instead.'); }
    if (req.body.id != req.params.id) { return res.status(400).send('object ID in URI does not match data.'); }

    db.definitions.get({ id: req.params.id, type: req.params.type })
        .then((dataset) => {
            if (!dataset) {
                throw new RouteError.NotFoundError('Dataset not found');
            }
            else if (dataset.id === req.params.id && req.user.id === dataset.created_by) {
                // Create will actually put the object, which is a overwrite not update
                return db.definitions.create(_.assign(dataset, {
                    definition: _.omit(req.body, ['id', 'type']),
                    updated_on: new Date().toISOString()
                }))
                    .then((d) => {
                        res.status(200).send('updated');
                        return null;
                    })
            }
            else {
                throw new RouteError.NotAuthorizedError('Not authorized to update dataset');
            }
        })
        .catch((e) => {
            logger.error(e)
            if (e instanceof RouteError.QA4UError) { res.status(500).send(e.message) }
            else if (e instanceof RouteError.NotFoundError) { res.status(404).send(e.message) }
            else if (e instanceof RouteError.NotAuthorizedError) { res.status(401).send(e.message) }
            else { res.status(500).send('Error updating dataset'); }
        })
})

// Delete custom datasets
router.delete('/api/dataset/:type/:id', isAuthenticated, function (req, res) {
    db.definitions.get({ id: req.params.id, type: req.params.type })
        .then((dataset) => {
            if (!dataset) {
                throw new RouteError.NotFoundError('Dataset not found');
            }
            else if (dataset.id === req.params.id && req.user.id === dataset.created_by) {
                return db.definitions.delete({ id: req.params.id, type: req.params.type })
                    .then((d) => {
                        res.status(200).send('deleted');
                        return null;
                    })
            }
            else {
                throw new RouteError.NotAuthorizedError('Not authorized to delete dataset');
            }
        })
        .catch((e) => {
            logger.error(e)
            if (e instanceof RouteError.QA4UError) { res.status(500).send(e.message) }
            else if (e instanceof RouteError.NotFoundError) { res.status(404).send(e.message) }
            else if (e instanceof RouteError.NotAuthorizedError) { res.status(401).send(e.message) }
            else { res.status(500).send('Error updating dataset'); }
        })
})

// Get custom datasets
router.get('/api/dataset/:type', authenticatedUser, function (req, res) {
    var userId = req.user && req.user.id ? req.user.id : null;

    var expressionValues = { ':master': config.get('db.master_userid'), ':type': req.params.type };
    if (userId !== config.get('db.master_userid')) {
        expressionValues[':userId'] = userId;
    }

    db.definitions.scan({
        FilterExpression: "created_by IN (" + Object.keys(expressionValues).toString() + ") and #type = :type",
        ExpressionAttributeValues: expressionValues,
        ExpressionAttributeNames: { '#type': 'type' }
    })
        .then((result) => {
            return res.json(_.reduce(result.Items, (results, item) => {
                results.push(_.assign(item.definition, {
                    created_by: item.created_by,
                    id: item.id
                }))
                return results;
            }, []));
        })
        .catch((e) => {
            logger.error(e);
            return res.status(500).send('Error getting dataset');
        })
})

router.post('/api/tasks/tender', isAuthenticated, function (req, res) {
    try {
        tasks.createTender();
        res.status(200).send('POSTED');
    }
    catch (e) {
        logger.error(e);
        res.status(500).send('Unknown error')
    }
})

router.post('/api/tasks/success', function (req, res) {
    try {
        console.log("Received message")
        res.status(200).send('RECEIVED');
    }
    catch (e) {
        res.status(500).send('Unknown error')
    }
})

// Get S3 signed url for given content_typ & file_name
router.post('/api/signedurl', function (req, res) {
    try {
        return res.json({
            'url': s3.getSignedUrl('putObject',
                req.body.file_name,
                {
                    ContentType: req.body.content_type,
                    ACL: 'bucket-owner-full-control',
                })
        });
    }
    catch (e) {
        logger.error(e);
        return res.status(500).send('Error getting pre-signed url');
    }
})

router.post('/api/check-aoi', isAuthenticated, function (req, res) {
  console.log(req.body);

  return res.json({
    'matching': []
  });
})

router.post('/api/:type/project-metadata', isAuthenticated, function (req, res) {
  var pm_id = req.body && req.body.id ? req.body.id : uuid5("project-metadata", uuid4());
  let pm = {
    id: pm_id,
    type: req.params.type,
    created_by: req.user.id,
    created_on: new Date().toISOString(),
    updated_on: new Date().toISOString(),
  }
  pm = _.merge(pm, _.omit(req.body, ['id', 'type', 'areaOfInterest']))
  console.log(pm);

  return res.json(pm)
  // db.projectMetadata.create(pm)
  // .then((result) => {
  //   return res.json(result.definition)
  // })
  // .catch((e) => {
  //   logger.error(e);
  //   return res.status(500).send('Error creating dataset');
  // })
})

// Donwload an asset file for a tender fro
router.get('/api/:type/download/:id', isAuthenticated, function (req, res) {
    if (!req.query.path) res.status(400).send('File path missing.');

    db.projects.query({
        KeyConditionExpression: "#id = :id and #type = :type",
        ExpressionAttributeNames: { "#id": "id", "#type": "type" },
        ExpressionAttributeValues: { ":id": req.params.id, ":type": req.params.type }
    })
        .then((result) => {
            if (result.length > 0) {
                console.debug(result[0].read_users)
                console.debug(result[0].write_users)
                var canRead = _.findIndex(result[0].read_users, (u) => { return u.toLowerCase() === req.user.id.toLowerCase() }) > -1;
                if (!canRead) { return res.status(403).send('Not authorized') }
                else {
                    return res.json({
                        'url': s3.getSignedUrl('getObject',
                            req.params.type + '/requirements/' + req.params.id + '/assets/' + req.query.path,
                            {
                                ResponseContentDisposition: 'Content-Disposition: attachment; filename=' + path.parse(req.query.path).base ,
                            })
                    })
                }
            }
            else {
                return res.status(404).send('Requirement for requested ID does not exists')
            }
        })
})

router.delete('/api/:type/download/:id', isAuthenticated, function (req, res) {
    if (!req.query.path) res.status(400).send('File path missing.');

    db.projects.query({
        KeyConditionExpression: "#id = :id and #type = :type",
        ExpressionAttributeNames: { "#id": "id", "#type": "type" },
        ExpressionAttributeValues: { ":id": req.params.id, ":type": req.params.type }
    })
        .then((result) => {
            if (result.length > 0) {
                var canWrite = _.findIndex(result[0].write_users, (u) => { return u.toLowerCase() === req.user.id.toLowerCase() }) > -1;

                if (!canWrite) { return res.status(403).send('Not authorized') }
                else {
                    return s3.delete(req.params.type + '/requirements/' + req.params.id + '/assets/' + req.query.path)
                        .then((result) => {
                            return res.json({
                                'file': req.query.path
                            });
                        })
                }
            } else {
                return res.status(404).send('Requirement for requested ID does not exists');
            }
        })
})

module.exports = router;
