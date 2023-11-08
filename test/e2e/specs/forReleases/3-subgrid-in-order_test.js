describe('Регистрация пространства', function () {
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

    //////////////////////////////// добавление/настройка сабгрида в Заказе
  
    it('add new row', async done => {
      await errorCatcher(async () => {
        await browser.get('http://localhost:8081/#/entitytype'); // https://service-manager.online/app
        await browser.sleep(2000);
  
        // // листаем список,чтоб добраться до таблицы
        // await element.all(by.css('.k-pager-numbers li')).last().click();
        // await browser.sleep(2000);
        // переключаем сортировку по ID, чтоб добраться до нужной таблицы
        await element(by.css('th[data-title="ID"]')).click();
        await browser.sleep(2000);
        await element(by.css('th[data-title="ID"]')).click();
        await browser.sleep(2000);

        const row4 = await element(by.cssContainingText('tr', 'Заказ'));
        await browser.actions().doubleClick(row4).perform();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Таблица'))), defaultWaitTimeout);
        await browser.sleep(2000);

        // открываем форм дизайнер через таблицу
        await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.accordion-panel', 'Поля'))), defaultWaitTimeout);
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel', 'Настройки отображения')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'Настройки отображения'))), defaultWaitTimeout);
        await browser.sleep(2000);
        const detailRow = await element(by.cssContainingText('tr', 'Заказ - Одна запись'));
        await browser.actions().doubleClick(detailRow).perform();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="label_base"] .glyphicon-pencil')).click();
        await browser.sleep(2000);
        
        // switch to tab with form designer
        const tabs = await browser.getAllWindowHandles();
        await browser.switchTo().window(tabs[1]);
        await browser.sleep(2000);

        // add new section
        await element(by.cssContainingText('button', 'Добавить секцию')).click();
        await browser.sleep(2000);
        await element(by.css('.form-designer__section-list-name input')).clear().sendKeys('new');
        await browser.sleep(200);
        await element(by.cssContainingText('.form-designer__btn', 'Добавить')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('button', 'Сохранить')).click();
        await browser.sleep(2000);
        await element.all(by.css('.accordion-panel .accordion-icon')).last().click();
        await browser.sleep(2000);

        // Drag&Drop settings
        const sidebar = await element.all(by.css('.form-designer__sidebar-group'));
        const form = await element.all(by.css('.react-grid-layout')).last();
        const dnd = require('html-dnd').code;

        // добавление сабгрида
        await sidebar[7].click();
        await browser.sleep(2000);
        const testSubgrid = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();
        await browser.executeScript(dnd, testSubgrid, form);
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.css('.form-header__title .glyphicon-pencil')).click();
        await browser.sleep(2000);
        await element(by.css('.displayname__name_active')).sendKeys('test_subgrid');
        await browser.sleep(200);
        await element(by.css('.displayname .glyphicon-ok')).click();
        await browser.sleep(200);
        await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('test_subgrid');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="defaultgroup"] input')).sendKeys('new');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="_$_FF/lookupviewname"]')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="_$_FF/lookupviewname"] .rw-popup-container input')).sendKeys('order_punkt');
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="_$_FF/lookupviewname"] .rw-popup-container ul li', 'order_punkt')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="_$_FF/lookupentity"]')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="_$_FF/lookupentity"] .rw-popup-container input')).sendKeys('Пункт заказа');
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="_$_FF/lookupentity"] .rw-popup-container ul li', 'Пункт заказа')).click();
        await browser.sleep(2000);
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

        // switch to the 1st tab
        await browser.switchTo().window(tabs[0]);
        await browser.sleep(2000);
  
        // включаем inline редактирование
        await browser.get('http://localhost:8081/#/order_table'); // https://service-manager.online/app
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Заказ'))), defaultWaitTimeout);
        await browser.sleep(1000);
        const row5 = await element.all(by.css('tr')).last();
        await browser.actions().doubleClick(row5).perform();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.accordion-panel ', 'new'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.cssContainingText('.accordion-panel ', 'new')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'test_subgrid'))), defaultWaitTimeout);
        await browser.sleep(1000);
        const hrefSettings = await element.all(by.css('a[title="Настроить таблицу"]')).last().getAttribute("href");
        const hrefStr = hrefSettings.split('#')[1];
        const newUrl = `http://localhost:8081/#${hrefStr}`; // https://service-manager.online/app
        await browser.get(newUrl);
        await browser.sleep(5000);
        await element(by.css('div[data-field-name="cancreate"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        await element(by.css('div[data-field-name="canupdate"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        await element(by.css('div[data-field-name="candelete"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        await element.all(by.css('.form-header__group button')).first().click();
        await browser.sleep(3000);
  
        // создание Пункта заказа из Заказа
        await browser.get('http://localhost:8081/#/order_table'); // https://service-manager.online/app
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Заказ'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.css('.idea-button-add-row-modal')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Заказ'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element.all(by.css('.displayname__name')).last().sendKeys('44');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="delivery_date"] input')).sendKeys('25.04.2023');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="customer"]')).click();
        await browser.sleep(2000);
        await element.all(by.css('.rw-popup-container ul li')).last().click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="address"] input')).sendKeys('Тут есть буква у');
        await browser.sleep(2000);
        await element(by.css('button[data-button-detail="order_table"]')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel ', 'new')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'test_subgrid'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element.all(by.css('.idea-button-add-row-modal')).last().click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Пункт заказа'))), defaultWaitTimeout);
        await browser.sleep(2000);
        const ordNum = await element(by.css('div[data-field-name="order_link"] input')).getAttribute('value');
        console.log(ordNum, '44');
        await browser.sleep(1000);
        await element.all(by.css('.displayname__name')).last().sendKeys('44');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="spare_link"]')).click();
        await browser.sleep(2000);
        await element.all(by.css('div[data-field-name="spare_link"] .rw-popup-container ul li')).first().click();
        await browser.sleep(2000);
        await element(by.css('button[data-button-detail="order_punkt"]')).click();
        await browser.sleep(4000);
  
        //проверка inline редактирования и добавления
        await browser.get('http://localhost:8081/#/order_table'); // https://service-manager.online/app
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Заказ'))), defaultWaitTimeout);
        await browser.sleep(1000);
        const row6 = await element.all(by.css('tr')).last();
        await browser.actions().doubleClick(row6).perform();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.accordion-panel ', 'new'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.cssContainingText('.accordion-panel ', 'new')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'test_subgrid'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element.all(by.css('tr td .k-grid-edit')).first().click();
        await browser.sleep(2000);
        await element(by.css('tr[data-role="editable"] td .k-grid-cancel')).click();
        await browser.sleep(2000);
        await element(by.css('.idea-button-add-row')).click();
        await browser.sleep(1000);
        await element(by.css('tr[data-role="editable"] td .k-grid-cancel')).click();
        await browser.sleep(2000);
  
        //проверка истории при изменении данных Заказа
        await element(by.cssContainingText('.accordion-panel ', 'Общая информация')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="delivery_date"] .rw-select button')).click();
        await browser.sleep(2000);
        await element.all(by.css('.rw-calendar-popup table tbody tr td')).first().click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="address"] input')).clear().sendKeys('Новый адрес');
        await browser.sleep(200);
        await element(by.css('button[title=" Сохранить"]')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel ', 'История')).click();
        await browser.sleep(5000);
  
        // настройка индексов уникальности
        await browser.get('http://localhost:8081/#/entityconstraint'); // https://service-manager.online/app
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Индексы'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.css('.idea-button-add-row-modal')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Индексы'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.css('.displayname__name')).sendKeys('Для пунктов заказа');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="entitytypeid"]')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="entitytypeid"] .rw-popup-container input')).sendKeys('order_punkt');
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="entitytypeid"] .rw-popup-container ul li', 'order_punkt')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="constrainttype"] input')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="constrainttype"] .rw-popup-container ul li', 'UNIQUE')).click();
        await browser.sleep(200);
        await element(by.css('button[data-button-detail="entityconstraint"]')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.accordion-panel ', 'Поля')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'Поля'))), defaultWaitTimeout);
        await browser.sleep(1000);
        // добавляем поля
        await element(by.css('.subgrid__wrapper .idea-button-add-row-modal')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="fieldname"]')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="fieldname"] .rw-popup-container ul li', 'order_link')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
        await browser.sleep(200);
        await element.all(by.css('.form-header__wrapper')).last().click();
        await browser.sleep(2000);
        await element(by.css('button[data-button-detail="entityconstraintentry"]')).click();
        await browser.sleep(2000);
        await element.all(by.css('.details__close-btn')).last().click();
        await browser.sleep(2000);
        // добавляем поля
        await element(by.css('.subgrid__wrapper .idea-button-add-row-modal')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="fieldname"]')).click();
        await browser.sleep(2000);
        await element(by.cssContainingText('div[data-field-name="fieldname"] .rw-popup-container ul li', 'spare_link')).click();
        await browser.sleep(2000);
        await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
        await browser.sleep(200);
        await element.all(by.css('.form-header__wrapper')).last().click();
        await browser.sleep(2000);
        await element(by.css('button[data-button-detail="entityconstraintentry"]')).click();
        await browser.sleep(2000);
        await element.all(by.css('.details__close-btn')).last().click();
        await browser.sleep(2000);
        // активируем элемент
        await element(by.cssContainingText('.accordion-panel ', 'Общая информация')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('div[data-field-name="isreconsiliationuniqueconstraint"]', 'Использовать в качестве первичного ключа реконсиляции'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.css('div[data-field-name="isactive"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        await element(by.css('div[data-field-name="isreconsiliationuniqueconstraint"] .checkboxfield__checkbox')).click();
        await browser.sleep(200);
        await element(by.css('button[title=" Готово"]')).click();
        await browser.sleep(2000);
  
        // пробуем создать поле с одной запчастью в Заказе
        await browser.get('http://localhost:8081/#/order_table'); // https://service-manager.online/app
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Заказ'))), defaultWaitTimeout);
        await browser.sleep(2000);
        // // добавим новую запись
        // await element(by.cssContainingText('a', 'Добавить запись')).click();
        // await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Заказ'))), defaultWaitTimeout);
        // await browser.sleep(2000);
        // await element(by.css('.displayname__name')).sendKeys('Заказ 4');
        // await browser.sleep(2000);
        // await element(by.css('div[data-field-name="delivery_date"] input')).sendKeys('10.06.2023');
        // await browser.sleep(2000);
        // await element(by.css('div[data-field-name="address"] input')).sendKeys('Здесь есть буква ю');
        // await element(by.css('div[data-field-name="customer"]')).click();
        // await browser.sleep(2000);
        // await element.all(by.css('.rw-popup-container ul li span')).first().click();
        // await browser.sleep(5000);
        // await element(by.css('button[data-button-detail="order_table"]')).click();
        // await browser.sleep(2000);
        // await element(by.css('.modal-content .details__close-btn')).click();
        // await browser.sleep(1500);

        const row7 = await element.all(by.css('tr')).last();
        await browser.actions().doubleClick(row7).perform();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.accordion-panel ', 'Общая информация'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element(by.cssContainingText('.accordion-panel ', 'new')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'test_subgrid'))), defaultWaitTimeout);
        await browser.sleep(2000);
        // 1
        await element.all(by.css('.idea-button-add-row-modal')).last().click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Пункт заказа'))), defaultWaitTimeout);
        await browser.sleep(1000);
        await element.all(by.css('.displayname__name')).last().sendKeys('4');
        await browser.sleep(200);
        await element(by.css('div[data-field-name="spare_link"]')).click();
        await browser.sleep(2000);
        await element.all(by.css('div[data-field-name="spare_link"] .rw-popup-container ul li')).first().click();
        await browser.sleep(2000);
        await element(by.css('button[data-button-detail="order_punkt"]')).click();
        await browser.sleep(2000);
        await element(by.css('.alerts__container .alert__close-btn')).click();
        await browser.sleep(200);
        await element.all(by.css('.details__close-btn')).last().click();
        await browser.sleep(2000);
        await element(by.cssContainingText('.popup__dialog-btn_secondary', 'Закрыть форму')).click();
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
  