describe('Idea Platform import data test', function() {
	var urlBase = protractor.helpers.url + '#/entity/';
	var importEntityId = 324;
	var indexEntityId = 316;
	var $h = protractor.helpers;
	$h.login.loginToPage(null, 'timur', '123456');
	
	it('Should create new index', function() {
		return browser.get(urlBase + indexEntityId)
		.then(function(){			
			return $h.grid.main.upsert('DISPLAYNAME', 'IndexForTestTable1');
		})
		.then(function(){			
			return $h.form.setForm({			
				ENTITYTYPEID: 'TEST_TABLE_1',
				DISPLAYNAME: 'IndexForTestTable1',
				ISRECONSILIATIONUNIQUECONSTRAINT: true,
				CONSTRAINTTYPE: 2
			});
		})
		.then(function(){
			return $h.form.processButton(['CREATE', 'UPDATE']);
		})
		.then(function(){
			return $h.form.setForm({			
				FIELDLISTVJ: {
					///$action: 'ADDROW',
					$unique: 'FIELDNAME',
					values: [{
						FIELDNAME: 2,
						SORTORDER: 1
					}]
				}
			});
		})
		.then(function(){
			browser.waitForAngular();
			expect($h.grid.subgrid('FIELDLISTVJ').getTotalRows()).toBe(1);
			return 
		})
		.then(function(){
			return $h.form.processButton('BACK');
		})
	})
	
	/*
	$h.grid.main.getTotalRows()
	.then(function(count){
		EntitiesBeforeTest = count;
	})
	.then(function(){
		return $h.grid.main.upsert('SHORTNAME', 'TestTable1Import');
	})*/
})