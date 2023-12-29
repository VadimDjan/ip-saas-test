describe('Создание и настройка отчёта по менеджерам и дашборда менеджера', function() {
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
        await browser.sleep(2500);
        await element(by.name('password')).sendKeys('Qwerty123!');
        await browser.sleep(2500);
        await element(by.css('.login__fieldset button')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
      }
      await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());

  it('Создание таблицы для отчёта Анализ работы менеджеров', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/entitytype');
      await browser.sleep(2000);

      // добавим таблицу для создания отчёта stacked_bar_chart
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Анализ работы менеджеров');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="dstype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="dstype"] .rw-popup-container ul li', 'Запрос')).click();
      await browser.sleep(2000);
      // старый запрос, выходит баг
      // await element(by.css('div[data-field-name="sqlquery"] .ace_editor textarea')).sendKeys("with order_count AS (select manager, workflowstepname, coalesce(count(order_tableid), 0) yvalue from v_order_table group by manager, workflowstepname) select u.fullname as xvalue, yvalue, manager as group_number, case workflowstepname when 'new' then 'green' when 'preparation' then 'orange' when 'delivery' then 'pink' else 'yellow' end color_field, workflowstepname as series from order_count o inner join system.v_user u on u.userid = o.manager");
      // новый запрос
      await element(by.css('div[data-field-name="sqlquery"] .ace_editor textarea')).sendKeys("with order_count AS (select manager, workflowstepname, coalesce(count(order_tableid), 0) yvalue from v_order_table group by manager, workflowstepname) select u.fullname as xvalue, yvalue, manager as group_number, manager, case workflowstepname when 'new' then 'green' when 'preparation' then 'orange' when 'delivery' then 'pink' else 'yellow' end color_field, workflowstepname as series from order_count o inner join system.v_user u on u.userid = o.manager");
      await browser.sleep(100);
      await element(by.css('div[data-field-name="tablename"] input')).sendKeys('stacked_manager_analize');
      await browser.sleep(200);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      // добавление полей
      await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Поля')).click();
      await browser.sleep(2000);
      // добавим поле Цвет
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('Цвет');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('color_field');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'Строка (String)')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.modal-content .details__close-btn')).last().click();
      await browser.sleep(2000);
      // добавим поле Серий
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('Серии');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('series');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="fieldformatid"] .rw-popup-container input')).sendKeys('Шаг WorkFlow - Статусы (WorkFlowStep)');
      await browser.sleep(2000);
      await element.all(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'Шаг WorkFlow - Статусы (WorkFlowStep)')).first().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.modal-content .details__close-btn')).last().click();
      await browser.sleep(2000);
      // добавим поле Кол-во заказов
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('Кол-во заказов');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('yvalue');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'Целое число (Integer)')).first().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.modal-content .details__close-btn')).last().click();
      await browser.sleep(2000);
      // добавим поле МенеджерГр
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('МенеджерГр');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('group_number');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'Пользователь (User)')).first().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.modal-content .details__close-btn')).last().click();
      await browser.sleep(2000);
      // добавим ещё поле МенеджерОС
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('МенеджерОС');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('xvalue');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element.all(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'Строка (String)')).first().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.modal-content .details__close-btn')).last().click();
      await browser.sleep(2000);

      await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="isactive"] .checkboxfield__checkbox')).click();
      await browser.sleep(200);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(5000);
    }, done);
  }, skip());

  it('Создание отчёта Анализ работы менеджеров', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/display/');
      await browser.sleep(3000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Анализ работы менеджеров');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="displaytype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="displaytype"] .rw-popup-container ul li', 'STACKED_BAR_CHART')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="entitytypeid"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'Анализ работы менеджеров')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="viewname"] input')).sendKeys('managers_analize');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="seriesfield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="seriesfield"] .rw-popup-container ul li', 'series')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="groupnumberfield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="groupnumberfield"] .rw-popup-container ul li', 'group_number')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="xvaluefield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="xvaluefield"] .rw-popup-container ul li', 'xvalue')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="yvaluefield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="yvaluefield"] .rw-popup-container ul li', 'yvalue')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="seriescolorfield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="seriescolorfield"] .rw-popup-container ul li', 'color_field')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);
    }, done);
  }, skip());

  it('Создание дочернего отчёта у Анализа по менеджерам', async done => {
    await errorCatcher(async () => {
      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Заказы определённого менеджера');
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
      await element(by.css('div[data-field-name="viewname"] input')).sendKeys('manager_item');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="filterquery"] input')).sendKeys("manager = (select userid from system.v_user where lower(fullname) = lower('@p_manager_str') limit 1)");
      await browser.sleep(200);
      await element(by.css('div[data-field-name="displaynametemplate"] input')).sendKeys('Заказы менеджера [[p_manager_str]]');
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
      
      // добавим поля поиска
      await element(by.cssContainingText('.accordion-panel', 'Поля поиска')).click();
      await browser.sleep(2000);
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('Менеджер');
      await browser.sleep(200);
      await element.all(by.css('div[data-field-name="fieldname"] input')).last().sendKeys('p_manager_str');
      await browser.sleep(200);
      await element.all(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).last().click();
      await browser.sleep(2000);
      // await element.all(by.css('div[data-field-name="fieldformatid"] .rw-popup-container input')).last().sendKeys('Целое число (Integer)');
      // await browser.sleep(2000);
      await element.all(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'Строка (String)')).first().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);

      await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
      await browser.sleep(2000);

      // привяжем дочерний отчёт
      await browser.get('https://service-manager.online/app/#/display');
      await browser.sleep(2000);
      const tableRow = await element(by.cssContainingText('tr', 'Анализ работы менеджеров'));
      await browser.actions().doubleClick(tableRow).perform();
      await browser.sleep(2000);

      await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Связи с другими отображениями')).click();
      await browser.sleep(2000);
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('.form-header__title .displayname__name')).last().sendKeys('По менеджеру');
      await browser.sleep(200);
      await element(by.css('div[data-field-name="dependdisplaysettingsid"]')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="dependdisplaysettingsid"] .rw-popup-container input')).sendKeys('Заказы определённого менеджера');
      await browser.sleep(1500);
      await element(by.cssContainingText('div[data-field-name="dependdisplaysettingsid"] .rw-popup-container ul li', 'Заказы определённого менеджера')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Меппинг полей')).click();
      await browser.sleep(2000);

      // настроим меппинг полей с дочерним отчётом
      await element.all(by.css('.idea-button-add-row-modal')).last().click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="dependfield"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="dependfield"] .rw-popup-container ul li', 'p_manager_str')).click();
      await browser.sleep(2000);
      await element(by.css('div[data-field-name="dependfieldcalculationtype"] .comboboxfield__container')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="dependfieldcalculationtype"] .rw-popup-container ul li', 'PARENT_FIELD')).click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="parentfield"] .comboboxfield__container')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('div[data-field-name="parentfield"] .rw-popup-container input')).last().sendKeys('МенеджерОС');
      await browser.sleep(2000);
      await element(by.cssContainingText('div[data-field-name="parentfield"] .rw-popup-container ul li', 'МенеджерОС')).click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
      await browser.sleep(2000);
      await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
      await browser.sleep(2000);
      await element(by.css('.alerts__container .alert-count')).click();
      await browser.sleep(200);
    }, done);
  }, skip());

  it('Дашборд менеджера', async done => {
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/dashboardtype/');
      await browser.sleep(2000);

      await element(by.css('.idea-button-add-row-modal')).click();
      await browser.sleep(2000);
      await element(by.css('.form-header__title .displayname__name')).sendKeys('Дашборд менеджера');
      await browser.sleep(100);
      await element(by.css('div[data-field-name="dashboardname"] input')).sendKeys('test_dashboard');
      await browser.sleep(100);
      // await element(by.css('div[data-field-name="displayname"] input')).sendKeys('Дашборд менеджера');
      // await browser.sleep(100);
      await element(by.css('button[data-button-name="CREATE"]')).click();
      await browser.sleep(2000);
      await element(by.cssContainingText('.accordion-panel', 'Отчеты')).click();
      await browser.sleep(2000);
      // добавим отчёты в дашборд
      // отчёт Мои заказы
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('tr[data-role="editable"] td .k-input')).sendKeys('Мои заказы');
      await browser.sleep(2000);
      await element(by.cssContainingText('.k-animation-container ul li', 'Мои заказы')).click();
      await browser.sleep(2000);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      // отчёт Статистика по заказам
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('tr[data-role="editable"] td .k-input')).sendKeys('Статистика по заказам');
      await browser.sleep(2000);
      await element(by.cssContainingText('.k-animation-container ul li', 'Статистика по заказам')).click();
      await browser.sleep(2000);
      await element(by.css('.k-grid-update')).click();
      await browser.sleep(2000);
      // отчёт Анализ работы менеджеров
      await element.all(by.css('.idea-button-add-row')).last().click();
      await browser.sleep(2000);
      await element(by.css('tr[data-role="editable"] td .k-input')).sendKeys('Анализ работы менеджеров');
      await browser.sleep(2000);
      await element(by.cssContainingText('.k-animation-container ul li', 'Анализ работы менеджеров')).click();
      await browser.sleep(2000);
      await element(by.css('.k-grid-update')).click();
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
});

