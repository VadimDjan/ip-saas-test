describe('Idea Platform login page', function () {
	var ptor;

	beforeEach(function () {
		ptor = browser;
	});

	it('should redirect to default page after login page', function () {
		ptor.get(protractor.helpers.url + '#/login');
		element(by.model('user.user')).clear().sendKeys('victor');
		element(by.model('user.password')).clear().sendKeys('P@$$w0rd');
		browser.wait(function () {
			return ptor.isElementPresent(by.id('login-btn'));
		}, 8000);

		element(by.id('login-btn')).click();

		browser.wait(function () {
			return ptor.isElementPresent(by.css('.ip-main-menu'));
		}, 8000);

		browser.getLocationAbsUrl().then(function (url) {
			expect(url).toEqual(protractor.helpers.url + '#/entity/228');
		});
	});



	it('should contain data', function () {
		ptor.get(protractor.helpers.url + '#/entity/225');

		element.all(by.css('idea-grid .k-grid-content table tr'))
			.then(function (items) {
				expect(items.length).toBe(1);
			});

		element.all(by.css('idea-grid .k-grid-content table tr td'))
			.then(function (items) {
				browser.actions().doubleClick(items[0]).perform()
				browser.waitForAngular();
				browser.executeScript('$(\'.modal\').removeClass(\'fade\');');
				return element(by.css('.modal-body'));
			})
			.then(function (modalItem) {
				element(by.css('[name="DISPLAYNAME"]')).clear().sendKeys('victor');
				element(by.css('[data-button-name="PROCESSANDBACK"]')).click();
				browser.wait(function () {
					return false;
				}, 8000);
			});

	});

});