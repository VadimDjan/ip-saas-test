const useLocal = false
const config = {
    framework: 'jasmine2',
    jasmineNodeOpts: {
        defaultTimeoutInterval: 3600000,
    },
    specs: [],
    allScriptsTimeout: 600000,
    getPageTimeout: 600000,
    params: {
        jenkins: {
            workspaceDirectory: '.',
            host: '127.0.0.1', //45.67.57.231', //'http://localhost:8080', // 'isa.defcont.com'  '193.124.178.223'  'runidea.online'   '127.0.0.1' '94.142.142.227'
            hostDB: '193.124.178.224',//null, //'193.124.178.224'  'isa.defcont.com'
            port: 8080
        },
        specs: ''
    },
    onPrepare: function () {
        // console.log('onPrepare START');

        var width = 1400; //1500;
        var height = 800; //1000;
        protractor.expliciteWaitTime = 500;
        browser.driver.manage().window().setSize(width, height);
        protractor.helpers = {};
        var $h = protractor.helpers;
        $h.workspaceDirectory = browser.params.jenkins.workspaceDirectory;
        $h._ = require('lodash');
        $h.taksUid = 0;
        $h.moment = require('moment');
        $h.url = 'http:' + browser.params.jenkins.host + ':' + browser.params.jenkins.port + '/';// 'http://sutrrpm.ru'
        $h.connectionString = 'postgres://system_user:ipDbP@$$w0rdd_1231' + (browser.params.jenkins.hostDB || browser.params.jenkins.host) + ':5432/galaktika_db';

        // console.info('$h.connectionString = ' + $h.connectionString)

        protractor.libs = {
            pg: require('pg'),
            fs: require('fs'),
            path: require('path'),
            request: require('request'),
            _: $h._,
            moment: $h.moment
        };
        $h.wait = require('./helpers/wait-helpers.js');
        $h.common = require('./helpers/common-helpers.js');
        $h.grid = require('./helpers/grid-helpers.js');
        $h.form = require('./helpers/form-helpers.js');
        $h.file = require('./helpers/file-helpers.js');
        $h.login = require('./helpers/login-helpers.js');
        $h.designer = require('./helpers/designer-helpers.js');
        $h.select = require('./helpers/select-helpers.js');
        $h.postgres = require('./helpers/postgres-helpers.js');
        $h.menu = require('./helpers/menu-helpers.js');
        $h.scheduler = require('./helpers/scheduler-helpers.js');

        protractor.constants = {};
        // console.info('workspaceDirectory = ' + browser.params.jenkins.workspaceDirectory);
        var jasmineReporters = require('jasmine-reporters');

        var reportOutput = config.reportOutput || 'xmloutput';
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: $h.workspaceDirectory || 'testresults',
            filePrefix: reportOutput
        }));
        // console.log('jasmineReporters END');

        var totalStatusPath = protractor.libs.path.join($h.workspaceDirectory, 'totalStatus.json');
        protractor.totalStatus = {
            ok: true,
            withErrors: false,
            suits: []
        };

        jasmine.getEnv().addReporter({
            jasmineStarted: function (suiteInfo) {
                // console.log('1');
                // console.log(suiteInfo);
            },
            suiteStarted: function (result) {
                // console.log('2');
                protractor.totalStatus.suits.push({
                    ok: true,
                    description: result.description,
                    fullName: result.fullName,
                    specs: []
                });
                // console.log(result.description);
                // console.log(result.fullName);
            },
            specStarted: function (result) {
                // console.log('3');
                // console.log('result', result);

                var suit = protractor.totalStatus.suits[protractor.totalStatus.suits.length - 1];
                var canContinue = suit.description.endsWith('##can_continue') || result.description.endsWith('##can_continue');
                jasmine.getEnv().throwOnExpectationFailure(!canContinue);

                // console.log('suit', protractor.totalStatus.suits[protractor.totalStatus.suits.length - 1], 'canContinue', suit.description.endsWith('##can_continue') || result.description.endsWith('##can_continue'));
                // console.log(' jasmine.getEnv().throwOnExpectationFailure(!canContinue);',  jasmine.getEnv().throwOnExpectationFailure(!canContinue));
            },
            specDone: function (result) {
                // console.log('4');
                var suit = protractor.totalStatus.suits[protractor.totalStatus.suits.length - 1];
                var spec = {
                    ok: true,
                    description: result.description,
                    fullName: result.fullName,
                };
                if (result.status === 'failed') {
                    // console.log('5');
                    var canContinue = suit.description.endsWith('##can_continue') || result.description.endsWith('##can_continue');
                    spec.ok = false;
                    if (canContinue) {
                        // console.log(' protractor.totalStatus.withErrors');
                        protractor.totalStatus.withErrors = true;
                    }
                    else {
                        // console.log(' protractor.totalStatus.ok = false;');
                        protractor.totalStatus.ok = false;
                    }
                }
                // console.log('6');
                suit.specs.push(spec);

            },
            suiteDone: function (result) {
                // console.log('7');
                // console.log(result);
            },

            jasmineDone: function () {
                // console.log('8');
                $h.file.writeFileSync(totalStatusPath, JSON.stringify(protractor.totalStatus));
            }
        });


        (function (global) {

            // save references to original methods
            var _super = {
                describe: global.describe,
                it: global.it
            };

            // override, take third optional "disable"
            global.describe = function (name, fn, disable) {
                var disabled = disable;
                if (typeof disable === 'function') {
                    disabled = disable();
                }
                // if should be disabled - call "xdescribe" (or "ddescribe")
                if (disabled) {
                    return global.xdescribe.call(this, name, fn);
                }

                // otherwise call original "describe"
                return _super.describe.call(this, name, fn);
            };

            // override, take third optional "disable"
            global.it = function (name, fn, disable, timeout) {
                var disabled = disable,
                    fnToCall = fn;
                if (typeof disable === 'function') {
                    disabled = disable();
                    fnToCall = function (done) {
                        if (disable() && arguments.length) {
                            arguments[0].fail('Failed of skip function = ' + (disable.toString()));
                        }
                        else {
                            fn.apply(this, arguments);
                        }
                    };
                }
                // if should be disabled - call "xit" (or "iit")
                if (disabled) {
                    return global.xit.call(this, name, fnToCall);
                }

                // otherwise call original "it"
                return _super.it.call(this, name, fnToCall, timeout);
            };

        }(global));
        // console.log('onPrepare START');
    },
    capabilities: {
        browserName: 'chrome',
        // Number of times to run this set of capabilities (in parallel, unless 
        // limited by maxSessions). Default is 1.
        count: 1,
    },
};

if (useLocal) {
    config.directConnect = true
    config.params.jenkins.host = '127.0.0.1' //'94.142.142.227'
    config.params.jenkins.port = '8080'
}
else {
    //config.directConnect = true
    config.seleniumAddress = 'http://localhost:4444/wd/hub';
}

exports.config = config


Array.prototype.flatMap = function (lambda) {
    return Array.prototype.concat.apply([], this.map(lambda))
}


