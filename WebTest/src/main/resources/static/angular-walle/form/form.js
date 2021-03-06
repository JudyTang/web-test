'use strict';

//wl-form
angular.module('angularWalle')
.directive('wlForm', function($compile, ngMessagesInclude) {
	var seq = 0;
    return {
        restrict: 'A',
		terminal : true,
		priority : 1000,
        link: function (scope, element, attrs) {
			element.removeAttr('wl-form');
			element.removeAttr('data-wl-form');
        	element.attr('novalidate', '');
        	if (! attrs.name) {
        		attrs.name = 'form' + seq++;
        		element.attr('name', attrs.name);
        	}
        	element.find('.form-group').each(function(index, formGroup) {
        		formGroup = jQuery(formGroup);
        		var input = formGroup.find('input, select, textarea');
        		if (input.size() > 0) {
        			input.attr('autocomplete', 'off');
        			if (! input.attr('ng-readonly')) {
        				input.attr('ng-readonly', attrs.ngReadonly);
        			}
        			if (! input.attr('ng-disabled')) {
        				input.attr('ng-disabled', attrs.ngDisabled);
        			}
        			if (! input.attr('name')) {
        				input.attr('name', 'input' + seq++);
        			}
        			//show-errors
        			formGroup.attr('show-errors', '')
        			.append('<div ng-messages="' + attrs.name + '.' + input.attr('name') + '.$error">' +
        					'	<div ng-messages-include="' + ngMessagesInclude + '"></div>' +
        					'</div>');
        		}
        	});
        	//submit button to check validation state
        	element.find('button[type=submit]').each(function(index, button) {
        		button = jQuery(button);
        		button.attr('ng-click', attrs.name + '.$valid && ' + button.attr('ng-click'));
        	});
        	//reset button to clear validation state
        	element.find('button[type=reset]').each(function(index, button) {
        		button = jQuery(button);
        		button.attr('type', 'button');
        		button.attr('ng-click', attrs.name + '.$setPristine(); ' + attrs.name + '.$setUntouched(); ' + button.attr('ng-click'));
        	});
			$compile(element)(scope);
        }
    };
})

//Thanks to Ivan Tanev 
//https://ivantanev.com/blog/2014/12/10/angularjs-dos-and-donts/
.directive('showErrors', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        require:  '^form',
        link: function ($scope, $element, attrs, ngFormCtrl) {
            // this timeout is necessary to handle the case when we have
            // ng generated code inside of the show-errors element.

            // usually this can be done by setting the directive to "terminal: true",
            // but we want to allow interpolation of child elements, so we just
            // offset the attachment of the watchers until the browser renders
            // the next frame, by using a $timeout(func, 0, false); The false means
            // "don't trigger a digest cycle", because we don't change any variables
            $timeout(function() {
                // we search for a .form-control whose name attriubte is set
                var childInputName = $element[0].querySelector('.form-control[name]');
                    childInputName = childInputName && childInputName.getAttribute('name');

                if (!childInputName || angular.isUndefined(ngFormCtrl[childInputName])) {
                    // if we cannot find the expected element, throw an error and
                    // halt compilation
                    throw 'showError directive requires that you have a child `.form-control` element with a `name` attribute.';
                }

                // https://docs.angularjs.org/api/ng/type/$rootScope.Scope#$watch
                $scope.$watch(function() {
                    // on scope changes, check if the input's validation status has changed.
                    // additionally, if an input has not been touched or the form has not been
                    // yet submitted, consider the element valid
                    return ngFormCtrl[childInputName].$invalid
                        && (ngFormCtrl[childInputName].$touched || ngFormCtrl[childInputName].$dirty || ngFormCtrl.$submitted);
                }, function(is_invalid) {
                    $element.toggleClass('has-error', is_invalid);
                });
            }, 0, false);
        },
    };
}]);
