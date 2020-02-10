var $h = protractor.helpers;
var expliciteWait = $h.wait.expliciteWait;
var angularWait = $h.wait.angularWait;

function addTab(tabName){     
    return element(by.model('formEditor.newSectionName')).clear().sendKeys(tabName).then(function() {
        return element(by.css('[ng-click="formEditor.addSection(formEditor.newSectionName)"]')).click()        
    });
    
}

exports.addTab = addTab;

exports.getTabs = function (){     
    return element.all(by.css('.panel-title span'))
    .map(function(elm, index) {
          return  elm.getText();
    });
};

function selectField (fieldName){
    console.log('designer-helpers')
    return $h.form.processForm([fieldName], function(){
        return browser.executeScript(function(_fieldName){
            $('idea-field-view[data-field-name="' + _fieldName + '"]').click();
        }, fieldName);
        //return element(by.css('idea-field[data-field-name="' + fieldName + '"]')).click();
    });
}

exports.selectField = selectField;

function getFieldCoordinates (fieldName){     
    return selectField(fieldName)
    .then(angularWait)
    .then(expliciteWait)    
    .then(function(){
        return browser.executeScript(function(){
            return {
                section: Number($('[ng-model="current.coordinates.section"]').val()),
                row: Number($('[ng-model="current.coordinates.row"]').val()),
                col1: Number($('[ng-model="current.coordinates.col1"]').val()),
                col2: Number($('[ng-model="current.coordinates.col2"]').val())                
            };
        });
    })
    .then(angularWait);
}
exports.getFieldCoordinates = getFieldCoordinates;

function setFieldSection(fieldName, newSectionName) {
    return selectField(fieldName)
    .then(function(){
        var selectMethod = ("number" === typeof newSectionName) ? 'selectByValue' :'selectByText';
        return (new $h.select(by.model('current.coordinates.section')))[selectMethod](newSectionName);
    })
    .then(angularWait);
}
exports.setFieldSection = setFieldSection;


function removeSection(sectionNumber){
    return $('.panel:nth-child(' + (sectionNumber + 1) + ') [ng-click="editor.removeSection(section)"]').click();
}
exports.removeSection = removeSection;

function setFieldCoordinates(fieldName, newCoordinates){
    var oldCoordinates = {};
    return getFieldCoordinates (fieldName)
    .then(function(_oldCoordinates){
        oldCoordinates.section = _oldCoordinates.section;
        oldCoordinates.row = _oldCoordinates.row;
        oldCoordinates.col1 = _oldCoordinates.col1;
        oldCoordinates.col2 = _oldCoordinates.col2;
        browser.waitForAngular();
        if(newCoordinates.section !== oldCoordinates.section){
            return (new $h.select(by.model('current.coordinates.section'))).selectByValue(newCoordinates.section);
        }
        else{
            return null;
        }
    })
    .then(function() {
        browser.waitForAngular();
        if(newCoordinates.row !== oldCoordinates.row){
            return element(by.model('current.coordinates.row')).clear().sendKeys(newCoordinates.row);
        }
        else{
            return null;
        }
    })
    .then(function() {
        browser.waitForAngular();
        if(newCoordinates.col1 !== oldCoordinates.col1 && newCoordinates.col2 === oldCoordinates.col2){
            return element(by.model('current.coordinates.col1')).clear().sendKeys(newCoordinates.col1);
        }
        else if(newCoordinates.col2 !== oldCoordinates.col2 && newCoordinates.col1 === oldCoordinates.col1){
            return element(by.model('current.coordinates.col2')).clear().sendKeys(newCoordinates.col2);
        }
        else if(newCoordinates.col1 !== oldCoordinates.col1 && newCoordinates.col2 !== oldCoordinates.col2 && newCoordinates.col1 < newCoordinates.col2){
            if(newCoordinates.col2 < oldCoordinates.col2){
                return element(by.model('current.coordinates.col1')).clear().sendKeys(newCoordinates.col1).then(function(){
                    browser.waitForAngular();
                    return element(by.model('current.coordinates.col2')).clear().sendKeys(newCoordinates.col2);
                });
            }
            else{
                return element(by.model('current.coordinates.col2')).clear().sendKeys(newCoordinates.col2).then(function(){
                    browser.waitForAngular();
                    return element(by.model('current.coordinates.col1')).clear().sendKeys(newCoordinates.col1);
                });
            }
        }
        else{
            return null;
        }
    });
}
exports.setFieldCoordinates = setFieldCoordinates;

function getColumns(){
    return browser.executeScript(function(){
        return [].slice.call(document.querySelectorAll('thead th[role="columnheader"]')).map(function(e){
            return {
                field: e.dataset.field.split('.')[0], 
                dataField: e.dataset.field, 
                visible: (e.style.display!=='none'), 
                width: e.offsetWidth
            };
        });
    });    
}
exports.getColumns = getColumns;

function getVisibleColumns(){
    return getColumns().then(function(cols){        
        return cols
        .filter(function(e){return e.visible;})
        .map(function(e){return e.field;});
    });
}
exports.getVisibleColumns = getVisibleColumns;

function setColumns(_newCols){
    var oldCols, newCols;
    return getColumns().then(function(_oldCols){
        oldCols = _oldCols;
        newCols = _newCols.filter(function(c) {
            var oldCol = oldCols.filter(function(oc) {
                return oc.field == c.field;
            })[0];
            c.dataField = oldCol.dataField;
            return oldCol != null && oldCol.visible !== c.visible;
        });
        if(newCols.length > 0){
            return browser.executeScript(function(columnsToHide, columnsToShow){
                var grid = $('[ip-kendo-grid]').data('kendoGrid');
                columnsToHide.forEach(function(col) {
                    grid.hideColumn(col.dataField);
                });
                columnsToShow.forEach(function(col) {
                    grid.showColumn(col.dataField);
                });
                return ;
            },newCols.filter(function(c) {
                return !c.visible;
            }),newCols.filter(function(c) {
                return c.visible;
            }));
        }
        else{
            return;
        }
    });
}
exports.setColumns = setColumns;

function saveForm(){
    return element(by.css('[ng-click="save()"]')).click().then(function() {
        return browser.waitForAngular();
    });
}
exports.saveForm = saveForm;
