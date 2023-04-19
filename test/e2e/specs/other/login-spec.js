describe('Автотест на логин', function () {
    const $h = protractor.helpers;
    it('1. URL does not contain /login. ##can_continue', async () => {
        try {
            await $h.login.loginToPage(null, $h.login.userName, $h.login.password);
            const url = await browser.getCurrentUrl();
            let s = url.substring(url.indexOf('#') + 1);
            expect(s === '/login').toBe(false);
            console.log(`path: ${s}`);
        } catch (e) {
            console.error(e);
        }
    });

    it('2. menu-component is present after login attempt. ##can_continue', async () => {
        expect(await $h.grid.main.searchElement('.ip-main-menu')).toBe(true);
    });
});