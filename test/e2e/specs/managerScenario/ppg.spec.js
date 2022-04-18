describe('Автотест на построение ППГ. ', function () {
    const $h = protractor.helpers;
    const popupHideWait = $h.wait.popupHideWait;
    const { waitForModalOpened } = $h.wait;
    const { errorCatcher } = $h.common;
    const { assignAndSaveTask, pressTakeToWorkButton } = $h.task;
    const {defaultWaitTimeout} = $h.wait;
    const EC = protractor.ExpectedConditions;

    const testScenario = [
        '1. Переход на вкладку МОИ НАРЯДЫ',
        '2. Находим первый наряд содержащий "построение поминутно-пооперационного графика"',
        '3. Нажимаем на ссылку "Перейти к списку окон по участку"',
        '4. Создаем новое технологическое окно',
        '5. Нажимаем на кнопку запустить модель и ожидаем окончания расчётов',
        '6. Проверяем значения прогресса',
        '7. Переходим по URL /#/work_schedule/$id. Скрываем топологию и скроллим вниз',
        '8. Кликаем по стрелке, убеждаемся что окно открылось и закрываем',
        '9. Нажимаем кнопку создать запись, убеждаемся что окно открылось и закрываем',
        '10. Нажимаем на кнопку PDF и вводим случайные данные',
    ]

    let currentSiteLength = 0;
    const serviceId = 1007;

    function skip() {
        return !protractor.totalStatus.ok;
    }

    function getCurrentSiteLengthFromRequest(request) {
        // request - КРН ГП 1 БАЛАЙ км 4203 пк+м 8.58 - км 4206 пк+м 0.88, 2.133 км
        // искомое число - 2.133
        const parts = request.split(',');
        return parts[parts.length - 1].split(' ')[1];
    }
    /* it(testScenario[0], async done => {
      console.log(testScenario[0]);
      await errorCatcher(async () => {
        const currentUrl = await browser.getCurrentUrl();
        let s = currentUrl.substring(currentUrl.indexOf('#') + 1);
        if (s !== '/my_tasks_dept') {
          await browser.get($h.url + `/#/my_tasks_dept`);
        }
        expect(s === `/my_tasks_dept`).toBe(true);
      }, done);
    }, skip);

    it(testScenario[1], async done => {
      console.log(testScenario[1]);
      await errorCatcher(async () => {
        await $h.grid.main.setSearch(ppgSearchList)
        await $h.grid.main.openRow(0);
        await browser.sleep(1500);
      }, done);
    }, skip);

    it(testScenario[2], async done => {
      console.log(testScenario[2]);
      await errorCatcher(async () => {
        await $h.form.clickOnLink('link_to_action');
        await waitForModalOpened();
      }, done);
    }, skip);*/

    it('0. Заходим в систему под ПМС197_Менеджер. ##can_continue', async done => {
        await errorCatcher(async () => {
            await $h.login.logOut();
            await browser.sleep(1500);
            const loginObject = $h.login.getLoginObject();
            await $h.login.loginToPage(null, loginObject.users[3].user, loginObject.users[3].password);
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
                    value: 'Построение поминутно-пооперационного графика',
                },
            ]);
            await browser.wait(EC.invisibilityOf(element(by.css('.k-loading-mask'))), defaultWaitTimeout);
            await browser.sleep(3000);
        }, done);
    }, skip);

    it('2. Выполняем каждый наряд на построение поминутно-пооперационного графика', async done => {
        const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
        const taskCount = await $h.grid.main.dataRowsList().count();
        for (let i = 0; i < taskCount; i++) {
            try {
                const data = $h.grid.main.dataRowsList();
                const event = await data.get(0).getWebElement();
                await browser.actions().doubleClick(event).perform();
                await $h.wait.waitForUpdateButton();
                await browser.sleep(1500);

                const request = await $h.form.getField('request');
                currentSiteLength = $h.sitesLength?.[request] || getCurrentSiteLengthFromRequest(request);
                console.log('Протяженность участка: ', currentSiteLength);

                const text = await element(by.css(selector)).getAttribute('value');
                if (!text.includes('В работе')) {
                    await assignAndSaveTask('Волков С.А.');
                    await pressTakeToWorkButton();
                }
                await openRequestWorkingPeriods();
                const workingPeriods = $h.grid.subgrid('working_periods');
                const count = await workingPeriods.getTotalRows();
                if (count === 0) {
                    await addWorkingPeriod();
                } else {
                    await openExistingWorkingPeriod(workingPeriods);
                }
                await runModel();
                await checkProgress();
                await clickOnLinkToRequestInspections();
                await clickOnArrow()
                await clickOnCreateRecord();
                await downloadPdf();

                await savePpg();

                await $h.form.closeLastModal();
                await browser.sleep(3000);
            } catch (e) {
                console.error(e);
            }
        }
        await done();
    });

    const openRequestWorkingPeriods = async () => {
        console.log('3. Кликаем по ссылке и убеждаемся что открылась запись');
        try {
            await $h.form.clickOnLink('link_to_action');
            await browser.wait(EC.presenceOf($('[data-button-name="UPDATE"]')), defaultWaitTimeout);
            await browser.sleep(1000);

            console.log('TEST: На форме есть кнопка "Сохранить".');
            await expect(element(by.css('[data-button-name="UPDATE"]')).isPresent()).toBe(true);
            await browser.sleep(3000);
        } catch (e) {
            console.error(e);
        }
    };

    const addWorkingPeriod = async () => {
        console.log('4. Добавляем запись в таблицу "Технологическое окно"');
        try {
            const lastModal = element.all(by.css('.modal-dialog')).last();
            await $h.grid.subgrid('working_periods').addRow();
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="CREATE"]'))), defaultWaitTimeout);
            await browser.sleep(1500);

            await $h.form.setForm({
                working_type: 'Закрытие',
                request_template: '3',
                distance: Number(currentSiteLength) * 1000,
                planned_start: await $h.common.getTodayStrFormat(),
            });
            await $h.form.processButton('CREATE');
            await browser.wait(EC.presenceOf(lastModal.element(by.css('[data-button-name="UPDATE"]'))), defaultWaitTimeout);
            await browser.sleep(1500);
        } catch (e) {
            console.error(e);
        }
    };

    const openExistingWorkingPeriod = async workingPeriods => {
        console.log('4. Проваливаемся в существующее технологическое окно');
        try {
            const rows = workingPeriods.dataRowsList();
            const firstRecord = await rows.get(0).getWebElement();
            await browser.actions().doubleClick(firstRecord).perform();
            await browser.wait(EC.visibilityOf($('[data-button-name="Отменить окно"]')), defaultWaitTimeout);
            await browser.sleep(1500);
        } catch (e) {
            console.error(e);
        }
    };

    const runModel = async () => {
        console.log(testScenario[4]);
        try {
            const dropdownElement = await element(by.cssContainingText('.dropdown-toggle', 'Действия'));
            const hasDropdown = await dropdownElement.isPresent();
            if (hasDropdown) {
                console.log('Выпадающий список с действиями найден. Открываем его и нажимаем на кнопку "Запустить модель".')
                await dropdownElement.click();
            }
            await $h.form.processButton('run_progress');
            await popupHideWait();
            await browser.sleep(3000);
        } catch (e) {
            console.error(e);
        }
    };

    const checkProgress = async () => {
        console.log(testScenario[5]);
        try {
            const {progress, status} = await $h.form.getField('schedule_progress');
            console.log(`Прогресс: ${progress};\nСтатус: ${status};`);
            expect(progress).toBe('100%') && expect(status).toBe('Расчет завершен');
        } catch (e) {
            console.error(e);
        }
    };

    const clickOnLinkToRequestInspections = async () => {
        console.log(testScenario[6]);
        try {
            await $h.form.clickOnLink('link_to_request_inspections');
            await browser.wait(EC.presenceOf($('.ppg__toolbar')), defaultWaitTimeout * 2);
            await browser.sleep(1500);
            await element(by.css('.topology-btn')).click();
            await browser.sleep(500);
            await $h.common.scrollDown();
            await browser.sleep(5000);
        } catch (e) {
            console.error(e);
        }
    };

    const clickOnArrow = async () => {
        console.log(testScenario[7]);
        try {
            const arrow = await element.all(by.css('.ip-task-link a path'))
                .filter(async (elem, index) => {
                    const size = await elem.getSize();
                    return size.width > 0 && size.height > 0;
                })
                .first();
            await $h.common.scrollDown();
            await browser.actions().mouseMove(arrow).click().perform();
            await $h.wait.waitForModalOpened()
            await browser.sleep(3000);
            await $h.form.closeLastModal();
            await browser.sleep(3000);
        } catch (e) {
            console.error(e);
        }
    }

    const clickOnCreateRecord = async () => {
        console.log(testScenario[8]);
        try {
            await element(by.cssContainingText('.ppg__btn', 'Создать запись')).click();
            await $h.wait.waitForModalOpened();
            await browser.sleep(3000);
            await $h.form.closeLastModal();
            await browser.sleep(3000);
        } catch (e) {
            console.error(e);
        }
    };

    const downloadPdf = async () => {
        console.log(testScenario[9]);
        try {
            await element(by.cssContainingText('.ppg__btn', 'PDF')).click();
            const inputs = element.all(by.cssContainingText('.schedule__pdf-popup-label', 'ФИО'));
            await inputs.each(async (el, index) => {
                await el.element(by.xpath('following-sibling::input')).clear().sendKeys('test');
                await browser.sleep(500);
            });
            await browser.sleep(1000);
            await element(by.cssContainingText('.schedule__pdf-popup-footer .btn', 'OK')).click();
            await browser.sleep(5000);
        } catch (e) {
            console.error(e);
        }
    }

    const savePpg = async () => {
        console.log('Переводим наряд в статус выполнен и переходим к следующему.');
        try {

            await browser.close();
            const handles = await browser.driver.getAllWindowHandles();
            await browser.driver.switchTo().window(handles[1]);
            await browser.sleep(1000);

            await browser.close();
            await browser.sleep(1000);

            await browser.driver.switchTo().window(handles[0]);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.linkfield__link', 'Перейти к списку окон по участку'))), defaultWaitTimeout);
            await browser.sleep(1500);

            const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
            const locator = $(selector);

            await $h.form.processButton(['Выполнить']);
            await browser.wait(EC.textToBePresentInElementValue(locator, 'Выполнен'), defaultWaitTimeout * 6);

            const text = await locator.getAttribute('value');
            expect(text?.includes('Выполнен')).toBe(true);
            await browser.sleep(1500);
        } catch (e) {
            console.error(e);
        }
    };

}, !protractor.totalStatus.ok);
