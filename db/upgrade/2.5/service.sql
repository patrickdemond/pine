SELECT "Creating new service table" AS "";

CREATE TABLE IF NOT EXISTS service(
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  method ENUM('DELETE','GET','PATCH','POST','PUT') NOT NULL,
  subject VARCHAR(45) NOT NULL,
  resource TINYINT(1) NOT NULL DEFAULT 0,
  restricted TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_method_subject_resource (method ASC, subject ASC, resource ASC))
ENGINE = InnoDB;

-- rebuild the service list
DELETE FROM service;
ALTER TABLE service AUTO_INCREMENT = 1;
INSERT INTO service ( subject, method, resource, restricted ) VALUES

-- framework services
( 'access', 'DELETE', 1, 1 ),
( 'access', 'GET', 0, 1 ),
( 'access', 'POST', 0, 1 ),
( 'activity', 'GET', 0, 1 ),
( 'application', 'GET', 0, 1 ),
( 'application', 'GET', 1, 0 ),
( 'application', 'PATCH', 1, 1 ),
( 'application_type', 'GET', 0, 0 ),
( 'application_type', 'GET', 1, 0 ),
( 'cohort', 'GET', 0, 0 ),
( 'failed_login', 'GET', 0, 1 ),
( 'language', 'GET', 0, 0 ),
( 'language', 'GET', 1, 0 ),
( 'overview', 'GET', 0, 0 ),
( 'overview', 'GET', 1, 0 ),
( 'report', 'DELETE', 1, 1 ),
( 'report', 'GET', 0, 1 ),
( 'report', 'GET', 1, 1 ),
( 'report', 'PATCH', 1, 1 ),
( 'report', 'POST', 0, 1 ),
( 'report_restriction', 'DELETE', 1, 1 ),
( 'report_restriction', 'GET', 0, 1 ),
( 'report_restriction', 'GET', 1, 1 ),
( 'report_restriction', 'PATCH', 1, 1 ),
( 'report_restriction', 'POST', 0, 1 ),
( 'report_schedule', 'DELETE', 1, 1 ),
( 'report_schedule', 'GET', 0, 1 ),
( 'report_schedule', 'GET', 1, 1 ),
( 'report_schedule', 'PATCH', 1, 1 ),
( 'report_schedule', 'POST', 0, 1 ),
( 'report_type', 'GET', 0, 1 ),
( 'report_type', 'GET', 1, 1 ),
( 'report_type', 'PATCH', 1, 1 ),
( 'role', 'GET', 0, 0 ),
( 'self', 'DELETE', 1, 0 ),
( 'self', 'GET', 1, 0 ),
( 'self', 'PATCH', 1, 0 ),
( 'self', 'POST', 1, 0 ),
( 'setting', 'GET', 0, 1 ),
( 'setting', 'GET', 1, 0 ),
( 'setting', 'PATCH', 1, 1 ),
( 'site', 'DELETE', 1, 1 ),
( 'site', 'GET', 0, 0 ),
( 'site', 'GET', 1, 1 ),
( 'site', 'PATCH', 1, 1 ),
( 'site', 'POST', 0, 1 ),
( 'system_message', 'DELETE', 1, 1 ),
( 'system_message', 'GET', 0, 0 ),
( 'system_message', 'GET', 1, 1 ),
( 'system_message', 'PATCH', 1, 1 ),
( 'system_message', 'POST', 0, 1 ),
( 'user', 'DELETE', 1, 1 ),
( 'user', 'GET', 0, 0 ),
( 'user', 'GET', 1, 0 ),
( 'user', 'PATCH', 1, 1 ),
( 'user', 'POST', 0, 1 ),

-- application services
( 'answer', 'DELETE', 1, 1 ),
( 'answer', 'GET', 0, 0 ),
( 'answer', 'GET', 1, 0 ),
( 'answer', 'PATCH', 1, 1 ),
( 'answer', 'POST', 0, 1 ),
( 'attribute', 'DELETE', 1, 1 ),
( 'attribute', 'GET', 0, 0 ),
( 'attribute', 'GET', 1, 0 ),
( 'attribute', 'PATCH', 1, 1 ),
( 'attribute', 'POST', 0, 1 ),
( 'module', 'DELETE', 1, 1 ),
( 'module', 'GET', 0, 0 ),
( 'module', 'GET', 1, 0 ),
( 'module', 'PATCH', 1, 1 ),
( 'module', 'POST', 0, 1 ),
( 'page', 'DELETE', 1, 1 ),
( 'page', 'GET', 0, 0 ),
( 'page', 'GET', 1, 0 ),
( 'page', 'PATCH', 1, 1 ),
( 'page', 'POST', 0, 1 ),
( 'question', 'DELETE', 1, 1 ),
( 'question', 'GET', 0, 0 ),
( 'question', 'GET', 1, 0 ),
( 'question', 'PATCH', 1, 1 ),
( 'question', 'POST', 0, 1 ),
( 'question_answer', 'DELETE', 1, 1 ),
( 'question_answer', 'GET', 0, 0 ),
( 'question_answer', 'GET', 1, 0 ),
( 'question_answer', 'PATCH', 1, 1 ),
( 'question_answer', 'POST', 0, 1 ),
( 'requisite', 'DELETE', 1, 1 ),
( 'requisite', 'GET', 0, 0 ),
( 'requisite', 'GET', 1, 0 ),
( 'requisite', 'PATCH', 1, 1 ),
( 'requisite', 'POST', 0, 1 ),
( 'requisite_group', 'DELETE', 1, 1 ),
( 'requisite_group', 'GET', 0, 0 ),
( 'requisite_group', 'GET', 1, 0 ),
( 'requisite_group', 'PATCH', 1, 1 ),
( 'requisite_group', 'POST', 0, 1 ),
( 'response', 'DELETE', 1, 1 ),
( 'response', 'GET', 0, 0 ),
( 'response', 'GET', 1, 0 ),
( 'response', 'PATCH', 1, 1 ),
( 'response', 'POST', 0, 1 ),
( 'response_attribute', 'DELETE', 1, 1 ),
( 'response_attribute', 'GET', 0, 0 ),
( 'response_attribute', 'GET', 1, 0 ),
( 'response_attribute', 'PATCH', 1, 1 ),
( 'response_attribute', 'POST', 0, 1 ),
( 'survey', 'DELETE', 1, 1 ),
( 'survey', 'GET', 0, 0 ),
( 'survey', 'GET', 1, 0 ),
( 'survey', 'PATCH', 1, 1 ),
( 'survey', 'POST', 0, 1 );
