describe('Автотест на Осмотр участка. ', function () {
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

    let taksUid = 38596;

    function skip() {
        return !protractor.totalStatus.ok;
    }

    // 1) Заходим под ПМС197_Менеджер
    it('1. Заходим под ПМС197_Менеджер. ##can_continue', (done) => {
        // console.log('START - 1. Заходим в систему под пользователем КраснДРП');
        loginObject = $h.login.getLoginObject();
        $h.login.loginToPage(null, loginObject.users[0].user, loginObject.users[0].password)
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return expect(element(by.css('[ng-click=\"$ctrl.openAccount()\"]')).isPresent()).toBe(true);
            })
            .then(done);
    }, skip);

    it('2. Переходим по ссылке /#/my_tasks_wc ("Мои задачи"). Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача.  ##can_continue', (done) => {
        console.log('Автотест на получение Титула. Переходим по ссылке /#/my_tasks_wc.');
        browser.get(protractor.helpers.url + '/#/my_tasks_wc')
            .then(angularWait)
            .then(expliciteWait)

        browser.getCurrentUrl().then(function (url) {       // проверяем URL
            expect(url.substring(url.indexOf('#') + 1)).toBe('/my_tasks_wc');
        });

        return angularWait()
            .then(function () {
                protractor.helpers.grid.main.rowsList().count().then(function (res) { //Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
                    // console.log('res', res);
                    expect(res >= 1).toBe(true);
                })
            })
            .then(done);
    }, skip);

    // 3) Выбираем наряд «Осмотр участка». Убеждаемся, что запись открылась, текущий стутус "запланирован", поле "Исполнитель" доступен для заполнения, есть кнопка "Сохранить" и "Назад".
    it('3. Выбираем наряд "Осмотр участка" и открываем его. Убеждаемся, что запись открылась, текущий стутус "запланирован", поле "Исполнитель" доступен для заполнения, есть кнопка "Сохранить" и "Назад".  ##can_continue', function (done) {
        return $h.grid.main.setSearch([
            {
                type: 'string',
                operator: 'contains',
                field: 'displayname',
                value: 'Осмотр участка'
            },
            {
                type: 'int',
                operator: 'eq',
                field: 'taskid',
                // value: Number(protractor.helpers.taksUid + 2)
                value: taksUid
            }
        ])
            .then(function () {
                return element.all(by.css('[data-pkfieldid=\"' + String(taksUid) + '\"]')).first().getWebElement()
                // return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid + 1) + '\"]')).first().getWebElement()
                    .then(function (event) {
                        browser.actions().doubleClick(event).perform();
                        return browser.waitForAngular();
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function (res) {
                // console.log("Проверка кнопок")
                expect(element(by.css('[data-button-name="UPDATE"]')).isPresent()).toBe(true);   // Проверить что есть кнопка Сохранить
                expect(element(by.css('[data-button-name="BACK"]')).isPresent()).toBe(true);   // Проверить что есть кнопка Назад
                expect(element(by.css('[data-input-name="assignedto"]')).isEnabled()).toBe(true)    // Проверить Исполнитель доступен для заподнения
            })
            .then(function () {
                return $h.form.getForm(['workflowstepid']);
            })
            .then(function (form) {
                expect(form.workflowstepid.displayValue).toBe('Запланирован');  // Проверить Стутус
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 4)  В наряде указываем исполнителя (Волков С.А.) и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    it('4.  В наряде указываем исполнителя (Волков С.А.) и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', function (done) {
        return $h.form.setForm({
            // assignedto: 'Волков С.А.'
        })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                // return $h.form.processButton(['CREATE', 'UPDATE']);
                return $h.form.processButton(['UPDATE']);   //жмем на кнопку Сохранить
            })
            .then(function () {
                expect(element(by.css('[class="ui-notification alert ng-scope alert-success killed"]')).isPresent()).toBe(true)  // Справа наверху возникло зеленое сообщение
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 5) Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
    it('5. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось. ##can_continue', function (done) {
        return $h.form.processButton(['В работу'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['workflowstepid']);
            })
            .then(function (form) {
                // console.log('form   ****', form)
                // console.log('form.workflowstepid.displayValue   *******', form.workflowstepid.displayValue)
                expect(form.workflowstepid.displayValue).toBe('Запланирован');
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 6) Переходим по ссылке "Заполнить данные по осмотру участка". // Убеждаемся, что в открывшемся окне имеются поля: "Тип Рельс", "Тип шпал", "Скрепления"
    // и кнопки "Расчет МВСП", "Сохранить", "Назад", "Получить шаблон осмотра"

    // 5) Переходим по ссылке "Перейти к ДПГ ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 2 записи и кнопки "Добавить запись", "Назначить ПМС"
    it('6. Переходим по ссылке "Заполнить данные по осмотру участка". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 1 запись и кнопки "Добавить запись", "Назначить ПМС". ##can_continue', function (done) {
        return element(by.css('[class="glyphicon glyphicon-road"]')).click()
            .then(angularWait)
            .then(expliciteWait)
            // .then(function () {
            //     protractor.helpers.grid.main.rowsList().count().then(function (res) { //Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
            //         // console.log('res', res);
            //         linesNumber = res;
            //         expect(res >= 1).toBe(true);
            //     })
            // })
            // .then(angularWait)
            // .then(expliciteWait)
            // .then(function () {
            //     expect(element(by.css('[class="k-button idea-button-add-row"]')).getText()).toBe('Добавить запись');   // Проверить что есть кнопка Добавить запись
            // })
            .then(function () {
                expect(element(by.css('[data-button-name="calc_mvsp"]')).getText()).toBe('Расчет МВСП');   // Проверить что есть кнопка "Расчет МВСП"
                expect(element(by.css('[data-button-name="UPDATE"]')).getText()).toBe('Сохранить');   // Проверить что есть кнопка "Сохранить"
                expect(element(by.css('[data-button-name="BACK"]')).getText()).toBe('Назад');   // Проверить что есть кнопка "Назад"
                expect(element(by.css('[data-button-name="get_inspecting_templ"]')).getText()).toBe('Получить шаблон осмотра');   // Проверить что есть кнопка "Получить шаблон осмотра"
            })
            // .then(function () {
            //     expect(element(by.css('[idea-field-name="rail_brand_br"]')).getText()).toBe('Расчет МВСП');   // Проверить что есть кнопка "Расчет МВСП"
            //     expect(element(by.css('[data-button-name="UPDATE"]')).getText()).toBe('Сохранить');   // Проверить что есть кнопка "Сохранить"
            //     expect(element(by.css('[data-button-name="BACK"]')).getText()).toBe('Назад');   // Проверить что есть кнопка "Назад"
            //     expect(element(by.css('[data-button-name="get_inspecting_templ"]')).getText()).toBe('Получить шаблон осмотра');   // Проверить что есть кнопка "Получить шаблон осмотра"
            // })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

// (выбирать нужно из группы "Назначить исполнителя", №_id = (№_id_по_распроеделению_ПМС + 1).

    // it('3. Переходим по URL /#/service. ##can_continue', (done) => {
    //     console.log('START - Go to path URL -> /#/service');
    //
    //     return angularWait()
    //         .then(function () {
    //             browser.get(protractor.helpers.url + '/#/service')
    //         })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(function () {
    //             browser.getCurrentUrl().then(function (url) {
    //                 let s = url.substring(url.indexOf('#') + 1);
    //                 expect(s === '/service').toBe(true);
    //             });
    //         })
    //         .then(angularWait)
    //         .then(function () {
    //             protractor.helpers.grid.main.rowsList().count().then(function (res) { //Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
    //                 let b = res > 0;
    //                 expect(b).toBe(true);
    //             })
    //         })
    //         .then(function () {
    //             expect(element(by.css('[class="k-button idea-button-add-row"]')).getText()).toBe('Добавить запись');    // Проверить что есть кнопка Добавить запись
    //         })
    //         .then(done);
    // }, skip);
    //
    // it('4. В открывшейся форме списка нажимаем на кнопку Добавить запись. ##can_continue', (done) => {
    //     // console.log('3 START - Go to menu нажимаем на кнопку " Добавить запись"');
    //     return element(by.css('[class="k-button idea-button-add-row"]')).click()
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(() => expect(element(by.id('singleHeader')).element(by.css('[contenteditable="true"]')).isPresent()).toBe(true))  // Проверить что display доступен для редактирования
    //         .then(() => expect(element(by.css('[data-input-name="year"]')).isEnabled()).toBe(true))  // Проверить что Год доступен для редактирования
    //         .then(() => expect(element(by.css('[data-input-name="branch"]')).isEnabled()).toBe(true))  // Проверить что ДРП доступен для редактирования
    //         .then(() => expect(element(by.css('[data-button-name="CREATE"]')).isPresent()).toBe(true))  //Прооверить что есть кнопка создать
    //         .then(expliciteWait)
    //         .then(done);
    // }, skip);
    //
    // it('5. В открывшемся окне заполняем поля (ДРП, Год, Описание) и создаем ДПГ. ##can_continue', function (done) {
    //     const today = '[' + $h.common.getTodayStr() + '] - ';
    //     const year = $h.common.getFullYear();
    //     return $h.form.setForm({
    //         displayname: today + 'Услуга',
    //         description: today + 'Описание услуги',
    //         year: year,
    //         branch: 'Красноярская дирекция по ремонту пути'
    //     })
    //         // .then(expliciteWait)
    //         .then(function () {
    //             return $h.form.processButton(['CREATE', 'UPDATE']);
    //         })
    //         // .then(angularWait)
    //         // .then(expliciteWait)
    //
    //         .then(function () {
    //             protractor.helpers.grid.main.rowsList().count().then(function (res) { //проверить что в выпадающем списке есть значение, хотя бы 1
    //                 // let b = res > 1;
    //                 // console.log('b', b);
    //                 expect(res >= 1).toBe(true);
    //             })
    //         })
    //         .then(done);
    // }, skip);
    //
    // it('6. Переходим на вкладку Наряды и убеждаемся, что в списке создался один наряд с наименованием Получение титула ремонта. ##can_continue', function (done) {
    //     // console.log('Переходим на вкладку Наряды и убеждаемся')
    //     return $h.form.getForm(['tasks'])
    //         .then(function (form) {
    //             eventUid = form.uid;
    //             tasksBefore = form.tasks.length
    //             protractor.helpers.taksUid = Number(form.tasks[0].taskid)
    //             expect(tasksBefore).toBe(1);    // проверяем что создалась одна запись
    //         })
    //         .then(expliciteWait)
    //         .then(function () {
    //             return $h.form.processButton(['BACK']);
    //         })
    //         .then(expliciteWait)
    //         .then(done);
    // }, skip);

    // it('7 Выходим из системы', function (done) {
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


// Автотест Осмотр участка:
// 0) Выполняем сценарий на создание ДПГ, получения Титула, распределению ПМС (под пользователем КраснДРП)
// 1) Заходим под ПМС197_Менеджер, идем в пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
// 2) Переходим по ссылке /#/my_tasks_wc ("Мои задачи"). Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
// 3) Выбираем наряд «Осмотр участка». Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".
// (выбирать нужно из группы "Назначить исполнителя", №_id = (№_id_по_распроеделению_ПМС + 1).
// 4) В наряде указываем исполнителя (Волков С.А.) и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
// 5) Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
// 6) Переходим по ссылке "Заполнить данные по осмотру участка".
// Убеждаемся, что в открывшемся окне имеются поля: "Тип Рельс", "Тип шпал", "Скрепления" и кнопки "Расчет МВСП", "Сохранить", "Назад", "Получить шаблон осмотра"
// 7) Заполнить по кладке "Верхнее строение пути" поля в разделе "До ремонта" (Выбирать 1ые записи из выпадающих списков полей):
// "Тип Рельс", "Тип шпал", "Скрепления", "Род балласта", "Раздел. слой", "Тип СЦБ",  "Конструкция пути", "Раздел. слой", "Тип СЦБ", "Загрязненность".
// поля в разделе "После осмотра"(Выбирать 1ые записи из выпадающих списков полей): "Состояние рельсов", "Состояние шпал", "Состояние скрепл."
// 8) Перейти во вкладку "Протяженность участка", считать значения полей "км. н", "пк+ н.", "км ок.", "пк+ ок." в разделе "До ремонта" и
// заполнить сохраненными данными указанные поля в разделе "После ремонта"
// 9) Перейти во вкладку "Протяженность рельсов", нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных
// 10) Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями, сохраненными в п.6 и нажать кнопку "Сохранить"
// 11) Вернуться к задаче в Моих нарядах (отфильтровать и открыть нужное по Id в п.2) и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось на "Выполнен".