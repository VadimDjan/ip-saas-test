describe('Scenario 4.1. Entities list. Список таблиц. ', function() {

    var urlBase = protractor.helpers.url + '#/';
    var EntityTableId = 'entitytype';
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    
    function skip(){
        return !protractor.totalStatus.ok;
    }
    
    it('1. Should open standart entities by internal name. Должен открываться список стандартных таблиц по внутреннему имени', function(done) {
        $h.login.loginToPage().then(function(){
            return browser.get(urlBase + 'entity/' + EntityTableId);
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            expect($h.grid.main.scrollToRow('tablename', 'data')).toBeGreaterThan(-1);        
            expect($h.grid.main.scrollToRow('tablename', 'reference')).toBeGreaterThan(-1);
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(done);
        
        
    }, skip);
});