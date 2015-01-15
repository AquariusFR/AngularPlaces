define(['lodash'
    ],
    function (_) {
        'use strict';

        var api = {
            markers: [],
            // supprime de la map le marqueur identifié par l'id de localisation
            removeMarker: function (place) {
                _(api.markers)
                    .filter({
                        'place_id': place.place_id
                    })
                    .forEach(function (marker) {
                        marker.setMap(null);
                    });
                _(api.markers).remove({
                    'place_id': place.place_id
                });
                api.fitMap();
            },
            successCallback: {},
            errorCallback: {},
            // promesse de l'api
            promise: {
                success: function (_successCallback) {
                    api.successCallback = _successCallback;
                    return api.promise;
                },
                error: function (_errorCallback) {
                    api.errorCallback = _errorCallback;
                    return api.promise;
                }
            },
            build: function (config) {

                /*
                api.autocomplete = new google.maps.places.Autocomplete(config.autocompleteElement, config.options);
                api.map = new google.maps.Map(config.mapElement, api.myOptions);
                api.placesService = new google.maps.places.PlacesService(api.map);
                google.maps.event.addListener(api.autocomplete, 'place_changed', api.placeChangedCallback);
                */
                console.log("toto");
                return api.promise;
            },
            fakePlaceChoosen: function (place) {
                api.successCallback(place);
            },
            fakeError: function (place) {
                api.errorCallback(place);
            }
        };
        return {
            'build': api.build,
            'removeMarker': api.removeMarker,
            'fakePlaceChoosen': api.fakePlaceChoosen,
            'fakeError': api.fakeError,
            'api' : api
        };
    }
);
