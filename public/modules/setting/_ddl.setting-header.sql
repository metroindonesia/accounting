-- setting.sql


/* =============================================
 * CREATE TABLE core."setting"
 * ============================================*/
create table core."setting" (
	setting_id varchar(30) not null,
	constraint setting_pk primary key (setting_id)
);
comment on table core."setting" is '';	


-- =============================================
-- FIELD: setting_value text
-- =============================================
-- ADD setting_value
alter table core."setting" add setting_value text  ;
comment on column core."setting".setting_value is '';

-- MODIFY setting_value
alter table core."setting"
	alter column setting_value type text,
	ALTER COLUMN setting_value DROP DEFAULT,
	ALTER COLUMN setting_value DROP NOT NULL;
comment on column core."setting".setting_value is '';


-- =============================================
-- FIELD: setting_descr text
-- =============================================
-- ADD setting_descr
alter table core."setting" add setting_descr text  ;
comment on column core."setting".setting_descr is '';

-- MODIFY setting_descr
alter table core."setting"
	alter column setting_descr type text,
	ALTER COLUMN setting_descr DROP DEFAULT,
	ALTER COLUMN setting_descr DROP NOT NULL;
comment on column core."setting".setting_descr is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."setting" add _createby integer not null ;
comment on column core."setting"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."setting"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."setting"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."setting" add _createdate timestamp with time zone not null default now();
comment on column core."setting"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."setting"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."setting"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."setting" add _modifyby integer  ;
comment on column core."setting"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."setting"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."setting"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."setting" add _modifydate timestamp with time zone  ;
comment on column core."setting"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."setting"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."setting"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================