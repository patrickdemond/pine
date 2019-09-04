DROP PROCEDURE IF EXISTS patch_access;
DELIMITER //
CREATE PROCEDURE patch_access()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "linden", "cenozo" ) );
    
    SELECT "Creating new access table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS response ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "survey_id INT UNSIGNED NOT NULL, ",
        "participant_id INT UNSIGNED NOT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_survey_id (survey_id ASC), ",
        "INDEX fk_participant_id (participant_id ASC), ",
        "CONSTRAINT fk_response_survey_id ",
          "FOREIGN KEY (survey_id) ",
          "REFERENCES survey (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_response_participant_id ",
          "FOREIGN KEY (participant_id) ",
          "REFERENCES ", @cenozo, ".participant (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_access();
DROP PROCEDURE IF EXISTS patch_access;
