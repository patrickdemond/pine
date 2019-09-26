define( [ 'page' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'response', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'qnaire',
        column: 'qnaire.id'
      }
    },
    name: {
      singular: 'response',
      plural: 'responses',
      possessive: 'response\'s'
    },
    columnList: {
      uid: {
        column: 'participant.uid',
        title: 'Participant'
      },
      token: {
        title: 'Token'
      },
      page: {
        column: 'page.rank',
        type: 'rank',
        title: 'Page'
      },
      start_datetime: {
        title: 'Start',
        type: 'datetime'
      },
      last_datetime: {
        title: 'Last',
        type: 'datetime'
      },
      end_datetime: {
        title: 'End',
        type: 'datetime'
      }
    },
    defaultOrder: {
      column: 'start_datetime',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    participant_id: {
      column: 'response.participant_id',
      title: 'Participant',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'participant',
        select: 'CONCAT( participant.first_name, " ", participant.last_name, " (", uid, ")" )',
        where: [ 'participant.first_name', 'participant.last_name', 'uid' ]
      },
      constant: 'view'
    },
    token: {
      title: 'Token',
      type: 'string',
      constant: true,
      exclude: 'add'
    },
    page: {
      column: 'page.rank',
      type: 'string',
      title: 'Page Rank',
      constant: true,
      exclude: 'add'
    },
    start_datetime: {
      title: 'Start Date & Time',
      type: 'datetime',
      constant: true,
      exclude: 'add'
    },
    last_datetime: {
      title: 'Last Date & Time',
      type: 'datetime',
      constant: true,
      exclude: 'add'
    },
    end_datetime: {
      title: 'End Date & Time',
      type: 'datetime',
      constant: true,
      exclude: 'add'
    },
    page_id: { exclude: true }
  } );

  module.addExtraOperation( 'view', {
    title: 'Launch',
    operation: function( $state, model ) {
      $state.go( 'response.run', { identifier: model.viewModel.record.getIdentifier() } );
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnResponseAdd', [
    'CnResponseModelFactory',
    function( CnResponseModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnResponseModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnResponseList', [
    'CnResponseModelFactory',
    function( CnResponseModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnResponseModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnResponseRun', [
    'CnResponseModelFactory',
    function( CnResponseModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'run.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnResponseModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnResponseView', [
    'CnResponseModelFactory',
    function( CnResponseModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnResponseModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnResponseAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnResponseListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnResponseViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );
        this.onView = function( force ) {
          return this.$$onView( force );
        };
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnResponseModelFactory', [
    'CnBaseModelFactory', 'CnResponseAddFactory', 'CnResponseListFactory', 'CnResponseViewFactory', 'CnPageRenderFactory',
    function( CnBaseModelFactory, CnResponseAddFactory, CnResponseListFactory, CnResponseViewFactory, CnPageRenderFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnResponseAddFactory.instance( this );
        this.listModel = CnResponseListFactory.instance( this );
//        this.renderModel = CnPageRenderFactory.instance( this );
        this.viewModel = CnResponseViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );