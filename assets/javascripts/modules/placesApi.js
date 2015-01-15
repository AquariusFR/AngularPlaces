function placesApi() {
    'use strict';

    var api = {
        myOptions: {
            // correspond aux coorcodées de Paris, France
            center: new google.maps.LatLng(46.227638, 2.213749),
            zoom: 5,
            disableDefaultUI: true
        },
        minimumPlaceType: 'locality',
        autocomplete: null,
        map: null,
        markers: [],
        invalidMarker: null,
        placesService: null,
        // permet d'adapter le zoom et le positionnement de la map afin d'afficher l'ensemble des marqueurs du tableau.
        fitMapToMarkers: function (markerArray) {
            var bounds = new google.maps.LatLngBounds();

            _(markerArray).forEach(function (marker) {
                bounds.extend(marker.getPosition());
            });

            api.map.fitBounds(bounds);
        },
        // supprime le marqueur invalide
        removeInvalidMarker: function () {
            if (api.invalidMarker) {
                api.invalidMarker.infowindow.close(api.map, api.invalidMarker);
                api.invalidMarker.setMap(null);
            }
        },
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
        // positionne le marker correspondant à la localisation sur la map
        buildMarker: function (location, title, color) {
            return new google.maps.Marker({
                position: location,
                map: api.map,
                animation: google.maps.Animation.DROP,
                title: title
                /*,
                    icon: '/assets/img/icon/' + color + '.png'*/
            });
        },
        // positionne le marker correspondant à la localisation sur la map
        buildPlaceMarker: function (place) {
            var marker = api.buildMarker(place.geometry.location, place.formatted_address, "green");

            marker.place_id = place.place_id;
            marker.place = place;
            return marker;
        },
        fitMap: function () {
            if (api.markers.length < 1) {
                api.resetMap();
            } else if (api.markers.length === 1) {
                api.setMapTo(api.markers[0].place);
            } else {
                api.fitMapToMarkers(api.markers);
            }
        },
        // comportement lorqu'un changement de localisation est effectué.
        placeChangedCallback: function () {
            var place = api.autocomplete.getPlace();

            // suppression d'un eventuel marqueur d'erreur.
            api.removeInvalidMarker();

            if (!place || !place.geometry) {
                api.resetMap();
                api.successCallback(null);
                return;
            }

            // check si la localisation est valide
            if (api.isPlaceContainsLocality(place)) {
                // si valide, appel du callback de succès
                api.successCallback(place);

                // positionnement le marker correspondant sur la map
                api.markers.push(api.buildPlaceMarker(place));

                // repositionnement de la map
                api.fitMap();
            } else {
                // sinon, proposition du resultat valide le plus proche
                api.findNearBy(place, api.findNearCallback);
            }
        },
        // effectue une recherche de proximité par rapport à la localisation donnée
        findNearBy: function (place, callback) {
            var autocompleteSearch = {
                location: place.geometry.location,
                rankBy: google.maps.places.RankBy.DISTANCE,
                types: ['store', 'atm', 'parking', 'cafe', 'restaurant']
            };
            api.placesService.nearbySearch(autocompleteSearch, callback);
        },
        // propose le resultat valide le plus proche
        findNearCallback: function (results) {
            var place = api.autocomplete.getPlace();
            console.log("places near to ", place, results);
            var nearByPlaceVicinity = "";

            if (results.length > 0) {
                var splittedVicinity = results[0].vicinity.split(",");

                nearByPlaceVicinity = splittedVicinity[0] + ", " + splittedVicinity[splittedVicinity.length - 1];
            }
            api.errorCallback(nearByPlaceVicinity);

            var infowindow = new google.maps.InfoWindow({
                content: '<div class="googlemap__infowindows">' +
                    '<h1 class="infowindows__title">Localisation invalide</h1>' +
                    '<div class="infowindows__text">Adresse correcte la plus proche : ' + nearByPlaceVicinity + '</div>' +
                    '</div>'
            });
            api.invalidMarker = api.buildMarker(place.geometry.location, place.formatted_address, "red");
            api.invalidMarker.infowindow = infowindow;
            infowindow.open(api.map, api.invalidMarker);
            google.maps.event.addListener(api.invalidMarker, 'click', function () {
                api.removeInvalidMarker();
            });

            var temp = api.markers.concat([]);
            temp.push(api.invalidMarker);
            api.fitMapToMarkers(temp);
        },
        build: function (config) {

            api.autocomplete = new google.maps.places.Autocomplete(config.autocompleteElement, config.options);
            api.map = new google.maps.Map(config.mapElement, api.myOptions);
            api.placesService = new google.maps.places.PlacesService(api.map);

            if (config.minimumPlaceType) {
                api.minimumPlaceType = config.minimumPlaceType;
            }

            google.maps.event.addListener(api.autocomplete, 'place_changed', api.placeChangedCallback);

            return api.promise;
        },
        resetMap: function () {
            api.map.setCenter(api.myOptions.center);
            api.map.setZoom(5);
        },
        setMapTo: function (place) {
            //if(place.type)
            console.log("set map to ", place);
            api.map.setCenter(place.geometry.location);
            if (place.geometry.viewport) {
                api.map.fitBounds(place.geometry.viewport);
            } else {
                api.map.setZoom(15);
            }
        },
        isPlaceContainsLocality: function (place) {

            var contains = _(place.address_components).map(function (x) {
                return x.types;
            }).flatten().contains(api.minimumPlaceType);
            return contains;
        }
    };
    return {
        'build': api.build,
        'removeMarker': api.removeMarker
    };
}
