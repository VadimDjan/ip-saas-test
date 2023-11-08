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
      await browser.get('http://51.250.15.24:8080/#/entitytype');
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

  it('Создание отчёта Необработанные заказы', async done => {
    console.log('Создание отчёта Необработанные заказы');
    await errorCatcher(async () => {
      await browser.get('http://51.250.15.24:8080/#/display/');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Необработанные заказы');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="displaytype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="displaytype"] .rw-popup-container ul li', 'SIMPLE_LIST')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('Заказ');
      await browser.sleep(1500);
      await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'Заказ')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="viewname"] input')).sendKeys('unserved_orders');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="filterquery"] input')).sendKeys("workflowstepname = 'new'");
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);
    }, done);
  }, skip());

  it('Создание отчёта Мои заказы', async done => {
    console.log('Создание отчёта Мои заказы');
    await errorCatcher(async () => {
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Мои заказы');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="displaytype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="displaytype"] .rw-popup-container ul li', 'SIMPLE_LIST')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('Заказ');
      await browser.sleep(1500);
      await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'Заказ')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="viewname"] input')).sendKeys('my_orders');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="filterquery"] input')).sendKeys("manager = @currentUserid and workflowstepname != 'done'");
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);
    }, done);
  }, skip());

  it('Создание отчёта Статистика по заказам', async done => {
    console.log('Создание отчёта Статистика по заказам');
    await errorCatcher(async () => {
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Статистика по заказам');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="displaytype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="displaytype"] .rw-popup-container ul li', 'PIE_CHART')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('Заказ');
      await browser.sleep(1500);
      await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'Заказ')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="viewname"] input')).sendKeys('order_stat');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="groupbyfield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="groupbyfield"] .rw-popup-container input')).sendKeys('workflowstepid');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="groupbyfield"] .rw-popup-container ul li', 'workflowstepid')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="aggregatefunction"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="aggregatefunction"] .rw-popup-container ul li', 'COUNT')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="aggregatefunctionargumentfield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="aggregatefunctionargumentfield"] .rw-popup-container ul li', 'order_tableid')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);
    }, done);
  }, skip());

  it('Создание дочернего отчёта у Статистики по заказам', async done => {
    console.log('Создание дочернего отчёта у Статистики по заказам');
    await errorCatcher(async () => {
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Заказы определенного статуса');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="displaytype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      const allElements = element.all(by.cssContainingText('div[data-field-name="displaytype"] .rw-popup-container ul li', 'LIST'));
      await allElements.get(1).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('Заказ');
      await browser.sleep(1500);
      await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'Заказ')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="viewname"] input')).sendKeys('order_item');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="filterquery"] input')).sendKeys("workflowstepid = @order_item_status");
      await browser.sleep(200);
      await element(by.css('div[data-field-name="displaynametemplate"] input')).sendKeys('Заказы в статусе [[order_item_status]]');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="detailsdisplayid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="detailsdisplayid"] .rw-popup-container input')).sendKeys('Заказ -');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="detailsdisplayid"] .rw-popup-container ul li', 'Заказ - Одна запись')).click();
      await browser.sleep(1500);
      await element(by.css('div[data-field-name="keyfield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="keyfield"] .rw-popup-container ul li', 'order_tableid')).click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      
      await element(by.cssContainingText('.accordion-panel', 'Поля поиска')).click();
      await browser.sleep(2000);
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('Статус');
      await browser.sleep(200);
      await element.all(by.css('div[data-field-name="fieldname"] input')).last().sendKeys('order_item_status');
      await browser.sleep(200);
      await element.all(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="fieldformatid"] .rw-popup-container input')).last().sendKeys('Шаг WorkFlow (WorkFlowStep)');
      await browser.sleep(2000);
      await element.all(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'Шаг WorkFlow (WorkFlowStep)')).first().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);

      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
    }, done);
  }, skip());

  it('Связь дочернего отчёта и Статистики по заказам', async done => {
    console.log('Связь дочернего отчёта и Статистики по заказам');
    await errorCatcher(async () => {
      await browser.get('http://51.250.15.24:8080/#/display/');
      await browser.sleep(2000);

      await browser.sleep(2000);
      const orderStat = await element(by.cssContainingText('tr', 'Статистика по заказам'));
      await browser.actions().doubleClick(orderStat).perform();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Связи с другими отображениями')).click();
      await browser.sleep(2000);
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('У статистики');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="dependdisplaysettingsid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="dependdisplaysettingsid"] .rw-popup-container input')).sendKeys('Заказы определенного статуса');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="dependdisplaysettingsid"] .rw-popup-container ul li', 'Заказы определенного статуса')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      // меппинг полей
      await element(by.cssContainingText('.accordion-panel', 'Меппинг полей')).click();
      await browser.sleep(2000);
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="dependfield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="dependfield"] .rw-popup-container ul li', 'order_item_status')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="dependfieldcalculationtype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="dependfieldcalculationtype"] .rw-popup-container ul li', 'PARENT_FIELD')).click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="parentfield"] .comboboxfield__container')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="parentfield"] .rw-popup-container input')).last().sendKeys('Статус');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="parentfield"] .rw-popup-container ul li', 'Статус')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);
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

