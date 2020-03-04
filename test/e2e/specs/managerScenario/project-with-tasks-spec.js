describe('Автотест на создание ДПГ. ', function () {
    var _ = protractor.libs._;
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    var loginObject = {};
    var tasksBefore = 0,
        tasksToAdd = 0;
    var eventStart = null,
        eventEnd = null,
        eventUid = null;

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
    it('1. Переходим по URL /#/service. ##can_continue', (done) => {
        console.log('Автотест на создание ДПГ.  START - Go to path URL -> /#/service');
        return angularWait()
            .then(function () {
                browser.get(protractor.helpers.url + '/#/service')
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                browser.getCurrentUrl().then(function (url) {
                    let s = url.substring(url.indexOf('#') + 1);
                    expect(s === '/service').toBe(true);
                });
            })
            .then(angularWait)
            .then(function () {
                protractor.helpers.grid.main.rowsList().count().then(function (res) { //Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
                    let b = res > 0;
                    expect(b).toBe(true);
                })
            })
            .then(function () {
                expect(element(by.css('[class="k-button idea-button-add-row"]')).getText()).toBe('Добавить запись');    // Проверить что есть кнопка Добавить запись
            })
            .then(done);
    }, skip);

    // 2. В открывшейся форме списка нажимаем на кнопку "Добавить запись". Проверить, что есть кнопка "Создать" и доступны для редактирования поля "display", "Год", "ДРП"
    it('2. В открывшейся форме списка нажимаем на кнопку "Добавить запись". Проверить, что есть кнопка "Создать" и доступны для редактирования поля "display", "Год", "ДРП". ##can_continue', (done) => {
        return element(by.css('[class="k-button idea-button-add-row"]')).click()
            .then(angularWait)
            .then(expliciteWait)
            .then(() => expect(element(by.id('singleHeader')).element(by.css('[contenteditable="true"]')).isPresent()).toBe(true))  // Проверить что display доступен для редактирования
            .then(() => expect(element(by.css('[data-input-name="year"]')).isEnabled()).toBe(true))  // Проверить что Год доступен для редактирования
            .then(() => expect(element(by.css('[data-input-name="branch"]')).isEnabled()).toBe(true))  // Проверить что ДРП доступен для редактирования
            .then(() => expect(element(by.css('[data-button-name="CREATE"]')).isPresent()).toBe(true))  //Прооверить что есть кнопка создать
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 3. В открывшемся окне заполняем поля (ДРП, Год, Описание) и создаем ДПГ.
    it('3. В открывшемся окне заполняем поля (ДРП, Год, Описание) и создаем ДПГ. ##can_continue', function (done) {
        const today = '[' + $h.common.getTodayStr() + '] - ';
        const year = $h.common.getFullYear();
        return $h.form.setForm({
            displayname: today + 'Услуга',
            description: today + 'Описание услуги',
            year: year,
            branch: 'Красноярская дирекция по ремонту пути'
        })
            .then(function () {
                return $h.form.processButton(['CREATE', 'UPDATE']);
            })
            // .then(function () {
            //     protractor.helpers.grid.main.rowsList().count().then(function (res) { //проверить что в выпадающем списке есть значение, хотя бы 1
            //         expect(res >= 1).toBe(true);
            //     })
            // })
            .then(function () {
                element(by.css('[class="editable-header__pk-value  ng-binding"]')).getText().then(function (text) {     // Сохранить ID servicce
                    protractor.helpers.serviceId = Number(text);
                })
            })

            .then(done);
    }, skip);

    // 4. Переходим на вкладку Наряды и убеждаемся, что в списке создался один наряд с наименованием Получение титула ремонта.
    it('4. Переходим на вкладку Наряды и убеждаемся, что в списке создался один наряд с наименованием Получение титула ремонта. ##can_continue', function (done) {
        return $h.form.getForm(['tasks'])
            .then(function (form) {
                eventUid = form.uid;
                tasksBefore = form.tasks.length
                protractor.helpers.taksUid = Number(form.tasks[0].taskid)
                expect(tasksBefore).toBe(1);    // проверяем что создалась одна запись
            })
            .then(expliciteWait)
            .then(function () {
                return $h.form.processButton(['BACK']);
            })
            .then(expliciteWait)
            .then(done);
    }, skip);

    // it('5 Выйти из системы (Проверить что есть кнопка "Выйти", после выхода проверить URL  #/login', function (done) {
    //     // console.log('Step Выходим')
    //
    //     return angularWait()
    //         .then(function () {
    //             browser.actions().mouseMove(element(by.css('[ng-bind=\"$ctrl.currentUser()\"]'))).perform()
    //             expect(element(by.css('[class="button-log-out"]')).isPresent()).toBe(true)  // Проверить что есть кнопка выйти
    //             element(by.css('[class="button-log-out"]')).click()
    //         })
    //         .then(expliciteWait)
    //         .then(function () {
    //             // console.log('Step Выходим 1')
    //             return browser.getCurrentUrl();
    //         })
    //         .then(function (url) {
    //             // console.log('Step Выходим 2')
    //             expect(url.indexOf('login') >= 0).toBe(true);      // Проверить что  #/login
    //         })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(done);
    // }, skip);

}, !protractor.totalStatus.ok);


// Автотест на создание ДПГ
// 0. Выполняем сценарий по логин под КраснДРП
// 1. Переходим по URL /#/service. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача, кнопка Добавить запись, доступны для редактирования поля "display", "Год", "ДРП", "Создать"
// 2. В открывшейся форме списка нажимаем на кнопку "Добавить запись". Проверить, что есть кнопка "Создать" и доступны для редактирования поля "display", "Год", "ДРП"
// 3. В открывшемся окне заполняем поля (ДРП, Год, Описание) и создаем ДПГ.
// 4. Переходим на вкладку Наряды и убеждаемся, что в списке создался один наряд с наименованием Получение титула ремонта.
