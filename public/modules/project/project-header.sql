-- project.sql


/* =============================================
 * CREATE TABLE public."project"
 * ============================================*/
create table public."project" (
	project_id int not null,
	constraint project_pk primary key (project_id)
);
comment on table public."project" is '';	


-- =============================================
-- FIELD: project_isdisabled boolean
-- =============================================
-- ADD project_isdisabled
alter table public."project" add project_isdisabled boolean not null default false;
comment on column public."project".project_isdisabled is '';

-- MODIFY project_isdisabled
alter table public."project"
	alter column project_isdisabled type boolean,
	ALTER COLUMN project_isdisabled SET DEFAULT false,
	ALTER COLUMN project_isdisabled SET NOT NULL;
comment on column public."project".project_isdisabled is '';


-- =============================================
-- FIELD: project_name text
-- =============================================
-- ADD project_name
alter table public."project" add project_name text  ;
comment on column public."project".project_name is '';

-- MODIFY project_name
alter table public."project"
	alter column project_name type text,
	ALTER COLUMN project_name DROP DEFAULT,
	ALTER COLUMN project_name DROP NOT NULL;
comment on column public."project".project_name is '';


-- =============================================
-- FIELD: project_descr text
-- =============================================
-- ADD project_descr
alter table public."project" add project_descr text  ;
comment on column public."project".project_descr is '';

-- MODIFY project_descr
alter table public."project"
	alter column project_descr type text,
	ALTER COLUMN project_descr DROP DEFAULT,
	ALTER COLUMN project_descr DROP NOT NULL;
comment on column public."project".project_descr is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."project" add _createby integer not null ;
comment on column public."project"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."project"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."project"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."project" add _createdate timestamp with time zone not null default now();
comment on column public."project"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."project"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."project"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."project" add _modifyby integer  ;
comment on column public."project"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."project"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."project"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."project" add _modifydate timestamp with time zone  ;
comment on column public."project"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."project"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."project"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  public."project"
	add constraint uq$public$project$project_name unique (project_name); 

