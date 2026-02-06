-- paymtype.sql


/* =============================================
 * CREATE TABLE public."paymtype"
 * ============================================*/
create table public."paymtype" (
	paymtype_id smallint not null,
	constraint paymtype_pk primary key (paymtype_id)
);
comment on table public."paymtype" is '';	


-- =============================================
-- FIELD: paymtype_name text
-- =============================================
-- ADD paymtype_name
alter table public."paymtype" add paymtype_name text  ;
comment on column public."paymtype".paymtype_name is '';

-- MODIFY paymtype_name
alter table public."paymtype"
	alter column paymtype_name type text,
	ALTER COLUMN paymtype_name DROP DEFAULT,
	ALTER COLUMN paymtype_name DROP NOT NULL;
comment on column public."paymtype".paymtype_name is '';


-- =============================================
-- FIELD: ishaspartnercontact boolean
-- =============================================
-- ADD ishaspartnercontact
alter table public."paymtype" add ishaspartnercontact boolean not null default false;
comment on column public."paymtype".ishaspartnercontact is '';

-- MODIFY ishaspartnercontact
alter table public."paymtype"
	alter column ishaspartnercontact type boolean,
	ALTER COLUMN ishaspartnercontact SET DEFAULT false,
	ALTER COLUMN ishaspartnercontact SET NOT NULL;
comment on column public."paymtype".ishaspartnercontact is '';


-- =============================================
-- FIELD: ishaspartnerbankselector boolean
-- =============================================
-- ADD ishaspartnerbankselector
alter table public."paymtype" add ishaspartnerbankselector boolean not null default false;
comment on column public."paymtype".ishaspartnerbankselector is '';

-- MODIFY ishaspartnerbankselector
alter table public."paymtype"
	alter column ishaspartnerbankselector type boolean,
	ALTER COLUMN ishaspartnerbankselector SET DEFAULT false,
	ALTER COLUMN ishaspartnerbankselector SET NOT NULL;
comment on column public."paymtype".ishaspartnerbankselector is '';


-- =============================================
-- FIELD: ishasbankaccount boolean
-- =============================================
-- ADD ishasbankaccount
alter table public."paymtype" add ishasbankaccount boolean not null default false;
comment on column public."paymtype".ishasbankaccount is '';

-- MODIFY ishasbankaccount
alter table public."paymtype"
	alter column ishasbankaccount type boolean,
	ALTER COLUMN ishasbankaccount SET DEFAULT false,
	ALTER COLUMN ishasbankaccount SET NOT NULL;
comment on column public."paymtype".ishasbankaccount is '';


-- =============================================
-- FIELD: ishasbankaccountname boolean
-- =============================================
-- ADD ishasbankaccountname
alter table public."paymtype" add ishasbankaccountname boolean not null default false;
comment on column public."paymtype".ishasbankaccountname is '';

-- MODIFY ishasbankaccountname
alter table public."paymtype"
	alter column ishasbankaccountname type boolean,
	ALTER COLUMN ishasbankaccountname SET DEFAULT false,
	ALTER COLUMN ishasbankaccountname SET NOT NULL;
comment on column public."paymtype".ishasbankaccountname is '';


-- =============================================
-- FIELD: ishasbankname boolean
-- =============================================
-- ADD ishasbankname
alter table public."paymtype" add ishasbankname boolean not null default false;
comment on column public."paymtype".ishasbankname is '';

-- MODIFY ishasbankname
alter table public."paymtype"
	alter column ishasbankname type boolean,
	ALTER COLUMN ishasbankname SET DEFAULT false,
	ALTER COLUMN ishasbankname SET NOT NULL;
comment on column public."paymtype".ishasbankname is '';


-- =============================================
-- FIELD: ishasgiro boolean
-- =============================================
-- ADD ishasgiro
alter table public."paymtype" add ishasgiro boolean not null default false;
comment on column public."paymtype".ishasgiro is '';

-- MODIFY ishasgiro
alter table public."paymtype"
	alter column ishasgiro type boolean,
	ALTER COLUMN ishasgiro SET DEFAULT false,
	ALTER COLUMN ishasgiro SET NOT NULL;
comment on column public."paymtype".ishasgiro is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."paymtype" add _createby integer not null ;
comment on column public."paymtype"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."paymtype"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."paymtype"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."paymtype" add _createdate timestamp with time zone not null default now();
comment on column public."paymtype"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."paymtype"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."paymtype"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."paymtype" add _modifyby integer  ;
comment on column public."paymtype"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."paymtype"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."paymtype"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."paymtype" add _modifydate timestamp with time zone  ;
comment on column public."paymtype"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."paymtype"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."paymtype"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  public."paymtype"
	add constraint uq$public$paymtype$paymtype_name unique (paymtype_name); 

