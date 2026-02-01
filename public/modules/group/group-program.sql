-- group.sql


/* =============================================
 * CREATE TABLE core."groupprogram"
 * ============================================*/
create table core."groupprogram" (
	groupprogram_id bigint not null,
	constraint groupprogram_pk primary key (groupprogram_id)
);
comment on table core."groupprogram" is '';	


-- =============================================
-- FIELD: program_id int
-- =============================================
-- ADD program_id
alter table core."groupprogram" add program_id int  ;
comment on column core."groupprogram".program_id is '';

-- MODIFY program_id
alter table core."groupprogram"
	alter column program_id type int,
	ALTER COLUMN program_id DROP DEFAULT,
	ALTER COLUMN program_id DROP NOT NULL;
comment on column core."groupprogram".program_id is '';


-- =============================================
-- FIELD: groupprogram_isdisabled boolean
-- =============================================
-- ADD groupprogram_isdisabled
alter table core."groupprogram" add groupprogram_isdisabled boolean not null default false;
comment on column core."groupprogram".groupprogram_isdisabled is '';

-- MODIFY groupprogram_isdisabled
alter table core."groupprogram"
	alter column groupprogram_isdisabled type boolean,
	ALTER COLUMN groupprogram_isdisabled SET DEFAULT false,
	ALTER COLUMN groupprogram_isdisabled SET NOT NULL;
comment on column core."groupprogram".groupprogram_isdisabled is '';


-- =============================================
-- FIELD: group_id int
-- =============================================
-- ADD group_id
alter table core."groupprogram" add group_id int  ;
comment on column core."groupprogram".group_id is '';

-- MODIFY group_id
alter table core."groupprogram"
	alter column group_id type int,
	ALTER COLUMN group_id DROP DEFAULT,
	ALTER COLUMN group_id DROP NOT NULL;
comment on column core."groupprogram".group_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."groupprogram" add _createby integer not null ;
comment on column core."groupprogram"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."groupprogram"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."groupprogram"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."groupprogram" add _createdate timestamp with time zone not null default now();
comment on column core."groupprogram"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."groupprogram"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."groupprogram"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."groupprogram" add _modifyby integer  ;
comment on column core."groupprogram"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."groupprogram"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."groupprogram"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."groupprogram" add _modifydate timestamp with time zone  ;
comment on column core."groupprogram"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."groupprogram"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."groupprogram"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE core."groupprogram"
	ADD CONSTRAINT fk$core$groupprogram$program_id
	FOREIGN KEY (program_id)
	REFERENCES core."program"(program_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$groupprogram$program_id;
CREATE INDEX idx_fk$core$groupprogram$program_id ON core."groupprogram"(program_id);	


ALTER TABLE core."groupprogram"
	ADD CONSTRAINT fk$core$groupprogram$group_id
	FOREIGN KEY (group_id)
	REFERENCES core."group"(group_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$groupprogram$group_id;
CREATE INDEX idx_fk$core$groupprogram$group_id ON core."groupprogram"(group_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  core."groupprogram"
	add constraint uq$core$groupprogram$groupprogram_pair unique (group_id, program_id); 

