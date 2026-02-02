-- coarpt.sql


/* =============================================
 * CREATE TABLE public."coarpt"
 * ============================================*/
create table public."coarpt" (
	coarpt_id smallint not null,
	constraint coarpt_pk primary key (coarpt_id)
);
comment on table public."coarpt" is '';	


-- =============================================
-- FIELD: coarpt_name text
-- =============================================
-- ADD coarpt_name
alter table public."coarpt" add coarpt_name text  ;
comment on column public."coarpt".coarpt_name is '';

-- MODIFY coarpt_name
alter table public."coarpt"
	alter column coarpt_name type text,
	ALTER COLUMN coarpt_name DROP DEFAULT,
	ALTER COLUMN coarpt_name DROP NOT NULL;
comment on column public."coarpt".coarpt_name is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."coarpt" add _createby integer not null ;
comment on column public."coarpt"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."coarpt"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."coarpt"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."coarpt" add _createdate timestamp with time zone not null default now();
comment on column public."coarpt"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."coarpt"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."coarpt"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."coarpt" add _modifyby integer  ;
comment on column public."coarpt"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."coarpt"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."coarpt"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."coarpt" add _modifydate timestamp with time zone  ;
comment on column public."coarpt"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."coarpt"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."coarpt"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  public."coarpt"
	add constraint uq$public$coarpt$coarpt_name unique (coarpt_name); 

