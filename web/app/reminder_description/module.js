define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'reminder_description', true ); } catch( err ) { console.warn( err ); return; }

  cenozoApp.initDescriptionModule( module, 'reminder' );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReminderDescriptionList', [
    'CnReminderDescriptionModelFactory',
    function( CnReminderDescriptionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReminderDescriptionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnReminderDescriptionView', [
    'CnReminderDescriptionModelFactory',
    function( CnReminderDescriptionModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnReminderDescriptionModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReminderDescriptionListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReminderDescriptionViewFactory', [
    'CnBaseViewFactory', 'CnBaseDescriptionViewFactory',
    function( CnBaseViewFactory, CnBaseDescriptionViewFactory ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root );
        CnBaseDescriptionViewFactory.construct( this, 'reminder' );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnReminderDescriptionModelFactory', [
    'CnBaseModelFactory', 'CnReminderDescriptionListFactory', 'CnReminderDescriptionViewFactory',
    function( CnBaseModelFactory, CnReminderDescriptionListFactory, CnReminderDescriptionViewFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnReminderDescriptionListFactory.instance( this );
        this.viewModel = CnReminderDescriptionViewFactory.instance( this, root );
        this.getEditEnabled = function() { return !this.viewModel.record.readonly && this.$$getEditEnabled(); };
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
