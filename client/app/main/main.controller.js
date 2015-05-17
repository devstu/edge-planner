'use strict';

angular.module('edgeplannerApp')
    .controller('MainCtrl', function ($scope, $http, socket, $filter, $stateParams) {
        $scope.thisThingDay = [];
        $scope.thisThingDay.tasks = [];

        $scope.twinThingDay = [];
        $scope.twinThingDay.tasks = [];

        var thisToday = new Date();
        var today = $filter('date')( thisToday, 'yyyy-MM-dd' );

        var thisTomorrow = new Date((new Date()).valueOf() + 1000*3600*24);
        var tomorrow = $filter('date')( thisTomorrow, 'yyyy-MM-dd' );

        if($stateParams.primaryDay != '') {
            var prevDate = new Date((new Date($stateParams.primaryDay)).valueOf());
            var thisDate = new Date((new Date($stateParams.primaryDay)).valueOf() + 1000*3600*24*1);
            var twinDate = new Date((new Date($stateParams.primaryDay)).valueOf() + 1000*3600*24*2);
            var nextDate = new Date((new Date($stateParams.primaryDay)).valueOf() + 1000*3600*24*3);
            $scope.prevDay = $filter('date')( prevDate, 'yyyy-MM-dd' );
            $scope.thisDay = $filter('date')( thisDate, 'yyyy-MM-dd' );
            $scope.twinDay = $filter('date')( twinDate, 'yyyy-MM-dd' );
            $scope.nextDay = $filter('date')( nextDate, 'yyyy-MM-dd' );
        } else {
            var prevDate = new Date((new Date()).valueOf() - 1000*3600*24);
            var thisDate = new Date();
            var twinDate = new Date((new Date()).valueOf() + 1000*3600*24);
            var nextDate = new Date((new Date()).valueOf() + 1000*3600*24*2);
            $scope.prevDay = $filter('date')( prevDate, 'yyyy-MM-dd' );
            $scope.thisDay = $filter('date')( thisDate, 'yyyy-MM-dd' );
            $scope.twinDay = $filter('date')( twinDate, 'yyyy-MM-dd' );
            $scope.nextDay = $filter('date')( nextDate, 'yyyy-MM-dd' );
        }

        if($scope.thisDay == today) {
            $scope.thisLabel = $filter('date')(thisDate, 'MM/dd') + ' | Today!';
            $scope.twinLabel = $filter('date')( twinDate, 'MM/dd') + ' | Tomorrow';
        } else if($scope.twinDay == today) {
            $scope.thisLabel = $filter('date')(thisDate, 'MM/dd') + ' | Yesterday';
            $scope.twinLabel = $filter('date')( twinDate, 'MM/dd') + ' | Today!';
        } else if($scope.thisDay == tomorrow) {
            $scope.thisLabel = $filter('date')(thisDate, 'MM/dd') + ' | Tomorrow';
            $scope.twinLabel = $filter('date')( twinDate, 'MM/dd');
        } else {
            $scope.thisLabel = $filter('date')(thisDate, 'MM/dd');
            $scope.twinLabel = $filter('date')( twinDate, 'MM/dd');
        }

        //$scope.thisDay = '20150513';

        $http.get('/api/things/'+$scope.thisDay).success(function(thisThingDay) {
            if(thisThingDay[0]) {
                $scope.thisID = thisThingDay[0]._id;
            }
            $scope.thisThingDay = thisThingDay[0];
            /*socket.syncUpdates('thing', $scope.thisThingDay);*/
        });

        $http.get('/api/things/'+$scope.twinDay).success(function(twinThingDay) {
            if(twinThingDay[0]) {
                $scope.twinID = twinThingDay[0]._id;
            }
            $scope.twinThingDay = twinThingDay[0];
            /*socket.syncUpdates('thing', $scope.twinThingDay);*/
        });

        $scope.removeThisTask = function(st){
            $scope.thisThingDay.tasks.splice(st,1);
            $http.put('/api/things/' + $scope.thisID, {
                tasks: $scope.thisThingDay.tasks
            });
        };

        $scope.completeThisTask = function(st){
            $scope.thisThingDay.tasks[st].completed = ($scope.thisThingDay.tasks[st].completed == 0 ? 1 : 0);;
            $http.put('/api/things/' + $scope.thisID, {
                tasks: $scope.thisThingDay.tasks
            });
        };

        $scope.removeTwinTask = function(st){
            $scope.twinThingDay.tasks.splice(st,1);
            $http.put('/api/things/' + $scope.twinID, {
                tasks: $scope.twinThingDay.tasks
            });
        };

        $scope.completeTwinTask = function(st){
            $scope.twinThingDay.tasks[st].completed = ($scope.twinThingDay.tasks[st].completed == 0 ? 1 : 0);;
            $http.put('/api/things/' + $scope.twinID, {
                tasks: $scope.twinThingDay.tasks
            });
        };

        $scope.addThing = function() {
            /* Insert Page 1 */
            if($scope.thisThingDay.newTask) {
                if(!$scope.thisThingDay.tasks) {
                    $scope.thisThingDay.tasks = [];
                }
                $scope.thisThingDay.tasks.push({name: $scope.thisThingDay.newTask, minutes: '', completed: 0});
                $scope.thisThingDay.newTask = '';
            }
            if($scope.thisID) {
                $http.put('/api/things/' + $scope.thisID, {
                    yyyymmdd: $scope.thisDay,
                    wakePlan: $scope.thisThingDay.wakePlan,
                    wakeLog: $scope.thisThingDay.wakeLog,
                    eatingPlan: $scope.thisThingDay.eatingPlan,
                    eatingLog: $scope.thisThingDay.eatingLog,
                    exercisePlan: $scope.thisThingDay.exercisePlan,
                    exerciseLog: $scope.thisThingDay.exerciseLog,
                    readingPlan: $scope.thisThingDay.readingPlan,
                    readingLog: $scope.thisThingDay.readingLog,
                    tasks: $scope.thisThingDay.tasks,
                    gratuity: $scope.thisThingDay.gratuity,
                    journal: $scope.thisThingDay.journal
                });
            } else {
                $http.post('/api/things/', {
                    yyyymmdd: $scope.thisDay,
                    wakePlan: $scope.thisThingDay.wakePlan,
                    wakeLog: $scope.thisThingDay.wakeLog,
                    eatingPlan: $scope.thisThingDay.eatingPlan,
                    eatingLog: $scope.thisThingDay.eatingLog,
                    exercisePlan: $scope.thisThingDay.exercisePlan,
                    exerciseLog: $scope.thisThingDay.exerciseLog,
                    readingPlan: $scope.thisThingDay.readingPlan,
                    readingLog: $scope.thisThingDay.readingLog,
                    tasks: $scope.thisThingDay.tasks,
                    gratuity: $scope.thisThingDay.gratuity,
                    journal: $scope.thisThingDay.journal
                })
                    .success(function(data, status, headers, config) {
                        // this callback will be called asynchronously
                        // when the response is available
                        $scope.thisID = data._id;
                    })
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
            /* Insert Page 2 */
            if($scope.twinThingDay.newTask) {
                if(!$scope.twinThingDay.tasks) {
                    $scope.twinThingDay.tasks = [];
                }
                $scope.twinThingDay.tasks.push({name: $scope.twinThingDay.newTask, minutes: '', completed: 0});
                $scope.thisThingDay.newTask = '';
            }
            if($scope.twinID) {
                $http.put('/api/things/' + $scope.twinID, {
                    yyyymmdd: $scope.twinDay,
                    wakePlan: $scope.twinThingDay.wakePlan,
                    wakeLog: $scope.twinThingDay.wakeLog,
                    eatingPlan: $scope.twinThingDay.eatingPlan,
                    eatingLog: $scope.twinThingDay.eatingLog,
                    exercisePlan: $scope.twinThingDay.exercisePlan,
                    exerciseLog: $scope.twinThingDay.exerciseLog,
                    readingPlan: $scope.twinThingDay.readingPlan,
                    readingLog: $scope.twinThingDay.readingLog,
                    tasks: $scope.twinThingDay.tasks,
                    gratuity: $scope.twinThingDay.gratuity,
                    journal: $scope.twinThingDay.journal
                });
            } else {
                $http.post('/api/things/', {
                    yyyymmdd: $scope.twinDay,
                    wakePlan: $scope.twinThingDay.wakePlan,
                    wakeLog: $scope.twinThingDay.wakeLog,
                    eatingPlan: $scope.twinThingDay.eatingPlan,
                    eatingLog: $scope.twinThingDay.eatingLog,
                    exercisePlan: $scope.twinThingDay.exercisePlan,
                    exerciseLog: $scope.twinThingDay.exerciseLog,
                    readingPlan: $scope.twinThingDay.readingPlan,
                    readingLog: $scope.twinThingDay.readingLog,
                    tasks: $scope.twinThingDay.tasks,
                    gratuity: $scope.twinThingDay.gratuity,
                    journal: $scope.twinThingDay.journal
                })
                    .success(function(data, status, headers, config) {
                        // twin callback will be called asynchronously
                        // when the response is available
                        $scope.twinID = data._id;
                    })
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
            }
        };

        /*$scope.deleteThing = function(thisDay, taskIndex) {
            $http.delete('/api/things/' + thisDay '/' + taskIndex);
        }; */

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('thing');
        });
    });
