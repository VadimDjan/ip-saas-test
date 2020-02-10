describe('Пересохранение форм', function () {
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
        'victor.follet@ideaplatform.ru': 'buktop',
        'demo.user@ipdemo.ru': 'Demo User'
    }
    it('1. login to the system with login from scenario#1. Заходим в систему под пользователем  (владельцем WS - один из созданных в Сценарий #1)', (done) => {
        loginObject = $h.login.getLoginObject({
            name:'victor.follet@ideaplatform.ru',
            password:'buktop'
        });
        managerUser = 'Администратор Шаблонов'//loginObject.user
        
        $h.login.loginToPage()
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                // return expect(element(by.css('[ng-click=\"$ctrl.openAccount()\"]')).isPresent()).toBe(true);
            })
            .then(done)
    }, skip)
        for (var i = 1750; i < 1850; i++) {

        (function (testSpec) {
           it('2. Идем в дизайнер форм ' + testSpec, function (done) {

            browser.get('http://sutrrpm.ru/#/' + testSpec)
                .then(angularWait)
                .then(expliciteWait)
                .then(function (url) {
                    return expect(element(by.css('.idea-button-save-default-settings')).isPresent()).toBe(true);
                })
                .then(function (res) {
                    element(by.css('.idea-button-save-default-settings')).click()
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(done);
            })
        })(i);

    };
            
        
        
    //  it('2. Идем в дизайнер форм 1491', function (done) {

    //     browser.get('http://localhost:8080/#/form_editor_view/1491')
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(function (url) {
    //             return expect(element(by.css('[ng-click=\"$ctrl.saveForm()\"]')).isPresent()).toBe(true);
    //         })
    //         .then(function (res) {
    //             element(by.css('[ng-click=\"$ctrl.saveForm()\"]')).click()
    //         })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(done);
    // })
       
     
    //      it('2. Идем в дизайнер форм 1411', function (done) {
    //     browser.get('http://localhost:8080/#/form_editor_view/1411')
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(function (url) {
    //             return expect(element(by.css('[ng-click=\"$ctrl.saveFormMulti()\"]')).isPresent() || element(by.css('[ng-click=\"$ctrl.saveForm()\"]')).isPresent()).toBe(true);
    //         })
    //          .then(function (res) {
    //              element(by.css('[ng-click=\"$ctrl.saveFormMulti()\"]')).isPresent()? element(by.css('[ng-click=\"$ctrl.saveForm()\"]')).click(): element(by.css('[ng-click=\"$ctrl.saveFormMulti()\"]')).click()
    //         })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(done);
    // })
}, !protractor.totalStatus.ok);
