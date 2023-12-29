describe('Настройка доступа переходов ЖЦ В доставку и Завершение', function() {
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

  it('Добавление настроек меню для ролей Заказчика и Менеджера', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/menu');
      await browser.sleep(3000);

      // заказчик
      console.log('страница и меню для заказчика');
      await element(by.css('.idea-button-add-row')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Меню'))), defaultWaitTimeout);
      await browser.sleep(2000);
      // приветствие
      console.log('странца заказчика');
      const pageName1 = await element(by.css('div[data-field-name="menuname"] input'));
      await pageName1.sendKeys('Страница заказчика');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="menutype"] .rw-widget-container input')).click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="menutype"] .rw-popup ul li')).first().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="ifcondition"] input')).sendKeys('true');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="href"] input')).sendKeys('#/order_table');
      await browser.sleep(500);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.wait(EC.stalenessOf(element(by.css('[data-button-name="PROCESSANDBACK"] .loader-spinner'))), defaultWaitTimeout);
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);

      console.log('меню заказчика');
      await element(by.css('.idea-button-add-row')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Меню'))), defaultWaitTimeout);
      await browser.sleep(2000);
      //меню заказчика
      const menuName1 = await element(by.css('div[data-field-name="menuname"] input'));
      await menuName1.sendKeys('Меню заказчика');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="menutype"] .rw-widget-container input')).click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="menutype"] .rw-popup ul li')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('30');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="ifcondition"] input')).sendKeys('true');
      await browser.sleep(500);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.wait(EC.stalenessOf(element(by.css('[data-button-name="PROCESSANDBACK"] .loader-spinner'))), defaultWaitTimeout);
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);

      // менеджер
      console.log('страница и меню менеджера');
      await element(by.css('.idea-button-add-row')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Меню'))), defaultWaitTimeout);
      await browser.sleep(2000);
      // приветствие
      console.log('страница менеджера');
      const pageName2 = await element(by.css('div[data-field-name="menuname"] input'));
      await pageName2.sendKeys('Страница менеджера');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="menutype"] .rw-widget-container input')).click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="menutype"] .rw-popup ul li')).first().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="ifcondition"] input')).sendKeys('"manager".equalsIgnoreCase(ContextUtils.getCurrentUserRoleShortName())');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="href"] input')).sendKeys('#/dashboard/test_dashboard');
      await browser.sleep(500);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.wait(EC.stalenessOf(element(by.css('[data-button-name="PROCESSANDBACK"] .loader-spinner'))), defaultWaitTimeout);
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row')).click();
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Меню'))), defaultWaitTimeout);
      await browser.sleep(2000);
      //меню
      console.log('меню менеджера');
      await element(by.css('div[data-field-name="menuname"] input')).sendKeys('Меню менеджера');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="menutype"] .rw-widget-container input')).click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="menutype"] .rw-popup ul li')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
      await browser.sleep(500);
      await element(by.css('div[data-field-name="ifcondition"] input')).sendKeys('"manager".equalsIgnoreCase(ContextUtils.getCurrentUserRoleShortName())');
      await browser.sleep(500);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Дочерние меню')).click();
      await browser.sleep(2000);
      /// add Add order
      console.log('создать заказ');
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('input[name="menuname"]')).sendKeys('Создать заказ');
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="menutype"] .k-select')).click();
      await browser.sleep(200);
      await element(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'Пункт')).click();
      await browser.sleep(2000);
      await element(by.css('input[name="href"]')).sendKeys("addRow('order_table')");
      await browser.sleep(200);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      // add Search
      console.log('поиск');
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('input[name="menuname"]')).sendKeys('Найти');
      await browser.sleep(2000);
      await element(by.css('td[data-container-for="menutype"] .k-select')).click();
      await browser.sleep(200);
      await element(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'Группа')).click();
      await browser.sleep(2000);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      const searchItems = await element.all(by.cssContainingText('tr', 'Найти')).last();
      await browser.actions().doubleClick(searchItems).perform();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Дочерние меню')).last().click();
      await browser.sleep(2000);
      // add Order in Search
      console.log('поиск заказа');
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('input[name="menuname"]')).sendKeys('Заказ');
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="menutype"] .k-select')).click();
      await browser.sleep(200);
      await element(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'Пункт')).click();
      await browser.sleep(2000);
      await element(by.css('input[name="href"]')).sendKeys("#/order_table");
      await browser.sleep(200);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      // add Order punkt in Search
      console.log('пункт заказа у поиска');
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('input[name="menuname"]')).sendKeys('Пункт заказа');
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="menutype"] .k-select')).click();
      await browser.sleep(200);
      await element(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'Пункт')).click();
      await browser.sleep(2000);
      await element(by.css('input[name="href"]')).sendKeys("#/order_punkt");
      await browser.sleep(200);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      // add Spare in Search
      console.log('поиск запчасти');
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('input[name="menuname"]')).sendKeys('Запчасть');
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="menutype"] .k-select')).click();
      await browser.sleep(200);
      await element.all(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'Пункт')).last().click();
      await browser.sleep(2000);
      await element(by.css('input[name="href"]')).sendKeys("#/spare");
      await browser.sleep(200);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      /// close Search
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      //add dashboards
      console.log('дашборды');
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('input[name="menuname"]')).last().sendKeys('Отчеты');
      await browser.sleep(2000);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="menutype"] .k-select')).click();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'Группа')).last().click();
      await browser.sleep(2000);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      const dashboardItems = await element(by.cssContainingText('tr', 'Отчеты'));
      await browser.actions().doubleClick(dashboardItems).perform();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Дочерние меню')).last().click();
      await browser.sleep(2000);
      // add Manager dashboard in Dashboards
      console.log('дашборд менеджера');
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('input[name="menuname"]')).sendKeys('Дашборд менеджера');
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="menutype"] .k-select')).click();
      await browser.sleep(200);
      await element(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'Пункт')).click();
      await browser.sleep(2000);
      await element(by.css('input[name="href"]')).sendKeys("#/dashboard/test_dashboard");
      await browser.sleep(200);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      // add Необработанные заказы in Dashboards
      console.log('Необработанные заказы in Dashboards');
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('input[name="menuname"]')).sendKeys('Необработанные заказы');
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="sortorder"] .k-select .k-i-arrow-n')).click();
      await browser.sleep(200);
      await element(by.css('td[data-container-for="menutype"] .k-select')).click();
      await browser.sleep(200);
      await element(by.cssContainingText('.k-animation-container .k-list-scroller ul li', 'Пункт')).click();
      await browser.sleep(2000);
      await element(by.css('input[name="href"]')).sendKeys("#/unserved_orders");
      await browser.sleep(200);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);

      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
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
});

