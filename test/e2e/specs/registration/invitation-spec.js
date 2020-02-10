describe('Scenario 1.2. Idea Platform invitation. Приглашение в Idea Platform', function() {
    const $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    const EC = protractor.ExpectedConditions;
    const homeUrl = $h.url + '#/home';
    const codeLength = 128;
    const codePrefix = '#/confirmation?code=';
    const minInvited = 1;
    const maxInvited = 1;
    let userNumber, 
        leaderEmail,
        usersInWorkspace,
        currentInviteNumber,
        currentUserEmail,
        currentUserEmails = [],
        invitedUsers = [],
        workspace, 
        userPassword = '123',
        invitationNumber = 0;

    function skip(){
        return !protractor.totalStatus.ok;
    }
    
    it('1. Adding new user to the list Добавление пользователя в список пользователей', function(done) {
        return $h.postgres.sqlToPromise(
                " SELECT (regexp_matches(email, 'protractor.test.(\\d+)@protractor.com'))[1]::int as value " + 
                " FROM system.ipuser " +
                " ORDER BY (regexp_matches(email, 'protractor.test.(\\d+)@protractor.com'))[1]::int DESC " + 
                " LIMIT 1"
            )        
            .then(function(result){
                userNumber = $h.number;
                leaderEmail = 'protractor.test.' + userNumber + '@protractor.com';
                workspace = 'protractor_test_' + userNumber;
                return $h.login.loginToPage(null, leaderEmail, userPassword);
            })
            .then(function(){
                return browser.sleep(protractor.expliciteWaitTime);
            })
            .then( function()  {//TODO: проверить ошибки
                element(by.css('a[ng-click="openAccount()"]')).click();
                return browser.waitForAngular();
            })
            .then( function()  {
                usersInWorkspace = Math.trunc(Math.random()*(maxInvited - minInvited + 1)) + minInvited; 
                currentInviteNumber = 1;
                
                var processNextInvitation = function (){
                    currentUserEmail = 'protractor.test.' + userNumber + '_invited.' + currentInviteNumber + '@protractor.com';
                    currentUserEmails.push(currentUserEmail);
                    currentInviteNumber += 1;
                    invitedUsers.push({
                        user: currentUserEmail,
                        password: userPassword,
                        workspace: workspace
                    });
                    console.info('currentUserEmail = ', currentUserEmail)
                    return $h.form.setForm({
                        WORKSPACE_INVITE_USER_EMAIL: currentUserEmail
                    })
                    .then(function(){
                        return $h.form.setForm({
                            WORKSPACE_INVITE_USER_BUTTON: null
                        });
                    })
                    .then(function(){
                        return browser.sleep(protractor.expliciteWaitTime);
                    })
                    .then(function(){
                        return $h.grid.subgrid('WORKSPACE_USERS').getTotalRows();
                    })
                    .then(function(numOfRows){
                        expect(numOfRows).toBe(currentInviteNumber);
                    })
                    .then(function(){
                        if(currentInviteNumber > usersInWorkspace){
                            return
                        }
                        else{
                            return processNextInvitation();
                        }
                    })
                };
                
                return processNextInvitation();
            })
            .then(function(){
                $h.login.setLoginObject(null, 
                        {user: leaderEmail, password:  userPassword, workspace: workspace, users: invitedUsers} ); 
                return $h.form.processButton(['UPDATE', 'BACK']);
                
            }).then(done);
    }, skip);
    
    it('2. Enter as invited user. Заходим в систему новым пользователем', function(done) {        
        
        currentInviteNumber = 1;
        return processNextRegistration() 
        .then(function (){
            
            var data = [leaderEmail].concat(currentUserEmails).map(function(email){
                return email + ',' + userPassword + ',' + (leaderEmail === email ? '1' : '0') + '\n';
            }).join('');
            $h.file.prependFileSync('../stress/logins_saas.csv', data);
            data = leaderEmail + ',' + userPassword + ',1\n';
            $h.file.prependFileSync('../stress/logins_saas_managers.csv', data);
            
        })
        .then(done);
        
        function processNextRegistration(){
            currentUserEmail = 'protractor.test.' + userNumber + '_invited.' + currentInviteNumber + '@protractor.com';
            currentInviteNumber += 1;
            return browser.waitForAngular()
            .then(function(){
                return element(by.css('.button-log-out')).click();
            })
            .then(function(){
                return browser.waitForAngular();
            })
            .then(function(){
                return browser.get(homeUrl);
            })
            .then(function(){
                return browser.sleep(protractor.expliciteWaitTime)
                .then(function(){
                    if(currentInviteNumber > 1) {
                        return;
                    }
                    else{
                        element(by.css('.first-page form[name="HomeForm"] input[name="email"]')).clear().sendKeys(currentUserEmail);
                        element(by.css('.first-page form[name="HomeForm"] input[type="submit"]')).click();
                        return browser.waitForAngular()
                        .then(function(){
                            return browser.sleep(protractor.expliciteWaitTime)
                        })
                        .then(function(){
                            expect(element(by.css('.home-alerts .alert  span.ng-binding')).getText()).toEqual(
                                    'Ваш аккаунт еще не активирован. Пожалуйста перейдите по ссылке из отправленного вам письма.' + 
                                    'Для повторной отправки письма, нажмите на синию кнопку');
                            
                        });
                    }
                });
                
            })
            .then(angularWait)
            .then(expliciteWait)
            .then(function(){
                return browser.sleep(5000);
            })
            .then(function(){
                return $h.postgres.sqlToPromise(
                        " SELECT * from system.ipemailout where to_addresses = '" + currentUserEmail + "' order by email_id desc LIMIT 1"
                );    
            })
            .then(function(result){
                var body = result.rows[0].body;
                return body.substring(body.indexOf(codePrefix ) + codePrefix.length, body.indexOf(codePrefix ) + codePrefix.length + codeLength);
            })
            .then(function(code){
                return browser.get(protractor.helpers.url + codePrefix + code);
            })
            .then(function(){
                return browser.sleep(protractor.expliciteWaitTime);
            })
            .then(function(){
                return browser.getCurrentUrl();
            })
            .then(function(url){
                expect(url.indexOf('after_email_confirmed') >= 0).toBe(true);
                expect(url.indexOf('login') >= 0).toBe(true);
                element(by.css('form[name="RegistrationInvitedForm"] input[name="password"]')).clear().sendKeys(userPassword);
                return browser.sleep(protractor.expliciteWaitTime);
            })
            .then(function(){
                element(by.css('form[name="RegistrationInvitedForm"] input[type="submit"]')).click();
                return browser.waitForAngular();
            })
            .then(function(){
                return browser.getCurrentUrl();
            })
            .then(function(url){
                console.info(url);
                expect(url.indexOf('report') >= 0).toBe(true);
                if(currentInviteNumber > 1) {
                    return;
                }
                else{
                    return $h.form.getForm(['USER_FULLNAME', 'USER_EMAIL', 'WORKSPACE_DISPLAYNAME'])
                    .then(function(formValues){
                        expect(formValues['USER_EMAIL']).toBe(currentUserEmail);
                        expect(formValues['WORKSPACE_DISPLAYNAME']).toBe(workspace);
                        return browser.sleep(protractor.expliciteWaitTime);
                    });
                }
            })                
            .then(function(){
                return $h.form.processButton(['UPDATE', 'BACK']);
            })
            .then(function() {
                if(currentInviteNumber > 1) {
                    return;
                }
                else{
                    element(by.css('.button-log-out')).click();
                    return browser.waitForAngular()
                    .then(function(){
                        return browser.getCurrentUrl();
                    })
                    .then(function(url){
                        expect(url.indexOf('login') >= 0).toBe(true);
                        expect(url.indexOf('after_email_confirmed') >= 0).toBe(false);
                        element(by.css('form[name="NormalForm"] input[name="email"]')).clear().sendKeys(currentUserEmail);
                        element(by.css('form[name="NormalForm"] input[name="password"]')).clear().sendKeys(userPassword);
                        return browser.sleep(protractor.expliciteWaitTime)
                    })
                    .then(function(){
                        element(by.css('form[name="NormalForm"] input[type="submit"]')).click();
                        return browser.waitForAngular()
                    })
                    .then(function(){
                        expect(element(by.css('idea-form.current-form')).isPresent()).toBe(false);
                    })
                    .then(function(){
                        return browser.sleep(protractor.expliciteWaitTime);
                    });
                }
            })                
            .then(function(){
                if(currentInviteNumber > usersInWorkspace){
                    return
                }
                else{
                    return processNextRegistration();
                }
            });
        };
    
    });
});