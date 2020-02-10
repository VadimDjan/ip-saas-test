describe('Idea Platform list page', function() {

	var rowsOnRedirectedEntity = 100;
	protractor.helpers.login.loginToPage(null, protractor.helpers.login.userName, protractor.helpers.login.password);
	// protractor.helpers.login.loginToPage(null, 'demo', 'demo');

	it('Login should redirect on entity with menu-component', function() {
		// console.log('Login test started');
		// var el = element(by.css('menu-component[class="ng-scope ng-isolate-scope"] a[data-menu-name="Пользователи"]'));
		// expect(el.getText()).toBe('Пользователи');

		expect(protractor.helpers.grid.main.rowsList().count()).toBe(rowsOnRedirectedEntity);
	})
})