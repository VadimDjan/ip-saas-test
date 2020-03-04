describe('Автотест на получение Титула. ', function () {
    var _ = protractor.libs._;
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    var loginObject = {};
    // let taksUid;

    let buttonAdd = 'Добавить запись';
    let buttonUpdate = 'Сохранить';
    let buttonCancel = 'Отменить';
    let buttonIncludeInTitle = 'Включить в титул';

    var linesNumber;
    var jackdawsCount = 4;  // установить 4 галочки
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

    // 1. Переходим пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись
    it('1. Переходим по ссылке /#/my_tasks_wc. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись.  ##can_continue', (done) => {
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

    // 2. Выбираем наряд "Получение титула ремонта" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить"
    it('2. Выбираем наряд "Получение титула ремонта" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue', function (done) {
        return $h.grid.main.setSearch([
            {
                type: 'string',
                operator: 'contains',
                field: 'displayname',
                value: 'Получение титула ремонта'
            },
            {
                type: 'int',
                operator: 'eq',
                field: 'taskid',
                value: protractor.helpers.taksUid
            }
        ])
            .then(function () {
                element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid) + '\"]')).first().getWebElement()
                    .then(function (event) {
                        browser.actions().doubleClick(event).perform();
                        return browser.waitForAngular();
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function (res) {
                expect(element(by.css('[data-button-name="UPDATE"]')).getText()).toBe(buttonUpdate);   // Проверить что есть кнопка Сохранить
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
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

    // 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
    it('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось. ##can_continue', function (done) {
        return $h.form.processButton(['В работу'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['workflowstepid']);
            })
            .then(function (form) {
                expect(form.workflowstepid.displayValue).toBe('В работе ');
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 5. Переходим по ссылке "Перейти к Титулу ремонта ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 4 записи и кнопки "Добавить запись", "Отменить", "Включить в титул"
    it('5. Переходим по ссылке "Перейти к Титулу ремонта. Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 4 записи и кнопки "Добавить запись", "Отменить", "Включить в титул" . ##can_continue', function (done) {
        return element(by.css('[class="glyphicon glyphicon-arrow-right"]')).click()
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                element.all(by.css('[data-uid]')).count().then(function (res) {
                    expect(res >= jackdawsCount).toBe(true);  //убедиться, что имеются не менее 4х записей
                })
            })
            .then(function () {
                expect(element(by.css('[class="k-button idea-button-add-row"]')).getText()).toBe(buttonAdd);   // Проверить что есть кнопка Добавить запись
            })
            .then(function () {
                expect(element(by.css('[data-button-id="1233"]')).getText()).toBe(buttonCancel);   // Проверить что есть кнопка Отменить
            })
            .then(function () {
                expect(element(by.css('[data-button-id="1232"]')).getText()).toBe(buttonIncludeInTitle);   // Проверить что есть кнопка Включить в титул
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 6. В открывшемся списке нажимаем на кнопку "Выбрать все", убедиться, что все галочки поставились
    it('6. В открывшемся списке нажимаем на кнопку "Выбрать все". ##can_continue', function (done) {
        // console.log('нажимаем на кнопку "Выбрать все"')
        return angularWait()
            .then(function () {
                element(by.css('[class="k-button idea-button-select-all"]')).click()
            })
            .then(angularWait)
            .then(function () {
                element.all(by.css(' .k-grid-content [aria-selected="true"]')).count().then(function (res) {
                    linesNumber = res;  //Сохранить количество галок на странице
                    expect(element.all(by.css('[data-uid]')).count()).toBe(res);  //убедиться, что все галочки поставились
                })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 7. Снять галку с 4-х ремонтов, убедиться, что галки снялись
    it('7. Снять галку с 4-х ремонтов. ##can_continue', function (done) {
        // console.log('Снять галку с 4-х ремонтов')
        return angularWait()
            .then(function () {
                var els = element.all(by.css(' .k-grid-content [class="idea-grid-select"]'));
                for (var i = 0; i < jackdawsCount; ++i) {
                    els.get(i).click()
                }
            })
            .then(angularWait)
            .then(function () {
                element.all(by.css(' .k-grid-content [aria-selected="false"]')).count().then(function (res) {
                    expect(res).toBe(jackdawsCount);  //убедиться, что галки снялись
                })
            })
            .then(angularWait)
            .then(done);
    }, skip);

    // 8. Нажать на кнопку "Отменить все", убедиться, что все галки снялись
    it('8. Нажать на кнопку Отменить все, убедиться, что все галки снялись. ##can_continue', function (done) {
        // console.log('Нажать на кнопку Отменить все')
        return angularWait()
            .then(function () {
                element(by.css('[class="k-button idea-button-select-all"]')).click()
            })
            .then(angularWait)
            .then(function () {
                element.all(by.css(' .k-grid-content [aria-selected="false"]')).count().then(function (res) {
                    expect(element.all(by.css('[data-uid]')).count()).toBe(res);  //убедиться, что все галочки снялись
                })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 9. Выбрать 4 записи (кликнуть по галкам) из группы "Не указано", нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу, которая называется "Услуга..."
    it('9. Выбрать 4 записи (кликнуть по галкам) из группы Не указано, нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу. ##can_continue', function (done) {
        return angularWait()
            .then(function () {
                let childElements = protractor.helpers.grid.main.rowsList();
                for (let i = 0; i < linesNumber; ++i) {
                    isExistNewGroup = false;
                    childElements.get(i).getText().then(function (text) {
                        if (text.match('Не указано')) { //убедиться, что есть группа "Не указано"
                            number = i;
                            isExistNewGroup = true;
                            return isExistNewGroup;
                        }
                        return isExistNewGroup
                    })
                        .then(function (isExistNewGroup) {    //Выбрать 4 записи (кликнуть по галкам) из группы "Не указано",
                            expect(isExistNewGroup).toBe(true)
                            if (isExistNewGroup) {
                                childElements.get(number + 1).element(by.css('[class="idea-grid-select"]')).click();
                                childElements.get(number + 2).element(by.css('[class="idea-grid-select"]')).click();
                                childElements.get(number + 3).element(by.css('[class="idea-grid-select"]')).click();
                                childElements.get(number + 4).element(by.css('[class="idea-grid-select"]')).click();
                            }
                            return isExistNewGroup
                        })
                    return isExistNewGroup
                }
                return isExistNewGroup
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                element(by.css('[data-button-id="1232"]')).click();   // нажать Включить в титул
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {     // выбираем 4 элемента из созданной группы
                let childElements = protractor.helpers.grid.main.rowsList();
                for (let i = 0; i < linesNumber; ++i) {
                    isExistNewGroup = false;
                    childElements.get(i).getText().then(function (text) {
                        if (text.match('Услуга')) { //убедиться, что есть группа "Услуга"
                            number = i;
                            isExistNewGroup = true;
                            return isExistNewGroup;
                        }
                        return isExistNewGroup
                    })
                        .then(function (isExistNewGroup) {    //проверить что есть 4 записи из группы "Услуга",
                            expect(isExistNewGroup).toBe(true)
                            if (isExistNewGroup) {
                                expect(childElements.get(number + 1).element(by.css('[class="idea-grid-select"]')).isPresent()).toBe(true);
                                expect(childElements.get(number + 2).element(by.css('[class="idea-grid-select"]')).isPresent()).toBe(true);
                                expect(childElements.get(number + 3).element(by.css('[class="idea-grid-select"]')).isPresent()).toBe(true);
                                expect(childElements.get(number + 4).element(by.css('[class="idea-grid-select"]')).isPresent()).toBe(true);
                            }
                        })
                    return isExistNewGroup
                }
                return isExistNewGroup
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 10. Выбрать одну запись из группы "Услуга..." и нажать на кнопку "Отменить". Убедиться, что запись пропадет из списка
    it('10. Выбрать одну запись из группы "Услуга..." и нажать на кнопку "Отменить". Убедиться, что запись пропадет из списка. ##can_continue', function (done) {
        return angularWait()
            .then(function () {
                let childElements = protractor.helpers.grid.main.rowsList();
                for (let i = 0; i < linesNumber; ++i) {
                    isExistNewGroup = false;
                    childElements.get(i).getText().then(function (text) {
                        if (text.match('Услуга')) { //убедиться, что есть группа "Услуга"
                            number = i;
                            isExistNewGroup = true;
                            return isExistNewGroup;
                        }
                    })
                        .then(function (isExistNewGroup) {
                            if (isExistNewGroup) {
                                childElements.get(number + 4).element(by.css('[class="idea-grid-select"]')).click();    //Выбрать запись 4, нажать Отмена
                                return isExistNewGroup;
                            }
                        })
                        .then(function (isExistNewGroup) {  // убедится что Запись 4 исчезла
                            if (isExistNewGroup) {
                                expect(childElements.get(number + 4).element(by.css('[class="k-group-footer"]')).isPresent()).toBe(false);
                            }
                        })
                    return isExistNewGroup;
                }
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                element(by.css('[data-button-id="1233"]')).click();   // нажать Отменить
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 11. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен"
    it('11. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен". ##can_continue', function (done) {
        browser.waitForAngular().then(function () {
            browser.navigate().back();  // нажать кнопку Назад браузера
        });
        $h.grid.main.setSearch([    // найти фильтром нужную задачу
            {
                type: 'string',
                operator: 'contains',
                field: 'displayname',
                value: 'Получение титула ремонта'
            },
            {
                type: 'int',
                operator: 'eq',
                field: 'taskid',
                value: protractor.helpers.taksUid
            }
        ])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid) + '\"]')).first().getWebElement()
                    .then(function (event) {
                        browser.actions().doubleClick(event).perform();
                        return browser.waitForAngular();
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.processButton(['Выполнить']);    // нажать Выполнить
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['workflowstepid']);
            })
            .then(function (form) {
                return expect(form.workflowstepid.displayValue).toBe('Выполнен');   //Проверить что статус изменился на Выполнен
            })
            .then(done);
    }, skip);
}, !protractor.totalStatus.ok);



// Автотест на получение титула:
// 0. Выполняем сценарий на логин под под КраснДРП и создание ДПГ
// 1. Переходим пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись
// 2. Выбираем наряд "Получение титула ремонта" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить"
// 3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
// 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
// 5. Переходим по ссылке "Перейти к Титулу ремонта ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 4 записи и кнопки "Добавить запись", "Отменить", "Включить в титул"
// 6. В открывшемся списке нажимаем на кнопку "Выбрать все", убедиться, что все галочки поставились
// 7. Снять галку с 4-х ремонтов, убедиться, что галки снялись
// 8. Нажать на кнопку "Отменить все", убедиться, что все галки снялись
// 9. Выбрать 4 записи (кликнуть по галкам) из группы "Не указано", нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу, которая называется "Услуга..."
// 10. Выбрать одну запись из группы "Услуга..." и нажать на кнопку "Отменить". Убедиться, что запись пропадет из списка