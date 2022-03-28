describe('Автотест на Осмотр участка. ', function () {
    const _ = protractor.libs._;
    const $h = protractor.helpers;
    const { errorCatcher } = $h.common;
    const EC = protractor.ExpectedConditions;

    $h.serviceId = 932;
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

    let linesNumber;
    let number = 0;
    let isExistNewGroup = false;
    let childElements;

    const buttonCalcMvsp = 'Расчет МВСП';
    const updateInlineButton = 'toolbar-inline-buttons idea-button-modify idea-button-update k-grid-update';
    const editInlineButton = 'toolbar-inline-buttons idea-button-modify idea-button-edit k-grid-edit';
    const addInlineButton = 'pull-right toolbar-buttons k-button k-grid-add';
    const alertSuccess = 'alert__wrapper alert__wrapper_success';
    const alertDanger = 'alert__wrapper alert__wrapper_danger';


    function skip() {
        return !protractor.totalStatus.ok;
    }

    // // 1. Заходим в систему под ПМС197_Менеджер
    /* it('1. Заходим в систему под ПМС197_Менеджер. ##can_continue', async done => {
        await errorCatcher(async () => {
            loginObject = $h.login.getLoginObject();
            await $h.login.loginToPage(null, loginObject.users[1].user, loginObject.users[1].password);
            await browser.sleep(1000);
            const currentUrl = await browser.getCurrentUrl();
            if (!currentUrl.includes('my_tasks_dept')) {
                await browser.get($h.url + '#/my_tasks_dept');
            }
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.k-grid-toolbar .table-name', 'Мои наряды'))), 10000);
            await browser.sleep(1000);
        }, done);
    }, skip);*/

    // 00. Переходим по URL /#/service. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача, кнопка Добавить запись
    it('00. Переходим по URL /#/service. ##can_continue', async done => {
        await errorCatcher(async () => {
            await browser.get(protractor.helpers.url + '/#/service');
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.k-grid-toolbar .table-name', 'Услуга'))), 10000);
            await browser.sleep(1000);
            const rowsCount = await protractor.helpers.grid.main.rowsList().count();
            console.log('Количество записей больше 0');
            expect(rowsCount > 0).toBe(true);
            console.log('На форме есть кнопка "Добавить запись"');
            await expect(element(by.css('.k-button.idea-button-add-row')).getText()).toBe('Добавить запись');
            await $h.grid.main.clearFilters();
        }, done);

    }, skip);

    it('0. Закрываем модальное окно. Переходим на вкладку "Участки ремонта пути", выбираем первый участок и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue', async done => {
        await errorCatcher(async () => {
            await $h.grid.main.setSearch([
                {
                    type: 'int',
                    operator: 'eq',
                    field: 'serviceid',
                    value:  $h.serviceId,
                }
            ]);
            await browser.sleep(1500);
            const event = await element.all(by.css('[data-pkfieldid=\"' + String($h.serviceId) + '\"]')).first().getWebElement();
            await browser.actions().doubleClick(event).perform();
            await browser.sleep(3000);
        }, done);
    }, skip)

    it('1. Закрываем модальное окно. Переходим на вкладку "Участки ремонта пути", выбираем первый участок и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue', async done => {
        await errorCatcher(async () => {
            const form = await $h.form.getForm(['requests']);
            const index = 0;
            $h.requestsId = form.requests[0].items[0].items[index].requestid;

            const event =await element.all(by.css('[data-pkfieldid=\"' + String($h.requestsId) + '\"]')).first().getWebElement();
            await browser.actions().doubleClick(event).perform();
            await browser.sleep(1000);

            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="calc_mvsp"]'))), 5000);
            console.log(`На форме присутствует кнопка с надпсиью ${buttonCalcMvsp}`);
            await expect(element(by.css('[data-button-name="calc_mvsp"]')).getText()).toBe(buttonCalcMvsp);
            await browser.sleep(2000);
        }, done);
    }, skip);

    // 2. Кликаем по ссылке, на открывшейся форме проверяем наличие кнопок.
    it('2. Кликаем по ссылке и убеждаемся что отобразилась таблица и в ней имеются не менее 3х записей. ##can_continue', async done => {
        await errorCatcher(async () => {
            await $h.form.clickOnLink('link_to_request_inspections');
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="request_cancel2"]'))), 10000);
            await browser.sleep(1500);
            console.log('На форме есть кнопки "Сохранить", "Отменить участок" и "Получить шаблон осмотра".');
            await expect(element(by.css('[data-button-name="UPDATE"]')).isPresent()).toBe(true);
            await expect(element(by.css('[data-button-name="request_cancel2"]')).isPresent()).toBe(true);
            await expect(element(by.css('[data-button-name="get_inspecting_templ"]')).isPresent()).toBe(true);
        }, done);
    }, skip);
    // 3. Заполнить обязательные поля на вкладке "Общая информация"
    it('3. Заполнить обязательные поля на вкладке "Общая информация" . ##can_continue', async done => {
        await errorCatcher(async () => {
            await $h.form.setForm({
                railtrack_class: '2',
                track_specialization: 'В',
                temp_amplitude: '>110',
                powerunit: 'Электрическая пост.',
                track_number: 4,
            });
            await browser.sleep(1500);
        }, done);
    }, skip);
        // 4. Перейти во вкладку "Верхнее строение пути" поля в разделе "До ремонта", заполнить обязательные поля.
    it('4. Перейти во вкладку "Верхнее строение пути" поля в разделе "До ремонта", заполнить обязательные поля. ##can_continue', async done => {
        await errorCatcher(async () => {
            await browser.sleep(1000);
            await $h.form.setForm({
                rail_brand_br: 'Р65 СГ I',
                sleeper_br: 'Ш АРС-МК',
                clips_br: 'АРС',
                ballast_br: 'Щебень',
                signal_system_br: 'Полуавтоматическая',
                dirtyness: 34,
                trackform_br: 'Звеньевой',
                rail_situation: 'Новые',
                sleeper_situation: 'Новые',
                clips_situation: 'Новые',
                trackform_ar: 'Звеньевой',
            });
            await browser.sleep(1500);
        }, done);
    }, skip);

    it('4а. В Осмотре участка нажимаем на кнопку "Сохранить". Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', async done => {
        await errorCatcher(async () => {
            await $h.form.processButton(['UPDATE']);   //жмем на кнопку Сохранить
            expect(await element(by.css(`[class="${alertSuccess}"]`)).isPresent()).toBe(true)  // Справа наверху возникло зеленое сообщение
            await browser.sleep(1500);
        }, done);
    }, skip);
//
//     5. Перейти во вкладку "Протяженность участка", заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." в разделе "После ремонта". Нажать кнопку "Добавить запись"
// под таблицей "Нестандартные километры", убедится, что появилась строка с формами для ввода данных (количество записей в таблице увеличилось на 1).
// Заполнить поля "км", "Количество пикетов" значениями "км. н." и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// Если запись в таблице уже существует, обновить значение "пк+ ок.". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('5. Перейти во вкладку "Протяженность участка", заполнить открытые поля и строки таблиц: "Нестандартные километры"/"Нестандартные пикеты". ##can_continue', async done => {
        await errorCatcher(async () => {
            const form = await $h.form.getForm(['start_km_br', 'start_pk_br', 'finish_km', 'finish_pk_before_repair', 'distance_before_repair']);
            start_km_ar = form['start_km_br'];
            start_pk_ar = form['start_pk_br'];
            finish_km_after_repair = form['finish_km'];
            finish_pk_after_repair = form['finish_pk_before_repair'];
            distance_after_repair = form['distance_before_repair'];
            await $h.form.setForm({
                start_km_ar: start_km_ar,
                start_pk_ar: start_pk_ar,
                finish_km_after_repair: finish_km_after_repair,
                finish_pk_after_repair: finish_pk_after_repair,
            });
            elementMain = element(by.css('[data-field-name="unusual_km"]'));

            const totalRows = await $h.grid.subgrid('unusual_km').getTotalRows();    //таблица "Нестандартные километры"
            numOfRows = totalRows;
            await browser.sleep(1000);
            if (totalRows > 0) {
                await browser.executeScript('window.scrollTo(0,0);');
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="unusual_km"] [class="${editInlineButton}"]`)).first().click();
            } else {
                await browser.executeScript('window.scrollTo(0,0);');
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.executeScript('window.scrollTo(0,0);');

                await elementMain.element(by.css('[data-container-for="km"]')).click();
                await elementMain.element(by.css('input[name="km"]')).clear().sendKeys(finish_km_after_repair);
            }
            await browser.sleep(500);

            await elementMain.element(by.css('[data-container-for="pk_count"]')).click();
            await elementMain.element(by.css('input[name="pk_count"]')).clear();
            await elementMain.element(by.css('[data-container-for="pk_count"]')).click();
            await elementMain.element(by.css('input[name="pk_count"]')).sendKeys(Math.ceil(Number(finish_pk_after_repair) + 1));
            await browser.sleep(500);

            await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            await browser.sleep(2000);

            let resCount = await element.all(by.css('[class="alert__wrapper alert__wrapper_danger"]')).count();
            expect(resCount).toBe(countMistakes);
            countMistakes = resCount;
            await browser.sleep(1500);

            let countAfterAdd = await $h.grid.subgrid('unusual_km').getTotalRows();
            console.log(isExistsRows, countAfterAdd, numOfRows);
            if (isExistsRows) {
                expect(countAfterAdd).toBe(numOfRows);
            } else {
                expect(countAfterAdd).toBe(numOfRows + 1);
            }
            isExistsRows = false;
            elementMain = element(by.css('[data-field-name="unusual_pk"]'));
            const count = await $h.grid.subgrid('unusual_pk').getTotalRows();        //таблица "Нестандартные пикеты"
            console.log('Нестандартные пикеты, количество: ', count);
            numOfRows = count;
            await browser.executeScript('window.scrollTo(0,0);');
            if (count > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="unusual_pk"] [class="${editInlineButton}"]`)).first().click();
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
            }
            await browser.executeScript('window.scrollTo(0,0);');
            console.log('SCROLLED')
            await browser.sleep(1500);
            await elementMain.element(by.css('[data-container-for="km"]')).click();
            await elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
            await elementMain.element(by.css('[data-container-for="pk"]')).click();
            await elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(Math.ceil(start_pk_ar));


            await elementMain.element(by.css('[data-container-for="distance"]')).click();
            await elementMain.element(by.css('input[name="distance"]')).clear();
            await elementMain.element(by.css('[data-container-for="distance"]')).click();
            await elementMain.element(by.css('input[name="distance"]')).sendKeys((Number(distance_after_repair) + 1));

            await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            await browser.sleep(2000);

            resCount = await element.all(by.css('[class="alert__wrapper alert__wrapper_danger"]')).count();
            expect(resCount).toBe(countMistakes);
            countMistakes = resCount;

            await browser.sleep(1500);
            countAfterAdd = await $h.grid.subgrid('unusual_pk').getTotalRows();
            console.log('Нестандартные пикеты, количество после добавления записи: ', countAfterAdd);
            if (isExistsRows) {
                expect(countAfterAdd).toBe(numOfRows);
            } else {
                expect(countAfterAdd).toBe(numOfRows + 1);
            }
            isExistsRows = false;
            await browser.sleep(1500);
        }, done);
    }, skip);
//     // 3. Выбираем наряды "Осмотр участка" и открываем первый наряд из группы "Назначить исполнителя". Убеждаемся, что запись открылась, текущий статус "запланирован", поле "Исполнитель" доступен для заполнения, есть кнопка "Сохранить" и "Назад".
//     it('3. Выбираем наряды "Осмотр участка" и открываем первый наряд из группы "Назначить исполнителя". ##can_continue', function (done) {
//         return $h.grid.main.setSearch([
//             {
//                 type: 'string',
//                 operator: 'contains',
//                 field: 'displayname',
//                 value: 'Осмотр участка'
//             },
//             // {
//             //     type: 'int',
//             //     operator: 'eq',
//             //     field: 'taskid',
//             //     // value: Number(protractor.helpers.taksUid + 2)
//             //     value: taksUid
//             // }
//         ])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 protractor.helpers.grid.main.rowsList().count().then(function (res) { //Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
//                     linesNumber = res;
//                     expect(res >= 1).toBe(true);
//                 })
//             })
//             .then(function () {
//                 childElements = protractor.helpers.grid.main.rowsList();
//                 for (let i = 0; i < linesNumber; ++i) {
//                     isExistNewGroup = false;
//                     childElements.get(i).getText().then(function (text) {
//                         if (text.match('Назначить исполнителя')) { //убедиться, что есть группа "Назначить исполнителя"
//                             number = i;
//                             isExistNewGroup = true;
//                             return isExistNewGroup;
//                         }
//                     })
//                 }
//             })
//             .then(function () {    //Выбрать 1 запись (кликнуть по галкам) из группы "Назначить исполнителя",
//                 expect(isExistNewGroup).toBe(true)
//                 // console.log('isExistNewGroup', isExistNewGroup)
//                 if (isExistNewGroup) {
//                     childElements.get(number + 1).getWebElement()
//                         .then(function (event) {
//                             browser.actions().doubleClick(event).perform();
//                             return browser.waitForAngular();
//                         })
//                 }
//                 return isExistNewGroup
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function (res) {
//                 expect(element(by.css('[data-button-name="UPDATE"]')).isPresent()).toBe(true);   // Проверить что есть кнопка Сохранить
//                 expect(element(by.css('[data-button-name="BACK"]')).isPresent()).toBe(true);   // Проверить что есть кнопка Назад
//                 expect(element(by.css('[data-input-name="assignedto"]')).isEnabled()).toBe(true)    // Проверить Исполнитель доступен для заподнения
//             })
//             .then(function () {
//                 element(by.css('[class="editable-header__pk-value  ng-binding"]')).getText().then(function (text) {     // Сохранить ID servicce
//                     protractor.helpers.taksUid = Number(text);
//                 })
//             })
//             .then(function () {
//                 return $h.form.getForm(['workflowstepid']);
//             })
//             .then(function (form) {
//                 expect(form.workflowstepid.displayValue).toBe('Запланирован');  // Проверить Стутус
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
//     // 4. В наряде указываем исполнителя "Медведев А.О." и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение.
//     it('4. В наряде указываем исполнителя "Медведев А.О." и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло.. ##can_continue', function (done) {
//         return $h.form.setForm({
//             assignedto: 'Медведев А.О.'
//         })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 // return $h.form.processButton(['CREATE', 'UPDATE']);
//                 return $h.form.processButton(['UPDATE']);   //жмем на кнопку Сохранить
//             })
//             .then(function () {
//                 expect(element(by.css(`[class="${alertSuccess}"]`)).isPresent()).toBe(true)  // Справа наверху возникло зеленое сообщение
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
//     // 5. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
//     it('5. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось. ##can_continue', function (done) {
//         return $h.form.processButton(['В работу'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 return $h.form.getForm(['workflowstepid']);
//             })
//             .then(function (form) {
//                 // console.log('form   ****', form)
//                 // console.log('form.workflowstepid.displayValue   *******', form.workflowstepid.displayValue)
//                 expect(form.workflowstepid.displayValue).toBe('В работе ');
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
//     // 6. Переходим по ссылке "Заполнить данные по осмотру участка". Убеждаемся, что в открывшемся окне имеются поля: " Специализация жд линии", "Темп. амплитуда", "ПМС" и кнопки "Расчет МВСП", "Сохранить", "Назад", "Получить шаблон осмотра"
//     it('6. Переходим по ссылке "Заполнить данные по осмотру участка". ##can_continue', function (done) {
//         return element(by.css('[class="glyphicon glyphicon-road"]')).click()
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 expect(element(by.css('[data-button-name="calc_mvsp"]')).getText()).toBe('Расчет МВСП');   // Проверить что есть кнопка "Расчет МВСП"
//                 expect(element(by.css('[data-button-name="UPDATE"]')).getText()).toBe('Сохранить');   // Проверить что есть кнопка "Сохранить"
//                 expect(element(by.css('[data-button-name="BACK"]')).getText()).toBe('Назад');   // Проверить что есть кнопка "Назад"
//                 expect(element(by.css('[data-button-name="get_inspecting_templ"]')).getText()).toBe('Получить шаблон осмотра');   // Проверить что есть кнопка "Получить шаблон осмотра"
//             })
//             .then(function () {
//                 expect(element(by.css('[idea-field-name="railtrack_class"]')).isPresent()).toBe(true);   // Класс, группа, категория пути
//                 expect(element(by.css('[idea-field-name="track_specialization"]')).isPresent()).toBe(true);   // Специализация жд линии
//                 expect(element(by.css('[idea-field-name="temp_amplitude"]')).isPresent()).toBe(true);
//                 ;  // Проверить что есть поле "Темп. амплитуда"
//                 expect(element(by.css('[idea-field-name="department"]')).isPresent()).toBe(true);   // Проверить что есть поле "ПМС"
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
//     // 7. Заполнить обязательные поля на вкладке "Общая информация"
//     it('7. Заполнить обязательные поля на вкладке "Общая информация" . ##can_continue', function (done) {
//         return $h.form.setForm({
//             railtrack_class: 2,
//             track_specialization: 6,
//             temp_amplitude: '>110',
//             powerunit: 'electric',
//             track_number: 4,
//         })
//             .then(done);
//     }, skip);
//
//     // 8. Перейти во вкладку "Верхнее строение пути" поля в разделе "До ремонта", заполнить обязательные поля.
//     it('8. Перейти во вкладку "Верхнее строение пути" поля в разделе "До ремонта", заполнить обязательные поля. ##can_continue', function (done) {
//         return $h.form.getForm(['before_repair_label'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 return $h.form.setForm({
//                     rail_brand_br: 'Р65 СГ I',
//                     clips_br: 'W-30',
//                     sleeper_br: 'Ш АРС-МК/АРС-04.07.003-II-ПД',
//                     ballast_br: 'gravel',
//                     sep_layer_br: 'Георешетка',
//                     signal_system_br: 'semi_automatic',
//                     dirtyness: 34,
//                     trackform_br: 'course',
//                     rail_situation: 'new',
//                     sleeper_situation: 'new',
//                     clips_situation: 'new'
//                 })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
// // 9. Перейти во вкладку "Протяженность участка", заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." в разделе "После ремонта". Нажать кнопку "Добавить запись"
// // под таблицей "Нестандартные километры", убедится, что появилась строка с формами для ввода данных (количество записей в таблице увеличилось на 1).
// // Заполнить поля "км", "Количество пикетов" значениями "км. н." и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// // Если запись в таблице уже существует, обновить значение "пк+ ок.". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
//     it('9. Перейти во вкладку "Протяженность участка", заполнить открытые поля и строки таблиц: "Нестандартные километры"/"Нестандартные пикеты". ##can_continue', function (done) {
//         return $h.form.getForm(['before_repair_label_1'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 return $h.form.getForm(['start_km_br', 'start_pk_br', 'finish_km', 'finish_pk_before_repair', 'distance_before_repair']);
//             })
//             .then(function (form) {
//                 start_km_ar = form.start_km_br;
//                 start_pk_ar = form.start_pk_br;
//                 finish_km_after_repair = form.finish_km;
//                 finish_pk_after_repair = form.finish_pk_before_repair;
//                 distance_after_repair = form.distance_before_repair;
//             })
//             .then(function () {
//                 return $h.form.setForm({
//                     start_km_ar: start_km_ar,
//                     start_pk_ar: start_pk_ar,
//                     finish_km_after_repair: finish_km_after_repair,
//                     finish_pk_after_repair: finish_pk_after_repair,
//                 })
//             })
//             .then(function () {
//                 elementMain = element(by.css('[data-field-name="unusual_km"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('unusual_km').getTotalRows();    //таблица "Нестандартные километры"
//             })
//             .then(function (count) {
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                            element.all(by.css(`[data-field-name="unusual_km"] [class="${editInlineButton}"]`)).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             return $h.grid.subgrid('unusual_km').getTotalRows();
//                         })
//                         // .then(function (countAfterAdd) {
//                         //     console.log('countAfterAdd_1 =', countAfterAdd)
//                         //     expect(countAfterAdd).toBe(numOfRows + 1);
//                         // })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="km"]')).click();
//                             elementMain.element(by.css('input[name="km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                 }
//             })
//             .then(function () {
//                 elementMain.element(by.css('[data-container-for="pk_count"]')).click();
//                 elementMain.element(by.css('input[name="pk_count"]')).clear();
//                 elementMain.element(by.css('[data-container-for="pk_count"]')).click();
//                 elementMain.element(by.css('input[name="pk_count"]')).sendKeys(Math.ceil(finish_pk_after_repair + 1));
//             })
//             .then(function () {
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 element.all(by.css(`[class="${alertDanger}"]`)).count().then(function (resCount) {
//                     // console.log('resCount1', resCount, 'countMistakes', countMistakes)
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 return $h.grid.subgrid('unusual_km').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         // console.log('countAfterAdd2', countAfterAdd, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                         isExistsRows = false;
//                     })
//             })
//             .then(function () {
//                 elementMain = element(by.css('[data-field-name="unusual_pk"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('unusual_pk').getTotalRows();        //таблица "Нестандартные пикеты"
//             })
//             .then(function (count) {
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                            element.all(by.css(`[data-field-name="unusual_pk"] [class="${editInlineButton}"]`)).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css('[class="k-button k-button-icontext k-grid-add"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             return $h.grid.subgrid('unusual_km').getTotalRows();
//                         })
//                         // .then(function (countAfterAdd) {
//                         //     console.log('countAfterAdd_2 =', countAfterAdd)
//                         //     expect(countAfterAdd).toBe(numOfRows + 1);
//                         // })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="km"]')).click();
//                             elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="pk"]')).click();
//                             elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(Math.ceil(start_pk_ar));
//
//                         })
//                 }
//             })
//             .then(function () {
//                 elementMain.element(by.css('[data-container-for="distance"]')).click();
//                 elementMain.element(by.css('input[name="distance"]')).clear();
//                 elementMain.element(by.css('[data-container-for="distance"]')).click();
//                 elementMain.element(by.css('input[name="distance"]')).sendKeys((distance_after_repair + 1));
//
//             })
//             .then(function () {
//                 elementMain.element(by.css('[class="k-button k-button-icontext k-primary k-grid-update"]')).click();
//             })
//             .then(function () {
//                 element.all(by.css(`[class="${alertDanger}"]`)).count().then(function (resCount) {
//                     // console.log('resCount2', resCount, 'countMistakes', countMistakes)
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 return $h.grid.subgrid('unusual_pk').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         if (isExistsRows) {
//                             // console.log('if countAfterAdd3', countAfterAdd, 'numOfRows', numOfRows)
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             // console.log('else countAfterAdd3', countAfterAdd, 'numOfRows', numOfRows)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                         isExistsRows = false;
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
// 6. Перейти во вкладку "Протяженность рельсов", нажать кнопку "Добавить запись" таблицы, убедится, что появилась строка с формами для ввода данных.
// Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", "Тип" (указать первый из выпадающего списка) и нажать кнопку "Сохранить". Проверить, что количество записей в таблице
// увеличилось на 1. Если запись в таблице уже существует, обновить поле "Тип" из выпадающего списка. Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('6. Перейти во вкладку "Протяженность рельсов", заполнить данные по таблице". ##can_continue', async done => {
        await errorCatcher(async () => {
            await $h.form.collapseCurrentSection();
            await browser.sleep(1500);
            const track_rail_distance = await $h.form.getForm(['track_rail_distance']);
            elementMain = element(by.css('[data-field-name="track_rail_distance"]'));
            const count = await $h.grid.subgrid('track_rail_distance').getTotalRows();    //таблица "Протяженность рельсов"
            numOfRows = count;
            if (count > 0) {
                await browser.executeScript('window.scrollTo(0,0);');
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_rail_distance"] [class="${editInlineButton}"]`)).first().click();
            } else {
                await browser.executeScript('window.scrollTo(0,0);');
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.sleep(1000);
                await browser.executeScript('window.scrollTo(0,0);');
                await elementMain.element(by.css('[data-container-for="start_km"]')).click();
                await elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                await elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                await elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                await elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
                await browser.sleep(500);
            }

            await element(by.css('[data-container-for="track_type"] .k-select')).click();
            await browser.sleep(1000);
            await element.all(by.css('[class="k-item"]')).last().click();
            await browser.sleep(1000);
            await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            await browser.sleep(2000);

            const dangerCount = await  element.all(by.css(`[class="${alertDanger}"]`)).count();
            expect(dangerCount).toBe(countMistakes);
            countMistakes = dangerCount;

            const countAfterAdd = await $h.grid.subgrid('track_rail_distance').getTotalRows();
            if (isExistsRows) {
                expect(countAfterAdd).toBe(numOfRows);
            } else {
                expect(countAfterAdd).toBe(numOfRows + 1);
            }
            isExistsRows = false;
            await browser.sleep(1500);
        }, done);
    }, skip);

    // 7. Перейти во вкладку "План и профиль пути". Для таблицы План пути нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных.
    // Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями, сохраненными в п.9, также заполнить "Радиус", "Длина", Возвышение","Сторонность".
    // Если строка уже существует обновить поле "Сторонность". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    // Для таблицы Профиль пути нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", "%0".
    // Если строка уже существует обновить поле "%0". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('7. Перейти во вкладку "План и профиль пути". Редактировать/заполниь таблицы План пути и Профиль пути. ##can_continue', async done => {
        await errorCatcher(async () => {
            await $h.form.collapseCurrentSection();
            await $h.form.getForm(['track_grading']);
            elementMain = element(by.css('[data-field-name="track_grading"]'));
            let count = await $h.grid.subgrid('track_grading').getTotalRows();    //таблица "Профиль пути"
            numOfRows = count;
            await browser.executeScript('window.scrollTo(0,0);');
            if (count > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_grading"] [class="${editInlineButton}"]`)).first().click();
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.executeScript('window.scrollTo(0,0);');

                await elementMain.element(by.css('[data-container-for="start_km"]')).click();
                await elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                await elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                await elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                await elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
                await browser.sleep(500);
            }

            await elementMain.element(by.css('[data-container-for="gradient"]')).click();
            await elementMain.element(by.css('input[name="gradient"]')).clear();
            await elementMain.element(by.css('[data-container-for="gradient"]')).click();
            await elementMain.element(by.css('input[name="gradient"]')).sendKeys(gradient);
            await browser.sleep(500);

            await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            await browser.sleep(2000);

            let dangerCount = await element.all(by.css(`[class="${alertDanger}"]`)).count();
            console.log(`Количество ошибок: ${dangerCount}`);
            expect(dangerCount).toBe(countMistakes);
            countMistakes = dangerCount;

            let countAfterAdd = await $h.grid.subgrid('track_grading').getTotalRows();
            if (isExistsRows) {
                expect(countAfterAdd).toBe(numOfRows);
            } else {
                expect(countAfterAdd).toBe(numOfRows + 1);
            }
            isExistsRows = false;
            await browser.sleep(1500);


            elementMain = element(by.css('[data-field-name="track_topology"]'));
            count = await $h.grid.subgrid('track_topology').getTotalRows();    //таблица "План пути";

            await browser.executeScript('window.scrollTo(0,0);');
            if (count > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_topology"] [class="${editInlineButton}"]`)).first().click();
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.executeScript('window.scrollTo(0,0);');

                await elementMain.element(by.css('[data-container-for="start_km"]')).click();
                await elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar); // км.н
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                await elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar); // пк+ н.
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                await elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair); // км. ок.
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                await elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair); // пк+ ок.
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="radius"]')).click();
                await elementMain.element(by.css('input[name="radius"]')).clear().sendKeys(radius);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="length"]')).click();
                await elementMain.element(by.css('input[name="length"]')).clear().sendKeys(length);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="raising"]')).click();
                await elementMain.element(by.css('input[name="raising"]')).clear().sendKeys(raising);
                await browser.sleep(500);
            }

            await element(by.css('[data-container-for="sidedness"] .k-select')).click();
            await browser.sleep(1000);
            await element.all(by.css('.k-state-border-up .k-item')).first().click();
            await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            await browser.sleep(2000);

            dangerCount = await element.all(by.css(`[class="${alertDanger}"]`)).count();
            console.log(`Количество ошибок: ${dangerCount}`);
            expect(dangerCount).toBe(countMistakes);
            countMistakes = dangerCount;

            countAfterAdd = await $h.grid.subgrid('track_topology').getTotalRows();
            if (isExistsRows) {
                expect(countAfterAdd).toBe(numOfRows);
            } else {
                expect(countAfterAdd).toBe(numOfRows + 1);
            }
            isExistsRows = false;
            await browser.sleep(1500);
        }, done);
        /* return $h.form.getForm(['track_grading'])
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
                           element.all(by.css(`[data-field-name="track_grading"] [class="${editInlineButton}"]`)).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
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
                elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            })
            .then(function () {
                element.all(by.css(`[class="${alertDanger}"]`)).count().then(function (resCount) {
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
                           element.all(by.css(`[data-field-name="track_topology"] [class="${editInlineButton}"]`)).first().click();
                        })
                } else {
                    return angularWait()
                        .then(function () {
                            browser.executeScript('window.scrollTo(0,0);');
                            elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
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
                return element(by.css('[data-container-for="sidedness"] .k-select')).click()
                    .then(expliciteWait)
                    .then(function () {
                        return element.all(by.css('[class="k-item"]')).first().click();
                    })
            })
            .then(angularWait)
            .then(function () {
                elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            })
            .then(function () {
                element.all(by.css(`[class="${alertDanger}"]`)).count().then(function (resCount) {
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
            .then(done);*/
    }, skip);
// 12. Перейти во вкладку "Ситуация". Для таблицы "Ситуация" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данныхю.
// Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок." значениями, сохраненными в п.9, выбрать 1ое значение из выпадающего списка для поля "Тип", установать/снять флажки с полей
// "Потребность МКТ" и "Высота>4м", нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1.
// Если строка уже существует установать/снять флаг с поля "Высота>4м". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// Для таблицы "Места выгрузки" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок."
// значениями, сохраненными в п.9 и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1.
// Если строка уже существует обновить поле "пк+ ок.". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
    it('8. Перейти во вкладку "Ситуация". Редактировать/заполниь таблицы "Ситуация" и "Места выгрузки". ##can_continue', async done => {
        await errorCatcher(async () => {
            await $h.form.collapseCurrentSection();
            await $h.form.getForm(['track_situation']);
            await browser.sleep(1500);

            elementMain = element(by.css('[data-field-name="track_situation"]'));
            let count = await $h.grid.subgrid('track_situation').getTotalRows();
            numOfRows = count;
            await browser.executeScript('window.scrollTo(0,0);');
            if (count > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_situation"] [class="${editInlineButton}"]`)).first().click();
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.executeScript('window.scrollTo(0,0);');

                await elementMain.element(by.css('[data-container-for="start_km"]')).click();
                await elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                await elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                await elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                await browser.sleep(500);

                await elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                await elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
                await browser.sleep(500);

                await element(by.css('[data-container-for="situation_type"] .k-select')).click();
                await browser.sleep(500);
                await element.all(by.css('.k-state-border-up .k-item')).first().click();
                await browser.sleep(500);

                await element(by.css('[data-container-for="is_ditch_machine_required"] [name="is_ditch_machine_required"]')).click();
                await browser.sleep(500);

                await element(by.css('[data-container-for="is_higher_then4m"] [name="is_higher_then4m"]')).click();
                await browser.sleep(500);

                await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
                await browser.sleep(2000);

                let dangerCount = await element.all(by.css(`[class="${alertDanger}"]`)).count();
                console.log(`Количество ошибок: ${dangerCount}`);
                expect(dangerCount).toBe(countMistakes);
                countMistakes = dangerCount;

                let countAfterAdd = await $h.grid.subgrid('track_situation').getTotalRows();
                if (isExistsRows) {
                    expect(countAfterAdd).toBe(numOfRows);
                } else {
                    expect(countAfterAdd).toBe(numOfRows + 1);
                }
                isExistsRows = false;


                elementMain = element(by.css('[data-field-name="track_uploading_places"]'));
                count = await $h.grid.subgrid('track_uploading_places').getTotalRows();    //таблица "Места выгрузки"
                numOfRows = count;

                if (count > 0) {
                    isExistsRows = true;
                    await element.all(by.css(`[data-field-name="track_uploading_places"] [class="${editInlineButton}"]`)).first().click();
                } else {
                    await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                    await browser.executeScript('window.scrollTo(0,0);');

                    await elementMain.element(by.css('[data-container-for="start_km"]')).click();
                    await elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
                    await browser.sleep(500);

                    await elementMain.element(by.css('[data-container-for="start_pk"]')).click();
                    await elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
                    await browser.sleep(500);

                    await elementMain.element(by.css('[data-container-for="finish_km"]')).click();
                    await elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
                    await browser.sleep(500);

                    await elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                    await elementMain.element(by.css('input[name="finish_pk"]')).clear();
                    await elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
                    await elementMain.element(by.css('input[name="finish_pk"]')).sendKeys(finish_pk_after_repair);
                    await browser.sleep(500);

                    await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
                    await browser.sleep(2000);

                    dangerCount = await element.all(by.css(`[class="${alertDanger}"]`)).count();
                    console.log(`Количество ошибок: ${dangerCount}`);
                    expect(dangerCount).toBe(countMistakes);
                    countMistakes = dangerCount;

                    countAfterAdd = await $h.grid.subgrid('track_uploading_places').getTotalRows();
                    if (isExistsRows) {
                        expect(countAfterAdd).toBe(numOfRows);
                    } else {
                        expect(countAfterAdd).toBe(numOfRows + 1);
                    }
                    isExistsRows = false;

                    await browser.sleep(1500);
                }
            }
        }, done);
    }, skip);

// // 9. Перейти во вкладку "Инженерные сооружения"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км. н", "пк+ н.",
// // "км ок.", "пк+ ок.", "Протяженность", "Общая длина пролетов" значениями, сохраненными в п.9, выбрать 1ые значения из выпадающего списка для полей "Тип" и "Конструкция",
// //  нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1. Если строка уже существует обновить поля "Тип", "Конструкция", "Общая длина пролетов"
// //  Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
//     it('9. Перейти во вкладку "Инженерные сооружения", заполнить данные по таблице. ##can_continue', function (done) {
//         return $h.form.getForm(['track_constructions'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain = element(by.css('[data-field-name="track_constructions"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_constructions').getTotalRows();    //таблица "Инженерные сооружения"
//             })
//             .then(function (count) {
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                            element.all(by.css(`[data-field-name="track_constructions"] [class="${editInlineButton}"]`)).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             return $h.grid.subgrid('track_constructions').getTotalRows();
//                         })
//                         // .then(function (countAfterAdd) {
//                         //     console.log('countAfterAdd_8 =', countAfterAdd)
//                         //     expect(countAfterAdd).toBe(numOfRows + 1);
//                         // })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(Math.ceil(start_pk_ar));
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(Math.floor(finish_pk_after_repair));
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="distance"]')).click();
//                             elementMain.element(by.css('input[name="distance"]')).clear().sendKeys(distance_after_repair);
//                         })
//                         .then(function () {
//                             return element(by.css('[data-container-for="is_bbc_machine_canwork"] [name="is_bbc_machine_canwork"]')).click();
//                         })
//                         .then(function () {
//                             return element(by.css('[data-container-for="is_leveling_machine_canwork"] [name="is_leveling_machine_canwork"]')).click();
//                         })
//                 }
//             })
//             .then(function () {
//                 return element(by.css('[data-container-for="construction_type"] .k-select')).click()
//                     .then(expliciteWait)
//                     .then(function () {
//                         return element.all(by.css('[class="k-item"]')).first().click();
//                     })
//             })
//             .then(function () {
//                 return element(by.css('[data-container-for="construction_type_sign"] .k-select')).click()
//                     .then(expliciteWait)
//                     .then(function () {
//                         return element.all(by.css('[class="k-item"]')).last().click();
//                     })
//             })
//             .then(function () {
//                 elementMain.element(by.css('[data-container-for="span_length"]')).click();
//                 elementMain.element(by.css('input[name="span_length"]')).clear();
//                 elementMain.element(by.css('[data-container-for="span_length"]')).click();
//                 elementMain.element(by.css('input[name="span_length"]')).sendKeys(distance_after_repair);
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
//             })
//             .then(function () {
//                 element.all(by.css(`[class="${alertDanger}"]`)).count().then(function (resCount) {
//                     // console.log('resCount8', resCount, 'countMistakes', countMistakes)
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_constructions').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         // console.log('countAfterAdd9', countAfterAdd, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                         isExistsRows = false;
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
// // 10. Перейти во вкладку "Балласт, разделительный слой". Для таблицы "Разделительный слой" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных.
// // Заполнить поля "км. н", "пк+ н.", "км ок.", "пк+ ок.", значениями сохраненными в п.9, выбрать 1ое значение из выпадающего списка для поля "Тип" и нажать кнопку "Сохранить"
// // Проверить, что количество записей в таблице увеличилось на 1. Если строка уже существует обновить поле "Тип". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
// // Для таблицы "Глубина очистки/вырезки балласта" нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля ""км. н", "пк+ н.", "км ок.",
// // "пк+ ок.", "Глубина очистки" значениями сохраненными в п.9 и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1.
// // Если строка уже существует обновить поле "Глубина очистки". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
//     it('10. Перейти во вкладку "Балласт, разделительный слой". Редактировать/заполниь таблицы "Разделительный слой" и "Глубина очистки/вырезки балласта". ##can_continue', function (done) {
//         return $h.form.getForm(['track_sep_layer'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain = element(by.css('[data-field-name="track_sep_layer"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_sep_layer').getTotalRows();    //таблица "Разделительный слой"
//             })
//             .then(function (count) {
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                            element.all(by.css(`[data-field-name="track_sep_layer"] [class="${editInlineButton}"]`)).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             return $h.grid.subgrid('track_sep_layer').getTotalRows();
//                         })
//                         // .then(function (countAfterAdd) {
//                         //     console.log('countAfterAdd_9 =', countAfterAdd)
//                         //     expect(countAfterAdd).toBe(numOfRows + 1);
//                         // })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(Math.ceil(start_pk_ar));
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
//                         })
//                 }
//             })
//             .then(function () {
//                 return element(by.css('[data-container-for="sep_layer_type"]')).click()
//                     .then(expliciteWait)
//                     .then(function () {
//                         return element.all(by.css('[class="k-item"]')).first().click();
//                     })
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
//             })
//             .then(function () {
//                 element.all(by.css(`[class="${alertDanger}"]`)).count().then(function (resCount) {
//                     // console.log('resCount9', resCount, 'countMistakes', countMistakes)
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_sep_layer').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         // console.log('countAfterAdd10', countAfterAdd, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                         isExistsRows = false;
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain = element(by.css('[data-field-name="track_ballast_depth"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_ballast_depth').getTotalRows();    //таблица "Глубина очистки/вырезки балласта"
//             })
//             .then(function (count) {
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                            element.all(by.css(`[data-field-name="track_ballast_depth"] [class="${editInlineButton}"]`)).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             return $h.grid.subgrid('track_ballast_depth').getTotalRows();
//                         })
//                         // .then(function (countAfterAdd) {
//                         //     console.log('countAfterAdd_11 =', countAfterAdd)
//                         //     expect(countAfterAdd).toBe(numOfRows + 1);
//                         // })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="start_km"]')).click();
//                             elementMain.element(by.css('input[name="start_km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="start_pk"]')).click();
//                             elementMain.element(by.css('input[name="start_pk"]')).clear().sendKeys(start_pk_ar);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="finish_km"]')).click();
//                             elementMain.element(by.css('input[name="finish_km"]')).clear().sendKeys(finish_km_after_repair);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="finish_pk"]')).click();
//                             elementMain.element(by.css('input[name="finish_pk"]')).clear().sendKeys(finish_pk_after_repair);
//                         })
//                 }
//             })
//             .then(function () {
//                 elementMain.element(by.css('[data-container-for="reclaiming_depth"]')).click();
//                 elementMain.element(by.css('input[name="reclaiming_depth"]')).clear();
//                 elementMain.element(by.css('[data-container-for="reclaiming_depth"]')).click();
//                 elementMain.element(by.css('input[name="reclaiming_depth"]')).sendKeys(start_pk_ar);
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
//             })
//             .then(function () {
//                 element.all(by.css(`[class="${alertDanger}"]`)).count().then(function (resCount) {
//                     // console.log('resCount10', resCount, 'countMistakes', countMistakes)
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_ballast_depth').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         if (isExistsRows) {
//                             // console.log('if countAfterAdd11', countAfterAdd, 'numOfRows', numOfRows)
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             // console.log('else countAfterAdd11', countAfterAdd, 'numOfRows', numOfRows)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                         isExistsRows = false;
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
// // 11. Перейти во вкладку "Точечные объекты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км", "пк+", значениями
// // сохраненными в п.9, выбрать 1ое значения из выпадающего списка для поля "Тип" и нажать кнопку "Сохранить". Проверить, что количество записей в таблице увеличилось на 1
// // Если строка уже существует обновить поле "Тип". Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
//     it('11. Перейти во вкладку "Точечные объекты", заполнить данные по таблице. ##can_continue', function (done) {
//         return $h.form.getForm(['track_point_object'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain = element(by.css('[data-field-name="track_point_object"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_point_object').getTotalRows();    //таблица "Точечные объекты"
//             })
//             .then(function (count) {
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                            element.all(by.css(`[data-field-name="track_point_object"] [class="${editInlineButton}"]`)).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             return $h.grid.subgrid('track_point_object').getTotalRows();
//                         })
//                         // .then(function (countAfterAdd) {
//                         //     console.log('countAfterAdd_12 =', countAfterAdd)
//                         //     expect(countAfterAdd).toBe(numOfRows + 1);
//                         // })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="km"]')).click();
//                             elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="pk"]')).click();
//                             elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(start_pk_ar);
//                         })
//                 }
//             })
//             .then(function () {
//                 return element(by.css('[data-container-for="point_object_type"]')).click()
//                     .then(expliciteWait)
//                     .then(function () {
//                         return element.all(by.css('[class="k-item"]')).first().click();
//                     })
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
//             })
//             .then(function () {
//                 element.all(by.css(`[class="${alertDanger}"]`)).count().then(function (resCount) {
//                     // console.log('resCount11', resCount, 'countMistakes', countMistakes)
//                     // expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_point_object').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         // console.log('countAfterAdd12', countAfterAdd, 'numOfRows', numOfRows)
//                         if (isExistsRows) {
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                         isExistsRows = false;
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
// // 12. Перейти во вкладку "Стрелочные переводы и блокпосты"  нажать кнопку "Добавить запись", убедится, что появилась строка с формами для ввода данных. Заполнить поля "км остряка",
// // "пк+ остряка", значениями сохраненными в п.9, "Номер проетка" установить равным 1683.00.000, выбрать 1ое значения из выпадающего списка для поля "Четоность" и нажать кнопку "Сохранить".
// // Проверить, что количество записей в таблице увеличилось на 1. Если строка уже существует обновить поле "Четоность".
// // Убедится, что в правом верхнем углу не возникло красного сообщения об ошибке
//     it('16. Перейти во вкладку "Стрелочные переводы и блокпосты", заполнить данные по таблице. ##can_continue', function (done) {
//         return $h.form.getForm(['track_turnout'])
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain = element(by.css('[data-field-name="track_turnout"]'));
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_turnout').getTotalRows();    //таблица "Стрелочные переводы"
//             })
//             .then(function (count) {
//                 numOfRows = count;
//
//                 if (count > 0) {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             isExistsRows = true;
//                            element.all(by.css(`[data-field-name="track_turnout"] [class="${editInlineButton}"]`)).first().click();
//                         })
//                 } else {
//                     return angularWait()
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                             elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
//                         })
//                         .then(angularWait)
//                         .then(function () {
//                             return $h.grid.subgrid('track_turnout').getTotalRows();
//                         })
//                         // .then(function (countAfterAdd) {
//                         //     console.log('countAfterAdd_13 =', countAfterAdd)
//                         //     expect(countAfterAdd).toBe(numOfRows + 1);
//                         // })
//                         .then(function () {
//                             browser.executeScript('window.scrollTo(0,0);');
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="km"]')).click();
//                             elementMain.element(by.css('input[name="km"]')).clear().sendKeys(start_km_ar);
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="pk"]')).click();
//                             elementMain.element(by.css('input[name="pk"]')).clear().sendKeys(start_pk_ar);
//                         })
//                         .then(function () {
//                             element(by.css('[data-container-for="project_num"]')).click();
//                         })
//                         .then(angularWait)
//                         .then(expliciteWait)
//                         .then(function () {
//                             element(by.css('#select2-drop:not([style*=\"display: none\"]) .select2-input')).sendKeys('1683.00.000');
//                         })
//                         .then(angularWait)
//                         .then(expliciteWait)
//                         .then(function () {
//                             element.all(by.css('#select2-drop:not([style*=\"display: none\"]) .select2-results li.select2-result-selectable')).first().click();
//                         })
//                         .then(function () {
//                             elementMain.element(by.css('[data-container-for="distance"]')).click();
//                             elementMain.element(by.css('input[name="distance"]')).clear().sendKeys(distance_after_repair);
//                         })
//                         .then(function () {
//                             return element(by.css('[data-container-for="replacement_required"] [name="replacement_required"]')).click();
//                         })
//                 }
//             })
//             .then(function () {
//                 return element(by.css('[data-container-for="odevity"]')).click()
//                     .then(expliciteWait)
//                     .then(function () {
//                         return element.all(by.css('[class="select2-result-label"]')).first().click();
//                     })
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
//             })
//             .then(function () {
//                 element.all(by.css(`[class="${alertDanger}"]`)).count().then(function (resCount) {
//                     // console.log('resCount12', resCount, 'countMistakes', countMistakes)
//                     expect(resCount).toBe(countMistakes);
//                     countMistakes = resCount;
//                 })
//             })
//             .then(function () {
//                 return $h.grid.subgrid('track_turnout').getTotalRows()
//                     .then(function (countAfterAdd) {
//                         if (isExistsRows) {
//                             // console.log('if countAfterAdd13', countAfterAdd, 'numOfRows', numOfRows)
//                             expect(countAfterAdd).toBe(numOfRows);
//                         } else {
//                             // console.log('else countAfterAdd13', countAfterAdd, 'numOfRows', numOfRows)
//                             expect(countAfterAdd).toBe(numOfRows + 1);
//                         }
//                         isExistsRows = false;
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
// //
//     // ) Открыть номер проекта - НЕ НУЖЕН, заполняем вручную, тк справочник
//     // it(' Открыть номер проекта. ##can_continue', function (done) {
//     //     browser.waitForAngular()
//     //         .then(function () {
//     //             return element(by.css('[data-field="project_num data-pkfieldid="]')).getText().then(function (text) {
//     //                 projectNum = text;
//     //             })
//     //         })
//     //         .then(function () {
//     //             return element(by.cssContainingText(' .left-align', projectNum)).getWebElement()
//     //                 // return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid) + '\"]')).first().getWebElement()
//     //                 .then(function (event) {
//     //                     browser.actions().doubleClick(event).perform();
//     //                     return browser.waitForAngular();
//     //                 })
//     //         })
//     //         .then(angularWait)
//     //         .then(expliciteWait)
//     //         .then(function () {
//     //             element(by.css('[idea-field-name="project_num"] [ng-click="$ctrl.focusElement()"]')).click();
//     //         })
//     //         .then(function () {
//     //             console.log('заполнение полей')
//     //             return $h.form.setForm({
//     //                 total_length: start_km_ar,
//     //                 start_pk_ar: start_pk_ar,
//     //                 finish_km_after_repair: finish_km_after_repair,
//     //                 finish_pk_after_repair: finish_pk_after_repair,
//     //             })
//     //         })
//     //
//     //         // .then(function () {
//     //         //     return $h.form.processButton(['Выполнить']);    // нажать Выполнить
//     //         // })
//     //         .then(angularWait)
//     //         .then(expliciteWait)
//     //         // .then(function () {
//     //         //     return $h.form.getForm(['workflowstepid']);
//     //         // })
//     //         // .then(function (form) {
//     //         //     return expect(form.workflowstepid.displayValue).toBe('Выполнен');   //Проверить что статус изменился на Выполнен
//     //         // })
//     //         .then(angularWait)
//     //         .then(expliciteWait)
//     //         .then(done);
//     // }, skip);
//
    // 13. В Осмотре участка нажимаем на кнопку "Сохранить". Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    it('13. В Осмотре участка нажимаем на кнопку "Сохранить". Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', async done => {
        /* return angularWait()
            .then(function () {
                // return $h.form.processButton(['CREATE', 'UPDATE']);
                return $h.form.processButton(['UPDATE']);   //жмем на кнопку Сохранить
            })
            .then(function () {
                expect(element(by.css(`[class="${alertSuccess}"]`)).isPresent()).toBe(true)  // Справа наверху возникло зеленое сообщение
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);*/
        await errorCatcher(async () => {
            await $h.form.processButton(['UPDATE']);   //жмем на кнопку Сохранить
            await browser.sleep(5000);
        }, done);
    }, skip);
//
//
// // 18. Вернуться к задаче в Моих нарядах (отфильтровать и открыть нужное по Id сохранненному в п.3) и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось на "Выполнен",
// // нажать кнопку "Назад".
//     it('18. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменилось на "Выполнен". ##can_continue', function (done) {
//         // console.log('9 Вернуться к задаче и нажать на кнопку Выполнить.');
//         browser.waitForAngular()
//             .then(function () {
//                 return browser.get(protractor.helpers.url + '/#/my_tasks_dept')
//                     .then(angularWait)
//                     .then(expliciteWait)
//             })
//             .then(function () {
//                 // console.log('фильтруем задачи');
//                 return $h.grid.main.setSearch([
//                     {
//                         type: 'string',
//                         operator: 'contains',
//                         field: 'displayname',
//                         value: 'Осмотр участка'
//                     },
//                     {
//                         type: 'int',
//                         operator: 'eq',
//                         field: 'taskid',
//                         value: Number(protractor.helpers.taksUid)
//                         // value: taksUid
//                     }
//                 ])
//             })
//             .then(function () {
//                 // return element.all(by.css('[data-pkfieldid=\"' + String(taksUid) + '\"]')).first().getWebElement()
//                 return element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid) + '\"]')).first().getWebElement()
//                     .then(function (event) {
//                         browser.actions().doubleClick(event).perform();
//                         return browser.waitForAngular();
//                     })
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 return $h.form.processButton(['Выполнить']);    // нажать Выполнить
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 return $h.form.getForm(['workflowstepid']);
//             })
//             .then(function (form) {
//                 return expect(form.workflowstepid.displayValue).toBe('Выполнен');   //Проверить что статус изменился на Выполнен
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(function () {
//                 return $h.form.processButton(['BACK']);
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);
//
//     // 19. Выходим из системы
//     it('19. Выходим из системы', function (done) {
//         return angularWait()
//             .then(function () {
//                 browser.actions().mouseMove(element(by.css('[ng-bind=\"$ctrl.currentUser()\"]'))).perform()
//                 expect(element(by.css('[class="button-log-out"]')).isPresent()).toBe(true)  // Проверить что есть кнопка выйти
//                 element(by.css('[class="button-log-out"]')).click()
//             })
//             .then(expliciteWait)
//             .then(function () {
//                 // console.log('Step Выходим 1')
//                 return browser.getCurrentUrl();
//             })
//             .then(function (url) {
//                 // console.log('Step Выходим 2')
//                 expect(url.indexOf('login') >= 0).toBe(true);      // Проверить что  #/login
//             })
//             .then(angularWait)
//             .then(expliciteWait)
//             .then(done);
//     }, skip);

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