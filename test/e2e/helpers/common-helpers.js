exports.waitForUrlToChange = function (loginPageUrl, user, password) {
    // если переход происходит по клику, необходимо выполнить ожидание смены url
    browser.wait(function(){
        return browser.getCurrentUrl().then(function compareCurrentUrl(url) {
            return loginPageUrl !== url;
        });
    });
};

exports.getTodayStr = function (){
    function twoDigits(d) {
        if (0 <= d && d < 10)
            return "0" + d.toString();
        if (-10 < d && d < 0)
            return "-0" + (-1 * d).toString();
        return d.toString();
    }
    var d = new Date;
    return d.getFullYear() + '-'+ twoDigits(1 + d.getMonth()) + '-' + twoDigits(d.getDate()) + ' '
            + twoDigits(d.getHours()) + ':' + twoDigits(d.getMinutes()) + ':' + twoDigits(d.getSeconds());
        
};

exports.getFullYear = function (){
    var d = new Date;
    return d.getFullYear();
};

exports.getTodayClientDate = function (){
    function twoDigits(d) {
        if (0 <= d && d < 10)
            return "0" + d.toString();
        if (-10 < d && d < 0)
            return "-0" + (-1 * d).toString();
        return d.toString();
    }
    var d = new Date;
    return twoDigits(d.getDate()) + '/' + twoDigits(1 + d.getMonth()) + '/' +  d.getFullYear();
        
};

exports.getTomorrowClientDate = function (){
    function twoDigits(d) {
        if (0 <= d && d < 10)
            return "0" + d.toString();
        if (-10 < d && d < 0)
            return "-0" + (-1 * d).toString();
        return d.toString();
    }
    var d = new Date(new Date().getTime() + 86400000);
    return twoDigits(d.getDate()) + '/' + twoDigits(1 + d.getMonth()) + '/' +  d.getFullYear();
        
};

exports.toClientDate = function (d){
    function twoDigits(d) {
        if (0 <= d && d < 10)
            return "0" + d.toString();
        if (-10 < d && d < 0)
            return "-0" + (-1 * d).toString();
        return d.toString();
    }
    return twoDigits(d.getDate()) + '/' + twoDigits(1 + d.getMonth()) + '/' +  d.getFullYear();
        
};


exports.scrollToSelector = function(selector){
    function scrollToSelector(_selector){
        var el = $(_selector);            
        if(el.length > 0) {
            el.get(0).scrollIntoView();
            return true;
        }
        else{
            return false;
        }
    }
    return browser
        .executeScript(scrollToSelector, selector)
        .then(function(){
            return browser.sleep(500);
        });
};