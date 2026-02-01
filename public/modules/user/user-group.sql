-- user.sql


/* =============================================
 * CREATE TABLE core."usergroup"
 * ============================================*/
create table core."usergroup" (
	usergroup_id bigint not null,
	constraint usergroup_pk primary key (usergroup_id)
);
comment on table core."usergroup" is '';	


-- =============================================
-- FIELD: group_id int
-- =============================================
-- ADD group_id
alter table core."usergroup" add group_id int  ;
comment on column core."usergroup".group_id is '';

-- MODIFY group_id
alter table core."usergroup"
	alter column group_id type int,
	ALTER COLUMN group_id DROP DEFAULT,
	ALTER COLUMN group_id DROP NOT NULL;
comment on column core."usergroup".group_id is '';


-- =============================================
-- FIELD: usergroup_isdisabled boolean
-- =============================================
-- ADD usergroup_isdisabled
alter table core."usergroup" add usergroup_isdisabled boolean not null default false;
comment on column core."usergroup".usergroup_isdisabled is '';

-- MODIFY usergroup_isdisabled
alter table core."usergroup"
	alter column usergroup_isdisabled type boolean,
	ALTER COLUMN usergroup_isdisabled SET DEFAULT false,
	ALTER COLUMN usergroup_isdisabled SET NOT NULL;
comment on column core."usergroup".usergroup_isdisabled is '';


-- =============================================
-- FIELD: user_id int
-- =============================================
-- ADD user_id
alter table core."usergroup" add user_id int  ;
comment on column core."usergroup".user_id is '';

-- MODIFY user_id
alter table core."usergroup"
	alter column user_id type int,
	ALTER COLUMN user_id DROP DEFAULT,
	ALTER COLUMN user_id DROP NOT NULL;
comment on column core."usergroup".user_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."usergroup" add _createby integer not null ;
comment on column core."usergroup"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."usergroup"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."usergroup"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."usergroup" add _createdate timestamp with time zone not null default now();
comment on column core."usergroup"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."usergroup"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."usergroup"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."usergroup" add _modifyby integer  ;
comment on column core."usergroup"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."usergroup"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."usergroup"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."usergroup" add _modifydate timestamp with time zone  ;
comment on column core."usergroup"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."usergroup"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."usergroup"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE core."usergroup"
	ADD CONSTRAINT fk$core$usergroup$group_id
	FOREIGN KEY (group_id)
	REFERENCES core."group"(group_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$usergroup$group_id;
CREATE INDEX idx_fk$core$usergroup$group_id ON core."usergroup"(group_id);	


ALTER TABLE core."usergroup"
	ADD CONSTRAINT fk$core$usergroup$user_id
	FOREIGN KEY (user_id)
	REFERENCES core."user"(user_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$usergroup$user_id;
CREATE INDEX idx_fk$core$usergroup$user_id ON core."usergroup"(user_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================