-- po.sql


/* =============================================
 * CREATE TABLE public."po"
 * ============================================*/
create table public."po" (
	po_id bigint not null,
	constraint po_pk primary key (po_id)
);
comment on table public."po" is '';	


-- =============================================
-- FIELD: po_doc text
-- =============================================
-- ADD po_doc
alter table public."po" add po_doc text  ;
comment on column public."po".po_doc is '';

-- MODIFY po_doc
alter table public."po"
	alter column po_doc type text,
	ALTER COLUMN po_doc DROP DEFAULT,
	ALTER COLUMN po_doc DROP NOT NULL;
comment on column public."po".po_doc is '';


-- =============================================
-- FIELD: pos_descr text
-- =============================================
-- ADD pos_descr
alter table public."po" add pos_descr text  ;
comment on column public."po".pos_descr is '';

-- MODIFY pos_descr
alter table public."po"
	alter column pos_descr type text,
	ALTER COLUMN pos_descr DROP DEFAULT,
	ALTER COLUMN pos_descr DROP NOT NULL;
comment on column public."po".pos_descr is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."po" add _createby integer not null ;
comment on column public."po"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."po"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."po"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."po" add _createdate timestamp with time zone not null default now();
comment on column public."po"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."po"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."po"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."po" add _modifyby integer  ;
comment on column public."po"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."po"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."po"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."po" add _modifydate timestamp with time zone  ;
comment on column public."po"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."po"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."po"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."po"
	drop constraint uq$public$po$po_doc;
	
