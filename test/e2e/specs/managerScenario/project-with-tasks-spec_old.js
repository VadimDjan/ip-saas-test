describe('Scenario 2. Workspace manager work. Работа руководителя команды. ', function () {
    var _ = protractor.libs._;
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    var loginObject = {};
    var managerUser = '';
    var tasksBefore = 0,
        tasksToAdd = 0;
    var currentUserName = '';
    var eventStart = null,
        eventEnd = null,
        eventUid = null,
        eventTitle = null,
        daysDelta = null;
    managerUser = null;
    var textForTestComment = 'Тестовый комментарий с <strong>жирным</strong> и <em>курсивным</em> текстом';
    var resizeType;
    function skip() {
        return !protractor.totalStatus.ok;
    }
    const users = {
        'template@ideaplatform.ru': 'Администратор Шаблонов',
        'demo.user@ipdemo.ru': 'Demo User'
    }
    it('1. login to the system with login from scenario#1. Заходим в систему под пользователем  (владельцем WS - один из созданных в Сценарий #1)', (done) => {
        loginObject = $h.login.getLoginObject();
        managerUser = 'Администратор Шаблонов'//loginObject.user
        $h.login.loginToPage()
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return expect(element(by.css('[ng-click=\"$ctrl.openAccount()\"]')).isPresent()).toBe(true);
            })
            .then(done)
    }, skip)

    it('2. Go to menu Create -> Project. Идем в пункт меню Создать -> Проект', (done) => {
        $h.menu.selectInMenu(['Создать', 'Проект'])
            .then(() => expect(element(by.css('[data-entity-id=\"sd_project_details\"]')).isPresent()).toBe(true))
            .then(expliciteWait)
            .then(done);
    }, skip);


    it('3. Fill fields and create project. В открывшемся окне заполняем поля и создаем проект', function (done) {
        const today = '[' + $h.common.getTodayStr() + '] - ';
        return $h.form.setForm({
            displayname: today + 'Проект',
            description: today + 'Описание проекта',
            project_manager: managerUser
        })
            .then(expliciteWait)
            .then(function () {
                return $h.form.processButton(['CREATE', 'UPDATE']);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('4. Goto \'Tasks\' tab and push \'Add Record\'. Переходим на вкладку \'Задачи\' и жмем на кнопку \'Добавить запись\'', function (done) {
        return $h.form.getForm(['tasks'])
            .then(function (form) {
                tasksBefore = form.tasks.length
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('5-6. Fill fields and create project for users in workspace. В открывшемся окне заполняем поля \'Краткое описание\' и \'Описание\'. Повторяем использую для <user_email> email подчиненного.', function (done) {
        var allUsers = [{ user: loginObject.user }].concat(loginObject.users)
        var tasksList = allUsers.flatMap(function (user) {
            var today = '[' + $h.common.getTodayStr() + '] - ';
            return _.range(1, 2).map(function (i) {
                const userDisplayName = user.user
                return {
                    displayname: today + 'Задача ' + i + ' для ##' + userDisplayName,
                    description: today + 'Описание задачи ' + i + ' для ##' + userDisplayName
                };
            });
        });
        tasksToAdd = tasksList.length;
        return $h.form.setForm({
            tasks: {
                $unique: 'displayname',
                values: tasksList
            }
        })
            .then(angularWait)
            .then(function () {
                return $h.form.getForm(['tasks']);
            })
            .then(function (form) {
                expect(form.tasks.length).toBe(tasksBefore + tasksToAdd);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                return $h.form.processButton('BACK');
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('7. Go to the new tasks search results. Переходим к пункту меню Найти -> Задачи, указываем на форме поиска статус Новый и нажимаем на кнопку \'Поиск\'', function (done) {
        return $h.menu.selectInMenu(['Найти', 'Задачи'])
            .then(function () {
                return $h.grid.main.setSearch([
                    {
                        type: 'enums',
                        value: 'Новая',
                        field: 'workflowstepid',
                        operator: 'eq'
                    },
                    {
                        type: 'string',
                        operator: 'contains',
                        field: 'displayname',
                        value: '##'
                    }
                ]);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('8-11. Planning and commenting new tasks. Планирование и комментирование новых задач', function (done) {
        return planFirstTaskInTheList()
            .then(angularWait)
            .then(expliciteWait)
            .then(done);

        function planFirstTaskInTheList() {
            return $h.grid.main.getTotalRows()
                .then(function (numOfRows) {
                    if (numOfRows >= 1) {
                        return $h.grid.main.openRow(0)
                            .then(expliciteWait)
                            .then(function () {
                                return $h.form.getForm(['displayname']);
                            })
                            .then(function (formData) {
                                currentUserName = formData.displayname.split('##')[1]
                                currentUserName = users[currentUserName] || currentUserName
                                return $h.form.processButton(['Запланировать']);
                            })
                            .then(expliciteWait)
                            .then(function () {
                                return $h.form.setForm({
                                    planned_start: $h.common.getTodayClientDate() + ' 00:00:00',
                                    planned_finish: $h.common.getTomorrowClientDate() + ' 00:00:00',
                                    assignedto: currentUserName,
                                    planned_effort: 2
                                });
                            })
                            .then(expliciteWait)
                            .then(angularWait)
                            .then(expliciteWait)
                            .then(angularWait)
                            .then(function () {
                                return $h.form.submitPopup();
                            })
                            .then(angularWait)
                            .then(expliciteWait)
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
                            .then(function (form) {
                                return expect(textForTestComment).toBe(form.comments[0].text);
                            })
                            .then(function () {
                                return $h.form.processButton('BACK');
                            })
                            .then(expliciteWait)
                            .then(function () {
                                return planFirstTaskInTheList();
                            });
                    }
                    else {
                        return angularWait();
                    }
                });
        }
    }, skip);


    it('12. Go to menu Reports -> Teem Calendar. Переходим к пункту меню Отчеты - Календарь команды.', function (done) {
        return $h.menu.selectInMenu(['Отчеты', 'Календарь команды'])
            .then(angularWait)
            .then(expliciteWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('13.1 Moving task event -> Teem Calendar. Передвигаем сроки любой задачи. ##can_continue', function (done) {
        return $h.scheduler.main.tasksList()
            .then(function (tasks) {
                eventStart = tasks[0].start;
                eventEnd = tasks[0].end;
                eventUid = tasks[0].uid;
                eventTitle = tasks[0].title;
                daysDelta = new Date(eventStart).getDate() > 5 ? -1 : 1;
                return $h.scheduler.main.moveTask(eventUid, daysDelta);
            })
            .then(expliciteWait)
            .then(function () {
                return $h.scheduler.main.tasksList();
            })
            .then(function (tasks) {
                return tasks.filter(function (task) {
                    return task.title === eventTitle;
                })[0];
            })
            .then(function (task) {
                expect(new Date(task.start).getTime()).toBe(new Date(daysDelta * 86400000 + eventStart).getTime());
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('13.2 Resizing task event -> Teem Calendar. Меняем длительность любой задачи. ##can_continue', function (done) {
        return $h.scheduler.main.tasksList()
            .then(function (tasks) {
                eventStart = tasks[0].start;
                eventEnd = tasks[0].end;
                eventUid = tasks[0].uid;
                eventTitle = tasks[0].title;
                if ((eventEnd - eventStart) / 86400000 > 2) { // укорачиваем на день
                    if (new Date(eventStart).getDate() < 4) {
                        resizeType = 'end';
                        daysDelta = -1;
                    }
                    else {
                        resizeType = 'start';
                        daysDelta = 1;
                    }
                }
                else { // удлиняем на день
                    if (new Date(eventStart).getDate() > 25) {
                        resizeType = 'start';
                        daysDelta = -1;
                    }
                    else {
                        resizeType = 'end';
                        daysDelta = 1;
                    }
                }
                return $h.scheduler.main.moveTask(eventUid, daysDelta, resizeType);
            })
            .then(function (tasks) {
                return $h.scheduler.main.tasksList();
            })
            .then(function (tasks) {
                return tasks.filter(function (task) {
                    return task.title === eventTitle;
                })[0];
            })
            .then(function (task) {
                eventUid = task.uid;
                expect(new Date(task.start).getTime()).toBe(new Date((resizeType === 'start' ? daysDelta * 86400000 : 0) + eventStart).getTime());
                expect(new Date(task.end).getTime()).toBe(new Date((resizeType === 'end' ? daysDelta * 86400000 : 0) + eventEnd).getTime());
            })
            .then(function () {
                return browser.sleep(protractor.expliciteWaitTime);
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(done);
    }, skip);

    it('14. Open any task and change it plan dates -> Teem Calendar. ' +
        ' Проваливаемся в одну из задач и меняем плановое начало и окончание на ' +
        'форме задач, жмем на кнопку \'Сохранить\' ##can_continue', function (done) {
            return element(by.css('[data-uid=\"' + eventUid + '\"]')).getWebElement()
                .then(function (event) {
                    browser.actions().doubleClick(event).perform();
                    return browser.waitForAngular();
                })
                .then(function () {
                    return $h.form.getForm(['planned_start', 'planned_finish', 'displayname']);
                })
                .then(function (form) {
                    eventStart = form.planned_start.getTime();
                    eventEnd = form.planned_finish.getTime();
                    eventTitle = form.displayname;
                    daysDelta = new Date(eventStart).getDate() < 25 ? 1 : - 1;
                    return $h.form.setForm({
                        planned_start: $h.common.toClientDate(new Date(eventStart + daysDelta * 86400000)) + ' 00:00:00',
                        planned_finish: $h.common.toClientDate(new Date(eventEnd + daysDelta * 86400000)) + ' 00:00:00'
                    });
                })
                .then(function () {
                    return $h.form.processButton(['UPDATE']);
                })
                .then(function () {
                    return $h.form.processButton(['BACK']);
                })
                .then(function () {
                    return browser.sleep(protractor.expliciteWaitTime);
                })
                .then(function () {
                    return $h.scheduler.main.tasksList();
                })
                .then(function (tasks) {
                    return tasks.filter(function (task) {
                        return task.title === eventTitle;
                    })[0];
                })
                .then(function (task) {
                    expect(new Date(task.start).getTime()).toBe(new Date(daysDelta * 86400000 + eventStart).getTime());
                    expect(new Date(task.end).getTime()).toBe(new Date((daysDelta - 1) * 86400000 + eventEnd).getTime());
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(done);
        }, skip);

    it('15. Create task from report\'s context menu. ' +
        'Создаем одну задачу нажав правой кнопкой по календарю, выбираем пункт добавить задачу, ' +
        'заполняем поля и жмем \'Создать\'. ##can_continue', function (done) {
            return browser.executeScript(function () {
                $('tr:first-child td:first-child [data-date]')[0].scrollIntoView();
            })
                .then(angularWait)
                .then(function () {
                    return element(by.css('tr:first-child td:first-child [data-date]')).getWebElement();
                })
                .then(function (el) {
                    browser.actions().mouseMove(el).perform();
                    browser.actions().click(protractor.Button.RIGHT).perform();
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(function () {
                    return element(by.css('[data-type=\"TASK\"]')).click();
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(function () {
                    var today = '[' + $h.common.getTodayStr() + '] - ';
                    return $h.form.setForm({
                        displayname: today + 'Просто задача для ##' + managerUser,
                        description: today + 'Описание просто задачи для ##' + managerUser
                    });
                })
                .then(function () {
                    return $h.form.processButton(['CREATE']);
                })
                .then(function () {
                    return $h.form.processButton(['BACK']);
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(function () {
                    return browser.sleep(3000);
                })
                .then(done);
        }, skip);

    it('16. Logout. Выходим из системы ##can_continue', function (done) {
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

describe('Scenario 2.2 Workspace manager work. Работа руководителя команды. ', function () {
    var _ = protractor.libs._;
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    var textForTestComment = 'Тестовый комментарий с <strong>жирным</strong> и <em>курсивным</em> текстом';
    function skip() {
        return !protractor.totalStatus.ok;
    }

    it('16.2 Open menu Reports -> Manager\'s Dashboard. ' +
        ' Переходим на пункт меню \'Отчеты-Дашборд руководителя\', кликаем по столбцу \'Задача не начата в срок\' ' +
        'и пишем в ней произвольный комментарий ##can_continue', function (done) {
            return $h.login.loginToPage()
                .then(angularWait)
                .then(expliciteWait)
                .then(function () {
                    return browser.executeScript(function () {
                        $('[component-name=\"tasks_with_alerts\"]')[0].scrollIntoView();
                    });
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(function () {
                    return element(by.css('[component-name=\"tasks_with_alerts\"] svg .nv-series-2 rect.nv-bar.positive')).click();
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(function () {
                    return $h.grid.modal.openRow(0);
                })
                .then(writeTestComment)
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


            function writeTestComment() {
                return browser.sleep(protractor.expliciteWaitTime)
                    .then(function () {
                        return $h.form.processButton('GOTO');
                    })
                    .then(function () {
                        return $h.form.setForm({
                            comments: textForTestComment
                        });
                    })
                    .then(function () {
                        return browser.sleep(protractor.expliciteWaitTime);
                    })
                    .then(function () {
                        return $h.form.getForm(['comments']);
                    })
                    .then(function (form) {
                        //return expect(textForTestComment).toBe(form.comments[0].text);
                    });
            }
        }, skip);


    it('17. Logout. Выходим из системы ##can_continue', function (done) {
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



