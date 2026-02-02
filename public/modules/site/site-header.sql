-- site.sql


/* =============================================
 * CREATE TABLE public."site"
 * ============================================*/
create table public."site" (
	site_id int not null,
	constraint site_pk primary key (site_id)
);
comment on table public."site" is 'daftar lokasi fisik, bisa merefer ke office, toko, gudang, dll';	


-- =============================================
-- FIELD: site_isdisabled boolean
-- =============================================
-- ADD site_isdisabled
alter table public."site" add site_isdisabled boolean not null default false;
comment on column public."site".site_isdisabled is '';

-- MODIFY site_isdisabled
alter table public."site"
	alter column site_isdisabled type boolean,
	ALTER COLUMN site_isdisabled SET DEFAULT false,
	ALTER COLUMN site_isdisabled SET NOT NULL;
comment on column public."site".site_isdisabled is '';


-- =============================================
-- FIELD: site_name text
-- =============================================
-- ADD site_name
alter table public."site" add site_name text  ;
comment on column public."site".site_name is '';

-- MODIFY site_name
alter table public."site"
	alter column site_name type text,
	ALTER COLUMN site_name DROP DEFAULT,
	ALTER COLUMN site_name DROP NOT NULL;
comment on column public."site".site_name is '';


-- =============================================
-- FIELD: site_namereport text
-- =============================================
-- ADD site_namereport
alter table public."site" add site_namereport text  ;
comment on column public."site".site_namereport is '';

-- MODIFY site_namereport
alter table public."site"
	alter column site_namereport type text,
	ALTER COLUMN site_namereport DROP DEFAULT,
	ALTER COLUMN site_namereport DROP NOT NULL;
comment on column public."site".site_namereport is '';


-- =============================================
-- FIELD: site_location text
-- =============================================
-- ADD site_location
alter table public."site" add site_location text  ;
comment on column public."site".site_location is '';

-- MODIFY site_location
alter table public."site"
	alter column site_location type text,
	ALTER COLUMN site_location DROP DEFAULT,
	ALTER COLUMN site_location DROP NOT NULL;
comment on column public."site".site_location is '';


-- =============================================
-- FIELD: site_city text
-- =============================================
-- ADD site_city
alter table public."site" add site_city text  ;
comment on column public."site".site_city is '';

-- MODIFY site_city
alter table public."site"
	alter column site_city type text,
	ALTER COLUMN site_city DROP DEFAULT,
	ALTER COLUMN site_city DROP NOT NULL;
comment on column public."site".site_city is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."site" add _createby integer not null ;
comment on column public."site"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."site"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."site"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."site" add _createdate timestamp with time zone not null default now();
comment on column public."site"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."site"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."site"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."site" add _modifyby integer  ;
comment on column public."site"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."site"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."site"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."site" add _modifydate timestamp with time zone  ;
comment on column public."site"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."site"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."site"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================