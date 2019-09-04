CREATE TABLE IF NOT EXISTS question_answer (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  question_id INT UNSIGNED NOT NULL,
  rank INT UNSIGNED NOT NULL,
  name VARCHAR(127) NULL,
  value VARCHAR(127) NULL,
  PRIMARY KEY (id),
  INDEX fk_question_id (question_id ASC),
  UNIQUE INDEX uq_question_id_rank (question_id ASC, rank ASC),
  UNIQUE INDEX uq_question_id_name (question_id ASC, name ASC),
  CONSTRAINT fk_question_answer_question_id
    FOREIGN KEY (question_id)
    REFERENCES question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
