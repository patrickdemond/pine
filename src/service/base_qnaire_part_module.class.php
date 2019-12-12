<?php
/**
 * base_qnaire_part_module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace pine\service;
use cenozo\lib, cenozo\log, pine\util;

/**
 * Generic functionality used by all qnaire-part modules (module, page, question, question_option)
 */
abstract class base_qnaire_part_module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $subject = $this->get_subject();

    if( $select->has_column( 'has_precondition' ) ) $select->add_column( 'precondition IS NOT NULL', 'has_precondition' );

    // add empty values for description field (it is only used when adding new records so they will be ignored)
    if( $select->has_column( 'description' ) ) $select->add_constant( NULL, 'description' ); 

    if( $select->has_column( 'descriptions' ) )
    {
      $modifier->join(
        sprintf( '%s_description', $subject ),
        sprintf( '%s.id', $subject ),
        sprintf( '%s_description.%s_id', $subject, $subject )
      );
      $modifier->join(
        'language',
        sprintf( '%s_description.language_id', $subject ),
        sprintf( '%s_language.id', $subject ),
        '',
        sprintf( '%s_language', $subject )
      );
      $modifier->group( sprintf( '%s.id', $subject ) );
      $select->add_column(
        sprintf(
          'GROUP_CONCAT( DISTINCT CONCAT_WS( "`", %s_language.code, IFNULL( %s_description.value, "" ) ) SEPARATOR "`" )',
          $subject,
          $subject
        ),
        'descriptions',
        false
      );
    }

    $record = $this->get_resource();
    if( !is_null( $record ) )
    {
      if( $select->has_column( 'previous_id' ) )
      {
        $db_previous_record = $record->get_previous();
        $select->add_constant( is_null( $db_previous_record ) ? NULL : $db_previous_record->id, 'previous_id', 'integer' );
      }

      if( $select->has_column( 'next_id' ) )
      {
        $db_next_record = $record->get_next();
        $select->add_constant( is_null( $db_next_record ) ? NULL : $db_next_record->id, 'next_id', 'integer' );
      }
    }
  }

  /**
   * Extends parent method
   */
  public function post_write( $record )
  {
    parent::post_write( $record );

    if( $record && 'POST' == $this->get_method() )
    {
      $post_array = $this->get_file_as_array();

      // add the description, if data has been provided
      if( array_key_exists( 'description', $post_array ) )
      {
        $subject = $this->get_subject();
        $description_class_name = lib::get_class_name( sprintf( 'database\%s_description', $subject ) );
        $db_description = $description_class_name::get_unique_record(
          array( sprintf( '%s_id', $subject ), 'language_id' ),
          array( $record->id, $record->get_qnaire()->base_language_id )
        );

        $db_description->value = $post_array['description'];
        $db_description->save();
      }
    }
  }
}
