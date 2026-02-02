-- partnertype.sql


/* =============================================
 * CREATE TABLE public."partnertype"
 * ============================================*/
create table public."partnertype" (
	partnertype_id smallint not null,
	constraint partnertype_pk primary key (partnertype_id)
);
comment on table public."partnertype" is '';	


-- =============================================
-- FIELD: partnertype_name text
-- =============================================
-- ADD partnertype_name
alter table public."partnertype" add partnertype_name text  ;
comment on column public."partnertype".partnertype_name is '';

-- MODIFY partnertype_name
alter table public."partnertype"
	alter column partnertype_name type text,
	ALTER COLUMN partnertype_name DROP DEFAULT,
	ALTER COLUMN partnertype_name DROP NOT NULL;
comment on column public."partnertype".partnertype_name is '';


-- =============================================
-- FIELD: partnertype_isemployee boolean
-- =============================================
-- ADD partnertype_isemployee
alter table public."partnertype" add partnertype_isemployee boolean not null default false;
comment on column public."partnertype".partnertype_isemployee is '';

-- MODIFY partnertype_isemployee
alter table public."partnertype"
	alter column partnertype_isemployee type boolean,
	ALTER COLUMN partnertype_isemployee SET DEFAULT false,
	ALTER COLUMN partnertype_isemployee SET NOT NULL;
comment on column public."partnertype".partnertype_isemployee is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."partnertype" add _createby integer not null ;
comment on column public."partnertype"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."partnertype"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."partnertype"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."partnertype" add _createdate timestamp with time zone not null default now();
comment on column public."partnertype"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."partnertype"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."partnertype"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."partnertype" add _modifyby integer  ;
comment on column public."partnertype"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."partnertype"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."partnertype"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."partnertype" add _modifydate timestamp with time zone  ;
comment on column public."partnertype"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."partnertype"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."partnertype"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."partnertype"
	drop constraint uq$public$partnertype$partnertype_name;
	

-- Add unique index 
alter table  public."partnertype"
	add constraint uq$public$partnertype$partnertype_name unique (partnertype_name); 

