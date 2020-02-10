describe('Scenario 1.1. Idea Platform registation. Регистрация в Idea Platform', function() {
    const $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    var confirmationCode = '';
    const EC = protractor.ExpectedConditions;
    const currentMinNumber = 1001;
    const codeLength = 128;
    const codePrefix = '#/confirmation?code=';
    var number, newUserEmail = '', newUserWorkspace = '', newUserPassword = '';
    var homeUrl = protractor.helpers.url + '#/home';    

    function skip(){
        return !protractor.totalStatus.ok;
    }
    
    it('1. Test for confirmation letter. Проверяем что при регистрации приходит письмо с подтверждением', function(done) {
        return browser.get(homeUrl)
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            return $h.postgres.sqlToPromise(`               
                SELECT (regexp_matches(email, 'protractor.test.(\\d+)@protractor.com'))[1]::int as value
                FROM system.ipuser
                ORDER BY (regexp_matches(email, 'protractor.test.(\\d+)@protractor.com'))[1]::int DESC
                LIMIT 1`
            );
        })
        .then(function(result){
            number = (!result.rows || result.rows.length === 0) ? 1 : result.rows[0].value + 1;
            if (number < currentMinNumber) number = currentMinNumber;
            $h.number = number;

            newUserEmail = 'protractor.test.' + number + '@protractor.com';
            $h.newUserEmail = newUserEmail;
            newUserWorkspace = 'protractor_test_' + number;
            $h.newUserWorkspace = newUserWorkspace;
            newUserPassword = '123';
                        
            $h.login.setLoginObject(null, 
                    {user: newUserEmail, password:  newUserPassword, workspace: newUserWorkspace} ); 
            
            console.info('MainUserEmail = ' + newUserEmail);

            return element(by.css('.first-page form[name="HomeForm"] input[name="email"]')).clear().sendKeys(newUserEmail);
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            element(by.css('.first-page form[name="HomeForm"] input[type="submit"]')).click();
            return browser.waitForAngular();
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            return browser.sleep(5000);
        })
        .then(function(){
            return $h.postgres.sqlToPromise(`SELECT * from system.ipemailout where to_addresses = '${newUserEmail}' order by email_id desc`)
        }).then(function(result){
            expect(result.rows.length > 0).toBe(true);
            var body = result.rows[0].body;
            confirmationCode = body.substring(body.indexOf(codePrefix ) + 
                            codePrefix.length, body.indexOf(codePrefix ) + 
                            codePrefix.length + codeLength);
            console.info('confirmationCode = ' + confirmationCode)
        })
        .then(done);
    }, skip);
    
    it('2. Test for redirect after confirmation url. Проверяем что после кода регистрации нас перенаправляет на страницу регистрации', function(done) {
        browser.get(protractor.helpers.url + codePrefix + confirmationCode)
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            return browser.getCurrentUrl();
        })
        .then(function(url){
            expect(url.indexOf('after_email_confirmed') >= 0).toBe(true);
            expect(url.indexOf('login') >= 0).toBe(true);            
        })
        .then(done);
    }, skip);
    
    it('3.Test, that we can enter new workspace. Проверяем, что можем войти в новый WS', function(done) {
        element(by.css('form[name="RegistrationForm"] input[name="password"]')).clear().sendKeys(newUserPassword);
        element(by.css('form[name="RegistrationForm"] input[name="workspace_name"]')).clear().sendKeys(newUserWorkspace);
        return angularWait()
        .then(expliciteWait)
        .then(function(){
            element(by.css('form[name="RegistrationForm"] input[type="submit"]')).click(); 
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            return browser.getCurrentUrl();
        })
        .then(function(url){
            expect(url.indexOf('dashboard') >= 0).toBe(true);
        })
        .then(done);
    }, skip);
    
    it('4. Test for greeting screen. Проверяем наличие приветствия', function(done) {
        expect(element(by.css('.current-form [ng-if="isFirstEntrance()"]')).isPresent()).toBe(true);
        return $h.form.getForm(['USER_FULLNAME', 'USER_EMAIL', 'WORKSPACE_DISPLAYNAME'])
        .then(function(formValues){
            expect(formValues['USER_EMAIL']).toBe(newUserEmail);
            expect(formValues['WORKSPACE_DISPLAYNAME']).toBe(newUserWorkspace);
        })
        .then(expliciteWait)
        .then(function(){
            return $h.form.processButton(['UPDATE', 'BACK']);
        })
        .then(function() {
            element(by.css('.button-log-out')).click();
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(done);
    }, skip);
    
    it('5. No greeting after update. Не показывать приветсвие после обновления',  function(done) {
        return browser.getCurrentUrl()
        .then(function(url){
            expect(url.indexOf('login') >= 0).toBe(true);
            expect(url.indexOf('after_email_confirmed') >= 0).toBe(false);
            element(by.css('form[name="NormalForm"] input[name="email"]')).clear().sendKeys(newUserEmail);
            element(by.css('form[name="NormalForm"] input[name="password"]')).clear().sendKeys(newUserPassword);
            return browser.sleep(protractor.expliciteWaitTime);
        })
        .then(function(){
            element(by.css('form[name="NormalForm"] input[type="submit"]')).click();
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            expect(element(by.css('idea-form.current-form')).isPresent()).toBe(false);
        })
        .then(done);
    }, skip);
});