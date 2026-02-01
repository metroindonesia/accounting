-- user.sql


/* =============================================
 * CREATE TABLE core."userfavouriteprogram"
 * ============================================*/
create table core."userfavouriteprogram" (
	userfavouriteprogram_id bigint not null,
	constraint userfavouriteprogram_pk primary key (userfavouriteprogram_id)
);
comment on table core."userfavouriteprogram" is '';	


-- =============================================
-- FIELD: program_id int
-- =============================================
-- ADD program_id
alter table core."userfavouriteprogram" add program_id int  ;
comment on column core."userfavouriteprogram".program_id is '';

-- MODIFY program_id
alter table core."userfavouriteprogram"
	alter column program_id type int,
	ALTER COLUMN program_id DROP DEFAULT,
	ALTER COLUMN program_id DROP NOT NULL;
comment on column core."userfavouriteprogram".program_id is '';


-- =============================================
-- FIELD: user_id int
-- =============================================
-- ADD user_id
alter table core."userfavouriteprogram" add user_id int  ;
comment on column core."userfavouriteprogram".user_id is '';

-- MODIFY user_id
alter table core."userfavouriteprogram"
	alter column user_id type int,
	ALTER COLUMN user_id DROP DEFAULT,
	ALTER COLUMN user_id DROP NOT NULL;
comment on column core."userfavouriteprogram".user_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table core."userfavouriteprogram" add _createby integer not null ;
comment on column core."userfavouriteprogram"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table core."userfavouriteprogram"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column core."userfavouriteprogram"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table core."userfavouriteprogram" add _createdate timestamp with time zone not null default now();
comment on column core."userfavouriteprogram"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table core."userfavouriteprogram"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column core."userfavouriteprogram"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table core."userfavouriteprogram" add _modifyby integer  ;
comment on column core."userfavouriteprogram"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table core."userfavouriteprogram"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column core."userfavouriteprogram"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table core."userfavouriteprogram" add _modifydate timestamp with time zone  ;
comment on column core."userfavouriteprogram"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table core."userfavouriteprogram"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column core."userfavouriteprogram"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE core."userfavouriteprogram"
	ADD CONSTRAINT fk$core$userfavouriteprogram$program_id
	FOREIGN KEY (program_id)
	REFERENCES core."program"(program_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$userfavouriteprogram$program_id;
CREATE INDEX idx_fk$core$userfavouriteprogram$program_id ON core."userfavouriteprogram"(program_id);	


ALTER TABLE core."userfavouriteprogram"
	ADD CONSTRAINT fk$core$userfavouriteprogram$user_id
	FOREIGN KEY (user_id)
	REFERENCES core."user"(user_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS core.idx_fk$core$userfavouriteprogram$user_id;
CREATE INDEX idx_fk$core$userfavouriteprogram$user_id ON core."userfavouriteprogram"(user_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  core."userfavouriteprogram"
	add constraint uq$core$userfavouriteprogram$userfavouriteprogram_pair unique (userfavouriteprogram_id, program_id); 

