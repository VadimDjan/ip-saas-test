describe('Автотест на Осмотр участка. ', function () {
    const _ = protractor.libs._;
    const $h = protractor.helpers;
    const { errorCatcher } = $h.common;
    const { assignAndSaveTask, pressTakeToWorkButton, getIdFromModalTitle } = $h.task;
    const { defaultWaitTimeout } = $h.wait;
    const Key = protractor.Key;
    const EC = protractor.ExpectedConditions;
    $h.sitesLength = {}; // протяженность участков

    const serviceId = 997;
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

    let siteInspectionRows = {
        count: 0,
        data: null,
    }

    const buttonCalcMvsp = 'Расчет МВСП';
    const updateInlineButton = 'toolbar-inline-buttons idea-button-modify idea-button-update k-grid-update';
    const editInlineButton = 'toolbar-inline-buttons idea-button-modify idea-button-edit k-grid-edit';
    const addInlineButton = 'pull-right toolbar-buttons k-button k-grid-add';
    const alertDanger = 'alert__wrapper alert__wrapper_danger';


    function skip() {
        return !protractor.totalStatus.ok;
    }

    // // 1. Заходим в систему под ПМС197_Менеджер
    it('0. Заходим в систему под ПМС197_Менеджер. ##can_continue', async done => {
        await errorCatcher(async () => {
            await $h.login.logOut();
            await browser.sleep(1500);
            const loginObject = $h.login.getLoginObject();
            await $h.login.loginToPage(null, loginObject.users[1].user, loginObject.users[1].password);
            await browser.sleep(1000);
            const currentUrl = await browser.getCurrentUrl();
            if (!currentUrl.includes('my_tasks_dept')) {
                // await browser.get($h.url + '#/my_tasks_dept');
                await $h.menu.selectInMenu(['Мои наряды']);
                await browser.sleep(500);
            }
            await browser.wait(EC.visibilityOf(element(by.cssContainingText('.k-grid-toolbar .table-name', 'Мои наряды'))), 10000);
            await browser.sleep(1000);
        }, done);
    }, skip);

    it('1. Находим все наряды по ID услуги. ##can_continue', async done => {
        console.log('1. Находим все наряды по ID услуги');
        await errorCatcher(async () => {
            await browser.sleep(1500);
            await $h.grid.main.selectFieldsInColumnMenu('service');
            await browser.sleep(1500);
            await $h.grid.main.setSearch([
                {
                    type: 'enums',
                    field: 'service',
                    value:  $h.serviceId || serviceId,
                },
                {
                    type: 'string',
                    operator: 'contains',
                    field: 'displayname',
                    value: 'Осмотр участка',
                }
            ]);
            await browser.wait(EC.invisibilityOf(element(by.css('.k-loading-mask'))), defaultWaitTimeout);
            await browser.sleep(3000);
        }, done);
    }, skip);

    it ('2. Выполняем каждый наряд на осмотр участка.', async done => {
        const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
        siteInspectionRows.count = await $h.grid.main.dataRowsList().count();
        for (let i = 0; i < siteInspectionRows.count; i++) {
            try {
                const data = $h.grid.main.dataRowsList();
                const event = await data.get(0).getWebElement();
                await browser.actions().doubleClick(event).perform();
                await $h.wait.waitForUpdateButton();
                await browser.sleep(1500);

                const text = await element(by.css(selector)).getAttribute('value');
                const requestName = await $h.form.getField('request');

                // Заполнение необходимых данных
                if (!text.includes('В работе')) {
                    await assignAndSaveTask();
                    await pressTakeToWorkButton();
                }
                await openSiteInspectionTab();
                await fillCommonInformation();
                await fillUpperStructureData();
                await fillSiteLengthData(requestName);
                await fillRailsLengthData();
                await fillRoadProfileData();
                await fillSituationData();
                await fillDepthAndSepLayerData();
                await fillRollingStock();

                // Сохранение
                await saveSiteInspection();
                console.log($h.sitesLength);

                await $h.form.closeLastModal();
                await browser.sleep(3000);
            } catch (e) {
                console.error(e);
            }
        }
        await done();
    }, skip);

    const openSiteInspectionTab = async () => {
        console.log('3. Кликаем по ссылке и убеждаемся что открылась запись');
        try {
            await $h.form.clickOnLink('link_to_action');
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="get_inspecting_templ"]'))), defaultWaitTimeout);
            await browser.sleep(500);

            console.log('TEST: На форме есть кнопки "Сохранить", "Отменить участок" и "Получить шаблон осмотра".');
            await expect(element(by.css('[data-button-name="UPDATE"]')).isPresent()).toBe(true);
            await expect(element(by.css('[data-button-name="get_inspecting_templ"]')).isPresent()).toBe(true);
            await browser.sleep(1500);
        } catch (e) {
            console.error(e);
        }
    };

    const fillCommonInformation = async () => {
        console.log('4. Заполнить обязательные поля на вкладке "Общая информация".');
        try {
            const formData = {
                railtrack_class: '2',
                track_specialization: 'В',
                temp_amplitude: '>110',
                powerunit: 'Электрическая пост.',
                track_number: 4,
                train_num: 5,
                region: 'Красноярский',
                subject_rf: 'Красноярский край',
                established_velocity_cargo: 80,
                established_velocity: 100,
                volume_of_traffic: 167,
                tonnage: 1000,
                rails_weld_department: 'ПМС-197',
                rsgrid_build_department: 'ПМС-197',
            }
            await $h.form.setFormWithUnfilledFields(formData);
            await browser.sleep(1500);
        } catch (e) {
            console.error(e);
        }
    };

    // верхнее строение пути
    const fillUpperStructureData = async () => {
        console.log('5. Перейти во вкладку "Верхнее строение пути" поля в разделе "До ремонта", заполнить обязательные поля.');
        try {
            await browser.sleep(1000);
            const formData = {
                rail_brand_br: '$_first',
                bug_rail_count: 10,
                sleeper_br: '$_first',
                bug_sleeper_count: 10,
                clips_br: '$_first',
                ballast_br: '$_first',
                signal_system_br: '$_first',
                dirtyness: 34,
                trackform_br: '$_first',
                rail_situation: '$_first',
                sleeper_situation: '$_first',
                clips_situation: '$_first',
                trackform_ar: '$_first',
                rail_brand_ar: '$_first',
            };

            await $h.form.setFormWithUnfilledFields(formData);

            await browser.sleep(1500);
            await $$('.details__modal').last().sendKeys(Key.HOME);
            await $h.form.processButton(['UPDATE']);
            await browser.wait(EC.stalenessOf(element(by.css('[data-button-name="UPDATE"] .loader-spinner'))), defaultWaitTimeout);
            await browser.sleep(1500);
        } catch (e) {
            console.error(e);
        }
    };

    // протяженность участка
    const fillSiteLengthData = async request => {
        console.log('6. Перейти во вкладку "Протяженность участка", заполнить открытые поля и строки таблиц: "Нестандартные километры"/"Нестандартные пикеты".');
        try {
            const form = await $h.form.getForm(['start_km_br', 'start_pk_br', 'finish_km', 'finish_pk_before_repair', 'distance_before_repair']);
            start_km_ar = form['start_km_br'];
            start_pk_ar = form['start_pk_br'];
            finish_km_after_repair = form['finish_km'];
            finish_pk_after_repair = form['finish_pk_before_repair'];
            distance_after_repair = form['distance_before_repair'];

            $h.sitesLength[request] = distance_after_repair;
            console.log('distance after repair', distance_after_repair);

            await $h.form.setFormWithUnfilledFields({
                start_km_ar: start_km_ar,
                start_pk_ar: start_pk_ar,
                finish_km_after_repair: finish_km_after_repair,
                finish_pk_after_repair: finish_pk_after_repair,
            });
            elementMain = element(by.css('[data-field-name="unusual_km"]'));

            const totalRows = await $h.grid.subgrid('unusual_km').getTotalRows();    //таблица "Нестандартные километры"
            numOfRows = totalRows;
            await browser.sleep(1000);
            await browser.executeScript('window.scrollTo(0,0);');
            if (totalRows > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="unusual_km"] [class="${editInlineButton}"]`)).first().click();
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();

                await elementMain.element(by.css('[data-container-for="km"]')).click();
                await elementMain.element(by.css('input[name="km"]')).clear().sendKeys(finish_km_after_repair);
            }
            await browser.executeScript('window.scrollTo(0,0);');
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

            await browser.sleep(1500);
            await elementMain.element(by.css('[data-container-for="km"]')).click();
            await elementMain.element(by.css('input[name="km"]')).clear();
            await elementMain.element(by.css('[data-container-for="km"]')).click();
            await elementMain.element(by.css('input[name="km"]')).sendKeys(start_km_ar);
            await browser.sleep(500);

            await elementMain.element(by.css('[data-container-for="pk"]')).click();
            await elementMain.element(by.css('input[name="pk"]')).clear();
            await elementMain.element(by.css('[data-container-for="pk"]')).click();
            await elementMain.element(by.css('input[name="pk"]')).sendKeys(Math.ceil(start_pk_ar));
            await browser.sleep(500);

            await elementMain.element(by.css('[data-container-for="distance"]')).click();
            await elementMain.element(by.css('input[name="distance"]')).clear();
            await elementMain.element(by.css('[data-container-for="distance"]')).click();
            await elementMain.element(by.css('input[name="distance"]')).sendKeys((Number(distance_after_repair) + 1));
            await browser.sleep(500);

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
        } catch (e) {
            console.error(e);
        }
    };

    // протяженность рельсов
    const fillRailsLengthData = async () => {
        console.log('7. Перейти во вкладку "Протяженность рельсов", заполнить данные по таблице".');
        try {
            await browser.sleep(1500);
            const track_rail_distance = await $h.form.getForm(['track_rail_distance']);
            elementMain = element(by.css('[data-field-name="track_rail_distance"]'));
            const count = await $h.grid.subgrid('track_rail_distance').getTotalRows();    //таблица "Протяженность рельсов"
            numOfRows = count;
            if (count > 0) {
                await browser.executeScript('window.scrollTo(0,0);');
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_rail_distance"] [class="${editInlineButton}"]`)).first().click();
                await browser.sleep(500);
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
            let firstContainer = $$('.k-popup.k-group').filter(async el => await el.isDisplayed()).first();
            await firstContainer.$$('.k-item').first().click();
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
        } catch (e) {
            console.error(e);
        }
    };

    // план и профиль пути
    const fillRoadProfileData = async () => {
        console.log('8. Перейти на вкладку "План и профиль пути" и заполнить таблицы');
        try {
            await $h.form.getForm(['track_grading']);
            elementMain = element(by.css('[data-field-name="track_grading"]'));
            let count = await $h.grid.subgrid('track_grading').getTotalRows();    //таблица "Профиль пути"
            numOfRows = count;
            await browser.executeScript('window.scrollTo(0,0);');
            if (count > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_grading"] [class="${editInlineButton}"]`)).first().click();
                await browser.sleep(500);
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.executeScript('window.scrollTo(0,0);');
                await browser.sleep(500);

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
            numOfRows = count;

            await browser.executeScript('window.scrollTo(0,0);');
            if (count > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_topology"] [class="${editInlineButton}"]`)).first().click();
                await browser.sleep(500);
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.executeScript('window.scrollTo(0,0);');
                await browser.sleep(500);

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
            let firstContainer = $$('.k-popup.k-group').filter(async el => await el.isDisplayed()).first();
            await firstContainer.$$('.k-item').first().click();
            await browser.sleep(500);
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
        } catch (e) {
            console.error(e);
        }
    };

    // ситуация
    const fillSituationData = async () => {
        console.log('9. Перейти во вкладку "Ситуация". Редактировать/заполнить таблицы "Ситуация" и "Места выгрузки".');
        try {
            await $h.form.getForm(['track_situation']);
            await browser.sleep(1500);

            elementMain = element(by.css('[data-field-name="track_situation"]'));
            let count = await $h.grid.subgrid('track_situation').getTotalRows();
            numOfRows = count;
            await browser.executeScript('window.scrollTo(0,0);');
            if (count > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_situation"] [class="${editInlineButton}"]`)).first().click();
                await browser.sleep(500);
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.sleep(500);
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
                let firstContainer = $$('.k-popup.k-group').filter(async el => await el.isDisplayed()).first();
                await firstContainer.$$('.k-item').first().click();
                await browser.sleep(500);

                await element(by.css('[data-container-for="is_ditch_machine_required"] [name="is_ditch_machine_required"]')).click();
                await browser.sleep(500);

                await element(by.css('[data-container-for="is_higher_then4m"] [name="is_higher_then4m"]')).click();
                await browser.sleep(500);
            }
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
                await browser.sleep(500);
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.sleep(500);
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
            }
            await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            await browser.sleep(3000);

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
        } catch (e) {
            console.error(e);
        }
    };

    // балласт, разделительный слой
    const fillDepthAndSepLayerData = async () => {
        console.log('10. Перейти во вкладку "Балласт, разделительный слой". Редактировать/заполнить таблицы "Глубина очистки" и "Разделительный слой".');
        try {
            await $h.form.getForm(['track_ballast_depth']);
            await browser.sleep(1500);

            elementMain = element(by.css('[data-field-name="track_ballast_depth"]'));
            let count = await $h.grid.subgrid('track_ballast_depth').getTotalRows();
            numOfRows = count;
            await browser.executeScript('window.scrollTo(0,0);');
            if (count > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_ballast_depth"] [class="${editInlineButton}"]`)).first().click();
                await browser.sleep(500);
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.sleep(500);
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

                await element(by.css('[data-container-for="depth_type"] .k-select')).click();
                await browser.sleep(500);
                let firstContainer = $$('.k-popup.k-group').filter(async el => await el.isDisplayed()).first();
                await firstContainer.$$('.k-item').first().click();
                await browser.sleep(1000);
            }
            await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            await browser.sleep(2000);

            let dangerCount = await element.all(by.css(`[class="${alertDanger}"]`)).count();
            console.log(`Количество ошибок: ${dangerCount}`);
            expect(dangerCount).toBe(countMistakes);
            countMistakes = dangerCount;

            let countAfterAdd = await $h.grid.subgrid('track_ballast_depth').getTotalRows();
            if (isExistsRows) {
                expect(countAfterAdd).toBe(numOfRows);
            } else {
                expect(countAfterAdd).toBe(numOfRows + 1);
            }
            isExistsRows = false;


            elementMain = element(by.css('[data-field-name="track_sep_layer"]'));
            count = await $h.grid.subgrid('track_sep_layer').getTotalRows();    //таблица "Места выгрузки"
            numOfRows = count;

            if (count > 0) {
                isExistsRows = true;
                await element.all(by.css(`[data-field-name="track_sep_layer"] [class="${editInlineButton}"]`)).first().click();
                await browser.sleep(500);
            } else {
                await elementMain.element(by.css(`[class="${addInlineButton}"]`)).click();
                await browser.sleep(500);
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

                await element(by.css('[data-container-for="sep_layer_type"] .k-select')).click();
                await browser.sleep(500);
                let firstContainer = $$('.k-popup.k-group').filter(async el => await el.isDisplayed()).first();
                await firstContainer.$$('.k-item').first().click();
                await browser.sleep(500);

                await element(by.css('[data-container-for="gthick"] .k-select')).click();
                await browser.sleep(500);
                firstContainer = $$('.k-popup.k-group').filter(async el => await el.isDisplayed()).first();
                await firstContainer.$$('.k-item').first().click();
                await browser.sleep(500);
            }
            await elementMain.element(by.css(`[class="${updateInlineButton}"]`)).click();
            await browser.sleep(3000);

            dangerCount = await element.all(by.css(`[class="${alertDanger}"]`)).count();
            console.log(`Количество ошибок: ${dangerCount}`);
            expect(dangerCount).toBe(countMistakes);
            countMistakes = dangerCount;

            countAfterAdd = await $h.grid.subgrid('track_sep_layer').getTotalRows();
            if (isExistsRows) {
                expect(countAfterAdd).toBe(numOfRows);
            } else {
                expect(countAfterAdd).toBe(numOfRows + 1);
            }
            isExistsRows = false;
            await browser.sleep(1500);
        } catch (e) {
            console.error(e);
        }
    };

    // тяговый подвижной состав
    const fillRollingStock = async () => {
        const formData = [
            {
                station_depart: 'АБАБКОВО',
                station_destin: '$_first',
                locomotive: '2М62УК',
                distance: 100,
                average_speed: 30,
            },
            {
                station_depart: 'ШАБЛЫКИНО',
                station_destin: '$_first',
                locomotive: '2М62УК',
                distance: 50,
                average_speed: 40,
            },
        ];
        console.log('11. Перейти во вкладку "Тяговый подвижной состав". Заполнить поля "Грузовой локомотив", "Маневровый локомотив" и таблицу "Сведения о расстоянии транспортировки"');
        try {
            await browser.sleep(1500);

            await $h.form.setFormWithUnfilledFields({
                cargo_loco: '$_first',
                shunting_loco: '$_first',
            });

            await browser.sleep(500);

            elementMain = $('[data-field-name="transport_distance_inf"]');
            const count = await $h.grid.subgrid('transport_distance_inf').getTotalRows();
            console.log('Количество записей: ', count);
            for (let i = 0; i < 2 - count; i++) {
                const buttonElement = elementMain.$('a.idea-button-add-row');
                await browser.actions().mouseMove(buttonElement).click().perform();
                await browser.wait(EC.visibilityOf($('[data-button-name="CREATE"]')), defaultWaitTimeout);
                await browser.sleep(1500);

                await $h.form.setForm(formData[i]);
                await $h.form.processButton(['CREATE']);
                await browser.wait(EC.stalenessOf($('.loader-spinner')), defaultWaitTimeout);
                await browser.sleep(1500);

                await $h.form.closeLastModal();
                await browser.sleep(2000);
            }
            await browser.sleep(1500);
        } catch (e) {
            console.error(e);
        }
    };


    const saveSiteInspection = async () => {
        console.log('В Осмотре участка нажимаем на кнопку "Сохранить".');
        try {
            const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
            const locator = $(selector);
            const lastModal = $$('.details__modal').last();

            await lastModal.sendKeys(Key.HOME);
            await $h.form.processButton(['UPDATE']);   //жмем на кнопку Сохранить
            await browser.wait(EC.stalenessOf(element(by.css('[data-button-name="UPDATE"] .loader-spinner'))), defaultWaitTimeout);
            await browser.sleep(1500);

            await browser.close();
            await browser.sleep(1500);

            const handles = await browser.driver.getAllWindowHandles();
            await browser.driver.switchTo().window(handles[0]);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.linkfield__link', 'Заполнить данные по осмотру участка'))), defaultWaitTimeout);

            await browser.sleep(1500);
            await $h.form.processButton(['Выполнить']);
            await browser.wait(EC.textToBePresentInElementValue(locator, 'Выполнен'), defaultWaitTimeout);

            const text = await locator.getAttribute('value');
            expect(text?.includes('Выполнен')).toBe(true);
            await browser.sleep(1500);
        } catch (e) {
            console.error(e);
        }
    };
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