describe('Idea Platform list page', function() {

	var EntitiesBeforeTest;
	var urlBase = protractor.helpers.url + '#/';
	var EntityTableId = 1;
	var $h = protractor.helpers;

	it('Should open standart menu create -> project', function() {
		$h.login.loginToPage();
		$h.menu.selectInMenu(['Создать', 'Проект']);
		browser.waitForAngular().then(function(){
			expect(element(by.css('[data-entity-id="SD_PROJECT"]')).isPresent()).toBe(true)
		})
	});
})