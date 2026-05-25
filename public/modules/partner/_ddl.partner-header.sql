-- partner.sql


/* =============================================
 * CREATE TABLE public."partner"
 * ============================================*/
create table public."partner" (
	partner_id int not null,
	constraint partner_pk primary key (partner_id)
);
comment on table public."partner" is '';	


-- =============================================
-- FIELD: partner_isdisabled boolean
-- =============================================
-- ADD partner_isdisabled
alter table public."partner" add partner_isdisabled boolean not null default false;
comment on column public."partner".partner_isdisabled is '';

-- MODIFY partner_isdisabled
alter table public."partner"
	alter column partner_isdisabled type boolean,
	ALTER COLUMN partner_isdisabled SET DEFAULT false,
	ALTER COLUMN partner_isdisabled SET NOT NULL;
comment on column public."partner".partner_isdisabled is '';


-- =============================================
-- FIELD: partner_isemployee boolean
-- =============================================
-- ADD partner_isemployee
alter table public."partner" add partner_isemployee boolean not null default false;
comment on column public."partner".partner_isemployee is '';

-- MODIFY partner_isemployee
alter table public."partner"
	alter column partner_isemployee type boolean,
	ALTER COLUMN partner_isemployee SET DEFAULT false,
	ALTER COLUMN partner_isemployee SET NOT NULL;
comment on column public."partner".partner_isemployee is '';


-- =============================================
-- FIELD: partner_name text
-- =============================================
-- ADD partner_name
alter table public."partner" add partner_name text  ;
comment on column public."partner".partner_name is '';

-- MODIFY partner_name
alter table public."partner"
	alter column partner_name type text,
	ALTER COLUMN partner_name DROP DEFAULT,
	ALTER COLUMN partner_name DROP NOT NULL;
comment on column public."partner".partner_name is '';


-- =============================================
-- FIELD: partner_legaltitle text
-- =============================================
-- ADD partner_legaltitle
alter table public."partner" add partner_legaltitle text  ;
comment on column public."partner".partner_legaltitle is '';

-- MODIFY partner_legaltitle
alter table public."partner"
	alter column partner_legaltitle type text,
	ALTER COLUMN partner_legaltitle DROP DEFAULT,
	ALTER COLUMN partner_legaltitle DROP NOT NULL;
comment on column public."partner".partner_legaltitle is '';


-- =============================================
-- FIELD: partnertype_id smallint
-- =============================================
-- ADD partnertype_id
alter table public."partner" add partnertype_id smallint  ;
comment on column public."partner".partnertype_id is '';

-- MODIFY partnertype_id
alter table public."partner"
	alter column partnertype_id type smallint,
	ALTER COLUMN partnertype_id DROP DEFAULT,
	ALTER COLUMN partnertype_id DROP NOT NULL;
comment on column public."partner".partnertype_id is '';


-- =============================================
-- FIELD: employee_nip text
-- =============================================
-- ADD employee_nip
alter table public."partner" add employee_nip text  ;
comment on column public."partner".employee_nip is '';

-- MODIFY employee_nip
alter table public."partner"
	alter column employee_nip type text,
	ALTER COLUMN employee_nip DROP DEFAULT,
	ALTER COLUMN employee_nip DROP NOT NULL;
comment on column public."partner".employee_nip is '';


-- =============================================
-- FIELD: partner_address text
-- =============================================
-- ADD partner_address
alter table public."partner" add partner_address text  ;
comment on column public."partner".partner_address is '';

-- MODIFY partner_address
alter table public."partner"
	alter column partner_address type text,
	ALTER COLUMN partner_address DROP DEFAULT,
	ALTER COLUMN partner_address DROP NOT NULL;
comment on column public."partner".partner_address is '';


-- =============================================
-- FIELD: partner_city text
-- =============================================
-- ADD partner_city
alter table public."partner" add partner_city text  ;
comment on column public."partner".partner_city is '';

-- MODIFY partner_city
alter table public."partner"
	alter column partner_city type text,
	ALTER COLUMN partner_city DROP DEFAULT,
	ALTER COLUMN partner_city DROP NOT NULL;
comment on column public."partner".partner_city is '';


-- =============================================
-- FIELD: partner_email text
-- =============================================
-- ADD partner_email
alter table public."partner" add partner_email text  ;
comment on column public."partner".partner_email is '';

-- MODIFY partner_email
alter table public."partner"
	alter column partner_email type text,
	ALTER COLUMN partner_email DROP DEFAULT,
	ALTER COLUMN partner_email DROP NOT NULL;
comment on column public."partner".partner_email is '';


-- =============================================
-- FIELD: partner_npwp text
-- =============================================
-- ADD partner_npwp
alter table public."partner" add partner_npwp text  ;
comment on column public."partner".partner_npwp is '';

-- MODIFY partner_npwp
alter table public."partner"
	alter column partner_npwp type text,
	ALTER COLUMN partner_npwp DROP DEFAULT,
	ALTER COLUMN partner_npwp DROP NOT NULL;
comment on column public."partner".partner_npwp is '';


-- =============================================
-- FIELD: partner_isnonpkp boolean
-- =============================================
-- ADD partner_isnonpkp
alter table public."partner" add partner_isnonpkp boolean not null default false;
comment on column public."partner".partner_isnonpkp is '';

-- MODIFY partner_isnonpkp
alter table public."partner"
	alter column partner_isnonpkp type boolean,
	ALTER COLUMN partner_isnonpkp SET DEFAULT false,
	ALTER COLUMN partner_isnonpkp SET NOT NULL;
comment on column public."partner".partner_isnonpkp is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."partner" add _createby integer not null ;
comment on column public."partner"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."partner"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."partner"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."partner" add _createdate timestamp with time zone not null default now();
comment on column public."partner"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."partner"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."partner"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."partner" add _modifyby integer  ;
comment on column public."partner"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."partner"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."partner"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."partner" add _modifydate timestamp with time zone  ;
comment on column public."partner"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."partner"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."partner"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."partner" DROP CONSTRAINT fk$public$partner$partnertype_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."partner"
	ADD CONSTRAINT fk$public$partner$partnertype_id
	FOREIGN KEY (partnertype_id)
	REFERENCES public."partnertype"(partnertype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$partner$partnertype_id;
CREATE INDEX idx_fk$public$partner$partnertype_id ON public."partner"(partnertype_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."partner"
	drop constraint uq$public$partner$partner_name;
	

-- Add unique index 
alter table  public."partner"
	add constraint uq$public$partner$partner_name unique (partner_name); 

