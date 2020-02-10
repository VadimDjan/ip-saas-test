describe('Scenario 4.2. New Entity creation. Создание новой Entity. ', function() {

    var EntitiesBeforeTest = 0;
    var urlBase = protractor.helpers.url + '#/';
    var EntityTableId = '1';//'entitytype';
    var $h = protractor.helpers;

    var expliciteWait = $h.wait.expliciteWait;
    var angularWait = $h.wait.angularWait;
    var numberOfStandartFields = 11;

    function skip(){
        return !protractor.totalStatus.ok;
    }
    it('1. Should create new Entity with different fields. Должно создавать новую Entity c разными полями', function(done) {
        var fields =  [{
            displayname: 'Строка, String',
            fieldformatid: 'Строка (String)',
            fieldname: 'string_field'
        },{
            displayname: 'Целое, Integer',
            fieldformatid: 'Целое число (Integer)',
            fieldname: 'integer_field'
        },{
            displayname: 'Булево, Boolean',
            fieldformatid: 'Флаг (Boolean)',
            fieldname: 'boolean_field'
        },{
            displayname: 'Текст, Text',
            fieldformatid: 'Текст (Text)',
            fieldname: 'text_field'
        },{
            displayname: 'Дата и Время, DateTime',
            fieldformatid: 'Дата и Время (DateTime)',
            fieldname: 'datetime_field'
        },{
            displayname: 'Дата, Date',
            fieldformatid: 'Дата (Date)',
            fieldname: 'date_field'
        },{
            displayname: 'Время (Time)',
            fieldformatid: '9',
            fieldname: 'time_field'
        },{
            displayname: 'Autocomplete, EntityType',
            fieldformatid: 'Таблица (EntityType)',
            fieldname: 'autocomplete_entitytype_field'
        },{
            displayname: 'Combobox, Field Types',
            fieldformatid: 'Field Types',
            fieldname: 'combobox_fieldtypes_field'
        },{
            displayname: 'Вложения',
            fieldformatid: 'Множественное Вложение (Multi Attachment)',
            fieldname: 'attachments_field'
        }];
        var fieldsLength = fields.length;
        return $h.login.loginToPage(null)
        .then(function(){
            return browser.get(urlBase + 'entity/' + EntityTableId);
        })
        .then(expliciteWait)
        .then(angularWait)
        .then(function(){
            return $h.grid.main.getTotalRows();
        })
        .then(function(count){
            EntitiesBeforeTest = count;
        })        
        .then(expliciteWait)
        .then(angularWait)
        .then(function(){
            return $h.grid.main.upsert('tablename', 'test_table_1');
        })
        .then(function(){
            return $h.form.setForm({            
                displayname: 'Тестовая таблица 1',
                tablename: 'test_table_1',
                baseentitytypeid: 'Данные (Data)',
                isactive: true,
                dstype: {displayValue:'Таблица', value: 'table'}
            });
        })
        .then(function(){
            return $h.form.processButton(['CREATE', 'UPDATE']);
        })        
        .then(expliciteWait)
        .then(angularWait)
        .then(function(){
            return $h.form.setForm({            
                isactive: true
            });
        })
        .then(function(){
            return $h.form.processButton(['UPDATE']);
        })        
        .then(function(){
            return $h.form.setForm({            
                entityfieldlist: {
                    ///$action: 'ADDROW',
                    $unique: 'fieldname',
                    values: fields
                }
            });
        })
        .then(expliciteWait)
        .then(angularWait)
        .then(function(){
            expect($h.grid.subgrid('entityfieldlist').getTotalRows()).toBe(numberOfStandartFields + fieldsLength);
        })
        .then(expliciteWait)
        .then(function(){
            return $h.form.processButton('BACK');
        })
        .then(expliciteWait)
        .then(angularWait)
        .then(function(){
            return $h.grid.main.getTotalRows();
        })
        .then(function(totalRows){
            expect(totalRows).toBe(EntitiesBeforeTest + 1);
        })
        .then(done);
        
    }, skip);    
    
});