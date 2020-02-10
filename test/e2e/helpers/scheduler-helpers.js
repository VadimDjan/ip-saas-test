var $h = protractor.helpers;
    
function functionsList(fieldName){
    
    var prefixSelector = (!!fieldName) ? $h.form.getFieldSelector(fieldName) + ' ': '';
    
    function tasksList(additionalFilter) {
        function runInBrowser(prefix, additionalFilter){
            return [].slice.call(document.querySelectorAll(prefix + '.k-event ' + (additionalFilter || '')))
                    .map(function(el){ 
                        return {
                            uid: el.dataset.uid, 
                            start: Number(el.querySelector('[data-eventstart]').dataset.eventstart), 
                            end: Number(el.querySelector('[data-eventend]').dataset.eventend),  
                            title: el.querySelector('.event-title').innerText}; 
            });
        }
        return browser
            .executeScript(runInBrowser, prefixSelector, additionalFilter);
    }

    function getTask(dataUid){
        return tasksList(' [data-uid="' + dataUid +'"]').then(function(list){
            return list[0];
        });
    }
    
    function resizeTask(dataUid, daysDelta, resizeType ){ // resizeType = 'start' | 'end' | 'move'
        return element(by.css(prefixSelector + ' .idea-scheduler .k-scheduler-layout')).getAttribute('class').then(function (classes) {
            var classList =  classes.split(' ');
            var postfixSelector = '';
            if(resizeType === 'start'){
                postfixSelector = ' .k-resize-handle.k-resize-w';
            }
            else if(resizeType === 'end'){
                postfixSelector = ' .k-resize-handle.k-resize-e';
            }
            if(classList.indexOf('k-scheduler-timelineMonthview') >= 0){
                return element(by.css(prefixSelector + '[data-uid="' + dataUid +'"]' + postfixSelector)).getWebElement().
                then(function(event){
                    browser.actions().dragAndDrop(event, {x:100*daysDelta, y:0}).perform();
                    return browser.waitForAngular();
                });
            }
            else{
                throw new Error('Unimplemented scheduller mode');
            }
        });        
    }
    
    return  {
        getTask: getTask, 
        moveTask: resizeTask,
        tasksList: tasksList,
        resizeTask: resizeTask
    };
}

exports.main =  functionsList();

exports.subscheduler = function (fieldName){
    return functionsList(fieldName);
};
