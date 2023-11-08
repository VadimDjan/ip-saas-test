describe('Настройка доступа переходов ЖЦ В доставку и Завершение', function() {
  const $h = protractor.helpers;
  const EC = protractor.ExpectedConditions;
  
  const { errorCatcher } = $h.common;
  const { defaultWaitTimeout } = $h.wait;
    
  function skip() {
    return !protractor.totalStatus.ok;
  }

  // it('зайти под заказчик 1', async done => {
  //   console.log('Авторизация в системе');
  //   await errorCatcher(async () => {
  //     await browser.get('https://service-manager.online/app/#/entityaccessmap');
  //     await browser.sleep(2000);
  //     const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
  //     if (loginHeader) {
  //       await element(by.name('user')).sendKeys('test_customer1@mail.ru'); // tech@ideaplatform.ru, esp9fx45@reserved.ip
  //       await browser.sleep(2500);
  //       await element(by.name('password')).sendKeys('Qwerty123!');
  //       await browser.sleep(2500);
  //       await element(by.css('.login__fieldset button')).click();
  //       await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
  //     }
  //     await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
  //   }, done);
  // }, skip());

  // it('Добавление записей в Заказы', async done => {
  //   await errorCatcher(async () => {
  //     await browser.get('https://service-manager.online/app/#/order_table');
  //     await browser.sleep(2000);

  //     // формирование вида списка Заказов
  //     await element(by.css('.view-settings-button')).click();
  //     await browser.sleep(2000);
  //     await element(by.css('.k-column-menu ul li[data-field-name="delivery_date"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="customer"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="address"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="displayname"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="workflowstepid"]')).click();
  //     await browser.sleep(2000);
  //     await browser.refresh();
  //     await browser.sleep(2000);

  //     // добавление записей в справочник Заказы
  //     // 1
  //     await element(by.cssContainingText('a', 'Добавить')).click();
  //     await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Заказ'))), defaultWaitTimeout);
  //     await browser.sleep(2000);
  //     await element(by.css('.displayname__name')).sendKeys('Заказ 2 / 310723');
  //     await browser.sleep(2000);
  //     await element(by.css('div[data-field-name="address"] input')).sendKeys('Тут есть буква у');
  //     await browser.sleep(200);
  //     await element(by.css('div[data-field-name="phone"] input')).sendKeys('abc');
  //     await browser.sleep(2000);
  //     await element(by.css('div[data-field-name="phone"] input')).clear().sendKeys('+7(545)3521597');
  //     await browser.sleep(200);
  //     await element(by.css('div[data-field-name="delivery_time"] button')).click();
  //     await browser.sleep(2000);
  //     await element(by.cssContainingText('div[data-field-name="delivery_time"] .rw-popup-container ul li', '17:00')).click();
  //     await browser.sleep(2000);
  //     await element(by.css('div[data-field-name="customer"]')).click();
  //     await browser.sleep(2000);
  //     await element(by.cssContainingText('.rw-popup-container ul li', 'customer1')).click();
  //     await browser.sleep(5000);
  //     await element(by.css('button[data-button-name="CREATE"]')).click();
  //     await browser.sleep(2000);

  //     await element(by.cssContainingText('.accordion-panel', 'new')).click();
  //     await browser.sleep(2000);

  //     // формирование вида списка Заказов в сабгриде
  //     await element(by.css('div[data-field-name="test_subgrid"] .view-settings-button')).click();
  //     await browser.sleep(2000);
  //     await element(by.css('.k-column-menu ul li[data-field-name="order_link"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="spare_link"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="quantity"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="displayname"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="summtest"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="price_order"]')).click();
  //     await element(by.css('.k-column-menu ul li[data-field-name="workflowstepid"]')).click();
  //     await browser.sleep(2000);
  //     await browser.refresh();
  //     await browser.sleep(2000);
  //     await element(by.cssContainingText('.accordion-panel', 'new')).click();
  //     await browser.sleep(2000);

  //     await element.all(by.css('.idea-button-add-row-modal')).last().click();
  //     await browser.sleep(2000);
  //     await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('test order');
  //     await browser.sleep(200);
  //     await element(by.css('div[data-field-name="quantity"] input')).sendKeys('3');
  //     await browser.sleep(200);
  //     await element(by.css('div[data-field-name="spare_link"] .comboboxfield__container')).click();
  //     await browser.sleep(2000);
  //     await element.all(by.css('div[data-field-name="spare_link"] .rw-popup-container ul li')).first().click();
  //     await browser.sleep(2000);
  //     await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
  //     await browser.sleep(2000);
  //     await element.all(by.css('.modal-content .details__close-btn')).last().click();
  //     await browser.sleep(1500);

  //     await element(by.css('.modal-content .details__close-btn')).click();
  //     await browser.sleep(1500);

  //     const order = await element(by.cssContainingText('tr', 'Заказ 2 / 310723'));
  //     await browser.actions().doubleClick(order).perform();
  //     await browser.sleep(2000);
  //     await element(by.css('div[data-field-name="address"] input')).sendKeys('уууууу');
  //     await browser.sleep(200);
  //     await element(by.css('.accordion-panel', 'new')).click();
  //     await browser.sleep(2000);
  //     await element(by.css('.modal-content .details__close-btn')).click();
  //     await browser.sleep(1500);
  //     await element.all(by.cssContainingText('div', 'Закрыть форму')).last().click();
  //     await browser.sleep(2000);
      
  //   }, done);
  // }, skip());

  // it('выйти из заказчик 1', async done => {
  //   console.log('Выход из ИС');
  //   await errorCatcher(async () => {
  //     await browser.actions().mouseMove(element(by.className('username'))).perform();
  //     await browser.sleep(7000);
  //     const logoutBtn = await element(by.css('.button-log-out'));
  //     const hasLogoutBtn = await logoutBtn.isPresent();
  //     if (hasLogoutBtn) await logoutBtn.click();
  //     await browser.wait(EC.stalenessOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
  //     await expect(element(by.css('.login_service-manager')));
  //     await browser.sleep(2000);
  //   }, done);
  // }, skip());

  // it('зайти под заказчик 2', async done => {
  //   console.log('Авторизация в системе');
  //   await errorCatcher(async () => {
  //     await browser.get('https://service-manager.online/app/#/entityaccessmap');
  //     await browser.sleep(2000);
  //     const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
  //     if (loginHeader) {
  //       await element(by.name('user')).sendKeys('test_customer2@mail.ru'); // tech@ideaplatform.ru, esp9fx45@reserved.ip
  //       await browser.sleep(2500);
  //       await element(by.name('password')).sendKeys('Qwerty123!');
  //       await browser.sleep(2500);
  //       await element(by.css('.login__fieldset button')).click();
  //       await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
  //     }
  //     await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
  //   }, done);
  // }, skip());

  it('Добавление записей в Заказы', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/order_table');
      await browser.sleep(2000);

      // формирование вида списка Заказов
      await element(by.css('.view-settings-button')).click();
      await browser.sleep(2000);
      await element(by.css('.k-column-menu ul li[data-field-name="delivery_date"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="customer"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="address"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="displayname"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="workflowstepid"]')).click();
      await browser.sleep(2000);
      await browser.refresh();
      await browser.sleep(2000);

      // добавление записей в справочник Заказы
      // 1
      await element(by.cssContainingText('a', 'Добавить')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Заказ'))), defaultWaitTimeout);
      await browser.sleep(2000);
      await element(by.css('.displayname__name')).sendKeys('Заказ 4 / 310723');
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="address"] input')).sendKeys('Тут есть буква у');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="phone"] input')).sendKeys('+7(545)6126552');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="delivery_time"] button')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="delivery_time"] .rw-popup-container ul li', '10:30')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="customer"]')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.rw-popup-container ul li', 'customer2')).click();
      await browser.sleep(5000);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);

      await element(by.cssContainingText('.accordion-panel', 'new')).click();
      await browser.sleep(2000);

      // формирование вида списка Заказов
      await element(by.css('div[data-field-name="test_subgrid"] .view-settings-button')).click();
      await browser.sleep(2000);
      await element(by.css('.k-column-menu ul li[data-field-name="order_link"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="spare_link"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="quantity"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="displayname"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="summtest"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="price_order"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="workflowstepid"]')).click();
      await browser.sleep(2000);
      await browser.refresh();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'new')).click();
      await browser.sleep(2000);
      
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('test order');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="quantity"] input')).sendKeys('4');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="spare_link"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="spare_link"] .rw-popup-container ul li')).first().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert__close-btn')).click();
      await browser.sleep(200);
      await element.all(by.css('.modal-content .details__close-btn')).last().click();
      await browser.sleep(1500);

      await element(by.css('.modal-content .details__close-btn')).click();
      await browser.sleep(1500);      
    }, done);
  }, skip());

  it('выйти из заказчик 2', async done => {
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

