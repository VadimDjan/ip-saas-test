var resource_fields_12 = {
	"gadgets" : {
		"isActive" : true,
		"subEntityId" : 14,
		"isVisible" : true,
		"pattern" : "",
		"patternType" : "vjAddOne",
		"isRequired" : false,
		"entityFieldId" : 175,
		"isReadOnly" : false,
		"label" : "Gadgets",
		"type" : "subgrid",
		"isPkField" : false
	},
	"email" : {
		"isActive" : true,
		"isVisible" : true,
		"isRequired" : false,
		"entityFieldId" : 157,
		"isReadOnly" : false,
		"label" : "Email",
		"type" : "email",
		"isPkField" : false
	},
	"javaCode" : {
		"isActive" : true,
		"isVisible" : true,
		"isRequired" : false,
		"entityFieldId" : 156,
		"isReadOnly" : false,
		"label" : "Java Code",
		"type" : "textarea",
		"isPkField" : false
	},
	"name" : {
		"isActive" : true,
		"isVisible" : true,
		"pattern" : "^\\w+\\s\\w+$",
		"patternType" : "regexp",
		"isRequired" : true,
		"entityFieldId" : 154,
		"isReadOnly" : false,
		"label" : "Name",
		"type" : "text",
		"isPkField" : false
	},
	"date" : {
		"isActive" : true,
		"isVisible" : true,
		"isRequired" : false,
		"entityFieldId" : 155,
		"isReadOnly" : false,
		"label" : "Date",
		"type" : "datetime",
		"isPkField" : false
	},
	"testTableId" : {
		"isActive" : true,
		"isVisible" : true,
		"isRequired" : false,
		"entityFieldId" : 153,
		"isReadOnly" : false,
		"label" : "Test Table Id",
		"type" : "number",
		"isPkField" : true
	},
	"isAlive" : {
		"isActive" : true,
		"isVisible" : true,
		"isRequired" : false,
		"entityFieldId" : 159,
		"isReadOnly" : false,
		"label" : "Is Alive",
		"type" : "checkbox",
		"isPkField" : false
	},
	"url" : {
		"isActive" : true,
		"isVisible" : true,
		"isRequired" : false,
		"entityFieldId" : 158,
		"isReadOnly" : false,
		"label" : "Url",
		"type" : "url",
		"isPkField" : false
	}
};

var resource_forms_12 = [
		{
			"formId" : 6,
			"entityTypeId" : 12,
			"formType" : "DETAILS_STYLE",
			"formName" : "TestTable.details_style.default",
			"definition" : {
				"style" : "input{ font-style: italic;}"
			}
		},
		{
			"formId" : 7,
			"entityTypeId" : 12,
			"formType" : "DETAILS_DATA",
			"formName" : "TestTable.details_data.default",
			"definition" : {
				"form" : "{\"title\": \"Test table\",\"subtitle\": \"name\", \"sectionList\":[{\"sectionOrder\":1,\"sectionName\":\"Real Fields\",\"fieldList\":{\"testTableId\":{\"order\":{\"row\":1,\"col1\":1,\"col2\":2}},\"name\":{\"order\":{\"row\":1,\"col1\":3,\"col2\":3}},\"isAlive\":{\"order\":{\"row\":1,\"col1\":4,\"col2\":4}},\"email\":{\"order\":{\"row\":2,\"col1\":1,\"col2\":2}},\"url\":{\"order\":{\"row\":2,\"col1\":3,\"col2\":4}},\"date\":{\"order\":{\"row\":3,\"col1\":1,\"col2\":2}},\"javaCode\":{\"order\":{\"row\":4,\"col1\":1,\"col2\":3}}}},{\"sectionOrder\":2,\"sectionName\":\"Virtual Fields\",\"fieldList\":{\"gadgets\":{\"order\":{\"row\":1,\"col1\":1,\"col2\":3}}}}]}"
			}
		},
		{
			"formId" : 8,
			"entityTypeId" : 12,
			"formType" : "LIST_STYLE",
			"formName" : "TestTable.list_style.default",
			"definition" : {
				"style" : " .col4{font-style: italic;} "
			}
		},
		{
			"formId" : 9,
			"entityTypeId" : 12,
			"formType" : "LIST_DATA",
			"formName" : "TestTable.list_data.default",
			"definition" : {
				"form" : "{\"testTableId\":{\"order\":1, \"width\":\"25%\"},\"name\":{\"order\":2},\"isAlive\":{\"order\":3},\"email\":{\"order\":5},\"url\":{\"order\":6},\"date\":{\"order\":7},\"javaCode\":{\"order\":8}}"
			}
		} ];

var resource_entities_12_rows = [ {
	"javaCode" : "System.out.println(HelloWorld);",
	"email" : "follet.victor@gmail.com",
	"name" : "Victor Follet",
	"date" : "1986-11-04T19:45:00.000",
	"_$_isReadOnly" : true,
	"testTableId" : 24,
	"isAlive" : true,
	"url" : "http://itbidea.ru"
}, {
	"javaCode" : "System.out.println(HelloWorld);",
	"email" : "timur@itbidea.ru",
	"name" : "Timur S.",
	"date" : "1986-12-02T19:45:00.000",
	"_$_isReadOnly" : true,
	"testTableId" : 26,
	"isAlive" : true,
	"url" : "http://itbidea.ru"
}, {
	"javaCode" : "System.out.println(HelloWorld);",
	"email" : "vadim@itbidea.ru",
	"name" : "Vadim",
	"date" : "1986-12-01T19:45:00.000",
	"_$_isReadOnly" : true,
	"testTableId" : 28,
	"isAlive" : true,
	"url" : "http://itbidea.ru"
} ];

var resource_entities_12_rows_search_name_vict = [ {
	"javaCode" : "System.out.println(HelloWorld);",
	"email" : "follet.victor@gmail.com",
	"name" : "Victor Follet",
	"date" : "1986-11-04T19:45:00.000",
	"_$_isReadOnly" : true,
	"testTableId" : 24,
	"isAlive" : true,
	"url" : "http://itbidea.ru"
} ];

var resource_entities_12_rows_24 = {
	"gadgets" : null,
	"email" : "follet.victor@gmail.com",
	"javaCode" : "System.out.println(HelloWorld);",
	"name" : "Victor Follet",
	"date" : "1986-11-04 19:45:00.0",
	"_$_isReadOnly" : false,
	"testTableId" : 24,
	"isAlive" : true,
	"url" : "http://itbidea.ru"
};

var resource_entities_12 = {
	"entityTypeName" : "TestTable",
	"entityTypeId" : 12,
	"pkFieldName" : "testTableId"
};

var resource_fields_14 = {
	"fk" : {
		"isActive" : true,
		"isVisible" : true,
		"isRequired" : false,
		"entityFieldId" : 174,
		"isReadOnly" : false,
		"label" : "Fk",
		"type" : "number",
		"isPkField" : false
	},
	"name" : {
		"isActive" : true,
		"isVisible" : true,
		"isRequired" : false,
		"entityFieldId" : 173,
		"isReadOnly" : false,
		"label" : "Name",
		"type" : "text",
		"isPkField" : false
	},
	"testListId" : {
		"isActive" : true,
		"isVisible" : true,
		"isRequired" : false,
		"entityFieldId" : 172,
		"isReadOnly" : false,
		"label" : "Test List Id",
		"type" : "number",
		"isPkField" : true
	}
};

var resource_forms_14 = [
		{
			"formId" : 10,
			"entityTypeId" : 14,
			"formType" : "LIST_STYLE",
			"formName" : "TestList.list_style.default",
			"definition" : {
				"style" : " .col1{font-style: italic;} "
			}
		},
		{
			"formId" : 11,
			"entityTypeId" : 14,
			"formType" : "LIST_DATA",
			"formName" : "TestList.list_data.default",
			"definition" : {
				"form" : "{\"testListId\":{\"order\":1},\"name\":{\"order\":2}}",
			}
		},
		{
			"formId" : 12,
			"entityTypeId" : 14,
			"formType" : "DETAILS_DATA",
			"formName" : "TestList.details_data.default",
			"definition" : {
				"form" : "{\"title\": \"Test list\",\"subtitle\": \"name\", \"fieldList\": {\"testListId\":{\"order\":{\"row\":1,\"col1\":1,\"col2\":1}},\"name\":{\"order\":{\"row\":1,\"col1\":2,\"col2\":3}},\"fk\":{\"order\":{\"row\":1,\"col1\":4,\"col2\":4}}}} ",
			}
		},
		{
			"formId" : 13,
			"entityTypeId" : 14,
			"formType" : "DETAILS_STYLE",
			"formName" : "TestList.details_style.default",
			"definition" : {
				"style" : ""
			}
		},
		{
			"formId" : 124,
			"entityTypeId" : 14,
			"formType" : "SEARCH_DETAILS_DATA",
			"formName" : "TestList.SEARCH_DETAILS_DATA.default",
			"definition" : {
				"form" : "[{\"sectionOrder\": 1,\"sectionName\": \"Поиск\",\"fieldList\":  {\"testListId\": {\"order\": {\"row\": 1,\"col1\": 1,\"col2\": 2}},\"name\": {\"order\": {\"row\": 1,\"col1\": 3,\"col2\": 4}},\"fk\": {\"order\": {\"row\": 2,\"col1\": 1,\"col2\": 2}}}}]",
			}
		}, {
			"formId" : 125,
			"entityTypeId" : 14,
			"formType" : "SEARCH_DETAILS_STYLE",
			"formName" : "TestList.SEARCH_DETAILS_STYLE.default",
			"definition" : {
				"style" : "input{ font-style: italic;}"
			}
		} ];

var resource_entities_12_rows_24_linkedfields_175 = [ {
	"fk" : 24,
	"name" : "Nexus 4",
	"_$_isReadOnly" : false,
	"testListId" : 1
}, {
	"fk" : 24,
	"name" : "RMD-1030",
	"_$_isReadOnly" : false,
	"testListId" : 2
} ];

var resource_entities_14 = {
	"entityTypeName" : "TestList",
	"entityTypeId" : 14,
	"pkFieldName" : "testListId"
};

var grid_data = {
	"entityType" : {
		"name" : "TestTable",
		"id" : 12,
		"pkFieldName" : "testTableId"
	},
	"gridData" : [ {
		"javaCode" : "System.out.println(HelloWorld);",
		"email" : "follet.victor@gmail.com",
		"name" : "Victor Follet",
		"date" : "1986-11-04T19:45:00.000",
		"_$_isReadOnly" : true,
		"testTableId" : 24,
		"isAlive" : true,
		"url" : "http://itbidea.ru"
	}, {
		"javaCode" : "System.out.println(HelloWorld);",
		"email" : "timur@itbidea.ru",
		"name" : "Timur S.",
		"date" : "1986-12-02T19:45:00.000",
		"_$_isReadOnly" : true,
		"testTableId" : 26,
		"isAlive" : true,
		"url" : "http://itbidea.ru"
	}, {
		"javaCode" : "System.out.println(HelloWorld);",
		"email" : "vadim@itbidea.ru",
		"name" : "Vadim",
		"date" : "1986-12-01T19:45:00.000",
		"_$_isReadOnly" : true,
		"testTableId" : 28,
		"isAlive" : true,
		"url" : "http://itbidea.ru"
	} ],
	"gridColumnDefs" : [
			{
				"field" : "testTableId",
				"displayName" : "Test Table Id",
				"width" : "25%",
				"cellTemplate" : "<div class=\"ngCellText colt{{$index}}\" ng-dblclick=\"editRow(row)\" class=\"ngCellText\">{{row.getProperty(col.field)}}</div>"
			},
			{
				"field" : "name",
				"displayName" : "Name",
				"width" : "14%",
				"cellTemplate" : "<div class=\"ngCellText colt{{$index}}\" ng-dblclick=\"editRow(row)\" class=\"ngCellText\">{{row.getProperty(col.field)}}</div>"
			},
			{
				"field" : "isAlive",
				"displayName" : "Is Alive",
				"width" : "14%",
				"cellTemplate" : "<div class=\"ngCellText colt{{$index}}\" ng-dblclick=\"editRow(row)\" class=\"ngCellText\">{{row.getProperty(col.field)}}</div>"
			},
			{
				"field" : "email",
				"displayName" : "Email",
				"width" : "14%",
				"cellTemplate" : "<div class=\"ngCellText colt{{$index}}\" ng-dblclick=\"editRow(row)\" class=\"ngCellText\">{{row.getProperty(col.field)}}</div>"
			},
			{
				"field" : "url",
				"displayName" : "Url",
				"width" : "14%",
				"cellTemplate" : "<div class=\"ngCellText colt{{$index}}\" ng-dblclick=\"editRow(row)\" class=\"ngCellText\">{{row.getProperty(col.field)}}</div>"
			},
			{
				"field" : "date",
				"displayName" : "Date",
				"width" : "14%",
				"cellTemplate" : "<div class=\"ngCellText colt{{$index}}\" ng-dblclick=\"editRow(row)\" class=\"ngCellText\">{{row.getProperty(col.field)}}</div>"
			},
			{
				"field" : "javaCode",
				"displayName" : "Java Code",
				"width" : "14%",
				"cellTemplate" : "<div class=\"ngCellText colt{{$index}}\" ng-dblclick=\"editRow(row)\" class=\"ngCellText\">{{row.getProperty(col.field)}}</div>"
			} ]
};

var grid_search_data = {

	"gridData" : [ {
		"javaCode" : "System.out.println(HelloWorld);",
		"email" : "follet.victor@gmail.com",
		"name" : "Victor Follet",
		"date" : "1986-11-04T19:45:00.000",
		"_$_isReadOnly" : true,
		"testTableId" : 24,
		"isAlive" : true,
		"url" : "http://itbidea.ru"
	} ],
};

var linked_grid_data = {
	"entityType" : {
		"name" : "TestList",
		"id" : 14,
		"pkFieldName" : "testListId"
	},
	"gridData" : [ {
		"fk" : 24,
		"name" : "Nexus 4",
		"_$_isReadOnly" : false,
		"testListId" : 1
	}, {
		"fk" : 24,
		"name" : "RMD-1030",
		"_$_isReadOnly" : false,
		"testListId" : 2
	} ],
	"gridColumnDefs" : [
			{
				"field" : "testListId",
				"displayName" : "Test List Id",
				"width" : "50%",
				"cellTemplate" : "<row-link entityTypeId=14 pkFieldName=\"testListId\" mode = \"update\"></row-link>"
			},
			{
				"field" : "name",
				"displayName" : "Name",
				"width" : "50%",
				"cellTemplate" : "<row-link entityTypeId=14 pkFieldName=\"testListId\" mode = \"update\"></row-link>"
			} ]
};

var entity_12_row_24_update = {
	"title":"Test table: Victor Follet",
	"form" : {
		"1" : {
			"sectionOrder" : 1,
			"fieldList" : [ [ {
				"widget" : "input",
				"value" : 24,
				"label" : "testTableId",
				"display_name" : "Test Table Id",
				"exists" : true,
				"editable" : false,
				"required" : false,
				"inputType" : "number",
				"min" : 5e-324,
				"max" : 1.7976931348623157e+308,
				"span_offset" : "span6"
			}, {
				"widget" : "input_pattern",
				"value" : "Victor Follet",
				"label" : "name",
				"display_name" : "Name",
				"exists" : true,
				"editable" : true,
				"required" : true,
				"inputType" : "text",
				"pattern" : {},
				"span_offset" : "span3"
			}, {
				"widget" : "checkbox",
				"value" : true,
				"label" : "isAlive",
				"display_name" : "Is Alive",
				"exists" : true,
				"editable" : true,
				"required" : false,
				"span_offset" : "span3"
			} ], [ {
				"widget" : "input",
				"value" : "follet.victor@gmail.com",
				"label" : "email",
				"display_name" : "Email",
				"exists" : true,
				"editable" : true,
				"required" : false,
				"inputType" : "email",
				"span_offset" : "span6"
			}, {
				"widget" : "input",
				"value" : "http://itbidea.ru",
				"label" : "url",
				"display_name" : "Url",
				"exists" : true,
				"editable" : true,
				"required" : false,
				"inputType" : "url",
				"span_offset" : "span6"
			} ], [ {
				"widget" : "date",
				"value" : "1986-11-04 19:45:00.0",
				"label" : "date",
				"display_name" : "Date",
				"exists" : true,
				"editable" : true,
				"required" : false,
				"span_offset" : "span6"
			} ], [ {
				"widget" : "textarea",
				"value" : "System.out.println(HelloWorld);",
				"label" : "javaCode",
				"display_name" : "Java Code",
				"exists" : true,
				"editable" : true,
				"required" : false,
				"textarea" : {
					"rows" : 8
				},
				"span_offset" : "span9"
			} ] ],
			"sectionName" : "Real Fields"
		},
		"2" : {
			"sectionOrder" : 2,
			"fieldList" : [ [ {
				"widget" : "subgrid",
				"value" : null,
				"label" : "gadgets",
				"display_name" : "Gadgets",
				"patternType" : "vjAddOne",
				"exists" : true,
				"editable" : true,
				"required" : false,
				"gridOptions" : {
					"data" : "element.subgrids_data",
					"enableColumnResize" : true,
					"enableColumnReordering" : true,
					"columnDefs" : "element.subgrids_header"
				},
				"span_offset" : "span9"
			} ] ],
			"sectionName" : "Virtual Fields"
		}
	},
	"mode" : "update"
};

var entity_12_row_24_view = {
	"title":"Test table: Victor Follet",
	"form" : entity_12_row_24_update.form,
	"mode" : "view"
};

var entity_12_row_create = {
	"title":"Test table: ",
	"form" : {
		"1" : {
			"sectionOrder" : 1,
			"fieldList" : [[{
						"widget" : "input",
						"label" : "testTableId",
						"display_name" : "Test Table Id",
						"exists" : true,
						"editable" : false,
						"required" : false,
						"inputType" : "number",
						"min" : 5e-324,
						"max" : 1.7976931348623157e+308,
						"span_offset" : "span6"
					}, {
						"widget" : "input_pattern",
						"label" : "name",
						"display_name" : "Name",
						"exists" : true,
						"editable" : true,
						"required" : true,
						"inputType" : "text",
						"pattern" : {},
						"span_offset" : "span3"
					}, {
						"widget" : "checkbox",
						"label" : "isAlive",
						"display_name" : "Is Alive",
						"exists" : true,
						"editable" : true,
						"required" : false,
						"span_offset" : "span3"
					}
				], [{
						"widget" : "input",
						"label" : "email",
						"display_name" : "Email",
						"exists" : true,
						"editable" : true,
						"required" : false,
						"inputType" : "email",
						"span_offset" : "span6"
					}, {
						"widget" : "input",
						"label" : "url",
						"display_name" : "Url",
						"exists" : true,
						"editable" : true,
						"required" : false,
						"inputType" : "url",
						"span_offset" : "span6"
					}
				], [{
						"widget" : "date",
						"label" : "date",
						"display_name" : "Date",
						"exists" : true,
						"editable" : true,
						"required" : false,
						"span_offset" : "span6"
					}
				], [{
						"widget" : "textarea",
						"label" : "javaCode",
						"display_name" : "Java Code",
						"exists" : true,
						"editable" : true,
						"required" : false,
						"textarea" : {
							"rows" : 8
						},
						"span_offset" : "span9"
					}
				]],
			"sectionName" : "Real Fields"
		}
	},
	"mode" : "create"
};

