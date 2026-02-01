-- user.sql


/* =============================================
 * CREATE TABLE core."user"
 * ============================================*/
create table core."user" (
	user_id int not null,
	constraint user_pk primary key (user_id)
);
comment on table core."user" is 'daftar user untuk kerperluan login';	


-- =============================================
-- FIELD: user_name varchar(30)
-- =============================================
-- ADD user_name
alter table core."user" add user_name varchar(30)  ;
comment on column core."user".user_name is '';

-- MODIFY user_name
alter table core."user"
	alter column user_name type varchar(30),
	ALTER COLUMN user_name DROP DEFAULT,
	ALTER COLUMN user_name DROP NOT NULL;
comment on column core."user".user_name is '';


-- =============================================
-- FIELD: user_isdisabled boolean
-- =============================================
-- ADD user_isdisabled
alter table core."user" add user_isdisabled boolean not null default false;
comment on column core."user".user_isdisabled is '';

-- MODIFY user_isdisabled
alter table core."user"
	alter column user_isdisabled type boolean,
	ALTER COLUMN user_isdisabled SET DEFAULT false,
	ALTER COLUMN user_isdisabled SET NOT NULL;
comment on column core."user".user_isdisabled is '';


-- =============================================
-- FIELD: user_nickname text
-- =============================================
-- ADD user_nickname
alter table core."user" add user_nickname text  ;
comment on column core."user".user_nickname is '';

-- MODIFY user_nickname
alter table core."user"
	alter column user_nickname type text,
	ALTER COLUMN user_nickname DROP DEFAULT,
	ALTER COLUMN user_nickname DROP NOT NULL;
comment on column core."user".user_nickname is '';


-- =============================================
-- FIELD: user_fullname text
-- =============================================
-- ADD user_fullname
alter table core."user" add user_fullname text  ;
comment on column core."user".user_fullname is '';

-- MODIFY user_fullname
alter table core."user"
	alter column user_fullname type text,
	ALTER COLUMN user_fullname DROP DEFAULT,
	ALTER COLUMN user_fullname DROP NOT NULL;
comment on column core."user".user_fullname is '';


-- =============================================
-- FIELD: user_email text
-- =============================================
-- ADD user_email
alter table core."user" add user_email text  ;
comment on column core."user".user_email is '';

-- MODIFY user_email
alter table core."user"
	alter column user_email type text,
	ALTER COLUMN user_email DROP DEFAULT,
	ALTER COLUMN user_email DROP NOT NULL;
comment on column core."user".user_email is '';


-- =============================================
-- FIELD: user_password text
-- =============================================
-- ADD user_password
alter table core."user" add user_password text  ;
comment on column core."user".user_password is '';

-- MODIFY user_password
alter table core."user"
	alter column user_password type text,
	ALTER COLUMN user_password DROP DEFAULT,
	ALTER COLUMN user_password DROP NOT NULL;
comment on column core."user".user_password is '';


-- =============================================
-- FIELD: user_isdev boolean
-- =============================================
-- ADD user_isdev
alter table core."user" add user_isdev boolean not null default false;
comment on column core."user".user_isdev is '';

-- MODIFY user_isdev
alter table core."user"
	alter column user_isdev type boolean,
	ALTER COLUMN user_isdev SET DEFAULT false,
	ALTER COLUMN user_isdev SET NOT NULL;
comment on column core."user".user_isdev is '';


-- =============================================
-- FIELD: user_isshowallprogram boolean
-- =============================================
-- ADD user_isshowallprogram
alter table core."user" add user_isshowallprogram boolean not null default false;
comment on column core."user".user_isshowallprogram is '';

-- MODIFY user_isshowallprogram
alter table core."user"
	alter column user_isshowallprogram type boolean,
	ALTER COLUMN user_isshowallprogram SET DEFAULT false,
	ALTER COLUMN user_isshowallprogram SET NOT NULL;
comment on column core."user".user_isshowallprogram is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."user" add _createby integer not null ;
comment on column core."user"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."user"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."user"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."user" add _createdate timestamp with time zone not null default now();
comment on column core."user"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."user"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."user"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."user" add _modifyby integer  ;
comment on column core."user"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."user"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."user"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."user" add _modifydate timestamp with time zone  ;
comment on column core."user"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."user"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."user"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table core."user"
	drop constraint uq$core$user$user_name;
	

-- Add unique index 
alter table  core."user"
	add constraint uq$core$user$user_name unique (user_name); 

