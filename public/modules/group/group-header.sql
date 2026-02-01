-- group.sql


/* =============================================
 * CREATE TABLE core."group"
 * ============================================*/
create table core."group" (
	group_id int not null,
	constraint group_pk primary key (group_id)
);
comment on table core."group" is '';	


-- =============================================
-- FIELD: group_name text
-- =============================================
-- ADD group_name
alter table core."group" add group_name text  ;
comment on column core."group".group_name is '';

-- MODIFY group_name
alter table core."group"
	alter column group_name type text,
	ALTER COLUMN group_name DROP DEFAULT,
	ALTER COLUMN group_name DROP NOT NULL;
comment on column core."group".group_name is '';


-- =============================================
-- FIELD: group_descr text
-- =============================================
-- ADD group_descr
alter table core."group" add group_descr text  ;
comment on column core."group".group_descr is '';

-- MODIFY group_descr
alter table core."group"
	alter column group_descr type text,
	ALTER COLUMN group_descr DROP DEFAULT,
	ALTER COLUMN group_descr DROP NOT NULL;
comment on column core."group".group_descr is '';


-- =============================================
-- FIELD: group_isdisabled boolean
-- =============================================
-- ADD group_isdisabled
alter table core."group" add group_isdisabled boolean not null default false;
comment on column core."group".group_isdisabled is '';

-- MODIFY group_isdisabled
alter table core."group"
	alter column group_isdisabled type boolean,
	ALTER COLUMN group_isdisabled SET DEFAULT false,
	ALTER COLUMN group_isdisabled SET NOT NULL;
comment on column core."group".group_isdisabled is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."group" add _createby integer not null ;
comment on column core."group"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."group"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."group"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."group" add _createdate timestamp with time zone not null default now();
comment on column core."group"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."group"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."group"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."group" add _modifyby integer  ;
comment on column core."group"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."group"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."group"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."group" add _modifydate timestamp with time zone  ;
comment on column core."group"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."group"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."group"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  core."group"
	add constraint uq$core$group$group_name unique (group_name); 

