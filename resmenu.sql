\echo 'Delete and recreate resmenu db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE resmenu;
CREATE DATABASE resmenu;
\connect resmenu

\i resmenu-schema.sql
\i resmenu-seed.sql

\echo 'Delete and recreate resmenu_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE resmenu_test;
CREATE DATABASE resmenu_test;
\connect resmenu_test

\i resmenu-schema.sql
