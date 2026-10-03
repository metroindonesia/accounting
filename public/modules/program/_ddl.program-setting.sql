-- program.sql


/* =============================================
 * CREATE TABLE core."programsetting"
 * ============================================*/
create table core."programsetting" (
	programsetting_id bigint not null,
	constraint programsetting_pk primary key (programsetting_id)
);
comment on table core."programsetting" is '';	


-- =============================================
-- FIELD: setting_name text
-- =============================================
-- ADD setting_name
alter table core."programsetting" add setting_name text  ;
comment on column core."programsetting".setting_name is '';

-- MODIFY setting_name
alter table core."programsetting"
	alter column setting_name type text,
	ALTER COLUMN setting_name DROP DEFAULT,
	ALTER COLUMN setting_name DROP NOT NULL;
comment on column core."programsetting".setting_name is '';


-- =============================================
-- FIELD: setting_value text
-- =============================================
-- ADD setting_value
alter table core."programsetting" add setting_value text  ;
comment on column core."programsetting".setting_value is '';

-- MODIFY setting_value
alter table core."programsetting"
	alter column setting_value type text,
	ALTER COLUMN setting_value DROP DEFAULT,
	ALTER COLUMN setting_value DROP NOT NULL;
comment on column core."programsetting".setting_value is '';


-- =============================================
-- FIELD: setting_descr text
-- =============================================
-- ADD setting_descr
alter table core."programsetting" add setting_descr text  ;
comment on column core."programsetting".setting_descr is '';

-- MODIFY setting_descr
alter table core."programsetting"
	alter column setting_descr type text,
	ALTER COLUMN setting_descr DROP DEFAULT,
	ALTER COLUMN setting_descr DROP NOT NULL;
comment on column core."programsetting".setting_descr is '';


-- =============================================
-- FIELD: setting_data json
-- =============================================
-- ADD setting_data
alter table core."programsetting" add setting_data json  ;
comment on column core."programsetting".setting_data is '';

-- MODIFY setting_data
alter table core."programsetting"
	alter column setting_data type json,
	ALTER COLUMN setting_data DROP DEFAULT,
	ALTER COLUMN setting_data DROP NOT NULL;
comment on column core."programsetting".setting_data is '';


-- =============================================
-- FIELD: program_id int
-- =============================================
-- ADD program_id
alter table core."programsetting" add program_id int  ;
comment on column core."programsetting".program_id is '';

-- MODIFY program_id
alter table core."programsetting"
	alter column program_id type int,
	ALTER COLUMN program_id DROP DEFAULT,
	ALTER COLUMN program_id DROP NOT NULL;
comment on column core."programsetting".program_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."programsetting" add _createby integer not null ;
comment on column core."programsetting"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."programsetting"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."programsetting"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."programsetting" add _createdate timestamp with time zone not null default now();
comment on column core."programsetting"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."programsetting"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."programsetting"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."programsetting" add _modifyby integer  ;
comment on column core."programsetting"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."programsetting"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."programsetting"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."programsetting" add _modifydate timestamp with time zone  ;
comment on column core."programsetting"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."programsetting"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."programsetting"._modifydate is 'waktu terakhir record dimodifikasi';


-- =============================================
-- FIELD: _timestamp timestamp with time zone
-- =============================================
-- ADD _timestamp
alter table core."programsetting" add _timestamp timestamp with time zone not null default now();
comment on column core."programsetting"._timestamp is 'data timestamp';

-- MODIFY _timestamp
alter table core."programsetting"
	alter column _timestamp type timestamp with time zone,
	ALTER COLUMN _timestamp SET DEFAULT now(),
	ALTER COLUMN _timestamp SET NOT NULL;
comment on column core."programsetting"._timestamp is 'data timestamp';


-- =============================================
-- INDEX
-- =============================================
DROP INDEX IF EXISTS core.idx$core$programsetting$_timestamp;
CREATE INDEX idx$core$programsetting$_timestamp ON core.programsetting (_timestamp);




-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."programsetting"
	drop constraint uq$core$programsetting$programsetting_pair;
	

-- Add unique index 
alter table  core."programsetting"
	add constraint uq$core$programsetting$programsetting_pair unique (programsetting_id, setting_name); 

