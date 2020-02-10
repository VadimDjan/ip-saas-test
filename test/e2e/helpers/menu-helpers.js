var ROOT_SELECTOR = 'ul.nav.navbar-nav ';
var $h = protractor.helpers;

var expliciteWait = $h.wait.expliciteWait;
var angularWait = $h.wait.angularWait;

exports.selectInMenu = function selectInMenu(pathArray){
    var el = element(by.css(ROOT_SELECTOR));
    var fullSelector = ROOT_SELECTOR;
    function sleep(){
        return angularWait()
    }
    
    pathArray.forEach(function(currentMenuName, idx){
        var selector = (idx > 0 ? ' ~ ul ' : '' ) + 'a[data-menu-name=\"' + currentMenuName + '\"] ';
        fullSelector += selector;
        $h.common.scrollToSelector(fullSelector);
        sleep().then(() => {
            el = element(by.css(fullSelector))
            if(idx == pathArray.length - 1){
                
                el.isDisplayed().then(visibile => {
                    if (visibile){
                        el.click().then(sleep)
                    }
                    else{
                        browser.executeScript((selector) => {
                            $(selector).click()
                        }, fullSelector).then(sleep)
                    }
                })
            }
            else{
                browser.actions().mouseMove(el).perform().then(sleep)
                
            }
        })
        
    });
    return sleep()
}