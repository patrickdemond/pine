DROP PROCEDURE IF EXISTS patch_answer;
DELIMITER //
CREATE PROCEDURE patch_answer()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "pine", "cenozo" ) );
    
    SELECT "Creating new answer table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS answer ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "response_id INT UNSIGNED NOT NULL, ",
        "question_id INT UNSIGNED NOT NULL, ",
        "language_id INT UNSIGNED NOT NULL, ",
        "dkna TINYINT(1) NOT NULL DEFAULT 0, ",
        "refuse TINYINT(1) NOT NULL DEFAULT 0, ",
        "value_boolean TINYINT(1) NULL DEFAULT NULL, ",
        "value_number FLOAT NULL DEFAULT NULL, ",
        "value_string VARCHAR(255) NULL DEFAULT NULL, ",
        "value_text TEXT NULL DEFAULT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_response_id (response_id ASC), ",
        "INDEX fk_question_id (question_id ASC), ",
        "INDEX fk_language_id (language_id ASC), ",
        "UNIQUE INDEX uq_response_id_question_id (response_id ASC, question_id ASC), ",
        "CONSTRAINT fk_answer_response_id ",
          "FOREIGN KEY (response_id) ",
          "REFERENCES response (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_answer_question_id ",
          "FOREIGN KEY (question_id) ",
          "REFERENCES question (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_answer_language_id ",
          "FOREIGN KEY (language_id) ",
          "REFERENCES ", @cenozo, ".language (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_answer();
DROP PROCEDURE IF EXISTS patch_answer;


DELIMITER $$

DROP TRIGGER IF EXISTS answer_BEFORE_UPDATE $$
CREATE DEFINER = CURRENT_USER TRIGGER answer_BEFORE_UPDATE BEFORE UPDATE ON answer FOR EACH ROW
BEGIN
  IF ( NEW.dkna || NEW.refuse ) THEN
    IF( OLD.dkna != NEW.dkna || OLD.refuse != NEW.refuse ) THEN
      -- unset any value in the answer
      SET NEW.value_boolean = NULL, NEW.value_number = NULL, NEW.value_string = NULL, NEW.value_text = NULL;
      -- dkna and refuse are mutually exclusive
      IF( OLD.dkna != NEW.dkna ) THEN SET NEW.refuse = false; ELSE SET NEW.dkna = false; END IF;
      -- unset any question options
      DELETE FROM answer_has_question_option WHERE answer_id = NEW.id;
    ELSE
      -- the value has changed
      SET NEW.dkna = 0, NEW.refuse = 0;
    END IF;
  END IF;
END$$


DELIMITER ;
