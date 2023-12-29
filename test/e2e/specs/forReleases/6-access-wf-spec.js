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
      await browser.get('http://localhost:8081/#/entitytype');
      await browser.sleep(2000);
      const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
      if (loginHeader) {
        await element(by.name('user')).clear().sendKeys('demo'); // alisa
        await browser.sleep(500);
        await element(by.name('password')).clear().sendKeys('Qwerty123!'); // Ktnj_pf_jryjv1
        await browser.sleep(500);
        await element(by.css('.login__fieldset button')).click();
        // await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
        await browser.sleep(2000);
      }
    //   await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());

  it('Настройка прав перехода у ЖЦ В доставку', async done => {
    console.log('Настройка прав перехода у ЖЦ test-wf');
    await errorCatcher(async () => {
      await browser.get('http://localhost:8081/#/workflow');
      await browser.sleep(2000);
      // await element(by.css('th[data-title="ID"]')).click();
      // await browser.sleep(2000);
      // await element(by.css('th[data-title="ID"]')).click();
      // await browser.sleep(2000);
      const testWfRow = await element(by.cssContainingText('tr', 'test-wf'));
      await browser.actions().doubleClick(testWfRow).perform();
      await browser.sleep(2000);

      // в подготовку
      const prepRow3 = await element(by.cssContainingText('div[data-field-name="transitionlist"] tr', 'Создать заказ'));
      await browser.actions().doubleClick(prepRow3).perform();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="transitiontype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="transitiontype"] .rw-popup-container ul li', 'MANUAL')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Права доступа')).click();
      await browser.sleep(2000);
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      // const groupRow3 = await element(by.cssContainingText('div[data-field-name="transitionaccesslist"] tr', 'Группа доступа'));
      // await browser.actions().doubleClick(groupRow3).perform();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="accessobject"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="accessobject"] .rw-popup-container ul li', 'Группа доступа')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="accessobjectsn"] .comboboxfield__container')).click();
      // await element(by.css('div[data-field-name="calculationtype"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="accessobjectsn"] .rw-popup-container ul li', 'ТестМенеджеры')).click();
      // await element(by.cssContainingText('div[data-field-name="calculationtype"] .rw-popup-container ul li', 'Код')).click();
      await browser.sleep(2000);
      // await element(by.css('div[data-field-name="accesscalculation"] .ace_editor textarea')).sendKeys('Integer accessObjectId  = record.getAsInteger("manager");');
      // await browser.sleep(200);
      // await element.all(by.cssContainingText('.accordion-panel', 'Общая информация')).last().click();
      // await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);

      // в доставку
      const prepRow = await element(by.cssContainingText('div[data-field-name="transitionlist"] tr', 'Отправить заказ'));
      await browser.actions().doubleClick(prepRow).perform();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Права доступа')).click();
      await browser.sleep(2000);
      const groupRow = await element(by.cssContainingText('div[data-field-name="transitionaccesslist"] tr', 'Группа доступа'));
      await browser.actions().doubleClick(groupRow).perform();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="accessobject"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="accessobject"] .rw-popup-container ul li', 'Вычисляемый пользователь')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="calculationtype"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="calculationtype"] .rw-popup-container ul li', 'Код')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="accesscalculation"] .ace_editor textarea')).sendKeys('Integer accessObjectId  = record.getAsInteger("test_manager");');
      await browser.sleep(200);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);

      // завершение
      const prepRow2 = await element(by.cssContainingText('div[data-field-name="transitionlist"] tr', 'Завершить'));
      await browser.actions().doubleClick(prepRow2).perform();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="transitiontype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="transitiontype"] .rw-popup-container ul li', 'MANUAL')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Права доступа')).click();
      await browser.sleep(2000);
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      // const groupRow2 = await element(by.cssContainingText('div[data-field-name="transitionaccesslist"] tr', 'Группа доступа'));
      // await browser.actions().doubleClick(groupRow2).perform();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="accessobject"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="accessobject"] .rw-popup-container ul li', 'Вычисляемый пользователь')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="calculationtype"] .rw-widget-picker')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="calculationtype"] .rw-popup-container ul li', 'Код')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="accesscalculation"] .ace_editor textarea')).sendKeys('Integer accessObjectId  = record.getAsInteger("test_manager");');
      await browser.sleep(200);
      await element.all(by.cssContainingText('.accordion-panel', 'Общая информация')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(3000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);

      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('Добавление клиентского правила по комментарию', async done => {
    await errorCatcher(async () => {
      console.log('Добавление клиентского правила по комментарию');
      await browser.get('http://localhost:8081/#/rule/');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('add comment to order');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="script"] .ace_editor textarea')).sendKeys(
        'let fields = new Array(); if(!record.get("comment")) { fields.push("comment"); } if (context.button.buttonName == "Завершить" && !record.get("comment")) { alerts.getFields("Напишите комментарий", fields); }'
      );
      await browser.sleep(200);
      await element(by.css('div[data-field-name="ifcondition"] input')).clear();
      await browser.sleep(100);
      await element(by.css('div[data-field-name="ifcondition"] input')).sendKeys('context.button != null');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="isui"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
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
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="eventid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="eventid"] .rw-popup-container ul li', '11-Изменение данных на клиенте')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);

      //////////////////////// добавим настройку в entitytype для деактивации заказа
      await browser.get('http://localhost:8081/#/entitytype/');
      await browser.sleep(2000);
      // // листаем список,чтоб добраться до таблицы
      // await element(by.css('th[data-title="ID"]')).click();
      // await browser.sleep(2000);
      // await element(by.css('th[data-title="ID"]')).click();
      // await browser.sleep(2000);

      const row = await element(by.cssContainingText('tr', 'Заказ'));
      await browser.actions().doubleClick(row).perform();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="activecondition"] .textfield__input')).clear();
      await browser.sleep(200);
      await element(by.css('div[data-field-name="activecondition"] .textfield__input')).sendKeys('!CommonUtils.isSame(record.getAsString("workflowstepname"),"done")');
      await browser.sleep(200);
      await element(by.css('button[data-button-name="UPDATE"]')).click();
      await browser.sleep(4000);

      // правило по деактивации формы в статусе Завершено
      await browser.get('http://localhost:8081/#/rule/');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('set readOnly to form with done status');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="script"] .ace_editor textarea')).sendKeys('if (record.get("workflowstepname") == "done") { record.setFormEditable(false); }');
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
      await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('4');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="eventid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="eventid"] .rw-popup-container ul li', '10-Открытие формы на клиенте')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
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

