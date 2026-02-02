-- structhrk.sql


/* =============================================
 * CREATE TABLE public."structhrk"
 * ============================================*/
create table public."structhrk" (
	structhrk_id smallint not null,
	constraint structhrk_pk primary key (structhrk_id)
);
comment on table public."structhrk" is '';	


-- =============================================
-- FIELD: structhrk_name text
-- =============================================
-- ADD structhrk_name
alter table public."structhrk" add structhrk_name text  ;
comment on column public."structhrk".structhrk_name is '';

-- MODIFY structhrk_name
alter table public."structhrk"
	alter column structhrk_name type text,
	ALTER COLUMN structhrk_name DROP DEFAULT,
	ALTER COLUMN structhrk_name DROP NOT NULL;
comment on column public."structhrk".structhrk_name is '';


-- =============================================
-- FIELD: structhrk_level smallint
-- =============================================
-- ADD structhrk_level
alter table public."structhrk" add structhrk_level smallint not null default 0;
comment on column public."structhrk".structhrk_level is '';

-- MODIFY structhrk_level
alter table public."structhrk"
	alter column structhrk_level type smallint,
	ALTER COLUMN structhrk_level SET DEFAULT 0,
	ALTER COLUMN structhrk_level SET NOT NULL;
comment on column public."structhrk".structhrk_level is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."structhrk" add _createby integer not null ;
comment on column public."structhrk"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."structhrk"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."structhrk"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."structhrk" add _createdate timestamp with time zone not null default now();
comment on column public."structhrk"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."structhrk"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."structhrk"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."structhrk" add _modifyby integer  ;
comment on column public."structhrk"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."structhrk"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."structhrk"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."structhrk" add _modifydate timestamp with time zone  ;
comment on column public."structhrk"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."structhrk"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."structhrk"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."structhrk"
	drop constraint uq$public$structhrk$structhrk_id;
	

-- Add unique index 
alter table  public."structhrk"
	add constraint uq$public$structhrk$structhrk_id unique (structhrk_id); 

