-- role.sql


/* =============================================
 * CREATE TABLE core."rolepermission"
 * ============================================*/
create table core."rolepermission" (
	rolepermission_id bigint not null,
	constraint rolepermission_pk primary key (rolepermission_id)
);
comment on table core."rolepermission" is '';	


-- =============================================
-- FIELD: permission_id int
-- =============================================
-- ADD permission_id
alter table core."rolepermission" add permission_id int  ;
comment on column core."rolepermission".permission_id is '';

-- MODIFY permission_id
alter table core."rolepermission"
	alter column permission_id type int,
	ALTER COLUMN permission_id DROP DEFAULT,
	ALTER COLUMN permission_id DROP NOT NULL;
comment on column core."rolepermission".permission_id is '';


-- =============================================
-- FIELD: role_id int
-- =============================================
-- ADD role_id
alter table core."rolepermission" add role_id int  ;
comment on column core."rolepermission".role_id is '';

-- MODIFY role_id
alter table core."rolepermission"
	alter column role_id type int,
	ALTER COLUMN role_id DROP DEFAULT,
	ALTER COLUMN role_id DROP NOT NULL;
comment on column core."rolepermission".role_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."rolepermission" add _createby integer not null ;
comment on column core."rolepermission"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."rolepermission"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."rolepermission"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."rolepermission" add _createdate timestamp with time zone not null default now();
comment on column core."rolepermission"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."rolepermission"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."rolepermission"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."rolepermission" add _modifyby integer  ;
comment on column core."rolepermission"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."rolepermission"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."rolepermission"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."rolepermission" add _modifydate timestamp with time zone  ;
comment on column core."rolepermission"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."rolepermission"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."rolepermission"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE core."rolepermission" DROP CONSTRAINT fk$core$rolepermission$permission_id;
ALTER TABLE core."rolepermission" DROP CONSTRAINT fk$core$rolepermission$role_id;


-- Add Foreign Key Constraint  
ALTER TABLE core."rolepermission"
	ADD CONSTRAINT fk$core$rolepermission$permission_id
	FOREIGN KEY (permission_id)
	REFERENCES core."permission"(permission_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$rolepermission$permission_id;
CREATE INDEX idx_fk$core$rolepermission$permission_id ON core."rolepermission"(permission_id);	


ALTER TABLE core."rolepermission"
	ADD CONSTRAINT fk$core$rolepermission$role_id
	FOREIGN KEY (role_id)
	REFERENCES core."role"(role_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$rolepermission$role_id;
CREATE INDEX idx_fk$core$rolepermission$role_id ON core."rolepermission"(role_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."rolepermission"
	drop constraint uq$core$rolepermission$rolepermission_pair;
	

-- Add unique index 
alter table  core."rolepermission"
	add constraint uq$core$rolepermission$rolepermission_pair unique (role_id, permission_id); 

