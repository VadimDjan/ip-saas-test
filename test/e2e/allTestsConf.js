var globalConf = require("./globalConf.js").config;
globalConf.specs = [
  "specs/other/login-spec.js",
  // "specs/managerScenario/project-with-tasks-spec.js",
  // "specs/other/title-spech.js",
  // "specs/managerScenario/stages-and-mode-of-work.js",
  // "specs/managerScenario/set-stages-and-mode-of-work.js",
  // "specs/managerScenario/distribution-track-machine-stations-spec.js",
  // "specs/managerScenario/site-inspection-spec.js",
  "specs/managerScenario/ppg.spec.js",
  "specs/managerScenario/ppg-approve.spec.js",
  // 'specs/other/remove-service.js',

  // --------- тесты на мониторинг и создание пространства
  //  'specs/smOnline/0-opening-sm-online-spec.js',
  //  'specs/smOnline/1-creating-workspace-spec.js',

  // --------- тесты на создание объектов в новом пространстве
  /////////////////////////// локальный запуск (необходим для работы drag&drop)
  // 'specs/smOnline/2-create-setting-spare-table.js',
  // 'specs/smOnline/2-create-setting-table-order.js',
  // 'specs/smOnline/3-create-setting-order_punkt.js',
  // 'specs/smOnline/3-subgrid-in-order_test.js',
  ////////////////////////// запуск по прямой ссылке
  // 'specs/smOnline/4-menu-spec.js',
  // 'specs/smOnline/4-roles-access-groups-spec.js',
  // 'specs/smOnline/5-access-cards-spec.js',
  // 'specs/smOnline/workflow-spec.js', // создание ЖЦ
  // 'specs/smOnline/5-access-map-fields-spec.js',
  // 'specs/smOnline/6-access-wf-spec.js',
  // 'specs/smOnline/7-infographics-spec.js',
  // 'specs/smOnline/7-manager-gistogram-spec.js',
  // 'specs/smOnline/7-other-spec.js',
  // 'specs/smOnline/7-test-customers-exp-spec.js',
  // 'specs/smOnline/8-test-managers-exp-spec.js',
  // 'specs/smOnline/9-test-managers-exp-spec.js',

  // -------------- тесты на создание объектов для релизов
  /////////////////////////// локальный запуск (необходим для работы drag&drop)
  // 'specs/forReleases/2-create-setting-spare-table.js',
  // 'specs/forReleases/2-create-setting-table-order.js',
  // 'specs/forReleases/3-create-setting-order_punkt.js',
  // 'specs/forReleases/3-subgrid-in-order_test.js',
  ////////////////////////// запуск по прямой ссылке
  // 'specs/forReleases/5-workflow-spec.js', // создание ЖЦ
  // 'specs/forReleases/5-access-map-fields-spec.js',
  // 'specs/forReleases/6-access-wf-spec.js',
  // 'specs/forReleases/7-infographics-spec.js',
  // 'specs/forReleases/7-manager-gistogram-spec.js',
  // 'specs/forReleases/7-other-spec.js',




  // 'specs/registration/registration-spec.js',
  // 'specs/registration/invitation-spec.js',
  // 'specs/managerScenario/project-with-tasks-spec.js',
  // 'specs/userScenario/tasks-for-user-spec.js',
  // 'specs/newEntity/list-view-spec.js',
  // 'specs/newEntity/new-entity-spec.js',
  // 'specs/newEntity/save-new-entity-data-spec.js',
  // 'specs/newEntity/form-editor-list-spec.js',
  // 'specs/newEntity/form-editor-details-spec.js',
  // 'specs/removeWorkspace/removeWorkspace-spec.js'
  // 'specs/form-editor/form-editor-spec.js',
];

globalConf.reportOutput = "report";
exports.config = globalConf;

/*
Сценарий 1: Регистрация и приглашение пользователей
Файлы:
specs/registration/registration-spec.js
specs/registration/invitation-spec.js

 * == Регистрация
 * => не пришла почта
 * => не было перенаправление на форму полной регистрации
 * => не смогли войти в новый workspace
 * => не получили приветсвия (можно продолжать при ошибке)
 * => ошибка личного кабинета при сохранении  (можно продолжать при ошибке)
 * 
 * == Приглашение
 * => Не добавилась строка в список пользователей
 * => Не пришло письмо приглашенному пользователю
 * => не было перенаправление на форму полной регистрации
 * => не смогли войти в workspace
 * => ошибка личного кабинета при сохранении (можно продолжать при ошибке)
 * 
 * => => => => => => 

Сценарий 2: Работа руководителя команды
Файлы:
specs/managerScenario/project-with-tasks-spec.js

Заходим в систему под пользователем (владельцем WS - один из созданных в Сценарий #1 (один менеджер и один подчиненый))
Идем в пункт меню создать -> Проект
В открывшемся окне заполняем поля "Краткое описание" и "Описание"
Название: [Время] - Проект 
Описание: [Время] - Описание проекта
Руководитель проекта: Любого пользователя
Переходим на вкладку "Задачи" и жмем на кнопку "Добавить запись"
В открывшемся окне заполняем поля "Краткое описание" и "Описание"
Краткое описание: [Время] - Задача  ##<user_email>
Описание: [Время] - Описание задачи Задача ##<user_email>
Где <user_email> -текущий пользователь. Нажимаем на кнопку "Создать", далее "Назад"
Повторяем пункты 4-5 для использую для <user_email> email подчиненного.
Переходим к пункту меню Найти -> Задачи, указываем на форме поиска статус Новый и нажимаем на кнопку "Поиск" 
Выбираем любую из найденных задач, открываем и жмем на кнопку "Запланировать", в открывшемся окне указываем:
Исполнитель: заранее выбранный пользователь.
Плановое начало: текущий день и 12 часов 
Плановое окончание: текущий день и 18 часов 
Жмем на кнопку "ОК"
Жмем на кнопку "Комментировать", вводим комментарий и жмем кнопку "Отправить"  (можно продолжать при ошибке)
Повторяем пункты 7-9 пока есть задачи в статусе "Новая".
Переходим к пункту меню Отчеты - Календарь команды.
Передвигаем сроки и меняем длительность любой задачи.  (можно продолжать при ошибке)
Проваливаемся в одну из задач и меняем плановое начало и окончание на форме задач, жмем на кнопку "Сохранить"  (можно продолжать при ошибке)
Создаем одну задачу нажав правой кнопкой по календарю, выбираем пункт добавить задачу, заполняем поля и жмем "Создать"  (можно продолжать при ошибке)
Переходим на пункт меню "Отчеты-Дашборд руководителя", кликаем по столбцу "Задача не начата в срок" и пишем в ней произвольный комментарий  (можно продолжать при ошибке)

Выходим из системы

Сценарий 3: Работа члена команды (можно продолжать при ошибке)
Файлы:
specs/userScenario/tasks-for-user-spec.js

Войти в систему под пользователем - членом команды (не владельцем WS)
Дожидаемся загрузки меню 'Мои задачи'
Выбираем одну из задач в статусе "Запланирована", открываем задачу
Нажимаем на кнопку "В работу"
Жмем на кнопку "Комментировать", вводим комментарий и жмем кнопку "Отправить" 
Жмем кнопку "На тестирование", вводим комментарий и жмем "ОК"
Открываем пункт меню Отчеты->Дашборд команды
Кликаем по отчету "Беклог задач", в открывшемся списки выбираем любую задачу и пишем к ней комментарий
Выходим из системы

Сценарий 4: Работа с entity
Файлы:
specs/newEntity/list-view-spec.js
specs/newEntity/new-entity-spec.js
specs/newEntity/save-new-entity-data-spec.js
specs/newEntity/form-editor-list-spec.js
specs/newEntity/form-editor-details-spec.js
specs/removeWorkspace/removeWorkspace-spec.js'

1) Заходим под руководителем WS в entity/entitytype и проверяем наличие стандартных записей data и reference
2) Пробуем создать новую entity
3) Добавляем всевозможные поля с разнным FieldFormat
4) Проверяем, что результирующее число полей правильное
5) Проверяем, что создались формы для списка и одной записи
6) Проверяем, что можем скрыть одну колонку и показать другую в редакторе списка
7) Проверяем, что создается новый таб в редакторе формы одной записи
8) Проверяем, что в него переносится запись в этот таб

Сценарий 5. Очистка созданного тестового WS.
 **/
