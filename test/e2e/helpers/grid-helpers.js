const $h = protractor.helpers;
const { defaultWaitTimeout, expliciteWait, angularWait } = $h.wait
const EC = protractor.ExpectedConditions;

function functionsList(fieldName, isSelector) {

    var prefixSelector = (fieldName) ? (isSelector ? fieldName : $h.form.getFieldSelector(fieldName)) + ' ' : '';

    const filters = {
        selectFilter: async function(filter) {
            const filterMenu = $$('.k-filter-menu.k-popup.k-group.k-reset').filter(el => el.isDisplayed()).first();
            const logicInputSelector = 'span.k-widget.k-dropdown.k-header';
            await filterMenu.$$(logicInputSelector).first().click();
            await browser.sleep(1000);
            const filterType = this[filter.type];
            if (!filterType) {
                console.error(`No operators found for type "${filter.type}"`);
            } else {
                const filterText = this[filter.type][filter.operator];
                if (!filterText) {
                    console.error(`No "${filter.operator}" operator found for type "${filter.type}"`)
                } else {
                    const listContainer = await $$('.k-list-container.k-popup.k-group.k-reset').filter(el => el.isDisplayed()).first();
                    const listOption = listContainer.element(by.cssContainingText('li.k-item', filterText));
                    await listOption.click();
                    await browser.sleep(1000);
                }
            }
        },
        'int': {
            'eq': 'равно',
            'gte': 'больше или равно',
        }
    }

    return {
        dataRowsList: function() {
            return element.all(by.css(prefixSelector + '.k-grid-content table tr:not(.k-grouping-row)'));
        },

        groupRowsList: function() {
            return element.all(by.css(prefixSelector + '.k-grid-content table tr.k-grouping-row'));
        },

        rowsList: function () {
            // console.log('grid-helpers')
            // console.log('prefixSelector**=', prefixSelector, 'prefixSelector**=')
            return element.all(by.css(prefixSelector + '.k-grid-content table tr'));
        },
        rowsFindElement: function () {
            // console.log('grid-helpers')
            // console.log('prefixSelector', prefixSelector)
            return element.all(by.css(prefixSelector + '.k-grid-content table tr'));
        },

        searchElement: function (fieldName) {
            return element.all(by.css(fieldName)).isPresent();
        },
        addRow: function () {
            var selector = prefixSelector + '.idea-button-add-row';

            return angularWait()
                .then(expliciteWait)
                .then(function () {
                    return browser.executeScript(function () {
                        return window.scrollTo(0, 0);
                    });
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(function () {
                    return $(selector).click();
                })
                .then(angularWait)
                .then(expliciteWait)
                /* .then(function () {
                    return browser.executeScript(function () {
                        return $('.modal').removeClass('fade');
                    });
                })*/
                .then(angularWait)
                .then(expliciteWait);
        },
        setSearch123: function (searchList) {
            var currentFieldIdx = 0;
            const submitSelector = '.k-animation-container[style*="display: block"] .k-filter-menu button[type="submit"]'
            var setFilter = function (filter) { // {"operator":"eq","value":90,"field":"workflowstepid", type: "enums"}
                return angularWait()
                    .then(expliciteWait)
                    .then(function () {
                        return browser.executeScript(function (_selector) {
                            $(_selector).trigger('click');
                        }, prefixSelector + ' [data-field*="' + filter.field + '"] .k-grid-filter');
                    })
                    .then(angularWait)
                    .then(expliciteWait)
                    .then(function () {
                        if (filter.type === 'enums') {
                            const checkboxSelector = prefixSelector + ' .k-filter-menu input[type="checkbox"][value="' + filter.value + '"]'
                            // console.log('checkboxSelector', checkboxSelector)
                            // console.log('prefixSelector', prefixSelector)
                            return $(prefixSelector + ' .k-filter-menu input[placeholder]').clear().sendKeys(filter.value)
                                .then(angularWait)
                                .then(expliciteWait)
                                .then(expliciteWait)
                                .then(expliciteWait)
                                .then(function () {
                                    var checkbox = $(checkboxSelector)
                                    var EC = protractor.ExpectedConditions;
                                    // console.log('checkbox', checkbox)
                                    // console.log('EC', EC)
                                    return browser.wait(EC.visibilityOf(checkbox), defaultWaitTimeout);
                                })
                                .then(function () {
                                    // console.log('нажать Запланирован')
                                    return browser.actions().mouseMove($(checkboxSelector)).click().perform()
                                })
                                .then(angularWait)
                                .then(expliciteWait)
                        } else if (filter.type === 'string' && filter.operator === 'contains') {
                            const stringSelector = prefixSelector + ' input[data-bind="value:filters[0].value"]'
                            return $(stringSelector).clear().sendKeys(filter.value)
                                .then(angularWait)
                                .then(expliciteWait)
                        } else if (filter.type === 'int' && filter.operator === 'eq') {
                            const stringSelector = prefixSelector + '[class="k-formatted-value k-input"]'
                            // const stringSelector = prefixSelector + ' input type="text"[class="k-formatted-value k-input"]'
                            return element.all(by.css(stringSelector)).first().clear().sendKeys(filter.value)
                                .then(angularWait)
                                .then(expliciteWait)
                        } else {
                            return;
                        }
                    })
                    // .then(function () {
                    //     return $h.common.scrollToSelector(submitSelector)
                    // })
                    .then(function () {
                        return $(submitSelector).click();
                    }).then(function () {
                        currentFieldIdx += 1;
                        if (currentFieldIdx < searchList.length) {
                            return setFilter(searchList[currentFieldIdx]);
                        } else {
                            return;
                        }
                    })
                    .then(angularWait)
                    .then(expliciteWait);

            };
            if (searchList.length > 0) {
                return setFilter(searchList[currentFieldIdx]);
            } else {
                return;
            }
        },

        setSearch: async function (searchList) {
            let currentFieldIdx = 0;
            const submitSelector = '.k-animation-container[style*="display: block"] .k-filter-menu button[type="submit"]';
            const submitLocator = element(by.css(submitSelector));
            const setFilter = async function (filter) { // {"operator":"eq","value":90,"field":"workflowstepid", type: "enums"}
                await browser.sleep(500);
                const filterButtonElement = element(by.css(`${prefixSelector} [data-field="${filter.field}"] .k-grid-filter`));
                await browser.actions().mouseMove(filterButtonElement).click().perform();
                await browser.sleep(1000);
                if (filter.type === 'enums') {
                    const checkboxSelector = prefixSelector + ' .k-filter-menu input[type="checkbox"][value*="' + filter.value + '"]';
                    const checkboxLocator = element(by.css(checkboxSelector));
                    await element(by.css(prefixSelector + ' .k-filter-menu input[placeholder]')).clear().sendKeys(filter.value);
                    await browser.sleep(3000);
                    await browser.wait(EC.visibilityOf(checkboxLocator), defaultWaitTimeout);
                    await browser.sleep(1000);
                    await browser.actions().mouseMove(checkboxLocator).click().perform();
                } else if (filter.type === 'string') {
                    switch (filter.operator) {
                        case 'contains':
                        default:
                            const stringSelector = prefixSelector + ' input[data-bind="value:filters[0].value"]';
                            const stringLocator = element(by.css(stringSelector));
                            await stringLocator.clear();
                            await browser.sleep(500);
                            await stringLocator.sendKeys(filter.value);
                            break;
                    }
                } else if (filter.type === 'int') {
                    await filters.selectFilter(filter);
                    const intSelector = prefixSelector + '[class="k-formatted-value k-input"]';
                    const intLocator = element.all(by.css(intSelector)).first()
                    await intLocator.clear();
                    await browser.sleep(500);
                    await intLocator.sendKeys(filter.value);
                }

                await browser.sleep(500);
                await browser.actions().mouseMove(submitLocator).click().perform();
                await browser.wait(EC.invisibilityOf(element(by.css('.k-loading-mask'))), defaultWaitTimeout);
                await browser.sleep(1500);

                currentFieldIdx += 1;
                if (currentFieldIdx < searchList.length) {
                    return setFilter(searchList[currentFieldIdx]);
                }
            };
            if (searchList.length > 0) {
                return setFilter(searchList[currentFieldIdx]);
            }
        },

        getTotalRows: function () {
            return $h.common.scrollToSelector(prefixSelector + ' span.k-pager-info.k-label')
                .then(function () {
                    return $(prefixSelector + ' span.k-pager-info.k-label').getText();
                })
                .then(function (text) {
                    var t = (parseInt(text.split(' ').splice(-1, 1)[0]) || 0);
                    return t;
                });
        },
        upsert: function (field, value) {
            var self = this;
            return this.openRow(field, value)
                .then(angularWait)
                .then(expliciteWait)
                .then(function (row) {
                    if (row == null) {
                        return self.addRow();
                    } else {
                        return row;
                    }
                });
        },
        openRow: function (field, value) {
            function openRowByNumber(rowNum) {
                if (rowNum >= 0) {
                    return element.all(by.css(prefixSelector + ' .k-grid-content tr[data-uid]')).get(rowNum).getAttribute('data-uid').then(function (uid) {
                        browser.actions().doubleClick(
                            element.all(by.css(prefixSelector + 'tr[data-uid="' + uid + '"] td[role="gridcell"]:not([style]')).first()
                        ).perform()
                        return angularWait()
                            .then(expliciteWait)
                            /* .then(function () {
                                return browser.executeScript(function () {
                                    return $('.details__modal').removeClass('details-fade');
                                });
                            })*/
                            .then(function () {
                                return rowNum;
                            });
                    })
                        .then(angularWait)
                        .then(expliciteWait);
                } else {
                    return null;
                }
            }

            if ('number' === typeof field && field >= 0 && arguments.length === 1) {
                return openRowByNumber(field);
            } else {
                return this.scrollToRow(field, value)
                    .then(openRowByNumber);
            }
        },
        scrollToRow: function (field, value) { // находит строку и делает ее доступной для скролинга, меняя страницу и область прокрутки,            
            //возвращает номер строки на текущей странице, если строка нашлась, иначе возвращает -1
            return angularWait()
                .then(expliciteWait)
                .then(function () {
                    return browser.executeScript(scrollToPager, prefixSelector + 'a.k-link.k-pager-nav.k-pager-first');
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(function () {
                    return $(prefixSelector + 'a.k-link.k-pager-nav.k-pager-first').click();
                })
                .then(angularWait)
                .then(expliciteWait)
                .then(scrollToRowAfterReturnOnFirstPage)
                .then(angularWait)
                .then(expliciteWait);

            function scrollToRowIfOnThisPage(prefixSelector, field, value) {
                var index = -1;
                var el = $(prefixSelector + 'span[data-field="' + field + '"]')
                    .filter(function (idx) {
                        if ($(this).text().trim() == value) {
                            index = idx;
                            return true;
                        } else {
                            false;
                        }
                    });
                if (el.length) {
                    el.parent().parent()[0].scrollIntoView();
                }
                return index;
            }

            function scrollToPager(selector) {
                return $(selector)[0].scrollIntoView();
            }

            function scrollToRowAfterReturnOnFirstPage() {
                return browser.executeScript(scrollToRowIfOnThisPage, prefixSelector, field, value)
                    .then(function (elementIndex) {
                        if (elementIndex >= 0) {
                            return elementIndex;
                        } else {
                            return $(prefixSelector + 'a.k-link.k-pager-nav.k-state-disabled span.k-i-arrow-e').isPresent()
                                .then(function (isLastPage) {
                                    if (isLastPage) {
                                        return -1;
                                    } else {
                                        return $(prefixSelector + 'a.k-link.k-pager-nav span.k-i-arrow-e').click()
                                            .then(angularWait)
                                            .then(expliciteWait)
                                            .then(function () {
                                                return scrollToRowAfterReturnOnFirstPage(field, value);
                                            });
                                    }
                                });
                        }
                    });
            }

        },
        clearFilters: async () => { // очистка фильтров на форме списка
            if (await element(by.css('.idea-button-clear-filters')).isDisplayed()) {
                await element(by.css('.idea-button-clear-filters')).click();
                await browser.wait(EC.invisibilityOf(element(by.css('.idea-button-clear-filters'))), defaultWaitTimeout);
                await browser.sleep(1500);
            }
        },
        selectFieldsInColumnMenu: async fields => {
            const columnMenuButton = element.all(by.css('div.idea-column-menu')).last();
            await browser.actions().mouseMove(columnMenuButton).click().perform();
            await browser.sleep(2000);
            const columnMenu = await element.all(by.css('div.k-column-menu ul.k-menu-group')).last();
            if (Array.isArray(fields) && fields.length) {
                for (const field of fields) {
                    const fieldLocator = columnMenu.element(by.css(`.k-item[data-field-name="${field}"] input[data-field="${field}"]`));
                    await browser.actions().mouseMove(fieldLocator).click().perform();
                    await browser.sleep(500);
                }
            } else {
                const fieldLocator = await columnMenu.element(by.css(`.k-item[data-field-name="${fields}"] input[data-field="${fields}"]`));
                await browser.actions().mouseMove(fieldLocator).click().perform();
            }
            await browser.sleep(1500);
            await browser.actions().mouseMove(columnMenuButton).click().perform();
            await browser.sleep(500);
        }
    };
}

exports.main = functionsList();
exports.modal = functionsList('.modal-query idea-grid-view', true);
exports.subgrid = function (fieldName) {
    return functionsList(fieldName);
};
