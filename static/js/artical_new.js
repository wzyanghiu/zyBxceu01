var md = window.markdownit();

angular.module('MD_NEW_APP', ['ngSanitize']).
    controller('MD_New_Controller', ['$scope', '$http', '$sce', function($scope, $http, $sce)
    	{
            $scope.keyStroke = function(event)
                {
                    if (($scope.md_src != null) && ($scope.md_src != ""))
                        $scope.md_content = md.render($scope.md_src);
                };

            $scope.mouseClick = function(event)
                {
                };

            $scope.keyStrokeTitle = function(event)
                {
                    $scope.lab_art_title = $scope.art_title;
                };

            $scope.saveDraft = function(art_type)
            {
                var title = "";
                var oDate = new Date();
                var strDate = oDate.getFullYear().toString() + (oDate.getMonth()+1).toString() + oDate.getDate().toString()
                              + oDate.getHours().toString() + oDate.getMinutes().toString() + oDate.getSeconds().toString();

                // TODO: check title
                title = $scope.art_title;
                var islogged = $scope.isLogged;

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


