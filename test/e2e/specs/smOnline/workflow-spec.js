describe('Workflow', function () {
    const $h = protractor.helpers;
    const EC = protractor.ExpectedConditions;

    const { errorCatcher } = $h.common;
    const { defaultWaitTimeout } = $h.wait;

    let workFlowId;

    function skip() {
        return !protractor.totalStatus.ok;
    }

    it('open link', async done => {
    console.log('Авторизация в системе');
    await errorCatcher(async () => {
      await browser.get('https://service-manager.online/app/#/entitytype');
      await browser.sleep(2000);
      const loginHeader = await element(by.cssContainingText('.login__header', 'Вход'));
      if (loginHeader) {
        const userName = await element(by.name('user'));
        await userName.clear();
        await browser.sleep(500);
        await userName.sendKeys('tech@ideaplatform.ru');
        await browser.sleep(500);
        await element(by.name('password')).sendKeys('Qwerty123!');
        await browser.sleep(500);
        await element(by.css('.login__fieldset button')).click();
        await browser.wait(EC.presenceOf(element(by.cssContainingText('.header-logo', 'IP Service Manager'))), defaultWaitTimeout);
        await browser.sleep(2000);
      }
      await expect(element(by.cssContainingText('.header-logo', 'IP Service Manager')));
    }, done);
  }, skip());

    it('Add workflow for order_table', async done => {
        console.log('Add workflow for order_table');
        await errorCatcher(async () => {
            await browser.get('https://service-manager.online/app/#/workflow/'); //http://localhost:8080
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Work Flow'))), defaultWaitTimeout);
            await browser.sleep(2000);

            // Для таблицы Заказ
            await element(by.className('idea-button-add-row-modal')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Work Flow'))), defaultWaitTimeout);
            await browser.sleep(2000);
            await element(by.className('displayname__name')).sendKeys('test-wf');
            await browser.sleep(2000);
            await element(by.css('.form-header__title .displayname .glyphicon-ok')).click();
            await browser.sleep(2000);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(2000);
            const wfHeader = await element(by.css('.details__modal .form-header__title span')).getText();
            await browser.sleep(2000);
            workFlowId = wfHeader.split('#')[1].replace(':', '');
            console.log(workFlowId);
            await browser.sleep(3000);
        }, done);
    }, skip());

    it('Create workflow steps for the order_table', async done => {
        console.log('Create workflow steps for the order_table');
        await errorCatcher(async () => {
            await browser.sleep(2000);
            await element(by.cssContainingText('.details__modal button', 'Редактировать workflow')).click();

            const tabs = await browser.getAllWindowHandles();
            await browser.switchTo().window(tabs[1]);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.report-toolbar__title', 'test-wf'))), defaultWaitTimeout);
            await browser.sleep(200);

            const dnd = require('html-dnd').code;
            const el = await element(by.className('workflow__state'));
            const canva = await element(by.css('.workflow__canvas svg'));

            // step 1
            console.log('шаг 1');
            await browser.executeScript(dnd, el, canva);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Шаг WorkFlow:'))), defaultWaitTimeout);
            await browser.sleep(200);
            //заполняем форму
            await element(by.css('.displayname__name')).sendKeys('Новый заказ');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('new');
            await browser.sleep(200);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(600);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.details-fade'))), defaultWaitTimeout);
            await browser.sleep(200);
            await browser.refresh();
            await browser.sleep(2000);
            // двигаем шаг
            const step_1 = await element(by.css('g[data-type="devs.Coupled"][id="j_1"]'));
            await browser.actions().dragAndDrop(step_1, { x: 180, y: 120 }).perform();
            await browser.sleep(2000);
            // сохранить форму
            await element(by.css('.report-toolbar__btn')).click();
            await browser.sleep(2000);

            // step 2
            console.log('шаг 2');
            await browser.executeScript(dnd, el, canva);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Шаг WorkFlow:'))), defaultWaitTimeout);
            await browser.sleep(200);
            // заполняем форму
            await element(by.css('.displayname__name')).sendKeys('На сборке');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('2');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('preparation');
            await browser.sleep(200);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(200);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.details-fade'))), defaultWaitTimeout);
            await browser.sleep(200);
            await browser.refresh();
            await browser.sleep(2000);
            // двигаем шаг
            const step_2 = await element(by.css('g[data-type="devs.Coupled"][id="j_2"]'));
            await browser.actions().dragAndDrop(step_2, { x: 500, y: 120 }).perform();
            await browser.sleep(2000);
            // сохранить форму
            await element(by.css('.report-toolbar__btn')).click();
            await browser.sleep(2000);

            // step 3
            console.log('шаг 3');
            await browser.executeScript(dnd, el, canva);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Шаг WorkFlow:'))), defaultWaitTimeout);
            await browser.sleep(200);
            // заполняем форму
            await element(by.css('.displayname__name')).sendKeys('В доставке');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('3');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('delivery');
            await browser.sleep(200);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(200);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.details-fade'))), defaultWaitTimeout);
            await browser.sleep(200);
            await browser.refresh();
            await browser.sleep(2000);
            // двигаем шаг
            const step_3 = await element(by.css('g[data-type="devs.Coupled"][id="j_3"]'));
            await browser.actions().dragAndDrop(step_3, { x: 900, y: 120 }).perform();
            await browser.sleep(2000);
            // сохранить форму
            await element(by.css('.report-toolbar__btn')).click();
            await browser.sleep(2000);

            // step 4
            console.log('шаг 4');
            await browser.executeScript(dnd, el, canva);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Шаг WorkFlow:'))), defaultWaitTimeout);
            await browser.sleep(200);
            // заполняем форму
            await element(by.css('.displayname__name')).sendKeys('Выполнен');
            await browser.sleep(200);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(200);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('4');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('done');
            await browser.sleep(200);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(200);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.details-fade'))), defaultWaitTimeout);
            await browser.sleep(200);
            await browser.refresh();
            await browser.sleep(2000);
            // двигаем шаг
            const step_4 = await element(by.css('g[data-type="devs.Coupled"][id="j_4"]'));
            await browser.actions().dragAndDrop(step_4, { x: 1300, y: 120 }).perform();
            await browser.sleep(2000);
            // сохранить форму
            await element(by.css('.report-toolbar__btn')).click();
            await browser.sleep(2000);

            // установка связей 1
            console.log('переход 1');
            const source1 = await element.all(by.css('g[id="j_1"] .rotatable g[class="joint-port"]')).last();
            const target1 = await element.all(by.css('g[id="j_2"] .rotatable g[class="joint-port"]')).first();
            await browser.actions().dragAndDrop(source1, target1).perform();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Переход между шагами WorkFlow'))), defaultWaitTimeout);
            await browser.sleep(200);
            // заполнение формы
            await element(by.className('displayname__name')).sendKeys('Создать заказ');
            await browser.sleep(200);
            await element.all(by.className('glyphicon-ok')).first().click();
            await browser.sleep(200);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="transitiontype"] .comboboxfield__container')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="transitiontype"] .rw-popup ul li span', 'AUTOMATIC')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('to_prepare');
            await browser.sleep(200);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(600);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.details-fade'))), defaultWaitTimeout);
            await browser.sleep(200);
            await browser.refresh();
            await browser.sleep(2000);

            // установка связей 2
            console.log('переход 2');
            const source2 = await element.all(by.css('g[id="j_2"] .rotatable g[class="joint-port"]')).last();
            const target2 = await element.all(by.css('g[id="j_3"] .rotatable g[class="joint-port"]')).first();
            await browser.actions().dragAndDrop(source2, target2).perform();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Переход между шагами WorkFlow'))), defaultWaitTimeout);
            await browser.sleep(200);
            // заполнение формы
            await element(by.className('displayname__name')).sendKeys('Отправить заказ');
            await browser.sleep(200);
            await element.all(by.className('glyphicon-ok')).first().click();
            await browser.sleep(200);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('2');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('to_delivery');
            await browser.sleep(200);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(600);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            // добавление группы доступа, настройка прав
            console.log('группа доступа');
            await element(by.cssContainingText('.accordion-panel', 'Права доступа')).click();
            await browser.sleep(2000);
            await element.all(by.css('.modal-content .idea-button-add-row-modal')).last().click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="accessobjectsn"] .comboboxfield__add-btn')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Группа Доступа'))), defaultWaitTimeout);
            await browser.sleep(2000);
            await element.all(by.css('.displayname__name')).last().sendKeys('test_access_group1');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="grouptype"]')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="grouptype"] .rw-popup ul li span', 'STATIC')).click();
            await browser.sleep(2000);
            await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
            await browser.sleep(2000);
            await element(by.cssContainingText('.accordion-panel', 'Пользователи')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('.idea-button-add-row', '+ Добавить')).click();
            await browser.sleep(2000);
            await element(by.css('table tr td input')).sendKeys('Василий Васильев');
            await browser.sleep(2000);
            await element(by.cssContainingText('.k-animation-container ul li', 'Василий Васильев')).click();
            await browser.sleep(2000);
            await element(by.css('.k-grid-update')).click();
            await browser.sleep(600);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
            await browser.sleep(2000);
            await element.all(by.css('button[data-button-name="CREATE"]')).last().click();
            await browser.sleep(2000);
            await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
            await browser.sleep(2000);
            await element.all(by.css('button[data-button-name="PROCESSANDBACK"]')).last().click();
            await browser.wait(EC.stalenessOf(element(by.css('.details-fade'))), defaultWaitTimeout);
            await browser.sleep(200);

            // установка связей 3
            console.log('переход 3');
            const source3 = await element.all(by.css('g[id="j_3"] .rotatable g[class="joint-port"]')).last();
            const target3 = await element.all(by.css('g[id="j_4"] .rotatable g[class="joint-port"]')).first();
            await browser.actions().dragAndDrop(source3, target3).perform();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title span', 'Переход между шагами WorkFlow'))), defaultWaitTimeout);
            await browser.sleep(200);
            // заполнение формы
            await element(by.className('displayname__name')).sendKeys('Завершить');
            await browser.sleep(200);
            await element.all(by.className('glyphicon-ok')).first().click();
            await browser.sleep(200);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('3');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="transitiontype"] .comboboxfield__container')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="transitiontype"] .rw-popup ul li span', 'AUTOMATIC')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('to_finish');
            await browser.sleep(200);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(600);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.wait(EC.stalenessOf(element(by.css('.details-fade'))), defaultWaitTimeout);
            await browser.sleep(200);


            await browser.switchTo().window(tabs[0]);
            await browser.sleep(2000);
            await browser.refresh();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="firststepsn"] .comboboxfield__wrapper')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="firststepsn"] .rw-popup ul li span', 'Новый заказ')).click();
            await browser.sleep(2000);
            await element.all(by.css('button[title=" Готово"]')).last().click();
            await browser.wait(EC.stalenessOf(element(by.css('.details-fade'))), defaultWaitTimeout);
            await browser.sleep(200);
            // await element(by.css('.alerts__container .alert-count')).click();
            // await browser.sleep(200);
        }, done);
    }, skip());

    it('Add workflow and create workflow steps for the order_punkt', async done => {
        console.log('Add workflow and create workflow steps for the order_punkt');
        await errorCatcher(async () => {
            await browser.get('https://service-manager.online/app/#/workflow');
            await browser.sleep(2000);

            // Для таблицы Пункт заказа
            await element.all(by.className('idea-button-add-row-modal')).first().click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Work Flow'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.className('displayname__name')).sendKeys('test-op');
            await browser.sleep(200);
            await element(by.css('.form-header__title .displayname .glyphicon-ok')).click();
            await browser.sleep(2000);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(200);
            await element(by.cssContainingText('.details__modal button', 'Редактировать workflow')).click();

            const tabs = await browser.getAllWindowHandles();
            await browser.switchTo().window(tabs[2]);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.report-toolbar__title', 'test-op'))), defaultWaitTimeout);
            await browser.sleep(200);

            const dnd = require('html-dnd').code;
            const el = await element(by.className('workflow__state'));
            const canva = await element(by.css('.workflow__canvas svg'));

            // step 1
            await browser.executeScript(dnd, el, canva);
            await browser.sleep(2000);
            //заполняем форму
            await element(by.css('.displayname__name')).sendKeys('Новый пункт заказа');
            await browser.sleep(500);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
            await browser.sleep(500);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('punkt1');
            await browser.sleep(500);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(200);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.sleep(2000);
            await browser.refresh();
            await browser.sleep(2000);
            // двигаем шаг
            const step_1 = await element(by.css('g[data-type="devs.Coupled"][id="j_1"]'));
            await browser.actions().dragAndDrop(step_1, { x: 180, y: 120 }).perform();
            await browser.sleep(2000);
            // сохранить форму
            await element(by.css('.report-toolbar__btn')).click();
            await browser.sleep(2000);

            // step 2
            await browser.executeScript(dnd, el, canva);
            await browser.sleep(2000);
            // заполняем форму
            await element(by.css('.displayname__name')).sendKeys('Пункт добавлен');
            await browser.sleep(500);
            await element(by.css('.displayname .glyphicon-ok')).click();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('2');
            await browser.sleep(500);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('punkt2');
            await browser.sleep(500);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(200);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.sleep(2000);
            await browser.refresh();
            await browser.sleep(2000);
            // двигаем шаг
            const step_2 = await element(by.css('g[data-type="devs.Coupled"][id="j_2"]'));
            await browser.actions().dragAndDrop(step_2, { x: 500, y: 120 }).perform();
            await browser.sleep(2000);
            // сохранить форму
            await element(by.css('.report-toolbar__btn')).click();
            await browser.sleep(2000);

            // установка связей 1
            const source1 = await element.all(by.css('g[id="j_1"] .rotatable g[class="joint-port"]')).last();
            const target1 = await element.all(by.css('g[id="j_2"] .rotatable g[class="joint-port"]')).first();
            await browser.actions().dragAndDrop(source1, target1).perform();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Переход между шагами WorkFlow'))), defaultWaitTimeout);
            await browser.sleep(2000);
            // заполнение формы
            await element(by.className('displayname__name')).sendKeys('Добавить в заказ');
            await browser.sleep(1000);
            await element.all(by.className('glyphicon-ok')).first().click();
            await browser.sleep(500);
            await element(by.css('div[data-field-name="sortorder"] input')).sendKeys('1');
            await browser.sleep(500);
            await element(by.css('div[data-field-name="transitiontype"] .comboboxfield__container')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="transitiontype"] .rw-popup ul li span', 'AUTOMATIC')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="internalname"] input')).sendKeys('chain1');
            await browser.sleep(2000);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(200);
            await element(by.css('.alerts__container .alert-count')).click();
            await browser.sleep(200);
            await element(by.css('button[data-button-name="PROCESSANDBACK"]')).click();
            await browser.sleep(2000);
            await browser.refresh();
            await browser.sleep(2000);

            await browser.switchTo().window(tabs[0]);
            await browser.sleep(2000);
            await browser.refresh();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="firststepsn"] .comboboxfield__wrapper')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="firststepsn"] .rw-popup ul li span', 'Новый пункт заказа')).click();
            await browser.sleep(2000);
            await element(by.css('button[title=" Готово"]')).click();
            await browser.sleep(2000);
        }, done);
    }, skip());

    it('Set workflow to the order_table', async done => {
        console.log('Set workflow to the order_table');
        await errorCatcher(async () => {
            await browser.get('https://service-manager.online/app/#/entitytype');
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Таблица'))), defaultWaitTimeout);
            await browser.sleep(2000);
            await element(by.cssContainingText('.k-pager-numbers li a', '2')).click();
            await browser.sleep(2000);
            const table = await element(by.cssContainingText('tr', 'Заказ'));
            await browser.actions().doubleClick(table).perform();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.displayname__name', 'Заказ'))), defaultWaitTimeout);
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="isworkflowon"] .checkboxfield__checkbox')).click();
            await browser.sleep(500);
            await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('.accordion-panel', 'Жизненный цикл')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="workflowcalculationtype"]')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="workflowcalculationtype"] .rw-popup ul li span', 'Вычисляемый')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="defaultworkflow"] div[role="combobox"]')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="defaultworkflow"] div[role="combobox"] .rw-popup ul li', 'test-wf')).click();
            await browser.sleep(2000);
            const code = `if (!CommonUtils.isEmpty(QueryUtils.select("address").from("order_table"))) { workflowIdOrName = ${workFlowId}; } else { workflowIdOrName = 156; }`;
            await element(by.css('div[data-field-name="workflowcalculation"] textarea')).sendKeys(code);
            await browser.sleep(2000);
            await element(by.css('button[title=" Готово"]')).click();
            await browser.sleep(2000);
        }, done);
    }, skip());

    it('Set workflow to the order_punkt', async done => {
        console.log('Привязать ЖЦ test-op к таблице order_punkt');
        await errorCatcher(async () => {
            await browser.sleep(2000);
            const table = await element(by.cssContainingText('tr', 'Пункт заказа'));
            await browser.actions().doubleClick(table).perform();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.displayname__name', 'Пункт заказа'))), defaultWaitTimeout);
            await browser.sleep(2000);

            await element(by.css('div[data-field-name="isworkflowon"] .checkboxfield__checkbox')).click();
            await browser.sleep(500);
            await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('.accordion-panel', 'Жизненный цикл')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="workflowcalculationtype"]')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="workflowcalculationtype"] .rw-popup ul li span', 'Фиксированный')).click();
            await browser.sleep(2000);
            await element(by.css('div[data-field-name="defaultworkflow"] div[role="combobox"]')).click();
            await browser.sleep(2000);
            await element(by.cssContainingText('div[data-field-name="defaultworkflow"] div[role="combobox"] .rw-popup ul li span', 'test-op')).click();
            await browser.sleep(2000);
            await element(by.css('button[title=" Готово"]')).click();
            await browser.sleep(2000);
        }, done);
    }, skip());

    // добавление записей в справочник Заказы
    it('Add row to order_table table', async done => {
        await errorCatcher(async () => {
            // 1
            await browser.get('https://service-manager.online/app/#/order_table');
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.table-name', 'Заказ'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.cssContainingText('a', 'Добавить запись')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Заказ'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element(by.css('.displayname__name')).sendKeys('Заказ 21');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="delivery_date"] input')).sendKeys('01.07.2023');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="address"] input')).sendKeys('Приморский край, г. Артём, ул. Советская, 20');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="customer"]')).click();
            await browser.sleep(2000);
            await element.all(by.css('.rw-popup-container ul li')).last().click();
            await browser.sleep(2000);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(7000);

            // заполнение сабгрида
            await element(by.cssContainingText('.accordion-panel ', 'new')).click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.subgrid-table-title', 'test_subgrid'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element.all(by.css('.idea-button-add-row-modal')).last().click();
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.form-header__title', 'Пункт заказа'))), defaultWaitTimeout);
            await browser.sleep(200);
            await element.all(by.css('.displayname__name')).last().sendKeys('з21');
            await browser.sleep(200);
            await element(by.css('div[data-field-name="spare_link"]')).click();
            await browser.sleep(2000);
            await element.all(by.css('div[data-field-name="spare_link"] .rw-popup ul li')).first().click();
            await browser.sleep(2000);
            await element(by.css('button[data-button-name="CREATE"]')).click();
            await browser.sleep(4000);
            // смотрим статусы у пункта заказа
            await element.all(by.css('.glyphicon-tasks')).last().click();
            await browser.sleep(2000);
            await element(by.css('.stepper_button')).click();
            await browser.sleep(2000);
            await element.all(by.css('.details__close-btn')).last().click();
            await browser.sleep(2000);
            // смотрим статусы у заказа
            await element(by.cssContainingText('.accordion-panel', 'Общая информация')).click();
            await browser.sleep(2000);
            await element(by.css('.glyphicon-tasks')).click();
            await browser.sleep(2000);
            await element(by.css('.stepper_button')).click();
            await browser.sleep(2000);
            // вручную меняем статус
            await element(by.css('button[data-button-name="Отправить заказ"]')).click();
            await browser.sleep(3000);
            //ещё смотрим статус у заказа
            await element(by.css('.glyphicon-tasks')).click();
            await browser.sleep(2000);
            await element(by.css('.stepper_button')).click();
            await browser.sleep(2000);

            // закрываем модальное окно
            await element(by.css('.modal-content .details__close-btn')).click();
            await browser.sleep(1500);
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
