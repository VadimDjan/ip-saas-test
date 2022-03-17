var ROOT_SELECTOR = 'ul.nav.navbar-nav ';
var $h = protractor.helpers;

var expliciteWait = $h.wait.expliciteWait;
var angularWait = $h.wait.angularWait;

exports.selectInMenu = async (pathArray) => {
    try {
        for (let i = 0; i < pathArray.length; i++) {
            if (i === 0 && pathArray.length === 1) {
                const menuItem = await element(by.cssContainingText('.navbar-item ul.navbar-100 li a', pathArray[i]))
                await menuItem.click();
            }
        }
    } catch (e) {
        console.error(e);
    }
}