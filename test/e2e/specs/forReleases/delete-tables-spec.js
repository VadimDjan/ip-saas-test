describe('Workflow', function () {
    const $h = protractor.helpers;
    const EC = protractor.ExpectedConditions;

    const { errorCatcher } = $h.common;
    const { defaultWaitTimeout } = $h.wait;

    let workFlowId;

    function skip() {
        return !protractor.totalStatus.ok;
    }

    it('open link', async done => {
    console.log('Авторизация в системе');
    await errorCatcher(async () => {
      await browser.get('http://localhost:8080/#/entitytype');
      await browser.sleep(2000);
      const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
      if (loginHeader) {
        await element(by.name('user')).clear().sendKeys('alisa');
        await browser.sleep(500);
        await element(by.name('password')).clear().sendKeys('Ktnj_pf_jryjv1');
        await browser.sleep(500);
        await element(by.css('.login__fieldset button')).click();
        // await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
        await browser.sleep(2000);
      }
    //   await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());

    it('remove wf', async done => {
        await errorCatcher(async () => {
            await browser.get('http://localhost:8080/#/workflow');
            await browser.sleep(2000);


        }, done);
    }, skip());

    it('remove tables', async done => {
        await errorCatcher(async () => {
            await browser.get('http://localhost:8080/#/display/568');
            await browser.sleep(2000);
            
            // await element(by.css('.idea-button-load-display')).click();
            // const tabs = await browser.getAllWindowHandles();
            // await browser.switchTo().window(tabs[1]);
            // await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Настройки отображения'))), defaultWaitTimeout);
            // await browser.sleep(2000);

            await element(by.css('div[data-field-name="candelete"] .checkboxfield__checkbox')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.sleep(2000);

            await browser.get('http://localhost:8080/#/entitytype');
            await browser.wait(EC.presenceOf(element(by.cssContainingText(''))))
        }, done);
    }, skip());

    it('8. Logout', async done => {
        console.log('Выход из ИС');
        await errorCatcher(async () => {
          await browser.actions().mouseMove(element(by.className('username'))).perform();
          await browser.sleep(2000);
          const logoutBtn = await element(by.css('.button-log-out'));
          const hasLogoutBtn = await logoutBtn.isPresent();
          if (hasLogoutBtn) await logoutBtn.click();
          await browser.wait(EC.stalenessOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
          await expect(element(by.css('.login_service-manager')));
          await browser.sleep(2000);
        }, done);
      }, skip());
});
