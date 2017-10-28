var md = window.markdownit();

var htmlResult = "";
var inputTxt = "";
var title = "";

angular.module('MD_APP', ['ngSanitize']).
    controller('MD_Controller', ['$scope', '$http', '$sce', function($scope, $http, $sce)
    	{

            $scope.keyStroke = function(event)
                {
                    //inputTxt = $scope.input_val.val()
                    htmlResult = md.render($scope.md_src);
                    
                    $scope.md_content = htmlResult;
                };

            $scope.mouseClick = function(event)
                {
                    //htmlResult = md.render($scope.md_src);
                    //$scope.md_content = htmlResult;
                };

            $scope.saveDraft = function(art_type)
            {
                var oDate = new Date();
                var strDate = oDate.getFullYear().toString() + (oDate.getMonth()+1).toString() + oDate.getDate().toString()
                              + oDate.getHours().toString() + oDate.getMinutes().toString() + oDate.getSeconds().toString();

                // TODO: check title
                title = $scope.art_title;
                var islogged = $scope.isLogged;

                alert(islogged);

                if (title == "")
                {
                    window.alert("请输入文章标题");
                    return;
                }
                alert("start saving");

                alert(strDate);

                $http.post("/savedraft", 
                            {
                                artical_type  :art_type,
                                art_title     :title,
                                result_content:htmlResult
                            })
                    .success(function(data, status, headers, config)
                            {

                                location.href="/artical_view";    // jump ok no art_id
                                alert("save success");
                            })
                    .error(function(data, status, headers, config)
                            {
                                alert("save error");
                            });
            }
    	}]);


