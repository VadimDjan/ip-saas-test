describe('Настройка доступа переходов ЖЦ В доставку и Завершение', function() {
  const $h = protractor.helpers;
  const EC = protractor.ExpectedConditions;
     
  const { errorCatcher } = $h.common;
  const { defaultWaitTimeout } = $h.wait;

  let managerTwoLink, customerOneLink, customerTwoLink;
        
  function skip() {
    return !protractor.totalStatus.ok;
  }
    
  it('open link', async done => {
    console.log('Авторизация в системе');
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/entityaccessmap');
      await browser.sleep(2000);
      const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
      if (loginHeader) {
        await element(by.name('user')).sendKeys('tech@ideaplatform.ru'); // tech@ideaplatform.ru, esp9fx45@reserved.ip
        await browser.sleep(2500);
        await element(by.name('password')).sendKeys('Qwerty123!');
        await browser.sleep(2500);
        await element(by.css('.login__fieldset button')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      }
      await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());

  it('Выслать приглашение пользователям и настроить им доступ', async done => {
      console.log('Выслать приглашение пользователям и настроить им доступ');
      await errorCatcher(async () => {
        await browser.sleep(2000);
        await browser.actions().mouseMove(element(by.className('username'))).perform();
        await browser.sleep(2000);
        const userProfileBtn = await element(by.cssContainingText('.dropdown-menu li', 'Личный кабинет'));
        const hasUserProfileBtn = await userProfileBtn.isPresent();
        if (hasUserProfileBtn) await userProfileBtn.click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Личный кабинет пользователя'))), defaultWaitTimeout);
        await browser.sleep(1000);
  
        await browser.wait(EC.stalenessOf($('.loader-spinner')), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.cssContainingText('.details__modal .accordion-panel', 'Моя рабочая область')).click();
        await browser.wait(EC.visibilityOf(element(by.css('.dashboard-item__wrapper_subgrid'))), defaultWaitTimeout);
        await browser.sleep(2000);
        
        // приглашение заказчика
        await element(by.css('div[data-field-name="workspace_invite_user_email"] input')).clear();
        await browser.sleep(1000);
        await element(by.css('div[data-field-name="workspace_invite_user_email"] input')).sendKeys('test_customer1@mail.ru');
        await browser.sleep(2000);
        await element(by.cssContainingText('button', 'Пригласить')).click();
        await browser.sleep(2000);
        
        // приглашение заказчика
        await element(by.css('div[data-field-name="workspace_invite_user_email"] input')).clear();
        await browser.sleep(1000);
        await element(by.css('div[data-field-name="workspace_invite_user_email"] input')).sendKeys('test_customer2@mail.ru');
        await browser.sleep(2000);
        await element(by.cssContainingText('button', 'Пригласить')).click();
        await browser.sleep(2000);
        
        // приглашение менеджера
        await element(by.css('div[data-field-name="workspace_invite_user_email"] input')).clear();
        await browser.sleep(1000);
        await element(by.css('div[data-field-name="workspace_invite_user_email"] input')).sendKeys('test_manager2@mail.ru');
        await browser.sleep(2000);
        await element(by.cssContainingText('button', 'Пригласить')).click();
        await browser.sleep(2000);
        
        // настройка менеджера anylogic
        const manager1 = await element(by.cssContainingText('tr', 'anylogic.models@ideaplatform.ru'));
        await browser.actions().doubleClick(manager1).perform();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="roleid"] .comboboxfield__container span[title="Очистить"]')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="roleid"] .comboboxfield__container')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="roleid"] .rw-popup-container ul li', 'Менеджер')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="authtype"] .comboboxfield__container')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="authtype"] .rw-popup-container ul li', 'APPLICATION')).click();
        await browser.sleep(2000);
        await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
        await browser.sleep(2000);
        
        // настройка менеджера 2
        const manager2 = await element(by.cssContainingText('tr', 'test_manager2@mail.ru'));
        await browser.actions().doubleClick(manager2).perform();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="roleid"] .comboboxfield__container span[title="Очистить"]')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="roleid"] .comboboxfield__container')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="roleid"] .rw-popup-container ul li', 'Менеджер')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="authtype"] .comboboxfield__container')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="authtype"] .rw-popup-container ul li', 'APPLICATION')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
        await browser.sleep(2000);
        managerTwoLink = await element(by.css('div[data-field-name="confirmationcode"] .textfield__wrapper input')).getAttribute('value');
        await browser.sleep(1000);
        await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
        await browser.sleep(2000);
        
        // настройка заказчика 1
        const customer1 = await element(by.cssContainingText('tr', 'test_customer1@mail.ru'));
        await browser.actions().doubleClick(customer1).perform();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="roleid"] .comboboxfield__container span[title="Очистить"]')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="roleid"] .comboboxfield__container')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="roleid"] .rw-popup-container ul li', 'Заказчик')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="authtype"] .comboboxfield__container')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="authtype"] .rw-popup-container ul li', 'APPLICATION')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
        await browser.sleep(2000);
        customerOneLink = await element(by.css('div[data-field-name="confirmationcode"] .textfield__wrapper input')).getAttribute('value');
        await browser.sleep(1000);
        await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
        await browser.sleep(2000);

        // настройка заказчика 2
        const customer2 = await element(by.cssContainingText('tr', 'test_customer2@mail.ru'));
        await browser.actions().doubleClick(customer2).perform();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="roleid"] .comboboxfield__container span[title="Очистить"]')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="roleid"] .comboboxfield__container')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="roleid"] .rw-popup-container ul li', 'Заказчик')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="authtype"] .comboboxfield__container')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="authtype"] .rw-popup-container ul li', 'APPLICATION')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
        await browser.sleep(2000);
        customerTwoLink = await element(by.css('div[data-field-name="confirmationcode"] .textfield__wrapper input')).getAttribute('value');
        await browser.sleep(1000);
        await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
        await browser.sleep(2000);

        await element(by.css('.details__close-btn')).click();
        await browser.sleep(2000);

        console.log('добавим менеджеров в группу');
        await browser.get('https://service-manager.online/app/#/accessgroup');
        await browser.sleep(2000);
        const groupRow = await element(by.cssContainingText('tr', 'Менеджеры'));
        await browser.actions().doubleClick(groupRow).perform();
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel', 'Пользователи')).click();
        await browser.sleep(2000);

        await element(by.css('div[data-field-name="users"] .idea-button-add-row')).click();
        await browser.sleep(2000);
        await element(by.css('tr[data-role="editable"] td .k-input')).sendKeys('manager1');
        await browser.sleep(2000);
        await element(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'manager1')).click();
        await browser.sleep(2000);
        await element(by.css('.k-grid-update')).click();
        await browser.sleep(2000);

        await element(by.css('div[data-field-name="users"] .idea-button-add-row')).click();
        await browser.sleep(2000);
        await element(by.css('tr[data-role="editable"] td .k-input')).sendKeys('manager2');
        await browser.sleep(2000);
        await element(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'manager2')).click();
        await browser.sleep(2000);
        await element(by.css('.k-grid-update')).click();
        await browser.sleep(2000);
      }, done);
    }, skip());
    
  it('Выйти от workspace owner', async done => {
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

  it('Зарегистрировать 2 менеджера', async done => {
    await errorCatcher(async () => {
      await browser.get(`https://service-manager.online/app/#/user_confirmation?code=${managerTwoLink}`);
      await browser.refresh();
      await browser.sleep(2000);


      await element(by.css('input[name="user"]')).clear().sendKeys('manager2');
      await browser.sleep(200);

      const passwordInput = await element.all(by.css('input[type="password"]')).first();
      passwordInput.clear().sendKeys('Qwerty123!');
      await browser.sleep(200);

      const repeatPasswordInput = await element.all(by.css('input[type="password"]')).last();
      repeatPasswordInput.clear().sendKeys('Qwerty123!');
      await browser.sleep(200);

      await element(by.css('button')).click();
      await browser.sleep(2000);

      await element(by.css('.alerts__container .alert__close-btn')).click();
      await browser.sleep(200);
    }, done);
  }, skip());

  it('Выйти от 2 менеджера', async done => {
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

  it('Зарегистрировать 1 заказчика', async done => {
    await errorCatcher(async () => {
      await browser.get(`https://service-manager.online/app/#/user_confirmation?code=${customerOneLink}`);
      await browser.refresh();
      await browser.sleep(2000);

      await element(by.css('input[name="user"]')).clear().sendKeys('customer1');
      await browser.sleep(200);

      const passwordInput = await element.all(by.css('input[type="password"]')).first();
      passwordInput.clear().sendKeys('Qwerty123!');
      await browser.sleep(200);

      const repeatPasswordInput = await element.all(by.css('input[type="password"]')).last();
      repeatPasswordInput.clear().sendKeys('Qwerty123!');
      await browser.sleep(200);

      await element(by.css('button')).click();
      await browser.sleep(2000);

      await element(by.css('.alerts__container .alert__close-btn')).click();
      await browser.sleep(200);
    }, done);
  }, skip());

  it('Выйти от 1 заказчика', async done => {
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

  it('Зарегистрировать 2 заказчика', async done => {
    await errorCatcher(async () => {
      await browser.get(`https://service-manager.online/app/#/user_confirmation?code=${customerTwoLink}`);
      await browser.refresh();
      await browser.sleep(2000);

      await element(by.css('input[name="user"]')).clear().sendKeys('customer2');
      await browser.sleep(200);

      const passwordInput = await element.all(by.css('input[type="password"]')).first();
      passwordInput.clear().sendKeys('Qwerty123!');
      await browser.sleep(200);

      const repeatPasswordInput = await element.all(by.css('input[type="password"]')).last();
      repeatPasswordInput.clear().sendKeys('Qwerty123!');
      await browser.sleep(200);

      await element(by.css('button')).click();
      await browser.sleep(2000);

      await element(by.css('.alerts__container .alert__close-btn')).click();
      await browser.sleep(200);
    }, done);
  }, skip());

  it('Выйти от 2 заказчика', async done => {
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
    
    