-- unit.sql


/* =============================================
 * CREATE TABLE public."unit"
 * ============================================*/
create table public."unit" (
	unit_id int not null,
	constraint unit_pk primary key (unit_id)
);
comment on table public."unit" is '';	


-- =============================================
-- FIELD: unit_isdisabled boolean
-- =============================================
-- ADD unit_isdisabled
alter table public."unit" add unit_isdisabled boolean not null default false;
comment on column public."unit".unit_isdisabled is '';

-- MODIFY unit_isdisabled
alter table public."unit"
	alter column unit_isdisabled type boolean,
	ALTER COLUMN unit_isdisabled SET DEFAULT false,
	ALTER COLUMN unit_isdisabled SET NOT NULL;
comment on column public."unit".unit_isdisabled is '';


-- =============================================
-- FIELD: unit_name text
-- =============================================
-- ADD unit_name
alter table public."unit" add unit_name text  ;
comment on column public."unit".unit_name is '';

-- MODIFY unit_name
alter table public."unit"
	alter column unit_name type text,
	ALTER COLUMN unit_name DROP DEFAULT,
	ALTER COLUMN unit_name DROP NOT NULL;
comment on column public."unit".unit_name is '';


-- =============================================
-- FIELD: unit_descr text
-- =============================================
-- ADD unit_descr
alter table public."unit" add unit_descr text  ;
comment on column public."unit".unit_descr is '';

-- MODIFY unit_descr
alter table public."unit"
	alter column unit_descr type text,
	ALTER COLUMN unit_descr DROP DEFAULT,
	ALTER COLUMN unit_descr DROP NOT NULL;
comment on column public."unit".unit_descr is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."unit" add _createby integer not null ;
comment on column public."unit"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."unit"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."unit"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."unit" add _createdate timestamp with time zone not null default now();
comment on column public."unit"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."unit"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."unit"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."unit" add _modifyby integer  ;
comment on column public."unit"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."unit"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."unit"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."unit" add _modifydate timestamp with time zone  ;
comment on column public."unit"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."unit"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."unit"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  public."unit"
	add constraint uq$public$unit$unit_name unique (unit_name); 

