-- ffl.sql


/* =============================================
 * CREATE TABLE public."ffl"
 * ============================================*/
create table public."ffl" (
	ffl_id bigint not null,
	constraint ffl_pk primary key (ffl_id)
);
comment on table public."ffl" is '';	


-- =============================================
-- FIELD: ffl_descr text
-- =============================================
-- ADD ffl_descr
alter table public."ffl" add ffl_descr text  ;
comment on column public."ffl".ffl_descr is '';

-- MODIFY ffl_descr
alter table public."ffl"
	alter column ffl_descr type text,
	ALTER COLUMN ffl_descr DROP DEFAULT,
	ALTER COLUMN ffl_descr DROP NOT NULL;
comment on column public."ffl".ffl_descr is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."ffl" add _createby integer not null ;
comment on column public."ffl"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."ffl"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."ffl"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."ffl" add _createdate timestamp with time zone not null default now();
comment on column public."ffl"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."ffl"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."ffl"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."ffl" add _modifyby integer  ;
comment on column public."ffl"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."ffl"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."ffl"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."ffl" add _modifydate timestamp with time zone  ;
comment on column public."ffl"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."ffl"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."ffl"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================