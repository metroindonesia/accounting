-- interface.sql


/* =============================================
 * CREATE TABLE core."interface"
 * ============================================*/
create table core."interface" (
	interface_id smallint not null,
	constraint interface_pk primary key (interface_id)
);
comment on table core."interface" is '';	


-- =============================================
-- FIELD: interface_name text
-- =============================================
-- ADD interface_name
alter table core."interface" add interface_name text  ;
comment on column core."interface".interface_name is '';

-- MODIFY interface_name
alter table core."interface"
	alter column interface_name type text,
	ALTER COLUMN interface_name DROP DEFAULT,
	ALTER COLUMN interface_name DROP NOT NULL;
comment on column core."interface".interface_name is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."interface" add _createby integer not null ;
comment on column core."interface"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."interface"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."interface"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."interface" add _createdate timestamp with time zone not null default now();
comment on column core."interface"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."interface"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."interface"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."interface" add _modifyby integer  ;
comment on column core."interface"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."interface"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."interface"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."interface" add _modifydate timestamp with time zone  ;
comment on column core."interface"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."interface"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."interface"._modifydate is 'waktu terakhir record dimodifikasi';


-- =============================================
-- FIELD: _timestamp timestamp with time zone
-- =============================================
-- ADD _timestamp
alter table core."interface" add _timestamp timestamp with time zone not null default now();
comment on column core."interface"._timestamp is 'data timestamp';

-- MODIFY _timestamp
alter table core."interface"
	alter column _timestamp type timestamp with time zone,
	ALTER COLUMN _timestamp SET DEFAULT now(),
	ALTER COLUMN _timestamp SET NOT NULL;
comment on column core."interface"._timestamp is 'data timestamp';


-- =============================================
-- INDEX
-- =============================================
DROP INDEX IF EXISTS core.idx$core$interface$_timestamp;
CREATE INDEX idx$core$interface$_timestamp ON core.interface (_timestamp);




-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."interface"
	drop constraint uq$core$interface$interface_name;
	

-- Add unique index 
alter table  core."interface"
	add constraint uq$core$interface$interface_name unique (interface_name); 

