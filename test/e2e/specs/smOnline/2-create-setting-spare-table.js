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

    it("Проверить работу личного кабинета", async (done) => {
        console.log("Проверить работу личного кабинета");
        await errorCatcher(async () => {
          await browser.actions().mouseMove(element(by.className("username"))).perform();
          await browser.sleep(1000);
          const userProfileBtn = await element(by.cssContainingText(".dropdown-menu li", "Личный кабинет"));
          const hasUserProfileBtn = await userProfileBtn.isPresent();
          if (hasUserProfileBtn) await userProfileBtn.click();
          await browser.wait(EC.presenceOf(element(by.cssContainingText(".form-header__title", "Личный кабинет пользователя"))), defaultWaitTimeout);
    
          await browser.wait(EC.stalenessOf($(".loader-spinner")), defaultWaitTimeout);
          await browser.sleep(1000);
          await element(by.cssContainingText(".details__modal .accordion-panel", "Моя рабочая область")).click();
          await browser.wait(EC.visibilityOf(element(by.css(".dashboard-item__wrapper_subgrid"))), defaultWaitTimeout);
          await element(by.css(".details__close-btn")).click();
          await browser.wait(EC.stalenessOf(element(by.cssContainingText(".form-header__title", "Личный кабинет пользователя"))), defaultWaitTimeout);
          await browser.sleep(500);
        }, done);
      }, skip());

    it('Добавить таблицу Запчасть', async done => {
        console.log('Добавить таблицу Запчасть');
        await errorCatcher(async () => {
            await browser.get('http://localhost:8081/#/entitytype/'); // https://service-manager.online/app/#/entitytype
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Таблица'))), defaultWaitTimeout);

            const dataRow = await element(by.cssContainingText('tr', 'Данные (Data)'));
            const referenceRow = await element(by.cssContainingText('tr', 'Справочник (Reference)'));
            const hasDataRow = await dataRow.isPresent();
            const hasReferenceRow = await referenceRow.isPresent();
            if (hasDataRow && hasReferenceRow) await console.log('таблицы Данные и Справочники созданы');

            await element(by.css('.list-wrapper .idea-grid .k-header .idea-button-add-row-modal')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.modal-content .form-header__title', 'Таблица'))), defaultWaitTimeout);
            await browser.sleep(200);

            // пишем название в заголовке
            await element(by.css('.displayname__name_active')).sendKeys('Запчасть');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(2000);
            //задаем системное имя
            await element(by.css('div[data-field-name="tablename"] input')).sendKeys('spare');
            await browser.sleep(200);

            // очистка и выбор поля Справочник из выпадающего списка
            await element(by.css('div[data-field-name="baseentitytypeid"] .glyphicon-remove')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="baseentitytypeid"]')).click();
            await browser.sleep(5000);
            await element(by.css('.rw-popup-container .rw-input-reset')).sendKeys('Справочник (Reference)');
            await browser.sleep(4000);
            await element(by.cssContainingText('.rw-popup ul li', 'Справочник (Reference)')).click();
            await browser.sleep(1500);

            // жмём кн Создать
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(2000);

            // активируем таблицу
            await element(by.css('div[data-field-name="isactive"] .checkboxfield__checkbox')).click();
            await browser.sleep(2000);

            // сохранение изменений
            await element(by.css('button[data-button-name="UPDATE"]')).click();
            await browser.sleep(7000);

            // переключаемся на вкладку Настройки отображения
            await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
            // await browser.wait(EC.presenceOf(element(by.cssContainingText('.accordion-panel', 'Настройки отображения'))), defaultWaitTimeout);
            await browser.sleep(3000);
            await element(by.cssContainingText('.accordion-panel', 'Настройки отображения')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'Настройки отображения'))), defaultWaitTimeout);
            // await browser.sleep(3000);

            const oneRow = await element(by.cssContainingText('tr', 'Запчасть - Список записей'));
            const rowList = await element(by.cssContainingText('tr', 'Запчасть - Одна запись'));
            const hasOneRow = await oneRow.isPresent();
            const hasRowList = await rowList.isPresent();
            if (hasOneRow && hasRowList) console.log('формы списка заказов и одной записи заказа созданы');
            await browser.sleep(2000);
            // open form designer
            const detailRow = await element(by.cssContainingText('tr', 'Запчасть - Одна запись'));
            await browser.actions().doubleClick(detailRow).perform();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Настройки отображения'))), defaultWaitTimeout);
            await browser.sleep(2000);
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

            // Поле цена
            await sidebar[1].click();
            await browser.sleep(2000);
            const doubleNumber = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);
            await browser.executeScript(dnd, doubleNumber, form);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
            await browser.sleep(1000);
            // пишем название в заголовке
            await element(by.css('.form-header__title .glyphicon-pencil')).click();
            await browser.sleep(2000);
            await element(by.css('.displayname__name_active')).sendKeys('Цена (Price)');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('price');
            await browser.sleep(200);
            // change field format
            await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'Дробное число (Double) с 2 знаками после запятой')).click();
            await browser.sleep(2000);
            // check isRequired
            await element(by.css('div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox')).click();
            await browser.sleep(200);
            // кн Создать поле
            await element(by.cssContainingText('button', 'Создать поле')).click();
            await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);
            // check Аудит включен
            await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
            await browser.sleep(200);
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

            // поле Описание
            await sidebar[2].click();
            await browser.sleep(2000);
            const description = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);
            await browser.executeScript(dnd, description, form);
            await browser.sleep(2000);
            // set displayname
            await element(by.css('.form-header__title .glyphicon-pencil')).click();
            await browser.sleep(2000);
            await element(by.css('.displayname__name_active')).sendKeys('Описание');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('descriptiontest');
            await browser.sleep(200);
            // change field format
            await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__remove-btn')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="fieldformatid"] .rw-popup-container .rw-input-reset')).sendKeys('Simple Rich Text Editor (Rich Text Editor)');
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-transition ul li', 'Simple Rich Text Editor (Rich Text Editor)')).click();
            await browser.sleep(2000);
            // кн Создать поле
            await element(by.cssContainingText('button', 'Создать поле')).click();
            await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);
            //check Аудит включен
            await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
            await browser.sleep(2000);
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

            // поле Картинка
            await sidebar[6].click();
            await browser.sleep(2000);
            const image = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(3);
            await browser.executeScript(dnd, image, form);
            await browser.sleep(2000);
            // пишем название в заголовке
            await element(by.css('.form-header__title .glyphicon-pencil')).click();
            await browser.sleep(2000);
            await element(by.css('.displayname__name_active')).sendKeys('Картинка');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('imgtest');
            await browser.sleep(100);
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

            // поле Класс переработки
            await sidebar[4].click();
            await browser.sleep(2000);
            const classRow = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);
            await browser.executeScript(dnd, classRow, form);
            await browser.sleep(2000);
            // пишем название в заголовке
            await element(by.css('.form-header__title .glyphicon-pencil')).click();
            await browser.sleep(2000);
            await element(by.css('.displayname__name_active')).sendKeys('Класс переработки');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('recycle_class');
            await browser.sleep(100);
            // set data type
            await element(by.css('div[data-field-name="_$_FF/fieldtype"] .rw-btn-select')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="_$_FF/fieldtype"] .rw-popup-container ul li', 'STRING')).click();
            await browser.sleep(2000);
            // set pattern
            await element(by.css('div[data-field-name="_$_FF/pattern"] input')).sendKeys('A:A:ok-sign#008000;B:B:adjust#FFA500;C:C:remove-sign#FF0000');
            await browser.sleep(200);
            // default value
            await element(by.css('div[data-field-name="defaultvalue"] input')).sendKeys('C');
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

            // поле Переработка
            await sidebar[4].click();
            await browser.sleep(2000);
            const typeRow = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(6);
            await browser.executeScript(dnd, typeRow, form);
            await browser.sleep(2000);
            // пишем название в заголовке
            await element(by.css('.form-header__title .glyphicon-pencil')).click();
            await browser.sleep(2000);
            await element(by.css('.displayname__name_active')).sendKeys('Переработка');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('is_recycle');
            await browser.sleep(100);
            // set pattern
            await element(by.css('div[data-field-name="_$_FF/pattern"] input')).sendKeys('1:Полностью перерабатывается;2:Частично перерабатывается;3:Не перерабатывается');
            await browser.sleep(200);
            // default value
            await element(by.css('div[data-field-name="defaultvalue"] input')).sendKeys('3');
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

            // поле Материал
            await sidebar[4].click();
            await browser.sleep(2000);
            const materialList = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();
            await browser.executeScript(dnd, materialList, form);
            await browser.sleep(2000);
            // пишем название в заголовке
            await element(by.css('.form-header__title .glyphicon-pencil')).click();
            await browser.sleep(2000);
            await element(by.css('.displayname__name_active')).sendKeys('Материал');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('materialtest');
            await browser.sleep(200);
            // set pattern
            await element(by.css('div[data-field-name="_$_FF/pattern"] input')).sendKeys('metal:Металл;plastic:Пластик;wood:Дерево');
            await browser.sleep(200);
            // кн Создать поле
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.wait(EC.stalenessOf($('button[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);
            // close modal
            await element(by.css('.details__close-btn')).click();
            await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
            await browser.sleep(1000);
            // закрыть секцию бокового меню
            await element.all(by.css(".form-designer__sidebar-group[open] summary")).click();
            await browser.sleep(100);
            // Сохранить форму
            await element(by.cssContainingText("button", "Сохранить")).click();
            await browser.sleep(2000);

            // поле Url field
            await sidebar[5].click();
            await browser.sleep(2000);
            const urlField = await element.all(by.css(".form-designer__sidebar-group[open] .form-designer__control-wrapper")).last();
            await browser.executeScript(dnd, urlField, form);
            await browser.sleep(2000);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys("url_field_test");
            await browser.sleep(200);
            // кн Создать поле
            await element(by.cssContainingText("button", "Создать поле")).click();
            await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);
            // close modal
            await element(by.css(".details__close-btn")).click();
            await browser.wait(EC.stalenessOf($(".details-fade")), defaultWaitTimeout);
            await browser.sleep(1000);

            // поле рейтинг
            const rating = await element.all(by.css(".form-designer__control-item-block .form-designer__control-wrapper")).first();
            await browser.executeScript(dnd, rating, form);
            await browser.sleep(2000);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys("rating_test");
            await browser.sleep(200);
            await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="fieldformatid"] .rw-popup-container input')).sendKeys('test rating');
            await browser.sleep(1000);
            await element(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'Test Rating')).click();
            await browser.sleep(1500);
            // кн Создать поле
            await element(by.cssContainingText("button", "Создать поле")).click();
            await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);
            // close modal
            await element(by.css(".details__close-btn")).click();
            await browser.wait(EC.stalenessOf($(".details-fade")), defaultWaitTimeout);
            await browser.sleep(1000);
            // Сохранить форму
            await element(by.cssContainingText("button", "Сохранить")).click();
            await browser.sleep(2000);

            // поле qrcode
            const qrcode = await element.all(by.css(".form-designer__control-item-block .form-designer__control-wrapper")).first();
            await browser.executeScript(dnd, qrcode, form);
            await browser.sleep(2000);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys("qrcode_test");
            await browser.sleep(200);
            await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__container')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="fieldformatid"] .rw-popup-container input')).sendKeys('qr code');
            await browser.sleep(1000);
            await element(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup-container ul li', 'QR Code')).click();
            await browser.sleep(1500);
            // кн Создать поле
            await element(by.cssContainingText("button", "Создать поле")).click();
            await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);
            // close modal
            await element(by.css(".details__close-btn")).click();
            await browser.wait(EC.stalenessOf($(".details-fade")), defaultWaitTimeout);
            await browser.sleep(1000);
            // Сохранить форму
            await element(by.cssContainingText("button", "Сохранить")).click();
            await browser.sleep(2000);

            // подвинем на форме поле Цена
            const priceRow = await element(by.css('div[data-field-name="price"]'));
            await browser.actions().mouseDown(priceRow).mouseMove({ x: -600, y: 0 }).mouseUp().perform();
            await browser.sleep(2000);

            // подвинем на форме поле Картинка
            const imgRow = await element(by.css('div[data-field-name="imgtest"]'));
            await browser.actions().mouseDown(imgRow).mouseMove({ x: -600, y: 0 }).mouseUp().perform();
            await browser.sleep(2000);

            // подвинем на форме поле Материал
            const materialRow = await element(by.css('div[data-field-name="materialtest"]'));
            await browser.actions().mouseDown(materialRow).mouseMove({ x: -600, y: 0 }).mouseUp().perform();
            await browser.sleep(2000);

            // Сохранить форму
            await element(by.cssContainingText('button', 'Сохранить')).click();
            await browser.sleep(2000);

            // switch to the 1st tab
            await browser.switchTo().window(tabs[0]);
            await browser.sleep(2000);
            await element.all(by.css('.details__close-btn')).last().click();
            await browser.sleep(1500);

            // добавление схлопывающихся полей
            await element(by.css('div[data-field-name="relateddisplaylist"] .idea-button-add-row-modal')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Настройки отображения:'))), defaultWaitTimeout);
            // пишем название в заголовке
            // await element.all(by.css(".form-header__title .glyphicon-pencil")).last().click();
            await browser.sleep(200);
            await element(by.css(".displayname__name_active")).sendKeys("Другие характеристики");
            await browser.sleep(200);
            await element(by.css(".displayname .glyphicon-ok")).click();
            await browser.sleep(200);
            // задаем полю системное имя
            await element.all(by.css('div[data-field-name="viewname"] input')).last().sendKeys("concattest");
            await browser.sleep(200);
            await element(by.css('div[data-field-name="displaytype"] input')).click();
            await browser.sleep(500);
            await element(by.cssContainingText('div[data-field-name="displaytype"] .rw-popup-container ul li', 'DETAILS')).click();
            await browser.sleep(500);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.wait(EC.presenceOf(element(by.css('div[data-field-name="label_base"]'))), defaultWaitTimeout);
            await browser.sleep(200);
            // переход в конструктор
            await element(by.css('.htmlfield__wrapper a')).click();
            const tabs2 = await browser.getAllWindowHandles();
            await browser.switchTo().window(tabs2[1]);
            await browser.wait(EC.presenceOf(element(by.css('div[data-field-name="price"]'))), defaultWaitTimeout);
            await browser.sleep(200);
            // удалить все поля Активно
            await browser.actions().mouseDown(element(by.css('div[data-field-name="isactive"]'))).perform();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="isactive"] .form-designer__layout-item-delete')).click();
            await browser.sleep(500);
            await element(by.cssContainingText('.form-designer__remove-footer button', 'Удалить')).click();
            await browser.sleep(2000);
            // Сохранить форму
            await element(by.cssContainingText("button", "Сохранить")).click();
            await browser.sleep(2000);
            // удалить все поля Цена
            await browser.actions().mouseDown(element(by.css('div[data-field-name="price"]'))).perform();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="price"] .form-designer__layout-item-delete')).click();
            await browser.sleep(5000);
            await element(by.cssContainingText('.form-designer__remove-footer button', 'Удалить')).click();
            await browser.sleep(2000);
            // Сохранить форму
            await element(by.cssContainingText("button", "Сохранить")).click();
            await browser.sleep(2000);
            // удалить все поля Описание
            await browser.actions().mouseDown(element(by.css('div[data-field-name="descriptiontest"]'))).perform();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="descriptiontest"] .form-designer__layout-item-delete')).click();
            await browser.sleep(5000);
            await element(by.cssContainingText('.form-designer__remove-footer button', 'Удалить')).click();
            await browser.sleep(2000);
            // удалить все поля Картинка
            await browser.actions().mouseDown(element(by.css('div[data-field-name="imgtest"]'))).perform();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="imgtest"] .form-designer__layout-item-delete')).click();
            await browser.sleep(5000);
            await element(by.cssContainingText('.form-designer__remove-footer button', 'Удалить')).click();
            await browser.sleep(2000);
            // удалить все поля Переработка
            await browser.actions().mouseDown(element(by.css('div[data-field-name="is_recycle"]'))).perform();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="is_recycle"] .form-designer__layout-item-delete')).click();
            await browser.sleep(5000);
            await element(by.cssContainingText('.form-designer__remove-footer button', 'Удалить')).click();
            await browser.sleep(2000);
            // удалить все поля Материалы
            await browser.actions().mouseDown(element(by.css('div[data-field-name="materialtest"]'))).perform();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="materialtest"] .form-designer__layout-item-delete')).click();
            await browser.sleep(5000);
            await element(by.cssContainingText('.form-designer__remove-footer button', 'Удалить')).click();
            await browser.sleep(2000);
            // Сохранить форму
            await element(by.cssContainingText("button", "Сохранить")).click();
            await browser.sleep(2000);
            // Добавим 2 строковых поля
            // Drag&Drop settings
            const sidebar2 = await element.all(by.css(".form-designer__sidebar-group"));
            const form2 = await element.all(by.css(".react-grid-layout")).first();
            const dnd = require("html-dnd").code;
            // Поле 1
            await sidebar2[0].click();
            await browser.sleep(2000);
            const str1 = await element.all(by.css(".form-designer__sidebar-group[open] .form-designer__control-wrapper")).get(1);
            await browser.executeScript(dnd, str1, form2);
            await browser.wait(EC.presenceOf(element(by.cssContainingText(".form-header__title", "Поле"))), defaultWaitTimeout);
            await browser.sleep(1000);
            // пишем название в заголовке
            await element(by.css(".form-header__title .glyphicon-pencil")).click();
            await browser.sleep(2000);
            await element(by.css(".displayname__name_active")).sendKeys("Поле 1");
            await browser.sleep(200);
            await element(by.css(".displayname .glyphicon-ok")).click();
            await browser.sleep(200);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys("field1");
            await browser.sleep(200);
            // кн Создать поле
            await element(by.cssContainingText("button", "Создать поле")).click();
            await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);
            // close modal
            await element(by.css(".details__close-btn")).click();
            await browser.wait(EC.stalenessOf($(".details-fade")), defaultWaitTimeout);
            await browser.sleep(1000);
            // Сохранить форму
            await element(by.cssContainingText("button", "Сохранить")).click();
            await browser.sleep(2000);
            // Поле 2
            await sidebar2[0].click();
            await browser.sleep(2000);
            const str2 = await element.all(by.css(".form-designer__sidebar-group[open] .form-designer__control-wrapper")).get(1);
            await browser.executeScript(dnd, str2, form2);
            await browser.wait(EC.presenceOf(element(by.cssContainingText(".form-header__title", "Поле"))), defaultWaitTimeout);
            await browser.sleep(1000);
            // пишем название в заголовке
            await element(by.css(".form-header__title .glyphicon-pencil")).click();
            await browser.sleep(2000);
            await element(by.css(".displayname__name_active")).sendKeys("Поле 2");
            await browser.sleep(200);
            await element(by.css(".displayname .glyphicon-ok")).click();
            await browser.sleep(200);
            // задаем полю системное имя
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys("field2");
            await browser.sleep(200);
            // кн Создать поле
            await element(by.cssContainingText("button", "Создать поле")).click();
            await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);
            // close modal
            await element(by.css(".details__close-btn")).click();
            await browser.wait(EC.stalenessOf($(".details-fade")), defaultWaitTimeout);
            await browser.sleep(1000);
            // Сохранить форму
            await element(by.cssContainingText("button", "Сохранить")).click();
            await browser.sleep(2000);
            // Создадм новый формат поля
            await browser.get("http://localhost:8081/#/fieldformat/");
            await browser.wait(EC.presenceOf(element(by.cssContainingText(".table-name", "Формат Поля"))), defaultWaitTimeout);
            await browser.sleep(200);

            await element(by.css('.idea-button-add-row-modal')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText(".form-header__title", "Формат Поля:"))), defaultWaitTimeout);
            await browser.sleep(500);
            await element(by.css('.displayname__name')).sendKeys('Concatformat');
            await element(by.css('.modal-content .glyphicon-ok')).click();
            await browser.sleep(200);
            await element(by.css('div[data-field-name="widgettype"] .comboboxfield__container')).click();
            await browser.sleep(1000);
            await element(by.css('div[data-field-name="widgettype"] .rw-popup-container .rw-input-reset')).sendKeys('concatenation');
            await browser.sleep(200);
            await element(by.cssContainingText('div[data-field-name="widgettype"] .rw-popup-container ul li', 'concatenation')).click();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="lookupviewname"] .comboboxfield__container')).click();
            await browser.sleep(1000);
            await element(by.css('div[data-field-name="lookupviewname"] .rw-popup-container .rw-input-reset')).sendKeys('concattest');
            await browser.sleep(200);
            await element(by.cssContainingText('div[data-field-name="lookupviewname"] .rw-popup-container ul li', 'concattest')).click();
            await browser.sleep(500);
            // кн Создать формат
            await element(by.cssContainingText("button", "Создать")).click();
            await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);
            // close modal
            await element(by.css(".details__close-btn")).click();
            await browser.wait(EC.stalenessOf($(".details-fade")), defaultWaitTimeout);
            await browser.sleep(1000);
            // Возвращаемся на 1 вкладку
            await browser.switchTo().window(tabs2[0]);
            await browser.sleep(2000);
            await element.all(by.css('.details__close-btn')).last().click();
            await browser.sleep(1200);
            await element(by.cssContainingText(".accordion-panel", "Поля")).click();
            // await browser.wait(EC.presenceOf(element(by.cssContainingText('.accordion-panel', 'Настройки отображения'))), defaultWaitTimeout);
            await browser.sleep(3000);
            await element(by.css('div[data-field-name="entityfieldlist"] .idea-button-add-row-modal')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText(".form-header__title", "Поле"))), defaultWaitTimeout);
            await browser.sleep(200);
            await element.all(by.css('.displayname__name')).last().sendKeys('Доп.характеристики');
            await element.all(by.css('.modal-content .glyphicon-ok')).last().click();
            await browser.sleep(200);
            await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('test_details');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="fieldformatid"]')).click();
            await browser.sleep(5000);
            await element(by.css('div[data-field-name="fieldformatid"] .rw-input-reset')).sendKeys("Concatformat");
            await browser.sleep(4000);
            await element(by.cssContainingText('div[data-field-name="fieldformatid"] .rw-popup ul li', 'Concatformat')).click();
            await browser.sleep(1500);
            // кн Создать поле
            await element(by.cssContainingText('button', 'Создать поле')).click();
            await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            await browser.sleep(1000);

            // switch to the 1st tab
            await browser.switchTo().window(tabs2[0]);
            await browser.sleep(2000);

            await browser.get('http://localhost:8081/#/spare/'); // https://service-manager.online/app/#/spare
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Запчасть'))), defaultWaitTimeout);
            await browser.sleep(200);

            // формирование вида списка Запчастей
            await element(by.css('.view-settings-button')).click();
            await browser.wait(EC.visibilityOf(element(by.css('.k-menu-group'))), defaultWaitTimeout);
            // await browser.sleep(2000);
            await element(by.css('.k-column-menu ul li[data-field-name="price"]')).click();
            await element(by.css('.k-column-menu ul li[data-field-name="descriptiontest"]')).click();
            await element(by.css('.k-column-menu ul li[data-field-name="imgtest"]')).click();
            await element(by.css('.k-column-menu ul li[data-field-name="materialtest"]')).click();
            await element(by.css('.k-column-menu ul li[data-field-name="is_recycle"]')).click();
            await element(by.css('.k-column-menu ul li[data-field-name="recycle_class"]')).click();
            await element(by.css('.k-column-menu ul li[data-field-name="spareid"]')).click();
            await browser.sleep(2000);
            // await element(by.css('.publish-changes-button')).click();
            await browser.sleep(2000);
            await browser.refresh();
            await browser.sleep(2000);

            // добавление записей в справочник Запчасти
            // 1
            await element(by.cssContainingText("a", "Добавить запись")).click(); // в модальном окне
            await browser.wait(EC.presenceOf(element(by.cssContainingText(".form-header__title span", "Запчасть"))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.css(".displayname__name")).sendKeys("Запчасть 2");
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="price"] input')).sendKeys("11.55");
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="descriptiontest"] .sun-editor-editable')).sendKeys("Тут есть буква и");
            await browser.sleep(80);
            await element(by.cssContainingText('div[data-field-name="is_recycle"] ul li', "Полностью перерабатывается")).click();
            await browser.sleep(80);
            await element(by.css('div[data-field-name="materialtest"]')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText(".rw-popup-container ul li span", "Металл")).click();
            await browser.sleep(2000);
            const imageField = await element(by.css('div[data-field-name="imgtest"] input'));
            let imgToUpload = "./sign.jpg";
            const absolutePath = path.resolve(__dirname, imgToUpload);
            imageField.sendKeys(absolutePath);
            await browser.sleep(5000);
            // добавление схлопывающегося поля
            console.log('добавление схлопывающегося поля');
            await element(by.css('div[data-field-name="test_details"] .concatenation__edit-btn')).click();
            await browser.wait(EC.presenceOf(element(by.css('.concatenation-popup__text'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element.all(by.css('.concatenation-popup__widget-container input')).first().sendKeys('параметр 1');
            await browser.sleep(200);
            await element.all(by.css('.concatenation-popup__widget-container input')).last().sendKeys('параметр 2');
            await browser.sleep(200);
            await element(by.cssContainingText('.concatenation-popup__container .concatenation-popup__btn_primary', 'Сохранить')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.concatenation-popup'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.css('button[data-button-detail="spare"]')).click();
            await browser.sleep(2000);
            // проверка заполненности полей в схлопывающихся полях
            console.log('проверка заполненности полей в схлопывающихся полях');
            await element(by.css('div[data-field-name="test_details"] .concatenation__edit-btn')).click();
            await browser.wait(EC.presenceOf(element(by.css('.concatenation-popup__text'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.cssContainingText('.concatenation-popup__container .concatenation-popup__btn_primary', 'Отмена')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.concatenation-popup'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.css(".modal-content .details__close-btn")).click();
            await browser.sleep(1500);

            // 2
            await element(by.cssContainingText("a", "Добавить запись")).click(); // в модальном окне
            await browser.wait(EC.presenceOf(element(by.cssContainingText(".form-header__title span", "Запчасть"))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.css(".displayname__name")).sendKeys("Запчасть 1");
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="price"] input')).sendKeys("2.01");
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="descriptiontest"] .sun-editor-editable')).sendKeys("Тут нет");
            await browser.sleep(80);
            await element(by.cssContainingText('div[data-field-name="is_recycle"] ul li', "Частично перерабатывается")).click();
            await browser.sleep(80);
            await element(by.css('div[data-field-name="materialtest"]')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText(".rw-popup-container ul li span", "Пластик")).click();
            await browser.sleep(1000);
            // добавим ссылку
            await element(by.css('div[data-field-name="url_field_test"] .url-btn')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.url-modal__header-text', 'Добавление ссылки'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.id('urlField')).sendKeys('rbc.ru');
            await browser.sleep(200);
            await element(by.cssContainingText('.url-btn', 'Подтвердить')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.url-modal-modal__backdrop'))), defaultWaitTimeout);
            await browser.sleep(200);
            const imageField2 = await element(by.css('div[data-field-name="imgtest"] input'));
            let imgToUpload2 = "./sign.jpg";
            const absolutePath2 = path.resolve(__dirname, imgToUpload2);
            imageField2.sendKeys(absolutePath2);
            await browser.sleep(5000);
            await element(by.css('button[data-button-detail="spare"]')).click();
            await browser.sleep(2000);
            // проверим ссылку
            await element(by.css('div[data-field-name="url_field_test"] .url-btn')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.url-modal__header-text', 'Добавление ссылки'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.css('.url-modal-close-btn')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.url-modal-modal__backdrop'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.css(".modal-content .details__close-btn")).click();
            await browser.sleep(1500);

            // 3
            await element(by.cssContainingText("a", "Добавить запись")).click(); // в модальном окне
            await browser.wait(EC.presenceOf(element(by.cssContainingText(".form-header__title span", "Запчасть"))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.css(".displayname__name")).sendKeys("Запчасть 3");
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="price"] input')).sendKeys("10");
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="descriptiontest"] .sun-editor-editable')).sendKeys("Тут нет");
            await browser.sleep(80);
            await element(by.css('div[data-field-name="materialtest"]')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText(".rw-popup-container ul li span", "Дерево")).click();
            await browser.sleep(2000);
            // добавим рейтинг
            await element(by.css('div[data-field-name="rating_test"] .rating__wrapper > span > span')).click();
            await browser.sleep(200);
            const imageField3 = await element(by.css('div[data-field-name="imgtest"] input'));
            let imgToUpload3 = "./sign.jpg";
            const absolutePath3 = path.resolve(__dirname, imgToUpload3);
            imageField3.sendKeys(absolutePath3);
            await browser.sleep(5000);
            await element(by.css('button[data-button-detail="spare"]')).click();
            await browser.sleep(2000);
            await element(by.css(".modal-content .details__close-btn")).click();
            await browser.sleep(1500);

            // сортировка по полю Цена
            await element(by.css('th[data-title="Цена (Price)"]')).click();
            await browser.sleep(2000);

            // фильтры у колонок
            // Материал
            await element(by.css('th[data-title="Материал"] .k-grid-filter')).click();
            await browser.sleep(1000);
            await element(by.cssContainingText('.k-filter-menu ul li .k-label', 'Металл')).click();
            await browser.sleep(200);
            await element(by.cssContainingText('.k-filter-menu button', 'Найти')).click();
            await browser.sleep(1000);
            await element(by.css('a[title="Закрыть"]')).click();
            await browser.refresh();
            await browser.sleep(2000);
            // Переработка
            await element(by.css('th[data-title="Переработка"] .k-grid-filter')).click();
            await browser.sleep(1000);
            await element(by.cssContainingText('.k-filter-menu ul li .k-label', 'Не перерабатывается')).click();
            await browser.sleep(200);
            await element(by.cssContainingText('.k-filter-menu button', 'Найти')).click();
            await browser.sleep(1000);
            await element(by.css('a[title="Закрыть"]')).click();
            await browser.refresh();
            await browser.sleep(2000);
            // Класс переработки
            await element(by.css('th[data-title="Класс переработки"] .k-grid-filter')).click();
            await browser.sleep(1000);
            await element(by.cssContainingText('.k-filter-menu ul li .k-label', 'B')).click();
            await browser.sleep(200);
            await element(by.cssContainingText('.k-filter-menu button', 'Найти')).click();
            await browser.sleep(1000);
            await element(by.css('a[title="Закрыть"]')).click();
            await browser.sleep(2000);
            // Цена
            await element(by.css('th[data-title="Цена (Price)"] .k-grid-filter')).click();
            await browser.sleep(2000);
            await element.all(by.css('.k-animation-container .k-numerictextbox span .k-select span')).first().click();
            await browser.sleep(200);
            await element.all(by.css('.k-animation-container .k-numerictextbox span .k-select span')).first().click();
            await browser.sleep(200);
            await element.all(by.css('.k-animation-container .k-numerictextbox span .k-select span')).first().click();
            await browser.sleep(200);
            await element.all(by.css('.k-animation-container .k-numerictextbox span .k-select span')).first().click();
            await browser.sleep(200);
            await element.all(by.css('.k-animation-container .k-numerictextbox span .k-select span')).first().click();
            await browser.sleep(200);
            await element.all(by.cssContainingText('.k-animation-container button', 'Найти')).last().click();
            await browser.sleep(1000);
            await element(by.css('a[title="Закрыть"]')).click();
            await browser.refresh();
            await browser.sleep(2000);
            // Описание
            await element(by.css('th[data-title="Описание"] .k-grid-filter')).click();
            await browser.sleep(1000);
            await element.all(by.css('.k-animation-container input[type="text"]')).first().sendKeys('и');
            await browser.sleep(2000);
            await element.all(by.cssContainingText('.k-animation-container button', 'Найти')).last().click();
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
