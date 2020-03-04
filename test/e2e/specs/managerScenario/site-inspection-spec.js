describe('Автотест на Осмотр участка. ', function () {
    var _ = protractor.libs._;
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    var loginObject = {};

    // let taksUid = 48037;
    let numOfRows = 0;

    let start_km_ar = 0;
    let start_pk_ar = 0;
    let finish_km_after_repair = 0;
    let finish_pk_after_repair = 0;
    let distance_after_repair = 0;
    let gradient = 12.9;
    let radius = 280;
    let length = 450;
    let raising = 5;
    let elementMain = null;
    let isExistsRows = false;
    let countMistakes = 0;
    let projectNum = null;
    // let projectNum = '1683.00.000';

    var linesNumber;
    let number = 0;
    let isExistNewGroup = false;
    let childElements;

    function skip() {
        return !protractor.totalStatus.ok;
    }

    // 1. Заходим в систему под ПМС197_Менеджер
    it('1. Заходим в систему под ПМС197_Менеджер. ##can_continue', (done) => {
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

    // 2. Проверяем что находимся на странице Мои наряды. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача.
    it('2. Проверяем что находимся на странице Мои наряды. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача.  ##can_continue', (done) => {
        // browser.get(protractor.helpers.url + '/#/my_tasks_dept')
        //     .then(angularWait)
        //     .then(expliciteWait)

        browser.getCurrentUrl().then(function (url) {       // проверяем URL
            expect(url.substring(url.indexOf('#') + 1)).toBe('/my_tasks_dept');
        });

        return angularWait()
            .then(function () {
                protractor.helpers.grid.main.rowsList().count().then(function (res) { //Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
                    expect(res >= 1).toBe(true);
                })
            })
            .then(done);
    }, skip);

    // 3. Выбираем наряды "Осмотр участка" и открываем первый наряд из группы "Назначить исполнителя". Убеждаемся, что запись открылась, текущий статус "запланирован", поле "Исполнитель" доступен для заполнения, есть кнопка "Сохранить" и "Назад".
    it('3. Выбираем наряды "Осмотр участка" и открываем первый наряд из группы "Назначить исполнителя". ##can_continue', function (done) {
        return $h.grid.main.setSearch([
            {
                type: 'string',
                operator: 'contains',
                field: 'displayname',
                value: 'Осмотр участка'
            },
            // {
            //     type: 'int',
            //     operator: 'eq',
            //     field: 'taskid',
            //     // value: Number(protractor.helpers.taksUid + 2)
            //     value: taksUid
            // }
        ])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                protractor.helpers.grid.main.rowsList().count().then(function (res) { //Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
                    linesNumber = res;
                    expect(res >= 1).toBe(true);
                })
            })
            .then(function () {
                childElements = protractor.helpers.grid.main.rowsList();
                for (let i = 0; i < linesNumber; ++i) {
                    isExistNewGroup = false;
                    childElements.get(i).getText().then(function (text) {
                        if (text.match('Назначить исполнителя')) { //убедиться, что есть группа "Назначить исполнителя"
                            number = i;
                            isExistNewGroup = true;
                            return isExistNewGroup;
                        }
                    })
                }
            })
            .then(function () {    //Выбрать 1 запись (кликнуть по галкам) из группы "Назначить исполнителя",
                expect(isExistNewGroup).toBe(true)
                // console.log('isExistNewGroup', isExistNewGroup)
                if (isExistNewGroup) {
                    childElements.get(number + 1).getWebElement()
                        .then(function (event) {
                            browser.actions().doubleClick(event).perform();
                            return browser.waitForAngular();
                        })
                }
                return isExistNewGroup
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function (res) {
                expect(element(by.css('[data-button-name="UPDATE"]')).isPresent()).toBe(true);   // Проверить что есть кнопка Сохранить
                expect(element(by.css('[data-button-name="BACK"]')).isPresent()).toBe(true);   // Проверить что есть кнопка Назад
                expect(element(by.css('[data-input-name="assignedto"]')).isEnabled()).toBe(true)    // Проверить Исполнитель доступен для заподнения
            })
            .then(function () {
                element(by.css('[class="editable-header__pk-value  ng-binding"]')).getText().then(function (text) {     // Сохранить ID servicce
                    protractor.helpers.taksUid = Number(text);
                })
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

    // 4. В наряде указываем исполнителя "Медведев А.О." и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение.
    it('4. В наряде указываем исполнителя "Медведев А.О." и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло.. ##can_continue', function (done) {
        return $h.form.setForm({
            assignedto: 'Медведев А.О.'
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

    // 5. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
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
                expect(form.workflowstepid.displayValue).toBe('В работе ');
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 6. Переходим по ссылке "Заполнить данные по осмотру участка". Убеждаемся, что в открывшемся окне имеются поля: " Специализация жд линии", "Темп. амплитуда", "ПМС" и кнопки "Расчет МВСП", "Сохранить", "Назад", "Получить шаблон осмотра"
    it('6. Переходим по ссылке "Заполнить данные по осмотру участка". ##can_continue', function (done) {
        return element(by.css('[class="glyphicon glyphicon-road"]')).click()
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                expect(element(by.css('[data-button-name="calc_mvsp"]')).getText()).toBe('Расчет МВСП');   // Проверить что есть кнопка "Расчет МВСП"
                expect(element(by.css('[data-button-name="UPDATE"]')).getText()).toBe('Сохранить');   // Проверить что есть кнопка "Сохранить"
                expect(element(by.css('[data-button-name="BACK"]')).getText()).toBe('Назад');   // Проверить что есть кнопка "Назад"
                expect(element(by.css('[data-button-name="get_inspecting_templ"]')).getText()).toBe('Получить шаблон осмотра');   // Проверить что есть кнопка "Получить шаблон осмотра"
            })
            .then(function () {
                expect(element(by.css('[idea-field-name="railtrack_class"]')).isPresent()).toBe(true);   // Класс, группа, категория пути
                expect(element(by.css('[idea-field-name="track_specialization"]')).isPresent()).toBe(true);   // Специализация жд линии
                expect(element(by.css('[idea-field-name="temp_amplitude"]')).isPresent()).toBe(true);
                ;  // Проверить что есть поле "Темп. амплитуда"
                expect(element(by.css('[idea-field-name="department"]')).isPresent()).toBe(true);   // Проверить что есть поле "ПМС"
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 7. Заполнить обязательные поля на вкладке "Общая информация"
    it('7. Заполнить обязательные поля на вкладке "Общая информация" . ##can_continue', function (done) {
        return $h.form.setForm({
            railtrack_class: 2,
            track_specialization: 6,
            temp_amplitude: '>110',
            powerunit: 'electric',
            track_number: 4,
        })
            .then(done);
    }, skip);

    // 8. Перейти во вкладку "Верхнее строение пути" поля в разделе "До ремонта", заполнить обязательные поля.
    it('8. Перейти во вкладку "Верхнее строение пути" поля в разделе "До ремонта", заполнить обязательные поля. ##can_continue', function (done) {
        return $h.form.getForm(['before_repair_label'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.setForm({
                    rail_brand_br: 'Р65 СГ I',
                    clips_br: 'W-30',
                    sleeper_br: 'Ш АРС-МК/АРС-04.07.003-II-ПД',
                    ballast_br: 'gravel',
                    sep_layer_br: 'Георешетка',
                    signal_system_br: 'semi_automatic',
                    dirtyness: 34,
                    trackform_br: 'course',
                    rail_situation: 'new',
                    sleeper_situation: 'new',
                    clips_situation: 'new'
                })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

// 9. Перейти во вкладку "Протяженность участка", заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." в разделе "После ремонта". Нажать кнопку "Добавить запись"
// под таблицей "Нестандартные километры", убедится, что появилась строка с формами для ввода данных (количество записей в таблице увеличилось на 1).
// Заполнить поля "км", "Количество пикетов" значениями "км. н." и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// Если запись в таблице уже существует, обновить значение "пк+ ок.". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('9. Перейти во вкладку "Протяженность участка", заполнить открытые поля и строки таблиц: "Нестандартные километры"/"Нестандартные пикеты". ##can_continue', function (done) {
        return $h.form.getForm(['before_repair_label_1'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['start_km_br', 'start_pk_br', 'finish_km', 'finish_pk_before_repair', 'distance_before_repair']);
            })
            .then(function (form) {
                start_km_ar = form.start_km_br;
                start_pk_ar = form.start_pk_br;
                finish_km_after_repair = form.finish_km;
                finish_pk_after_repair = form.finish_pk_before_repair;
                distance_after_repair = form.distance_before_repair;
            })
            .then(function () {
                return $h.form.setForm({
                    start_km_ar: start_km_ar,
                    start_pk_ar: start_pk_ar,
                    finish_km_after_repair: finish_km_after_repair,
                    finish_pk_after_repair: finish_pk_after_repair,
                })
            })
            .then(function () {
                elementMain = element(by.css('[data-field-name="unusual_km"]'));
            })
            .then(function () {
                return $h.grid.subgrid('unusual_km').getTotalRows();    //таблица "Нестандартные километры"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="unusual_km"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('unusual_km').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_1 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="km"]')).click();
                            elementMain.element(by.css('input[name="km"]')).clear().sendKeys(finish_km_after_repair);
                        })
                }
            })
            .then(function () {
                elementMain.element(by.css('[data-container-for="pk_count"]')).click();
                elementMain.element(by.css('input[name="pk_count"]')).clear();
                elementMain.element(by.css('[data-container-for="pk_count"]')).click();
                elementMain.element(by.css('input[name="pk_count"]')).sendKeys(Math.ceil(finish_pk_after_repair + 1));
            })
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount1', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('unusual_km').getTotalRows()
                    .then(function (countAfterAdd) {
                        // console.log('countAfterAdd2', countAfterAdd, 'numOfRows', numOfRows)
                        if (isExistsRows) {
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(function () {
                elementMain = element(by.css('[data-field-name="unusual_pk"]'));
            })
            .then(function () {
                return $h.grid.subgrid('unusual_pk').getTotalRows();        //таблица "Нестандартные пикеты"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="unusual_pk"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('unusual_km').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_2 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="km"]')).click();
                            elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="pk"]')).click();
                            elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(Math.ceil(start_pk_ar));

                        })
                }
            })
            .then(function () {
                elementMain.element(by.css('[data-container-for="distance"]')).click();
                elementMain.element(by.css('input[name="distance"]')).clear();
                elementMain.element(by.css('[data-container-for="distance"]')).click();
                elementMain.element(by.css('input[name="distance"]')).sendKeys((distance_after_repair + 1));

            })
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount2', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('unusual_pk').getTotalRows()
                    .then(function (countAfterAdd) {
                        if (isExistsRows) {
                            // console.log('if countAfterAdd3', countAfterAdd, 'numOfRows', numOfRows)
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            // console.log('else countAfterAdd3', countAfterAdd, 'numOfRows', numOfRows)
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

// 10. Перейти во вкладку "Протяженность рельсов", нажать кнопку "Добавить запись" таблицы, убедится, что появилась строка с формами для ввода данных.
// Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", "Тип" (указать первый из выпадающего списка) и нажать кнопку "Сохранить". Проверить, что количество записей в таблице
// увеличилось на 1. Если запись в таблице уже существует, обновить поле "Тип" из выпадающего списка. Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('10. Перейти во вкладку "Протяженность рельсов", заполнить данные по таблице". ##can_continue', function (done) {
        return $h.form.getForm(['track_rail_distance'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_rail_distance"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_rail_distance').getTotalRows();    //таблица "Протяженность рельсов"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_rail_distance"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_rail_distance').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_3 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_km"]')).click();
                            elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                            elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);

                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                            elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                            elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
                        })
                }
            })

            .then(function () {
                return element(by.css('[data-container-for="track_type.displayValue"]')).click()
                    .then(expliciteWait)
                    .then(function () {
                        return element.all(by.css('[class="select2-result-label"]')).last().click();
                    })
            })
            .then(expliciteWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount3', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_rail_distance').getTotalRows()
                    .then(function (countAfterAdd) {
                        // console.log('countAfterAdd4', countAfterAdd, 'numOfRows', numOfRows)
                        if (isExistsRows) {
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 11. Перейти во вкладку "План и профиль пути". Для таблицы План пути нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных.
    // Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями, сохраненными в п.9, также заполнить "Радиус", "Длина", Возвышение","Сторонность".
    // Если строка уже существует обновить поле "Сторонность". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    // Для таблицы Профиль пути нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", "%0".
    // Если строка уже существует обновить поле "%0". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('11. Перейти во вкладку "План и профиль пути". Редактировать/заполниь таблицы План пути и Профиль пути. ##can_continue', function (done) {
        return $h.form.getForm(['track_grading'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_grading"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_grading').getTotalRows();    //таблица "Профиль пути"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_grading"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_grading').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_4 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_km"]')).click();
                            elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                            elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                            elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                            elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_km_after_repair);
                        })
                }
            })
            .then(function () {
                elementMain.element(by.css('[data-container-for="gradient"]')).click();
                elementMain.element(by.css('input[name="gradient"]')).clear();
                elementMain.element(by.css('[data-container-for="gradient"]')).click();
                elementMain.element(by.css('input[name="gradient"]')).sendKeys(gradient);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount4', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_grading').getTotalRows()
                    .then(function (countAfterAdd) {
                        // console.log('countAfterAdd5', countAfterAdd, 'numOfRows', numOfRows)
                        if (isExistsRows) {
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_topology"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_topology').getTotalRows();    //таблица "План пути"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_topology"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_topology').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_5 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_km"]')).click();
                            elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                            elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                            elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                            elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="radius"]')).click();
                            elementMain.element(by.css('input[name="radius"]')).clear().sendKeys(radius);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="length"]')).click();
                            elementMain.element(by.css('input[name="length"]')).clear().sendKeys(length);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="raising"]')).click();
                            elementMain.element(by.css('input[name="raising"]')).clear().sendKeys(raising);
                        })
                }
            })
            .then(function () {
                return element(by.css('[data-container-for="sidedness.displayValue"]')).click()
                    .then(expliciteWait)
                    .then(function () {
                        return element.all(by.css('[class="select2-result-label"]')).first().click();
                    })
            })
            .then(angularWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount5', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_topology').getTotalRows()
                    .then(function (countAfterAdd) {
                        // console.log('countAfterAdd6', countAfterAdd, 'numOfRows', numOfRows)
                        if (isExistsRows) {
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

// 12. Перейти во вкладку "Ситуация". Для таблицы "Ситуация" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данныхю.
// Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями, сохраненными в п.9, выбрать 1ое значение из выпадающего списка для поля "Тип", установать/снять флажки с полей
// "Потребность МКТ" и "Высота>4м", нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1.
// Если строка уже существует установать/снять флаг с поля "Высота>4м". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// Для таблицы "Места выгрузки" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок."
// значениями, сохраненными в п.9 и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1.
// Если строка уже существует обновить поле "пк+ ок.". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('12. Перейти во вкладку "Ситуация". Редактировать/заполниь таблицы "Ситуация" и "Места выгрузки". ##can_continue', function (done) {
        return $h.form.getForm(['track_situation'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_situation"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_situation').getTotalRows();    //таблица "Ситуация"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_situation"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_situation').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_6 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_km"]')).click();
                            elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                            elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                            elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                            elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
                        })
                        .then(function () {
                            return element(by.css('[data-container-for="situation_type.displayValue"]')).click()
                                .then(expliciteWait)
                                .then(function () {
                                    return element.all(by.css('[class="select2-result-label"]')).first().click();
                                })
                        })
                        .then(function () {
                            return element(by.css('[data-container-for="is_ditch_machine_required"] [name="is_ditch_machine_required"]')).click();
                        })
                }
            })
            .then(function () {
                return element(by.css('[data-container-for="is_higher_then4m"] [name="is_higher_then4m"]')).click();
            })
            .then(angularWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount6', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_situation').getTotalRows()
                    .then(function (countAfterAdd) {
                        // console.log('countAfterAdd7', countAfterAdd, 'numOfRows', numOfRows)
                        if (isExistsRows) {
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_uploading_places"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_uploading_places').getTotalRows();    //таблица "Места выгрузки"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_uploading_places"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_uploading_places').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_7 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_km"]')).click();
                            elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                            elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                            elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                        })
                }
            })
            .then(function () {
                elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                elementMain.element(by.css('input[name="finish_pk"]')).clear();
                elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                elementMain.element(by.css('input[name="finish_pk"]')).sendKeys(finish_pk_after_repair);
            })
            .then(angularWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount7', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_uploading_places').getTotalRows()
                    .then(function (countAfterAdd) {
                        if (isExistsRows) {
                            // console.log('if countAfterAdd8', countAfterAdd, 'numOfRows', numOfRows)
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            // console.log('else countAfterAdd8', countAfterAdd, 'numOfRows', numOfRows)
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

// 13. Перейти во вкладку "Инженерные сооружения"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.",
// "км ок.", "пк+ ок.", "Протяженность", "Общая длина пролетов" значениями, сохраненными в п.9, выбрать 1ые значения из выпадающего списка для полей "Тип" и "Конструкция",
//  нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1. Если строка уже существует обновить поля "Тип", "Конструкция", "Общая длина пролетов"
//  Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('13. Перейти во вкладку "Инженерные сооружения", заполнить данные по таблице. ##can_continue', function (done) {
        return $h.form.getForm(['track_constructions'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_constructions"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_constructions').getTotalRows();    //таблица "Инженерные сооружения"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_constructions"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_constructions').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_8 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_km"]')).click();
                            elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                            elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(Math.ceil(start_pk_ar));
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                            elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                            elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(Math.floor(finish_pk_after_repair));
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="distance"]')).click();
                            elementMain.element(by.css('input[name="distance"]')).clear().sendKeys(distance_after_repair);
                        })
                        .then(function () {
                            return element(by.css('[data-container-for="is_bbc_machine_canwork"] [name="is_bbc_machine_canwork"]')).click();
                        })
                        .then(function () {
                            return element(by.css('[data-container-for="is_leveling_machine_canwork"] [name="is_leveling_machine_canwork"]')).click();
                        })
                }
            })
            .then(function () {
                return element(by.css('[data-container-for="construction_type.displayValue"]')).click()
                    .then(expliciteWait)
                    .then(function () {
                        return element.all(by.css('[class="select2-result-label"]')).first().click();
                    })
            })
            .then(function () {
                return element(by.css('[data-container-for="construction_type_sign.displayValue"]')).click()
                    .then(expliciteWait)
                    .then(function () {
                        return element.all(by.css('[class="select2-result-label"]')).last().click();
                    })
            })
            .then(function () {
                elementMain.element(by.css('[data-container-for="span_length"]')).click();
                elementMain.element(by.css('input[name="span_length"]')).clear();
                elementMain.element(by.css('[data-container-for="span_length"]')).click();
                elementMain.element(by.css('input[name="span_length"]')).sendKeys(distance_after_repair);
            })
            .then(expliciteWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount8', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_constructions').getTotalRows()
                    .then(function (countAfterAdd) {
                        // console.log('countAfterAdd9', countAfterAdd, 'numOfRows', numOfRows)
                        if (isExistsRows) {
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

// 14. Перейти во вкладку "Балласт, разделительный слой". Для таблицы "Разделительный слой" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных.
// Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", значениями сохраненными в п.9, выбрать 1ое значение из выпадающего списка для поля "Тип" и нажать кнопку "Сохранить"
// Проверить, что количество записей в таблице увеличилось на 1. Если строка уже существует обновить поле "Тип". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// Для таблицы "Глубина очистки/вырезки балласта" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля ""км. н", "пк+ н.", "км ок.",
// "пк+ ок.", "Глубина очистки" значениями сохраненными в п.9 и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1.
// Если строка уже существует обновить поле "Глубина очистки". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('14. Перейти во вкладку "Балласт, разделительный слой". Редактировать/заполниь таблицы "Разделительный слой" и "Глубина очистки/вырезки балласта". ##can_continue', function (done) {
        return $h.form.getForm(['track_sep_layer'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_sep_layer"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_sep_layer').getTotalRows();    //таблица "Разделительный слой"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_sep_layer"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_sep_layer').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_9 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_km"]')).click();
                            elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                            elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(Math.ceil(start_pk_ar));
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                            elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                            elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
                        })
                }
            })
            .then(function () {
                return element(by.css('[data-container-for="sep_layer_type.displayValue"]')).click()
                    .then(expliciteWait)
                    .then(function () {
                        return element.all(by.css('[class="select2-result-label"]')).first().click();
                    })
            })
            .then(expliciteWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount9', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_sep_layer').getTotalRows()
                    .then(function (countAfterAdd) {
                        // console.log('countAfterAdd10', countAfterAdd, 'numOfRows', numOfRows)
                        if (isExistsRows) {
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_ballast_depth"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_ballast_depth').getTotalRows();    //таблица "Глубина очистки/вырезки балласта"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_ballast_depth"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_ballast_depth').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_11 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_km"]')).click();
                            elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                            elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                            elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                            elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
                        })
                }
            })
            .then(function () {
                elementMain.element(by.css('[data-container-for="reclaiming_depth"]')).click();
                elementMain.element(by.css('input[name="reclaiming_depth"]')).clear();
                elementMain.element(by.css('[data-container-for="reclaiming_depth"]')).click();
                elementMain.element(by.css('input[name="reclaiming_depth"]')).sendKeys(start_pk_ar);
            })
            .then(expliciteWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount10', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_ballast_depth').getTotalRows()
                    .then(function (countAfterAdd) {
                        if (isExistsRows) {
                            // console.log('if countAfterAdd11', countAfterAdd, 'numOfRows', numOfRows)
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            // console.log('else countAfterAdd11', countAfterAdd, 'numOfRows', numOfRows)
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

// 15. Перейти во вкладку "Точечные объекты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км", "пк+", значениями
// сохраненными в п.9, выбрать 1ое значения из выпадающего списка для поля "Тип" и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// Если строка уже существует обновить поле "Тип". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('15. Перейти во вкладку "Точечные объекты", заполнить данные по таблице. ##can_continue', function (done) {
        return $h.form.getForm(['track_point_object'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_point_object"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_point_object').getTotalRows();    //таблица "Точечные объекты"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_point_object"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_point_object').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_12 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="km"]')).click();
                            elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="pk"]')).click();
                            elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(start_pk_ar);
                        })
                }
            })
            .then(function () {
                return element(by.css('[data-container-for="point_object_type.displayValue"]')).click()
                    .then(expliciteWait)
                    .then(function () {
                        return element.all(by.css('[class="select2-result-label"]')).first().click();
                    })
            })
            .then(expliciteWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount11', resCount, 'countMistakes', countMistakes)
                    // expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_point_object').getTotalRows()
                    .then(function (countAfterAdd) {
                        // console.log('countAfterAdd12', countAfterAdd, 'numOfRows', numOfRows)
                        if (isExistsRows) {
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

// 16. Перейти во вкладку "Стрелочные переводы и блокпосты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км остряка",
// "пк+ остряка", значениями сохраненными в п.9, "Номер проетка" установить равным 1683.00.000, выбрать 1ое значения из выпадающего списка для поля "Четоность" и нажать кнопку "Сохранить".
// Проверить, что количество записей в таблице увеличилось на 1. Если строка уже существует обновить поле "Четоность".
// Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('16. Перейти во вкладку "Стрелочные переводы и блокпосты", заполнить данные по таблице. ##can_continue', function (done) {
        return $h.form.getForm(['track_turnout'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                elementMain = element(by.css('[data-field-name="track_turnout"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_turnout').getTotalRows();    //таблица "Стрелочные переводы"
            })
            .then(function (count) {
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_turnout"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            return $h.grid.subgrid('track_turnout').getTotalRows();
                        })
                        // .then(function (countAfterAdd) {
                        //     console.log('countAfterAdd_13 =', countAfterAdd)
                        //     expect(countAfterAdd).toBe(numOfRows + 1);
                        // })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="km"]')).click();
                            elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="pk"]')).click();
                            elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(start_pk_ar);
                        })
                        .then(function () {
                            element(by.css('[data-container-for="project_num.displayValue"]')).click();
                        })
                        .then(angularWait)
                        .then(expliciteWait)
                        .then(function () {
                            element(by.css('#select2-drop:not([style*=\"display: none\"]) .select2-input')).sendKeys('1683.00.000');
                        })
                        .then(angularWait)
                        .then(expliciteWait)
                        .then(function () {
                            element.all(by.css('#select2-drop:not([style*=\"display: none\"]) .select2-results li.select2-result-selectable')).first().click();
                        })
                        .then(function () {
                            elementMain.element(by.css('[data-container-for="distance"]')).click();
                            elementMain.element(by.css('input[name="distance"]')).clear().sendKeys(distance_after_repair);
                        })
                        .then(function () {
                            return element(by.css('[data-container-for="replacement_required"] [name="replacement_required"]')).click();
                        })
                }
            })
            .then(function () {
                return element(by.css('[data-container-for="odevity.displayValue"]')).click()
                    .then(expliciteWait)
                    .then(function () {
                        return element.all(by.css('[class="select2-result-label"]')).first().click();
                    })
            })
            .then(expliciteWait)
            .then(function () {
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    // console.log('resCount12', resCount, 'countMistakes', countMistakes)
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                return $h.grid.subgrid('track_turnout').getTotalRows()
                    .then(function (countAfterAdd) {
                        if (isExistsRows) {
                            // console.log('if countAfterAdd13', countAfterAdd, 'numOfRows', numOfRows)
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            // console.log('else countAfterAdd13', countAfterAdd, 'numOfRows', numOfRows)
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                        isExistsRows = false;
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 17) Открыть номер проекта - НЕ НУЖЕН, заполняем вручную, тк справочник
    // it('17. Открыть номер проекта. ##can_continue', function (done) {
    //     browser.waitForAngular()
    //         .then(function () {
    //             return element(by.css('[data-field="project_num data-pkfieldid="]')).getText().then(function (text) {
    //                 projectNum = text;
    //             })
    //         })
    //         .then(function () {
    //             return element(by.cssContainingText(' .left-align', projectNum)).getWebElement()
    //                 // return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid) + '\"]')).first().getWebElement()
    //                 .then(function (event) {
    //                     browser.actions().doubleClick(event).perform();
    //                     return browser.waitForAngular();
    //                 })
    //         })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(function () {
    //             element(by.css('[idea-field-name="project_num"] [ng-click="$ctrl.focusElement()"]')).click();
    //         })
    //         .then(function () {
    //             console.log('заполнение полей')
    //             return $h.form.setForm({
    //                 total_length: start_km_ar,
    //                 start_pk_ar: start_pk_ar,
    //                 finish_km_after_repair: finish_km_after_repair,
    //                 finish_pk_after_repair: finish_pk_after_repair,
    //             })
    //         })
    //
    //         // .then(function () {
    //         //     return $h.form.processButton(['Выполнить']);    // нажать Выполнить
    //         // })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         // .then(function () {
    //         //     return $h.form.getForm(['workflowstepid']);
    //         // })
    //         // .then(function (form) {
    //         //     return expect(form.workflowstepid.displayValue).toBe('Выполнен');   //Проверить что статус изменился на Выполнен
    //         // })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(done);
    // }, skip);

    // 17. В Осмотре участка нажимаем на кнопку "Сохранить". Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    it('17. В Осмотре участка нажимаем на кнопку "Сохранить". Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', function (done) {
        return angularWait()
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


// 18. Вернуться к задаче в Моих нарядах (отфильтровать и открыть нужное по Id сохранненному в п.3) и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось на "Выполнен",
// нажать кнопку "Назад".
    it('18. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось на "Выполнен". ##can_continue', function (done) {
        // console.log('9 Вернуться к задаче и нажать на кнопку Выполнить.');
        browser.waitForAngular()
            .then(function () {
                return browser.get(protractor.helpers.url + '/#/my_tasks_dept')
                    .then(angularWait)
                    .then(expliciteWait)
            })
            .then(function () {
                // console.log('фильтруем задачи');
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
                        value: Number(protractor.helpers.taksUid)
                        // value: taksUid
                    }
                ])
            })
            .then(function () {
                // return element.all(by.css('[data-pkfieldid=\"' + String(taksUid) + '\"]')).first().getWebElement()
                return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid) + '\"]')).first().getWebElement()
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
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.processButton(['BACK']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 19. Выходим из системы
    it('19. Выходим из системы', function (done) {
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


// Автотест на Осмотр участка.
// 0. Выполняем сценарии на логин под КраснДРП, создание ДПГ, получение титула, распределению по ПМС
// 1. Заходим в систему под ПМС197_Менеджер
// 2. Проверяем что находимся на странице Мои наряды. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача.
// 3. Выбираем наряды "Осмотр участка" и открываем первый наряд из группы "Назначить исполнителя". Убеждаемся, что запись открылась, текущий статус "запланирован", поле "Исполнитель" доступен для заполнения, есть кнопка "Сохранить" и "Назад".
// 4. В наряде указываем исполнителя "Медведев А.О." и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение.
// 5. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
// 6. Переходим по ссылке "Заполнить данные по осмотру участка". Убеждаемся, что в открывшемся окне имеются поля: " Специализация жд линии", "Темп. амплитуда", "ПМС" и кнопки "Расчет МВСП", "Сохранить", "Назад", "Получить шаблон осмотра"
// 7. Заполнить обязательные поля на вкладке "Общая информация"
// 8. Перейти во вкладку "Верхнее строение пути" поля в разделе "До ремонта", заполнить обязательные поля.
// 9. Перейти во вкладку "Протяженность участка", заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." в разделе "После ремонта". Нажать кнопку "Добавить запись"
// под таблицей "Нестандартные километры", убедится, что появилась строка с формами для ввода данных (количество записей в таблице увеличилось на 1).
// Заполнить поля "км", "Количество пикетов" значениями "км. н." и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// Если запись в таблице уже существует, обновить значение "пк+ ок.". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// 10. Перейти во вкладку "Протяженность рельсов", нажать кнопку "Добавить запись" таблицы, убедится, что появилась строка с формами для ввода данных.
// Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", "Тип" (указать первый из выпадающего списка) и нажать кнопку "Сохранить". Проверить, что количество записей в таблице
// увеличилось на 1. Если запись в таблице уже существует, обновить поле "Тип" из выпадающего списка. Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// 11. Перейти во вкладку "План и профиль пути". Для таблицы План пути нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных.
// Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями, сохраненными в п.9, также заполнить "Радиус", "Длина", Возвышение","Сторонность".
// Если строка уже существует обновить поле "Сторонность". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// Для таблицы Профиль пути нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", "%0".
// Если строка уже существует обновить поле "%0". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// 12. Перейти во вкладку "Ситуация". Для таблицы "Ситуация" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данныхю.
// Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями, сохраненными в п.9, выбрать 1ое значение из выпадающего списка для поля "Тип", установать/снять флажки с полей
// "Потребность МКТ" и "Высота>4м", нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1.
// Если строка уже существует установать/снять флаг с поля "Высота>4м". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// Для таблицы "Места выгрузки" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок."
// значениями, сохраненными в п.9 и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1.
// Если строка уже существует обновить поле "пк+ ок.". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// 13. Перейти во вкладку "Инженерные сооружения"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.",
// "км ок.", "пк+ ок.", "Протяженность", "Общая длина пролетов" значениями, сохраненными в п.9, выбрать 1ые значения из выпадающего списка для полей "Тип" и "Конструкция",
//  нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1. Если строка уже существует обновить поля "Тип", "Конструкция", "Общая длина пролетов"
//  Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// 14. Перейти во вкладку "Балласт, разделительный слой". Для таблицы "Разделительный слой" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных.
// Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", значениями сохраненными в п.9, выбрать 1ое значение из выпадающего списка для поля "Тип" и нажать кнопку "Сохранить"
// Проверить, что количество записей в таблице увеличилось на 1. Если строка уже существует обновить поле "Тип". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// Для таблицы "Глубина очистки/вырезки балласта" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля ""км. н", "пк+ н.", "км ок.",
// "пк+ ок.", "Глубина очистки" значениями сохраненными в п.9 и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1.
// Если строка уже существует обновить поле "Глубина очистки". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// 15. Перейти во вкладку "Точечные объекты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км", "пк+", значениями
// сохраненными в п.9, выбрать 1ое значения из выпадающего списка для поля "Тип" и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// Если строка уже существует обновить поле "Тип". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// 16. Перейти во вкладку "Стрелочные переводы и блокпосты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км остряка",
// "пк+ остряка", значениями сохраненными в п.9, "Номер проетка" установить равным 1683.00.000, выбрать 1ое значения из выпадающего списка для поля "Четоность" и нажать кнопку "Сохранить".
// Проверить, что количество записей в таблице увеличилось на 1. Если строка уже существует обновить поле "Четоность".
// Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// 17. Вернуться к задаче в Моих нарядах (отфильтровать и открыть нужное по Id сохранненному в п.3) и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось на "Выполнен",
// нажать кнопку "Назад".
// 18. Выходим из системы