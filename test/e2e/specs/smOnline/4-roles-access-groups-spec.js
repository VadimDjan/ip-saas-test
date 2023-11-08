describe('Роли и группы доступа', function() {
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
      await browser.get('https://service-manager.online/app/#/entityaccessmap');
      await browser.sleep(2000);
      const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
      if (loginHeader) {
        await element(by.name('user')).sendKeys('tech@ideaplatform.ru');
        await browser.sleep(200);
        await element(by.name('password')).sendKeys('Qwerty123!');
        await browser.sleep(200);
        await element(by.css('.login__fieldset button')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      }
      await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());

  it('Добавление ролей Заказчика и Менеджера', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/role');
      await browser.sleep(2000);

      //заказчик
      console.log('добавить роль заказчика');
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Роль'))), defaultWaitTimeout);
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Заказчик');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="defmenuid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="defmenuid"] .rw-popup-container ul li', 'Страница заказчика')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="navmenuid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="navmenuid"] .rw-popup-container ul li', 'Меню заказчика')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="shortname"] input')).sendKeys('customer');
      await browser.sleep(500);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);

      // менеджер
      console.log('добавить роль менеджера');
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Роль'))), defaultWaitTimeout);
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Менеджер');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="defmenuid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="defmenuid"] .rw-popup-container ul li', 'Страница менеджера')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="navmenuid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="navmenuid"] .rw-popup-container ul li', 'Меню менеджера')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="shortname"] input')).sendKeys('manager');
      await browser.sleep(500);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);

    }, done);
  }, skip());

  it('Добавление групп доступа для заказчиков и менеджеров', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/accessgroup');
      await browser.sleep(2000);

      // заказчик
      console.log('добавить группу доступа заказчика');
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Заказчики');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="grouptype"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="grouptype"] .rw-popup-container ul li', 'QUERY')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="groupquery"] input')).sendKeys("select u.user_id as userId from system.ipuser u inner join system.iprole r on r.role_id = u.role_id where r.short_name = 'customer'");
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);

      // менеджер
      console.log('добавить группу доступа менеджера');
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Менеджеры');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="grouptype"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="grouptype"] .rw-popup-container ul li', 'STATIC')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);
    }, done);
  }, skip());

  it('Добавление клиентского правила для поля типа иконка/Особенности', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/rule');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.displayname__name_active')).sendKeys('for icon field');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="script"] .ace_editor textarea')).sendKeys('if (record.get("delivery_condition")) { record.set("is_condition", "glyphicon glyphicon-warning-sign#FF5733"); }');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="isui"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);

      await element(by.cssContainingText('.accordion-panel', 'Используется в')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="relatedentitytypes"] .idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('order_table');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'order_table')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('5');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="eventid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="eventid"] .rw-popup-container ul li', '11-Изменение данных на клиенте')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  // проверить
  it('Добавление клиентского правила для поля Доп.опции', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/rule');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.displayname__name_active')).sendKeys('for multiple checkboxes');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="script"] .ace_editor textarea')).sendKeys('if (record.get("delivery_time") && !record.get("other_conditions")) { record.set("other_conditions", "2"); }');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="isui"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);

      await element(by.cssContainingText('.accordion-panel', 'Используется в')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="relatedentitytypes"] .idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('order_table');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'order_table')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('6');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="eventid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="eventid"] .rw-popup-container ul li', '10-Открытие формы на клиенте')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('Добавление клиентского правила для поля Сайт производителя', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/rule');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.displayname__name_active')).sendKeys('for html field');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="script"] .ace_editor textarea')).sendKeys('if (!record.get("site") && record.get("is_condition")) record.set("site", "https://petrovich.ru/catalog/95761872/105425/");');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="isui"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);

      await element(by.cssContainingText('.accordion-panel', 'Используется в')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="relatedentitytypes"] .idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('order_table');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'order_table')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('7');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="eventid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="eventid"] .rw-popup-container ul li', '11-Изменение данных на клиенте')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('Добавление клиентского правила для перехода ЖЦ', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/rule');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.displayname__name_active')).sendKeys('alert with subgrid');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="script"] .ace_editor textarea')).sendKeys(`
      if (context.button.transitionName === "to_prepare") {
        record.getPopup('Подтвердите состав заказа:', 'test_subgrid');
      }`);
      await browser.sleep(200);
      await element(by.css('div[data-field-name="ifcondition"] input')).clear().sendKeys('context.button != null && context.button.transitionName!= null');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="isui"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);

      await element(by.cssContainingText('.accordion-panel', 'Используется в')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="relatedentitytypes"] .idea-button-add-row-modal')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Связь Таблицы и Правила'))), defaultWaitTimeout);
      await browser.sleep(200);
      await element(by.css('div[data-field-name="entitytypeid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('order_table');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'order_table')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('8');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="eventid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="eventid"] .rw-popup-container ul li', '11-Изменение данных на клиенте')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('8. Logout', async done => {
    console.log('Выход из ИС');
    await errorCatcher(async () => {
      await browser.actions().mouseMove(element(by.className('username'))).perform();
      await browser.sleep(1000);
      const logoutBtn = await element(by.css('.button-log-out'));
      const hasLogoutBtn = await logoutBtn.isPresent();
      if (hasLogoutBtn) await logoutBtn.click();
      await browser.wait(EC.stalenessOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      await expect(element(by.css('.login_service-manager')));
      await browser.sleep(2000);
    }, done);
  }, skip());
})

