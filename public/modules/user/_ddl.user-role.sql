-- user.sql


/* =============================================
 * CREATE TABLE core."userrole"
 * ============================================*/
create table core."userrole" (
	userrole_id bigint not null,
	constraint userrole_pk primary key (userrole_id)
);
comment on table core."userrole" is '';	


-- =============================================
-- FIELD: role_id int
-- =============================================
-- ADD role_id
alter table core."userrole" add role_id int  ;
comment on column core."userrole".role_id is '';

-- MODIFY role_id
alter table core."userrole"
	alter column role_id type int,
	ALTER COLUMN role_id DROP DEFAULT,
	ALTER COLUMN role_id DROP NOT NULL;
comment on column core."userrole".role_id is '';


-- =============================================
-- FIELD: user_id int
-- =============================================
-- ADD user_id
alter table core."userrole" add user_id int  ;
comment on column core."userrole".user_id is '';

-- MODIFY user_id
alter table core."userrole"
	alter column user_id type int,
	ALTER COLUMN user_id DROP DEFAULT,
	ALTER COLUMN user_id DROP NOT NULL;
comment on column core."userrole".user_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."userrole" add _createby integer not null ;
comment on column core."userrole"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."userrole"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."userrole"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."userrole" add _createdate timestamp with time zone not null default now();
comment on column core."userrole"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."userrole"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."userrole"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."userrole" add _modifyby integer  ;
comment on column core."userrole"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."userrole"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."userrole"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."userrole" add _modifydate timestamp with time zone  ;
comment on column core."userrole"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."userrole"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."userrole"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE core."userrole" DROP CONSTRAINT fk$core$userrole$role_id;
ALTER TABLE core."userrole" DROP CONSTRAINT fk$core$userrole$user_id;


-- Add Foreign Key Constraint  
ALTER TABLE core."userrole"
	ADD CONSTRAINT fk$core$userrole$role_id
	FOREIGN KEY (role_id)
	REFERENCES core."role"(role_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$userrole$role_id;
CREATE INDEX idx_fk$core$userrole$role_id ON core."userrole"(role_id);	


ALTER TABLE core."userrole"
	ADD CONSTRAINT fk$core$userrole$user_id
	FOREIGN KEY (user_id)
	REFERENCES core."user"(user_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$userrole$user_id;
CREATE INDEX idx_fk$core$userrole$user_id ON core."userrole"(user_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."userrole"
	drop constraint uq$core$userrole$userrole_pair;
	

-- Add unique index 
alter table  core."userrole"
	add constraint uq$core$userrole$userrole_pair unique (user_id, role_id); 

