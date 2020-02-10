describe('Scenario 5. Idea Platform workspace cleaner. Очистка созданного тестового WS.', function() {
    const $h = protractor.helpers;
    const $l = protractor.libs;
    const EC = protractor.ExpectedConditions;
    
    var login = '';
    var jar = $l.request.jar();
    var req = $l.request.defaults({
        jar : jar
    });
    var response = {};
    beforeEach(function(done) {
        login = $h.login.getLoginObject();

        $h.login.loginToPage(null, 'victor.follet@ideaplatform.ru', 'buktop')
        .then(function(){
            return browser.executeScript(function(){
                return {auth: getCookieSecurity(), origin: window.location.origin};
            });
        })
        .then(function(token){
            console.info('Idea Platform workspace cleaner: Skip clean? - ' + (protractor.totalStatus.withErrors || !protractor.totalStatus.ok));

            if(protractor.totalStatus.withErrors || !protractor.totalStatus.ok){
                done();
                return;
            } //fetch('json/admin/remove_workspace/protractor_test_XXXX', {method: 'POST', headers: {'X-AUTH': getCookieSecurity()}});
            else{
                return req.post({
                        url: token.origin + '/json/admin/remove_workspace/' + login.workspace,
                        headers: {
                            'X-AUTH': token.auth
                        }
                    }, function(error, message, body) {
                        if(error) {
                            console.error('Error deleting ws : ' + error );
                        }
                        response = message;
                        done();
                });
            }
        });
            
    });
    
    it('should remove provided workspace = ' + login.workspace, function() {
        expect(response.statusCode).toBe(200);                
    });
});