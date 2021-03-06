define( [ 'page' ].reduce( function( list, name ) {
  return list.concat( cenozoApp.module( name ).getRequiredFiles() );
}, [] ), function() {
  'use strict';

  try { var module = cenozoApp.module( 'respondent', true ); } catch( err ) { console.warn( err ); return; }
  angular.extend( module, {
    identifier: {
      parent: {
        subject: 'qnaire',
        column: 'qnaire.id'
      }
    },
    name: {
      singular: 'respondent',
      plural: 'respondents',
      possessive: 'respondent\'s'
    },
    columnList: {
      uid: {
        column: 'participant.uid',
        title: 'Participant'
      },
      token: {
        title: 'Token'
      },
      response_count: {
        title: 'Responses'
      },
      start_datetime: {
        title: 'Start Date',
        type: 'date'
      },
      end_datetime: {
        title: 'End Date',
        type: 'date'
      }
    },
    defaultOrder: {
      column: 'participant.uid',
      reverse: false
    }
  } );

  module.addInputGroup( '', {
    participant_id: {
      column: 'respondent.participant_id',
      title: 'Participant',
      type: 'lookup-typeahead',
      typeahead: {
        table: 'participant',
        select: 'CONCAT( participant.first_name, " ", participant.last_name, " (", uid, ")" )',
        where: [ 'participant.first_name', 'participant.last_name', 'uid' ]
      },
      isConstant: 'view'
    },
    token: {
      title: 'Token',
      type: 'string',
      isExcluded: 'add'
    },
    start_datetime: {
      title: 'Start Date & Time',
      type: 'datetime',
      isConstant: true,
      isExcluded: 'add'
    },
    end_datetime: {
      title: 'End Date & Time',
      type: 'datetime',
      isConstant: true,
      isExcluded: 'add'
    },
    sends_mail: {
      type: 'boolean',
      isExcluded: true
    }
  } );

  module.addExtraOperation( 'list', {
    title: 'Get Respondents',
    operation: function( $state, model ) {
      model.getRespondents();
    },
    isIncluded: function( $state, model ) { return model.isDetached() },
    isDisabled: function( $state, model ) { return model.workInProgress; }
  } );

  module.addExtraOperation( 'list', {
    title: 'Export Data',
    operation: function( $state, model ) {
      model.export();
    },
    isIncluded: function( $state, model ) { return model.isDetached() },
    isDisabled: function( $state, model ) { return model.workInProgress; }
  } );

  module.addExtraOperation( 'list', {
    title: 'Mass Respondent',
    operation: async function( $state, model ) {
      await $state.go( 'qnaire.mass_respondent', { identifier: $state.params.identifier } );
    },
    isIncluded: function( $state, model ) { return !model.isDetached(); }
  } );

  module.addExtraOperation( 'view', {
    title: 'Launch',
    operation: async function( $state, model ) {
      await $state.go( 'respondent.run', { token: model.viewModel.record.token } );
    }
  } );

  module.addExtraOperation( 'view', {
    title: 'Re-schedule Email',
    operation: async function( $state, model ) {
      try {
        model.viewModel.resendMail();
      } finally {
        if( angular.isDefined( model.viewModel.respondentMailModel ) )
          await model.viewModel.respondentMailModel.listModel.onList( true );
      }
    },
    isIncluded: function( $state, model ) { return model.viewModel.record.sends_mail; },
    help: 'This will re-schedule all mail for this respondent. ' + 
      'This is useful if mail was never sent or if email settings have changed since email was last scheduled.'
  } );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnRespondentAdd', [
    'CnRespondentModelFactory',
    function( CnRespondentModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'add.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnRespondentModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnRespondentList', [
    'CnRespondentModelFactory',
    function( CnRespondentModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'list.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnRespondentModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnRespondentRun', [
    'CnRespondentModelFactory',
    function( CnRespondentModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'run.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnRespondentModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.directive( 'cnRespondentView', [
    'CnRespondentModelFactory',
    function( CnRespondentModelFactory ) {
      return {
        templateUrl: module.getFileUrl( 'view.tpl.html' ),
        restrict: 'E',
        scope: { model: '=?' },
        controller: function( $scope ) {
          if( angular.isUndefined( $scope.model ) ) $scope.model = CnRespondentModelFactory.root;
        }
      };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnRespondentAddFactory', [
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
  cenozo.providers.factory( 'CnRespondentListFactory', [
    'CnBaseListFactory',
    function( CnBaseListFactory ) {
      var object = function( parentModel ) { CnBaseListFactory.construct( this, parentModel ); };
      return { instance: function( parentModel ) { return new object( parentModel ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnRespondentViewFactory', [
    'CnBaseViewFactory', 'CnHttpFactory',
    function( CnBaseViewFactory, CnHttpFactory ) {
      var object = function( parentModel, root ) {
        CnBaseViewFactory.construct( this, parentModel, root, 'response' );

        angular.extend( this, {
          // only show the respondent list to respondents
          getChildList: function() {
            var self = this;
            return this.$$getChildList().filter( child => 'response' == child.subject.snake || self.record.sends_mail );
          },

          resendMail: function() {
            return CnHttpFactory.instance( {
              path: this.parentModel.getServiceResourcePath() + '?action=resend_mail'
            } ).patch();
          }
        } );
      }
      return { instance: function( parentModel, root ) { return new object( parentModel, root ); } };
    }
  ] );

  /* ######################################################################################################## */
  cenozo.providers.factory( 'CnRespondentModelFactory', [
    'CnBaseModelFactory', 'CnRespondentAddFactory', 'CnRespondentListFactory', 'CnRespondentViewFactory',
    'CnModalMessageFactory', 'CnSession', 'CnHttpFactory', '$state',
    function( CnBaseModelFactory, CnRespondentAddFactory, CnRespondentListFactory, CnRespondentViewFactory,
              CnModalMessageFactory, CnSession, CnHttpFactory, $state ) {
      var object = function( root ) {
        CnBaseModelFactory.construct( this, module );
        this.addModel = CnRespondentAddFactory.instance( this );
        this.listModel = CnRespondentListFactory.instance( this );
        this.viewModel = CnRespondentViewFactory.instance( this, root );

        angular.extend( this, {
          isDetached: function() { return CnSession.setting.detached; },
          workInProgress: false,
          getRespondents: async function() {
            var modal = CnModalMessageFactory.instance( {
              title: 'Communicating with Remote Server',
              message: 'Please wait while the respondent list is retrieved.',
              block: true
            } );
            modal.show();

            try {
              this.workInProgress = true;
              await CnHttpFactory.instance( {
                path: 'qnaire/' + $state.params.identifier + '/respondent?operation=get_respondents'
              } ).post();
              await this.listModel.onList( true );
            } finally {
              modal.close();
              this.workInProgress = false;
            }
          },
          export: async function() {
            var modal = CnModalMessageFactory.instance( {
              title: 'Communicating with Remote Server',
              message: 'Please wait while the questionnaire responses are exported.',
              block: true
            } );
            modal.show();

            try {
              this.workInProgress = true;
              await CnHttpFactory.instance( {
                path: 'qnaire/' + $state.params.identifier + '/respondent?operation=export'
              } ).post();
              await this.listModel.onList( true );
            } finally {
              modal.close();
              this.workInProgress = false;
            }
          }
        } );
      };

      return {
        root: new object( true ),
        instance: function() { return new object( false ); }
      };
    }
  ] );

} );
