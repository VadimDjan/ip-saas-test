const useLocal = false;
const path = require('path');
const fs = require('fs');
const downloadsPath = path.resolve(__dirname, './downloads');

const clearDownloads = () => {
    const directory = 'downloads';
    try {
        fs.readdir(directory, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    } catch (e) {
        console.log(e);
    }
}
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
            host: '51.250.15.24', port: 8080,
            // host: '51.250.3.213', port: 80,
            // host: '192.168.65.2', port: 8080,
        },
        specs: ''
    },
    onPrepare: function () {
        // var width = 1200; //1500;
        // var height = 800; //1000;
        protractor.expliciteWaitTime = 500;
        // browser.driver.manage().window().setSize(width, height);
        browser.driver.manage().window().maximize();
        browser.ignoreSynchronization = true;
        protractor.helpers = {};
        var $h = protractor.helpers;
        $h.workspaceDirectory = browser.params.jenkins.workspaceDirectory;
        $h._ = require('lodash');
        $h.taksUid;
        $h.serviceId;
        $h.moment = require('moment');
        $h.url = 'http:' + browser.params.jenkins.host + ':' + browser.params.jenkins.port + '/';// 'http://sutrrpm.ru'
        $h.connectionString = 'postgres://system_user:ipDbP@$$w0rdd_1231' + (browser.params.jenkins.hostDB || browser.params.jenkins.host) + ':5432/galaktika_db';


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
        $h.locators = require('./helpers/locators');
        $h.grid = require('./helpers/grid-helpers.js');
        $h.form = require('./helpers/form-helpers.js');
        $h.file = require('./helpers/file-helpers.js');
        $h.login = require('./helpers/login-helpers.js');
        $h.designer = require('./helpers/designer-helpers.js');
        $h.select = require('./helpers/select-helpers.js');
        $h.postgres = require('./helpers/postgres-helpers.js');
        $h.menu = require('./helpers/menu-helpers.js');
        $h.scheduler = require('./helpers/scheduler-helpers.js');
        $h.task = require('./helpers/task-helpers.js');

        protractor.constants = {};
        var jasmineReporters = require('jasmine-reporters');

        var reportOutput = config.reportOutput || 'xmloutput';
        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
            consolidateAll: true,
            savePath: $h.workspaceDirectory || 'testresults',
            filePrefix: reportOutput
        }));

        var totalStatusPath = protractor.libs.path.join($h.workspaceDirectory, 'totalStatus.json');
        protractor.totalStatus = {
            ok: true,
            withErrors: false,
            suits: []
        };

        jasmine.getEnv().addReporter({
            jasmineStarted: function (suiteInfo) {
            },
            suiteStarted: function (result) {
                protractor.totalStatus.suits.push({
                    ok: true,
                    description: result.description,
                    fullName: result.fullName,
                    specs: []
                });
            },
            specStarted: function (result) {

                var suit = protractor.totalStatus.suits[protractor.totalStatus.suits.length - 1];
                var canContinue = suit.description.endsWith('##can_continue') || result.description.endsWith('##can_continue');
                jasmine.getEnv().throwOnExpectationFailure(!canContinue);

            },
            specDone: function (result) {
                var suit = protractor.totalStatus.suits[protractor.totalStatus.suits.length - 1];
                var spec = {
                    ok: true,
                    description: result.description,
                    fullName: result.fullName,
                };
                if (result.status === 'failed') {
                    var canContinue = suit.description.endsWith('##can_continue') || result.description.endsWith('##can_continue');
                    spec.ok = false;
                    if (canContinue) {
                        protractor.totalStatus.withErrors = true;
                    }
                    else {
                        protractor.totalStatus.ok = false;
                    }
                }
                suit.specs.push(spec);

            },
            suiteDone: function (result) {
            },

            jasmineDone: function () {
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

        clearDownloads();
    },
    capabilities: {
        // chromeOptions: {
        //     args: [ "--start-maximized",
        //     "--start-fullscreen"] // to start browser as maximixed
        // },
        // Number of times to run this set of capabilities (in parallel, unless
        // limited by maxSessions). Default is 1.
        count: 1,
        // запуск  тестов в Chrome
        browserName: 'chrome',
        chromeOptions: {
            prefs: {
                download: {
                    default_directory: downloadsPath,
                }
            }
        },
        
        // // запуск тестов в FireFox
        // browserName: 'firefox',
        // firefoxOptions: {
        //     prefs: {
        //         download: {
        //             default_directory: downloadsPath,
        //         }
        //     }
        // },
    },
};

if (useLocal) {
    config.directConnect = true
    // config.params.jenkins.host = 'localhost' //'94.142.142.227'
    // config.params.jenkins.port = '8080'
}
else {
    //config.directConnect = true
    config.seleniumAddress = 'http://localhost:4444/wd/hub';
}

exports.config = config


Array.prototype.flatMap = function (lambda) {
    return Array.prototype.concat.apply([], this.map(lambda))
}


