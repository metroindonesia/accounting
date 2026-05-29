-- group.sql


/* =============================================
 * CREATE TABLE core."grouppermission"
 * ============================================*/
create table core."grouppermission" (
	grouppermission_id bigint not null,
	constraint grouppermission_pk primary key (grouppermission_id)
);
comment on table core."grouppermission" is '';	


-- =============================================
-- FIELD: permission_id int
-- =============================================
-- ADD permission_id
alter table core."grouppermission" add permission_id int  ;
comment on column core."grouppermission".permission_id is '';

-- MODIFY permission_id
alter table core."grouppermission"
	alter column permission_id type int,
	ALTER COLUMN permission_id DROP DEFAULT,
	ALTER COLUMN permission_id DROP NOT NULL;
comment on column core."grouppermission".permission_id is '';


-- =============================================
-- FIELD: permission_value text
-- =============================================
-- ADD permission_value
alter table core."grouppermission" add permission_value text  ;
comment on column core."grouppermission".permission_value is '';

-- MODIFY permission_value
alter table core."grouppermission"
	alter column permission_value type text,
	ALTER COLUMN permission_value DROP DEFAULT,
	ALTER COLUMN permission_value DROP NOT NULL;
comment on column core."grouppermission".permission_value is '';


-- =============================================
-- FIELD: group_id int
-- =============================================
-- ADD group_id
alter table core."grouppermission" add group_id int  ;
comment on column core."grouppermission".group_id is '';

-- MODIFY group_id
alter table core."grouppermission"
	alter column group_id type int,
	ALTER COLUMN group_id DROP DEFAULT,
	ALTER COLUMN group_id DROP NOT NULL;
comment on column core."grouppermission".group_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."grouppermission" add _createby integer not null ;
comment on column core."grouppermission"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."grouppermission"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."grouppermission"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."grouppermission" add _createdate timestamp with time zone not null default now();
comment on column core."grouppermission"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."grouppermission"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."grouppermission"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."grouppermission" add _modifyby integer  ;
comment on column core."grouppermission"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."grouppermission"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."grouppermission"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."grouppermission" add _modifydate timestamp with time zone  ;
comment on column core."grouppermission"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."grouppermission"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."grouppermission"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE core."grouppermission"
	ADD CONSTRAINT fk$core$grouppermission$permission_id
	FOREIGN KEY (permission_id)
	REFERENCES core."permission"(permission_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$grouppermission$permission_id;
CREATE INDEX idx_fk$core$grouppermission$permission_id ON core."grouppermission"(permission_id);	


ALTER TABLE core."grouppermission"
	ADD CONSTRAINT fk$core$grouppermission$group_id
	FOREIGN KEY (group_id)
	REFERENCES core."group"(group_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$grouppermission$group_id;
CREATE INDEX idx_fk$core$grouppermission$group_id ON core."grouppermission"(group_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  core."grouppermission"
	add constraint uq$core$grouppermission$grouppermission_pair unique (group_id, permission_id); 

