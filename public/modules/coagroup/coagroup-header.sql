-- coagroup.sql


/* =============================================
 * CREATE TABLE public."coagroup"
 * ============================================*/
create table public."coagroup" (
	coagroup_id int not null,
	constraint coagroup_pk primary key (coagroup_id)
);
comment on table public."coagroup" is '';	


-- =============================================
-- FIELD: coagroup_name text
-- =============================================
-- ADD coagroup_name
alter table public."coagroup" add coagroup_name text  ;
comment on column public."coagroup".coagroup_name is '';

-- MODIFY coagroup_name
alter table public."coagroup"
	alter column coagroup_name type text,
	ALTER COLUMN coagroup_name DROP DEFAULT,
	ALTER COLUMN coagroup_name DROP NOT NULL;
comment on column public."coagroup".coagroup_name is '';


-- =============================================
-- FIELD: coagroup_descr text
-- =============================================
-- ADD coagroup_descr
alter table public."coagroup" add coagroup_descr text  ;
comment on column public."coagroup".coagroup_descr is '';

-- MODIFY coagroup_descr
alter table public."coagroup"
	alter column coagroup_descr type text,
	ALTER COLUMN coagroup_descr DROP DEFAULT,
	ALTER COLUMN coagroup_descr DROP NOT NULL;
comment on column public."coagroup".coagroup_descr is '';


-- =============================================
-- FIELD: coagroup_parent int
-- =============================================
-- ADD coagroup_parent
alter table public."coagroup" add coagroup_parent int  ;
comment on column public."coagroup".coagroup_parent is '';

-- MODIFY coagroup_parent
alter table public."coagroup"
	alter column coagroup_parent type int,
	ALTER COLUMN coagroup_parent DROP DEFAULT,
	ALTER COLUMN coagroup_parent DROP NOT NULL;
comment on column public."coagroup".coagroup_parent is '';


-- =============================================
-- FIELD: coagroup_level smallint
-- =============================================
-- ADD coagroup_level
alter table public."coagroup" add coagroup_level smallint not null default 0;
comment on column public."coagroup".coagroup_level is '';

-- MODIFY coagroup_level
alter table public."coagroup"
	alter column coagroup_level type smallint,
	ALTER COLUMN coagroup_level SET DEFAULT 0,
	ALTER COLUMN coagroup_level SET NOT NULL;
comment on column public."coagroup".coagroup_level is '';


-- =============================================
-- FIELD: coagroup_pathid text
-- =============================================
-- ADD coagroup_pathid
alter table public."coagroup" add coagroup_pathid text  ;
comment on column public."coagroup".coagroup_pathid is '';

-- MODIFY coagroup_pathid
alter table public."coagroup"
	alter column coagroup_pathid type text,
	ALTER COLUMN coagroup_pathid DROP DEFAULT,
	ALTER COLUMN coagroup_pathid DROP NOT NULL;
comment on column public."coagroup".coagroup_pathid is '';


-- =============================================
-- FIELD: coagroup_path text
-- =============================================
-- ADD coagroup_path
alter table public."coagroup" add coagroup_path text  ;
comment on column public."coagroup".coagroup_path is '';

-- MODIFY coagroup_path
alter table public."coagroup"
	alter column coagroup_path type text,
	ALTER COLUMN coagroup_path DROP DEFAULT,
	ALTER COLUMN coagroup_path DROP NOT NULL;
comment on column public."coagroup".coagroup_path is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."coagroup" add _createby integer not null ;
comment on column public."coagroup"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."coagroup"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."coagroup"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."coagroup" add _createdate timestamp with time zone not null default now();
comment on column public."coagroup"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."coagroup"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."coagroup"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."coagroup" add _modifyby integer  ;
comment on column public."coagroup"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."coagroup"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."coagroup"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."coagroup" add _modifydate timestamp with time zone  ;
comment on column public."coagroup"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."coagroup"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."coagroup"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE public."coagroup"
	ADD CONSTRAINT fk$public$coagroup$coagroup_parent
	FOREIGN KEY (coagroup_parent)
	REFERENCES public."coagroup"(coagroup_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$coagroup$coagroup_parent;
CREATE INDEX idx_fk$public$coagroup$coagroup_parent ON public."coagroup"(coagroup_parent);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  public."coagroup"
	add constraint uq$public$coagroup$coagroup_name unique (coagroup_name); 

