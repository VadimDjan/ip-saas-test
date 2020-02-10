function getTodayStr() {
	function twoDigits(d) {
		if (0 <= d && d < 10)
			return '0' + d.toString();
		if (-10 < d && d < 0)
			return '-0' + (-1 * d).toString();
		return d.toString();
	}
	var d = new Date;
	return d.getFullYear() + '-' + twoDigits(1 + d.getMonth()) + '-' + twoDigits(d.getDate()) + ' '
		+ twoDigits(d.getHours()) + ':' + twoDigits(d.getMinutes()) + ':' + twoDigits(d.getSeconds());

}
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function select2ClickRandItem(select2Id, browser) {
	var select2 = browser.element(by.css('div#s2id_' + select2Id));
	try {
		select2.click();
	}
	catch (e) {
		browser.executeScript('document.querySelector(\'' + 'div#s2id_' + select2Id + '\').click();');
	}
	var items = browser.element.all(by.css('ul.select2-results li span'));
	var itemsCount, rand;
	browser.driver.wait(function () {
		return items.count().then(function (count) {
			itemsCount = count;
			return 0 < count;
		})
	})
		.then(function () {
			rand = getRandomInt(0, itemsCount - 1)
			items.get(rand).click();
		});
}

function setRandInSelect2(fieldName, browser, formType) {
	//select2ClickRandItem('ip_select2_' + fieldName + '_modalForm')
	var selector = '#ip_select2_' + fieldName + '_' + formType,
		idea_selector = (formType === 'modalForm' ? '.modal ' : '') + 'idea-select [name="' + fieldName + '"]';
	browser.waitForAngular();
	browser.wait(function () {
		return browser.element(by.css(selector));
	}, 8000)
		.then(function () {
			return browser.executeScript(function scriptOpen(selector) {
				$(selector).select2('open');
			}, selector)
		}).then(function () {
			var items = browser.element.all(by.css('ul.select2-results li span'));
			var itemsCount, rand;
			return browser.driver.wait(function () {
				return items.count().then(function (count) {
					itemsCount = count;
					return 0 < count;
				})
			})
		})
		.then(function () {
			return browser
				.executeScript(function scriptSelectAndSet(selector, idea_selector) {
					function getRandomInt(min, max) {
						return Math.floor(Math.random() * (max - min + 1)) + min;
					}
					var values = $('ul.select2-results li span').map(function (id, elem) {
						return {
							value: parseInt(elem.dataset.value) || elem.dataset.value,
							displayValue: elem.innerText
						};
					});
					var newVal = values[getRandomInt(0, values.length - 1)]
					$(idea_selector).scope().setValue(newVal);
					$(selector).select2('close');
				}, selector, idea_selector);
		})
		.then(function () {

		})
}


function login(browser, username, password) {
	browser.get(protractor.helpers.url + '#/login');
	browser.element(by.model('user.user')).clear().sendKeys(username);
	browser.element(by.model('user.password')).clear().sendKeys(password);
	browser.wait(function () {
		return browser.isElementPresent(by.id('login-btn'));
	}, 8000);

	browser.element(by.id('login-btn')).click();

	browser.wait(function () {
		return browser.isElementPresent(by.css('.ip-main-menu'));
	}, 8000);

	browser.getLocationAbsUrl().then(function (url) {
		expect(url).toEqual(protractor.helpers.url + '#/entity/228');
	});
}

function Scenario_0(browser, username) {
	browser.get(protractor.helpers.url + '#/entity/314');
	function createRecord() {
		return element.all(by.css('idea-grid .k-grid-content table tr'))
			.then(function (items) {
				browser.element(by.css('[data-button-name="ADDROW"]')).click();
				browser.waitForAngular();
				browser.executeScript('$(\'.modal\').removeClass(\'fade\');');
				return element(by.css('.modal-body'));
			})
			.then(function (modalItem) {

				setRandInSelect2('LOCATION', browser, 'modalForm');
				setRandInSelect2('CI', browser, 'modalForm');
				browser.element(by.css('.modal [name="DISPLAYNAME"]')).clear().sendKeys(username + '_' + getTodayStr());
				//browser.pause();
				browser.element(by.css('.modal [data-button-name="CREATE"]')).click();
				browser.waitForAngular();
				browser.element(by.css('.modal [data-button-name="BACK"]')).click();
			})
			.then(function () {
				//createRecord()
			});
	}
	createRecord()
}

function Scenario_1(browser, username) {
	browser.get(protractor.helpers.url + '#/entity/259');
	function searchAndUpdate() {
		setRandInSelect2('MODEL', browser, 'searchForm');
		browser.element(by.css('[data-button-name="SEARCH"]')).click();
		return element.all(by.css('idea-grid .k-grid-content table tr'))
			.then(function (items) {
				var itemsLength = items.length;
				if (itemsLength > 0) {
					var rand = getRandomInt(1, Math.min(itemsLength, 10));
					return element.all(by.css('idea-grid .k-grid-content table tr:nth-child(' + rand + ') td'))
						.then(function (items) {
							browser.actions().doubleClick(items[0]).perform()
							browser.waitForAngular();
							browser.executeScript('$(\'.modal\').removeClass(\'fade\');');
							return element(by.css('.modal-body'));
						})
						.then(function (modalItem) {
							element(by.css('.modal [name="DISPLAYNAME"]')).sendKeys('_' + getTodayStr());
							element(by.css('.modal [data-button-name="PROCESSANDBACK"]')).click();
							browser.waitForAngular();
							//browser.pause();
							return searchAndUpdate();
						});
				}
				else {
					return //searchAndUpdate();
				}
			});
	}
	searchAndUpdate();
}

function Scenario_2(browser, username) {
	browser.get(protractor.helpers.url + '#/entity/312');
	function addSubEntity() {
		return element.all(by.css('idea-grid .k-grid-content table tr'))
			.then(function (items) {
				var itemsLength = items.length;
				var rand = getRandomInt(1, Math.min(itemsLength, 10));
				return element.all(by.css('idea-grid .k-grid-content table tr:nth-child(' + rand + ') td'))
			})
			.then(function (items) {
				browser.actions().doubleClick(items[0]).perform()
				browser.waitForAngular();
				browser.executeScript('$(\'.modal\').removeClass(\'fade\');');
				return element(by.css('.modal-body'));
			})
			.then(function (modalItem) {
				return element(by.css('.modal-body [data-entity-id="312"] .panel-group>div:nth-child(2) .panel-collapse')).getAttribute('class')
			})
			.then(function (className) {
				if (className.indexOf('in') < 0)
					return element(by.css('.modal-body [data-entity-id="312"] .panel-group>div:nth-child(2) .panel-heading h4 span')).click();
				else
					return
			})
			.then(function () {
				element(by.css('[data-entity-id="312"] #TASKS button[data-button-name="VJ_ADDROW"]')).click();
				browser.waitForAngular();
				return element(by.css('.modal-body  [data-entity-id="255"]'));
			})
			.then(function (modalItem2) {
				element(by.css('.modal-body  [data-entity-id="255"] #DISPLAYNAME  input')).clear().sendKeys(username + '_' + getTodayStr());
				browser.element(by.css('.modal  [data-entity-id="255"] [data-button-name="CREATE"]')).click();
				browser.waitForAngular();
				browser.element(by.css('.modal [data-entity-id="255"] [data-button-name="BACK"]')).click();
				browser.waitForAngular();
				browser.element(by.css('.modal [data-entity-id="312"] [data-button-name="PROCESSANDBACK"]')).click();
				return //addSubEntity();
			});
	}
	addSubEntity();
}

describe('Idea Platform login page', function () {
	var browserInstance = browser,
		username = 'timur',
		password = '123456';

	beforeEach(function () { });



	it('should redirect to default page after login page', function () {
		login(browserInstance, username, password)
	});

	it('should run 555.0 spec', function () {
		//Scenario_0(browserInstance, username);
	}, 7 * 24 * 3600 * 1000);

	it('should run 555.1 spec', function () {
		Scenario_1(browserInstance, username);
	}, 7 * 24 * 3600 * 1000);

	it('should run 555.2 spec', function () {
		Scenario_2(browserInstance, username);
	}, 7 * 24 * 3600 * 1000);

});