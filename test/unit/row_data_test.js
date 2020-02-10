
describe('CRUD Data test', function() {
	beforeEach(module('ideaPlatformApp'));
	
	beforeEach(function() {
		this.addMatchers({
			toEqualData : function(expected) {
				return angular.equals(this.actual, expected);
			}
		});
	});
	
	var $httpBackend = {};
	beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
		$httpBackend = _$httpBackend_;

		scope = $rootScope.$new();
	}));
	
	
	afterEach(function() {
		$httpBackend.resetExpectations();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});
	
	

	it('should return normal row for entity TestTable, row = 24 in update mode',
	           inject(function(RowData, FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource) {
	        	   	$httpBackend.expectGET('json/fields/12').respond(resource_fields_12);
					$httpBackend.expectGET('json/forms/12').respond(resource_forms_12);
					$httpBackend.expectGET('json/entities/12/rows/24').respond(resource_entities_12_rows_24);
					$httpBackend.expectGET('json/fields/14').respond(resource_fields_14);
					$httpBackend.expectGET('json/forms/14').respond(resource_forms_14);
					$httpBackend.expectGET('json/entities/14').respond(resource_entities_14);
					$httpBackend.expectGET('json/entities/12/rows/24/linkedfields/175').respond(resource_entities_12_rows_24_linkedfields_175);
					RowData.getForm(12, 24, 'update').then(function(response){
						expect(angular.fromJson(angular.toJson(response)))
							.toEqualData(angular.fromJson(angular.toJson(entity_12_row_24_update)));
				
					});
					
					$httpBackend.flush();
	        }));	
	
	it('should not allow add linked row for entity TestTable, row = 24 in update mode',
	           inject(function(RowData, FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource) {
	        	   	var resource_fields_12_$1 = resource_fields_12;
	        	   	resource_fields_12_$1.gadgets.patternType = "vjReadOnly";
	        	   	var entity_12_row_24_update_$1 = entity_12_row_24_update;
	        	   	entity_12_row_24_update_$1.form["2"].fieldList[0][0].patternType = "vjReadOnly";
	        	   	$httpBackend.expectGET('json/fields/12').respond(resource_fields_12_$1);
					$httpBackend.expectGET('json/forms/12').respond(resource_forms_12);
					$httpBackend.expectGET('json/entities/12/rows/24').respond(resource_entities_12_rows_24);
					$httpBackend.expectGET('json/fields/14').respond(resource_fields_14);
					$httpBackend.expectGET('json/forms/14').respond(resource_forms_14);
					$httpBackend.expectGET('json/entities/14').respond(resource_entities_14);
					$httpBackend.expectGET('json/entities/12/rows/24/linkedfields/175').respond(resource_entities_12_rows_24_linkedfields_175);
					
					RowData.getForm(12, 24, 'update').then(function(response){
						expect(angular.fromJson(angular.toJson(response)))
							.toEqualData(angular.fromJson(angular.toJson(entity_12_row_24_update_$1)));
				
					});
					
					$httpBackend.flush();
	        }));	
	
	it('should return normal row for entity TestTable, row = 24 in view mode',
	           inject(function(RowData, FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource) {
	        	   	$httpBackend.expectGET('json/fields/12').respond(resource_fields_12);
					$httpBackend.expectGET('json/forms/12').respond(resource_forms_12);
					$httpBackend.expectGET('json/entities/12/rows/24').respond(resource_entities_12_rows_24);
					$httpBackend.expectGET('json/fields/14').respond(resource_fields_14);
					$httpBackend.expectGET('json/forms/14').respond(resource_forms_14);
					$httpBackend.expectGET('json/entities/14').respond(resource_entities_14);
					$httpBackend.expectGET('json/entities/12/rows/24/linkedfields/175').respond(resource_entities_12_rows_24_linkedfields_175);
					RowData.getForm(12, 24, 'view').then(function(response){
						expect(angular.fromJson(angular.toJson(response)))
							.toEqualData(angular.fromJson(angular.toJson(entity_12_row_24_view)));
				
					});
					
					$httpBackend.flush();
	        }));	   
	        
	
	it('should return normal row for entity TestTable, row = 24 in create mode',
	           inject(function(RowData, FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource) {
	        	   	$httpBackend.expectGET('json/fields/12').respond(resource_fields_12);
					$httpBackend.expectGET('json/forms/12').respond(resource_forms_12);
					RowData.getForm(12, 24, 'create').then(function(response){
						expect(angular.fromJson(angular.toJson(response)))
							.toEqualData(angular.fromJson(angular.toJson(entity_12_row_create)));
					});
					
					$httpBackend.flush();
	        }));
	
	it('should return same row for entity TestTable, any row in create mode',
	           inject(function(RowData, FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource) {
	        	   	$httpBackend.expectGET('json/fields/12').respond(resource_fields_12);
					$httpBackend.expectGET('json/forms/12').respond(resource_forms_12);
					RowData.getForm(12, -2, 'create').then(function(response){
						expect(angular.fromJson(angular.toJson(response)))
							.toEqualData(angular.fromJson(angular.toJson(entity_12_row_create)));
					});
					
					$httpBackend.flush();
	        }));
});
