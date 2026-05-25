-- partner.sql


/* =============================================
 * CREATE TABLE public."partnercontact"
 * ============================================*/
create table public."partnercontact" (
	partnercontact_id bigint not null,
	constraint partnercontact_pk primary key (partnercontact_id)
);
comment on table public."partnercontact" is '';	


-- =============================================
-- FIELD: partnercontact_name text
-- =============================================
-- ADD partnercontact_name
alter table public."partnercontact" add partnercontact_name text  ;
comment on column public."partnercontact".partnercontact_name is '';

-- MODIFY partnercontact_name
alter table public."partnercontact"
	alter column partnercontact_name type text,
	ALTER COLUMN partnercontact_name DROP DEFAULT,
	ALTER COLUMN partnercontact_name DROP NOT NULL;
comment on column public."partnercontact".partnercontact_name is '';


-- =============================================
-- FIELD: partnercontact_isdisabled boolean
-- =============================================
-- ADD partnercontact_isdisabled
alter table public."partnercontact" add partnercontact_isdisabled boolean not null default false;
comment on column public."partnercontact".partnercontact_isdisabled is '';

-- MODIFY partnercontact_isdisabled
alter table public."partnercontact"
	alter column partnercontact_isdisabled type boolean,
	ALTER COLUMN partnercontact_isdisabled SET DEFAULT false,
	ALTER COLUMN partnercontact_isdisabled SET NOT NULL;
comment on column public."partnercontact".partnercontact_isdisabled is '';


-- =============================================
-- FIELD: partnercontact_position text
-- =============================================
-- ADD partnercontact_position
alter table public."partnercontact" add partnercontact_position text  ;
comment on column public."partnercontact".partnercontact_position is '';

-- MODIFY partnercontact_position
alter table public."partnercontact"
	alter column partnercontact_position type text,
	ALTER COLUMN partnercontact_position DROP DEFAULT,
	ALTER COLUMN partnercontact_position DROP NOT NULL;
comment on column public."partnercontact".partnercontact_position is '';


-- =============================================
-- FIELD: partnercontact_hp text
-- =============================================
-- ADD partnercontact_hp
alter table public."partnercontact" add partnercontact_hp text  ;
comment on column public."partnercontact".partnercontact_hp is '';

-- MODIFY partnercontact_hp
alter table public."partnercontact"
	alter column partnercontact_hp type text,
	ALTER COLUMN partnercontact_hp DROP DEFAULT,
	ALTER COLUMN partnercontact_hp DROP NOT NULL;
comment on column public."partnercontact".partnercontact_hp is '';


-- =============================================
-- FIELD: partnercontact_email text
-- =============================================
-- ADD partnercontact_email
alter table public."partnercontact" add partnercontact_email text  ;
comment on column public."partnercontact".partnercontact_email is '';

-- MODIFY partnercontact_email
alter table public."partnercontact"
	alter column partnercontact_email type text,
	ALTER COLUMN partnercontact_email DROP DEFAULT,
	ALTER COLUMN partnercontact_email DROP NOT NULL;
comment on column public."partnercontact".partnercontact_email is '';


-- =============================================
-- FIELD: partner_id int
-- =============================================
-- ADD partner_id
alter table public."partnercontact" add partner_id int  ;
comment on column public."partnercontact".partner_id is '';

-- MODIFY partner_id
alter table public."partnercontact"
	alter column partner_id type int,
	ALTER COLUMN partner_id DROP DEFAULT,
	ALTER COLUMN partner_id DROP NOT NULL;
comment on column public."partnercontact".partner_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."partnercontact" add _createby integer not null ;
comment on column public."partnercontact"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."partnercontact"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."partnercontact"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."partnercontact" add _createdate timestamp with time zone not null default now();
comment on column public."partnercontact"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."partnercontact"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."partnercontact"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."partnercontact" add _modifyby integer  ;
comment on column public."partnercontact"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."partnercontact"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."partnercontact"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."partnercontact" add _modifydate timestamp with time zone  ;
comment on column public."partnercontact"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."partnercontact"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."partnercontact"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."partnercontact" DROP CONSTRAINT fk$public$partnercontact$partner_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."partnercontact"
	ADD CONSTRAINT fk$public$partnercontact$partner_id
	FOREIGN KEY (partner_id)
	REFERENCES public."partner"(partner_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$partnercontact$partner_id;
CREATE INDEX idx_fk$public$partnercontact$partner_id ON public."partnercontact"(partner_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================