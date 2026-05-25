-- jurnalmodel.sql


/* =============================================
 * CREATE TABLE public."jurnalmodel"
 * ============================================*/
create table public."jurnalmodel" (
	jurnalmodel_id varchar(16) not null,
	constraint jurnalmodel_pk primary key (jurnalmodel_id)
);
comment on table public."jurnalmodel" is 'menentukan behaviour jurnal (hanya disetup oleh developer)';	


-- =============================================
-- FIELD: jurnalmodel_name text
-- =============================================
-- ADD jurnalmodel_name
alter table public."jurnalmodel" add jurnalmodel_name text  ;
comment on column public."jurnalmodel".jurnalmodel_name is '';

-- MODIFY jurnalmodel_name
alter table public."jurnalmodel"
	alter column jurnalmodel_name type text,
	ALTER COLUMN jurnalmodel_name DROP DEFAULT,
	ALTER COLUMN jurnalmodel_name DROP NOT NULL;
comment on column public."jurnalmodel".jurnalmodel_name is '';


-- =============================================
-- FIELD: jurnalmodel_descr text
-- =============================================
-- ADD jurnalmodel_descr
alter table public."jurnalmodel" add jurnalmodel_descr text  ;
comment on column public."jurnalmodel".jurnalmodel_descr is '';

-- MODIFY jurnalmodel_descr
alter table public."jurnalmodel"
	alter column jurnalmodel_descr type text,
	ALTER COLUMN jurnalmodel_descr DROP DEFAULT,
	ALTER COLUMN jurnalmodel_descr DROP NOT NULL;
comment on column public."jurnalmodel".jurnalmodel_descr is '';


-- =============================================
-- FIELD: jurnalmodel_copyto varchar(1)
-- =============================================
-- ADD jurnalmodel_copyto
alter table public."jurnalmodel" add jurnalmodel_copyto varchar(1)  ;
comment on column public."jurnalmodel".jurnalmodel_copyto is '';

-- MODIFY jurnalmodel_copyto
alter table public."jurnalmodel"
	alter column jurnalmodel_copyto type varchar(1),
	ALTER COLUMN jurnalmodel_copyto DROP DEFAULT,
	ALTER COLUMN jurnalmodel_copyto DROP NOT NULL;
comment on column public."jurnalmodel".jurnalmodel_copyto is '';


-- =============================================
-- FIELD: jurnalmodel_printout text
-- =============================================
-- ADD jurnalmodel_printout
alter table public."jurnalmodel" add jurnalmodel_printout text  ;
comment on column public."jurnalmodel".jurnalmodel_printout is '';

-- MODIFY jurnalmodel_printout
alter table public."jurnalmodel"
	alter column jurnalmodel_printout type text,
	ALTER COLUMN jurnalmodel_printout DROP DEFAULT,
	ALTER COLUMN jurnalmodel_printout DROP NOT NULL;
comment on column public."jurnalmodel".jurnalmodel_printout is '';


-- =============================================
-- FIELD: jurnalmodel_title text
-- =============================================
-- ADD jurnalmodel_title
alter table public."jurnalmodel" add jurnalmodel_title text  ;
comment on column public."jurnalmodel".jurnalmodel_title is '';

-- MODIFY jurnalmodel_title
alter table public."jurnalmodel"
	alter column jurnalmodel_title type text,
	ALTER COLUMN jurnalmodel_title DROP DEFAULT,
	ALTER COLUMN jurnalmodel_title DROP NOT NULL;
comment on column public."jurnalmodel".jurnalmodel_title is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."jurnalmodel" add _createby integer not null ;
comment on column public."jurnalmodel"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."jurnalmodel"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."jurnalmodel"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."jurnalmodel" add _createdate timestamp with time zone not null default now();
comment on column public."jurnalmodel"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."jurnalmodel"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."jurnalmodel"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."jurnalmodel" add _modifyby integer  ;
comment on column public."jurnalmodel"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."jurnalmodel"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."jurnalmodel"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."jurnalmodel" add _modifydate timestamp with time zone  ;
comment on column public."jurnalmodel"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."jurnalmodel"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."jurnalmodel"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."jurnalmodel"
	drop constraint uq$public$jurnalmodel$jurnalmodel_name;
	

-- Add unique index 
alter table  public."jurnalmodel"
	add constraint uq$public$jurnalmodel$jurnalmodel_name unique (jurnalmodel_name); 

