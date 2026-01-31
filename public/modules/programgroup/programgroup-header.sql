-- programgroup.sql


/* =============================================
 * CREATE TABLE core."programgroup"
 * ============================================*/
create table core."programgroup" (
	programgroup_id int not null,
	constraint programgroup_pk primary key (programgroup_id)
);
comment on table core."programgroup" is 'daftar grouping program hierarki';	


-- =============================================
-- FIELD: programgroup_isparent boolean
-- =============================================
-- ADD programgroup_isparent
alter table core."programgroup" add programgroup_isparent boolean not null default false;
comment on column core."programgroup".programgroup_isparent is '';

-- MODIFY programgroup_isparent
alter table core."programgroup"
	alter column programgroup_isparent type boolean,
	ALTER COLUMN programgroup_isparent SET DEFAULT false,
	ALTER COLUMN programgroup_isparent SET NOT NULL;
comment on column core."programgroup".programgroup_isparent is '';


-- =============================================
-- FIELD: programgroup_name text
-- =============================================
-- ADD programgroup_name
alter table core."programgroup" add programgroup_name text  ;
comment on column core."programgroup".programgroup_name is '';

-- MODIFY programgroup_name
alter table core."programgroup"
	alter column programgroup_name type text,
	ALTER COLUMN programgroup_name DROP DEFAULT,
	ALTER COLUMN programgroup_name DROP NOT NULL;
comment on column core."programgroup".programgroup_name is '';


-- =============================================
-- FIELD: programgroup_parent int
-- =============================================
-- ADD programgroup_parent
alter table core."programgroup" add programgroup_parent int  ;
comment on column core."programgroup".programgroup_parent is '';

-- MODIFY programgroup_parent
alter table core."programgroup"
	alter column programgroup_parent type int,
	ALTER COLUMN programgroup_parent DROP DEFAULT,
	ALTER COLUMN programgroup_parent DROP NOT NULL;
comment on column core."programgroup".programgroup_parent is '';


-- =============================================
-- FIELD: programgroup_descr text
-- =============================================
-- ADD programgroup_descr
alter table core."programgroup" add programgroup_descr text  ;
comment on column core."programgroup".programgroup_descr is '';

-- MODIFY programgroup_descr
alter table core."programgroup"
	alter column programgroup_descr type text,
	ALTER COLUMN programgroup_descr DROP DEFAULT,
	ALTER COLUMN programgroup_descr DROP NOT NULL;
comment on column core."programgroup".programgroup_descr is '';


-- =============================================
-- FIELD: programgroup_icon text
-- =============================================
-- ADD programgroup_icon
alter table core."programgroup" add programgroup_icon text  ;
comment on column core."programgroup".programgroup_icon is '';

-- MODIFY programgroup_icon
alter table core."programgroup"
	alter column programgroup_icon type text,
	ALTER COLUMN programgroup_icon DROP DEFAULT,
	ALTER COLUMN programgroup_icon DROP NOT NULL;
comment on column core."programgroup".programgroup_icon is '';


-- =============================================
-- FIELD: programgroup_level int
-- =============================================
-- ADD programgroup_level
alter table core."programgroup" add programgroup_level int not null default 0;
comment on column core."programgroup".programgroup_level is '';

-- MODIFY programgroup_level
alter table core."programgroup"
	alter column programgroup_level type int,
	ALTER COLUMN programgroup_level SET DEFAULT 0,
	ALTER COLUMN programgroup_level SET NOT NULL;
comment on column core."programgroup".programgroup_level is '';


-- =============================================
-- FIELD: programgroup_pathid text
-- =============================================
-- ADD programgroup_pathid
alter table core."programgroup" add programgroup_pathid text  ;
comment on column core."programgroup".programgroup_pathid is '';

-- MODIFY programgroup_pathid
alter table core."programgroup"
	alter column programgroup_pathid type text,
	ALTER COLUMN programgroup_pathid DROP DEFAULT,
	ALTER COLUMN programgroup_pathid DROP NOT NULL;
comment on column core."programgroup".programgroup_pathid is '';


-- =============================================
-- FIELD: programgroup_path text
-- =============================================
-- ADD programgroup_path
alter table core."programgroup" add programgroup_path text  ;
comment on column core."programgroup".programgroup_path is '';

-- MODIFY programgroup_path
alter table core."programgroup"
	alter column programgroup_path type text,
	ALTER COLUMN programgroup_path DROP DEFAULT,
	ALTER COLUMN programgroup_path DROP NOT NULL;
comment on column core."programgroup".programgroup_path is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."programgroup" add _createby integer not null ;
comment on column core."programgroup"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."programgroup"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."programgroup"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."programgroup" add _createdate timestamp with time zone not null default now();
comment on column core."programgroup"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."programgroup"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."programgroup"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."programgroup" add _modifyby integer  ;
comment on column core."programgroup"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."programgroup"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."programgroup"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."programgroup" add _modifydate timestamp with time zone  ;
comment on column core."programgroup"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."programgroup"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."programgroup"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE core."programgroup" DROP CONSTRAINT fk$core$programgroup$programgroup_parent;


-- Add Foreign Key Constraint  
ALTER TABLE core."programgroup"
	ADD CONSTRAINT fk$core$programgroup$programgroup_parent
	FOREIGN KEY (programgroup_parent)
	REFERENCES core."programgroup"(programgroup_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$programgroup$programgroup_parent;
CREATE INDEX idx_fk$core$programgroup$programgroup_parent ON core."programgroup"(programgroup_parent);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."programgroup"
	drop constraint uq$core$programgroup$programgroup_name;
	

-- Add unique index 
alter table  core."programgroup"
	add constraint uq$core$programgroup$programgroup_name unique (programgroup_parent, programgroup_name); 

