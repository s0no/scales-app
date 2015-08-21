﻿var scalesControllers = angular.module('scalesControllers', []);

scalesControllers.controller('ScalesFormCtrl', ['$scope', '$location', 'DataModel',
   function ($scope, $location, DataModel) {
      $scope.allProducts = [
          "Arroz em casca",
          "Milho"
      ];

      $scope.data = DataModel.get();

      // <-- Watchers ------------------------------------------>

      $scope.$watch('data.deductions.humidity.pct', function () {
         $scope.updateDeductions({ }, true)
      });

      $scope.$watch('data.deductions.impurities.pct', function () {
         $scope.updateDeductions({ impurities: true }, false);
      });

      $scope.$watch('data.deductions.badGrain.pct', function () {
         $scope.updateDeductions({ badGrain: true }, false);
      });

      $scope.$watch('data.deductions.drying.pct', function () {
         $scope.updateDeductions({ drying: true }, false);
      });

      $scope.$watch('data.deductions.misc.pct', function () {
         $scope.updateDeductions({ misc: true }, false);
      });

      $scope.$watchGroup(['data.grossWeight', 'data.tareWeight'], function (newValues) {
         $scope.data.netWeight = newValues[0] - newValues[1];
         $scope.updateDeductions();
      });


      // <-- Functions ------------------------------------------>

      $scope.chooseProduct = function (index) {
         $scope.data.product = $scope.allProducts[index];
      };

      $scope.resetForm = function () {
         DataModel.reset();
      };

      $scope.changeView = function (path) {
         var now = new Date();
         $scope.data.outTime = new Date(0, 0, 0, now.getHours(), now.getMinutes());

         $location.path(path);
      };

      $scope.updateDeductions = function (list, humidity, drying) {
         list = list || { impurities: true, badGrain: true, drying: true, misc: true };
         humidity = humidity || true;
         drying = drying || true;

         for (item in list)
            if (list[item]) {
               var pct = ($scope.data.deductions[item].pct / 100);
               $scope.data.deductions[item].kg = ($scope.data.netWeight * pct).toFixed();
            }

         if (humidity) {
            var pct = ($scope.data.deductions.humidity.pct - 13) * 1.3;
            $scope.data.deductions.humidity.kg = ($scope.data.netWeight * (pct / 100)).toFixed();
         }

         if (drying) {
            var pct = ($scope.data.deductions.drying.pct / 100);
            $scope.data.deductions.drying.kg = ($scope.data.netWeight * (pct / 100)).toFixed();
         }

         $scope.updateNetWeightFinal();
      };

      $scope.updateNetWeightFinal = function () {
         // calculates the final net weight after deductions
         $scope.data.netWeightFinal.kg = $scope.data.netWeight;

         for (var item in $scope.data.deductions)
            $scope.data.netWeightFinal.kg -= $scope.data.deductions[item].kg;

         $scope.data.netWeightFinal.sacks = ($scope.data.netWeightFinal.kg / 50).toFixed(1);
         $scope.data.netWeightFinal.kg = $scope.data.netWeightFinal.kg.toFixed();
      };
   }]);

scalesControllers.controller('ScalesPreviewCtrl', ['$scope', '$location', 'DataModel',
   function ($scope, $location, DataModel) {
      $scope.data = DataModel.get();

      numeral.language('pt-br');

      $scope.changeView = function (path) {
         $location.path(path);
      };
   }]);