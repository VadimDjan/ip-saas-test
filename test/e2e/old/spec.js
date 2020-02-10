describe('Idea Platform list page', function () {
	var ptor;

	beforeEach(function () {
		ptor = browser;
		//ptor.ignoreSynchronization = true;

		ptor.get(protractor.helpers.url + '#/login');
		element(by.model('user.user')).clear();
		element(by.model('user.user')).sendKeys('victor');
		element(by.model('user.password')).clear();
		element(by.model('user.password')).sendKeys('P@$$w0rd');
		browser.wait(function () {
			return ptor.isElementPresent(by.id('login-btn'));
		}, 8000);

		element(by.id('login-btn')).click();

		browser.wait(function () {
			return ptor.isElementPresent(by.css('.ip-main-menu'));
		}, 8000);

		ptor.get(protractor.helpers.url + '#/entity/225');

	});

	it('should contain data', function () {
		browser.wait(function () {
			return ptor.isElementPresent(by.css('idea-grid .k-grid-content table tr'));
		}, 8000);
		//expect($('idea-grid .k-grid-content table tr').length).toEqual(1);

	})
})

