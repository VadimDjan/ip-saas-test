describe('GridData test', function() {
	beforeEach(module('ideaPlatformApp'));
	
	var $httpBackend, $rootScope;
	 
    beforeEach(inject(function($injector) {
      // Set up the mock http service responses
      $httpBackend = $injector.get('$httpBackend');
      // backend definition common for all tests

      // Get hold of a scope (i.e. the root scope)
      $rootScope = $injector.get('$rootScope');
      
      // The $controller service is used to create instances of controllers
      //var $controller = $injector.get('$controller');

    }));
	
	beforeEach(function() {
		this.addMatchers({
			toEqualData : function(expected) {
				return angular.equals(this.actual, expected);
			}
		});
	});
	
	afterEach(function() {
		$httpBackend.resetExpectations();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should contain a FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource',
	           inject(function(FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource) {
					$httpBackend.expectGET('json/fields/12').respond(resource_fields_12);
					$httpBackend.expectGET('json/forms/12').respond(resource_forms_12);
					$httpBackend.expectGET('json/entities/12/rows').respond(resource_entities_12_rows);
					$httpBackend.expectGET('json/entities/12').respond(resource_entities_12);
					$httpBackend.expectGET('json/entities/12/rows/24/linkedfields/175').respond(resource_entities_12_rows_24_linkedfields_175);
					FieldsResource.get({entityTypeId: 12,}).$promise.then(function(response){
					   expect(response).toEqualData(resource_fields_12);		        		
					});
					FormsResource.query({entityTypeId: 12,}).$promise.then(function(response){
					   expect(response).toEqualData(resource_forms_12);		        		
					});
					EntityDataResource.query({entityTypeId: 12,}).$promise.then(function(response){
					   expect(response).toEqualData(resource_entities_12_rows);		        		
					});
					EntityListResource.get({entityTypeId: 12,}).$promise.then(function(response){
					   expect(response).toEqualData(resource_entities_12);		        		
					});
					EntityLinkedDataResource.query({entityTypeId: 12, rowId:24, linkedfieldId: 175}).$promise.then(function(response){
					   expect(response).toEqualData(resource_entities_12_rows_24_linkedfields_175);		        		
					});
					$httpBackend.flush();
	        }));
	
	it('should return normal grid headers for entity TestTable',
	           inject(function(GridData, FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource) {
					$httpBackend.expectGET('json/fields/12').respond(resource_fields_12);
					$httpBackend.expectGET('json/forms/12').respond(resource_forms_12);
					$httpBackend.expectGET('json/entities/12').respond(resource_entities_12);
					$httpBackend.expectGET('json/entities/12/rows').respond(resource_entities_12_rows);
					GridData.forRouteParams({entityTypeId:12}).then(function(response){
						expect(angular.fromJson(angular.toJson(response.entityType)))
							.toEqualData(angular.fromJson(angular.toJson(grid_data.entityType)));
					
						expect(angular.fromJson(angular.toJson(response.gridData)))
							.toEqualData(angular.fromJson(angular.toJson(grid_data.gridData)));
						
						expect(angular.fromJson(angular.toJson(response.gridColumnDefs)))
							.toEqualData(angular.fromJson(angular.toJson(grid_data.gridColumnDefs)));
					});
					
					$httpBackend.flush();
	        }));	
	
	it('should return normal grid headers for search in entity TestTable',
	           inject(function(GridData, FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource) {
					$httpBackend.expectGET('json/fields/12').respond(resource_fields_12);
					$httpBackend.expectGET('json/forms/12').respond(resource_forms_12);
					$httpBackend.expectGET('json/entities/12').respond(resource_entities_12);
					$httpBackend.expectGET('json/entities/12/rows/search/%7B%22name%22:%22vict%22%7D').respond(resource_entities_12_rows_search_name_vict);
					GridData.forRouteParams({entityTypeId:12, searchString:'{"name":"vict"}'}).then(function(response){
						expect(angular.fromJson(angular.toJson(response.entityType)))
							.toEqualData(angular.fromJson(angular.toJson(grid_data.entityType)));
						
						expect(angular.fromJson(angular.toJson(response.gridData)))
							.toEqualData(angular.fromJson(angular.toJson(grid_search_data.gridData)));	
						
						expect(angular.fromJson(angular.toJson(response.gridColumnDefs)))
							.toEqualData(angular.fromJson(angular.toJson(grid_data.gridColumnDefs)));
					});
					
					$httpBackend.flush();
	        }));	
	
	it('should return normal grid headers for linked entity TestList',
	 	           inject(function(GridData, FieldsResource, FormsResource, EntityDataResource, EntityListResource, EntityLinkedDataResource) {
						$httpBackend.expectGET('json/fields/14').respond(resource_fields_14);
						$httpBackend.expectGET('json/forms/14').respond(resource_forms_14);
						$httpBackend.expectGET('json/entities/14').respond(resource_entities_14);
						$httpBackend.expectGET('json/entities/12/rows/24/linkedfields/175').respond(resource_entities_12_rows_24_linkedfields_175);						
						GridData.forLinkedRow({entityTypeId:12, rowId: 24, linkedfieldId: 175, subEntityId: 14}).then(function(response){
							expect(angular.fromJson(angular.toJson(response)))
								.toEqualData(angular.fromJson(angular.toJson(linked_grid_data)));			
						});
						
						$httpBackend.flush();
		        }));
		        
});
