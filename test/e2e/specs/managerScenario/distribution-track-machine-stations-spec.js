describe('Автотест распределение по ПМС.', function () {
    const _ = protractor.libs._;
    const $h = protractor.helpers;
    const { errorCatcher } = $h.common;
    const { alerts } = $h.locators;
    const { defaultWaitTimeout } = $h.wait;
    const EC = protractor.ExpectedConditions;

    const modalPointPMS = 'Укажите ПМС';

    let linesNumber;

    function skip() {
        return !protractor.totalStatus.ok;
    }

    it('1. Переходим по URL /#/my_tasks_wc_for_test. Ждём загрузки и убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись.  ##can_continue', async done => {
        console.log('---------Автотест распределение по ПМС---------');
        console.log('1. Переходим по URL /#/my_tasks_wc_for_test. Ждём загрузки и убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись.');
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

    it('2. Выбираем наряд "Распределить участки ремонта пути по ПМС" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue', async done => {
        console.log('2. Выбираем наряд "Распределить участки ремонта пути по ПМС" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".');
        await errorCatcher(async () => {
            await $h.grid.main.setSearch([
                {
                    type: 'string',
                    operator: 'contains',
                    field: 'displayname',
                    value: 'Распределить участки ремонта пути по ПМС',
                },
            ]);
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
        console.log('3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение.');
        await errorCatcher(async () => {
            await browser.sleep(1500);
            await $h.form.setForm({
                assignedto: 'Вернер А.А.',
            });
            await browser.sleep(1500);
            await $h.form.processButton(['UPDATE'], 'task');
            await browser.wait(EC.presenceOf(alerts.success), defaultWaitTimeout);
            const alertIsPresent = await alerts.success.isPresent();
            expect(alertIsPresent).toBe(true);
        }, done)
    }, skip);

    // 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
    it('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось. ##can_continue', async done => {
        console.log('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось. ');
        await errorCatcher(async () => {
            await browser.sleep(1500);
            const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
            await $h.form.processButton(['В работу']);
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="Выполнить"]'))), defaultWaitTimeout);
            await browser.sleep(1500);

            const text = await element(by.css(selector)).getAttribute('value');
            expect(text?.trim()).toBe('В работе');
        }, done)
    }, skip);

    // 5. Переходим по ссылке "Перейти к ДПГ". Убеждаемся, что по клику открылась таблица, в ней есть кнопка "Добавить запись" и нажимаем на неё .
    it('5. Переходим по ссылке "Перейти к ДПГ". Убеждаемся, что по клику открылась таблица, в ней есть кнопка "+Добавить" и нажимаем на неё . ##can_continue', async done => {
        console.log('5. Переходим по ссылке "Перейти к ДПГ". Убеждаемся, что по клику открылась таблица, в ней есть кнопка "+Добавить" и нажимаем на неё.');
        await errorCatcher(async () => {
            await browser.sleep(1500);
            await $h.form.clickOnLink('link_to_action');
            await browser.wait(EC.presenceOf(element(by.css('a[class="toolbar-buttons k-button idea-button-add-row"]'))), defaultWaitTimeout);

            const linesCount = await $h.grid.main.rowsList().count();
            expect(linesCount >= 1).toBe(true);
            if (linesCount >=1) {
                linesNumber = linesCount;
                expect(await element(by.css('[data-button-id="1187"]')).getText()).toBe('Назначить ПМС');   // Проверить что есть кнопка Назначить ПМС
                expect(await element(by.css('[data-button-id="1370"]')).getText()).toBe('Отменить участки');   // Проверить что есть кнопка Отменить
            }

        }, done)
    }, skip);

    // 6. Выбрать 2 запись из группы "Не указано", нажать на кнопку "Назначить ПМС"
    it('6. Выбрать всё записи из группы "Не указано", нажать на кнопку "Назначить ПМС". ##can_continue', async done => {
        console.log('6. Выбрать всё записи из группы "Не указано", нажать на кнопку "Назначить ПМС".')
        await errorCatcher(async () => {
            await element(by.css('.k-button.idea-button-select-all')).click();
            await browser.sleep(1500);
            await element(by.css('[data-button-id="1187"]')).click();   // нажать Назначить ПМС
            await browser.sleep(1500);
        }, done);
    }, skip);

        // 7. В открывшемся окне убедится что есть поле "ПМС", кнопки "ОК" и "Отмена" выбрать ПМС-181 из выпадающего списка, нажать "Ок"
     it('7. В открывшемся окне убедится что есть поле "ПМС", кнопки "ОК" и "Отмена" выбрать ПМС-197 из выпадающего списка, нажать "Ок". ##can_continue', async done => {
         console.log('7. В открывшемся окне убедится что есть поле "ПМС", кнопки "ОК" и "Отмена" выбрать ПМС-197 из выпадающего списка, нажать "Ок".')
         const popupTitleSelector = '.uipopup__title.modal-title';
         const popupSelector = '.uipopup__modal .modal-content';
         await errorCatcher(async () => {
             await browser.wait(EC.presenceOf(element(by.css(popupSelector))), defaultWaitTimeout);
             await browser.sleep(1500);
             console.log('Проверяем название окна');
             expect(await element(by.css(popupTitleSelector)).getText()).toBe(modalPointPMS); // Проверить название окна
             console.log('Проверяем что есть поле ПМС');
             expect(await element(by.css(popupSelector + ' [data-field-name="p_dept"]')).isPresent()).toBe(true) // Проверить что есть поле ПМС
             console.log('Проверяем что есть кнопка "Отмена"');
             expect(await element(by.css(popupSelector + ' .popup__dialog-btn_secondary')).isPresent()).toBe(true)     // Проверить что есть кнопка "Отмена"
             await $h.form.setField('p_dept', 'ПМС-197', 'popup');
             await browser.sleep(1500);
             await $h.form.submitPopup();
             await browser.sleep(5000);
         }, done);
    }, skip);

    it('8. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен". ##can_continue', async done => {
        console.log('8. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен". ');
        await errorCatcher(async () => {
            const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
            const locator = element(by.css(selector));

            await browser.driver.close();
            const handles = await browser.driver.getAllWindowHandles();
            await browser.driver.switchTo().window(handles[0]);
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="Выполнить"]'))), defaultWaitTimeout);

            await browser.sleep(1500);
            await $h.form.processButton(['Выполнить'], 'task');
            await browser.wait(EC.textToBePresentInElementValue(locator, 'Выполнен'), defaultWaitTimeout);

            const text = await locator.getAttribute('value');
            expect(text?.includes('Выполнен')).toBe(true);
            await browser.sleep(1500);

        }, done);
    }, skip);

    it('9. Закрыть модальное окно и очистить фильтры', async done => {
        console.log('9. Закрыть модальное окно и очистить фильтры');
        await errorCatcher(async () => {
            await $h.form.closeLastModal();
            await browser.sleep(500);
            await browser.wait(EC.invisibilityOf(element(by.css('.k-loading-mask'))), defaultWaitTimeout);
            await browser.sleep(500);
        }, done);
    }, skip);
}, !protractor.totalStatus.ok);


// Автотест распределение по ПМС:
// 0) Выполняем сценарий на создание ДПГ и получения Титула
// 1. Переходим в пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
// 2. Выбираем наряд «Распределение участков КРП по ПМС». Убеждаемся, что запись открылась,поля и кнопка "Сохранить", "Назад".
// 3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
// 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
// 5. Переходим по ссылке "Перейти к ДПГ ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 1 записи и кнопки "Добавить запись", "Назначить ПМС"
// 6. Выбрать 2 запись из группы "Не указано", нажать на кнопку "Назначить ПМС"
// 7. В открывшемся окне убедится, что есть поле "ПМС", кнопки "ОК" и "Отмена" выбрать ПМС-181 из выпадающего списка, нажать "Ок"
// 8. Выбрать 2 записи из списка уже назначенных на ПМС-181 и переназначить на ПМС-197. Оставить один участок без ПМС, в группе "не указано"
// 9. Вернуться к задаче и нажать "Выполнить". Убедиться, что система показала ошибку (не все участки распределены по ПМС, красное сообщение в правом верхнем углу).
// 10. Переходим по ссылке "Перейти к ДПГ ". Назначить последний участок из группы "не указано" на последний ПМС из выпадающего списка
// 11) Перейти в Мои наряды. Выбираем наряд "Распределить участки КРП по ПМС" и открываем его. Убеждаемся, что запись открылась, в ней есть поля и кнопка "Сохранить", "Назад" и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось. Нажать кнопку "Назад"
// 12) Выйти из системы (Проверить что есть кнопка "Выйти", после выхода проверить URL  #/login
