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

exports.tableLoadWait = function(originalData){
    return browser.wait(EC.presenceOf(element(by.class(".k-grid-content"))))
    .then(function(){
        return originalData;
    });
};