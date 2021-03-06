define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'respondent_mail', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'respondent',
        column: 'respondent.id'
      }
    },
    name: {
      singular: 'email',
      plural: 'emails',
      possessive: 'email\'s'
    },
    columnList: {
      type: {
        title: 'Type'
      },
      rank: {
        title: 'Rank',
        type: 'rank'
      },
      schedule_datetime: {
        column: 'mail.schedule_datetime',
        title: 'Scheduled Date & Time',
        type: 'datetime'
      },
      sent_datetime: {
        column: 'mail.sent_datetime',
        title: 'Sent Date & Time',
        type: 'datetime'
      },
      sent: {
        column: 'mail.sent',
        title: 'Sent',
        type: 'boolean'
      }
    },
    defaultOrder: {
      column: 'rank',
      reverse: false
    }
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnRespondentMailList', [
    'CnRespondentMailModelFactory',
    function( CnRespondentMailModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnRespondentMailModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnRespondentMailRun', [
    'CnRespondentMailModelFactory',
    function( CnRespondentMailModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'run.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnRespondentMailModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnRespondentMailListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnRespondentMailModelFactory', [
    'CnBaseModelFactory', 'CnRespondentMailListFactory', 'CnHttpFactory',
    function( CnBaseModelFactory, CnRespondentMailListFactory, CnHttpFactory ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.listModel = CnRespondentMailListFactory.instance( this );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
