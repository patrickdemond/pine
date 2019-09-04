CREATE TABLE IF NOT EXISTS response_attribute (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  response_id INT UNSIGNED NOT NULL,
  attribute_id INT UNSIGNED NOT NULL,
  value VARCHAR(127) NULL,
  PRIMARY KEY (id),
  INDEX fk_response_id (response_id ASC),
  INDEX fk_attribute_id (attribute_id ASC),
  CONSTRAINT fk_response_attribute_response_id
    FOREIGN KEY (response_id)
    REFERENCES response (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_response_attribute_attribute_id
    FOREIGN KEY (attribute_id)
    REFERENCES attribute (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
