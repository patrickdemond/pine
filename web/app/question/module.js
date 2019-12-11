define( function() {
  'use strict';

  try { var module = cenozoApp.module( 'question', true ); } catch( err ) { console.warn( err ); return; }

  cenozoApp.initQnairePartModule( module, 'question' );

  module.identifier.parent = {
    subject: 'page',
    column: 'page.id'
  };

  module.columnList.type = { title: 'Type' };
  module.addInput( '', 'type', { title: 'Type', type: 'enum' } );
  module.addInput( '', 'minimum', {
    title: 'Minimum',
    type: 'string',
    format: 'float',
    isExcluded: function( $state, model ) { return 'number' != model.viewModel.record.type ? true : 'add'; }
  } );
  module.addInput( '', 'maximum', {
    title: 'Maximum',
    type: 'string',
    format: 'float',
    isExcluded: function( $state, model ) { return 'number' != model.viewModel.record.type ? true : 'add'; }
  } );
  module.addInput( '', 'note', { title: 'Note', type: 'text' } );
  module.addInput( '', 'parent_name', { column: 'page.name', isExcluded: true } );
} );
