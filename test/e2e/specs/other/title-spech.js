describe('Автотест на получение Титула. ', function () {
    const _ = protractor.libs._;
    const $h = protractor.helpers;
    const { errorCatcher } = $h.common;
    const { defaultWaitTimeout } = $h.wait;

    const EC = protractor.ExpectedConditions;

    let buttonAdd = 'Добавить запись';
    let buttonUpdate = 'Сохранить';
    let buttonCancel = 'Отменить участок';
    let buttonIncludeInTitle = 'Включить в титул';
    let linesNumber;
    const jackdawsCount = 4;  // установить 4 галочки
    let number = 0;

    // protractor.helpers.taksUid = 3746821;
    function skip() {
        return !protractor.totalStatus.ok;
    }

    // 1. Переходим пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись
    it('1. Переходим в пункт меню "Мои наряды". Ждём загрузки и убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись.  ##can_continue', async done => {
        console.log('---------Автотест на получение Титула---------');
        console.log('1. Переходим в пункт меню "Мои наряды". Ждём загрузки и убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись. "');
        await errorCatcher(async () => {
            await browser.sleep(1000);
            await $h.menu.selectInMenu(['Мои наряды']);
            await browser.wait(EC.presenceOf(element(by.cssContainingText('.k-header span.table-name', 'Мои наряды'))), defaultWaitTimeout);

            const currentUrl = await browser.getCurrentUrl();
            console.log(currentUrl);
            expect(currentUrl.includes('/my_tasks_wc')).toBe(true);

            const count = await protractor.helpers.grid.main.rowsList().count();
            console.log(count);
            expect(count >= 1).toBe(true);
            await browser.sleep(1500);
        }, done)
    }, skip);

     it('2. Выбираем наряд "Получение титула ремонта" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue', async done => {
        await errorCatcher(async () => {
            console.log('2. Выбираем наряд "Получение титула ремонта" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".');
            await $h.grid.main.setSearch([
                {
                    type: 'int',
                    operator: 'eq',
                    field: 'taskid',
                    value: protractor.helpers.taksUid
                }
            ]);
            await browser.wait(EC.invisibilityOf(element(by.css('.k-loading-mask'))), defaultWaitTimeout);
            await browser.sleep(1500);

            const webElement = await element.all(by.css('[data-pkfieldid=\"' + String($h.taksUid) + '\"]')).first().getWebElement();
            await browser.actions().doubleClick(webElement).perform();
            await browser.wait(EC.presenceOf(element(by.css('[data-button-name="UPDATE"]'))), defaultWaitTimeout);
        }, done)
    }, skip);

    // 3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    it('3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', async done => {
        await errorCatcher(async () => {
            console.log('3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение.');
            await $h.form.setForm({
                assignedto: 'Вернер А.А.'
            });
            await browser.sleep(1500);
            await $h.form.processButton(['UPDATE'], 'task');   //жмем на кнопку Сохранить
            await browser.wait(EC.presenceOf(element(by.css('[class="alert__wrapper alert__wrapper_success"]'))), defaultWaitTimeout);
            const alertIsPresent = await element(by.css('[class="alert__wrapper alert__wrapper_success"]')).isPresent();
            expect(alertIsPresent).toBe(true);
            await browser.sleep(1500);
        }, done);

    }, skip);
    // 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
    it('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось. ##can_continue', async done => {
        await errorCatcher(async () => {
            console.log('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось.');
            const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
            await $h.form.processButton(['В работу']);
            await browser.wait(EC.textToBePresentInElementValue($(selector), 'В работе'), defaultWaitTimeout);
            await browser.sleep(1500);
            const statusValue = await element(by.css(selector)).getAttribute('value');
            const text = statusValue.includes('В работе') ? 'В работе' : statusValue;
            expect(text).toBe('В работе');
            await browser.sleep(1500);
        }, done)
    }, skip);

    // 5. Переходим по ссылке "Перейти к Титулу ремонта ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 2 записи и кнопки "Добавить запись", "Отменить", "Включить в титул"
    it('5. Переходим по ссылке "Перейти к Титулу ремонта. Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 2 записи и кнопки "Добавить запись", "Отменить", "Включить в титул" . ##can_continue', async done => {
        await errorCatcher(async () => {
            console.log('5. Переходим по ссылке "Перейти к Титулу ремонта. Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 2 записи и кнопки "Добавить запись", "Отменить", "Включить в титул"');
            await $h.form.clickOnLink('link_to_action');
            await browser.sleep(1500);

            await browser.wait(EC.presenceOf(element(by.css('a[class="toolbar-buttons k-button idea-button-add-row"]'))), defaultWaitTimeout);

            const recordCount = await element.all(by.css('[data-uid]')).count();
            expect(recordCount >= jackdawsCount).toBe(true);

            const buttonAddElementText = await element(by.css('a[class="toolbar-buttons k-button idea-button-add-row"]')).getText();
            expect(buttonAddElementText.includes(buttonAdd)).toBe(true);

            const buttonCancelElementText = await element(by.css('.k-button[data-button-id="1233"]')).getText();
            expect(buttonCancelElementText.includes(buttonCancel)).toBe(true);

            const buttonIncludeInTitleElementText = await element(by.css('.k-button[data-button-id="1232"]')).getText();
            expect(buttonIncludeInTitleElementText.includes(buttonIncludeInTitle)).toBe(true);

            await browser.sleep(1500);
        }, done);
    }, skip);

    // 6. В открывшемся списке нажимаем на кнопку "Выбрать все", убедиться, что все галочки поставились
    it('6. В открывшемся списке нажимаем на кнопку "Выбрать все". ##can_continue', async done => {
        console.log('6. В открывшемся списке нажимаем на кнопку "Выбрать все".');
        await errorCatcher(async () => {
            await browser.sleep(1500);
            await element(by.css('.k-button.idea-button-select-all')).click();
            linesNumber = await element.all(by.css(' .k-grid-content [aria-selected="true"]')).count();
            const allLinesCount = await element.all(by.css('[data-uid]')).count();
            expect(allLinesCount).toBe(linesNumber);
        }, done);
    }, skip);

    // 7. Снять галку с 2-х ремонтов, убедиться, что галки снялись
    it('7. Снять галку с 2-х ремонтов. ##can_continue', async done => {
        console.log('7. Снять галку с 2-х ремонтов.');
        await errorCatcher(async () => {
            await browser.sleep(1500);
            const elements = element.all(by.css(' .k-grid-content [class="idea-grid-select"]'));
            for (let i = 0; i < jackdawsCount; i++) {
                await elements.get(i).click();
                await browser.sleep(500);
            }
            const notSelectedElementsCount = await element.all(by.css(' .k-grid-content [aria-selected="false"]')).count();
            expect(notSelectedElementsCount).toBe(jackdawsCount); //убедиться, что галки снялись
        }, done);
    }, skip);

    // 8. Нажать на кнопку "Отменить все", убедиться, что все галки снялись
    it('8. Нажать на кнопку Отменить все, убедиться, что все галки снялись. ##can_continue', async done => {
         console.log('8. Нажать на кнопку Отменить все, убедиться, что все галки снялись.')
        await errorCatcher(async () => {
            await browser.sleep(1500);
            await element(by.css('.k-button.idea-button-select-all')).click();
            const notSelectedElementsCount = await element.all(by.css(' .k-grid-content [aria-selected="false"]')).count();
            const allLinesCount = await element.all(by.css('[data-uid]')).count();
            expect(allLinesCount).toBe(notSelectedElementsCount);
        }, done)
    }, skip);

     // 9. Выбрать 2 записи (кликнуть по галкам) из группы "Не указано", нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу, которая называется "Услуга..."
    it('9. Выбрать 2 записи (кликнуть по галкам) из группы Не указано, нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу. ##can_continue', async done => {
        await errorCatcher(async () => {
            console.log('9. Выбрать 2 записи (кликнуть по галкам) из группы Не указано, нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу.');
            const linesNumber = 1;
            let startNumber = 0;
            let childElements = protractor.helpers.grid.main.rowsList();
            let newGroupExists = false;
            // console.log(await childElements);
            for (let i = 0; i < 4; i++) {
                const text = await childElements.get(i).getText();
                if (text.includes('Не указано')) { //убедиться, что есть группа "Не указано"
                    startNumber = i;
                    newGroupExists = true;
                    break;
                }
            }
            console.log('Группа "Не указано" присутствует: ', newGroupExists);
            expect(newGroupExists).toBe(true);
            if (newGroupExists) {
                await childElements.get(startNumber + 1).element(by.css('[class="idea-grid-select"]')).click();
                await browser.sleep(500);

                await childElements.get(startNumber + 2).element(by.css('[class="idea-grid-select"]')).click();
                await browser.sleep(500);

                await childElements.get(startNumber + 3).element(by.css('[class="idea-grid-select"]')).click();
                await browser.sleep(500);

                await childElements.get(startNumber + 4).element(by.css('[class="idea-grid-select"]')).click();
                await browser.sleep(500);
            }
            await element(by.css('[data-button-id="1232"]')).click(); // нажать Включить в титул
            await browser.sleep(5000);
            newGroupExists = false;
            for (let i = 0; i < 4; i++) {
                const text = await childElements.get(i).getText();
                if (text.includes('Услуга')) { //убедиться, что есть группа "Услуга"
                    startNumber = i;
                    newGroupExists = true;
                    break;
                }
            }
            expect(newGroupExists).toBe(true);
            if (newGroupExists) {
                await childElements.get(startNumber + 1).element(by.css('[class="idea-grid-select"]')).click();
                await browser.sleep(500);

                await childElements.get(startNumber + 2).element(by.css('[class="idea-grid-select"]')).click();
                await browser.sleep(500);

                await childElements.get(startNumber + 3).element(by.css('[class="idea-grid-select"]')).click();
                await browser.sleep(500);

                await childElements.get(startNumber + 4).element(by.css('[class="idea-grid-select"]')).click();
                await browser.sleep(500);
            }
        }, done)
     }, skip);

    // 10. Выбрать одну запись из группы "Услуга..." и нажать на кнопку "Отменить". Убедиться, что запись пропадет из списка
    /* it('10. Выбрать одну запись из группы "Услуга..." и нажать на кнопку "Отменить". Убедиться, что запись пропадет из списка. ##can_continue', async done => {
        await errorCatcher(async () => {
            console.log('Выбираем одну запись из группы "Услуга"');
            let startNumber = 0;
            let newGroupExists = false;

            let childElements = protractor.helpers.grid.main.rowsList();
            const childCount = await childElements.count();
            for (let i = 0; i < childCount; i++) {
                const text = await childElements.get(i).getText();
                if (text.includes('Услуга')) { //убедиться, что есть группа "Услуга"
                    startNumber = i;
                    newGroupExists = true;
                    break;
                }
            }
            expect(newGroupExists).toBe(true);
            if (newGroupExists) {
                await childElements.get(startNumber + 1).element(by.css('[class="idea-grid-select"]')).click();
            }
            await browser.sleep(1500);
            await element(by.css('[data-button-id="1233"]')).click();   // нажать Отменить
            await browser.sleep(3000);
        }, done);
     }, skip);*/

    // 11. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен"
     it('11. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен". ##can_continue', async done =>{
       const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
         await errorCatcher(async () => {
             console.log('11. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен".');
             await browser.close();
             await browser.sleep(500);

             const handles = await browser.driver.getAllWindowHandles();
             console.log(`Количество вкладок: ${handles.length}`)
             expect(handles.length > 0).toBe(true);
             if (handles.length) {
                 await browser.driver.switchTo().window(handles[0]);
                 await browser.wait(EC.presenceOf(element(by.css('[data-button-name="Выполнить"]'))), defaultWaitTimeout);
                 await $h.form.processButton(['Выполнить'], 'task');   //жмем на кнопку Выполнить
             }
             await browser.wait(EC.textToBePresentInElementValue($(selector), 'Выполнен'), defaultWaitTimeout);
             const text = await element(by.css(selector)).getAttribute('value');
             console.log(`Статус workflow: ${text}`);
             expect(text).not.toBeNull();
             if (text) {
                 expect(text.trim()).toBe('Выполнен');
             }
             await browser.sleep(3000);

         }, done)
     }, skip);

     it('12. Перейти в услугу и скопировать id всех необходимых нарядов', async done => {
       await errorCatcher(async () => {
           console.log('12. Перейти в услугу и скопировать id всех необходимых нарядов');
           console.log(`Перейти по ссылке /#/service/${$h.serviceId}`);
           await browser.get($h.url + '/#/service/' + $h.serviceId);
           const currentUrl = await browser.getCurrentUrl();
           expect(currentUrl.includes(`/#/service/${$h.serviceId}`)).toBe(true);
           await browser.wait(EC.presenceOf($('button[data-button-name="UPDATE"]')), defaultWaitTimeout);

           const form = await $h.form.getForm(['tasks']);
           const tasks = form?.tasks;
           await browser.sleep(1500);

           if (tasks?.length) {
               const dpgAddWorkCompletionStage = tasks.find(task => task.displayname.includes('Создать этапы выполнения работ по ДПГ'));
               expect(dpgAddWorkCompletionStage).not.toBeNull();
               if (dpgAddWorkCompletionStage) $h.dpgAddWorkCompletionStageId = dpgAddWorkCompletionStage.taskid;

               const dpgSpecifyCompletionStage = tasks.find(task => task.displayname.includes('Указать этапы и режим выполнения участков ремонта пути'));
               expect(dpgSpecifyCompletionStage).not.toBeNull();
               if (dpgSpecifyCompletionStage) $h.dpgSpecifyCompletionStageId = dpgSpecifyCompletionStage.taskid;

               const dpgDistributeTrack = tasks.find(task => task.displayname.includes('Распределить участки ремонта пути по ПМС'));
               expect(dpgDistributeTrack).not.toBeNull();
               if (dpgDistributeTrack) $h.dpgDistributeTrackId = dpgDistributeTrack.taskid;
           }
           console.log($h.dpgAddWorkCompletionStageId, $h.dpgSpecifyCompletionStageId, $h.dpgDistributeTrackId);
           await browser.sleep(3000);
       }, done);
     });
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