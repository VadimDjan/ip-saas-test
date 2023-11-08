describe('Регистрация пространства', function () {
  const $h = protractor.helpers;
  const EC = protractor.ExpectedConditions;
  const path = protractor.libs.path;
  
  const { errorCatcher } = $h.common;
  const { defaultWaitTimeout } = $h.wait;
    
  function skip() {
    return !protractor.totalStatus.ok;
  }
  
  it('open link', async done => {
    console.log('Авторизация в системе');
    await errorCatcher(async () => {
      await browser.get('http://localhost:8081/#/login'); // https://service-manager.online/app/#/entitytype
      await browser.sleep(2000);
      const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
      if (loginHeader) {
        await element(by.name('user')).clear().sendKeys('tech@ideaplatform.ru');
        await browser.sleep(200);
        await element(by.name('password')).sendKeys('Qwerty123!');
        await browser.sleep(200);
        await element(by.css('.login__fieldset button')).click();
        // await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
        await browser.sleep(2000);
      }
      // await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());
  
    /////////////////////////////////////////////////////////////// создание таблицы Пункт Заказа

    it('add new row', async done => {
      await errorCatcher(async () => {
        await browser.get('http://localhost:8081/#/entitytype/'); // https://service-manager.online/app/
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Таблица'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.css('.list-wrapper .idea-grid .k-header .idea-button-add-row-modal')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.modal-content .form-header__title', 'Таблица'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.css('.displayname__name')).sendKeys('Пункт заказа');
        // await element(by.css('.modal-content .glyphicon-ok')).click();
        await browser.sleep(200);
        await element(by.css('div[data-field-name="tablename"] input')).sendKeys('order_punkt');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        await element(by.css('button[data-button-detail="entitytype"]')).click();
        await browser.sleep(2000);
        // активируем таблицу
        await element(by.css('div[data-field-name="isactive"] .checkboxfield__checkbox')).click();
        await element(by.css('button[data-button-name="UPDATE"]')).click();
        await browser.sleep(2000);
  
        // переключаемся на вкладку Настройки отображения
        await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
        await browser.sleep(3000);
        await element(by.cssContainingText('.accordion-panel', 'Настройки отображения')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'Настройки отображения'))), defaultWaitTimeout);
        await browser.sleep(200);
        // open form designer
        const detailRow = await element(by.cssContainingText('tr', 'Пункт заказа - Одна запись'));
        await browser.actions().doubleClick(detailRow).perform();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Настройки отображения'))), defaultWaitTimeout);
        await browser.sleep(200);
        await element(by.css('div[data-field-name="label_base"] .glyphicon-pencil')).click();
        await browser.sleep(2000);

        // switch to tab with form designer
        const tabs = await browser.getAllWindowHandles();
        await browser.switchTo().window(tabs[1]);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-designer__editor-title', 'Конструктор форм'))), defaultWaitTimeout);
        // await browser.sleep(2000);

        // Drag&Drop settings
        const sidebar = await element.all(by.css('.form-designer__sidebar-group'));
        const form = await element.all(by.css('.react-grid-layout')).first();
        const dnd = require('html-dnd').code;

        // Поле Заказ
        // пишем название в заголовке
        const order = await element.all(by.css('.form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, order, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(200);
        await element(by.css('.displayname__name_active')).sendKeys('Заказ');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('order_link');
        await browser.sleep(200);
        // выбор Формат поля
        await element(by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')).click();
        await browser.sleep(2000);
        await element(by.css('.rw-popup-container .rw-input-reset')).sendKeys('Заказ (order_table)');
        await browser.sleep(4000);
        await element(by.cssContainingText('.rw-popup-transition ul li', 'Заказ (order_table)')).click();
        await browser.sleep(2000);
        // check isRequired
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(200);
        // close modal
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(200);
        
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);
  
        // Поле Запчасть
        // пишем название в заголовке
        const spare = await element.all(by.css('.form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, spare, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.css('.displayname__name_active')).sendKeys('Запчасть');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('spare_link');
        await browser.sleep(200);
        // выбор Формат поля
        await element(by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')).click();
        await browser.sleep(2000);
        await element(by.css('.rw-popup-container .rw-input-reset')).sendKeys('Запчасть');
        await browser.sleep(4000);
        await element(by.cssContainingText('.rw-popup-transition ul li', 'Запчасть')).click();
        await browser.sleep(2000);
        // check isRequired
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close modal
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);
  
        // Поле Количество 
        // пишем название в заголовке
        await sidebar[1].click();
        await browser.sleep(2000);
        const quantity = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, quantity, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Количество');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('quantity');
        await browser.sleep(200);
        // значение по умлочанию
        await element(by.css('div[data-field-name="defaultvalue"] input')).sendKeys('1');
        await browser.sleep(200);
        // check isRequired
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close modal
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // закрыть секцию бокового меню
        await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);
  
        // Поле стрелочное Цена
        await sidebar[8].click();
        await browser.sleep(2000);
        const price = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, price, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Цена');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('price_order');
        await browser.sleep(200);
        // выбор Формат поля
        await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__remove-btn')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="fieldformatid"] .rw-popup-container .rw-input-reset')).sendKeys('Дробное число (Double) с 2 знаками после запятой');
        await browser.sleep(4000);
        await element(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-transition ul li', 'Дробное число (Double) с 2 знаками после запятой')).click();
        await browser.sleep(2000);
        // определение соединения
        await element(by.css('div[data-field-name="linkdefinition"] input')).sendKeys('spare_link->price');
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close modal
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // закрыть секцию бокового меню
        await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);
  
        // Поле-формула Стоимость
        await sidebar[8].click();
        await browser.sleep(2000);
        const summtest = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);
        await browser.executeScript(dnd, summtest, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Стоимость');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('summtest');
        await browser.sleep(200);
        // выбор Формат поля
        await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__remove-btn')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="fieldformatid"] .rw-popup-container .rw-input-reset')).sendKeys('Дробное число (Double) с 2 знаками после запятой');
        await browser.sleep(4000);
        await element(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-transition ul li', 'Дробное число (Double) с 2 знаками после запятой')).click();
        await browser.sleep(2000);
        // формула для вычисления
        await element(by.css('div[data-field-name="calculationdefinition"] input')).sendKeys('price_order * quantity');
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close modal
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);

        // подвинем на форме поле Заказ
        const orderRow1 = await element(by.css('div[data-field-name="order_link"]'));
        await browser.actions().mouseDown(orderRow1).mouseMove({ x: -600, y: 0 }).mouseUp().perform();
        await browser.sleep(2000);

        // подвинем на форме поле Количество
        const quantityRow = await element(by.css('div[data-field-name="quantity"'));
        await browser.actions().mouseDown(quantityRow).mouseMove({ x: -600, y: 0 }).mouseUp().perform();
        await browser.sleep(2000);

        // подвинем на форме поле Стоимость
        const summRow = await element(by.css('div[data-field-name="summtest"'));
        await browser.actions().mouseDown(summRow).mouseMove({ x: -600, y: 0 }).mouseUp().perform();
        await browser.sleep(2000);

        // save changes
        await element.all(by.cssContainingText('button', 'Сохранить')).last().click();
        await browser.sleep(2000);

        // switch to the 1st tab
        await browser.switchTo().window(tabs[0]);
        await browser.sleep(2000);
  
        await browser.get('http://localhost:8081/#/order_punkt'); // https://service-manager.online/app
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.k-header .table-name', 'Пункт заказа'))), defaultWaitTimeout);
        await browser.sleep();
  
        // формирование вида списка Пункты заказов
        await element(by.css('.view-settings-button')).click();
        await browser.wait(EC.visibilityOf(element(by.css('.k-menu-group'))), defaultWaitTimeout);
        // await browser.sleep(2000);
        await element(by.css('.k-column-menu ul li[data-field-name="order_link"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="spare_link"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="quantity"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="displayname"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="price_order"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="summtest"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="workflowstepid"]')).click();
        await browser.sleep(2000);
        // await element(by.css('.publish-changes-button')).click(); // a[title="Сохранить настройки"]
        await browser.sleep(2000);
        // await browser.refresh();
        // await browser.sleep(2000);
  
        // добавление записей в справочник Пункты заказов
        await element(by.cssContainingText('a', 'Добавить')).click(); // Добавить запись
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Пункт заказа'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.css('.displayname__name')).sendKeys('Пункт заказа');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="order_link"]')).click();
        await browser.sleep(2000);
        await element.all(by.css('div[data-field-name="order_link"] .rw-popup ul li')).first().click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="spare_link"]')).click();
        await browser.sleep(2000);
        await element.all(by.css('div[data-field-name="spare_link"] .rw-popup ul li')).first().click();
        await browser.sleep(2000);
        await element(by.css('button[data-button-detail="order_punkt"]')).click();
        await browser.sleep(2000);
        await element(by.css('.modal-content .details__close-btn')).click();
        await browser.sleep(1500);

        // сделать поле Заказ у Пункта заказов только для чтения
        await browser.get('http://localhost:8081/#/entitytype'); // https://service-manager.online/app
        await browser.sleep(2000);
        // листаем список,чтоб добраться до таблицы
        await element.all(by.css('.k-pager-numbers li')).last().click();
        await browser.sleep(2000);
        const row3 = await element(by.cssContainingText('tr', 'Пункт заказа'));
        await browser.actions().doubleClick(row3).perform();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Таблица'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // set readOnly for Пункт заказа
        await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
        // await browser.wait(EC.presenceOf(element(by.cssContainingText('.accordion-panel', 'Поля'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel', 'Поля')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'Поля'))), defaultWaitTimeout);
        await browser.sleep(200);
        await element.all(by.css('th[title="Название"]')).last().click();
        await browser.sleep(2000);
        const orderRow = await element.all(by.cssContainingText('tr td', 'Заказ')).last();
        await browser.actions().doubleClick(orderRow).perform();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(200);
        await element.all(by.css('div[data-field-name="isreadonly"] .checkboxfield__checkbox')).last().click();
        await browser.sleep(200);
        await element.all(by.css('button[title=" Сохранить"]')).last().click();
        await browser.sleep(2000);
  
        // настройка заполнения поля Заказ из пунктов заказа
        await browser.get('http://localhost:8081/#/entityfieldmapping'); // https://service-manager.online/app
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Меппинг полей'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.css('.idea-button-add-row-modal')).click();
        await browser.wait(EC.presenceOf(element(by.css('div[data-field-name="mappingcalculation"]'))), defaultWaitTimeout);
        await browser.sleep(1000);

        await element(by.css('div[data-field-name="sourceentitytypeid"]')).click();
        await browser.sleep(2000);
        await element(by.css('.rw-popup input')).sendKeys('order_table');
        await browser.sleep(1000);
        await element(by.cssContainingText('.rw-popup ul li span', 'order_table')).click();
        await browser.sleep(1000);

        await element(by.css('div[data-field-name="destinationentitytypeid"]')).click();
        await browser.sleep(1000);
        await element.all(by.css('.rw-popup input')).last().sendKeys('order_punkt');
        await browser.sleep(1000);
        await element.all(by.cssContainingText('.rw-popup ul li span', 'order_punkt')).last().click();
        await browser.sleep(1000);

        await element(by.css('div[data-field-name="sourcefieldname"]')).click();
        await browser.sleep(1000);
        await element.all(by.css('.rw-popup input')).last().sendKeys('order_tableid');
        await browser.sleep(1000);
        await element.all(by.cssContainingText('.rw-popup ul li span', 'order_tableid')).last().click();
        await browser.sleep(1000);

        await element(by.css('div[data-field-name="destinationfieldname"]')).click();
        await browser.sleep(1000);
        await element.all(by.css('.rw-popup input')).last().sendKeys('order_link');
        await browser.sleep(1000);
        await element.all(by.cssContainingText('.rw-popup ul li span', 'order_link')).last().click();
        await browser.sleep(1000);
        
        await element(by.css('button[data-button-detail="entityfieldmapping"]')).click();
        await browser.sleep(2000);
      }, done);
    }, skip());

    it('8. Logout', async done => {
      console.log('Выход из ИС');
      await errorCatcher(async () => {
        await browser.actions().mouseMove(element(by.className('username'))).perform();
        await browser.sleep(2000);
        const logoutBtn = await element(by.css('.button-log-out'));
        const hasLogoutBtn = await logoutBtn.isPresent();
        if (hasLogoutBtn) await logoutBtn.click();
        await browser.wait(EC.stalenessOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
        await expect(element(by.css('.login_service-manager')));
        await browser.sleep(2000);
      }, done);
    }, skip());
  });
  