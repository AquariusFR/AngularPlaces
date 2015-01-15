define(
    [
        'text!templates/demo.html',
        'modules/placesApi',
        'pages/demo',
        'angular-mocks'],
    function (template, fakedPlacesApi) {
        "use strict";

        if (!Function.prototype.bind) {
            Function.prototype.bind = function (oThis) {
                if (typeof this !== 'function') {
                    // closest thing possible to the ECMAScript 5
                    // internal IsCallable function
                    throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
                }

                var aArgs = Array.prototype.slice.call(arguments, 1),
                    fToBind = this,
                    FNOP = function () {},
                    fBound = function () {
                        return fToBind.apply(this instanceof FNOP && oThis ? this : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                    };

                FNOP.prototype = this.prototype;
                fBound.prototype = new FNOP();

                return fBound;
            };
        }

        describe('Saisie Offre', function () {
            // load the directive's module
            var elementApp = angular.element(template),
                scope,
                form,
                titleInputElement,
                placesInputElement,
                autocomplete,
                autocompleteTag,
                tagUlElement,
                place_ok = {
                    "address_components": [
                        {
                            "long_name": "Lyon",
                            "short_name": "Lyon",
                            "types": ["locality", "political"]
                        },
                        {
                            "long_name": "Rhône",
                            "short_name": "69",
                            "types": ["administrative_area_level_2", "political"]
                        },
                        {
                            "long_name": "Rhône-Alpes",
                            "short_name": "RA",
                            "types": ["administrative_area_level_1", "political"]
                        },
                        {
                            "long_name": "France",
                            "short_name": "FR",
                            "types": ["country", "political"]
                        }
                    ],
                    "adr_address": "<span class=\"locality\">Lyon</span>, <span class=\"country-name\">France</span>",
                    "formatted_address": "Lyon, France",
                    "geometry": {
                        "location": {
                            "lat": 45.764043,
                            "lng": 4.835659
                        },
                        "viewport": {
                            "northeast": {
                                "lat": 45.808425,
                                "lng": 4.898393
                            },
                            "southwest": {
                                "lat": 45.707486,
                                "lng": 4.7718489
                            }
                        }
                    },
                    "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
                    "id": "b2c519626ecd0197c4ce46bff0462b93063ce786",
                    "name": "Lyon",
                    "place_id": "ChIJl4foalHq9EcR8CG75CqrCAQ",
                    "reference": "CnRvAAAAonThCOoRB1vcrHNFS-MFFqeaXBztcc8Z3bfR6CbKLoW1dS78RINlzzhDwPMYk2tLsQpGJjT7Mk0D-wIzwW6d-S_NdgoI1yilkG3Qmb0orkI5EqO-gZbTh40bdlGRRFstj3M1dr3j6Gsqv8YzVzY4aRIQvyHn5zrkIdRSRBNONzdHUxoUBnPh1THxPVvB_-LicKJmyoMALq8",
                    "scope": "GOOGLE",
                    "types": ["locality", "political"],
                    "url": "https://maps.google.com/maps/place?q=Lyon,+France&ftid=0x47f4ea516ae88797:0x408ab2ae4bb21f0",
                    "vicinity": "Lyon"
                },
                another_place_ok = {
                    "address_components": [
                        {
                            "long_name": "Lyon",
                            "short_name": "Lyon",
                            "types": ["locality", "political"]
                        },
                        {
                            "long_name": "Rhône",
                            "short_name": "69",
                            "types": ["administrative_area_level_2", "political"]
                        },
                        {
                            "long_name": "Rhône-Alpes",
                            "short_name": "RA",
                            "types": ["administrative_area_level_1", "political"]
                        },
                        {
                            "long_name": "France",
                            "short_name": "FR",
                            "types": ["country", "political"]
                        }
                    ],
                    "adr_address": "<span class=\"locality\">Lyon</span>, <span class=\"country-name\">France</span>",
                    "formatted_address": "Port-Real, Westeros",
                    "geometry": {
                        "location": {
                            "lat": 45.764043,
                            "lng": 4.835659
                        },
                        "viewport": {
                            "northeast": {
                                "lat": 45.808425,
                                "lng": 4.898393
                            },
                            "southwest": {
                                "lat": 45.707486,
                                "lng": 4.7718489
                            }
                        }
                    },
                    "icon": "http://maps.gstatic.com/mapfiles/place_api/icons/geocode-71.png",
                    "id": "b2c519626ecd0197c4ce46bff0462b93063ce786",
                    "name": "Lyon",
                    "place_id": "ChIJl4foalHq9EcR8CG75CqrCAQ",
                    "reference": "CnRvAAAAonThCOoRB1vcrHNFS-MFFqeaXBztcc8Z3bfR6CbKLoW1dS78RINlzzhDwPMYk2tLsQpGJjT7Mk0D-wIzwW6d-S_NdgoI1yilkG3Qmb0orkI5EqO-gZbTh40bdlGRRFstj3M1dr3j6Gsqv8YzVzY4aRIQvyHn5zrkIdRSRBNONzdHUxoUBnPh1THxPVvB_-LicKJmyoMALq8",
                    "scope": "GOOGLE",
                    "types": ["locality", "political"],
                    "url": "https://maps.google.com/maps/place?q=Lyon,+France&ftid=0x47f4ea516ae88797:0x408ab2ae4bb21f0",
                    "vicinity": "Lyon"
                };

            /* EXEMPLE : permet de redéfinir une fonction mockée ! */
            fakedPlacesApi.build = function () {
                return fakedPlacesApi.api.promise;
            };
            // load directive
            beforeEach(module('demo'));

            beforeEach(inject(function ($rootScope, $compile) {
                scope = $rootScope.$new();
                elementApp = $compile(elementApp)(scope);
                scope.$digest();
                form = scope.saisieOffreForm;
                autocomplete = elementApp.find('auto-complete-places');
                titleInputElement = elementApp.find('input')[0];
                placesInputElement = autocomplete.find('input')[0];
                autocompleteTag = autocomplete.find('div')[0];
                tagUlElement = autocomplete.find('div').find("ul");
            }));


            it('form should be invalid When nothing is made', function () {
                expect(form.$valid).to.equal(false);
            });

            it('form should be valid When Title and Places are filled', function () {

                var tagElementList;

                fakedPlacesApi.fakePlaceChoosen(place_ok);

                tagElementList = tagUlElement.find("li").find("span");

                expect(form.localisations.$valid).to.equal(true);
                expect(form.$valid).to.equal(true);
                expect(tagElementList.length).to.equal(1);
                expect(tagElementList.text()).to.equal(place_ok.formatted_address.toLocaleLowerCase());

            });

            it('form should be valid, and only one tag should be present When Title is filled and the same place is filled twice (or more)', function () {

                var tagElementList;

                fakedPlacesApi.fakePlaceChoosen(place_ok);
                fakedPlacesApi.fakePlaceChoosen(place_ok);
                fakedPlacesApi.fakePlaceChoosen(place_ok);
                fakedPlacesApi.fakePlaceChoosen(place_ok);

                tagElementList = tagUlElement.find("li").find("span");

                expect(form.localisations.$valid).to.equal(true);
                expect(form.$valid).to.equal(true);
                expect(tagElementList.length).to.equal(1);
                expect(tagElementList.text()).to.equal(place_ok.formatted_address.toLocaleLowerCase());
            });
            it('form should be valid, and two tag should be present When Title is filled and the two different places are filled', function () {

                var tagElementList;

                fakedPlacesApi.fakePlaceChoosen(place_ok);
                fakedPlacesApi.fakePlaceChoosen(another_place_ok);

                tagElementList = tagUlElement.find("li").find("span");

                expect(form.localisations.$valid).to.equal(true);
                expect(form.$valid).to.equal(true);
                expect(tagElementList.length).to.equal(2);
                expect(tagElementList[0].innerHTML).to.equal(place_ok.formatted_address.toLocaleLowerCase());
                expect(tagElementList[1].innerHTML).to.equal(another_place_ok.formatted_address.toLocaleLowerCase());
            });
            it('form should be invalid, and no tag should be present WHEN title is filled and a null place is returned', function () {

                var tagElementList;

                fakedPlacesApi.fakePlaceChoosen(null);

                tagElementList = tagUlElement.find("li").find("span");

                expect(form.localisations.$valid).to.equal(false);
                expect(form.$valid).to.equal(false);
                expect(tagElementList.length).to.equal(0);
            });
            it('form SHOULD BE invalid, and no tag should be present WHEN title is filled and an error is returned by placeApi', function () {

                var tagElementList;

                fakedPlacesApi.fakeError();

                tagElementList = tagUlElement.find("li").find("span");

                expect(form.localisations.$valid).to.equal(false);
                expect(form.$valid).to.equal(false);
                expect(tagElementList.length).to.equal(0);
            });
            it('form SHOULD BE valid, and one tag should be present WHEN title is filled and an error is returned by placeApi, then a correct place is returned', function () {

                var tagElementList;

                fakedPlacesApi.fakeError();
                fakedPlacesApi.fakePlaceChoosen(place_ok);

                tagElementList = tagUlElement.find("li").find("span");

                expect(form.localisations.$valid).to.equal(true);
                expect(form.$valid).to.equal(true);
                expect(tagElementList.length).to.equal(1);
                expect(tagElementList[0].innerHTML).to.equal(place_ok.formatted_address.toLocaleLowerCase());
            });
        });
    }
);
