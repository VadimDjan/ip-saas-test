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

    let taksUid = 47723;
    let numOfRows = 0;

    let start_km_ar = 4421;
    let start_pk_ar = 10.52;
    let finish_km_after_repair = 4431;
    let finish_pk_after_repair = 9.57;
    let distance_after_repair = 9.905;
    let gradient = 12.9;
    let radius = 280;
    let length = 450;
    let raising = 5;
    let elementMain = null;
    let isExistsRows = false;
    let countMistakes = 0;

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
                // value: taksUid
            }
        ])
            .then(function () {
                // return element.all(by.css('[data-pkfieldid=\"' + String(taksUid) + '\"]')).first().getWebElement()
                    return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid + 2) + '\"]')).first().getWebElement()
                    .then(function (event) {
                        browser.actions().doubleClick(event).perform();
                        return browser.waitForAngular();
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function (res) {
                // console.log("Проверка кнопок")
                // expect(element(by.css('[data-button-name="UPDATE"]')).isPresent()).toBe(true);   // Проверить что есть кнопка Сохранить
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
            assignedto: 'Богданов В.Л.'
            // assignedto: 'Вернер А.А.'
        })
            .then(angularWait)
            .then(expliciteWait)
            // .then(function () {
            //     // return $h.form.processButton(['CREATE', 'UPDATE']);
            //     return $h.form.processButton(['UPDATE']);   //жмем на кнопку Сохранить
            // })
            // .then(function () {
            //     expect(element(by.css('[class="ui-notification alert ng-scope alert-success killed"]')).isPresent()).toBe(true)  // Справа наверху возникло зеленое сообщение
            // })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 5) Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
    // it('5. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось. ##can_continue', function (done) {
    //     return $h.form.processButton(['В работу'])
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(function () {
    //             return $h.form.getForm(['workflowstepid']);
    //         })
    //         .then(function (form) {
    //             // console.log('form   ****', form)
    //             // console.log('form.workflowstepid.displayValue   *******', form.workflowstepid.displayValue)
    //             expect(form.workflowstepid.displayValue).toBe('Запланирован');
    //         })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(done);
    // }, skip);

    // 6) Переходим по ссылке "Заполнить данные по осмотру участка". Убеждаемся, что в открывшемся окне имеются поля: "Тип Рельс", "Тип шпал", "Скрепления" и кнопки "Расчет МВСП", "Сохранить", "Назад", "Получить шаблон осмотра"
    it('6. Переходим по ссылке "Заполнить данные по осмотру участка". ##can_continue', function (done) {
        console.log('6. Переходим по ссылке "Заполнить данные по осмотру участка');
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
                expect(element(by.css('[idea-field-name="rail_brand_br"]')).getText()).toBe('Тип рельсов');   // Проверить что есть поле "Тип рельсов"
                expect(element(by.css('[idea-field-name="sleeper_br"]')).getText()).toBe('Тип шпал');   // Проверить что есть поле "Тип шпал"
                expect(element(by.css('[idea-field-name="clips_br"]')).getText()).toBe('Cкрепления');   // Проверить что есть поле "Cкрепления"
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    // 7)  Заполнить по кладке "Верхнее строение пути" поля в разделе "До ремонта"
    // it('7.  Заполнить по кладке "Верхнее строение пути" поля в разделе "До ремонта". ##can_continue', function (done) {
    //     console.log('7.  Заполнить по кладке "Верхнее строение пути" поля в разделе "До ремонта"');
    //     return $h.form.setForm({
    //         rail_brand_br: 'Р65 СГ I',
    //         clips_br: 'W-30',
    //         sleeper_br: 'Ш АРС-МК/АРС-04.07.003-II-ПД',
    //         ballast_br: 'gravel',
    //         sep_layer_br: 'Георешетка',
    //         signal_system_br: 'semi_automatic',
    //         dirtyness: 34,
    //         trackform_br: 'course',
    //         rail_situation: 'new',
    //         sleeper_situation: 'new',
    //         clips_situation: 'new'
    //     })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         // .then(function () {
    //         //     // return $h.form.processButton(['CREATE', 'UPDATE']);
    //         //     return $h.form.processButton(['UPDATE']);   //жмем на кнопку Сохранить
    //         // })
    //         // .then(function () {
    //         //     expect(element(by.css('[class="ui-notification alert ng-scope alert-success killed"]')).isPresent()).toBe(true)  // Справа наверху возникло зеленое сообщение
    //         // })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(done);
    // }, skip);

// 8) Перейти во вкладку "Протяженность участка", заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." в разделе "После ремонта".
// нажать кнопку "Добавить запись" под таблицей "Нестандартные километры", убедится, что появилась строка с формами для ввода данных
// (количество записей в таблице увеличилось на 1).  Заполнить поля "км", "Количество пикетов" значениями "км. н." и нажать кнопку "Сохранить"
// Проверить, что количество записей в таблице увеличилось на 1
//     it('8. Перейти во вкладку "Протяженность участка", заполнить поля и поля таблиц: "Нестандартные километры"/"Нестандартные пикеты". ##can_continue', function (done) {
//         console.log('8) Перейти во вкладку "Протяженность участка')
//         return $h.form.getForm(['before_repair_label_1'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log('заполнение полей')
//                 return $h.form.setForm({
//                     start_km_ar: start_km_ar,
//                     start_pk_ar: start_pk_ar,
//                     finish_km_after_repair: finish_km_after_repair,
//                     finish_pk_after_repair: finish_pk_after_repair,
//                 })
//             })
//             .then(function () {
//                 console.log("Сохранит элемент unusual_km")
//                 elementMain = element(by.css('[data-field-name="unusual_km"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('unusual_km').getTotalRows();    //таблица "Нестандартные километры"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="unusual_km"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('unusual_km').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         // .then(angularWait)
//                         // .then(expliciteWait)
//                         .then(function () {
//                             console.log('Заполнить км');
//                             elementMain.element(by.css('[data-container-for="km"]')).click();
//                             elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Очистить и Заполнить кол-во (пк + 1)');
//                 elementMain.element(by.css('[data-container-for="pk_count"]')).click();
//                 elementMain.element(by.css('input[name="pk_count"]')).clear();
//                 elementMain.element(by.css('[data-container-for="pk_count"]')).click();
//                 elementMain.element(by.css('input[name="pk_count"]')).sendKeys(start_pk_ar);
//             })
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             // .then(angularWait)
//             // .then(expliciteWait)
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('unusual_km').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(function () {
//                 console.log("Сохранит элемент unusual_pk")
//                 elementMain = element(by.css('[data-field-name="unusual_pk"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('unusual_pk').getTotalRows();        //таблица "Нестандартные пикеты"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="unusual_pk"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('unusual_km').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         // .then(angularWait)
//                         // .then(expliciteWait)
//                         .then(function () {
//                             console.log('Заполнить км');
//                             elementMain.element(by.css('[data-container-for="km"]')).click();
//                             elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк');
//                             elementMain.element(by.css('[data-container-for="pk"]')).click();
//                             elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(start_pk_ar);
//
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Заполнить протяженнсоть');
//                 elementMain.element(by.css('[data-container-for="distance"]')).click();
//                 elementMain.element(by.css('input[name="distance"]')).clear();
//                 elementMain.element(by.css('[data-container-for="distance"]')).click();
//                 elementMain.element(by.css('input[name="distance"]')).sendKeys((distance_after_repair + 1));
//
//             })
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('unusual_pk').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);

// 9) Перейти во вкладку "Протяженность рельсов", нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных
//  Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", Тип (указать первый из выпадающего списка) и нажать кнопку "Сохранить"
// Проверить, что количество записей в таблице увеличилось на 1
//     it('9. Перейти во вкладку "Протяженность рельсов", нажать кнопку "Добавить запись". ##can_continue', function (done) {
//         console.log('9. Перейти во вкладку "Протяженность рельсов')
//         return $h.form.getForm(['track_rail_distance'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Сохранит элемент track_rail_distance")
//                 elementMain = element(by.css('[data-field-name="track_rail_distance"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_rail_distance').getTotalRows();    //таблица "Нестандартные километры"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="track_rail_distance"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('track_rail_distance').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             console.log('Заполнить км н');
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк н');
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить км ок');
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк ок');
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
//                         })
//                 }
//             })
//
//             .then(function () {
//                 console.log('Выбираем Тип из выбадающего списка')
//                 return element(by.css('[data-container-for="track_type.displayValue"]')).click()
//                     .then(expliciteWait)
//                     .then(function () {
//                         return element.all(by.css('[class="select2-result-label"]')).last().click();
//                     })
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('track_rail_distance').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);

    // 10) Перейти во вкладку "План и профиль пути". Для таблицы План пути нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данныхю  Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями,
// сохраненными в п.8, указать значение 100 для полей "Радиус", "Длина", Возвышение",  выбрать 1ое значение из выпадающего списка для поля "Сторонность" и нажать кнопку "Сохранить"
//     it('10. Перейти во вкладку "План и профиль пути". Для таблицы План пути нажать кнопку "Добавить запись". ##can_continue', function (done) {
//         console.log('10. Перейти во вкладку "План и профиль пути"')
//         return $h.form.getForm(['track_grading'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Сохранит элемент track_grading")
//                 elementMain = element(by.css('[data-field-name="track_grading"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_grading').getTotalRows();    //таблица "Профиль пути"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="track_grading"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('track_grading').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             console.log('Заполнить км н');
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк н');
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить км ок');
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк ок');
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить Радиус');
//                             elementMain.element(by.css('[data-container-for="radius"]')).click();
//                             elementMain.element(by.css('input[name="radius"]')).clear().sendKeys(radius);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить Длина');
//                             elementMain.element(by.css('[data-container-for="length"]')).click();
//                             elementMain.element(by.css('input[name="length"]')).clear().sendKeys(length);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить Возвышение');
//                             elementMain.element(by.css('[data-container-for="raising"]')).click();
//                             elementMain.element(by.css('input[name="raising"]')).clear().sendKeys(raising);
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Заполнить %(+/-)');
//                 elementMain.element(by.css('[data-container-for="gradient"]')).click();
//                 elementMain.element(by.css('input[name="gradient"]')).clear();
//                 elementMain.element(by.css('[data-container-for="gradient"]')).click();
//                 elementMain.element(by.css('input[name="gradient"]')).sendKeys(gradient);
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('track_grading').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Сохранит элемент track_topology")
//                 elementMain = element(by.css('[data-field-name="track_topology"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_topology').getTotalRows();    //таблица "План пути"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="track_topology"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('track_topology').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             console.log('Заполнить км н');
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк н');
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить км ок');
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк ок');
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить Радиус');
//                             elementMain.element(by.css('[data-container-for="radius"]')).click();
//                             elementMain.element(by.css('input[name="radius"]')).clear().sendKeys(radius);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить Длина');
//                             elementMain.element(by.css('[data-container-for="length"]')).click();
//                             elementMain.element(by.css('input[name="length"]')).clear().sendKeys(length);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить Возвышение');
//                             elementMain.element(by.css('[data-container-for="raising"]')).click();
//                             elementMain.element(by.css('input[name="raising"]')).clear().sendKeys(raising);
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Выбираем сторонность из выбадающего списка')
//                 return elementMain.element(by.css('[data-container-for="sidedness.displayValue"]')).click().then(function () {
//                     element.all(by.css('[class="select2-result-label"]')).first().click().then(expliciteWait)
//                 })
//             })
//             .then(angularWait)
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество строк ПОСЛЕ")
//                 return $h.grid.subgrid('track_topology').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);

// 11) Перейти во вкладку "Ситуация". Для таблицы "Ситуация" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данныхю  Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями,
// сохраненными в п.8,  выбрать 1ое значение из выпадающего списка для поля "Тип" и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// 15) Для таблицы "Места выгрузки" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок."
// значениями, сохраненными в п.8 и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
//     it('11. Перейти во вкладку "Ситуация". Заполнить поля таблиц: "Ситуация" и "Места выгрузки". ##can_continue', function (done) {
//         console.log('11. Перейти во вкладку "Ситуация"')
//         return $h.form.getForm(['track_situation'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Сохранит элемент track_situation")
//                 elementMain = element(by.css('[data-field-name="track_situation"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_situation').getTotalRows();    //таблица "Ситуация"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="track_situation"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('track_situation').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             console.log('Заполнить км н');
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк н');
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить км ок');
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк ок');
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Выбираем Тип из выбадающего списка')
//                             return element(by.css('[data-container-for="situation_type.displayValue"]')).click()
//                                 .then(expliciteWait)
//                                 .then(function () {
//                                     return element.all(by.css('[class="select2-result-label"]')).first().click();
//                                 })
//                         })
//                         .then(function () {
//                             console.log('Ставим галку Потребность МКТ')
//                             return element(by.css('[data-container-for="is_ditch_machine_required"] [name="is_ditch_machine_required"]')).click();
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Снять/поставить галку Высота>4м')
//                 return element(by.css('[data-container-for="is_higher_then4m"] [name="is_higher_then4m"]')).click();
//             })
//             .then(angularWait)
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('track_situation').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Сохранит элемент track_uploading_places")
//                 elementMain = element(by.css('[data-field-name="track_uploading_places"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_uploading_places').getTotalRows();    //таблица "Места выгрузки"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="track_uploading_places"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('track_uploading_places').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             console.log('Заполнить км н');
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк н');
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить км ок');
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Заполнить пк ок');
//                 elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                 elementMain.element(by.css('input[name="finish_pk"]')).clear();
//                 elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                 elementMain.element(by.css('input[name="finish_pk"]')).sendKeys(finish_pk_after_repair);
//             })
//             .then(angularWait)
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('track_uploading_places').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);

    // 16) Перейти во вкладку "Инженерные сооружения"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км ок." = "км. н",
// "пк+ ок." = "пк+ н.", значениями сохраненными в п.8, выбрать 1ые значения из выпадающего списка для полей "Тип" и "Конструкция", указать 1 для "Протяженность" и нажать кнопку "Сохранить"
// Проверить, что количество записей в таблице увеличилось на 1
//     it('16. Перейти во вкладку "Инженерные сооружения", нажать кнопку "Добавить запись". ##can_continue', function (done) {
//         console.log('16. Перейти во вкладку "Инженерные сооружения"')
//         return $h.form.getForm(['track_constructions'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Сохранит элемент track_constructions")
//                 elementMain = element(by.css('[data-field-name="track_constructions"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_constructions').getTotalRows();    //таблица "Инженерные сооружения"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="track_constructions"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('track_constructions').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             console.log('Заполнить км н');
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк н');
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить км ок');
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк ок');
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Выбираем Тип из выбадающего списка')
//                             return element(by.css('[data-container-for="construction_type.displayValue"]')).click()
//                                 .then(expliciteWait)
//                                 .then(function () {
//                                     return element.all(by.css('[class="select2-result-label"]')).first().click();
//                                 })
//                         })
//                         .then(function () {
//                             console.log('Заполнить Протяженность км');
//                             elementMain.element(by.css('[data-container-for="distance"]')).click();
//                             elementMain.element(by.css('input[name="distance"]')).clear().sendKeys(distance_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить Общая длина км');
//                             elementMain.element(by.css('[data-container-for="span_length"]')).click();
//                             elementMain.element(by.css('input[name="span_length"]')).clear().sendKeys(distance_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Ставим галку Работа ЩОМ')
//                             return element(by.css('[data-container-for="is_bbc_machine_canwork"] [name="is_bbc_machine_canwork"]')).click();
//                         })
//                         .then(function () {
//                             console.log('Ставим галку Работа ВПО')
//                             return element(by.css('[data-container-for="is_leveling_machine_canwork"] [name="is_leveling_machine_canwork"]')).click();
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Выбираем Конструкцию из выбадающего списка')
//                 return element(by.css('[data-container-for="construction_type_sign.displayValue"]')).click()
//                     .then(expliciteWait)
//                     .then(function () {
//                         return element.all(by.css('[class="select2-result-label"]')).last().click();
//                     })
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('track_constructions').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);

    // 17) Перейти во вкладку "Балласт, разделительный слой"
// 18) Для таблицы "Разделительный слой" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км ок." = "км. н",
// // "пк+ ок." = "пк+ н.", значениями сохраненными в п.8, выбрать 1ые значения из выпадающего списка для полей "Тип" и нажать кнопку "Сохранить"
// // Проверить, что количество записей в таблице увеличилось на 1
// 19) Для таблицы "Глубина очистки/вырезки балласта" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км ок." = "км. н",
// // // "пк+ ок." = "пк+ н.", значениями сохраненными в п.8, указать 55 для "Глубина очистки" и нажать кнопку "Сохранить"
// // // Проверить, что количество записей в таблице увеличилось на 1
//     it('17. Перейти во вкладку "Балласт, разделительный слой". ##can_continue', function (done) {
//         console.log('17. Перейти во вкладку "Балласт, разделительный слой')
//         return $h.form.getForm(['track_sep_layer'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Сохранит элемент track_sep_layer")
//                 elementMain = element(by.css('[data-field-name="track_sep_layer"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_sep_layer').getTotalRows();    //таблица "Разделительный слой"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="track_sep_layer"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('track_sep_layer').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             console.log('Заполнить км н');
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк н');
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить км ок');
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк ок');
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Выбираем Тип из выбадающего списка')
//                 return element(by.css('[data-container-for="sep_layer_type.displayValue"]')).click()
//                     .then(expliciteWait)
//                     .then(function () {
//                         return element.all(by.css('[class="select2-result-label"]')).first().click();
//                     })
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('track_sep_layer').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Сохранит элемент track_ballast_depth")
//                 elementMain = element(by.css('[data-field-name="track_ballast_depth"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_ballast_depth').getTotalRows();    //таблица "Глубина очистки/вырезки балласта"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="track_ballast_depth"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('track_ballast_depth').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             console.log('Заполнить км н');
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк н');
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
//
//                         })
//                         .then(function () {
//                             console.log('Заполнить км ок');
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк ок');
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Заполнить Глубина очистки');
//                 elementMain.element(by.css('[data-container-for="reclaiming_depth"]')).click();
//                 elementMain.element(by.css('input[name="reclaiming_depth"]')).clear();
//                 elementMain.element(by.css('[data-container-for="reclaiming_depth"]')).click();
//                 elementMain.element(by.css('input[name="reclaiming_depth"]')).sendKeys(start_pk_ar);
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('track_ballast_depth').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);

    // 20) Перейти во вкладку "Точечные объекты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км", "пк+", значениями
// сохраненными в п.8, выбрать 1ые значения из выпадающего списка для полей "Тип" и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
//     it('20. Перейти во вкладку "Точечные объекты". Нажать кнопку "Добавить запись". ##can_continue', function (done) {
//         console.log('20. Перейти во вкладку "Точечные объекты"')
//         return $h.form.getForm(['track_point_object'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Сохранит элемент track_point_object")
//                 elementMain = element(by.css('[data-field-name="track_point_object"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_point_object').getTotalRows();    //таблица "Точечные объекты"
//             })
//             .then(function (count) {
//                 console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Изменить")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                             element.all(by.css('[data-field-name="track_point_object"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             console.log("Нажать Добавить запись")
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             console.log("количество ПОСЛЕ")
//                             return $h.grid.subgrid('track_point_object').getTotalRows();
//                         })
//                         .then(function (countAfterAdd) {
//                             console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             console.log('Заполнить км н');
//                             elementMain.element(by.css('[data-container-for="km"]')).click();
//                             elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             console.log('Заполнить пк н');
//                             elementMain.element(by.css('[data-container-for="pk"]')).click();
//                             elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(start_pk_ar);
//
//                         })
//                 }
//             })
//             .then(function () {
//                 console.log('Выбираем Тип из выбадающего списка')
//                 return element(by.css('[data-container-for="point_object_type.displayValue"]')).click()
//                     .then(expliciteWait)
//                     .then(function () {
//                         return element.all(by.css('[class="select2-result-label"]')).first().click();
//                     })
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 console.log("Нажать Сохранить")
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 console.log("количество ошибок")
//                 element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 console.log("количество ПОСЛЕ")
//                 return $h.grid.subgrid('track_point_object').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);

    // 21) Перейти во вкладку "Стрелочные переводы и блокпосты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км остряка",
// "пк+ остряка", значениями сохраненными в п.8,  выбрать 1ые значения из выпадающего списка для полей "Номер проетка", "Четоность" и нажать кнопку "Сохранить".
// Проверить, что количество записей в таблице увеличилось на 1
    it('21. Перейти во вкладку "Стрелочные переводы и блокпосты". Нажать кнопку "Добавить запись". ##can_continue', function (done) {
        console.log('21. Перейти во вкладку "Стрелочные переводы и блокпосты"')
        return $h.form.getForm(['track_turnout'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                console.log("Сохранит элемент track_turnout")
                elementMain = element(by.css('[data-field-name="track_turnout"]'));
            })
            .then(function () {
                return $h.grid.subgrid('track_turnout').getTotalRows();    //таблица "Стрелочные переводы"
            })
            .then(function (count) {
                console.log('Есть ли запись? Количество строк ДО нажатия Добавить запись', count)
                numOfRows = count;

                if (count > 0) {
                    return angularWait()
                        .then(function () {
                            console.log("Нажать Изменить")
                            browser.executeScript('window.scrollTo(0,0);');
                            isExistsRows = true;
                            element.all(by.css('[data-field-name="track_turnout"] [class="k-button k-button-icontext k-grid-edit"]')).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            console.log("Нажать Добавить запись")
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
                        })
                        .then(angularWait)
                        .then(function () {
                            console.log("количество ПОСЛЕ")
                            return $h.grid.subgrid('track_turnout').getTotalRows();
                        })
                        .then(function (countAfterAdd) {
                            console.log('Количество строк ПОСЛЕ нажатия Добавить запись', countAfterAdd)
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        })
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                        })
                        .then(function () {
                            console.log('Заполнить км о');
                            elementMain.element(by.css('[data-container-for="km"]')).click();
                            elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
                        })
                        .then(function () {
                            console.log('Заполнить пк о');
                            elementMain.element(by.css('[data-container-for="pk"]')).click();
                            elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(start_pk_ar);
                        })
                        .then(function () {
                            console.log('Выбираем Номер проекта из выбадающего списка')
                            return element(by.css('[data-container-for="project_num.displayValue"]')).click()
                                .then(expliciteWait)
                                .then(function () {
                                    return element.all(by.css('[class="select2-result-label"]')).first().click();
                                })
                        })
                        .then(function () {
                            console.log('Заполнить Протяженность км');
                            elementMain.element(by.css('[data-container-for="distance"]')).click();
                            elementMain.element(by.css('input[name="distance"]')).clear().sendKeys(distance_after_repair);
                        })
                        .then(function () {
                            console.log('Ставим галку Требуется замена')
                            return element(by.css('[data-container-for="replacement_required"] [name="replacement_required"]')).click();
                        })
                }
            })
            .then(function () {
                console.log('Выбираем Четность из выбадающего списка')
                return element(by.css('[data-container-for="odevity.displayValue"]')).click()
                    .then(expliciteWait)
                    .then(function () {
                        return element.all(by.css('[class="select2-result-label"]')).first().click();
                    })
            })
            .then(expliciteWait)
            .then(function () {
                console.log("Нажать Сохранить")
                elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
            })
            .then(function () {
                console.log("количество ошибок")
                element.all(by.css('[class="ui-notification alert ng-scope alert-danger killed"]')).count().then(function (resCount) {
                    expect(resCount).toBe(countMistakes);
                    countMistakes = resCount;
                })
            })
            .then(function () {
                console.log("количество ПОСЛЕ")
                return $h.grid.subgrid('track_turnout').getTotalRows()
                    .then(function (countAfterAdd) {
                        console.log('Количество строк ПОСЛЕ нажатия Сохранить', countAfterAdd, 'isExistsRows', isExistsRows, 'numOfRows', numOfRows)
                        if (isExistsRows) {
                            expect(countAfterAdd).toBe(numOfRows);
                        } else {
                            expect(countAfterAdd).toBe(numOfRows + 1);
                        }
                    })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);


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
// 8) Перейти во вкладку "Протяженность участка", заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." в разделе "После ремонта".
// нажать кнопку "Добавить запись" под таблицей "Нестандартные километры", убедится, что появилась строка с формами для ввода данных
// (количество записей в таблице увеличилось на 1)ю  Заполнить поля "км", "Количество пикетов" значениями "км. н." и нажать кнопку "Сохранить"
// Проверить, что количество записей в таблице увеличилось на 1
// 9) Перейти во вкладку "Протяженность рельсов", нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных
//  Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями, сохраненными в п.8, Тип (указать первый из выпадающего списка) и нажать кнопку "Сохранить"
// Проверить, что количество записей в таблице увеличилось на 1
// 10) Перейти во вкладку "План и профиль пут"
// 11) Для таблицы План пути нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данныхю  Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями,
// сохраненными в п.8, указать значение 100 для полей "Радиус", "Длина", Возвышение",  выбрать 1ое значение из выпадающего списка для поля "Сторонность" и нажать кнопку "Сохранить"
// 12) Для таблицы Профиль пути нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок."
// значениями, сохраненными в п.8, "Возвышение" указать значение 5.4 и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// 13) Перейти во вкладку "Ситуация"
// 14) Для таблицы "Ситуация" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данныхю  Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями,
// сохраненными в п.8,  выбрать 1ое значение из выпадающего списка для поля "Тип" и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// 15) Для таблицы "Места выгрузки" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок."
// значениями, сохраненными в п.8 и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// 16) Перейти во вкладку "Инженерные сооружения"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км ок." = "км. н",
// "пк+ ок." = "пк+ н.", значениями сохраненными в п.8, выбрать 1ые значения из выпадающего списка для полей "Тип" и "Конструкция", указать 1 для "Протяженность" и нажать кнопку "Сохранить"
// Проверить, что количество записей в таблице увеличилось на 1
// 17) Перейти во вкладку "Балласт, разделительный слой"
// 18) Для таблицы "Разделительный слой" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км ок." = "км. н",
// // "пк+ ок." = "пк+ н.", значениями сохраненными в п.8, выбрать 1ые значения из выпадающего списка для полей "Тип" и нажать кнопку "Сохранить"
// // Проверить, что количество записей в таблице увеличилось на 1
// 19) Для таблицы "Глубина очистки/вырезки балласта" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км ок." = "км. н",
// // // "пк+ ок." = "пк+ н.", значениями сохраненными в п.8, указать 55 для "Глубина очистки" и нажать кнопку "Сохранить"
// // // Проверить, что количество записей в таблице увеличилось на 1
// 20) Перейти во вкладку "Точечные объекты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км", "пк+", значениями
// сохраненными в п.8, выбрать 1ые значения из выпадающего списка для полей "Тип" и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// 21) Перейти во вкладку "Стрелочные переводы и блокпосты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км остряка",
// "пк+ остряка", значениями сохраненными в п.8,  выбрать 1ые значения из выпадающего списка для полей "Номер проетка", "Четоность" и нажать кнопку "Сохранить".
// Проверить, что количество записей в таблице увеличилось на 1

// 22) Перейти во вкладку "Геотекстиль"  нажать кнопку "Добавить запись". В открывшемся окне заполняем поля (ПМС, Место хранения)
// ПМС и Место хранения - ОТСУТСВТУЮТ ЗНАЧЕНИЯ ДЛЯ ВЫБОРА!!!

// 23) Вернуться к задаче в Моих нарядах (отфильтровать и открыть нужное по Id в п.2) и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось на "Выполнен".

// ошибка при тесте КРП по ПМС нажатии на Перейти к ДПГ - иногда уже созданы ДПГ с привязкой к ПМС 1 из 3х или все 3 из 3х,  нет в группе "не указано"
// ошибка при Перейти к ДПГ - не всегда записи уходят в ПМС
// 	Распределить участки КРП по ПМС - при нажатии на кнопку Выполнить ругается на календарь, Calendar with name 'Базовый производственный календарь' not found. При этом запись исчезает
// при такой ошибке наряд исчезает, но осмотр участка не создается
// Осмотр участка, по какому критерию фильтровать, тк Id не показательны и есть наряды закрашенные цветом
// как создать сразу 20 Осмотров участка для тестирования, чтоб не ждать
// ДРП одинааковые, разница только в цвете, как быть?


//0. Выполняем сценарий на создание ДПГ, получения Титула, распределению ПМС (под пользователем КраснДРП)
//1. По ДПГ невозможно отфильтровать, делаю по id + 2 от получания титула
//2. Заходим под ПМС197_Менеджер -> http://45.67.57.231:8080/#/my_tasks_dept -> Осмотр участка ->  НЕТ кнопок сохранить/выполнить

//3. ошибка при тесте КРП по ПМС нажатии на Перейти к ДПГ - иногда уже созданы ДПГ с привязкой к ПМС 1 из 3х или все 3 из 3х,  нет в группе "не указано"