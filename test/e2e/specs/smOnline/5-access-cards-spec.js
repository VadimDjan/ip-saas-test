describe('Карты доступа', function() {
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

  it('Добавление карты доступа менеджера', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/entityaccessmap');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('order_table');
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container ul li')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entityname"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="entityname"] .rw-popup-container ul li', 'Группа доступа')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitysn"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="entitysn"] .rw-popup-container ul li', 'Менеджеры')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="canselect"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="cancreate"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="canupdate"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="candelete"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="cancancel"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('Добавление карты доступа заказчика', async done => {
    await errorCatcher(async () => {
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('order_table');
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container ul li')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entityname"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="entityname"] .rw-popup-container ul li', 'Группа доступа')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitysn"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="entitysn"] .rw-popup-container ul li', 'Заказчики')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="canselect"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="canselectcondition"] input')).sendKeys('"createdbyid = "+ContextUtils.getCurrentUser().getUserId()');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="cancreate"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="canupdate"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="canupdatecondition"] input')).sendKeys('CommonUtils.isSame(ContextUtils.getCurrentUser().getUserId(),record.getAsInteger("createdbyid")) && CommonUtils.isSame(record.get("workflowstepname"),"new")');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="candelete"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="candeletecondition"] input')).sendKeys('CommonUtils.isSame(ContextUtils.getCurrentUser().getUserId(),record.getAsInteger("createdbyid")) && CommonUtils.isSame(record.get("workflowstepname"),"new")');
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('Добавление клиентского правила для Менеджеров', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/rule');
      await browser.sleep(2000);

      // создаём правило
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('mngr new order');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="script"] .ace_editor textarea')).sendKeys('if (record.get("WORKFLOWSTEPNAME") == "new" && (ContextUtils.getCurrentUser().getRoleShortName() == "manager" || ContextUtils.getCurrentUser().getRoleShortName() == "WORKSPACE_OWNER")) { record.setFormEditable(false) }');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="isui"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);

      // добавляем правило в таблицу
      await browser.get('https://service-manager.online/app/#/entitytype');
      await browser.sleep(2000);
      await element.all(by.css('.k-pager-numbers li')).last().click();
      await browser.sleep(2000);
      const orderTable = await element(by.cssContainingText('tr', 'Заказ'));
      await browser.actions().doubleClick(orderTable).perform();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Правила')).click();
      await browser.sleep(2000);
      await element(by.css('.idea-button-add-row')).click();
      await browser.sleep(2000);
      await element(by.css('td[data-container-for="eventid"] .k-select')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.k-animation-container ul li', '10-Открытие формы на клиенте')).click();
      await browser.sleep(2000);
      await element(by.css('td[data-container-for="ruleid"] .k-select')).click();
      await browser.sleep(2000);
      await element(by.css('td[data-container-for="ruleid"] .k-input')).sendKeys('mngr new order');
      await browser.sleep(1500);
      await element(by.cssContainingText('.k-animation-container ul li', 'mngr new order')).click();
      await browser.sleep(2000);
      await element.all(by.css('td[data-container-for="sortorder"] .k-select')).first().click();
      await browser.sleep(200);
      await element(by.css('td .k-grid-update')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(5000);
    }, done);
  }, skip());

  it('Настройка прав перехода в ЖЦ и правила смены пользователя в документе', async done => {
    await errorCatcher(async () => {
      ///////////// добавление правила смены пользователя
      await browser.get('https://service-manager.online/app/#/rule');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('change user');
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="ifcondition"] .textfield__wrapper input')).clear();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="ifcondition"] .textfield__wrapper input')).sendKeys('record.get("workflowstepname") == "preparation" && record.get("manager") == null');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="script"] .ace_editor textarea')).sendKeys('record.set("manager", ContextUtils.getCurrentUserId());');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="isui"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);

      // добавление правила в таблицу
      await browser.get('https://service-manager.online/app/#/entitytype');
      await browser.sleep(2000);

      await element.all(by.css('.k-pager-numbers li')).last().click();
      await browser.sleep(2000);
      const orderTable = await element(by.cssContainingText('tr', 'Заказ'));
      await browser.actions().doubleClick(orderTable).perform();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Правила')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entityrulelist"] .idea-button-add-row')).click();
      await browser.sleep(2000);
      await element(by.css('td[data-container-for="eventid"] .k-select')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.k-animation-container ul li', '10-Открытие формы на клиенте')).click();
      await browser.sleep(2000);
      await element(by.css('td[data-container-for="ruleid"] .k-select')).click();
      await browser.sleep(1000);
      await element(by.css('td[data-container-for="ruleid"] .k-select')).click();
      await browser.sleep(1000);
      await element(by.css('td[data-container-for="ruleid"] .k-input')).sendKeys('change user');
      await browser.sleep(1500);
      await element(by.cssContainingText('.k-animation-container ul li', 'change user')).click();
      await browser.sleep(2000);
      await element.all(by.css('td[data-container-for="sortorder"] .k-select')).first().click();
      await browser.sleep(200);
      await element.all(by.css('td[data-container-for="sortorder"] .k-select')).first().click();
      await browser.sleep(200);
      await element(by.css('td .k-grid-update')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(5000);
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
});

