exports.expliciteWait = function(originalData){
    return browser.sleep(protractor.expliciteWaitTime)
    .then(function(){
        return originalData;
    });
};

exports.angularWait = function(originalData){
    return browser.waitForAngular()
    .then(function(){
        return originalData;
    });
};