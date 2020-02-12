describe('Автотест на получение Титула. ', function () {
    var _ = protractor.libs._;
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    var loginObject = {};
    // let taksUid = 38670;

    let buttonAdd = 'Добавить запись';
    let buttonUpdate = 'Сохранить';
    let buttonCancel = 'Отменить';
    let buttonIncludeInTitle = 'Включить в титул';

    var linesNumber;
    var jackdawsCount = 2;  // установить 2 галочки
    let number = 0;
    let isExistNewGroup = false;

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

    // идем в пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
    it('1. Переходим по ссылке /#/my_tasks_wc. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача.  ##can_continue', (done) => {
        // console.log('Переходим по ссылке /#/my_tasks_wc.');
        browser.get(protractor.helpers.url + '/#/my_tasks_wc')
            .then(angularWait)
            .then(expliciteWait)

        browser.getCurrentUrl().then(function (url) {       // проверяем URL
            // let s = url.substring(url.indexOf('#') + 1);
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

    // Выбираем наряд «Распределение участков КРП по ПМС». Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".
    it('2. Выбираем наряд "Распределить участки КРП по ПМС" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue', function (done) {
        return $h.grid.main.setSearch([
            {
                type: 'string',
                operator: 'contains',
                field: 'displayname',
                value: 'Распределить участки КРП по ПМС'
            },
            {
                type: 'int',
                operator: 'eq',
                field: 'taskid',
                value: Number(protractor.helpers.taksUid + 1)
                // value: protractor.helpers.taksUid
            }
        ])
            .then(function () {
                // return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid) + '\"]')).first().getWebElement()
                return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid + 1) + '\"]')).first().getWebElement()
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

    // 3) В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    it('3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', function (done) {
        return $h.form.setForm({
            assignedto: 'Вернер А.А.'
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

    // 4) Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
    it('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось. ##can_continue', function (done) {
        return $h.form.processButton(['В работу'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['workflowstepid']);
            })
            .then(function (form) {
                // console.log('form   ****', form)
                // console.log('form.workflowstepid.displayValue   *******', form.workflowstepid.displayValue)
                expect(form.workflowstepid.displayValue).toBe('В работе ');
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 5) Переходим по ссылке "Перейти к ДПГ ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 2 записи и кнопки "Добавить запись", "Назначить ПМС"
    it('5. Переходим по ссылке "Перейти к ДПГ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 1 запись и кнопки "Добавить запись", "Назначить ПМС". ##can_continue', function (done) {
        return element(by.css('[class="glyphicon glyphicon-arrow-right"]')).click()
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                protractor.helpers.grid.main.rowsList().count().then(function (res) { //Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
                    // console.log('res', res);
                    linesNumber = res;
                    expect(res >= 1).toBe(true);
                })
            })
            .then(function () {
                expect(element(by.css('[class="k-button idea-button-add-row"]')).getText()).toBe('Добавить запись');   // Проверить что есть кнопка Добавить запись
            })
            .then(function () {
                expect(element(by.css('[data-button-id="1187"]')).getText()).toBe('Назначить ПМС');   // Проверить что есть кнопка Назначить ПМС
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 6) Выбрать 1 запись из группы "Не указано", нажать на кнопку "Назначить ПМС"
    it('6. Выбрать 1 запись из группы "Не указано", нажать на кнопку "Назначить ПМС". ##can_continue', function (done) {
        // console.log('Выбрать 1 запись из группы "Не указано"')
        return angularWait()
            .then(function () {
                let childElements = protractor.helpers.grid.main.rowsList();
                // console.log('linesNumber', linesNumber);
                for (let i = 0; i < linesNumber; ++i) {
                    isExistNewGroup = false;
                    childElements.get(i).getText().then(function (text) {
                        // console.log('text', text);
                        // console.log('isExistNewGroup1', isExistNewGroup);
                        if (text.match('Не указано')) { //убедиться, что есть группа "Не указано"
                            number = i;
                            isExistNewGroup = true;
                            // console.log('isExistNewGroup2', isExistNewGroup)
                            return isExistNewGroup;
                        }
                        // console.log('isExistNewGroup3', isExistNewGroup)
                        return isExistNewGroup
                    })
                        .then(function (isExistNewGroup) {    //Выбрать 1 запись (кликнуть по галкам) из группы "Не указано",
                            // console.log('b after', isExistNewGroup)
                            expect(isExistNewGroup).toBe(true)
                            if (isExistNewGroup) {
                                // console.log('number', number)
                                childElements.get(number + 1).element(by.css('[class="idea-grid-select"]')).click();
                                // break
                            }// return
                            // console.log('b51', isExistNewGroup)
                            return isExistNewGroup
                        })
                    // console.log('b5', isExistNewGroup)
                    return isExistNewGroup
                }
                // console.log('b6', isExistNewGroup)
                return isExistNewGroup
            })

            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                // console.log('нажать Назначить ПМС')
                return element(by.css('[data-button-id="1187"]')).click();   // нажать Назначить ПМС
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 7) в открывшемся окне убедится что есть поле "ПМС", кнопки "ОК" и "Отмена" выбрать ПМС-181 из выпадающего списка, нажать "Ок"
    it('7. В открывшемся окне убедится что есть поле "ПМС", кнопки "ОК" и "Отмена" выбрать ПМС (первый из списка) из выпадающего списка, нажать "Ок". ##can_continue', function (done) {
        // console.log('7. В открывшемся окне убедится что есть поле "ПМС"')
        return angularWait()
            .then(function () {
                // console.log('Step 2', element(by.css('[class="modal-content"]')))
                return element(by.css('[class="modal-content"]'))
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function (res) {
                expect(res.element(by.css('[idea-field-name="p_dept"]')).isPresent()).toBe(true)     // Проверить что есть поле ПМС
                expect(res.element(by.css('[ng-click="submit()"]')).isPresent()).toBe(true)     // Проверить что есть кнопка "ОК"
                expect(res.element(by.css('[ng-click="cancel()"]')).isPresent()).toBe(true)     // Проверить что есть кнопка "Отмена"
                res.element(by.css('[class="select2-arrow"]')).click();

            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                // console.log('Step Выходим 1')
                // return  element(by.css('.select2-results-dept-0')).click();
                element(by.id('select2-result-label-75')).click();  //Нажать на поле ПМС для выбора
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                // console.log('Step Выходим 2')
                element(by.css('[ng-click="submit()"]')).click();
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 8) Открыть двойным кликом созданную запись из группы "ПМС-181", убедится что есть кнопки "Расчет МВСП", "Сохранить", "Назад",
    // поля: "Статус", "ДПГ", "Класс, группа, категория пути"
    it('8. Открыть двойным кликом созданную запись из группы "ПМС-181". ##can_continue', function (done) {
        // console.log('8. Открыть двойным кликом созданную запись из группы "ПМС-181')
        return angularWait()
            .then(function () {     // выбираем 2 элемента из созданной группы
                let childElements = protractor.helpers.grid.main.rowsList();
                for (let i = 0; i < linesNumber; ++i) {
                    isExistNewGroup = false;
                    childElements.get(i).getText().then(function (text) {
                        if (text.match('ПМС-181')) { //убедиться, что есть группа "ПМС-181"
                            number = i;
                            isExistNewGroup = true;
                            return isExistNewGroup;
                        }
                        return isExistNewGroup
                    })
                        .then(function (isExistNewGroup) {    //проверить что есть хотя бы 1 запись из группы "ПМС-181",
                            expect(isExistNewGroup).toBe(true)
                            if (isExistNewGroup) {
                                expect(childElements.get(number + 1).element(by.css('[class="idea-grid-select"]')).isPresent()).toBe(true);
                            }// return
                        })
                        .then(function () {
                            // return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid) + '\"]')).first().getWebElement()
                            return childElements.get(number + 1).getWebElement()
                                .then(function (event) {
                                    browser.actions().doubleClick(event).perform();
                                    return browser.waitForAngular();
                                })
                        })
                    // console.log('b5 - поиск группы Услуга', isExistNewGroup)
                    return isExistNewGroup
                }
                // console.log('b6 - поиск группы Услуга', isExistNewGroup)
                return isExistNewGroup
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(() => expect(element(by.css('[idea-field-name="workflowstepid"]')).isPresent()).toBe(true))  // Проверить что есть поле Статус
            .then(() => expect(element(by.css('[idea-field-name="service"]')).isPresent()).toBe(true))  // Проверить что есть поле ДПГ
            .then(() => expect(element(by.css('[idea-field-name="railtrack_class"]')).isPresent()).toBe(true))  // Проверить что есть поле Класс, группа, категория пути
            .then(() => expect(element(by.css('[data-button-name="calc_mvsp"]')).getText()).toBe('Расчет МВСП'))   // Проверить что есть кнопка Расчет МВСП
            .then(() => expect(element(by.css('[data-button-name="Отменить"]')).getText()).toBe('Отменить'))   // Проверить что есть кнопка Отменить
            .then(() => expect(element(by.css('[data-button-name="UPDATE"]')).getText()).toBe('Сохранить'))   // Проверить что есть кнопка Сохранить
            .then(() => expect(element(by.css('[data-button-name="BACK"]')).getText()).toBe('Назад'))   // Проверить что есть кнопка Назад
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 9) Перейти во вкладку "Технологические окна", нажать кнопку "Добавить запись"
    it('9) Перейти во вкладку "Технологические окна", нажать кнопку "Добавить запись". ##can_continue', function (done) {
        console.log('Перейти во вкладку "Технологические окна", нажать кнопку "Добавить запись')
        return $h.form.getForm(['working_periods'])
            // .then(function (form) {
            //     eventUid = form.uid;
            //     tasksBefore = form.tasks.length
            //     protractor.helpers.taksUid = Number(form.tasks[0].taskid)
            //     expect(tasksBefore).toBe(1);    // проверяем что создалась одна запись
            // })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                element(by.css('[class="k-button idea-button-add-row"]')).click()
                // return $h.form.processButton(['BACK']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 10) в открывшемся окне заполнить поля "Длительность, часов", "Начало" и нажать кнопку Создать и Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    // Нажимаем кнопку Назад, проверить что в списке есть хотя бы 1 значение
    it('10. В открывшемся окне заполнить поля "Длительность, часов", "Начало" и нажать кнопку Создать и Сохранить. ##can_continue', function (done) {
        let dateAndTime = $h.common.getTodayStrFormat();
        // console.log('dateAndTime', dateAndTime)
        return $h.form.setForm({
            duration: 2,
            planned_start: dateAndTime,
        })
            // .then(expliciteWait)
            .then(function () {
                return $h.form.processButton(['CREATE', 'UPDATE']);
            })
            .then(function () {
                expect(element(by.css('[class="ui-notification alert ng-scope alert-success killed"]')).isPresent()).toBe(true)  // Справа наверху возникло зеленое сообщение
            })
            .then(function () {
                return $h.form.processButton(['BACK']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                protractor.helpers.grid.main.rowsList().count().then(function (res) { //проверить что в выпадающем списке есть значение, хотя бы 1
                    let b = res > 1;
                    console.log('b', b);
                    console.log('res', res);
                    expect(res >= 1).toBe(true);
                })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 11) Вернуться к задаче в Моих нарядах (отфильстровать и открыть нужное по Id) и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось
    it('11. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось. ', function (done) {
        console.log('11 Вернуться к задаче и нажать на кнопку Выполнить.');
        // console.log('protractor.helpers.taksUid', protractor.helpers.taksUid);
        // console.log('protractor.helpers.taksUid', typeof protractor.helpers.taksUid);
        browser.waitForAngular()
            .then(function () {
                return browser.get(protractor.helpers.url + '/#/my_tasks_wc')
                    .then(angularWait)
                    .then(expliciteWait)
            })
            .then(function () {
                console.log('фильтруем задачи');
                return $h.grid.main.setSearch([
                    {
                        type: 'string',
                        operator: 'contains',
                        field: 'displayname',
                        value: 'Распределить участки КРП по ПМС'
                    },
                    {
                        type: 'int',
                        operator: 'eq',
                        field: 'taskid',
                        value: Number(protractor.helpers.taksUid + 1)
                    }
                ])
            })
            .then(function () {
                return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid + 1) + '\"]')).first().getWebElement()
                    .then(function (event) {
                        browser.actions().doubleClick(event).perform();
                        return browser.waitForAngular();
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                console.log('нажать Выполнить');
                return $h.form.processButton(['Выполнить']);    // нажать Выполнить
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['workflowstepid']);
            })
            .then(function (form) {
                console.log('Проверить что статус изменился на Выполнен');
                return expect(form.workflowstepid.displayValue).toBe('Выполнен');   //Проверить что статус изменился на Выполнен
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);
}, !protractor.totalStatus.ok);


// Автотест распределение по ПМС:
// 0) Выполняем сценарий на создание ДПГ и получения Титула
// 1) Заходим под КраснДРП, идем в пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
// 2) Выбираем наряд «Распределение участков КРП по ПМС». Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".
// (выбирать нужно из группы "Назначить исполнителья", #задачи = #задачи по титулу + 1.
// 3) В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
// 4) Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
// 5) Переходим по ссылке "Перейти к ДПГ ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы одна запись и кнопки "Добавить запись", "Назначить ПМС"
// 6) Выбрать 1 запись из группы "Не указано", нажать на кнопку "Назначить ПМС",
// 7) в открывшемся окне убедится что есть поле "ПМС", кнопки "ОК" и "Отмена" выбрать ПМС-181 из выпадающего списка, нажать "Ок"
// 8) Открыть двойным кликом созданную запись из группы "ПМС-181", убедится что есть кнопки "Расчет МВСП", "Сохранить", "Назад", поля: "Статус", "ДПГ", "Класс, группа, категория пути"
// 9) Перейти во вкладку "Технологические окна", нажать кнопку "Добавить запись"
// 10) в открывшемся окне заполнить поля "Длительность, часов", "Начало" и нажать кнопку Создать и Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
// Нажимаем кнопку Назад, проверить что в списке есть хотя бы 1 значение
// 11) Вернуться к задаче в Моих нарядах (отфильстровать и открыть нужное по Id) и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось
// 12) Выйти из системы

// 6) Двойным кликом открыть первую сверху запись, убедиться, что запролнено поле ПМС, имеются кнопки "Назад", "Отменить", "Сохранить", "Расчет МВССП"
// 7) Перейти во вкладку Технологические окна, нажать кнопку "Добавить запись"
// 8) В открывшейся карточке убедится, что доступны для заполнения "Наименование", "Длительност, часов", "Начало", заполнить указанные поля. Проверить, что заполнено поле "Режим выполнения".
// Нажать кнопку "Создать" и "Сохранить"
// 9) идем в пункт меню "Мои наряды". фильтруем по ID нужный наряд и открываем двойным кликом, в открывшемся окне нажимаем "Выполнить"
// 10) Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось на "Выполнен"

// аспределение участков КРП по ПМС закрыть и обратно зайти в Получение титула ремонта открывать карточку каждого участка?
// нигде не указано, что после нажатия Перейти к ДПГ необходимо выбрать участок и нажать Назначить ПМС
// какой ПМС назначать








