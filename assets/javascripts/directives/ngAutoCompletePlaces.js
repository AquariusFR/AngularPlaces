(function () {
    angular.module("AutoCompletePlaces", [])
        .directive("ngAutoCompletePlaces",
            function () {
                'use strict';
                var options = {
                        componentRestrictions: {
                            country: 'fr'
                        }
                    },
                    model = [],
                    directive = {
                        ctrl: null,
                        elem: null,
                        scope: null,
                        config: null,
                        autocompleteTag: null,
                        minimumPlaceType: null,
                        buildDirective: function (scope, elem, ctrl, minimumPlaceType) {
                            // initialise le modèle sur un tableau vide
                            model = [];
                            ctrl.$setViewValue(model);
                            directive.scope = scope;
                            directive.elem = elem;
                            directive.ctrl = ctrl;
                            directive.updateValidity();
                            directive.minimumPlaceType = minimumPlaceType;
                            directive.config = directive.buildConfig();
                            directive.autocompleteTag = taggleService().build(elem.find('div')[0], null, directive.buildOnTagRemove());

                            placesApi().build(directive.config)
                                .success(directive.buildOnPlacesSuccess())
                                .error(directive.buildOnPlacesError());
                        },
                        buildOnTagRemove: function () {
                            return function (event, tag) {
                                console.log("removing ", tag, event);
                                console.log(model);
                                var removedElements = _(model).remove(function (currentPlace) {
                                    return currentPlace.formatted_address.toLowerCase() === tag.toLowerCase();
                                }).value();
                                console.log(model);
                                placesApi.removeMarker(removedElements[0]);
                                directive.updateValidity(directive.ctrl);
                                directive.scope.$digest();
                            };
                        },
                        buildOnPlacesSuccess: function () {
                            return function (choosenPlace) {
                                if (directive.verifyPlace(choosenPlace)) {
                                    model.push(directive.createLocalisation(choosenPlace));
                                    directive.updateValidity(directive.ctrl);
                                    directive.ctrl.$setViewValue(model);
                                    directive.autocompleteTag.add(choosenPlace.formatted_address);
                                    directive.config.autocomplete.val("");
                                }
                                directive.scope.$digest();
                            };
                        },
                        buildOnPlacesError: function () {
                            return function () {
                                //model.nearBy = choosenPlace;
                                directive.updateValidity(directive.ctrl);
                                directive.ctrl.$setViewValue(model);
                                directive.config.autocomplete.val("");
                                directive.scope.$digest();
                            };
                        },
                        /** Vérifie l'intégrité des données de la localisation choisie */
                        verifyPlace: function (choosenPlace) {
                            return choosenPlace && choosenPlace.place_id;
                        },
                        /** Met à jour la validité de la directive, on considère que la directive est valid si le modèle associé contient au moins une localisation */
                        updateValidity: function () {
                            directive.ctrl.$setValidity('locality', model.length > 0);
                        },
                        buildConfig: function () {
                            return {
                                autocomplete: directive.elem.find("input"),
                                autocompleteElement: directive.elem.find("input")[0],
                                mapElement: directive.elem.find("div")[1],
                                options: options,
                                minimumPlaceType: directive.minimumPlaceType
                            };
                        },
                        createLocalisation: function (place) {
                            return place;
                        }
                    };

                return {
                    restrict: 'E',
                    require: 'ngModel',
                    template: '<input type="text" class="form__text" required="true" placeholder="Veuillez saisir la localisation" places/>' +
                        '<span class="form__text_highlight"></span>' +
                        '<span class="form__text_bar"></span>' +
                        '<label class="form__text_label">Localisation</label>' +
                        '<div id="autocompleteTag" class="form__tags"></div>' +
                        '<div id="map-canvas" class="form_map"></div>',
                    link: function (scope, elem, attrs, ctrl) {
                        directive.buildDirective(scope, elem, ctrl, "locality");
                    }
                };
            });
}());
