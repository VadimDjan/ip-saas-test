const defaultWaitTimeout = 20000;

exports.expliciteWait = function(originalData) {
    return browser.sleep(protractor.expliciteWaitTime)
        .then(function(){
            return originalData;
        });
};

exports.angularWait = function(originalData) {
    // return browser.waitForAngular()
  return browser.sleep(protractor.expliciteWaitTime)
        .then(function(){
            return originalData;
        });
};

exports.tableLoadWait = function(originalData) {
    return browser.wait(EC.presenceOf(element(by.class(".k-grid-content"))))
        .then(function(){
            return originalData;
        });
};

exports.popupHideWait = originalData => {
  return browser.wait(protractor.ExpectedConditions.stalenessOf(element(by.css('.uipopup__modal'))));
};

exports.waitForModalOpened = () => {
  return browser.wait(protractor.ExpectedConditions.presenceOf($('.modal-dialog')), defaultWaitTimeout);
}

exports.defaultWaitTimeout = defaultWaitTimeout;