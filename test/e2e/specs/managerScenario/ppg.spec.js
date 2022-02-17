describe('Автотест на построение ППГ. ', function () {
  const $h = protractor.helpers;
  const popupHideWait = $h.wait.popupHideWait;
  const waitForModalOpened = $h.wait.waitForModalOpened;
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

  it(testScenario[0], async done => {
    console.log(testScenario[0]);
    try {
      const currentUrl = await browser.getCurrentUrl();
      let s = currentUrl.substring(currentUrl.indexOf('#') + 1);
      if (s !== '/my_tasks_dept') {
        await browser.get($h.url + `/#/my_tasks_dept`);
      }
      expect(s === `/my_tasks_dept`).toBe(true);
    } catch (e) {
      console.log(e);
    }
    await done();
  }, skip);

  it(testScenario[1], async done => {
    console.log(testScenario[1]);
    try {
      await $h.grid.main.setSearch(ppgSearchList)
      await $h.grid.main.openRow(0);
      await browser.sleep(1500);
    } catch (e) {
      console.log(e);
    }
    await done();
  }, skip);

  it(testScenario[2], async done => {
    console.log(testScenario[2]);
    try {
      await $h.form.clickOnLink('link_to_action');
      await waitForModalOpened();
    } catch (e) {
      console.log(e);
    }
    await done();
  }, skip);

  it(testScenario[3], async done => {
    console.log(testScenario[3]);
    try {
      await $h.grid.subgrid('working_periods').addRow();
      await browser.sleep(5000);
      await $h.form.setForm({
        working_type: 'closing',
        request_template: '3',
        distance: 3200,
        planned_start: await $h.common.getTodayStrFormat(),
      });
      await $h.form.processButton('CREATE');
      await browser.wait(EC.presenceOf($('button[data-button-name="DELETE"]')), 20000);
    } catch (e) {
      console.log(e);
    }
    await done();
  }, skip);

  it(testScenario[4], async done => {
    console.log(testScenario[4]);
    try {
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
    } catch (e) {
      console.log(e);
    }
    await done();
  }, skip);

  it(testScenario[5], async done => {
    console.log(testScenario[5]);
    try {
      const { progress, status } = await $h.form.getField('schedule_progress');
      console.log(`Прогресс: ${progress};\nСтатус: ${status};`);
      expect(progress).toBe('100%') && expect(status).toBe('Расчет завершен');
    } catch (e) {
      console.log(e);
    }
    await done();
  }, skip);

  it(testScenario[6], async done => {
    console.log(testScenario[6]);
    try {
      await $h.form.clickOnLink('link_to_request_inspections');
      await browser.wait(EC.presenceOf($('.ppg__toolbar')), 30000);
      await browser.sleep(1500);
      await element(by.css('.topology-btn')).click();
      await browser.sleep(500);
      await $h.common.scrollDown();
      await browser.sleep(5000);
    } catch (e) {
      console.log(e);
    }
    await done();
  }, skip);

  it(testScenario[7], async done => {
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
      console.log(e);
    }
    await done();
  }, skip);

  it(testScenario[8], async done => {
    console.log(testScenario[8]);
    try {
      await element(by.cssContainingText('.ppg__btn', 'Создать запись')).click();
      await $h.wait.waitForModalOpened();
      await browser.sleep(3000);
      await $h.form.closeLastModal();
      await browser.sleep(3000);
    } catch (e) {
      console.log(e);
    }
    await done();
  }, skip);

  it(testScenario[9], async done => {
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
      console.log(e);
    }
    await done();
  }, skip);

}, !protractor.totalStatus.ok);
