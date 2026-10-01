-- activity.sql


/* =============================================
 * CREATE TABLE public."activity"
 * ============================================*/
create table public."activity" (
	activity_id smallint not null,
	constraint activity_pk primary key (activity_id)
);
comment on table public."activity" is '';	


-- =============================================
-- FIELD: activity_isdisabled boolean
-- =============================================
-- ADD activity_isdisabled
alter table public."activity" add activity_isdisabled boolean not null default false;
comment on column public."activity".activity_isdisabled is '';

-- MODIFY activity_isdisabled
alter table public."activity"
	alter column activity_isdisabled type boolean,
	ALTER COLUMN activity_isdisabled SET DEFAULT false,
	ALTER COLUMN activity_isdisabled SET NOT NULL;
comment on column public."activity".activity_isdisabled is '';


-- =============================================
-- FIELD: activity_name text
-- =============================================
-- ADD activity_name
alter table public."activity" add activity_name text  ;
comment on column public."activity".activity_name is '';

-- MODIFY activity_name
alter table public."activity"
	alter column activity_name type text,
	ALTER COLUMN activity_name DROP DEFAULT,
	ALTER COLUMN activity_name DROP NOT NULL;
comment on column public."activity".activity_name is '';


-- =============================================
-- FIELD: activity_descr text
-- =============================================
-- ADD activity_descr
alter table public."activity" add activity_descr text  ;
comment on column public."activity".activity_descr is '';

-- MODIFY activity_descr
alter table public."activity"
	alter column activity_descr type text,
	ALTER COLUMN activity_descr DROP DEFAULT,
	ALTER COLUMN activity_descr DROP NOT NULL;
comment on column public."activity".activity_descr is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."activity" add _createby integer not null ;
comment on column public."activity"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."activity"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."activity"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."activity" add _createdate timestamp with time zone not null default now();
comment on column public."activity"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."activity"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."activity"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."activity" add _modifyby integer  ;
comment on column public."activity"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."activity"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."activity"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."activity" add _modifydate timestamp with time zone  ;
comment on column public."activity"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."activity"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."activity"._modifydate is 'waktu terakhir record dimodifikasi';


-- =============================================
-- FIELD: _timestamp timestamp with time zone
-- =============================================
-- ADD _timestamp
alter table public."activity" add _timestamp timestamp with time zone not null default now();
comment on column public."activity"._timestamp is 'data timestamp';

-- MODIFY _timestamp
alter table public."activity"
	alter column _timestamp type timestamp with time zone,
	ALTER COLUMN _timestamp SET DEFAULT now(),
	ALTER COLUMN _timestamp SET NOT NULL;
comment on column public."activity"._timestamp is 'data timestamp';


-- =============================================
-- INDEX
-- =============================================
DROP INDEX IF EXISTS public.idx$public$activity$_timestamp;
CREATE INDEX idx$public$activity$_timestamp ON public.activity (_timestamp);




-- =============================================
-- UNIQUE INDEX
-- =============================================