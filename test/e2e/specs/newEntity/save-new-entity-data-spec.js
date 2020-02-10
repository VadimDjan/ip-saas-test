describe('Scenario 4.3. New Entity forms list. Список форм новой Entity. ', function() {

    var $h = protractor.helpers;
    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;

    function skip(){
        return !protractor.totalStatus.ok;
    }
    
    it('1. Should have new entity with standart forms. В новой Entity должны быть стандартные формы', function(done) {
        
        $h.grid.main.upsert('tablename', 'test_table_1')        
        .then(function(){
            return $h.form.getForm(['displayname', 'tablename', 'isactive', 'entitytypeid', 'entityfieldlist', 'entityformlist']);
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(function(fieldValues){            
            expect(fieldValues.entityformlist.length >= 2).toBeTruthy();
            protractor.constants.TestTableId = fieldValues.entitytypeid;
            protractor.constants.ListFormId = fieldValues.entityformlist.filter(function(v){return v.formtype.value == 'LIST';})[0].formid;
            protractor.constants.DetailsFormId = fieldValues.entityformlist.filter(function(v){return v.formtype.value == 'DETAILS';})[0].formid;
            return;
        })
        .then(function(){
            return $h.form.processButton('BACK');
        })
        .then(angularWait)
        .then(expliciteWait)
        .then(done);
        
    }, skip);
});
