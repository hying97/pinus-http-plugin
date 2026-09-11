"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinusHttp = void 0;
var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var fs = require('fs');
var assert = require('assert');
// var urlencoded = require('urlencoded');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var loggers = require('morgan');
// module.exports = function(app:any, opts:any) {
//     return new PinusHttp(app, opts);
// };
var PinusHttp = /** @class */ (function () {
    function PinusHttp(app, opts) {
        this.DEFAULT_HOST = '127.0.0.1';
        this.DEFAULT_PORT = 3001;
        opts = opts || {};
        this.app = app;
        this.http = express();
        // self.logger.info('Http opts:', opts);
        this.host = opts.host || this.DEFAULT_HOST;
        this.port = opts.port || this.DEFAULT_PORT;
        if (!!opts.isCluster) {
            var serverId = app.getServerId();
            var params = serverId.split('-');
            var idx = parseInt(params[params.length - 1], 10);
            if (/\d+\+\+/.test(this.port)) {
                this.port = parseInt(this.port.substr(0, this.port.length - 2));
            }
            else {
                assert.ok(false, 'http cluster expect http port format like "3000++"');
            }
            this.port = this.port + idx;
        }
        this.useSSL = !!opts.useSSL;
        this.sslOpts = {};
        if (this.useSSL) {
            this.sslOpts.key = fs.readFileSync(path.join(app.getBase(), opts.keyFile));
            this.sslOpts.cert = fs.readFileSync(path.join(app.getBase(), opts.certFile));
        }
        this.logger = opts.logger || this.defaultLogger();
        this.http.set('port', this.port);
        this.http.set('host', this.host);
        this.http.use(this.createExpressLogger(this.logger));
        this.http.use(bodyParser.json({
            verify: function (req, res, buf) {
                req.rawBody = buf;
            }
        }));
        this.http.use(express.urlencoded());
        this.http.use(express.json());
        this.http.use(methodOverride());
        this.http.use(express.Router());
        var self = this;
        this.app.configure(function () {
            self.http.use(errorhandler());
        });
        this.beforeFilters = opts.beforeFilters || [];
        this.afterFilters = opts.afterFilters || [];
        this.server = null;
    }
    PinusHttp.prototype.createExpressLogger = function (logger) {
        return loggers({
            format: 'short',
            stream: {
                write: function (str) {
                    logger.debug(str);
                }
            },
        });
    };
    PinusHttp.prototype.defaultLogger = function () {
        return {
            debug: console.log,
            info: console.log,
            warn: console.warn,
            error: console.error,
        };
    };
    PinusHttp.prototype.loadRoutes = function () {
        this.http.get('/', function (req, res) {
            res.send('pinus-http-plugin ok!');
        });
        var routesPath = path.join(this.app.getBase(), 'app/servers', this.app.getServerType(), 'route');
        // self.logger.info(routesPath);
        assert.ok(fs.existsSync(routesPath), 'Cannot find route path: ' + routesPath);
        var self = this;
        fs.readdirSync(routesPath).forEach(function (file) {
            if (/.js$/.test(file)) {
                var routePath = path.join(routesPath, file);
                // self.logger.info(routePath);
                require(routePath)(self.app, self.http, self);
            }
        });
    };
    PinusHttp.prototype.start = function (cb) {
        var self = this;
        this.beforeFilters.forEach(function (elem) {
            self.http.use(elem);
        });
        this.loadRoutes();
        this.afterFilters.forEach(function (elem) {
            self.http.use(elem);
        });
        if (this.useSSL) {
            this.server = https.createServer(this.sslOpts, this.http).listen(this.port, this.host, function () {
                self.logger.info('Http start', self.app.getServerId(), 'url: https://' + self.host + ':' + self.port);
                self.logger.info('Http start success');
                process.nextTick(cb);
            });
        }
        else {
            this.server = http.createServer(this.http).listen(this.port, this.host, function () {
                self.logger.info('Http start', self.app.getServerId(), 'url: http://' + self.host + ':' + self.port);
                self.logger.info('Http start success');
                process.nextTick(cb);
            });
        }
    };
    PinusHttp.prototype.afterStart = function (cb) {
        this.logger.info('Http afterStart');
        process.nextTick(cb);
    };
    PinusHttp.prototype.stop = function (force, cb) {
        var self = this;
        this.server.close(function () {
            self.logger.info('Http stop');
            cb();
        });
    };
    return PinusHttp;
}());
exports.PinusHttp = PinusHttp;
