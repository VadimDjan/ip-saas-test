describe('Автотест на указание этапов и режима выполнения участков ', function () {
  var _ = protractor.libs._;
  var $h = protractor.helpers;
  var expliciteWait = $h.wait.expliciteWait;
  var angularWait = $h.wait.angularWait;

  var loginObject = {};

  var EC = protractor.ExpectedConditions;

  let buttonUpdate = 'Сохранить';
  let modalPointStage = 'Укажите этап ДПГ';
  let stageText = 'Этап 1';
  let buttonPointStage = 'Указать этап';
  let buttonPointMode = 'Указать режим выполнения';
  let jackdawsCount = 1;
  let linesNumber;


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
  // it('1. Переходим в пункт меню "Мои наряды". Ждём загрузки и убеждаемся, что отобразилась таблица и в ней есть хотя бы одна запись.  ##can_continue', (done) => {
  //     console.log('Переходим в пункт меню "Мои наряды"');
  //     browser.sleep(1000)
  //         .then(function () {
  //             return $h.menu.selectInMenu(['Мои наряды'])
  //         })
  //         .then(angularWait)
  //         .then(expliciteWait)
  //         .then(function () {
  //             return browser.getCurrentUrl();
  //         })
  //         .then(function (url) {
  //             expect(url.substring(url.indexOf('#') + 1)).toBe('/my_tasks_wc');
  //         });

  //     return angularWait()
  //         .then(browser.sleep(1500))
  //         .then(function () {
  //             protractor.helpers.grid.main.rowsList().count().then(function (res) { //Убеждаемся, что отобразилась таблица и в ней есть хотя бы одна задача
  //                 // console.log('res', res);
  //                 expect(res >= 1).toBe(true);
  //             })
  //         })
  //         .then(done);
  // }, skip);

// 2 Закрываем модальное окно. Выбираем наряд "Указать этапы и режим выполнения участков ремонта пути" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".
    it('2. Закрываем модальное окно. Выбираем наряд "Указать этапы и режим выполнения участков ремонта пути" и открываем его. Убеждаемся, что запись открылась, в ней есть вкладки, поля и кнопка "Сохранить".  ##can_continue', function (done) {
        const selector = '.details__close-btn';
        browser.sleep(1000)
            .then(function () {
                element.all(by.css(selector)).then( function(items) {
                    items[1].click();
                    return browser.sleep(1500);
                });
            })
        return $h.form.getForm(['tasks'])
            .then(function (form) {
                eventUid = form.uid;
                tasksBefore = form.tasks.length
                const index = form.tasks.findIndex(item => item.displayname === 'Указать этапы и режим выполнения участков ремонта пути');
                protractor.helpers.taksUid = Number(form.tasks[index].taskid)
            })
            .then(function () {
                 element.all(by.css('[data-pkfieldid=\"' + String(protractor.helpers.taksUid) + '\"]')).first().getWebElement()
                .then(function (event) {
                    browser.actions().doubleClick(event).perform();
                    return browser.sleep(1000);
                 })
            })
            .then(browser.wait(EC.presenceOf(element(by.css('[data-button-name="UPDATE"]'))), 30000))
            .then(function (res) {
                expect(element(by.css('[data-button-name="UPDATE"]')).getText()).toBe(buttonUpdate);   // Проверить что есть кнопка Сохранить
            })
            .then(done);
    }, skip)

    // 3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение
    it('3. В наряде указываем исполнителя и жмем на кнопку Сохранить. Убеждаемся, что сохранение произошло. Справа наверху возникло зеленое сообщение. ##can_continue', function (done) {
        return $h.form.setForm({
            assignedto: 'Вернер А.А.'
        })
            .then(function () {
                return $h.form.processButton(['UPDATE'], 'task');   //жмем на кнопку Сохранить
            })
            .then(browser.wait(EC.presenceOf(element(by.css('[class="alert__wrapper alert__wrapper_success"]'))), 5000))
            .then(function () {
                expect(element(by.css('[class="alert__wrapper alert__wrapper_success"]')).isPresent()).toBe(true)  // Справа наверху возникло зеленое сообщение
            })
            .then(done);
    }, skip);

    // 4. Жмем кнопку В работу. Убеждаемся, что значение поля Статус изменилось
    it('4. Жмем кнопку В работу.Убеждаемся, что значение поля Статус изменилось. ##can_continue', function (done) {
        const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
        return $h.form.processButton(['В работу'])
            .then(browser.wait(EC.presenceOf(element(by.css(selector))), 5000))
            .then(browser.sleep(2000))
            .then(expect(element(by.css(selector)).getAttribute('value').then(function(text) {
                if (text.trim() == 'В работе') {
                    return text.trim()
                }
            })).toBe('В работе'))
            .then(done);
    }, skip);

  // 5. Кликаем по ссылке и в открывшемся списке нажимаем на кнопку "Выбрать все", убедиться, что все галочки поставились
  it('5. Кликаем по ссылке и убеждаемся что отобразилась таблица и в ней имеются не менее 3х записей. ##can_continue', function (done) {
    // console.log('нажимаем на кнопку "Выбрать все"')
    return  element(by.css('[data-detail="task"] [class="glyphicon glyphicon-arrow-right"]')).click()
        .then(async () => await browser.sleep(1500))
        .then(browser.driver.getAllWindowHandles().then(function(handles) {
            browser.driver.switchTo().window(handles[handles.length-1]);
        }))
        .then(browser.wait(EC.presenceOf(element(by.css('.k-grid-content '))), 5000))
        .then(function () {
            element.all(by.css('[data-uid]')).count().then(function (res) {
                expect(res >= jackdawsCount).toBe(true);  //убедиться, что имеются не менее 3х записей
            })
        })
        .then(done);
  }, skip);

    // 6. В открывшемся списке нажимаем на кнопку "Выбрать все", убедиться, что все галочки поставились
    it('6. В открывшемся списке нажимаем на кнопку "Выбрать все". ##can_continue', function (done) {
        // console.log('нажимаем на кнопку "Выбрать все"')
        return angularWait()
            .then(browser.sleep(1000))
            .then(function () {
                element(by.css('.k-button.idea-button-select-all')).click()
            })
            .then(angularWait)
            .then(function () {
                element.all(by.css(' .k-grid-content [aria-selected="true"]')).count().then(function (res) {
                    linesNumber = res;  //Сохранить количество галок на странице
                    expect(element.all(by.css('[data-uid]')).count()).toBe(res);  //убедиться, что все галочки поставились
                })
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

  // 7. Проверить, что есть хотя бы 1 запись, кнопки "Указать этап" и  "Указать режим выполнения", выбрать запись, нажать на кнопку "Указать этап", "
  it('7. Проверить, что есть кнопки "Указать этап" и  "Указать режим выполнения", выбрать запись, нажать на кнопку "Указать этап",  ##can_continue', function (done) {
      const buttonSelector_1 = '[data-button-id="1337"]';
      const buttonSelector_2 = '[data-button-id="1344"]';
      return browser.wait(EC.presenceOf(element(by.css(buttonSelector_1))), 5000)
        .then(function () {
            expect(element(by.css(buttonSelector_1)).getText()).toBe(buttonPointStage);   // Проверить что есть кнопка Указать этап
          })
        .then(function () {
            expect(element(by.css(buttonSelector_2)).getText()).toBe(buttonPointMode);   // Проверить что есть кнопка Укажать режим выполнения
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(function () {
          element(by.css('[data-button-id="1337"]')).click();   // нажать Указать этап
        })
        .then(done);
  }, skip);

  // 8. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи
    it('8. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи,  ##can_continue', function (done) {
        const popupSelector = '.uipopup__title.modal-title';
        const stageInGridSelector = 'span[data-field="service_stage"]';
        return browser.wait(EC.presenceOf(element(by.css(popupSelector))), 5000)
            .then(function () {
                $h.form.setField('p_stage','Этап 1', 'popup'); // Вводим созданный этап
            })
            .then($h.form.processPopup('primary')) // Жмём на кнопку "Да")
            .then(browser.sleep(3000))
            .then(expect(element(by.css(stageInGridSelector)).getText()).toBe(stageText))   // Проверяем появление записи в таблице
            .then(angularWait)
            .then(expliciteWait)
            .then( function () {
                element(by.css('.k-button.idea-button-select-all')).click();
            })
            .then(angularWait)
            .then(expliciteWait)
            .then( function () {
                element(by.css('.k-button.idea-button-select-all')).click();
            })
            .then(done);
    }, skip);

    // 9. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи
    it('9. Выбрать этап выполнения и нажать на кнопку да, проверить, что этап появился в записи,  ##can_continue', function (done) {
        const popupSelector = '.uipopup__title.modal-title';
        const typeInGridSelector = 'span[data-field="working_type"]';
        const durationInGridSelector = 'span[data-field="reduced_km_window_duration"]';
        return element(by.css('[data-button-id="1344"]')).click() // нажать Указать режим выполнения
            .then(async () => await browser.sleep(1500))
            .then(browser.wait(EC.presenceOf(element(by.css(popupSelector))), 5000))
            .then(function () {
                expect(element(by.css(popupSelector)).getText()).toBe(modalPointStage);   // Проверить название окна
            })
            .then(function () {
                $h.form.setField('p_reduced_km_window_duration','10', 'popup'); // Вводим длительность окна
            })
            .then(browser.sleep(500))
            .then(element(by.css('.modal-dialog.uipopup__modal .react-popup-item[data-field-name="p_working_type"] .rw-widget-input')).click())
            .then(function () {
                $h.form.setField('p_working_type','Окна', 'popup'); // Вводим режим
            })
            .then(browser.sleep(500))
            .then($h.form.processPopup('primary')) // Жмём на кнопку "Да")
            .then(browser.sleep(3000))
            .then(expect(element(by.css(typeInGridSelector)).getText()).toBe('Окна'))   // Проверяем появление записи в таблице
            .then(expect(element(by.css(durationInGridSelector)).getText()).toBe('10'))// Проверяем появление записи в таблице
            .then(done);
    }, skip);

    it('10. Вернуться к задаче и нажать на кнопку Выполнить. Убедиться, что значение поля статус изменился на "Выполнен". ##can_continue', function (done) {
        const selector = '.modal-body[data-detail="task"] .card .react-grid-item[data-field-name="workflowstepid"] input';
        return browser.driver.getAllWindowHandles()
            .then(function(handles) {browser.driver.switchTo().window(handles[0])})
            .then(browser.wait(EC.presenceOf(element(by.css('[data-button-name="Выполнить"]'))), 5000))
            .then(function () {
                // return $h.form.processButton(['CREATE', 'UPDATE']);
                return $h.form.processButton(['Выполнить'], 'task');   //жмем на кнопку Сохранить
            })
            .then(browser.wait(EC.textToBePresentInElementValue($(selector), 'Выполнен'), 5000))
            .then(expect(element(by.css(selector)).getAttribute('value').then(function(text) {
                if (text.trim() == 'Выполнен') {
                    return text.trim()
                }
            })).toBe('Выполнен'))
            .then(done);
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