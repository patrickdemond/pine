define( [ 'page' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'response', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'respondent',
        column: 'respondent.id'
      }
    },
    name: {
      singular: 'response',
      plural: 'responses',
      possessive: 'response\'s'
    },
    columnList: {
      rank: {
        title: 'Rank',
        type: 'rank'
      },
      language: {
        column: 'language.code',
        title: 'Language'
      },
      submitted: {
        title: 'Submitted',
        type: 'boolean'
      },
      module: {
        column: 'module.name',
        title: 'Module'
      },
      page: {
        column: 'page.name',
        title: 'Page'
      },
      time_spent: {
        title: 'Time Spent',
        type: 'seconds'
      },
      start_datetime: {
        title: 'Start',
        type: 'datetime'
      },
      last_datetime: {
        title: 'Last',
        type: 'datetime'
      }
    },
    defaultOrder: {
      column: 'start_datetime',
      reverse: true
    }
  } );

  module.addInputGroup( '', {
    uid: {
      column: 'participant.uid',
      title: 'Participant',
      type: 'string',
      isConstant: true
    },
    rank: {
      title: 'rank',
      type: 'rank',
      isConstant: true
    },
    language_id: {
      column: 'response.language_id',
      title: 'Language',
      type: 'enum',
      isExcluded: 'add'
    },
    submitted: {
      title: 'Submitted',
      type: 'boolean',
      isConstant: true,
      isExcluded: 'add'
    },
    module: {
      column: 'module.name',
      title: 'Module',
      type: 'string',
      isConstant: true,
      isExcluded: 'add'
    },
    page: {
      column: 'page.name',
      title: 'Page',
      type: 'string',
      isConstant: true,
      isExcluded: 'add'
    },
    start_datetime: {
      title: 'Start Date & Time',
      type: 'datetime',
      isConstant: true,
      isExcluded: 'add'
    },
    last_datetime: {
      title: 'Last Date & Time',
      type: 'datetime',
      isConstant: true,
      isExcluded: 'add'
    },
    page_id: { isExcluded: true }
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
      var object = function( parentModel ) {
        CnBaseAddFactory.construct( this, parentModel );

        // transition to viewing the new record instead of the default functionality
        this.transitionOnSave = function( record ) { parentModel.transitionToViewState( record ); };
      };
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
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnResponseModelFactory', [
    'CnBaseModelFactory', 'CnResponseAddFactory', 'CnResponseListFactory', 'CnResponseViewFactory', 'CnHttpFactory',
    function( CnBaseModelFactory, CnResponseAddFactory, CnResponseListFactory, CnResponseViewFactory, CnHttpFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnResponseAddFactory.instance( this );
        this.listModel = CnResponseListFactory.instance( this );
        this.viewModel = CnResponseViewFactory.instance( this, root );

        this.getMetadata = function() {
          return this.$$getMetadata().then( function() {
            return CnHttpFactory.instance( {
              path: 'language',
              data: {
                select: { column: [ 'id', 'name' ] }, 
                modifier: {
                  where: { column: 'active', operator: '=', value: true },
                  order: 'name'
                }
              }
            } ).query().then( function success( response ) {
              self.metadata.columnList.language_id.enumList = [];
              response.data.forEach( function( item ) {
                self.metadata.columnList.language_id.enumList.push( {
                  value: item.id,
                  name: item.name
                } );
              } );
            } );
          } );
        };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
