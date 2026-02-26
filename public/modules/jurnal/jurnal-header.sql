-- jurnal.sql


/* =============================================
 * CREATE TABLE public."jurnal"
 * ============================================*/
create table public."jurnal" (
	jurnal_id bigint not null,
	constraint jurnal_pk primary key (jurnal_id)
);
comment on table public."jurnal" is '';	


-- =============================================
-- FIELD: jurnal_doc varchar(30)
-- =============================================
-- ADD jurnal_doc
alter table public."jurnal" add jurnal_doc varchar(30)  ;
comment on column public."jurnal".jurnal_doc is '';

-- MODIFY jurnal_doc
alter table public."jurnal"
	alter column jurnal_doc type varchar(30),
	ALTER COLUMN jurnal_doc DROP DEFAULT,
	ALTER COLUMN jurnal_doc DROP NOT NULL;
comment on column public."jurnal".jurnal_doc is '';


-- =============================================
-- FIELD: jurnal_version smallint
-- =============================================
-- ADD jurnal_version
alter table public."jurnal" add jurnal_version smallint not null default 0;
comment on column public."jurnal".jurnal_version is '';

-- MODIFY jurnal_version
alter table public."jurnal"
	alter column jurnal_version type smallint,
	ALTER COLUMN jurnal_version SET DEFAULT 0,
	ALTER COLUMN jurnal_version SET NOT NULL;
comment on column public."jurnal".jurnal_version is '';


-- =============================================
-- FIELD: jurnal_source text
-- =============================================
-- ADD jurnal_source
alter table public."jurnal" add jurnal_source text  ;
comment on column public."jurnal".jurnal_source is '';

-- MODIFY jurnal_source
alter table public."jurnal"
	alter column jurnal_source type text,
	ALTER COLUMN jurnal_source DROP DEFAULT,
	ALTER COLUMN jurnal_source DROP NOT NULL;
comment on column public."jurnal".jurnal_source is '';


-- =============================================
-- FIELD: iscommit boolean
-- =============================================
-- ADD iscommit
alter table public."jurnal" add iscommit boolean not null default false;
comment on column public."jurnal".iscommit is '';

-- MODIFY iscommit
alter table public."jurnal"
	alter column iscommit type boolean,
	ALTER COLUMN iscommit SET DEFAULT false,
	ALTER COLUMN iscommit SET NOT NULL;
comment on column public."jurnal".iscommit is '';


-- =============================================
-- FIELD: ispost boolean
-- =============================================
-- ADD ispost
alter table public."jurnal" add ispost boolean not null default false;
comment on column public."jurnal".ispost is '';

-- MODIFY ispost
alter table public."jurnal"
	alter column ispost type boolean,
	ALTER COLUMN ispost SET DEFAULT false,
	ALTER COLUMN ispost SET NOT NULL;
comment on column public."jurnal".ispost is '';


-- =============================================
-- FIELD: jurnaltype_id smallint
-- =============================================
-- ADD jurnaltype_id
alter table public."jurnal" add jurnaltype_id smallint not null default 0;
comment on column public."jurnal".jurnaltype_id is '';

-- MODIFY jurnaltype_id
alter table public."jurnal"
	alter column jurnaltype_id type smallint,
	ALTER COLUMN jurnaltype_id SET DEFAULT 0,
	ALTER COLUMN jurnaltype_id SET NOT NULL;
comment on column public."jurnal".jurnaltype_id is '';


-- =============================================
-- FIELD: paymreq_id bigint
-- =============================================
-- ADD paymreq_id
alter table public."jurnal" add paymreq_id bigint  ;
comment on column public."jurnal".paymreq_id is '';

-- MODIFY paymreq_id
alter table public."jurnal"
	alter column paymreq_id type bigint,
	ALTER COLUMN paymreq_id DROP DEFAULT,
	ALTER COLUMN paymreq_id DROP NOT NULL;
comment on column public."jurnal".paymreq_id is '';


-- =============================================
-- FIELD: periode_id smallint
-- =============================================
-- ADD periode_id
alter table public."jurnal" add periode_id smallint  ;
comment on column public."jurnal".periode_id is '';

-- MODIFY periode_id
alter table public."jurnal"
	alter column periode_id type smallint,
	ALTER COLUMN periode_id DROP DEFAULT,
	ALTER COLUMN periode_id DROP NOT NULL;
comment on column public."jurnal".periode_id is '';


-- =============================================
-- FIELD: jurnal_date date
-- =============================================
-- ADD jurnal_date
alter table public."jurnal" add jurnal_date date  default now();
comment on column public."jurnal".jurnal_date is '';

-- MODIFY jurnal_date
alter table public."jurnal"
	alter column jurnal_date type date,
	ALTER COLUMN jurnal_date SET DEFAULT now(),
	ALTER COLUMN jurnal_date DROP NOT NULL;
comment on column public."jurnal".jurnal_date is '';


-- =============================================
-- FIELD: jurnal_datedue date
-- =============================================
-- ADD jurnal_datedue
alter table public."jurnal" add jurnal_datedue date  default now();
comment on column public."jurnal".jurnal_datedue is '';

-- MODIFY jurnal_datedue
alter table public."jurnal"
	alter column jurnal_datedue type date,
	ALTER COLUMN jurnal_datedue SET DEFAULT now(),
	ALTER COLUMN jurnal_datedue DROP NOT NULL;
comment on column public."jurnal".jurnal_datedue is '';


-- =============================================
-- FIELD: jurnal_descr text
-- =============================================
-- ADD jurnal_descr
alter table public."jurnal" add jurnal_descr text  ;
comment on column public."jurnal".jurnal_descr is '';

-- MODIFY jurnal_descr
alter table public."jurnal"
	alter column jurnal_descr type text,
	ALTER COLUMN jurnal_descr DROP DEFAULT,
	ALTER COLUMN jurnal_descr DROP NOT NULL;
comment on column public."jurnal".jurnal_descr is '';


-- =============================================
-- FIELD: partner_id int
-- =============================================
-- ADD partner_id
alter table public."jurnal" add partner_id int  ;
comment on column public."jurnal".partner_id is '';

-- MODIFY partner_id
alter table public."jurnal"
	alter column partner_id type int,
	ALTER COLUMN partner_id DROP DEFAULT,
	ALTER COLUMN partner_id DROP NOT NULL;
comment on column public."jurnal".partner_id is '';


-- =============================================
-- FIELD: paymtype_id smallint
-- =============================================
-- ADD paymtype_id
alter table public."jurnal" add paymtype_id smallint  ;
comment on column public."jurnal".paymtype_id is '';

-- MODIFY paymtype_id
alter table public."jurnal"
	alter column paymtype_id type smallint,
	ALTER COLUMN paymtype_id DROP DEFAULT,
	ALTER COLUMN paymtype_id DROP NOT NULL;
comment on column public."jurnal".paymtype_id is '';


-- =============================================
-- FIELD: partnerbank_id bigint
-- =============================================
-- ADD partnerbank_id
alter table public."jurnal" add partnerbank_id bigint  ;
comment on column public."jurnal".partnerbank_id is '';

-- MODIFY partnerbank_id
alter table public."jurnal"
	alter column partnerbank_id type bigint,
	ALTER COLUMN partnerbank_id DROP DEFAULT,
	ALTER COLUMN partnerbank_id DROP NOT NULL;
comment on column public."jurnal".partnerbank_id is '';


-- =============================================
-- FIELD: payment_bgno text
-- =============================================
-- ADD payment_bgno
alter table public."jurnal" add payment_bgno text  ;
comment on column public."jurnal".payment_bgno is '';

-- MODIFY payment_bgno
alter table public."jurnal"
	alter column payment_bgno type text,
	ALTER COLUMN payment_bgno DROP DEFAULT,
	ALTER COLUMN payment_bgno DROP NOT NULL;
comment on column public."jurnal".payment_bgno is '';


-- =============================================
-- FIELD: partnerbank_account text
-- =============================================
-- ADD partnerbank_account
alter table public."jurnal" add partnerbank_account text  ;
comment on column public."jurnal".partnerbank_account is '';

-- MODIFY partnerbank_account
alter table public."jurnal"
	alter column partnerbank_account type text,
	ALTER COLUMN partnerbank_account DROP DEFAULT,
	ALTER COLUMN partnerbank_account DROP NOT NULL;
comment on column public."jurnal".partnerbank_account is '';


-- =============================================
-- FIELD: partnerbank_bankname text
-- =============================================
-- ADD partnerbank_bankname
alter table public."jurnal" add partnerbank_bankname text  ;
comment on column public."jurnal".partnerbank_bankname is '';

-- MODIFY partnerbank_bankname
alter table public."jurnal"
	alter column partnerbank_bankname type text,
	ALTER COLUMN partnerbank_bankname DROP DEFAULT,
	ALTER COLUMN partnerbank_bankname DROP NOT NULL;
comment on column public."jurnal".partnerbank_bankname is '';


-- =============================================
-- FIELD: partnerbank_accountname text
-- =============================================
-- ADD partnerbank_accountname
alter table public."jurnal" add partnerbank_accountname text  ;
comment on column public."jurnal".partnerbank_accountname is '';

-- MODIFY partnerbank_accountname
alter table public."jurnal"
	alter column partnerbank_accountname type text,
	ALTER COLUMN partnerbank_accountname DROP DEFAULT,
	ALTER COLUMN partnerbank_accountname DROP NOT NULL;
comment on column public."jurnal".partnerbank_accountname is '';


-- =============================================
-- FIELD: partnercontact_id bigint
-- =============================================
-- ADD partnercontact_id
alter table public."jurnal" add partnercontact_id bigint  ;
comment on column public."jurnal".partnercontact_id is '';

-- MODIFY partnercontact_id
alter table public."jurnal"
	alter column partnercontact_id type bigint,
	ALTER COLUMN partnercontact_id DROP DEFAULT,
	ALTER COLUMN partnercontact_id DROP NOT NULL;
comment on column public."jurnal".partnercontact_id is '';


-- =============================================
-- FIELD: coa_id int
-- =============================================
-- ADD coa_id
alter table public."jurnal" add coa_id int  ;
comment on column public."jurnal".coa_id is '';

-- MODIFY coa_id
alter table public."jurnal"
	alter column coa_id type int,
	ALTER COLUMN coa_id DROP DEFAULT,
	ALTER COLUMN coa_id DROP NOT NULL;
comment on column public."jurnal".coa_id is '';


-- =============================================
-- FIELD: struct_id int
-- =============================================
-- ADD struct_id
alter table public."jurnal" add struct_id int  ;
comment on column public."jurnal".struct_id is '';

-- MODIFY struct_id
alter table public."jurnal"
	alter column struct_id type int,
	ALTER COLUMN struct_id DROP DEFAULT,
	ALTER COLUMN struct_id DROP NOT NULL;
comment on column public."jurnal".struct_id is '';


-- =============================================
-- FIELD: site_id int
-- =============================================
-- ADD site_id
alter table public."jurnal" add site_id int  ;
comment on column public."jurnal".site_id is '';

-- MODIFY site_id
alter table public."jurnal"
	alter column site_id type int,
	ALTER COLUMN site_id DROP DEFAULT,
	ALTER COLUMN site_id DROP NOT NULL;
comment on column public."jurnal".site_id is '';


-- =============================================
-- FIELD: unit_id int
-- =============================================
-- ADD unit_id
alter table public."jurnal" add unit_id int  ;
comment on column public."jurnal".unit_id is '';

-- MODIFY unit_id
alter table public."jurnal"
	alter column unit_id type int,
	ALTER COLUMN unit_id DROP DEFAULT,
	ALTER COLUMN unit_id DROP NOT NULL;
comment on column public."jurnal".unit_id is '';


-- =============================================
-- FIELD: project_id int
-- =============================================
-- ADD project_id
alter table public."jurnal" add project_id int  ;
comment on column public."jurnal".project_id is '';

-- MODIFY project_id
alter table public."jurnal"
	alter column project_id type int,
	ALTER COLUMN project_id DROP DEFAULT,
	ALTER COLUMN project_id DROP NOT NULL;
comment on column public."jurnal".project_id is '';


-- =============================================
-- FIELD: curr_id smallint
-- =============================================
-- ADD curr_id
alter table public."jurnal" add curr_id smallint  ;
comment on column public."jurnal".curr_id is '';

-- MODIFY curr_id
alter table public."jurnal"
	alter column curr_id type smallint,
	ALTER COLUMN curr_id DROP DEFAULT,
	ALTER COLUMN curr_id DROP NOT NULL;
comment on column public."jurnal".curr_id is '';


-- =============================================
-- FIELD: jurnal_value decimal(13, 2)
-- =============================================
-- ADD jurnal_value
alter table public."jurnal" add jurnal_value decimal(13, 2) not null default 0;
comment on column public."jurnal".jurnal_value is '';

-- MODIFY jurnal_value
alter table public."jurnal"
	alter column jurnal_value type decimal(13, 2),
	ALTER COLUMN jurnal_value SET DEFAULT 0,
	ALTER COLUMN jurnal_value SET NOT NULL;
comment on column public."jurnal".jurnal_value is '';


-- =============================================
-- FIELD: curr_rate decimal(5, 0)
-- =============================================
-- ADD curr_rate
alter table public."jurnal" add curr_rate decimal(5, 0) not null default 1;
comment on column public."jurnal".curr_rate is '';

-- MODIFY curr_rate
alter table public."jurnal"
	alter column curr_rate type decimal(5, 0),
	ALTER COLUMN curr_rate SET DEFAULT 1,
	ALTER COLUMN curr_rate SET NOT NULL;
comment on column public."jurnal".curr_rate is '';


-- =============================================
-- FIELD: jurnal_idr decimal(18, 2)
-- =============================================
-- ADD jurnal_idr
alter table public."jurnal" add jurnal_idr decimal(18, 2) not null default 0;
comment on column public."jurnal".jurnal_idr is '';

-- MODIFY jurnal_idr
alter table public."jurnal"
	alter column jurnal_idr type decimal(18, 2),
	ALTER COLUMN jurnal_idr SET DEFAULT 0,
	ALTER COLUMN jurnal_idr SET NOT NULL;
comment on column public."jurnal".jurnal_idr is '';


-- =============================================
-- FIELD: copyto varchar(1)
-- =============================================
-- ADD copyto
alter table public."jurnal" add copyto varchar(1)  ;
comment on column public."jurnal".copyto is '';

-- MODIFY copyto
alter table public."jurnal"
	alter column copyto type varchar(1),
	ALTER COLUMN copyto DROP DEFAULT,
	ALTER COLUMN copyto DROP NOT NULL;
comment on column public."jurnal".copyto is '';


-- =============================================
-- FIELD: coacurr text
-- =============================================
-- ADD coacurr
alter table public."jurnal" add coacurr text  ;
comment on column public."jurnal".coacurr is '';

-- MODIFY coacurr
alter table public."jurnal"
	alter column coacurr type text,
	ALTER COLUMN coacurr DROP DEFAULT,
	ALTER COLUMN coacurr DROP NOT NULL;
comment on column public."jurnal".coacurr is '';


-- =============================================
-- FIELD: jurnaldetil_id_link bigint
-- =============================================
-- ADD jurnaldetil_id_link
alter table public."jurnal" add jurnaldetil_id_link bigint  ;
comment on column public."jurnal".jurnaldetil_id_link is '';

-- MODIFY jurnaldetil_id_link
alter table public."jurnal"
	alter column jurnaldetil_id_link type bigint,
	ALTER COLUMN jurnaldetil_id_link DROP DEFAULT,
	ALTER COLUMN jurnaldetil_id_link DROP NOT NULL;
comment on column public."jurnal".jurnaldetil_id_link is '';


-- =============================================
-- FIELD: _commitby text
-- =============================================
-- ADD _commitby
alter table public."jurnal" add _commitby text  ;
comment on column public."jurnal"._commitby is '';

-- MODIFY _commitby
alter table public."jurnal"
	alter column _commitby type text,
	ALTER COLUMN _commitby DROP DEFAULT,
	ALTER COLUMN _commitby DROP NOT NULL;
comment on column public."jurnal"._commitby is '';


-- =============================================
-- FIELD: _commitdate timestamp with time zone
-- =============================================
-- ADD _commitdate
alter table public."jurnal" add _commitdate timestamp with time zone  ;
comment on column public."jurnal"._commitdate is '';

-- MODIFY _commitdate
alter table public."jurnal"
	alter column _commitdate type timestamp with time zone,
	ALTER COLUMN _commitdate DROP DEFAULT,
	ALTER COLUMN _commitdate DROP NOT NULL;
comment on column public."jurnal"._commitdate is '';


-- =============================================
-- FIELD: _postby text
-- =============================================
-- ADD _postby
alter table public."jurnal" add _postby text  ;
comment on column public."jurnal"._postby is '';

-- MODIFY _postby
alter table public."jurnal"
	alter column _postby type text,
	ALTER COLUMN _postby DROP DEFAULT,
	ALTER COLUMN _postby DROP NOT NULL;
comment on column public."jurnal"._postby is '';


-- =============================================
-- FIELD: _postdate timestamp with time zone
-- =============================================
-- ADD _postdate
alter table public."jurnal" add _postdate timestamp with time zone  ;
comment on column public."jurnal"._postdate is '';

-- MODIFY _postdate
alter table public."jurnal"
	alter column _postdate type timestamp with time zone,
	ALTER COLUMN _postdate DROP DEFAULT,
	ALTER COLUMN _postdate DROP NOT NULL;
comment on column public."jurnal"._postdate is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."jurnal" add _createby integer not null ;
comment on column public."jurnal"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."jurnal"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."jurnal"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."jurnal" add _createdate timestamp with time zone not null default now();
comment on column public."jurnal"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."jurnal"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."jurnal"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."jurnal" add _modifyby integer  ;
comment on column public."jurnal"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."jurnal"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."jurnal"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."jurnal" add _modifydate timestamp with time zone  ;
comment on column public."jurnal"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."jurnal"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."jurnal"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$project_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$curr_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$jurnaldetil_id_link;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$jurnaltype_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$paymreq_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$periode_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$partner_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$paymtype_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$partnerbank_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$partnercontact_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$coa_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$struct_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$site_id;
ALTER TABLE public."jurnal" DROP CONSTRAINT fk$public$jurnal$unit_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$jurnaltype_id
	FOREIGN KEY (jurnaltype_id)
	REFERENCES public."jurnaltype"(jurnaltype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$jurnaltype_id;
CREATE INDEX idx_fk$public$jurnal$jurnaltype_id ON public."jurnal"(jurnaltype_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$paymreq_id
	FOREIGN KEY (paymreq_id)
	REFERENCES public."paymreq"(paymreq_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$paymreq_id;
CREATE INDEX idx_fk$public$jurnal$paymreq_id ON public."jurnal"(paymreq_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$periode_id
	FOREIGN KEY (periode_id)
	REFERENCES public."periode"(periode_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$periode_id;
CREATE INDEX idx_fk$public$jurnal$periode_id ON public."jurnal"(periode_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$partner_id
	FOREIGN KEY (partner_id)
	REFERENCES public."partner"(partner_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$partner_id;
CREATE INDEX idx_fk$public$jurnal$partner_id ON public."jurnal"(partner_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$paymtype_id
	FOREIGN KEY (paymtype_id)
	REFERENCES public."paymtype"(paymtype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$paymtype_id;
CREATE INDEX idx_fk$public$jurnal$paymtype_id ON public."jurnal"(paymtype_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$partnerbank_id
	FOREIGN KEY (partnerbank_id)
	REFERENCES public."partnerbank"(partnerbank_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$partnerbank_id;
CREATE INDEX idx_fk$public$jurnal$partnerbank_id ON public."jurnal"(partnerbank_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$partnercontact_id
	FOREIGN KEY (partnercontact_id)
	REFERENCES public."partnercontact"(partnercontact_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$partnercontact_id;
CREATE INDEX idx_fk$public$jurnal$partnercontact_id ON public."jurnal"(partnercontact_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$coa_id
	FOREIGN KEY (coa_id)
	REFERENCES public."coa"(coa_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$coa_id;
CREATE INDEX idx_fk$public$jurnal$coa_id ON public."jurnal"(coa_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$struct_id
	FOREIGN KEY (struct_id)
	REFERENCES public."struct"(struct_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$struct_id;
CREATE INDEX idx_fk$public$jurnal$struct_id ON public."jurnal"(struct_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$site_id
	FOREIGN KEY (site_id)
	REFERENCES public."site"(site_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$site_id;
CREATE INDEX idx_fk$public$jurnal$site_id ON public."jurnal"(site_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$unit_id
	FOREIGN KEY (unit_id)
	REFERENCES public."unit"(unit_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$unit_id;
CREATE INDEX idx_fk$public$jurnal$unit_id ON public."jurnal"(unit_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$project_id
	FOREIGN KEY (project_id)
	REFERENCES public."project"(project_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$project_id;
CREATE INDEX idx_fk$public$jurnal$project_id ON public."jurnal"(project_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$curr_id
	FOREIGN KEY (curr_id)
	REFERENCES public."curr"(curr_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$curr_id;
CREATE INDEX idx_fk$public$jurnal$curr_id ON public."jurnal"(curr_id);	


ALTER TABLE public."jurnal"
	ADD CONSTRAINT fk$public$jurnal$jurnaldetil_id_link
	FOREIGN KEY (jurnaldetil_id_link)
	REFERENCES public."jurnaldetil"(jurnaldetil_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnal$jurnaldetil_id_link;
CREATE INDEX idx_fk$public$jurnal$jurnaldetil_id_link ON public."jurnal"(jurnaldetil_id_link);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."jurnal"
	drop constraint uq$public$jurnal$jurnal_doc;
	

-- Add unique index 
alter table  public."jurnal"
	add constraint uq$public$jurnal$jurnal_doc unique (jurnal_doc); 

