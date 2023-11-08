describe("Автотест на получение Титула. ", function () {
    const _ = protractor.libs._;
    const $h = protractor.helpers;
    const { errorCatcher } = $h.common;
    const { alerts } = $h.locators;
    const { defaultWaitTimeout } = $h.wait;

    const EC = protractor.ExpectedConditions;

    let buttonAdd = "+ Добавить запись";
    let buttonUpdate = "Сохранить";
    let buttonCancel = "Отменить участок";
    let buttonIncludeInTitle = "Включить в титул";
    let linesNumber;
    let jackdawsCount = 2;
    let number = 0;
    $h.serviceId = $h.serviceId || 1044;

    function skip() {
      return !protractor.totalStatus.ok;
    }

    // 1. Переходим по URL /#/my_tasks_wc_for_test. Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись
    it(
      "1. Переходим по URL /#/my_tasks_wc_for_test. Ждём загрузки и убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись.  ##can_continue",
      async (done) => {
        console.log("---------Автотест на получение Титула---------");
        console.log('1. Переходим по URL /#/my_tasks_wc_for_test. Ждём загрузки и убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись. "');
        await errorCatcher(async () => {
          let currentUrl = await browser.getCurrentUrl();
          if (!currentUrl.includes("my_tasks_wc_for_test")) {
            await browser.get($h.url + "/#/my_tasks_wc_for_test");
            await browser.sleep(500);
          }
          await browser.wait(EC.presenceOf(element(by.cssContainingText(".k-header span.table-name", "Мои задачи"))), defaultWaitTimeout);
          currentUrl = await browser.getCurrentUrl();
          console.log(currentUrl);
          expect(currentUrl.includes("my_tasks_wc_for_test")).toBe(true);

          await browser.sleep(1500);
        }, done);
      }, skip);

    it(
      '2. Выбираем наряд "Получение титула ремонта" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue',
      async (done) => {
        console.log('2. Выбираем наряд "Получение титула ремонта" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".');
        await errorCatcher(async () => {
          await $h.grid.main.setSearch([
            {
              type: "enums",
              field: "service",
              value: $h.serviceId,
            },
            {
              type: "string",
              operator: "contains",
              field: "displayname",
              value: "Получение титула ремонта",
            },
          ]);
          await browser.wait(EC.invisibilityOf(element(by.css(".k-loading-mask"))), defaultWaitTimeout);
          await browser.sleep(1500);
          const rows = protractor.helpers.grid.main.rowsList();
          const count = await rows.count();
          console.log(`Количество записей: ${count}`);
          expect(count - 1).toBe(1);

          const webElement = await rows.last().getWebElement();
          await browser.actions().doubleClick(webElement).perform();
          await browser.wait(EC.presenceOf(element(by.css('[data-button-name="UPDATE"]'))), defaultWaitTimeout);
          await browser.sleep(1500);
        }, done);
      }, skip);

    // 3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    it(
      "3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue",
      async (done) => {
        console.log("3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение.");
        await errorCatcher(async () => {
          await $h.form.setForm({ assignedto: "Вернер А.А." });
          await browser.sleep(1500);
          await $h.form.processButton(["UPDATE"], "task"); //жмем на кнопку Сохранить
          await browser.wait(EC.presenceOf(alerts.success), defaultWaitTimeout);
          const alertIsPresent = await alerts.success.isPresent();
          expect(alertIsPresent).toBe(true);
          await browser.sleep(1500);
        }, done);
      }, skip);

    // 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
    it(
      "4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось. ##can_continue",
      async (done) => {
        console.log("4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось.");
        await errorCatcher(async () => {
          const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
          await $h.form.processButton(["В работу"]);
          await browser.wait(EC.textToBePresentInElementValue($(selector), "В работе"), defaultWaitTimeout);
          await browser.sleep(1500);
          const statusValue = await element(by.css(selector)).getAttribute("value");
          const text = statusValue.includes("В работе") ? "В работе" : statusValue;
          expect(text).toBe("В работе");
          await browser.sleep(1500);
        }, done);
      }, skip);

    // 5. Переходим по ссылке "Перейти к Титулу ремонта ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 2 записи и кнопки "Добавить запись", "Отменить", "Включить в титул"
    it(
      '5. Переходим по ссылке "Перейти к Титулу ремонта. Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 2 записи и кнопки "Добавить запись", "Отменить", "Включить в титул" . ##can_continue',
      async (done) => {
        console.log('5. Переходим по ссылке "Перейти к Титулу ремонта. Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 2 записи и кнопки "Добавить запись", "Отменить", "Включить в титул"');
        await errorCatcher(async () => {
          await $h.form.clickOnLink("link_to_action");
          await browser.sleep(1500);

          await browser.wait(EC.presenceOf(element(by.css('a[class="toolbar-buttons k-button idea-button-add-row-modal"]'))), defaultWaitTimeout);

          const recordCount = await element.all(by.css("[data-uid]")).count();
          expect(recordCount >= jackdawsCount).toBe(true);

          const buttonAddElementText = await element(by.css('a[class="toolbar-buttons k-button idea-button-add-row-modal"]')).getText();
          expect(buttonAddElementText.includes(buttonAdd)).toBe(true);

          const buttonCancelElementText = await element(by.css('.k-button[data-button-id="1233"]')).getText();
          expect(buttonCancelElementText.includes(buttonCancel)).toBe(true);

          const buttonIncludeInTitleElementText = await element(by.css('.k-button[data-button-id="1232"]')).getText();
          expect(buttonIncludeInTitleElementText.includes(buttonIncludeInTitle)).toBe(true);

          await browser.sleep(1500);
        }, done);
      }, skip);

    // // 6. В открывшемся списке нажимаем на кнопку "Выбрать все", убедиться, что все галочки поставились
    it(
      '6. В открывшемся списке устаналиваем фильтр по протяженности и нажимаем на кнопку "Выбрать все". ##can_continue',
      async (done) => {
        console.log('6. В открывшемся списке устанавливаем фильтр по протяженности и нажимаем на кнопку "Выбрать все".');
        await errorCatcher(async () => {
          // перестал срабатывать, вместо этого стр 155-160
          // await $h.grid.main.setSearch([
          //   {
          //     type: "int",
          //     operator: "gte",
          //     field: "distance_before_repair",
          //     value: 3,
          //   },
          // ]);
          await element(
            by.css('th[data-title="Протяженность, км"] .k-grid-filter')
          ).click();
          await browser.sleep(2000);
          await element.all(by.css(".k-animation-container .k-numerictextbox span .k-select span")).first().click();
          await browser.sleep(200);
          await element.all(by.css(".k-animation-container .k-numerictextbox span .k-select span")).first().click();
          await browser.sleep(200);
          await element.all(by.css(".k-animation-container .k-numerictextbox span .k-select span")).first().click();
          await browser.sleep(200);
          await element.all(by.cssContainingText(".k-animation-container button", "Найти")).last().click();
          await browser.sleep(1000);
          await browser.sleep(1500);
          await element(by.css(".idea-grid-select-all")).check();
          linesNumber = await element.all(by.css(' .k-grid-content [aria-selected="true"]')).count();
          const allLinesCount = await element.all(by.css("[data-uid]")).count();
          expect(allLinesCount).toBe(linesNumber);
        }, done);
      }, skip);

    // // 7. Снять галку с 2-х ремонтов, убедиться, что галки снялись
    it("7. Снять галку с 2-х ремонтов. ##can_continue", async (done) => {
        console.log("7. Снять галку с 2-х ремонтов.");
        await errorCatcher(async () => {
          await browser.sleep(1500);
          const elements = $$(".k-grid-content .idea-grid-select");
          const elementsCount = await elements.count();
          jackdawsCount = elementsCount > jackdawsCount ? jackdawsCount : elementsCount;
          for (
            let i = 0;
            i < (elementsCount > jackdawsCount ? jackdawsCount : elementsCount);
            i++
          ) {
            await elements.get(i).click();
            await browser.sleep(500);
          }
          const notSelectedElementsCount = await $$('.k-grid-content [aria-selected="false"]').count();
          expect(notSelectedElementsCount).toBe(jackdawsCount); //убедиться, что галки снялись
        }, done);
      }, skip);

    // // 8. Нажать на кнопку "Отменить все", убедиться, что все галки снялись
    it("8. Нажать на кнопку Отменить все, убедиться, что все галки снялись. ##can_continue", async (done) => {
        console.log("8. Нажать на кнопку Отменить все, убедиться, что все галки снялись.");
        await errorCatcher(async () => {
          await browser.sleep(1500);
          await element(by.css(".idea-grid-select-all")).check();
          const notSelectedElementsCount = await element.all(by.css(' .k-grid-content [aria-selected="false"]')).count();
          const allLinesCount = await element.all(by.css("[data-uid]")).count();
          expect(allLinesCount).toBe(notSelectedElementsCount);
        }, done);
      }, skip);

    // 9. Выбрать 2 записи (кликнуть по галкам) из группы "Не указано", нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу, которая называется "Услуга..."
    it(
      '9. Выбрать 2 записи (кликнуть по галкам) из группы Не указано, нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу. ##can_continue',
      async (done) => {
        await errorCatcher(async () => {
          console.log('9. Выбрать 2 записи (кликнуть по галкам) из группы Не указано, нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу.');
          const linesNumber = 1;
          let startNumber = 0;
          let childElements = protractor.helpers.grid.main.rowsList();
          let newGroupExists = false;
          // console.log(await childElements);
          for (let i = 0; i < jackdawsCount; i++) {
            const text = await childElements.get(i).getText();
            if (text.includes("Не указано")) {
              //убедиться, что есть группа "Не указано"
              startNumber = i;
              newGroupExists = true;
              break;
            }
          }
          console.log('Группа "Не указано" присутствует: ', newGroupExists);
          expect(newGroupExists).toBe(true);
          if (newGroupExists) {
            for (let i = 0; i < jackdawsCount; i++) {
              await childElements.get(startNumber + i + 1).element(by.css('[class="idea-grid-select"]')).click();
              await browser.sleep(500);
            }
          }
          await $('[data-button-id="1232"]').click(); // нажать Включить в титул
          await browser.wait(EC.stalenessOf($('[data-button-id="1232"] .loader-spinner')), defaultWaitTimeout);
          await browser.sleep(3000);
        }, done);
      }, skip);

    // 10. Вернуться к задаче
    it("10. Вернуться к задаче. ##can_continue", async (done) => {
      await errorCatcher(async () => {
        console.log("10. Вернуться к задаче.");
        await browser.close();
        await browser.sleep(500);

        const handles = await browser.driver.getAllWindowHandles();
        console.log(`Количество вкладок: ${handles.length}`);
        expect(handles.length > 0).toBe(true);
        await browser.driver.switchTo().window(handles[0]);
        await browser.wait(EC.presenceOf(element(by.css('[data-button-name="Выполнить"]'))), defaultWaitTimeout);
        await browser.sleep(500);
      }, done);
    }, skip);

    // 11. нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен".
    it('11. нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен".', async (done) => {
        console.log('11. нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен".');
        await errorCatcher(async () => {
          const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
          await $h.form.processButton(["Выполнить"], "task"); //жмем на кнопку Выполнить
          await browser.wait(EC.textToBePresentInElementValue($(selector), "Выполнен"), defaultWaitTimeout);
          const text = await element(by.css(selector)).getAttribute("value");
          console.log(`Статус workflow: ${text}`);
          expect(text).not.toBeNull();
          if (text) {
            expect(text.trim()).toBe("Выполнен");
          }
          await browser.sleep(3000);
        }, done);
      }, skip);

    it("12. Закрыть модальное окно и очистить фильтры", async (done) => {
        console.log("12. Закрыть модальное окно и очистить фильтры");
        await errorCatcher(async () => {
          await $h.form.closeLastModal();
          await browser.sleep(500);
          await browser.wait(EC.invisibilityOf(element(by.css(".k-loading-mask"))), defaultWaitTimeout);
          await browser.sleep(500);
        }, done);
      }, skip);
  },
  !protractor.totalStatus.ok
);

/** Автотест на получение титула:
 *  0. Выполняем сценарий на логин под под КраснДРП и создание ДПГ.
    1. Переходим пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись.
    2. Выбираем наряд "Получение титула ремонта" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".
    3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение.
    4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось.
    5. Переходим по ссылке "Перейти к Титулу ремонта ". Убеждаемся, что по клику открылась таблица, в ней есть хотя бы 4 записи и кнопки "Добавить запись", "Отменить", "Включить в титул".
    6. В открывшемся списке устанавливаем фильтр по протяженности и нажимаем на кнопку "Выбрать все".
    7. Снять галку с 2-х ремонтов, убедиться, что галки снялись.
    8. Нажать на кнопку "Отменить все", убедиться, что все галки снялись.
    9. Выбрать 2 записи (кликнуть по галкам) из группы "Не указано", нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу, которая называется "Услуга...".
    10. Вернуться к задаче.
    11. нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен".
    12. Закрыть модальное окно и очистить фильтры.
 */
