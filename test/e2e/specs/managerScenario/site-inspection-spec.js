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

    let taksUid = 34816;

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
    // it('4.  В наряде указываем исполнителя (Волков С.А.) и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', function (done) {
    //     return $h.form.setForm({
    //         // assignedto: 'Волков С.А.'
    //         assignedto: 'Вернер А.А.'
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

// 7) Заполнить по кладке "Верхнее строение пути" поля в разделе "До ремонта" (Выбирать 1ые записи из выпадающих списков полей):
// "Тип Рельс", "Тип шпал", "Скрепления", "Род балласта", "Раздел. слой", "Тип СЦБ",  "Конструкция пути", "Раздел. слой", "Тип СЦБ", "Загрязненность".
// поля в разделе "После осмотра"(Выбирать 1ые записи из выпадающих списков полей): "Состояние рельсов", "Состояние шпал", "Состояние скрепл."

    // 4)  В наряде указываем исполнителя (Волков С.А.) и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    it('7.  Заполнить по кладке "Верхнее строение пути" поля в разделе "До ремонта". ##can_continue', function (done) {
        console.log('7.  Заполнить по кладке "Верхнее строение пути" поля в разделе "До ремонта"');
        // browser.executeScript('window.scrollTo(0,0);').then(function(){
        //     console.log('++++++SCROLLED UP+++++');
        // });
        // browser.actions().mouseMove(element(by.id('select2-chosen-437'))).perform();
        // return angularWait()
        //     .then(function () {
        //         element(by.css(' .current-form idea-field-view[data-field-name="rail_brand_br"] .select2-choice')).click();
        //         // element(by.css(' .current-form idea-field-view[data-field-name="rail_brand_br"] .select2-choice select2-arrow')).click();
        //     })
        //     .then(angularWait)
        //     .then(expliciteWait)
        //     .then(function () {
        //         element(by.id('select2-drop')).element(by.css(' .select2-input')).clear().sendKeys('Р65 СГ I')
        //         // element(by.css('#select2-drop .select2-input')).clear().sendKeys('Р65 СГ I')
        //     })
        //     .then(angularWait)
        //     .then(expliciteWait)
        //     .then(function () {
        //         element.all(by.css(' .select2-drop .select2-results li.select2-result-selectable')).first().click();
        //         // element(by.css('#select2-drop .select2-input')).clear().sendKeys('Р65 СГ I')
        //     })

        return $h.form.setForm({
            // rail_brand_br: 'Р65 СГ I',
            // clips_br: 'W-30',
            // sleeper_br: 'Ш АРС-МК/АРС-04.07.003-II-ПД',
            // ballast_br: 'Щебень',
            sep_layer_br: 'Георешетка',
            // signal_system_br: 'Полуавтоматическая',
            // dirtyness: 34,
            // trackform_br: 'Звеньевой',
            // rail_situation: 'Новые',
            // sleeper_situation: 'Новые',
            // clips_situation: 'Новые'
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
//  Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями, сохраненными в п.8, Тип (указать первый из выпадающего списка) и нажать кнопку "Сохранить"
// Проверить, что количество записей в таблице увеличилось на 1
// 10) Перейти во вкладку "Топология пути"
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