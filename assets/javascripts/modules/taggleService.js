function taggleService() {
    'use strict';
    var service = {
        build: function (element, onTagAddCallback, onTagRemoveCallback) {

            if (onTagAddCallback === null) {
                onTagAddCallback = function () {};
            }


            return new Taggle(element, {
                onTagAdd: onTagAddCallback,
                onTagRemove: onTagRemoveCallback
            });
        }
    };

    return {
        'build': service.build
    };
}
