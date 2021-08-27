describe('Автотест на логин', function () {
    var $h = protractor.helpers;
    protractor.helpers.login.loginToPage(null, protractor.helpers.login.userName, protractor.helpers.login.password);

    it('1. URL does not contain /login. ##can_continue', function () {
        browser.sleep(1000);
        browser.getCurrentUrl().then(function (url) {
            let s = url.substring(url.indexOf('#') + 1);
            // console.log('url', url)
            expect(s === '/login').toBe(false);
        });
    });

    it('2. menu-component is present after login attempt. ##can_continue', function () {
        expect(protractor.helpers.grid.main.searchElement('menu-component')).toBe(true);
    });

})