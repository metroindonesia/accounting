-- txrowtype.sql


/* =============================================
 * CREATE TABLE public."txrowtype"
 * ============================================*/
create table public."txrowtype" (
	txrowtype_id smallint not null,
	constraint txrowtype_pk primary key (txrowtype_id)
);
comment on table public."txrowtype" is '';	


-- =============================================
-- FIELD: txrowtype_name text
-- =============================================
-- ADD txrowtype_name
alter table public."txrowtype" add txrowtype_name text  ;
comment on column public."txrowtype".txrowtype_name is '';

-- MODIFY txrowtype_name
alter table public."txrowtype"
	alter column txrowtype_name type text,
	ALTER COLUMN txrowtype_name DROP DEFAULT,
	ALTER COLUMN txrowtype_name DROP NOT NULL;
comment on column public."txrowtype".txrowtype_name is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."txrowtype" add _createby integer not null ;
comment on column public."txrowtype"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."txrowtype"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."txrowtype"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."txrowtype" add _createdate timestamp with time zone not null default now();
comment on column public."txrowtype"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."txrowtype"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."txrowtype"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."txrowtype" add _modifyby integer  ;
comment on column public."txrowtype"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."txrowtype"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."txrowtype"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."txrowtype" add _modifydate timestamp with time zone  ;
comment on column public."txrowtype"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."txrowtype"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."txrowtype"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  public."txrowtype"
	add constraint uq$public$txrowtype$txrowtype_name unique (txrowtype_name); 

