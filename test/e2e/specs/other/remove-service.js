describe('Удаление услуга', function () {
    var _ = protractor.libs._;
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;

    var EC = protractor.ExpectedConditions;



    function skip() {
        return !protractor.totalStatus.ok;
    }


    // it('1 Выйти из системы (Проверить что есть кнопка "Выйти", после выхода проверить URL  #/login', function (done) {
    //     // console.log('Step Выходим')
    //
    //     return angularWait()
    //         .then(function () {
    //             browser.actions().mouseMove(element(by.css('[ng-bind=\"$ctrl.currentUser()\"]'))).perform()
    //             expect(element(by.css('[class="button-log-out"]')).isPresent()).toBe(true)  // Проверить что есть кнопка выйти
    //             element(by.css('[class="button-log-out"]')).click()
    //         })
    //         .then(expliciteWait)
    //         .then(function () {
    //             // console.log('Step Выходим 1')
    //             return browser.getCurrentUrl();
    //         })
    //         .then(function (url) {
    //             // console.log('Step Выходим 2')
    //             expect(url.indexOf('login') >= 0).toBe(true);      // Проверить что  #/login
    //         })
    //         .then(angularWait)
    //         .then(expliciteWait)
    //         .then(done);
    // }, skip);
    //
    //
    // it('2. URL does not contain /login. ##can_continue', function () {
    //     protractor.helpers.login.loginToPage(null, 'demo', 'Qwerty123!');
    //     browser.sleep(1000);
    //     browser.getCurrentUrl().then(function (url) {
    //         let s = url.substring(url.indexOf('#') + 1);
    //         // console.log('url', url)
    //         expect(s === '/login').toBe(false);
    //     });
    // });

    it('3. Переходим по URL /#/transformer/1. ##can_continue', (done) => {
        console.log('Автотест на удаление услуги START - Go to path URL -> /#/transformer/1');
        return angularWait()
            .then(function () {
                browser.get($h.url + '/#/transformer/1')
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function () {
                browser.getCurrentUrl().then(function (url) {
                    let s = url.substring(url.indexOf('#') + 1);
                    expect(s === '/transformer/1').toBe(true);
                });
            })
            .then(done);
    }, skip);

    // 3. В открывшемся окне заполняем поля (ДРП, Год, Описание) и удаляем ДПГ.
    it('4. В открывшемся окне заполняем поля (ДРП, Год, Описание) и удаляем ДПГ. ##can_continue', function (done) {
        return $h.form.setForm({
            production_year: protractor.helpers.serviceId,
        })
            .then(function () {
                return $h.form.processButton('delete_dpg', 'transformer');
            })
            .then(browser.sleep(1500))
            .then(done);
    }, skip);

})