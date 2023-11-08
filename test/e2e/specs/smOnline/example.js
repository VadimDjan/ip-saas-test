describe('drag-and-drop', function () {
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
            await browser.get('http://localhost:8080/#/login');
            await browser.sleep(2000);
            const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
            if (loginHeader) {
                const userName = await element(by.name('user'));
                await userName.clear();
                await browser.sleep(500);
                await userName.sendKeys('alisa'); // esp9fx45@reserved.ip
                await browser.sleep(500);
                await element(by.name('password')).sendKeys('Ktnj_pf_jryjv1'); // Qwerty123!
                await browser.sleep(500);
                await element(by.css('.login__fieldset button')).click();
                await browser.sleep(2000);
            }
        }, done);
    }, skip());

    it('Добавить таблицу Запчасть', async done => {
        console.log('Добавить таблицу Запчасть');
        await errorCatcher(async () => {
            await browser.waitForAngularEnabled(false);
            await browser.get('http://localhost:8080/#/form_editor_view/4808');
            await browser.sleep(2000);

            const sidebar = await element.all(by.css('.form-designer__sidebar-group'));
            const form = await element.all(by.css('.react-grid-layout')).first();
            const dnd = require('html-dnd').code;

            // // добавить поле Цена для таблицы Запчасть
            // await sidebar[1].click();
            // await browser.sleep(2000);
            // const doubleNumber = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);
            
            // await browser.executeScript(dnd, doubleNumber, form);
            // await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
            // await browser.sleep(1000);
            // // пишем название в заголовке
            // await element(by.css('.form-header__title .glyphicon-pencil')).click();
            // await browser.sleep(2000);
            // await element(by.css('.displayname__name_active')).sendKeys('Цена (Price)');
            // await browser.sleep(200);
            // await element(by.css('.displayname .glyphicon-ok')).click();
            // await browser.sleep(200);
            // // задаем полю системное имя
            // await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('price');
            // await browser.sleep(200);
            // // check isRequired
            // await element(by.css('div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox')).click();
            // await browser.sleep(200);
            // // кн Создать поле
            // await element(by.cssContainingText('button', 'Создать поле')).click();
            // await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            // await browser.sleep(1000);
            // //check Аудит включен
            // await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
            // await browser.sleep(200);
            // await element.all(by.cssContainingText('button', 'Сохранить')).last().click();
            // await browser.sleep(2000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
            // await browser.sleep(1000);
            // // закрыть секцию бокового меню
            // await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
            // await browser.sleep(24000);
            
            // // Сохранить форму
            // await element(by.cssContainingText('button', 'Сохранить')).click();
            // await browser.sleep(2000);

            // // добавить поле Описание для таблицы Запчасть
            // await sidebar[2].click();
            // await browser.sleep(2000);
            // const description = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);
            // await browser.executeScript(dnd, description, form);
            // await browser.sleep(2000);
            // await element(by.css('.form-header__title .glyphicon-pencil')).click();
            // await browser.sleep(2000);
            // await element(by.css('.displayname__name_active')).sendKeys('Описание');
            // await browser.sleep(200);
            // await element(by.css('.displayname .glyphicon-ok')).click();
            // await browser.sleep(200);
            // // задаем полю системное имя
            // await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('descriptiontest');
            // await browser.sleep(200);
            // // change field format
            // await element(by.css('div[data-field-name="fieldformatid"] .comboboxfield__remove-btn')).click();
            // await browser.sleep(2000);
            // await element(by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')).click();
            // await browser.sleep(2000);
            // await element(by.css('.rw-popup-container .rw-input-reset')).sendKeys('Simple Rich Text Editor (Rich Text Editor)');
            // await browser.sleep(2000);
            // await element(by.cssContainingText('.rw-popup-transition ul li', 'Simple Rich Text Editor (Rich Text Editor)')).click();
            // await browser.sleep(2000);
            // // кн Создать поле
            // await element(by.cssContainingText('button', 'Создать поле')).click();
            // await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            // await browser.sleep(1000);
            // //check Аудит включен
            // await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
            // await browser.sleep(2000);
            // // save & close
            // await element.all(by.cssContainingText('button', 'Сохранить')).last().click();
            // await browser.sleep(2000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
            // await browser.sleep(1000);

            // // закрыть секцию бокового меню
            // await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
            // await browser.sleep(24000);
            // // Сохранить форму
            // await element(by.cssContainingText('button', 'Сохранить')).click();
            // await browser.sleep(2000);

            // // добавить поле Картинка для таблицы Запчасть
            // await sidebar[6].click();
            // await browser.sleep(2000);
            // const image = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(3);
            // await browser.executeScript(dnd, image, form);
            // await browser.sleep(2000);
            // // пишем название в заголовке
            // await element(by.css('.form-header__title .glyphicon-pencil')).click();
            // await browser.sleep(2000);
            // await element(by.css('.displayname__name_active')).sendKeys('Картинка');
            // await browser.sleep(200);
            // await element(by.css('.displayname .glyphicon-ok')).click();
            // await browser.sleep(200);
            // // задаем полю системное имя
            // await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('imgtest');
            // await browser.sleep(100);
            // // кн Создать поле
            // await element(by.cssContainingText('button', 'Создать поле')).click();
            // await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            // await browser.sleep(1000);
            // // close modal
            // await element(by.css('.details__close-btn')).click();
            // await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
            // await browser.sleep(1000);

            // await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
            // await browser.sleep(4000);

            // добавить поле Материал для таблицы Запчасть
            // await sidebar[4].click();
            // await browser.sleep(2000);
            // const materialList = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();
            // await browser.executeScript(dnd, materialList, form);
            // await browser.sleep(2000);
            // // пишем название в заголовке
            // await element(by.css('.form-header__title .glyphicon-pencil')).click();
            // await browser.sleep(2000);
            // await element(by.css('.displayname__name_active')).sendKeys('Материал');
            // await browser.sleep(200);
            // await element(by.css('.displayname .glyphicon-ok')).click();
            // await browser.sleep(200);
            // // задаем полю системное имя
            // await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('materialtest');
            // await browser.sleep(200);
            // // set pattern
            // await element(by.css('div[data-field-name="_$_FF/pattern"] input')).sendKeys('metal:Металл;plastic:Пластик;wood:Дерево');
            // await browser.sleep(200);
            // // кн Создать поле
            // await element(by.cssContainingText('button', 'Создать поле')).click();
            // await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            // await browser.sleep(1000);
            // // close modal
            // await element(by.css('.details__close-btn')).click();
            // await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
            // await browser.sleep(1000);

            // await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
            // await browser.sleep(4000);



            // добавить поле Дата доставки для таблицы Заказ
            // await sidebar[3].click();
            // await browser.sleep(2000);
            // const deliveryDate = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(2);
            // await browser.executeScript(dnd, deliveryDate, form);
            // await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
            // await browser.sleep(1000);
            // // пишем название в заголовке
            // await element(by.css('.form-header__title .glyphicon-pencil')).click();
            // await browser.sleep(2000);
            // await element(by.css('.displayname__name_active')).sendKeys('Дата доставки');
            // await browser.sleep(200);
            // await element(by.css('.displayname .glyphicon-ok')).click();
            // await browser.sleep(200);
            // // задаем полю системное имя
            // await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('delivery_date');
            // await browser.sleep(200);
            // // кн Создать поле
            // await element(by.cssContainingText('button', 'Создать поле')).click();
            // await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            // await browser.sleep(1000);
            // //check Аудит включен
            // await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
            // await browser.sleep(200);
            // // save & close
            // await element.all(by.cssContainingText('button', 'Сохранить')).last().click();
            // await browser.sleep(2000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
            // await browser.sleep(1000);
            
            // await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
            // await browser.sleep(4000);

            // добавить поле Адрес доставки для таблицы Заказ
            // await sidebar[2].click();
            // await browser.sleep(2000);
            // const address = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();
            // await browser.executeScript(dnd, address, form);
            // await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
            // await browser.sleep(1000);
            // // пишем название в заголовке
            // await element(by.css('.form-header__title .glyphicon-pencil')).click();
            // await browser.sleep(2000);
            // await element(by.css('.displayname__name_active')).sendKeys('Адрес доставки');
            // await browser.sleep(200);
            // await element(by.css('.displayname .glyphicon-ok')).click();
            // await browser.sleep(200);
            // // задаем полю системное имя
            // await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('address');
            // await browser.sleep(200);
            // // check isRequired
            // await element(by.css('div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox')).click();
            // await browser.sleep(200);
            // // кн Создать поле
            // await element(by.cssContainingText('button', 'Создать поле')).click();
            // await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            // await browser.sleep(1000);
            // //check Аудит включен
            // await element(by.css('div[data-detail="entityfield"] div[data-field-name="isauditon"] .checkboxfield__checkbox')).click();
            // await browser.sleep(200);
            // // save & close
            // await element.all(by.cssContainingText('button', 'Сохранить')).last().click();
            // await browser.sleep(2000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
            // await browser.sleep(1000);

            // await element(by.css('.details__close-btn')).click();
            // await browser.sleep(4000);
            // await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
            // await browser.sleep(4000);

            // добавить поле Заказчик для таблицы Заказ
            // const customer = await element.all(by.css('.form-designer__control-wrapper')).first();
            // await browser.executeScript(dnd, customer, form);
            // await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Поле'))), defaultWaitTimeout);
            // await browser.sleep(1000);
            // // пишем название в заголовке
            // await element(by.css('.displayname__name_active')).sendKeys('Заказчик');
            // await browser.sleep(200);
            // await element(by.css('.displayname .glyphicon-ok')).click();
            // await browser.sleep(200);
            // // задаем полю системное имя
            // await element(by.css('div[data-field-name="fieldname"] input')).sendKeys('customer');
            // await browser.sleep(200);
            // // выбор Формат поля
            // await element(by.css('div[data-field-name="fieldformatid"] .rw-dropdown-list-input')).click();
            // await browser.sleep(2000);
            // await element(by.css('.rw-popup-container .rw-input-reset')).sendKeys('Пользователь (User)');
            // await browser.sleep(4000);
            // await element(by.cssContainingText('.rw-popup-transition ul li', 'Пользователь (User)')).click();
            // await browser.sleep(2000);
            // // check isRequired
            // await element(by.css('div[data-detail="entityfield"] div[data-field-name="isrequired"] .checkboxfield__checkbox')).click();
            // await browser.sleep(200);
            // // кн Создать поле
            // await element(by.cssContainingText('button', 'Создать поле')).click();
            // await browser.wait(EC.stalenessOf($('[data-button-name="CREATE"] .loader-spinner')), defaultWaitTimeout);
            // await browser.sleep(1000);
            // // close
            // await element(by.css('.details__close-btn')).click();
            // await browser.wait(EC.stalenessOf($('.details-fade')), defaultWaitTimeout);
            // await browser.sleep(1000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.sleep(4000);



            // // добавить поле Заказ для таблицы Пункт Заказа
            // const order = await element.all(by.css('.form-designer__control-wrapper')).first();

            // await browser.executeScript(dnd, order, form);
            // await browser.sleep(2000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.sleep(4000);

            // // добавить поле Запчасть для таблицы Пункт Заказа
            // const spare = await element.all(by.css('.form-designer__control-wrapper')).first();

            // await browser.executeScript(dnd, spare, form);
            // await browser.sleep(2000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.sleep(4000);

            // // добавить поле Количество для таблицы Пункт Заказа
            // await sidebar[1].click();
            // await browser.sleep(2000);
            // const quantity = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();

            // await browser.executeScript(dnd, quantity, form);
            // await browser.sleep(2000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.sleep(4000);
            // await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
            // await browser.sleep(4000);

            // // добавить поле Цена для таблицы Пункт Заказа
            // await sidebar[8].click();
            // await browser.sleep(2000);
            // const price = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).first();

            // await browser.executeScript(dnd, price, form);
            // await browser.sleep(2000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.sleep(4000);
            // await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
            // await browser.sleep(4000);

            // // добавить поле Стоимость для таблицы Пункт Заказа
            // await sidebar[8].click();
            // await browser.sleep(2000);
            // const summtest = await element.all(by.css('.form-designer__sidebar-group[open] .form-designer__control-wrapper')).get(1);

            // await browser.executeScript(dnd, summtest, form);
            // await browser.sleep(2000);
            // await element(by.css('.details__close-btn')).click();
            // await browser.sleep(4000);
            // await element.all(by.css('.form-designer__sidebar-group[open] summary')).click();
            // await browser.sleep(4000);
        }, done);
    }, skip());
});
