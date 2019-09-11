'use strict';

var cenozo = angular.module( 'cenozo' );

cenozo.controller( 'HeaderCtrl', [
  '$scope', 'CnBaseHeader',
  function( $scope, CnBaseHeader ) {
    // copy all properties from the base header
    CnBaseHeader.construct( $scope );
  }
] );

/* ######################################################################################################## */
cenozo.directive( 'cnQnaireNavigator', [
  'CnHttpFactory', '$state', '$q',
  function( CnHttpFactory, $state, $q ) {
    return {
      templateUrl: cenozoApp.getFileUrl( 'linden', 'qnaire_navigator.tpl.html' ),
      restrict: 'E',
      controller: function( $scope ) {
        angular.extend( $scope, {
          loading: true,
          currentModule: null,
          currentPage: null,
          currentQuestion: null,
          moduleList: [],
          pageList: [],
          questionList: [],
        } );

        // we'll need to know the state's current subject
        var subject = $state.current.name.split( '.' )[0];

        // fill in the qnaire, module, page and question data
        var columnList = [
          { table: 'qnaire', column: 'id', alias: 'qnaire_id' },
          { table: 'qnaire', column: 'name', alias: 'qnaire_name' },
          { table: 'module', column: 'id', alias: 'module_id' },
          { table: 'module', column: 'rank', alias: 'module_rank' },
          { table: 'module', column: 'name', alias: 'module_name' }
        ];

        if( ['page','question'].includes( subject ) ) {
          columnList.push(
            { table: 'page', column: 'id', alias: 'page_id' },
            { table: 'page', column: 'rank', alias: 'page_rank' },
            { table: 'page', column: 'name', alias: 'page_name' }
          );
        }
        
        if ( 'question' == subject ) {
          columnList.push(
            { table: 'question', column: 'id', alias: 'question_id' },
            { table: 'question', column: 'rank', alias: 'question_rank' },
            { table: 'question', column: 'name', alias: 'question_name' }
          );
        }

        CnHttpFactory.instance( {
          path: subject + '/' + $state.params.identifier,
          data: { select: { column: columnList } }
        } ).get().then( function( response ) {
          $scope.currentQnaire = {
            id: response.data.qnaire_id,
            name: response.data.qnaire_name
          };
          $scope.currentModule = {
            id: response.data.module_id,
            rank: response.data.module_rank,
            name: response.data.module_name
          };

          if( ['page','question'].includes( subject ) ) {
            $scope.currentPage = {
              id: response.data.page_id,
              rank: response.data.page_rank,
              name: response.data.page_name
            };
          }

          if ( 'question' == subject ) {
            $scope.currentQuestion = {
              id: response.data.question_id,
              rank: response.data.question_rank,
              name: response.data.question_name
            };
          }

          /*
          $q.all( [
            CnHttpFactory.instance( {
              path: 'qnaire/' + + '/module'
            } ).query().then( function( response ) {
            } ),

            CnHttpFactory.instance( {
              path: 'qnaire/' + + '/module'
            } ).query().then( function( response ) {
            } ),
            
            CnHttpFactory.instance( {
              path: 'qnaire/' + + '/module'
            } ).query().then( function( response ) {
            } )
          ] );
          */
        } );
      }
    };
  }
] );
