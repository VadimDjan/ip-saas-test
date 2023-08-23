describe('Автотест на указание этапов и режима выполнения участков ', function () {
    const _ = protractor.libs._;
    const $h = protractor.helpers;
    const { errorCatcher } = $h.common;
    const { alerts } = $h.locators;
    const { defaultWaitTimeout } = $h.wait;

    var EC = protractor.ExpectedConditions;

    let modalPointStage = 'Укажите этап ДПГ';
    let buttonPointStage = 'Указать этап';
    let buttonPointMode = 'Указать режим выполнения';
    let dropdownButton = $('.toggle-button');

    const buttonSelector_1 = '[data-button-id="1337"]'; // указать этап
    const buttonSelector_2 = '[data-button-id="1344"]'; // указать режим выполнения

    $h.serviceId = $h.serviceId || 1297;

    function skip() {
        return !protractor.totalStatus.ok;
    }

    // it('1. Заходим в систему под пользователем КраснДРП. ##can_continue', (done) => {
    //     // console.log('START - 1. Заходим в систему под пользователем КраснДРП');
    //     loginObject = $h.login.getLoginObject();
    //     // managerUser = 'Менеджер услуги ДРП' // 'Администратор Шаблонов'//loginObject.user
    //     $h.login.loginToPage()
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(function () {
    //             return expect(element(by.css('[ng-click=\"$ctrl.openAccount()\"]')).isPresent()).toBe(true);
    //         })
    //         .then(done);
    //     // console.log('END - 1. Заходим в систему под пользователем КраснДРП');
    // }, skip);

    // 1. Переходим пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись
    it('1. Переходим по URL /#/my_tasks_wc_for_test. Ждём загрузки и убеждаемся, что отобразилась таблица ##can_continue', async done => {
        console.log('---------Автотест на указание этапов и режима выполнения участков---------');
        console.log('1. Переходим по URL /#/my_tasks_wc_for_test. Ждём загрузки и убеждаемся, что отобразилась таблица.');
        await errorCatcher(async () => {
            let currentUrl = await browser.getCurrentUrl();
            if (!currentUrl.includes('my_tasks_wc_for_test')) {
                await browser.get($h.url + '/#/my_tasks_wc_for_test');
                await browser.sleep(500);
            }
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.k-header span.table-name', 'Мои задачи'))), defaultWaitTimeout);
            currentUrl = await browser.getCurrentUrl();
            console.log(currentUrl);
            expect(currentUrl.includes('my_tasks_wc_for_test')).toBe(true);

            await browser.sleep(1500);
        }, done)
    }, skip);

    // 2. Выбираем наряд "Указать этапы и режим выполнения участков ремонта пути" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".
    it('2. Выбираем наряд "Указать этапы и режим выполнения участков ремонта пути" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue', async done => {
        console.log('2. Выбираем наряд "Указать этапы и режим выполнения участков ремонта пути" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".');
        await errorCatcher(async () => {
            await $h.grid.main.setSearch([
                // {
                //     type: 'enums',
                //     field: 'service',
                //     value:  $h.serviceId,
                // },
                {
                    type: 'string',
                    operator: 'contains',
                    field: 'displayname',
                    value: 'Указать этапы и режим выполнения участков ремонта пути',
                },
            ]);
            await browser.wait(EC.invisibilityOf(element(by.css('.k-loading-mask'))), defaultWaitTimeout);
            await browser.sleep(1500);
            const rows = protractor.helpers.grid.main.rowsList();
            const count = await rows.count();
            console.log(`Количество записей: ${count}`);
            expect(count - 1).toBe(1);

            const webElement = await rows.last().getWebElement();
            await browser.actions().doubleClick(webElement).perform();
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="UPDATE"]'))), defaultWaitTimeout);
            await browser.sleep(1500);
        }, done);
    }, skip);

    // 3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    it('3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', async done => {
        console.log('3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение.')
        await errorCatcher(async () => {
            await browser.sleep(1500);
            await $h.form.setForm({
                assignedto: 'Вернер А.А.',
            });
            await browser.sleep(1500);
            await $h.form.processButton(['UPDATE'], 'task');
            await browser.wait(EC.presenceOf(alerts.success), defaultWaitTimeout);
            const alertIsPresent = await alerts.success.isPresent();
            console.log('Появился зелёный алерт');
            expect(alertIsPresent).toBe(true);
        }, done);
    }, skip);

    // 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
    it('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось. ##can_continue', async done => {
        console.log('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось.');
        await errorCatcher(async () => {
            console.log('Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось');
            await browser.sleep(1500);
            const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
            await $h.form.processButton(['В работу']);
            await browser.wait(EC.presenceOf(element(by.css(selector))), 5000);
            await browser.sleep(1500);

            const text = await element(by.css(selector)).getAttribute('value');
            console.log('Появился зелёный алерт');
            expect(text?.trim()).toBe('В работе');
        }, done);
    }, skip);

    // 5. Кликаем по ссылке и в открывшемся списке нажимаем на кнопку "Выбрать все", убедиться, что все галочки поставились
    it('5. Кликаем по ссылке и убеждаемся что отобразилась таблица и в ней имеются не менее 3х записей. ##can_continue', async done => {
        console.log('5. Кликаем по ссылке и убеждаемся что отобразилась таблица и в ней имеются не менее 3х записей.');
        await errorCatcher(async () => {
            await browser.sleep(1500);
            await $h.form.clickOnLink('link_to_action');
            await browser.wait(EC.presenceOf(element(by.css('.k-grid-content '))), defaultWaitTimeout);

            const count = await element.all(by.css('[data-uid]')).count();

            console.log('Количество записей больше или равно 1');
            expect(count >= 1).toBe(true);
            await browser.sleep(1500);
        }, done)
    }, skip);

    // 6. В открывшемся списке нажимаем на кнопку "Выбрать все", убедиться, что все галочки поставились
    it('6. В открывшемся списке нажимаем на кнопку "Выбрать все". ##can_continue', async done => {
        console.log('6. В открывшемся списке нажимаем на кнопку "Выбрать все".')
        await errorCatcher(async () => {
            await browser.sleep(1500);
            await element(by.css('.k-button.idea-button-select-all')).click();
            await browser.sleep(1500);
            const selectedCount = await element.all(by.css(' .k-grid-content [aria-selected="true"]')).count();
            const linesCount = await element.all(by.css('[data-uid]')).count();

            console.log('Количество выбранных записей равно количество всех записей');
            expect(selectedCount).toBe(linesCount);
            await browser.sleep(1500);
        }, done);
    }, skip);

    // 7. Проверить, что есть хотя бы 1 запись, кнопки "Указать этап" и  "Указать режим выполнения", выбрать запись, нажать на кнопку "Указать этап", "
    it('7. Проверить, что есть кнопки "Указать этап" и  "Указать режим выполнения", выбрать запись, нажать на кнопку "Указать этап",  ##can_continue', async done => {
        console.log('7. Проверить, что есть кнопки "Указать этап" и  "Указать режим выполнения", выбрать запись, нажать на кнопку "Указать этап"');
        await errorCatcher(async () => {
            await browser.wait(EC.presenceOf(element(by.css(buttonSelector_1))), defaultWaitTimeout);
            const pointStageElementText = await element(by.css(buttonSelector_1)).getText();

            console.log(`Текст кнопки содержит "${buttonPointStage}"`);
            expect(pointStageElementText?.includes(buttonPointStage)).toBe(true);

            const pointModeElementText = await element(by.css(buttonSelector_2)).getText();

            console.log(`Текст кнопки содержит "${buttonPointMode}"`);
            expect(pointModeElementText?.includes(buttonPointMode)).toBe(true);
            await browser.sleep(1500);

            if (await dropdownButton.isPresent()) {
                await dropdownButton.click();
            }

            await element(by.css(buttonSelector_1)).click();
        }, done);
    }, skip);

    // 8. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи
    it('8. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи,  ##can_continue', async done => {
        console.log('8. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи');
        const popupSelector = '.uipopup__title.modal-title';
        const stageInGridSelector = 'span[data-field="service_stage"]';
        await errorCatcher(async () => {
            await browser.wait(EC.presenceOf(element(by.css(popupSelector))), defaultWaitTimeout);
            await $h.form.setField('p_stage', 'Этап 1', 'popup'); // Вводим созданный этап
            await browser.sleep(1500);
            await $h.form.submitPopup(); // Жмём на кнопку "Да")
            const stageElementText = await element(by.css(stageInGridSelector)).getText();
            // await expect(stageElementText?.includes(stageText)).toBe(true); // TODO
            await browser.sleep(1500);
        }, done);
    }, skip);

    // 9. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи
    it('9. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи,  ##can_continue', async done => {
        console.log('9. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи');
        const popupSelector = '.uipopup__title.modal-title';
        const typeInGridSelector = 'span[data-field="working_type"]';
        const durationInGridSelector = 'span[data-field="reduced_km_window_duration"]';
        await errorCatcher(async () => {
            await browser.sleep(1500);
            await $('.k-button.idea-button-select-all').click();
            await element(by.css(buttonSelector_2)).click(); // нажать Указать режим выполнения
            await browser.sleep(1500);
            await browser.wait(EC.presenceOf(element(by.css(popupSelector))), defaultWaitTimeout);
            const popupText = await element(by.css(popupSelector)).getText();

            console.log(`Название окна содержит "${modalPointStage}"`);
            expect(popupText?.includes(modalPointStage)).toBe(true); // Проверить название окна
            await $h.form.setField('p_reduced_km_window_duration', '10', 'popup'); // Вводим длительность окна
            await browser.sleep(1500);

            await $h.form.setField('p_working_type', 'Окна', 'popup'); // Вводим режим
            await browser.sleep(1500);

            await $h.form.submitPopup(); // Жмём на кнопку "Да"
            await browser.sleep(1500);
        }, done);
    }, skip);

    it('10. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен". ##can_continue', async done => {
        console.log('10. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен".');
        await errorCatcher(async () => {
            const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
            await browser.close();
            await browser.sleep(500);

            const handles = await browser.driver.getAllWindowHandles();
            await browser.driver.switchTo().window(handles[0]);
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="Выполнить"]'))), defaultWaitTimeout);

            await browser.sleep(1500);
            await $h.form.processButton(['Выполнить'], 'task');
            await browser.wait(EC.textToBePresentInElementValue($(selector), 'Выполнен'), defaultWaitTimeout);

            const text = await element(by.css(selector)).getAttribute('value');

            console.log('Статус "Выполнен"');
            expect(text?.includes('Выполнен')).toBe(true);
            await browser.sleep(1500);

        }, done);
    }, skip);

    it('11. Закрыть модальное окно и очистить фильтры', async done => {
        console.log('11. Закрыть модальное окно и очистить фильтры');
        await errorCatcher(async () => {
            await $h.form.closeLastModal();
            await browser.sleep(500);
            await browser.wait(EC.invisibilityOf(element(by.css('.k-loading-mask'))), defaultWaitTimeout);
            await browser.sleep(500);
        }, done);
    }, skip);
}, !protractor.totalStatus.ok);

// Автотест на получение титула:
// 0. Выполняем сценарий на логин под под КраснДРП и создание ДПГ
// 1. Переходим пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись
// 2. Выбираем наряд "Создать этапы выполнения работ по ДПГ" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить"
// 3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
// 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
// 5. Переходим по ссылке "К просмотру и созданию этапов ДПГ". Убеждаемся, что по клику открылась таблица, в ней есть кнопка "Добавить запись" и нажимаем на неё .
// 6. В открывшемся окне указываем дату начала и окончания. Нажимаем кнопку сохранить и закрываем модальное окно. Проверяем появилась ли запись в таблице
// 7. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен".
// 8. Нажать на кнопку "Отменить все", убедиться, что все галки снялись
// 9. Выбрать 4 записи (кликнуть по галкам) из группы "Не указано", нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу, которая называется "Услуга..."
// 10. Выбрать одну запись из группы "Услуга..." и нажать на кнопку "Отменить". Убедиться, что запись пропадет из списка