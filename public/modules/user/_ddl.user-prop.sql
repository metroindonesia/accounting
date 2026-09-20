-- user.sql


/* =============================================
 * CREATE TABLE core."userprop"
 * ============================================*/
create table core."userprop" (
	userprop_id bigint not null,
	constraint userprop_pk primary key (userprop_id)
);
comment on table core."userprop" is '';	


-- =============================================
-- FIELD: userprop_name varchar(90)
-- =============================================
-- ADD userprop_name
alter table core."userprop" add userprop_name varchar(90)  ;
comment on column core."userprop".userprop_name is '';

-- MODIFY userprop_name
alter table core."userprop"
	alter column userprop_name type varchar(90),
	ALTER COLUMN userprop_name DROP DEFAULT,
	ALTER COLUMN userprop_name DROP NOT NULL;
comment on column core."userprop".userprop_name is '';


-- =============================================
-- FIELD: userprop_value char(30)
-- =============================================
-- ADD userprop_value
alter table core."userprop" add userprop_value char(30)  ;
comment on column core."userprop".userprop_value is '';

-- MODIFY userprop_value
alter table core."userprop"
	alter column userprop_value type char(30),
	ALTER COLUMN userprop_value DROP DEFAULT,
	ALTER COLUMN userprop_value DROP NOT NULL;
comment on column core."userprop".userprop_value is '';


-- =============================================
-- FIELD: user_id int
-- =============================================
-- ADD user_id
alter table core."userprop" add user_id int  ;
comment on column core."userprop".user_id is '';

-- MODIFY user_id
alter table core."userprop"
	alter column user_id type int,
	ALTER COLUMN user_id DROP DEFAULT,
	ALTER COLUMN user_id DROP NOT NULL;
comment on column core."userprop".user_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."userprop" add _createby integer not null ;
comment on column core."userprop"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."userprop"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."userprop"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."userprop" add _createdate timestamp with time zone not null default now();
comment on column core."userprop"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."userprop"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."userprop"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."userprop" add _modifyby integer  ;
comment on column core."userprop"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."userprop"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."userprop"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."userprop" add _modifydate timestamp with time zone  ;
comment on column core."userprop"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."userprop"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."userprop"._modifydate is 'waktu terakhir record dimodifikasi';


-- =============================================
-- FIELD: _timestamp timestamp with time zone
-- =============================================
-- ADD _timestamp
alter table core."userprop" add _timestamp timestamp with time zone not null default now();
comment on column core."userprop"._timestamp is 'data timestamp';

-- MODIFY _timestamp
alter table core."userprop"
	alter column _timestamp type timestamp with time zone,
	ALTER COLUMN _timestamp SET DEFAULT now(),
	ALTER COLUMN _timestamp SET NOT NULL;
comment on column core."userprop"._timestamp is 'data timestamp';


-- =============================================
-- INDEX
-- =============================================
DROP INDEX IF EXISTS core.idx$core$userprop$_timestamp;
CREATE INDEX idx$core$userprop$_timestamp ON core.userprop (_timestamp);




-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."userprop"
	drop constraint uq$core$userprop$userprop_name;
	

-- Add unique index 
alter table  core."userprop"
	add constraint uq$core$userprop$userprop_name unique (userprop_id, userprop_name); 

