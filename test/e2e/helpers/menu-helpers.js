var ROOT_SELECTOR = 'ul.nav.navbar-nav ';
var $h = protractor.helpers;

var expliciteWait = $h.wait.expliciteWait;
var angularWait = $h.wait.angularWait;

exports.selectInMenu = async (pathArray) => {
    try {
        const navBarButtonElement = element(by.css('.navbar-header button.navbar-toggle'));
        const menuCollapsed = await navBarButtonElement.isPresent();
        console.log(menuCollapsed);
        if (menuCollapsed) {
            await browser.actions().mouseMove(navBarButtonElement).click().perform();
            await browser.sleep(500);
        }
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