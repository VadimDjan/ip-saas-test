describe('Настройка доступа полей Заказчик и Адрес доставки', function() {
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

  // it('Деактивировать гр.доступа Для всех пользователей у таблицы заказ', async done => {
  //   await errorCatcher(async () => {
  //     await browser.get('https://service-manager.online/app/#/entitytype/');
  //     await browser.sleep(2000);

  //     // листаем список,чтоб добраться до таблицы
  //     await element.all(by.css('.k-pager-numbers li')).last().click();
  //     await browser.sleep(2000);
  //     const row3 = await element(by.cssContainingText('tr', 'Заказ'));
  //     await browser.actions().doubleClick(row3).perform();
  //     await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Таблица'))), defaultWaitTimeout);
  //     await browser.sleep(1000);

  //     await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
  //     await browser.sleep(2000);
  //     await element(by.cssContainingText('.accordion-panel', 'Карты доступа')).click();
  //     await browser.sleep(2000);
  //     const allUsersRow = await element(by.cssContainingText('tr', 'Все пользователи'));
  //     await browser.actions().doubleClick(allUsersRow).perform();
  //     await browser.sleep(2000);
  //     await element.all(by.css('div[data-field-name="isactive"] .checkboxfield__checkbox')).last().click();
  //     await browser.sleep(200);
  //     await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
  //     await browser.sleep(2000);
  //   }, done);
  // }, skip());

  it('Настройка доступа полей у Заказа', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/entitytype');
      await browser.sleep(2000);

      // листаем список,чтоб добраться до таблицы Заказ
      await element.all(by.css('.k-pager-numbers li')).last().click();
      await browser.sleep(2000);
      const row = await element(by.cssContainingText('tr', 'Заказ'));
      await browser.actions().doubleClick(row).perform();
      await browser.sleep(2000);

      // открываем поля для настройки прав доступа
      await element.all(by.cssContainingText('.accordion-panel', 'Общая информация')).last().click();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Поля')).last().click();
      await browser.sleep(2000);
      await element(by.css('.subgrid__wrapper th[data-field="displayname"]')).click();
      await browser.sleep(1000);

      // поле Заказчик
      const customerRow = await element(by.cssContainingText('tr', 'customer'));
      await browser.actions().doubleClick(customerRow).perform();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Общая информация')).last().click();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Доступ')).last().click();
      await browser.sleep(2000);
      // для статуса Новый
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'Новый заказ')).click();
      await browser.sleep(1500);
      await element.all(by.css('div[data-field-name="isrequired"] .checkboxfield__checkbox')).last().click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      // для статуса Подготовка
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'На сборке')).click();
      await browser.sleep(1500);
      await element.all(by.css('div[data-field-name="isrequired"] .checkboxfield__checkbox')).last().click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      // для статуса Delivery
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'В доставке')).click();
      await browser.sleep(1500);
      await element.all(by.css('div[data-field-name="isreadonly"] .checkboxfield__checkbox')).last().click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      // для статуса Done
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'Выполнен')).click();
      await browser.sleep(1500);
      await element.all(by.css('div[data-field-name="isreadonly"] .checkboxfield__checkbox')).last().click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.details__close-btn')).last().click();
      await browser.sleep(2000);

      // поле Адрес доставки
      const deliveryArrdRow = await element(by.cssContainingText('tr', 'address'));
      await browser.actions().doubleClick(deliveryArrdRow).perform();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Общая информация')).last().click();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Доступ')).last().click();
      await browser.sleep(2000);
      // для статуса Новый
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'Новый заказ')).click();
      await browser.sleep(1500);
      await element.all(by.css('div[data-field-name="isrequired"] .checkboxfield__checkbox')).last().click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      // для статуса Подготовка
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'На сборке')).click();
      await browser.sleep(1500);
      await element.all(by.css('div[data-field-name="isrequired"] .checkboxfield__checkbox')).last().click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      // для статуса Delivery
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'В доставке')).click();
      await browser.sleep(1500);
      await element.all(by.css('div[data-field-name="isrequired"] .checkboxfield__checkbox')).last().click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      // для статуса Done
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'Выполнен')).click();
      await browser.sleep(1500);
      await element.all(by.css('div[data-field-name="isreadonly"] .checkboxfield__checkbox')).last().click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.details__close-btn')).last().click();
      await browser.sleep(2000);

      // поменяем сортировку для видимости полей Комментарий и Менеджер
      await element(by.css('.subgrid__wrapper th[data-field="displayname"]')).click();
      await browser.sleep(1000);

      // // поле Менеджер
      // const managerRow = await element(by.cssContainingText('tr', 'manager'));
      // await browser.actions().doubleClick(managerRow).perform();
      // await browser.sleep(2000);
      // await element.all(by.cssContainingText('.accordion-panel', 'Общая информация')).last().click();
      // await browser.sleep(2000);
      // await element.all(by.cssContainingText('.accordion-panel', 'Доступ')).last().click();
      // await browser.sleep(2000);
      // // для статуса Новый
      // await element.all(by.css('.idea-button-add-row')).last().click();
      // await browser.sleep(2000);
      // await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      // await browser.sleep(2000);
      // await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'Новый заказ')).click();
      // await browser.sleep(1500);
      // await element.all(by.css('div[data-field-name="ishidden"] .checkboxfield__checkbox')).last().click();
      // await browser.sleep(200);
      // await element(by.css('button[data-button-name="CREATE"]')).click();
      // await browser.sleep(2000);
      // await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      // await browser.sleep(2000);
      // await element.all(by.css('.details__close-btn')).last().click();
      // await browser.sleep(2000);

      // поле Комментарий
      const commentRow = await element(by.cssContainingText('tr', 'comment'));
      await browser.actions().doubleClick(commentRow).perform();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Общая информация')).last().click();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Доступ')).last().click();
      await browser.sleep(2000);
      // для статуса Новый
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="workflowstepid"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="workflowstepid"] .rw-popup-container ul li', 'Новый заказ')).click();
      await browser.sleep(1500);
      await element.all(by.css('div[data-field-name="ishidden"] .checkboxfield__checkbox')).last().click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('Добавление клиентского правила для поля Дата доставки', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/rule');
      await browser.sleep(2000);
      
      // make a rule
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(1500);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('delivery_date rule');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="script"] .ace_editor textarea')).sendKeys('if (record.get("WORKFLOWSTEPNAME") == "preparation" && record.get("MANAGER") == ContextUtils.getCurrentUser().getFullName()) { record.setVisible("DELIVERY_DATE", true); record.setEditable("DELIVERY_DATE", true); } if (record.get("WORKFLOWSTEPNAME") == "new" || record.get("WORKFLOWSTEPNAME") == null) { record.setVisible("DELIVERY_DATE", false); } if (record.get("WORKFLOWSTEPNAME") == "delivery") { record.setVisible("DELIVERY_DATE", true); record.setEditable("DELIVERY_DATE", true); record.setRequired("DELIVERY_DATE", true); }');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="isui"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      // await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      // await browser.sleep(2000);

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
      await element(by.css('td[data-container-for="ruleid"] .k-input')).sendKeys('delivery_date rule');
      await browser.sleep(1500);
      await element(by.cssContainingText('.k-animation-container ul li', 'delivery_date rule')).click();
      await browser.sleep(2000);
      await element.all(by.css('td[data-container-for="sortorder"] .k-select')).first().click();
      await browser.sleep(200);
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

  it('Настройка прав перехода в ЖЦ и правила проверки обязательности заполнения delivery_date', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/rule');
      await browser.sleep(2000);

      // add new rule
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('rule for to_delivery');
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="ruletype"] .rw-btn-select')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="ruletype"] .rw-popup-container ul li', 'Задать обязательность полей')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="tablename"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="tablename"] .rw-popup-container input')).sendKeys('Заказ');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="tablename"] .rw-popup-container ul li', 'Заказ')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="fieldnames"] .rw-widget-input')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="fieldnames"] .rw-popup-container ul li', 'delivery_date')).click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__wrapper')).last().click();
      await browser.sleep(500);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);

      await browser.get('https://service-manager.online/app/#/workflow');
      await browser.sleep(2000);

      await element(by.cssContainingText('th', 'Имя')).click();
      await browser.sleep(2000);
      const wfRow = await element(by.cssContainingText('tr', 'test-wf'));
      await browser.actions().doubleClick(wfRow).perform();
      await browser.sleep(2000);
      const chainRow = await element(by.cssContainingText('div[data-field-name="transitionlist"] tr', 'Отправить заказ'));
      await browser.actions().doubleClick(chainRow).perform();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Общая информация')).last().click();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('.accordion-panel', 'Правила')).last().click();
      await browser.sleep(2000);
      // добавляем правило переходу
      await element(by.css('.idea-button-add-row')).click();
      await browser.sleep(2000);
      await element(by.css('td[data-container-for="ruleid"] .k-input')).sendKeys('rule for to_delivery');
      await browser.sleep(2000);
      await element(by.cssContainingText('.k-animation-container ul li', 'rule for to_delivery')).click();
      await browser.sleep(2000);
      await element.all(by.css('td[data-container-for="sortorder"] .k-select span')).first().click();
      await browser.sleep(200);
      await element.all(by.css('td[data-container-for="sortorder"] .k-select span')).first().click();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="rules"] td .k-grid-update')).click();
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

