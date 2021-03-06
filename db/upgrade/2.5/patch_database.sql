-- Patch to upgrade database to version 2.5

SET AUTOCOMMIT=0;

SOURCE application_type.sql
SOURCE application_type_has_role.sql
SOURCE application.sql
SOURCE application_has_site.sql

SOURCE role.sql
SOURCE user.sql
SOURCE access.sql
SOURCE service.sql
SOURCE role_has_service.sql
SOURCE setting.sql
SOURCE writelog.sql

SOURCE qnaire.sql
SOURCE qnaire_average_time.sql
SOURCE qnaire_description.sql
SOURCE qnaire_has_language.sql
SOURCE qnaire_consent_type.sql
SOURCE attribute.sql
SOURCE module.sql
SOURCE module_average_time.sql
SOURCE module_description.sql
SOURCE page.sql
SOURCE page_average_time.sql
SOURCE page_description.sql
SOURCE question.sql
SOURCE question_description.sql
SOURCE question_option.sql
SOURCE question_option_description.sql
SOURCE respondent.sql
SOURCE respondent_mail.sql
SOURCE response.sql
SOURCE respondent_current_response.sql
SOURCE response_attribute.sql
SOURCE answer.sql
SOURCE page_time.sql
SOURCE overview.sql
SOURCE application_type_has_overview.sql
SOURCE role_has_overview.sql

SOURCE report_type.sql
SOURCE application_type_has_report_type.sql
SOURCE role_has_report_type.sql
SOURCE report_restriction.sql

SOURCE update_respondent_current_response.sql

SOURCE update_version_number.sql

COMMIT;
