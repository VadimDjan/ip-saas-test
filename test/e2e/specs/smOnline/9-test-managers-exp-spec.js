describe('Проверка интерфейса менеджера', function() {
  const $h = protractor.helpers;
  const EC = protractor.ExpectedConditions;
  
  const { errorCatcher } = $h.common;
  const { defaultWaitTimeout } = $h.wait;
    
  function skip() {
    return !protractor.totalStatus.ok;
  }

  it('open link', async done => {
    console.log('Авторизация в системе');
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/login');
      await browser.sleep(2000);
      const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
      if (loginHeader) {
        await element(by.name('user')).sendKeys('test_manager2@mail.ru'); // tech@ideaplatform.ru, esp9fx45@reserved.ip
        await browser.sleep(2500);
        await element(by.name('password')).sendKeys('Qwerty123!');
        await browser.sleep(2500);
        await element(by.css('.login__fieldset button')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      }
      await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());

  it('...', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/');
      await browser.sleep(2000);

      const footerEl = await element(by.cssContainingText('.chart-wrapper .dashboard-item__title', 'Заказ'));
      await browser.executeScript("arguments[0].scrollIntoView();", footerEl);
      await browser.sleep(2500);

      const item = await element.all(by.css('.chart-wrapper .nv-slice')).last();
      await browser.actions().doubleClick(item).perform();
      await browser.sleep(2000);

      await element(by.css('.details__close-btn')).click();
      await browser.sleep(2000);

      const lastItem = await element(by.cssContainingText('.chart-wrapper .dashboard-item__title', 'Анализ работы менеджеров'));
      await browser.executeScript("arguments[0].scrollIntoView();", lastItem);
      await browser.sleep(2500);

      const managerRow = await element(by.css('.nv-bar'));
      await browser.actions().doubleClick(managerRow).perform();
      await browser.sleep(2000);

      await element(by.css('.details__close-btn')).click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('8. Logout', async done => {
    console.log('Выход из ИС');
    await errorCatcher(async () => {
      await browser.actions().mouseMove(element(by.className('username'))).perform();
      await browser.sleep(7000);
      const logoutBtn = await element(by.css('.button-log-out'));
      const hasLogoutBtn = await logoutBtn.isPresent();
      if (hasLogoutBtn) await logoutBtn.click();
      await browser.wait(EC.stalenessOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      await expect(element(by.css('.login_service-manager')));
      await browser.sleep(2000);
    }, done);
  }, skip());

  // it('9. Remove the workspace', async done => {
  //   console.log('9. Удаление пространства');
  //   await errorCatcher(async () => {
  //     await browser.get('https://service-manager.online/app/#/workspace');
  //     await browser.sleep(2500);

  //     // авторизуемся под autotest
  //     await element(by.name('user')).sendKeys('autotest');
  //     await browser.sleep(2000);
  //     await element(by.name('password')).sendKeys('autoTest123!$');
  //     await browser.sleep(2000);
  //     await element(by.css('.login__fieldset button')).click();
  //     await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
  //     await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
  //     await browser.sleep(2000);

  //     const autoTestRow = await element(by.cssContainingText('tr', 'autotest'));
  //     await browser.actions().doubleClick(autoTestRow).perform();
  //     await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Рабочее пространство'))), defaultWaitTimeout);
  //     await browser.sleep(2000);

  //     // удаление пространства
  //     await element(by.css('button[data-button-name="DELETE_TEST_WORKSPACE"]')).click();
  //     await browser.sleep(12000);
  //   }, done);
  // }, skip());

  it('8. Logout', async done => {
    console.log('Выход из ИС');
    await errorCatcher(async () => {
      await browser.actions().mouseMove(element(by.className('username'))).perform();
      await browser.sleep(7000);
      const logoutBtn = await element(by.css('.button-log-out'));
      const hasLogoutBtn = await logoutBtn.isPresent();
      if (hasLogoutBtn) await logoutBtn.click();
      await browser.wait(EC.stalenessOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      await expect(element(by.css('.login_service-manager')));
      await browser.sleep(2000);
    }, done);
  }, skip());
});

