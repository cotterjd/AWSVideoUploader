/**
 * Created by jordan.cotter on 10/27/2015.
 */

angular.module('videoUploader', [])

    .controller('MainController', ['$scope', '$http', 'UploadService', function($scope, $http, UploadService){
        $scope.fileNames = [];
        $scope.data = new FormData();
        window.getFiles = function(element){
            $scope.$apply(function(){

                for(var i = 0, length = element.files.length; i < length; i++) {
                    $scope.data.append('File', element.files[i]);
                    $scope.fileNames.push(element.files[i].name);
                }

            })
        };

        $scope.saveVideos = function(){
            $('#saveButton').button('loading');
            UploadService.upload($scope.data);
        };

        var obj = $("#attachments");
        obj.css('border', '2px dotted #0B85A1');
        obj.on('dragenter', function (e) {
            e.stopPropagation();
            e.preventDefault();
            $(this).css('border', '2px solid #0B85A1');
        });
        obj.on('dragleave', function (e){
            e.stopPropagation();
            e.preventDefault();
            $(this).css('border', '2px dotted #0B85A1');
        });
        obj.on('dragover', function (e){
            e.stopPropagation();
            e.preventDefault();
        });
        obj.on('drop', function(e){
            $(this).css('border', '2px dotted #0B85A1');
            e.preventDefault();
            var file = e.originalEvent.dataTransfer.files;
            if(file.length > 1){
                alert("Only one file may be imported at a time.")
            } else{
                $scope.data.append('File', file[0]);
                $scope.fileName = file[0].name;
            }
            $scope.$apply();
        });

    }]).factory('UploadService', ['$http', '$rootScope', function($http, $rootScope){
        return {
            upload: function(files){
                $http.post('/api/upload', files, { transformRequest: angular.identity, headers: {'Content-Type': undefined} }).then(function(response){
                    console.log(response);
                    $('#saveButton').button('reset');
                    alert(response.data);
                })
            }
        }
    }]);