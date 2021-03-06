DROP PROCEDURE IF EXISTS patch_qnaire_has_language;
DELIMITER //
CREATE PROCEDURE patch_qnaire_has_language()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Creating new qnaire_has_language table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS qnaire_has_language ( ",
        "qnaire_id INT UNSIGNED NOT NULL, ",
        "language_id INT UNSIGNED NOT NULL, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "PRIMARY KEY (qnaire_id, language_id), ",
        "INDEX fk_language_id (language_id ASC), ",
        "INDEX fk_qnaire_id (qnaire_id ASC), ",
        "CONSTRAINT fk_qnaire_has_language_qnaire_id ",
          "FOREIGN KEY (qnaire_id) ",
          "REFERENCES qnaire (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_qnaire_has_language_language_id ",
          "FOREIGN KEY (language_id) ",
          "REFERENCES ", @cenozo, ".language (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_qnaire_has_language();
DROP PROCEDURE IF EXISTS patch_qnaire_has_language;


DELIMITER $$

DROP TRIGGER IF EXISTS qnaire_has_language_AFTER_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER qnaire_has_language_AFTER_INSERT AFTER INSERT ON qnaire_has_language FOR EACH ROW
BEGIN
  INSERT IGNORE INTO qnaire_description( qnaire_id, language_id, type ) VALUES
  ( NEW.qnaire_id, NEW.language_id, 'introduction' ),
  ( NEW.qnaire_id, NEW.language_id, 'conclusion' ),
  ( NEW.qnaire_id, NEW.language_id, 'closed' ),
  ( NEW.qnaire_id, NEW.language_id, 'invitation subject' ),
  ( NEW.qnaire_id, NEW.language_id, 'invitation body' ),
  ( NEW.qnaire_id, NEW.language_id, 'reminder subject' ),
  ( NEW.qnaire_id, NEW.language_id, 'reminder body' );

  INSERT IGNORE INTO module_description( module_id, language_id, type )
  SELECT module.id, NEW.language_id, type.name
  FROM ( SELECT "prompt" AS name UNION SELECT "popup" AS name ) AS type, module
  WHERE module.qnaire_id = NEW.qnaire_id;
  
  INSERT IGNORE INTO page_description( page_id, language_id, type )
  SELECT page.id, NEW.language_id, type.name
  FROM ( SELECT "prompt" AS name UNION SELECT "popup" AS name ) AS type, page
  JOIN module ON page.module_id = module.id
  WHERE module.qnaire_id = NEW.qnaire_id;
  
  INSERT IGNORE INTO question_description( question_id, language_id, type )
  SELECT question.id, NEW.language_id, type.name
  FROM ( SELECT "prompt" AS name UNION SELECT "popup" AS name ) AS type, question
  JOIN page ON question.page_id = page.id
  JOIN module ON page.module_id = module.id
  WHERE module.qnaire_id = NEW.qnaire_id;
  
  INSERT IGNORE INTO question_option_description( question_option_id, language_id, type )
  SELECT question_option.id, NEW.language_id, type.name
  FROM ( SELECT "prompt" AS name UNION SELECT "popup" AS name ) AS type, question_option
  JOIN question ON question_option.question_id = question.id
  JOIN page ON question.page_id = page.id
  JOIN module ON page.module_id = module.id
  WHERE module.qnaire_id = NEW.qnaire_id;
END$$

DROP TRIGGER IF EXISTS qnaire_has_language_AFTER_DELETE $$
CREATE DEFINER = CURRENT_USER TRIGGER qnaire_has_language_AFTER_DELETE AFTER DELETE ON qnaire_has_language FOR EACH ROW
BEGIN
  DELETE FROM qnaire_description
  WHERE language_id = OLD.language_id
  AND qnaire_id = OLD.qnaire_id;

  DELETE FROM module_description
  WHERE language_id = OLD.language_id
  AND module_id IN ( SELECT id FROM (
    SELECT module.id
    FROM module
    WHERE module.qnaire_id = OLD.qnaire_id
  ) AS t );

  DELETE FROM page_description
  WHERE language_id = OLD.language_id
  AND page_id IN ( SELECT id FROM (
    SELECT page.id
    FROM page
    JOIN module ON page.module_id = module.id
    WHERE module.qnaire_id = OLD.qnaire_id
  ) AS t );

  DELETE FROM question_description
  WHERE language_id = OLD.language_id
  AND question_id IN ( SELECT id FROM (
    SELECT question.id
    FROM question
    JOIN page ON question.page_id = page.id
    JOIN module ON page.module_id = module.id
    WHERE module.qnaire_id = OLD.qnaire_id
  ) AS t );

  DELETE FROM question_option_description
  WHERE language_id = OLD.language_id
  AND question_option_id IN ( SELECT id FROM (
    SELECT question_option.id
    FROM question_option
    JOIN question ON question_option.question_id = question.id
    JOIN page ON question.page_id = page.id
    JOIN module ON page.module_id = module.id
    WHERE module.qnaire_id = OLD.qnaire_id
  ) AS t );
END$$

DELIMITER ;
