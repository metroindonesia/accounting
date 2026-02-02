-- agingtype.sql


/* =============================================
 * CREATE TABLE public."agingtype"
 * ============================================*/
create table public."agingtype" (
	agingtype_id smallint not null,
	constraint agingtype_pk primary key (agingtype_id)
);
comment on table public."agingtype" is '';	


-- =============================================
-- FIELD: agingtype_name text
-- =============================================
-- ADD agingtype_name
alter table public."agingtype" add agingtype_name text  ;
comment on column public."agingtype".agingtype_name is '';

-- MODIFY agingtype_name
alter table public."agingtype"
	alter column agingtype_name type text,
	ALTER COLUMN agingtype_name DROP DEFAULT,
	ALTER COLUMN agingtype_name DROP NOT NULL;
comment on column public."agingtype".agingtype_name is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."agingtype" add _createby integer not null ;
comment on column public."agingtype"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."agingtype"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."agingtype"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."agingtype" add _createdate timestamp with time zone not null default now();
comment on column public."agingtype"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."agingtype"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."agingtype"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."agingtype" add _modifyby integer  ;
comment on column public."agingtype"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."agingtype"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."agingtype"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."agingtype" add _modifydate timestamp with time zone  ;
comment on column public."agingtype"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."agingtype"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."agingtype"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."agingtype"
	drop constraint uq$public$agingtype$agingtype_name;
	

-- Add unique index 
alter table  public."agingtype"
	add constraint uq$public$agingtype$agingtype_name unique (agingtype_name); 

