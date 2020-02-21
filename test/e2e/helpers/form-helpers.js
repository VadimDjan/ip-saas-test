var _ = protractor.helpers._;
var $h = protractor.helpers;
var expliciteWait = $h.wait.expliciteWait;
var angularWait = $h.wait.angularWait;

function getFieldSelector(name) {
    return name === 'displayname' ? '.current-form h3 [editable-header-view]' : '.current-form idea-field-view[data-field-name="' + name + '"]'
}

var findFieldOnCurrentTab = function (name) {
    console.log('findFieldOnCurrentTab name =', name)
    return protractor.promise.all([
        element(by.css('.current-form idea-field-view[data-field-name="' + name + '"]')),
        element(by.css('.current-form idea-field-view[data-field-name="' + name + '"]')).getAttribute('data-widget')
    ])
        .then(function (a) {
            console.log('findFieldOnCurrentTab type', a[1])
            return {
                element: a[0],
                type: a[1]
            };
        });
};
exports.getFieldSelector = getFieldSelector;

function setField(name, value) {
    return findFieldOnCurrentTab(name)
        .then(function (field) {
            var fieldSelector = getFieldSelector(name),
                selector,
                selector2;
            // console.log('field.type', field.type);
            switch (field.type) {
                case 'input':
                case 'input_pattern':
                case 'password':
                    return field.element.element(by.css('[data-input-name="' + name + '"]')).clear().sendKeys(value);
                case 'float':
                    selector = fieldSelector + '  [data-role=\"numerictextbox\"]';
                    return browser.executeScript(function (_selector, _value) {
                        var editor = $(_selector).data('kendoNumericTextBox');
                        editor.value(_value);
                        editor.trigger('change');
                    }, selector, value)
                        .then(angularWait)
                        .then(expliciteWait)
                        .then(function () {
                            return browser.sleep(100);
                        });

                case 'button':
                    return field.element.element(by.css('[ng-click="processFieldButton()"]')).click();
                case 'datetime':
                case 'date':
                case 'time':
                    selector = fieldSelector + ' .input-group.date input';
                    return browser.executeScript(function (_selector, _value) {
                        $(_selector).val(_value).change();
                    }, selector, value);
                case 'richtext':
                    selector = fieldSelector + ' textarea.ip-editor';
                    return browser.executeScript(function (_selector, _value) {
                        var editor = $(_selector).data('kendoEditor');
                        editor.value(_value);
                        editor.trigger('keydown')
                        editor.trigger('change');
                    }, selector, value)
                        .then(angularWait)
                        .then(expliciteWait)
                        .then(function () {
                            return browser.sleep(100);
                        });
                case 'comments': //$('textarea.comment-view__editor').data('kendoEditor')
                    selector = fieldSelector + ' textarea.comment-view__editor';
                    selector2 = fieldSelector + ' [ng-click="writeComment(comment)"]';
                    return browser.executeScript(function (_selector, _selector2, _value) {
                        var editor = $(_selector).data('kendoEditor');
                        editor.value(_value);
                        editor.trigger('change');
                        $(_selector2).click();
                    }, selector, selector2, value)
                        .then(function () {
                            return browser.sleep(100);
                        })
                        .then(angularWait);
                case 'checkbox':
                    var checkbox = element(by.css(fieldSelector + ' input[type="checkbox"]'));
                    return checkbox.isSelected().then(function (selected) {
                        if (selected !== value) {
                            checkbox.click();
                        }
                    });
                case 'select':
                case 'addable_select':
                case 'autocomplete':
                case 'addable_autocomplete':
                    // browser.executeScript('window.scrollTo(0,0);').then(function () {
                    //     console.log('++++autocomplete++SCROLLED UP+++++');
                    // });
                    element(by.css(fieldSelector + ' .select2-choice')).click();
                    selector = '#select2-drop:not([style*=\"display: none\"])';
                    selector2 = selector + ' .select2-results li.select2-result-selectable';
                    if (field.type.indexOf('autocomplete') >= 0) {
                        const val = value && value.displayValue || value && value.value || value
                        element(by.css(selector + ' .select2-input')).sendKeys(val)
                    }

                    return angularWait()
                        .then(expliciteWait)
                        .then(function () {
                            return browser.wait(function () {
                                return browser.isElementPresent(by.css(selector2));
                            });
                        })
                        .then(function () {
                            console.log('value', value);
                            try {
                                if (field.type.indexOf('autocomplete') >= 0 || field.type.indexOf('select') >= 0) {
                                    console.log('autocomplete) >= 0', value);
                                    return element.all(by.css(selector2)).first().click();
                                } else {
                                    console.log('value else', value);
                                    return element.all(by.css(selector2 + ' [data-value="' + (value && value.value || value) + '"]')).click();
                                }
                            } catch (e) {
                                console.error('Unknown value ' + value + ' for field ' + name);
                                console.error(e);
                            }
                        })
                        .then(() => {
                            console.log('then then');
                            console.log('then then fieldSelector', fieldSelector);
                            selector = fieldSelector;
                            // selector = fieldSelector + ' [ng-model]';
                            return browser.executeScript(function (_selector, _value) {
                                console.log('then selector', selector);
                                if (!($(_selector).scope()) || !($(_selector).isolateScope().$ctrl.getValueForTest())) {
                                    console.error('Wrong selector = ' + _selector);
                                }
                                return $(_selector).isolateScope().$ctrl.update();
                            }, selector, value)
                        })


                case 'no_glass_autocomplete':
                    browser.executeScript('window.scrollTo(0,0);').then(function () {
                        console.log('++++no_glass_autocomplete++SCROLLED UP+++++');
                    });
                    element(by.css(fieldSelector + ' .select2-choice')).click();
                    selector = '#select2-drop:not([style*=\"display: none\"])';
                    selector2 = selector + ' .select2-results li.select2-result-selectable';
                    if (field.type.indexOf('autocomplete') >= 0) {
                        const val = value && value.displayValue || value && value.value || value
                        element(by.css(selector + ' .select2-input')).sendKeys(val)
                    }

                    return angularWait()
                        .then(expliciteWait)
                        .then(function () {
                            return browser.wait(function () {
                                return browser.isElementPresent(by.css(selector2));
                            });
                        })
                        .then(function () {
                            try {
                                if (field.type.indexOf('autocomplete') >= 0) {
                                    return element.all(by.css(selector2)).first().click();
                                } else {
                                    return element.all(by.css(selector2 + ' [data-value="' + (value && value.value || value) + '"]')).click();
                                }
                            } catch (e) {
                                console.error('Unknown value ' + value + ' for field ' + name);
                                console.error(e);
                            }
                        })
                        .then(() => {
                            selector = fieldSelector + ' [ng-model]';
                            return browser.executeScript(function (_selector, _value) {
                                if (!($(_selector).scope()) || !($(_selector).isolateScope().$ctrl.getValueForTest())) {
                                    console.error('Wrong selector = ' + _selector);
                                }
                                return $(_selector).isolateScope().$ctrl.update();
                            }, selector, value)
                        })

                case 'subgrid':
                    var subRowValues = value.values instanceof Array ? value.values : [value.values];
                    var uniqueField = value['$unique'];
                    if (value['$action'] == 'ADDROW') {
                        var addFirstRow = function (values) {
                            protractor.promise.when($h.grid.subgrid(name).addRow())
                                .then(function () {
                                    return $h.form.setForm(values[0]);
                                })
                                .then(function () {
                                    return $h.form.processButton(['CREATE']);
                                })
                                .then(function () {
                                    return $h.form.processButton(['BACK']);
                                })
                                .then(function () {
                                    if (values.length > 1) {
                                        return addFirstRow(values.splice(1));
                                    } else {
                                        return;
                                    }
                                });
                        };
                        return addFirstRow(subRowValues);
                    } else if (uniqueField != null && (value['$action'] == 'UPSERTROW' || value['$action'] == null)) {
                        if (subRowValues.filter(function (sub_row) {
                            return sub_row[uniqueField] != null;
                        }).length == subRowValues.length) {
                            var upsertFirstRow = function (values) {
                                protractor.promise.when($h.grid.subgrid(name).upsert(uniqueField, values[0][uniqueField]))
                                    .then(function () {
                                        return $h.form.setForm(values[0]);
                                    })
                                    .then(function () {
                                        return $h.form.processButton(['UPDATE', 'CREATE'], null, true);
                                    })
                                    .then(function () {
                                        return $h.form.processButton(['BACK']);
                                    })
                                    .then(function () {
                                        if (values.length > 1) {
                                            return upsertFirstRow(values.splice(1));
                                        } else {
                                            return;
                                        }
                                    });
                            };
                            return upsertFirstRow(subRowValues);
                        } else {
                            console.error('No unique field for upsert operation of ', value);
                        }
                    }
                    break;
                default:
                    console.warn('Unimplemented field type = ' + field.type);
                    return;
            }
        })
        .then(function () {
            return getField(name);
        });
}

function getField(name) {

    return findFieldOnCurrentTab(name)
        .then(function (field) {
            var fieldSelector = getFieldSelector(name),
                selector;

            switch (field.type) {
                case 'input':
                case 'input_pattern':
                case 'password':
                case 'checkbox':
                case 'datetime':
                case 'date':
                case 'time':
                    // console.log(field.type, '1')
                    var valAttr = field.type === 'checkbox' ? 'checked' : 'value';
                    return field.element.element(by.css('[data-input-name=\"' + name + '\"]'))
                        .getAttribute(valAttr)
                        .then(function (val) {
                            var m;
                            switch (field.type) {
                                case 'checkbox':
                                    return val == 'checked';
                                case 'datetime':
                                    m = protractor.helpers.moment(val, 'DD/MM/YYYY HH:mm:ss');
                                    return m.isValid() ? m.toDate() : null;
                                case 'date':
                                    m = protractor.helpers.moment(val, 'DD/MM/YYYY');
                                    return m.isValid() ? m.toDate() : null;
                                default:
                                    return val;
                            }
                        });
                case 'float':
                    // console.log(field.type, '2')
                    selector = fieldSelector + ' [data-role=\"numerictextbox\"]';
                    return browser.executeScript(function (_selector) {
                        return $(_selector).data('kendoNumericTextBox').value();
                    }, selector)
                        .then(angularWait);
                case 'button':
                    // console.log(field.type, '3')
                    return null;
                case 'richtext':
                    // console.log(field.type, '4')
                    selector = fieldSelector + ' textarea.ip-editor';
                    return browser.executeScript(function (_selector) {
                        return $(_selector).data('kendoEditor').value();
                    }, selector)
                        .then(angularWait);
                case 'comments':
                    // console.log(field.type, '5')
                    selector = fieldSelector + ' ul.list-group li';
                    return angularWait()
                        .then(expliciteWait)
                        .then(function () {
                            return browser.executeScript(function (_selector, _value) {
                                return JSON.stringify(
                                    [].slice.call(document.querySelectorAll(' ul.list-group li')).map(function (el) {
                                        return {
                                            createdBy: $(el).find('.mic-info [ng-bind=\"comment\.createdBy.displayValue\"]').text(),
                                            createdTime: $(el).find('.mic-info [ng-bind=\"comment\.createdTimeDisplayValue\"]').text(),
                                            updatedBy: $(el).find('.mic-info [ng-bind=\"comment\.updatedBy\.displayValue\"]').text(),
                                            updatedTime: $(el).find('.mic-info [ng-bind=\"comment\.updatedTimeDisplayValue\"]').text(),
                                            text: $(el).find('[ng-bind-html="html(comment\.text)"]').html()
                                        };
                                    })
                                );
                            });
                        })
                        .then(angularWait)
                        .then(function (value) {
                            return JSON.parse(value);
                        });
                case 'select':
                case 'addable_select':
                case 'autocomplete':
                case 'addable_autocomplete':
                case 'no_glass_autocomplete':

                    console.log('getField', field.type)

                    selector = fieldSelector + ' [ng-model]';
                    return browser.executeScript(function (_selector) {
                        console.log('getField selector', selector)
                        if (!($(_selector).scope()) || !($(_selector).isolateScope().$ctrl.getValueForTest())) {
                            console.error('Wrong selector = ' + _selector);
                        }
                        return $(_selector).isolateScope().$ctrl.getValueForTest();
                    }, selector);

                case 'subgrid':
                    console.log(field.type, '7')
                    selector = fieldSelector + ' [ip-kendo-grid]'
                    return browser.executeScript(function (_selector) {
                        console.log('_selector', _selector.toString())
                        return JSON.parse(JSON.stringify($(_selector).data('kendoGrid').dataSource.data()));
                    }, selector);
                default:
                    // console.log(field.type, '8')
                    console.warn('Unimplemented field type = ' + field.type);
                    return;
            }
        });
}


function openNextSection() {
    var elem = element(by.css('.current-form .panel.panel-open + .panel'));
    if (elem.isPresent()) {
        return elem.click();
    } else {
        return false;
    }
}

function processForm(_fieldsList, functionToProcess) {
    // console.log('processForm 1')
    var result = {};
    let fieldsList

    function processHeader() {
        // console.log('processHeader 1')
        if (_fieldsList.includes('displayname')) {
            fieldsList = _fieldsList.filter(f => f !== 'displayname')
            return $h.common.scrollToSelector(getFieldSelector('displayname'))
                .then(() => functionToProcess('displayname'))
                .then(fieldResult => {
                    result['displayname'] = fieldResult
                })

        } else {
            fieldsList = _fieldsList
            // console.log('processHeader 2',_fieldsList)
            let when = protractor.promise.when(null)
            // console.log('processHeader 3',_fieldsList)
            return when
        }
    }

    function processSection() {
        var nextTabHeaderSelector = '.current-form .panel.panel-open + .panel h4 span[uib-accordion-header]';
        var currentFieldsList = [], sectionFieldsList = [];
        var processNextField = function () {
            if (currentFieldsList.length > 0) {

                return $h.common.scrollToSelector(getFieldSelector(currentFieldsList[0]))
                    .then(function () {
                        return functionToProcess(currentFieldsList[0]);
                    })
                    .then(function (fieldResult) {
                        result[currentFieldsList[0]] = fieldResult;
                        currentFieldsList = _.rest(currentFieldsList);
                        return processNextField();
                    });
            } else {
                return false;
            }
        };

        return element.all(by.css('.current-form .panel-open idea-field-view')).map(function (elm, index) {
            return elm.getAttribute('data-field-name');
        })
            .then(function (_sectionFieldsList) {
                sectionFieldsList = _sectionFieldsList;
                currentFieldsList = _.intersection(sectionFieldsList, fieldsList);
                return processNextField();
            })
            .then(function () {
                fieldsList = _.difference(fieldsList, sectionFieldsList);
                if (fieldsList.length) {
                    return element(by.css('.current-form .panel.panel-open + .panel')).isPresent()
                        .then(function (isPresent) {
                            if (isPresent) {
                                return angularWait().then(function () {
                                    try {
                                        return $h.common.scrollToSelector(nextTabHeaderSelector)
                                            .then(function () {
                                                return element(by.css(nextTabHeaderSelector)).click();
                                            })
                                            .then(angularWait)
                                            .then(function () {
                                                return processSection();
                                            });
                                    } catch (e) {
                                        return null;
                                    }
                                });

                            } else {
                                return console.error('Fields ' + fieldsList.toString() + ' were not found on form');
                            }
                        });
                } else {
                    return false;
                }
            });
    }

    function openFirstTabIfNeeded() {
        var firstTabHeaderSelector = '.current-form .panel:first-child h4 span[uib-accordion-header]';
        // console.log(firstTabHeaderSelector, 'firstTabHeaderSelector')
        //  console.log( '************')

        return element(by.css('.current-form .panel.panel-open:first-child')).isPresent()
            // .then(console.log( '**********!!!!**'))
            .then(function (isPresentFirstTab) {
                if (isPresentFirstTab) {
                    // console.log( '*****isPresentFirstTab*******', isPresentFirstTab)
                    return;
                } else {
                    // console.log( '*****isPresentFirstTab****FALSE***')
                    return element(by.css(firstTabHeaderSelector)).isPresent()
                        .then(function (isPresentHeader) {
                            // console.log( '*****function (isPresentHeader)***')
                            if (isPresentHeader) {
                                return $h.common.scrollToSelector(firstTabHeaderSelector)
                                    // .then(console.log( '!!!!!!!!**********!!!!!!!!'))
                                    .then(function () {
                                        return element(by.css(firstTabHeaderSelector)).click();
                                    })
                                    .then(angularWait);
                            }
                        });
                }
            });
    }

    return processHeader()
        // .then(console.log(openFirstTabIfNeeded, 'processHeader in openFirstTabIfNeeded*'))
        .then(openFirstTabIfNeeded)
        .then(processSection).then(() => {
            // console.log(openFirstTabIfNeeded, 'openFirstTabIfNeeded 1*')
            // console.log(processSection, 'processSection 1*')
        })
        .then(() => result)
}

exports.setForm = function (record) {
    return processForm(Object.keys(record), fieldName => {
        const fieldValue = record[fieldName]
        if (fieldName === 'displayname') {
            return element(by.id('formHeader')).sendKeys(fieldValue)
                .then(angularWait)
        } else {
            return setField(fieldName, fieldValue);
        }
    })
};
exports.getForm = function (record) {
    return processForm(record, fieldName => {
        // console.log('getForm 1')
        if (fieldName === 'displayname') {
            const toEditModeButton = element(by.css('.current-form h3 [editable-header-view] .glyphicon-pencil'))
            return toEditModeButton.isDisplayed()
                .then(visibile => {
                    if (visibile) {
                        return element(by.css('.current-form h3 [editable-header-view] .editable-header__sub-title')).getText()
                    } else {
                        return element(by.css('.current-form h3 [editable-header-view] .editable-header__input')).getAttribute('value')
                    }
                })

        } else {
            // console.log('getForm 2', record)
            return getField(fieldName)
        }
    })
    // .then(result => {
    //     console.info('result of getForm = ' + JSON.stringify(result || ''))
    //     return result
    // })
};
exports.processForm = processForm;

function processButton(name, fieldName, allowNoButton) {
    return angularWait()
        .then(expliciteWait)
        .then(function () {
            var fieldSelector = (fieldName != null ? ' idea-field-view [data-field-name=\"' + fieldName + '\"]' : '');
            if (name instanceof Array) {
                if (name.length === 0) {
                    return;
                } else {
                    var selector = '.current-form' + fieldSelector + ' [data-button-name=\"' + name[0] + '\"]';
                    return element(by.css(selector)).isPresent()
                        .then(function (isPresent) {
                            if (isPresent) {
                                return processButton(name[0], fieldName);
                            } else if (!allowNoButton) {
                                console.error('Can\'t find on form button with name = ' + name[0] + ' and selector = ' + selector);
                            }
                        })
                        .then(function () {
                            return processButton(name.splice(1), fieldName);
                        });
                }
            } else {
                return element(by.css('.current-form' + fieldSelector + ' [data-button-name=\"' + name + '\"]'))
                    .click()
                    .then(angularWait)
                    .then(expliciteWait);
            }
        });
}

exports.processButton = processButton;

function processPopup(action) {
    const selector = '.modal-footer .btn-' + action
    return function () {
        return angularWait()
            .then(expliciteWait)
            .then(function () {
                return element(by.css(selector)).isPresent();
            })
            .then(function (isPresent) {
                if (isPresent) {
                    return $h.common.scrollToSelector(selector);
                } else {
                    console.error('Can\'t find button on popup for action = ' + action + ' and selector = ' + selector);
                }
            })
            .then(function () {
                element(by.css(selector)).click();
            })
            .then(angularWait);
    };
}

exports.submitPopup = processPopup('submit');
exports.cancelPopup = processPopup('cancel');

