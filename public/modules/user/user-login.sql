-- user.sql


/* =============================================
 * CREATE TABLE core."userlogin"
 * ============================================*/
create table core."userlogin" (
	userlogin_id bigint not null,
	constraint userlogin_pk primary key (userlogin_id)
);
comment on table core."userlogin" is '';	


-- =============================================
-- FIELD: userlogin_name text
-- =============================================
-- ADD userlogin_name
alter table core."userlogin" add userlogin_name text  ;
comment on column core."userlogin".userlogin_name is '';

-- MODIFY userlogin_name
alter table core."userlogin"
	alter column userlogin_name type text,
	ALTER COLUMN userlogin_name DROP DEFAULT,
	ALTER COLUMN userlogin_name DROP NOT NULL;
comment on column core."userlogin".userlogin_name is '';


-- =============================================
-- FIELD: user_id int
-- =============================================
-- ADD user_id
alter table core."userlogin" add user_id int  ;
comment on column core."userlogin".user_id is '';

-- MODIFY user_id
alter table core."userlogin"
	alter column user_id type int,
	ALTER COLUMN user_id DROP DEFAULT,
	ALTER COLUMN user_id DROP NOT NULL;
comment on column core."userlogin".user_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."userlogin" add _createby integer not null ;
comment on column core."userlogin"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."userlogin"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."userlogin"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."userlogin" add _createdate timestamp with time zone not null default now();
comment on column core."userlogin"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."userlogin"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."userlogin"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."userlogin" add _modifyby integer  ;
comment on column core."userlogin"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."userlogin"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."userlogin"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."userlogin" add _modifydate timestamp with time zone  ;
comment on column core."userlogin"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."userlogin"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."userlogin"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE core."userlogin"
	ADD CONSTRAINT fk$core$userlogin$user_id
	FOREIGN KEY (user_id)
	REFERENCES core."user"(user_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$userlogin$user_id;
CREATE INDEX idx_fk$core$userlogin$user_id ON core."userlogin"(user_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  core."userlogin"
	add constraint uq$core$userlogin$userlogin_name unique (userlogin_name); 

