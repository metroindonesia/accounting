-- test.sql


/* =============================================
 * CREATE TABLE public."testdata"
 * ============================================*/
create table public."testdata" (
	test_id text(30) not null,
	constraint testdata_pk primary key (test_id)
);
comment on table public."testdata" is '';	


-- =============================================
-- FIELD: test_nam text
-- =============================================
-- ADD test_nam
alter table public."testdata" add test_nam text  ;
comment on column public."testdata".test_nam is '';

-- MODIFY test_nam
alter table public."testdata"
	alter column test_nam type text,
	ALTER COLUMN test_nam DROP DEFAULT,
	ALTER COLUMN test_nam DROP NOT NULL;
comment on column public."testdata".test_nam is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."testdata" add _createby integer not null ;
comment on column public."testdata"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."testdata"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."testdata"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."testdata" add _createdate timestamp with time zone not null default now();
comment on column public."testdata"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."testdata"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."testdata"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."testdata" add _modifyby integer  ;
comment on column public."testdata"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."testdata"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."testdata"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."testdata" add _modifydate timestamp with time zone  ;
comment on column public."testdata"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."testdata"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."testdata"._modifydate is 'waktu terakhir record dimodifikasi';






-- =============================================
-- UNIQUE INDEX
-- =============================================