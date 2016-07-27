/* tslint:disable:no-unused-variable */
"use strict";
var testing_1 = require('@angular/core/testing');
var app_component_1 = require('./app.component');
testing_1.beforeEachProviders(function () { return [app_component_1.AppComponent]; });
testing_1.describe('App: Starter', function () {
    testing_1.it('should create the app', testing_1.inject([app_component_1.AppComponent], function (app) {
        testing_1.expect(app).toBeTruthy();
    }));
    testing_1.it('should have as title \'app works!\'', testing_1.inject([app_component_1.AppComponent], function (app) {
        testing_1.expect(app.title).toEqual('app works!');
    }));
});
//# sourceMappingURL=app.component.spec.js.map