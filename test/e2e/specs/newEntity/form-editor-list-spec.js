describe('Scenario 4.4. New Entity list form editor. Редактор форм списка новой Entity. ', function() {

    var urlBase = protractor.helpers.url + '#/form_editor/';
    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;

    function skip(){
        return !protractor.totalStatus.ok;
    }
    
    it('1. Should contain only default columns', function(done) {        
        browser.get(urlBase + protractor.constants.ListFormId)
        .then(angularWait)
        .then(function(){
            return  $h.designer.getVisibleColumns();
        })
        .then(function(cols){
            return expect(cols.sort())
            .toEqual( ['workflowstepid'].sort());
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(done);
    }, skip);
    
    it('2. Should add another column and save correctly', function(done) {    
        return $h.designer.setColumns([ {
            field: 'integer_field',
            visible: true,
        }])
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            return $h.designer.saveForm();
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            return browser.get(urlBase + protractor.constants.ListFormId);
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(function(){
            return  $h.designer.getVisibleColumns();
        })
        .then(function(cols){
            return expect(cols.sort())
            .toEqual( [ 'workflowstepid', 'integer_field'].sort());
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(done);
            
    }, skip);
    
});

