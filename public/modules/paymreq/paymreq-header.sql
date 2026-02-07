-- paymreq.sql


/* =============================================
 * CREATE TABLE public."paymreq"
 * ============================================*/
create table public."paymreq" (
	paymreq_id bigint not null,
	constraint paymreq_pk primary key (paymreq_id)
);
comment on table public."paymreq" is '';	


-- =============================================
-- FIELD: paymreq_doc text
-- =============================================
-- ADD paymreq_doc
alter table public."paymreq" add paymreq_doc text  ;
comment on column public."paymreq".paymreq_doc is '';

-- MODIFY paymreq_doc
alter table public."paymreq"
	alter column paymreq_doc type text,
	ALTER COLUMN paymreq_doc DROP DEFAULT,
	ALTER COLUMN paymreq_doc DROP NOT NULL;
comment on column public."paymreq".paymreq_doc is '';


-- =============================================
-- FIELD: iscommit boolean
-- =============================================
-- ADD iscommit
alter table public."paymreq" add iscommit boolean not null default false;
comment on column public."paymreq".iscommit is '';

-- MODIFY iscommit
alter table public."paymreq"
	alter column iscommit type boolean,
	ALTER COLUMN iscommit SET DEFAULT false,
	ALTER COLUMN iscommit SET NOT NULL;
comment on column public."paymreq".iscommit is '';


-- =============================================
-- FIELD: isapproved boolean
-- =============================================
-- ADD isapproved
alter table public."paymreq" add isapproved boolean not null default false;
comment on column public."paymreq".isapproved is '';

-- MODIFY isapproved
alter table public."paymreq"
	alter column isapproved type boolean,
	ALTER COLUMN isapproved SET DEFAULT false,
	ALTER COLUMN isapproved SET NOT NULL;
comment on column public."paymreq".isapproved is '';


-- =============================================
-- FIELD: paymreqtype_id smallint
-- =============================================
-- ADD paymreqtype_id
alter table public."paymreq" add paymreqtype_id smallint  ;
comment on column public."paymreq".paymreqtype_id is '';

-- MODIFY paymreqtype_id
alter table public."paymreq"
	alter column paymreqtype_id type smallint,
	ALTER COLUMN paymreqtype_id DROP DEFAULT,
	ALTER COLUMN paymreqtype_id DROP NOT NULL;
comment on column public."paymreq".paymreqtype_id is '';


-- =============================================
-- FIELD: paymreq_invoice text
-- =============================================
-- ADD paymreq_invoice
alter table public."paymreq" add paymreq_invoice text  ;
comment on column public."paymreq".paymreq_invoice is '';

-- MODIFY paymreq_invoice
alter table public."paymreq"
	alter column paymreq_invoice type text,
	ALTER COLUMN paymreq_invoice DROP DEFAULT,
	ALTER COLUMN paymreq_invoice DROP NOT NULL;
comment on column public."paymreq".paymreq_invoice is '';


-- =============================================
-- FIELD: paymreq_date date
-- =============================================
-- ADD paymreq_date
alter table public."paymreq" add paymreq_date date  default now();
comment on column public."paymreq".paymreq_date is '';

-- MODIFY paymreq_date
alter table public."paymreq"
	alter column paymreq_date type date,
	ALTER COLUMN paymreq_date SET DEFAULT now(),
	ALTER COLUMN paymreq_date DROP NOT NULL;
comment on column public."paymreq".paymreq_date is '';


-- =============================================
-- FIELD: paymreq_descr text
-- =============================================
-- ADD paymreq_descr
alter table public."paymreq" add paymreq_descr text  ;
comment on column public."paymreq".paymreq_descr is '';

-- MODIFY paymreq_descr
alter table public."paymreq"
	alter column paymreq_descr type text,
	ALTER COLUMN paymreq_descr DROP DEFAULT,
	ALTER COLUMN paymreq_descr DROP NOT NULL;
comment on column public."paymreq".paymreq_descr is '';


-- =============================================
-- FIELD: paymreq_datedue date
-- =============================================
-- ADD paymreq_datedue
alter table public."paymreq" add paymreq_datedue date  default now();
comment on column public."paymreq".paymreq_datedue is '';

-- MODIFY paymreq_datedue
alter table public."paymreq"
	alter column paymreq_datedue type date,
	ALTER COLUMN paymreq_datedue SET DEFAULT now(),
	ALTER COLUMN paymreq_datedue DROP NOT NULL;
comment on column public."paymreq".paymreq_datedue is '';


-- =============================================
-- FIELD: struct_id int
-- =============================================
-- ADD struct_id
alter table public."paymreq" add struct_id int  ;
comment on column public."paymreq".struct_id is '';

-- MODIFY struct_id
alter table public."paymreq"
	alter column struct_id type int,
	ALTER COLUMN struct_id DROP DEFAULT,
	ALTER COLUMN struct_id DROP NOT NULL;
comment on column public."paymreq".struct_id is '';


-- =============================================
-- FIELD: project_id int
-- =============================================
-- ADD project_id
alter table public."paymreq" add project_id int  ;
comment on column public."paymreq".project_id is '';

-- MODIFY project_id
alter table public."paymreq"
	alter column project_id type int,
	ALTER COLUMN project_id DROP DEFAULT,
	ALTER COLUMN project_id DROP NOT NULL;
comment on column public."paymreq".project_id is '';


-- =============================================
-- FIELD: site_id int
-- =============================================
-- ADD site_id
alter table public."paymreq" add site_id int  ;
comment on column public."paymreq".site_id is '';

-- MODIFY site_id
alter table public."paymreq"
	alter column site_id type int,
	ALTER COLUMN site_id DROP DEFAULT,
	ALTER COLUMN site_id DROP NOT NULL;
comment on column public."paymreq".site_id is '';


-- =============================================
-- FIELD: unit_id int
-- =============================================
-- ADD unit_id
alter table public."paymreq" add unit_id int  ;
comment on column public."paymreq".unit_id is '';

-- MODIFY unit_id
alter table public."paymreq"
	alter column unit_id type int,
	ALTER COLUMN unit_id DROP DEFAULT,
	ALTER COLUMN unit_id DROP NOT NULL;
comment on column public."paymreq".unit_id is '';


-- =============================================
-- FIELD: bc_id bigint
-- =============================================
-- ADD bc_id
alter table public."paymreq" add bc_id bigint  ;
comment on column public."paymreq".bc_id is '';

-- MODIFY bc_id
alter table public."paymreq"
	alter column bc_id type bigint,
	ALTER COLUMN bc_id DROP DEFAULT,
	ALTER COLUMN bc_id DROP NOT NULL;
comment on column public."paymreq".bc_id is '';


-- =============================================
-- FIELD: partner_id int
-- =============================================
-- ADD partner_id
alter table public."paymreq" add partner_id int not null default 0;
comment on column public."paymreq".partner_id is '';

-- MODIFY partner_id
alter table public."paymreq"
	alter column partner_id type int,
	ALTER COLUMN partner_id SET DEFAULT 0,
	ALTER COLUMN partner_id SET NOT NULL;
comment on column public."paymreq".partner_id is '';


-- =============================================
-- FIELD: partnercontact_id bigint
-- =============================================
-- ADD partnercontact_id
alter table public."paymreq" add partnercontact_id bigint  ;
comment on column public."paymreq".partnercontact_id is '';

-- MODIFY partnercontact_id
alter table public."paymreq"
	alter column partnercontact_id type bigint,
	ALTER COLUMN partnercontact_id DROP DEFAULT,
	ALTER COLUMN partnercontact_id DROP NOT NULL;
comment on column public."paymreq".partnercontact_id is '';


-- =============================================
-- FIELD: paymtype_id smallint
-- =============================================
-- ADD paymtype_id
alter table public."paymreq" add paymtype_id smallint  ;
comment on column public."paymreq".paymtype_id is '';

-- MODIFY paymtype_id
alter table public."paymreq"
	alter column paymtype_id type smallint,
	ALTER COLUMN paymtype_id DROP DEFAULT,
	ALTER COLUMN paymtype_id DROP NOT NULL;
comment on column public."paymreq".paymtype_id is '';


-- =============================================
-- FIELD: payment_bgno text
-- =============================================
-- ADD payment_bgno
alter table public."paymreq" add payment_bgno text  ;
comment on column public."paymreq".payment_bgno is '';

-- MODIFY payment_bgno
alter table public."paymreq"
	alter column payment_bgno type text,
	ALTER COLUMN payment_bgno DROP DEFAULT,
	ALTER COLUMN payment_bgno DROP NOT NULL;
comment on column public."paymreq".payment_bgno is '';


-- =============================================
-- FIELD: partnerbank_id bigint
-- =============================================
-- ADD partnerbank_id
alter table public."paymreq" add partnerbank_id bigint  ;
comment on column public."paymreq".partnerbank_id is '';

-- MODIFY partnerbank_id
alter table public."paymreq"
	alter column partnerbank_id type bigint,
	ALTER COLUMN partnerbank_id DROP DEFAULT,
	ALTER COLUMN partnerbank_id DROP NOT NULL;
comment on column public."paymreq".partnerbank_id is '';


-- =============================================
-- FIELD: partnerbank_account text
-- =============================================
-- ADD partnerbank_account
alter table public."paymreq" add partnerbank_account text  ;
comment on column public."paymreq".partnerbank_account is '';

-- MODIFY partnerbank_account
alter table public."paymreq"
	alter column partnerbank_account type text,
	ALTER COLUMN partnerbank_account DROP DEFAULT,
	ALTER COLUMN partnerbank_account DROP NOT NULL;
comment on column public."paymreq".partnerbank_account is '';


-- =============================================
-- FIELD: partnerbank_accountname text
-- =============================================
-- ADD partnerbank_accountname
alter table public."paymreq" add partnerbank_accountname text  ;
comment on column public."paymreq".partnerbank_accountname is '';

-- MODIFY partnerbank_accountname
alter table public."paymreq"
	alter column partnerbank_accountname type text,
	ALTER COLUMN partnerbank_accountname DROP DEFAULT,
	ALTER COLUMN partnerbank_accountname DROP NOT NULL;
comment on column public."paymreq".partnerbank_accountname is '';


-- =============================================
-- FIELD: partnerbank_bankname text
-- =============================================
-- ADD partnerbank_bankname
alter table public."paymreq" add partnerbank_bankname text  ;
comment on column public."paymreq".partnerbank_bankname is '';

-- MODIFY partnerbank_bankname
alter table public."paymreq"
	alter column partnerbank_bankname type text,
	ALTER COLUMN partnerbank_bankname DROP DEFAULT,
	ALTER COLUMN partnerbank_bankname DROP NOT NULL;
comment on column public."paymreq".partnerbank_bankname is '';


-- =============================================
-- FIELD: paymreq_value decimal(13, 2)
-- =============================================
-- ADD paymreq_value
alter table public."paymreq" add paymreq_value decimal(13, 2) not null default 0;
comment on column public."paymreq".paymreq_value is '';

-- MODIFY paymreq_value
alter table public."paymreq"
	alter column paymreq_value type decimal(13, 2),
	ALTER COLUMN paymreq_value SET DEFAULT 0,
	ALTER COLUMN paymreq_value SET NOT NULL;
comment on column public."paymreq".paymreq_value is '';


-- =============================================
-- FIELD: curr_id smallint
-- =============================================
-- ADD curr_id
alter table public."paymreq" add curr_id smallint  ;
comment on column public."paymreq".curr_id is '';

-- MODIFY curr_id
alter table public."paymreq"
	alter column curr_id type smallint,
	ALTER COLUMN curr_id DROP DEFAULT,
	ALTER COLUMN curr_id DROP NOT NULL;
comment on column public."paymreq".curr_id is '';


-- =============================================
-- FIELD: _commitby text
-- =============================================
-- ADD _commitby
alter table public."paymreq" add _commitby text  ;
comment on column public."paymreq"._commitby is '';

-- MODIFY _commitby
alter table public."paymreq"
	alter column _commitby type text,
	ALTER COLUMN _commitby DROP DEFAULT,
	ALTER COLUMN _commitby DROP NOT NULL;
comment on column public."paymreq"._commitby is '';


-- =============================================
-- FIELD: _commitdate text
-- =============================================
-- ADD _commitdate
alter table public."paymreq" add _commitdate text  ;
comment on column public."paymreq"._commitdate is '';

-- MODIFY _commitdate
alter table public."paymreq"
	alter column _commitdate type text,
	ALTER COLUMN _commitdate DROP DEFAULT,
	ALTER COLUMN _commitdate DROP NOT NULL;
comment on column public."paymreq"._commitdate is '';


-- =============================================
-- FIELD: _approveby text
-- =============================================
-- ADD _approveby
alter table public."paymreq" add _approveby text  ;
comment on column public."paymreq"._approveby is '';

-- MODIFY _approveby
alter table public."paymreq"
	alter column _approveby type text,
	ALTER COLUMN _approveby DROP DEFAULT,
	ALTER COLUMN _approveby DROP NOT NULL;
comment on column public."paymreq"._approveby is '';


-- =============================================
-- FIELD: _approvedate text
-- =============================================
-- ADD _approvedate
alter table public."paymreq" add _approvedate text  ;
comment on column public."paymreq"._approvedate is '';

-- MODIFY _approvedate
alter table public."paymreq"
	alter column _approvedate type text,
	ALTER COLUMN _approvedate DROP DEFAULT,
	ALTER COLUMN _approvedate DROP NOT NULL;
comment on column public."paymreq"._approvedate is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."paymreq" add _createby integer not null ;
comment on column public."paymreq"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."paymreq"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."paymreq"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."paymreq" add _createdate timestamp with time zone not null default now();
comment on column public."paymreq"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."paymreq"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."paymreq"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."paymreq" add _modifyby integer  ;
comment on column public."paymreq"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."paymreq"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."paymreq"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."paymreq" add _modifydate timestamp with time zone  ;
comment on column public."paymreq"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."paymreq"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."paymreq"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$paymreqtype_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$struct_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$project_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$site_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$unit_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$bc_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$partner_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$partnercontact_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$paymtype_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$partnerbank_id;
ALTER TABLE public."paymreq" DROP CONSTRAINT fk$public$paymreq$curr_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$paymreqtype_id
	FOREIGN KEY (paymreqtype_id)
	REFERENCES public."paymreqtype"(paymreqtype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$paymreqtype_id;
CREATE INDEX idx_fk$public$paymreq$paymreqtype_id ON public."paymreq"(paymreqtype_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$struct_id
	FOREIGN KEY (struct_id)
	REFERENCES public."struct"(struct_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$struct_id;
CREATE INDEX idx_fk$public$paymreq$struct_id ON public."paymreq"(struct_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$project_id
	FOREIGN KEY (project_id)
	REFERENCES public."project"(project_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$project_id;
CREATE INDEX idx_fk$public$paymreq$project_id ON public."paymreq"(project_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$site_id
	FOREIGN KEY (site_id)
	REFERENCES public."site"(site_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$site_id;
CREATE INDEX idx_fk$public$paymreq$site_id ON public."paymreq"(site_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$unit_id
	FOREIGN KEY (unit_id)
	REFERENCES public."unit"(unit_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$unit_id;
CREATE INDEX idx_fk$public$paymreq$unit_id ON public."paymreq"(unit_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$bc_id
	FOREIGN KEY (bc_id)
	REFERENCES public."bc"(bc_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$bc_id;
CREATE INDEX idx_fk$public$paymreq$bc_id ON public."paymreq"(bc_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$partner_id
	FOREIGN KEY (partner_id)
	REFERENCES public."partner"(partner_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$partner_id;
CREATE INDEX idx_fk$public$paymreq$partner_id ON public."paymreq"(partner_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$partnercontact_id
	FOREIGN KEY (partnercontact_id)
	REFERENCES public."partnercontact"(partnercontact_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$partnercontact_id;
CREATE INDEX idx_fk$public$paymreq$partnercontact_id ON public."paymreq"(partnercontact_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$paymtype_id
	FOREIGN KEY (paymtype_id)
	REFERENCES public."paymtype"(paymtype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$paymtype_id;
CREATE INDEX idx_fk$public$paymreq$paymtype_id ON public."paymreq"(paymtype_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$partnerbank_id
	FOREIGN KEY (partnerbank_id)
	REFERENCES public."partnerbank"(partnerbank_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$partnerbank_id;
CREATE INDEX idx_fk$public$paymreq$partnerbank_id ON public."paymreq"(partnerbank_id);	


ALTER TABLE public."paymreq"
	ADD CONSTRAINT fk$public$paymreq$curr_id
	FOREIGN KEY (curr_id)
	REFERENCES public."curr"(curr_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreq$curr_id;
CREATE INDEX idx_fk$public$paymreq$curr_id ON public."paymreq"(curr_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."paymreq"
	drop constraint uq$public$paymreq$paymreq_doc;
	

-- Add unique index 
alter table  public."paymreq"
	add constraint uq$public$paymreq$paymreq_doc unique (paymreq_doc); 

