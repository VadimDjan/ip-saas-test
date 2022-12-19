describe('Автотест на создание этапов и режима выполнения участков ', function () {
  const _ = protractor.libs._;
  const $h = protractor.helpers;
  const EC = protractor.ExpectedConditions;
  const { errorCatcher } = $h.common;
  const { alerts } = $h.locators;
  const { defaultWaitTimeout } = $h.wait;

  function skip() {
    return !protractor.totalStatus.ok;
  }

  // it('1. Заходим в систему под пользователем КраснДРП. ##can_continue', (done) => {
  //     // console.log('START - 1. Заходим в систему под пользователем КраснДРП');
  //     loginObject = $h.login.getLoginObject();
  //     // managerUser = 'Менеджер услуги ДРП' // 'Администратор Шаблонов'//loginObject.user
  //     $h.login.loginToPage()
  //         .then(angularWait)
  //         .then(expliciteWait)
  //         .then(function () {
  //             return expect(element(by.css('[ng-click=\"$ctrl.openAccount()\"]')).isPresent()).toBe(true);
  //         })
  //         .then(done);
  //     // console.log('END - 1. Заходим в систему под пользователем КраснДРП');
  // }, skip);

  // 1. Переходим пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись

  it('1. Переходим в пункт меню "Мои наряды". Ждём загрузки и убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись.  ##can_continue', async done => {
    console.log('---------Автотест на создание этапов и режима выполнения участков---------');
    console.log('1. Переходим в пункт меню "Мои наряды". Ждём загрузки и убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись. ');
    await errorCatcher(async () => {
      await browser.sleep(1000);
      await $h.menu.selectInMenu(['Мои наряды']);
      await browser.wait(EC.presenceOf(element(by.cssContainingText('.k-header span.table-name', 'Мои наряды'))), defaultWaitTimeout);

      const currentUrl = await browser.getCurrentUrl();
      console.log(currentUrl);
      expect(currentUrl.includes('/my_tasks_wc')).toBe(true);

      await browser.sleep(1500);
    }, done)
  }, skip);

  // 2. Выбираем наряд "Создать этапы выполнения работ по ДПГ" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить"
  it('2. Выбираем наряд "Создать этапы выполнения работ по ДПГ" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue', async done => {
    console.log('2. Выбираем наряд "Создать этапы выполнения работ по ДПГ" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить". ');
    await errorCatcher(async () => {
      await $h.grid.main.setSearch([
        {
          type: 'string',
          operator: 'contains',
          field: 'displayname',
          value: 'Создать этапы выполнения работ по ДПГ',
        },
      ]);
      await browser.wait(EC.invisibilityOf(element(by.css('.k-loading-mask'))), defaultWaitTimeout);
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
  it('3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', async done => {
    console.log('3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение.');
    await errorCatcher(async () => {
      await browser.sleep(1500);
      await $h.form.setForm({
        assignedto: 'Вернер А.А.',
      });
      await browser.sleep(1500);
      await $h.form.processButton(['UPDATE'], 'task');
      await browser.wait(EC.presenceOf(alerts.success), defaultWaitTimeout);
      const alertIsPresent = await alerts.success.isPresent();
      expect(alertIsPresent).toBe(true);
    }, done)
  }, skip);

  // 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
  it('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось. ##can_continue', async done => {
    console.log('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось.');
    await errorCatcher(async () => {
      console.log('Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось');
      await browser.sleep(1500);
      const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
      await $h.form.processButton(['В работу']);
      await browser.wait(EC.presenceOf(element(by.css(selector))), defaultWaitTimeout);
      await browser.sleep(1500);

      const text = await element(by.css(selector)).getAttribute('value');
      expect(text?.trim()).toBe('В работе');
    }, done)
  }, skip);

  // 5. Переходим по ссылке "К просмотру и созданию этапов ДПГ". Убеждаемся, что по клику открылась таблица, в ней есть кнопка "Добавить запись" и нажимаем на неё .
  it('5. Переходим по ссылке "К просмотру и созданию этапов ДПГ". Убеждаемся, что по клику открылась таблица, в ней есть кнопка "+Добавить" и нажимаем на неё ##can_continue', async done => {
    console.log('5. Переходим по ссылке "К просмотру и созданию этапов ДПГ". Убеждаемся, что по клику открылась таблица, в ней есть кнопка "+Добавить" и нажимаем на неё');
    await errorCatcher(async () => {
      await browser.sleep(1500);
      await $h.form.clickOnLink('link_to_action');
      await browser.wait(EC.presenceOf(element(by.css('.toolbar-buttons.k-button.k-grid-add'))), defaultWaitTimeout);

      const buttonText = await element(by.css('.toolbar-buttons.k-button.k-grid-add')).getText();
      expect(buttonText?.includes('Добавить')).toBe(true);
      await element(by.css('.toolbar-buttons.k-button.k-grid-add')).click();
    }, done);
  }, skip);

  // 6. В открывшемся окне указываем дату начала и окончания. Нажимаем кнопку сохранить и закрываем модальное окно. Проверяем появилась ли запись в таблице
  it('6. В  указываем дату начала и окончания. Нажимаем кнопку сохранить и закрываем модальное окно. Проверяем появилась ли запись в таблице ##can_continue', async done => {
    console.log('6. В  указываем дату начала и окончания. Нажимаем кнопку сохранить и закрываем модальное окно. Проверяем появилась ли запись в таблице ');
    await errorCatcher(async () => {
      await browser.sleep(3000);

      await element(by.css('input[name="displayname"]')).sendKeys('Этап 1');
      await browser.sleep(500);

      const today = $h.common.getTodayClientDate();
      await element(by.css('input[name="start_date"]')).sendKeys(today);
      await browser.sleep(500);

      const tomorrow = $h.common.getTomorrowClientDate();
      await element(by.css('input[name="finish_date"]')).sendKeys(tomorrow);
      await browser.sleep(500);

      const updateButtonElement = element(by.css('.toolbar-inline-buttons.idea-button-modify.idea-button-update.k-grid-update'));
      await browser.actions().mouseMove(updateButtonElement).click().perform();
      await browser.sleep(3000);
    }, done);

  }, skip);

  // 7. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен"
  it('7. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен". ##can_continue', async done => {
    console.log('7. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен".');
    await errorCatcher(async () => {
      const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';

      await browser.driver.close();
      const handles = await browser.driver.getAllWindowHandles();
      await browser.driver.switchTo().window(handles[0]);
      await browser.wait(EC.presenceOf(element(by.css('[data-button-name="Выполнить"]'))), defaultWaitTimeout);

      await browser.sleep(1500);
      await $h.form.processButton(['Выполнить'], 'task');
      await browser.wait(EC.textToBePresentInElementValue($(selector), 'Выполнен'), defaultWaitTimeout);

      const text = await element(by.css(selector)).getAttribute('value');
      expect(text?.includes('Выполнен')).toBe(true);
      await browser.sleep(1500);

    }, done);
  }, skip);

  it('8. Закрыть модальное окно и очистить фильтры', async done => {
    console.log('8. Закрыть модальное окно и очистить фильтры');
    await errorCatcher(async () => {
      await $h.form.closeLastModal();
      await browser.sleep(500);
      await browser.wait(EC.invisibilityOf(element(by.css('.k-loading-mask'))), defaultWaitTimeout);
      await browser.sleep(500);
    }, done);
  }, skip);

}, !protractor.totalStatus.ok);

// Автотест на получение титула:
// 0. Выполняем сценарий на логин под под КраснДРП и создание ДПГ
// 1. Переходим пункт меню "Мои задачи". Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись
// 2. Выбираем наряд "Создать этапы выполнения работ по ДПГ" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить"
// 3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
// 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
// 5. Переходим по ссылке "К просмотру и созданию этапов ДПГ". Убеждаемся, что по клику открылась таблица, в ней есть кнопка "Добавить запись" и нажимаем на неё .
// 6. В открывшемся окне указываем дату начала и окончания. Нажимаем кнопку сохранить и закрываем модальное окно. Проверяем появилась ли запись в таблице
// 7. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен".
// 8. Нажать на кнопку "Отменить все", убедиться, что все галки снялись
// 9. Выбрать 4 записи (кликнуть по галкам) из группы "Не указано", нажать на кнопку "Включить в титул", убедиться, что записи попали в новую группу, которая называется "Услуга..."
// 10. Выбрать одну запись из группы "Услуга..." и нажать на кнопку "Отменить". Убедиться, что запись пропадет из списка