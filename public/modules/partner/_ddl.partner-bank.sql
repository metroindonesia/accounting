-- partner.sql


/* =============================================
 * CREATE TABLE public."partnerbank"
 * ============================================*/
create table public."partnerbank" (
	partnerbank_id bigint not null,
	constraint partnerbank_pk primary key (partnerbank_id)
);
comment on table public."partnerbank" is '';	


-- =============================================
-- FIELD: partnerbank_account text
-- =============================================
-- ADD partnerbank_account
alter table public."partnerbank" add partnerbank_account text  ;
comment on column public."partnerbank".partnerbank_account is '';

-- MODIFY partnerbank_account
alter table public."partnerbank"
	alter column partnerbank_account type text,
	ALTER COLUMN partnerbank_account DROP DEFAULT,
	ALTER COLUMN partnerbank_account DROP NOT NULL;
comment on column public."partnerbank".partnerbank_account is '';


-- =============================================
-- FIELD: partnerbank_isdisabled boolean
-- =============================================
-- ADD partnerbank_isdisabled
alter table public."partnerbank" add partnerbank_isdisabled boolean not null default false;
comment on column public."partnerbank".partnerbank_isdisabled is '';

-- MODIFY partnerbank_isdisabled
alter table public."partnerbank"
	alter column partnerbank_isdisabled type boolean,
	ALTER COLUMN partnerbank_isdisabled SET DEFAULT false,
	ALTER COLUMN partnerbank_isdisabled SET NOT NULL;
comment on column public."partnerbank".partnerbank_isdisabled is '';


-- =============================================
-- FIELD: partnerbank_accountname text
-- =============================================
-- ADD partnerbank_accountname
alter table public."partnerbank" add partnerbank_accountname text  ;
comment on column public."partnerbank".partnerbank_accountname is '';

-- MODIFY partnerbank_accountname
alter table public."partnerbank"
	alter column partnerbank_accountname type text,
	ALTER COLUMN partnerbank_accountname DROP DEFAULT,
	ALTER COLUMN partnerbank_accountname DROP NOT NULL;
comment on column public."partnerbank".partnerbank_accountname is '';


-- =============================================
-- FIELD: partnerbank_bankname text
-- =============================================
-- ADD partnerbank_bankname
alter table public."partnerbank" add partnerbank_bankname text  ;
comment on column public."partnerbank".partnerbank_bankname is '';

-- MODIFY partnerbank_bankname
alter table public."partnerbank"
	alter column partnerbank_bankname type text,
	ALTER COLUMN partnerbank_bankname DROP DEFAULT,
	ALTER COLUMN partnerbank_bankname DROP NOT NULL;
comment on column public."partnerbank".partnerbank_bankname is '';


-- =============================================
-- FIELD: partnerbank_name text
-- =============================================
-- ADD partnerbank_name
alter table public."partnerbank" add partnerbank_name text  ;
comment on column public."partnerbank".partnerbank_name is '';

-- MODIFY partnerbank_name
alter table public."partnerbank"
	alter column partnerbank_name type text,
	ALTER COLUMN partnerbank_name DROP DEFAULT,
	ALTER COLUMN partnerbank_name DROP NOT NULL;
comment on column public."partnerbank".partnerbank_name is '';


-- =============================================
-- FIELD: partner_id int
-- =============================================
-- ADD partner_id
alter table public."partnerbank" add partner_id int  ;
comment on column public."partnerbank".partner_id is '';

-- MODIFY partner_id
alter table public."partnerbank"
	alter column partner_id type int,
	ALTER COLUMN partner_id DROP DEFAULT,
	ALTER COLUMN partner_id DROP NOT NULL;
comment on column public."partnerbank".partner_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."partnerbank" add _createby integer not null ;
comment on column public."partnerbank"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."partnerbank"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."partnerbank"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."partnerbank" add _createdate timestamp with time zone not null default now();
comment on column public."partnerbank"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."partnerbank"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."partnerbank"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."partnerbank" add _modifyby integer  ;
comment on column public."partnerbank"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."partnerbank"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."partnerbank"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."partnerbank" add _modifydate timestamp with time zone  ;
comment on column public."partnerbank"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."partnerbank"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."partnerbank"._modifydate is 'waktu terakhir record dimodifikasi';


-- =============================================
-- FIELD: _timestamp timestamp with time zone
-- =============================================
-- ADD _timestamp
alter table public."partnerbank" add _timestamp timestamp with time zone not null default now();
comment on column public."partnerbank"._timestamp is 'data timestamp';

-- MODIFY _timestamp
alter table public."partnerbank"
	alter column _timestamp type timestamp with time zone,
	ALTER COLUMN _timestamp SET DEFAULT now(),
	ALTER COLUMN _timestamp SET NOT NULL;
comment on column public."partnerbank"._timestamp is 'data timestamp';


-- =============================================
-- INDEX
-- =============================================
DROP INDEX IF EXISTS public.idx$public$partnerbank$_timestamp;
CREATE INDEX idx$public$partnerbank$_timestamp ON public.partnerbank (_timestamp);




-- =============================================
-- UNIQUE INDEX
-- =============================================