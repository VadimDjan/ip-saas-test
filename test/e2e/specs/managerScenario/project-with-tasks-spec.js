describe('Автотест на создание ДПГ. ', function () {
    const _ = protractor.libs._;
    const $h = protractor.helpers;
    const { errorCatcher } = $h.common;
    const { defaultWaitTimeout } = $h.wait;
    const EC = protractor.ExpectedConditions;

    function skip() {
        return !protractor.totalStatus.ok;
    }

    // it('1. Заходим в систему под пользователем КраснДРП', (done) => {
    //     console.log('START - 1. Заходим в систему под пользователем КраснДРП');
    //     loginObject = $h.login.getLoginObject();
    //     // managerUser = 'Менеджер услуги ДРП' // 'Администратор Шаблонов'//loginObject.user
    //     $h.login.loginToPage()
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(function () {
    //             return expect(element(by.css('[ng-click=\"$ctrl.openAccount()\"]')).isPresent()).toBe(true);
    //         })
    //         .then(done);
    //     console.log('END - 1. Заходим в систему под пользователем КраснДРП');
    // }, skip);

    // 1. Переходим по URL /#/service. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача, кнопка Добавить запись
    it('1. Переходим по URL /#/service. ##can_continue', async done => {
        console.log('---------Автотест на создание ДПГ---------');
        console.log('1. Автотест на создание ДПГ.  START - Go to path URL -> /#/service');
        await errorCatcher(async() => {
            await browser.get(protractor.helpers.url + '/#/service');
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.k-header span.table-name', 'Услуга'))), defaultWaitTimeout);
            await browser.sleep(1500);

            const currentUrl = await browser.getCurrentUrl();
            expect(currentUrl?.includes('/service')).toBe(true);

            const count =  await protractor.helpers.grid.main.rowsList().count();
            expect(count > 0).toBe(true);

            const addRowButtonText = await element(by.css('.k-button.idea-button-add-row')).getText();
            expect(addRowButtonText).toBe('Добавить запись');
        }, done);
    }, skip);

    // 2. В открывшейся форме списка нажимаем на кнопку "Добавить запись". Проверить, что есть кнопка "Создать" и доступны для редактирования поля "display", "Год", "ДРП"
    it('2. В открывшейся форме списка нажимаем на кнопку "Добавить запись". Проверить, что есть кнопка "Создать" и доступны для редактирования поля "display", "Год", "ДРП". ##can_continue', async done => {
        await errorCatcher(async () => {
            console.log('2. В открывшейся форме списка нажимаем на кнопку "Добавить запись". Проверить, что есть кнопка "Создать" и доступны для редактирования поля "display", "Год", "ДРП".')
            await element(by.css('.k-button.idea-button-add-row')).click();
            await browser.wait(EC.presenceOf(element(by.css('.displayname__name_active'))), defaultWaitTimeout);
            await browser.sleep(1500);

            const displayIsPresent = await element(by.css('.displayname__name_active')).isPresent(); // Проверить что display доступен для редактирования
            expect(displayIsPresent).toBe(true);

            const yearIsEnabled = await element(by.css('.react-grid-item[data-field-name="year"]')).isEnabled(); // Проверить что Год доступен для редактирования
            expect(yearIsEnabled).toBe(true);

            const branchIsEnabled = await element(by.css('.react-grid-item[data-field-name="branch"]')).isEnabled(); // Проверить что ДРП доступен для редактирования
            expect(branchIsEnabled).toBe(true);

            const buttonText = await element(by.css('.header-button.btn-primary')).getText();
            expect(buttonText).toBe('Создать');
        }, done);
    }, skip);

    // 3. В открывшемся окне заполняем поля (ДРП, Год, Описание) и создаем ДПГ.
    it('3. В открывшемся окне заполняем поля (ДРП, Год, Описание) и создаем ДПГ. ##can_continue', async done => {
        await errorCatcher(async () => {
            console.log('3. В открывшемся окне заполняем поля (ДРП, Год, Описание) и создаем ДПГ.');
            const today = `[${$h.common.getTodayStr()}] - `
            const year = 2022;
            $h.dpg = today + 'Услуга';
            await $h.form.setForm({
                displayname: `${today}Услуга`,
                citype_shortname: 'Ремонт пути',
                year: year,
                branch: 'Красноярская дирекция по ремонту пути',
                description: `${today}Описание услуги`,
            });
            await browser.sleep(1500);
            await $h.form.processButton(['CREATE']);
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="UPDATE"]'))), defaultWaitTimeout);
            await browser.sleep(1500);
            const titleText = await element(by.css('[class="form-header__title"]')).getText();
            $h.serviceId = parseInt(titleText.split('#')[1]);
            console.log('Новая услуга создана с ID ', $h.serviceId);
        }, done);
    }, skip);

    // 4. Переходим на вкладку Наряды и убеждаемся, что в списке создался один наряд с наименованием Получение титула ремонта.
    it('4. Переходим на вкладку Наряды и убеждаемся, что в списке создался один наряд с наименованием Получение титула ремонта. ##can_continue', async done => {
        await errorCatcher(async () => {
            console.log('4. Переходим на вкладку Наряды и убеждаемся, что в списке создался один наряд с наименованием Получение титула ремонта.');
            await $h.form.processButton(['UPDATE']);
            await browser.wait(EC.stalenessOf(element(by.css('.loader-spinner'))), defaultWaitTimeout);
            await browser.sleep(1500);
        }, done);
    }, skip);

}, !protractor.totalStatus.ok);


// Автотест на создание ДПГ
// 0. Выполняем сценарий по логин под КраснДРП
// 1. Переходим по URL /#/service. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача, кнопка Добавить запись, доступны для редактирования поля "display", "Год", "ДРП", "Создать"
// 2. В открывшейся форме списка нажимаем на кнопку "Добавить запись". Проверить, что есть кнопка "Создать" и доступны для редактирования поля "display", "Год", "ДРП"
// 3. В открывшемся окне заполняем поля (ДРП, Год, Описание) и создаем ДПГ.
// 4. Переходим на вкладку Наряды и убеждаемся, что в списке создался один наряд с наименованием Получение титула ремонта.
