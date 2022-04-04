describe('Автотест на построение ППГ. ', function () {
  const $h = protractor.helpers;
  const popupHideWait = $h.wait.popupHideWait;
  const waitForModalOpened = $h.wait.waitForModalOpened;
  const { errorCatcher } = $h.common;
  const { defaultWaitTimeout } = $h.wait;
  const EC = protractor.ExpectedConditions;
  const ppgSearchList = [
    {
      field: 'displayname',
      operator: 'contains',
      value: 'построение поминутно-пооперационного графика',
      type: 'string',
    },
  ];

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

  function skip() {
    return !protractor.totalStatus.ok;
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

  it('Разлогиниваемся, заходим под юзером ПМС-197_менед', async done => {
    await errorCatcher(async () => {
      console.log('Разлогиниваемся, заходим под юзером ПМС-197_менед');
      await $h.login.logOut();
      await browser.wait(EC.presenceOf(element(by.css('.login-container'))), defaultWaitTimeout);
      await browser.sleep(1500);

      const loginObject = $h.login.getLoginObject();
      await $h.login.loginToPage(null, loginObject.users[1].user, loginObject.users[1].password);
      await browser.sleep(1000);
      const currentUrl = await browser.getCurrentUrl();
      if (!currentUrl.includes('my_tasks_dept')) {
        await browser.get($h.url + '#/my_tasks_dept');
      }
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.k-grid-toolbar .table-name', 'Мои наряды'))), defaultWaitTimeout);
      await browser.sleep(1000);
    }, done);
  }, skip);

  it('Переходим к услуге', async done => {
    await errorCatcher(async () => {
      console.log('Переходим к услуге');
      const serviceId = $h.serviceId || '932';
      await browser.get($h.url + '#/service/' + serviceId);
      await browser.wait(EC.presenceOf(element(by.css('[data-button-name="calc_service_cost"]'))), defaultWaitTimeout);
      await browser.sleep(1500);

      const form = await $h.form.getForm(['requests']);

      $h.requestsId = form.requests[0].items[0].items[0].requestid;
      const event = await element.all(by.css('[data-pkfieldid=\"' + String($h.requestsId) + '\"]')).first().getWebElement();
      await browser.actions().doubleClick(event).perform();
      await browser.sleep(1000);

      await browser.wait(EC.presenceOf(element(by.css('[data-button-name="calc_mvsp"]'))), defaultWaitTimeout);
      await browser.sleep(1500);
    }, done);
  }, skip);

  it(testScenario[3], async done => {
    console.log(testScenario[3]);
    await errorCatcher(async () => {
      const lastModal = element.all(by.css('.modal-dialog')).last();
      await browser.sleep(2000);

      const { tasks } = await $h.form.getForm(['tasks']);
      console.log('Количество нарядов: ', tasks.length);
      expect(tasks.length > 0).toBe(true);

      const ppgTask = tasks.find(task => task.displayname.includes('Построение поминутно-пооперационного графика'));
      if (ppgTask) {
        console.log(ppgTask.taskid);
        const event = await lastModal.all(by.css('[data-pkfieldid=\"' + String(ppgTask.taskid) + '\"]')).first().getWebElement();
        await browser.actions().mouseMove(event).doubleClick(event).perform();
        await browser.wait(EC.presenceOf(element(by.css('[data-field-name="link_to_action"]'))), defaultWaitTimeout);

        await browser.sleep(1500);

        await $h.form.clickOnLink('link_to_action');
        await browser.wait(EC.presenceOf(element(by.css('[data-button-name="UPDATE"]'))), defaultWaitTimeout);
        await browser.sleep(1500);

        await $h.grid.subgrid('working_periods').addRow();
        await browser.wait(EC.presenceOf(element(by.css('[data-button-name="CREATE"]'))), defaultWaitTimeout);
        await browser.sleep(1500);

        await $h.form.setForm({
          working_type: 'Закрытие',
          request_template: '3',
          distance: 3200,
          planned_start: await $h.common.getTodayStrFormat(),
        });
        await $h.form.processButton('CREATE');
        await browser.wait(EC.presenceOf(lastModal.element(by.css('[data-button-name="UPDATE"]'))), defaultWaitTimeout);
      }
    }, done);
  }, skip);

  it(testScenario[4], async done => {
    console.log(testScenario[4]);
    await errorCatcher(async () => {
      await browser.sleep(1500);
      const dropdownElement = await element(by.cssContainingText('.dropdown-toggle', 'Действия'));
      const hasDropdown = await dropdownElement.isPresent();
      if (hasDropdown) {
        console.log('Выпадающий список с действиями найден. Открываем его и нажимаем на кнопку "Запустить модель".')
        await dropdownElement.click();
      }
      await $h.form.processButton('run_progress', 'working_period');
      await popupHideWait();
      await browser.sleep(3000);
    }, done);
  }, skip);

  it(testScenario[5], async done => {
    console.log(testScenario[5]);
    await errorCatcher(async () => {
      const { progress, status } = await $h.form.getField('schedule_progress');
      console.log(`Прогресс: ${progress};\nСтатус: ${status};`);
      expect(progress).toBe('100%') && expect(status).toBe('Расчет завершен');
    }, done);
  }, skip);

  it(testScenario[6], async done => {
    console.log(testScenario[6]);
    await errorCatcher(async () => {
      await $h.form.clickOnLink('link_to_request_inspections');
      await browser.wait(EC.presenceOf($('.ppg__toolbar')), defaultWaitTimeout*2);
      await browser.sleep(1500);
      await element(by.css('.topology-btn')).click();
      await browser.sleep(500);
      await $h.common.scrollDown();
      await browser.sleep(5000);
    }, done);
  }, skip);

  it(testScenario[7], async done => {
    console.log(testScenario[7]);
    await errorCatcher(async () => {
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
    }, done);
  }, skip);

  it(testScenario[8], async done => {
    console.log(testScenario[8]);
    await errorCatcher(async () => {
      await element(by.cssContainingText('.ppg__btn', 'Создать запись')).click();
      await $h.wait.waitForModalOpened();
      await browser.sleep(3000);
      await $h.form.closeLastModal();
      await browser.sleep(3000);
    }, done);
  }, skip);

  it(testScenario[9], async done => {
    console.log(testScenario[9]);
    await errorCatcher(async () => {
      await element(by.cssContainingText('.ppg__btn', 'PDF')).click();
      const inputs = element.all(by.cssContainingText('.schedule__pdf-popup-label', 'ФИО'));
      await inputs.each(async (el, index) => {
        await el.element(by.xpath('following-sibling::input')).clear().sendKeys('test');
        await browser.sleep(500);
      });
      await browser.sleep(1000);
      await element(by.cssContainingText('.schedule__pdf-popup-footer .btn', 'OK')).click();
      await browser.sleep(5000);
    }, done);
  }, skip);

}, !protractor.totalStatus.ok);
