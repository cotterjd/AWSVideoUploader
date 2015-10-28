/**
 * Created by jordan.cotter on 10/27/2015.
 */

angular.module('videoUploader', [])

    .controller('MainController', ['$scope', '$http', 'UploadService', function($scope, $http, UploadService){

        window.getFiles = function(element){
            $scope.$apply(function(){
                $scope.fileNames = [];
                $scope.data = new FormData();

                for(var i = 0, length = element.files.length; i < length; i++) {
                    $scope.data.append('File', element.files[i]);
                    $scope.fileNames.push(element.files[i].name);
                }

            })
        };

        $scope.saveVideos = function(){
            UploadService.upload($scope.data);
        };

    }]).factory('UploadService', ['$http', '$rootScope', function($http, $rootScope){
        return {
            upload: function(files){
                $http.post('/api/upload', files, { transformRequest: angular.identity, headers: {'Content-Type': undefined} }).then(function(response){
                    console.log(response);
                })
            }
        }
    }]);