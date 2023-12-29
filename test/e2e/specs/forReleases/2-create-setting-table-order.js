describe('Добавление таблицы Заказ', function () {
    const $h = protractor.helpers;
    const EC = protractor.ExpectedConditions;
  
    const { errorCatcher } = $h.common;
    const { defaultWaitTimeout } = $h.wait;

    let orderTableId;
    
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
              await element(by.name('user')).clear().sendKeys('demo'); // alisa
              await browser.sleep(500);
              await element(by.name('password')).clear().sendKeys('Qwerty123!'); // Ktnj_pf_jryjv1
              await browser.sleep(500);
              await element(by.css('.login__fieldset button')).click();
              // await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
              await browser.sleep(2000);
          }
          // await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
      }, done);
  }, skip());
  
    // /////////////////////////////////////////////////////////////// создание таблицы Заказ

    it('add new row', async done => {
      await errorCatcher(async () => {
        await browser.get('http://localhost:8081/#/entitytype/'); // https://service-manager.online/app/#/entitytype
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Таблица'))), defaultWaitTimeout);
        await browser.sleep(2000);

        await element(by.css('.idea-button-add-row-modal')).click(); // idea-button-add-row-modal
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.modal-content .form-header__title', 'Таблица'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.css('.displayname__name')).sendKeys('Заказ');
        await element(by.css('.modal-content .glyphicon-ok')).click();
        await browser.sleep(200);
        await element(by.css('div[data-field-name="tablename"] input')).sendKeys('order_table');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        await element(by.css('button[data-button-name="CREATE"]')).click();
        await browser.sleep(2000);
        // активируем таблицу
        await element(by.css('div[data-field-name="isactive"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        await element(by.css('button[data-button-name="UPDATE"]')).click();
        await browser.sleep(2000);

        // переключаемся на вкладку Настройки отображения
        await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel', 'Настройки отображения')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'Настройки отображения'))), defaultWaitTimeout);
        await browser.sleep(2000);
        //open form designer
        const detailRow = await element(by.cssContainingText('tr', 'Заказ - Одна запись'));
        await browser.actions().doubleClick(detailRow).perform();
        await browser.sleep(3000);
        await element(by.css('div[data-field-name="label_base"] .glyphicon-pencil')).click();
        await browser.sleep(2000);

        // switch to tab with form designer
        const tabs = await browser.getAllWindowHandles();
        await browser.switchTo().window(tabs[1]);
        await browser.sleep(2000);

        // Drag&Drop settings
        const sidebar = await element.all(by.css('.form-designer__sidebar-group'));
        const form = await element.all(by.css('.react-grid-layout')).first();
        const dnd = require('html-dnd').code;
  
        // Поле дата
        await sidebar[3].click();
        await browser.sleep(2000);
        const deliveryDate = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(2);
        await browser.executeScript(dnd, deliveryDate, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Дата доставки');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('delivery_date');
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        //check Аудит включен
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        // save & close
        await element.all(by.cssContainingText('button', 'Сохранить')).last().click();
        await browser.sleep(2000);
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);

        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);

        // Поле время
        const deliveryTime = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);
        await browser.executeScript(dnd, deliveryTime, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Предпочтительное время');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('delivery_time');
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        //check Аудит включен
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        // save & close
        await element.all(by.cssContainingText('button', 'Сохранить')).last().click();
        await browser.sleep(2000);
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // закрыть секцию бокового меню
        await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);
  
        // Поле Адрес
        await sidebar[2].click();
        await browser.sleep(2000);
        const address = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, address, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Адрес доставки');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('address');
        await browser.sleep(200);
        // check isRequired
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        //check Аудит включен
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        // save & close
        await element.all(by.cssContainingText('button', 'Сохранить')).last().click();
        await browser.sleep(2000);
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // закрыть секцию бокового меню
        await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);

        // Поле Заказчик 
        const customer = await element.all(by.css('.form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, customer, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css('.displayname__name_active')).sendKeys('Заказчик');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('customer');
        await browser.sleep(200);
        // выбор Формат поля
        await element(by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')).click();
        await browser.sleep(2000);
        await element(by.css('.rw-popup-container .rw-input-reset')).sendKeys('Пользователь (User)');
        await browser.sleep(4000);
        await element(by.cssContainingText('.rw-popup-transition ul li', 'Пользователь (User)')).click();
        await browser.sleep(2000);
        // check isRequired
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(5000);

        // Поле Телефон
        await sidebar[2].click();
        await browser.sleep(2000);
        const phone = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(2);
        await browser.executeScript(dnd, phone, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Тлф для связи');
        await browser.sleep(2000);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(2000);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('phone');
        await browser.sleep(1000);
        // set RegExp
        await element(by.css('div[data-field-name="_$_FF/regex"] input')).sendKeys('/\d{11}');
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);

        // закрыть секцию бокового меню
        await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);

        // Поле Выбор иконки/Условия доставки
        await sidebar[6].click();
        await browser.sleep(2000);
        const deliveryCondition = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);
        await browser.executeScript(dnd, deliveryCondition, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Условия транспортировки');
        await browser.sleep(2000);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(2000);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('delivery_condition');
        await browser.sleep(1000);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);

        // Поле Иконка/Особенности
        await sidebar[6].click();
        await browser.sleep(2000);
        const icon = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, icon, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Особенности');
        await browser.sleep(2000);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(2000);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('is_condition');
        await browser.sleep(1000);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // закрыть секцию бокового меню
        await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);

        // Поле Дополнительные опции
        await sidebar[4].click();
        await browser.sleep(2000);
        const multipleList = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).last();
        await browser.executeScript(dnd, multipleList, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Дополнительные опции');
        await browser.sleep(2000);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(2000);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('other_conditions');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="_$_FF/pattern"] input')).sendKeys('1:Документация производителя;2:Указано время доставки;3:Схема проезда;4:Указан тлф для связи;5:Доп.информация на сайте производителя');
        await browser.sleep(200);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // закрыть секцию бокового меню
        await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
        await browser.sleep(100);
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);

        // Поле Сайт производителя
        await sidebar[2].click();
        await browser.sleep(2000);
        const htmlLink = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(4);
        await browser.executeScript(dnd, htmlLink, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Сайт производителя');
        await browser.sleep(2000);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(2000);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('site');
        await browser.sleep(1000);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        // закрыть секцию бокового меню
        await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
        await browser.sleep(100);

        // Поле Схема проезда
        await sidebar[5].click();
        await browser.sleep(2000);
        const schemeRow = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, schemeRow, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Схема проезда');
        await browser.sleep(2000);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(2000);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('scheme');
        await browser.sleep(1000);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);

        // Поле Сопроводительные документы
        const loadFileList = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);
        await browser.executeScript(dnd, loadFileList, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Сопроводительные документы');
        await browser.sleep(2000);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(2000);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('documents');
        await browser.sleep(1000);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // выберем имеющийся формат
        await element(by.css('ul .format-list__item')).click();
        await browser.sleep(200);
        await element(by.cssContainingText('button', 'Использовать существующий формат')).click();
        await browser.sleep(2000);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        // закрыть секцию бокового меню
        await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
        await browser.sleep(100);

        // Поле Комментарий
        await sidebar[7].click();
        await browser.sleep(2000);
        const commentsList = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(3);
        await browser.executeScript(dnd, commentsList, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('Комментарий');
        await browser.sleep(2000);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(2000);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('comment');
        await browser.sleep(1000);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        //check Аудит включен
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
        await browser.sleep(2000);
        //save changes
        await element(by.css('button[data-button-name="UPDATE"')).click();
        await browser.sleep(1500);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);

        // Поле Менеджер
        const manager = await element.all(by.css('.form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, manager, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // пишем название в заголовке
        await element(by.css('.displayname__name_active')).sendKeys('Менеджер');
        await browser.sleep(2000);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(2000);
        // задаем полю системное имя
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('manager');
        await browser.sleep(1000);
        // выбор Формат поля
        await element(by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')).click();
        await browser.sleep(2000);
        await element(by.css('.rw-popup-container .rw-input-reset')).sendKeys('Пользователь (User)');
        await browser.sleep(4000);
        await element(by.cssContainingText('.rw-popup-transition ul li', 'Пользователь (User)')).click();
        await browser.sleep(2000);
        //check Аудит включен
        await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
        await browser.sleep(2000);
        // кн Создать поле
        await element(by.cssContainingText('button', 'Создать поле')).click();
        await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
        await browser.sleep(1000);
        // close
        await element(by.css('.details__close-btn')).click();
        await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
        await browser.sleep(1000);
        
        // Сохранить форму
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);

        // подвинем на форме поле Дата
        const dataRow = await element(by.css('div[data-field-name="delivery_date"]'));
        await browser.actions().mouseDown(dataRow).mouseMove({ x: 180, y: -60 }).mouseUp().perform();
        await browser.sleep(2000);
        // подвинем на форме поле Время
        const timeRow = await element(by.css('div[data-field-name="delivery_time"]'));
        await browser.actions().mouseDown(timeRow).mouseMove({ x: 700, y: -60 }).mouseUp().perform();
        await browser.sleep(2000);
        // подвинем на форме поле Адрес
        const addressRow = await element(by.css('div[data-field-name="address"]'));
        await browser.actions().mouseDown(addressRow).mouseMove({ x: -700, y: 0 }).mouseUp().perform();
        await browser.sleep(2000);
        // подвинем на форме поле Телефон
        const phoneRow = await element(by.css('div[data-field-name="phone"]'));
        await browser.actions().mouseDown(phoneRow).mouseMove({ x: -700, y: 0 }).mouseUp().perform();
        await browser.sleep(2000);
        // подвинем на форме поле Особенности
        const specsRow = await element(by.css('div[data-field-name="is_condition"]'));
        await browser.actions().mouseDown(specsRow).mouseMove({ x: -700, y: 0 }).mouseUp().perform();
        await browser.sleep(2000);
        // подвинем на форме поле Дополнительно
        const othersRow = await element(by.css('div[data-field-name="other_conditions"]'));
        await browser.actions().mouseDown(othersRow).mouseMove({ x: 400, y: 0 }).mouseUp().perform();
        await browser.sleep(2000);
        // подвинем на форме поле Условия транспортировки
        const dcRow = await element(by.css('div[data-field-name="delivery_condition"]'));
        await browser.actions().mouseDown(dcRow).mouseMove({ x: 400, y: -60 }).mouseUp().perform();
        await browser.sleep(2000);
        // подвинем на форме поле Менеджер
        const managerRow = await element(by.css('div[data-field-name="manager"]'));
        await browser.actions().mouseDown(managerRow).mouseMove({ x: -700, y: 0 }).mouseUp().perform();
        await browser.sleep(2000);
        // подвинем на форме поле Сопроводительные документы
        const docsRow = await element(by.css('div[data-field-name="documents"]'));
        await browser.actions().mouseDown(docsRow).mouseMove({ x: -700, y: 0 }).mouseUp().perform();
        await browser.sleep(2000);
        // // подвинем на форме поле Заказчик
        // const customerRow = await element(by.css('div[data-field-name="customer"]'));
        // await browser.actions().mouseDown(customerRow).mouseMove({ x: 400, y: 0 }).mouseUp().perform();
        // await browser.sleep(2000);
        // // подвинем на форме поле Дополнительно
        // const othersRow2 = await element(by.css('div[data-field-name="other_conditions"]'));
        // await browser.actions().mouseDown(othersRow2).mouseMove({ x: 400, y: 0 }).mouseUp().perform();
        // await browser.sleep(2000);

        // save changes
        await element.all(by.cssContainingText('button', 'Сохранить')).last().click();
        await browser.sleep(2000);

        // switch to the 1st tab
        await browser.switchTo().window(tabs[0]);
        await browser.sleep(2000);

        await browser.get('http://localhost:8081/#/order_table'); // https://service-manager.online/app/#/order_table
        await browser.sleep(2000);
  
        // формирование вида списка Заказов
        await element(by.css('.view-settings-button')).click();
        await browser.sleep(2000);
        await element(by.css('.k-column-menu ul li[data-field-name="delivery_date"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="customer"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="address"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="displayname"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="workflowstepname"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="phone"]')).click();
        await element(by.css('.k-column-menu ul li[data-field-name="is_condition"]')).click();
        await browser.sleep(4000);
        await browser.refresh();
        await browser.sleep(2000);
  
        // добавление записей в справочник Заказы
        // 1
        await element(by.cssContainingText('a', 'Добавить запись')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Заказ'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.css('.displayname__name')).sendKeys('Заказ 2');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="delivery_date"] input')).sendKeys('01.05.2023');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="address"] input')).sendKeys('Тут есть буква у');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="phone"] input')).sendKeys('tyt');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="customer"]')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.rw-popup-container ul li', 'Core Admin')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="phone"] input')).clear().sendKeys('33698520147');
        await browser.sleep(200);
        await element(by.css('button[data-button-detail="order_table"]')).click();
        await browser.sleep(2000);
        await element(by.css('.modal-content .details__close-btn')).click();
        await browser.sleep(1500);

        // 2
        await element(by.cssContainingText('a', 'Добавить запись')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Заказ'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.css('.displayname__name')).sendKeys('Заказ 1');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="delivery_date"] input')).sendKeys('01.06.2023');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="address"] input')).sendKeys('Здесь есть буква я');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="phone"] input')).sendKeys('7789456uii');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="customer"]')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.rw-popup-container ul li', 'Andrei R')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="phone"] input')).clear().sendKeys('77894561230');
        await browser.sleep(200);
        await element(by.css('button[data-button-detail="order_table"]')).click();
        await browser.sleep(2000);
        await element(by.css('.modal-content .details__close-btn')).click();
        await browser.sleep(1500);

        // 3
        await element(by.cssContainingText('a', 'Добавить запись')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Заказ'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.css('.displayname__name')).sendKeys('Заказ 3');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="delivery_date"] input')).sendKeys('10.05.2023');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="address"] input')).sendKeys('Здесь есть буква ю');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="phone"] input')).clear().sendKeys('77418529630');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="customer"]')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.rw-popup-container ul li', 'Core Admin')).click();
        await browser.sleep(2000);
        await element(by.css('button[data-button-detail="order_table"]')).click();
        await browser.sleep(2000);
        await element(by.css('.modal-content .details__close-btn')).click();
        await browser.sleep(1500);
  
        // фильтры у колонок
        //дата доставки
        await element(by.css('th[data-title="Дата доставки"] .k-grid-filter')).click();
        await browser.sleep(2000);
        await element.all(by.css('.k-animation-container form .k-dropdown')).first().click();
        await browser.sleep(2000);
        await element.all(by.cssContainingText('.k-list-container .k-list-scroller ul li', 'до или равна')).first().click();
        await browser.sleep(500);
        await element.all(by.css('.k-animation-container .k-datepicker span input')).first().sendKeys('10.05.2023');
        await browser.sleep(200);
        await element(by.cssContainingText('.k-filter-menu button', 'Найти')).click();
        await browser.sleep(1000);
        await element(by.css('a[title="Закрыть"]')).click(); // .header-filter-grouping a[title="Закрыть"]
        await browser.sleep(2000);
        // заказчик
        await browser.refresh();
        await browser.sleep(2000);
        await element(by.css('th[data-title="Заказчик"] .k-grid-filter')).click();
        await browser.wait(EC.stalenessOf(element(by.css('.loader-spinner'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.css('.k-animation-container ul li', 'Andrei R')).click();
        await browser.sleep(1000);
        await element.all(by.cssContainingText('.k-animation-container button', 'Найти')).last().click();
        await browser.sleep(1000);
        await element(by.css('a[title="Закрыть"]')).click(); // .header-filter-grouping a[title="Закрыть"]
        await browser.refresh();
        await browser.sleep(2000);
        // Адрес доставки
        await element(by.css('th[data-title="Адрес доставки"] .k-grid-filter')).click();
        await browser.sleep(1000);
        await element.all(by.css('.k-animation-container input[type="text"]')).first().sendKeys('ю');
        await browser.sleep(1000);
        await element.all(by.cssContainingText('.k-animation-container button', 'Найти')).last().click();
        await browser.sleep(1000);
        await element(by.css('a[title="Закрыть"]')).click(); // .header-filter-grouping a[title="Закрыть"]
        await browser.refresh();
        await browser.sleep(7000);
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
  