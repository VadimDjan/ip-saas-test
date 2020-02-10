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

    it('3. Переходим по URL /#/service. ##can_continue', (done) => {
        // console.log('START - Go to path URL -> /#/service');

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

    it('4. В открывшейся форме списка нажимаем на кнопку Добавить запись. ##can_continue', (done) => {
        // console.log('3 START - Go to menu нажимаем на кнопку " Добавить запись"');
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

    it('5. В открывшемся окне заполняем поля (ДРП, Год, Описание) и создаем ДПГ. ##can_continue', function (done) {
        const today = '[' + $h.common.getTodayStr() + '] - ';
        const year = $h.common.getFullYear();
        return $h.form.setForm({
            displayname: today + 'Услуга',
            description: today + 'Описание услуги',
            year: year,
            branch: 'Красноярская дирекция по ремонту пути'
        })
            // .then(expliciteWait)
            .then(function () {
                return $h.form.processButton(['CREATE', 'UPDATE']);
            })
            // .then(angularWait)
            // .then(expliciteWait)

            .then(function () {
                protractor.helpers.grid.main.rowsList().count().then(function (res) { //проверить что в выпадающем списке есть значение, хотя бы 1
                    // let b = res > 1;
                    // console.log('b', b);
                    expect(res >= 1).toBe(true);
                })
            })
            .then(done);
    }, skip);

    it('6. Переходим на вкладку Наряды и убеждаемся, что в списке создался один наряд с наименованием Получение титула ремонта. ##can_continue', function (done) {
        console.log('Переходим на вкладку Наряды и убеждаемся')
        return $h.form.getForm(['tasks'])
            .then(function (form) {
                eventUid = form.uid;
                console.log('eventUid', eventUid)
                // console.log('countTask1',  element.all(by.css(' .k-grid-content [idea-field-name="tasks"]')).count())
                // console.log('countTask2',  element.all(by.css('[idea-field-name="tasks"]')).count())
                tasksBefore = form.tasks.length
                console.log('tasksBefore',tasksBefore)
                expect(tasksBefore).toBe(1);    // проверяем что создалась одна запись
            })

            // .then(function () {
            //     element.all(by.css(' .k-grid-content [idea-field-name="tasks"]')).count().then(function (res) {
            //         console.log('res00', res)
            //         // expect(element.all(by.css('[data-uid]')).count()).toBe(res);
            //     })
            // })
            .then(function () {
                element.all(by.css('[idea-field-name="tasks"]')).count().then(function (res) {
                    console.log('res11', res)
                    // expect(element.all(by.css('[data-uid]')).count()).toBe(res);
                })
            })

        // return element(by.css('.current-form h3 [editable-header-view] .editable-header__input')).getAttribute('value')

            .then(function () {
                element(by.css(' .idea-field-name="tasks"')).then(function (res) {
                // element.all(by.css('[idea-field-name="tasks"]')).element.all(by.css('[role="grid"]')).count().then(function (res) {
                    console.log('res22', res)
                    // expect(element.all(by.css('[data-uid]')).count()).toBe(res);
                })
            })

            // .then(console.log('Step 4++'))
            .then(expliciteWait)
            .then(function () {
                return $h.form.processButton(['BACK']);
            })
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('7 Выходим из системы', function (done) {
        // console.log('Step Выходим')

        return angularWait()
            .then(function () {
                browser.actions().mouseMove(element(by.css('[ng-bind=\"$ctrl.currentUser()\"]'))).perform()
                expect(element(by.css('[class="button-log-out"]')).isPresent()).toBe(true)  // Проверить что есть кнопка выйти
                element(by.css('[class="button-log-out"]')).click()
            })
            .then(expliciteWait)
            .then(function () {
                // console.log('Step Выходим 1')
                return browser.getCurrentUrl();
            })
            .then(function (url) {
                // console.log('Step Выходим 2')
                expect(url.indexOf('login') >= 0).toBe(true);      // Проверить что  #/login
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

}, !protractor.totalStatus.ok);




