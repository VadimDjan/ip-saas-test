describe('Настройка доступа переходов ЖЦ В доставку и Завершение', function() {
  const $h = protractor.helpers;
  const EC = protractor.ExpectedConditions;
  const path = protractor.libs.path;
  
  const { errorCatcher } = $h.common;
  const { defaultWaitTimeout } = $h.wait;
    
  function skip() {
    return !protractor.totalStatus.ok;
  }

  it('зайти под менеджер 1', async done => {
    console.log('Авторизация в системе');
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/entityaccessmap');
      await browser.sleep(2000);
      const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
      if (loginHeader) {
        await element(by.name('user')).sendKeys('anylogic.models@ideaplatform.ru'); // tech@ideaplatform.ru, esp9fx45@reserved.ip
        await browser.sleep(2500);
        await element(by.name('password')).sendKeys('Qwerty123!');
        await browser.sleep(2500);
        await element(by.css('.login__fieldset button')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      }
      await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());

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
      await element(by.css('.k-column-menu ul li[data-field-name="phone"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="is_condition"]')).click();
      await browser.sleep(2000);
      await browser.refresh();
      await browser.sleep(2000);

      const order = await element(by.cssContainingText('tr', 'Заказ 2 / 310723'));
      await browser.actions().doubleClick(order).perform();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="Создать заказ"]')).click();
      await browser.sleep(4000);
      // await browser.wait(EC.presenceOf(element(by.cssContainingText('.uipopup__title', 'Подтвердите состав заказа'))), defaultWaitTimeout);
      // await browser.sleep(1000);
      // await element(by.cssContainingText('.popup__dialog-btn_primary', 'Да')).click();
      // await browser.wait(EC.stalenessOf(element(by.css('.uipopup__modal'))), defaultWaitTimeout);
      // await browser.sleep(1000);
      await element(by.cssContainingText('div[data-field-name="other_conditions"] ul li', 'Доп.информация на сайте производителя')).click();
      await browser.sleep(80);
      await element(by.cssContainingText('div[data-field-name="other_conditions"] ul li', 'Указан тлф для связи')).click();
      await browser.sleep(80);
      await element(by.cssContainingText('div[data-field-name="other_conditions"] ul li', 'Указано время доставки')).click();
      await browser.sleep(80);
      await element(by.cssContainingText('div[data-field-name="other_conditions"] ul li', 'Документация производителя')).click();
      await browser.sleep(80);
      // загрузка в поле attachment
      const schemeField = await element(by.css('div[data-field-name="scheme"] input'));
      let imgUpload = './scheme.png';
      const absolutePath2 = path.resolve(__dirname, imgUpload);
      schemeField.sendKeys(absolutePath2);
      await browser.sleep(5000);
      // загрузка в поле multiAttachment
      const multiAttach = await element(by.css('div[data-field-name="documents"] input'));
      const docUpload = './1stdoc.rtf';
      const absPath = path.resolve(__dirname, docUpload);
      multiAttach.sendKeys(absPath);
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.attachmentfield__file-name', '1stdoc'))), defaultWaitTimeout);
      const docUpd = './2nddoc.rtf';
      const absPath2 = path.resolve(__dirname, docUpd);
      multiAttach.sendKeys(absPath2);
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.attachmentfield__file-name', '2nddoc'))), defaultWaitTimeout);
      // выбор иконки
      await element(by.css('div[data-field-name="delivery_condition"] .icon-picker__button')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.icon-picker__tab', 'Glyphicon')).click();
      await browser.sleep(200);
      await element(by.css('.icon-picker__modal-header-col input')).sendKeys('glass');
      await browser.sleep(1000);
      await element.all(by.css('.icon-picker__list li')).first().click();
      await browser.sleep(200);
      ////////////// тут ОК на русском языке)))))
      await element(by.cssContainingText('.icon-picker__modal-button', 'ОК')).click();
      await browser.sleep(2000);
      // fill floating field
      await element(by.css('div[data-field-name="test_floating"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="test_floating"] .rw-popup-container ul li', 'недели')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="UPDATE"]')).click();
      await browser.sleep(2000);      
    }, done);
  }, skip());

  it('выйти из менеджер 1', async done => {
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

  it('зайти под менеджер 2', async done => {
    console.log('Авторизация в системе');
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/entityaccessmap');
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
      await element(by.css('.k-column-menu ul li[data-field-name="phone"]')).click();
      await element(by.css('.k-column-menu ul li[data-field-name="is_condition"]')).click();
      await browser.sleep(2000);
      await browser.refresh();
      await browser.sleep(2000);

      const order = await element(by.cssContainingText('tr', 'Заказ 4 / 310723'));
      await browser.actions().doubleClick(order).perform();
      await browser.sleep(2000);
      await element(by.css('.details__close-btn')).click();
      await browser.sleep(2000);

      const anotherOrder = await element(by.cssContainingText('tr', 'Заказ 2 / 310723'));
      await browser.actions().doubleClick(anotherOrder).perform();
      await browser.sleep(2000);      
    }, done);
  }, skip());

  it('выйти из менеджер 2', async done => {
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

  it('зайти под менеджер 1', async done => {
    console.log('Авторизация в системе');
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/entityaccessmap');
      await browser.sleep(2000);
      const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
      if (loginHeader) {
        await element(by.name('user')).sendKeys('anylogic.models@ideaplatform.ru'); // tech@ideaplatform.ru, esp9fx45@reserved.ip
        await browser.sleep(2500);
        await element(by.name('password')).sendKeys('Qwerty123!');
        await browser.sleep(2500);
        await element(by.css('.login__fieldset button')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      }
      await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());

  it('Добавление записей в Заказы', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/order_table');
      await browser.sleep(2000);

      const order = await element(by.cssContainingText('tr', 'Заказ 2 / 310723'));
      await browser.actions().doubleClick(order).perform();
      await browser.sleep(2000);
      
      // press To delivery btn
      await element(by.css('button[data-button-name="Отправить заказ"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('.modal-content input')).last().sendKeys('30/07/2023');
      await browser.sleep(100);
      await element.all(by.cssContainingText('.modal-content div', 'Да')).last().click();
      await browser.sleep(4000);

      await element(by.css('button[data-button-name="Завершить"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('.modal-content .se-wrapper-inner')).last().sendKeys('test comment');
      await browser.sleep(200);
      await element.all(by.cssContainingText('div', 'Да')).last().click();
      await browser.sleep(2000);
      
    }, done);
  }, skip());

  it('выйти из менеджер 1', async done => {
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

