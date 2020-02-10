describe('Scenario 3. Workspace user work. Работа члена команды. ', function () {
    var MY_TASKS_REPORT_ID = 'assigned_sd_task';
    var TEEM_DASHBOARD_ID = 'team_dashboard';

    var _ = protractor.libs._;
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    var loginObject = {};
    var tasksBefore = 0,
        tasksToAdd = 0;
    var currentUserName = '';
    var eventStart = null,
        eventEnd = null,
        eventUid = null,
        eventTitle = null;
    var textForTestComment = 'Тестовый комментарий с <strong>жирным</strong> и <em>курсивным</em> текстом';
    var textForTestComment2 = 'Другой комментарий с <strong>жирным</strong> и <em>курсивным</em> текстом';
    function skip() {
        return !protractor.totalStatus.ok;
    }
    const users = {
        'template@ideaplatform.ru': 'Администратор Шаблонов',
        'demo.user@ipdemo.ru': 'Demo User'
    }
    it('1. Login to the system with non-manager login from scenario#1. Войти в систему под пользователем - членом команды (не владельцем WS)', function (done) {
        loginObject = $h.login.getLoginObject();
        $h.login.loginToPage(null, loginObject.users[0].user, loginObject.users[0].password)
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('2. Wait for "My tasks" menu item loading. Дожидаемся загрузки меню "Мои задачи"', function (done) {
        browser.getCurrentUrl()
            .then(function (url) {
                expect(url.indexOf(MY_TASKS_REPORT_ID) >= 0).toBe(true);
            })
            .then(done);
    }, skip);

    it('3. Chose task with "Planned" status and open it. Выбираем одну из задач в статусе "3 - взять в работу", открываем задачу', function (done) {
        return $h.grid.main.setSearch([
            {
                type: 'enums',
                value: 'Запланирована',
                field: 'workflowstepid',
                operator: 'eq'
            },
            {
                type: 'string',
                operator: 'contains',
                field: 'displayname',
                value: '##'
            }
        ])
            .then(angularWait)
            .then(expliciteWait)
            .then(expliciteWait)
            .then(() => {
                return $h.grid.main.openRow('workflowstepid', 'Запланирована')
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['workflowstepid']);
            })
            .then(function (form) {
                expect(form.workflowstepid.displayValue).toBe('Запланирована');
            })
            .then(done);
    }, skip);

    it('4. Press "TO WORK" button. Нажимаем на кнопку "В работу"', function (done) {
        return $h.form.processButton(['В работу'])
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['workflowstepid']);
            })
            .then(function (form) {
                expect(form.workflowstepid.displayValue).toBe('В работе');
            })
            .then(done);
    }, skip);

    it('5. Press "COMMENT" button and send comment. Жмем на кнопку "Комментировать", вводим комментарий и жмем кнопку "Отправить" ', function (done) {
        return expliciteWait()
            .then(function () {
                return $h.form.processButton('GOTO');
            })
            .then(function () {
                return $h.form.setForm({
                    comments: textForTestComment
                });
            })
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['comments']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('6. Жмем кнопку "Завершить", вводим комментарий и жмем "ОК"', function (done) { // FYI: Изменение в WorkFlow - теперь нет комментария
        return $h.form.processButton(['Завершить'])
            .then(function () {
                return $h.form.getForm(['workflowstepid']);
            })
            .then(function (form) {
                //expect(form.workflowstepid.displayValue).toBe('Тестирование');
            })
            .then(function () {
                return $h.form.processButton(['BACK']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('7. Open menu Reports -> Teem\'s Dashboard. Открываем пункт меню Отчеты->Дашборд команды ##can_continue', function (done) {
        return browser.sleep(3000)
            .then(function () {
                return $h.menu.selectInMenu(['Отчеты', 'Дашборд команды']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return browser.getCurrentUrl();
            })
            .then(function (url) {
                expect(url.indexOf('dashboard/' + TEEM_DASHBOARD_ID) >= 0).toBe(true);
            })
            .then(done);
    }, skip);

    it('8. Кликаем по отчету "Беклог задач", в открывшимся списке выбираем любую задачу и пишем к ней комментарий ##can_continue', function (done) {
        return angularWait()
            .then(expliciteWait)
            .then(function () {
                return browser.executeScript(function () {
                    $('[component-name=\"backlog\"]')[0].scrollIntoView();
                });
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return element(by.css('[component-name=\"backlog\"] svg .nv-pie .nv-slice:first-child path')).click();
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.grid.modal.openRow(0);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.processButton(['GOTO']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.setForm({
                    comments: textForTestComment
                });
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.getForm(['comments']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.processButton('BACK');
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.processButton('BACK');
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return browser.sleep(2000);
            })
            .then(done);
    }, skip);


    it('9. Logout. Выходим из системы ##can_continue', function (done) {А
        element(by.css('.button-log-out')).click();
        return angularWait()
            .then(expliciteWait)
            .then(function () {
                return browser.getCurrentUrl();
            })
            .then(function (url) {
                expect(url.indexOf('login') >= 0).toBe(true);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);


}, !protractor.totalStatus.ok);
