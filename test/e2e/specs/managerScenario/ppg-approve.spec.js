describe(
  "Автотест на согласование ППГ",
  function () {
    const $h = protractor.helpers;
    const EC = protractor.ExpectedConditions;

    const { errorCatcher } = $h.common;
    const { defaultWaitTimeout } = $h.wait;
    const { assignAndSaveTask, pressTakeToWorkButton } = $h.task;

    $h.serviceId = $h.serviceId || 1045;

    function skip() {
      return !protractor.totalStatus.ok;
    }

    it("0. Заходим в систему под КраснДРП. ##can_continue", async (done) => {
        await errorCatcher(async () => {
          await $h.login.logOut();
          await browser.sleep(1500);
          const loginObject = $h.login.getLoginObject();
          console.log(loginObject.users);
          await $h.login.loginToPage(
            null,
            loginObject.users[0].user,
            loginObject.users[0].password
          );
          await browser.sleep(1000);
          const currentUrl = await browser.getCurrentUrl();
          if (!currentUrl.includes("my_tasks_wc_for_test")) {
            await browser.get($h.url + "/#/my_tasks_wc_for_test");
            await browser.sleep(500);
          }
          await browser.wait(EC.visibilityOf(element(by.cssContainingText(".k-grid-toolbar .table-name", "Мои задачи"))), 10000);
          await browser.sleep(1000);
        }, done);
      }, skip());

    it("1. Находим все наряды по ID услуги. ##can_continue", async (done) => {
        console.log("1. Находим все наряды по ID услуги");
        await errorCatcher(async () => {
          await browser.sleep(1500);
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
              value: "Согласование поминутно-пооперационных графиков",
            },
          ]);
          await browser.wait(EC.invisibilityOf(element(by.css(".k-loading-mask"))), defaultWaitTimeout);
          await browser.sleep(3000);
        }, done);
      }, skip());

    it("2. Выбираем наряд на согласование поминутно-пооперационных графиков", async (done) => {
        console.log("2. Выбираем наряд на согласование поминутно-пооперационных графиков");
        await errorCatcher(async () => {
          const data = $h.grid.main.dataRowsList();
          const event = await data.get(0).getWebElement();
          await browser.actions().doubleClick(event).perform();
          await $h.wait.waitForUpdateButton();
          await browser.sleep(1500);
        }, done);
      }, skip());

    it("3. Проваливаемся в наряд, назначаем исполнителя и берём наряд в работу.", async (done) => {
        console.log("3. Проваливаемся в наряд, назначаем исполнителя и берём наряд в работу.");
        const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
        await errorCatcher(async () => {
          const text = await element(by.css(selector)).getAttribute("value");
          if (!text.includes("В работе")) {
            await assignAndSaveTask("Вернер А.А.");
            await pressTakeToWorkButton();
          }
          await browser.sleep(1500);
        }, done);
      }, skip());

    it("4. Кликаем по ссылке и убеждаемся что открылся список", async (done) => {
        console.log("4. Кликаем по ссылке и убеждаемся что открылся список");
        await errorCatcher(async () => {
          await $h.form.clickOnLink("link_to_action");
          const addButtonSelector = $("a.idea-button-add-row-modal");
          await browser.wait(EC.presenceOf(addButtonSelector), defaultWaitTimeout);
          await browser.sleep(1000);

          console.log('TEST: На форме есть кнопка "Сохранить".');
          await expect(addButtonSelector.isDisplayed()).toBe(true);
          await browser.sleep(3000);
        }, done);
      }, skip());

    it('4. Очищаем фильтры, заходим в каждый наряд и нажимаем на кнопку "Согласовать"', async (done) => {
        console.log('4. Очищаем фильтры, заходим в каждый наряд и нажимаем на кнопку "Согласовать"');
        await errorCatcher(async () => {
          await $h.grid.main.clearFilters();
          await browser.sleep(2000);
          await $h.grid.main.setSearch([
            {
              type: "enums",
              field: "workflowstepid",
              value: "Согласование графика работ",
            },
          ]);
          await browser.wait(EC.invisibilityOf(element(by.css(".k-loading-mask"))), defaultWaitTimeout);
          await browser.sleep(1500);

          const taskCount = await $h.grid.main.dataRowsList().count();
          for (let i = 0; i < taskCount; i++) {
            const data = $h.grid.main.dataRowsList();
            const event = await data.get(0).getWebElement();
            await browser.actions().doubleClick(event).perform();
            await $h.wait.waitForUpdateButton();
            await browser.sleep(1500);

            const dropdownElement = await element(by.cssContainingText(".dropdown-toggle", "Изменить статус"));
            const hasDropdown = await dropdownElement.isPresent();
            if (hasDropdown) {
              await dropdownElement.click();
            }

            try {
              await $h.form.processButton("Согласован");
              await browser.wait(EC.stalenessOf($(".loader-spinner")), defaultWaitTimeout * 6);
            } catch (e) {
              console.error(e);
            }

            await $h.form.closeLastModal();
            await browser.sleep(3000);
          }
        }, done);
      }, skip());

    it('5. Закрыть вкладку и перевести наряд в статус "Выполнен"', async (done) => {
      await errorCatcher(async () => {
        await browser.close();
        await browser.sleep(1500);
        const handles = await browser.driver.getAllWindowHandles();
        await browser.driver.switchTo().window(handles[0]);

        const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
        const locator = $(selector);
        await browser.wait(EC.presenceOf(element(by.cssContainingText(".linkfield__link", "Перейти к подготовленным участкам"))), defaultWaitTimeout);

        await browser.sleep(1500);
        await $h.form.processButton(["Выполнить"]);
        await browser.wait(EC.textToBePresentInElementValue(locator, "Выполнен"), defaultWaitTimeout * 6);

        const text = await locator.getAttribute("value");
        expect(text?.includes("Выполнен")).toBe(true);
        await browser.sleep(1500);
      }, done);
    });
  },
  !protractor.totalStatus.ok
);
