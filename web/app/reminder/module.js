define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'reminder', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'qnaire',
        column: 'qnaire.id'
      }
    },
    name: {
      singular: 'reminder',
      plural: 'reminders',
      possessive: 'reminder\'s'
    },
    columnList: {
      offset: {
        title: 'Offset',
        column: 'reminder.offset'
      },
      unit: { title: 'Unit' }
    },
    defaultOrder: {
      column: 'reminder.id',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    offset: {
      title: 'Offset',
      type: 'string',
      format: 'integer'
    },
    unit: {
      title: 'Unit',
      type: 'enum'
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReminderAdd', [
    'CnReminderModelFactory',
    function( CnReminderModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReminderModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReminderList', [
    'CnReminderModelFactory',
    function( CnReminderModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReminderModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReminderView', [
    'CnReminderModelFactory',
    function( CnReminderModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReminderModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReminderAddFactory', [
    'CnBaseAddFactory',
    function( CnBaseAddFactory ) {
      var object = function( parentModel ) { CnBaseAddFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReminderListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReminderViewFactory', [
    'CnBaseViewFactory',
    function( CnBaseViewFactory ) {
      var object = function( parentModel, root ) { CnBaseViewFactory.construct( this, parentModel, root ); }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReminderModelFactory', [
    'CnBaseModelFactory', 'CnReminderAddFactory', 'CnReminderListFactory', 'CnReminderViewFactory',
    function( CnBaseModelFactory, CnReminderAddFactory, CnReminderListFactory, CnReminderViewFactory ) {
      var object = function( root ) {
        var self = this;
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnReminderAddFactory.instance( this );
        this.listModel = CnReminderListFactory.instance( this );
        this.viewModel = CnReminderViewFactory.instance( this, root );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
