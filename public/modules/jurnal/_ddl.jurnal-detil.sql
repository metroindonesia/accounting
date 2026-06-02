-- jurnal.sql


/* =============================================
 * CREATE TABLE public."jurnaldetil"
 * ============================================*/
create table public."jurnaldetil" (
	jurnaldetil_id bigint not null,
	constraint jurnaldetil_pk primary key (jurnaldetil_id)
);
comment on table public."jurnaldetil" is '';	


-- =============================================
-- FIELD: coa_id int
-- =============================================
-- ADD coa_id
alter table public."jurnaldetil" add coa_id int  ;
comment on column public."jurnaldetil".coa_id is '';

-- MODIFY coa_id
alter table public."jurnaldetil"
	alter column coa_id type int,
	ALTER COLUMN coa_id DROP DEFAULT,
	ALTER COLUMN coa_id DROP NOT NULL;
comment on column public."jurnaldetil".coa_id is '';


-- =============================================
-- FIELD: jurnaldetil_descr text
-- =============================================
-- ADD jurnaldetil_descr
alter table public."jurnaldetil" add jurnaldetil_descr text  ;
comment on column public."jurnaldetil".jurnaldetil_descr is '';

-- MODIFY jurnaldetil_descr
alter table public."jurnaldetil"
	alter column jurnaldetil_descr type text,
	ALTER COLUMN jurnaldetil_descr DROP DEFAULT,
	ALTER COLUMN jurnaldetil_descr DROP NOT NULL;
comment on column public."jurnaldetil".jurnaldetil_descr is '';


-- =============================================
-- FIELD: partner_id int
-- =============================================
-- ADD partner_id
alter table public."jurnaldetil" add partner_id int  ;
comment on column public."jurnaldetil".partner_id is '';

-- MODIFY partner_id
alter table public."jurnaldetil"
	alter column partner_id type int,
	ALTER COLUMN partner_id DROP DEFAULT,
	ALTER COLUMN partner_id DROP NOT NULL;
comment on column public."jurnaldetil".partner_id is '';


-- =============================================
-- FIELD: struct_id int
-- =============================================
-- ADD struct_id
alter table public."jurnaldetil" add struct_id int  ;
comment on column public."jurnaldetil".struct_id is '';

-- MODIFY struct_id
alter table public."jurnaldetil"
	alter column struct_id type int,
	ALTER COLUMN struct_id DROP DEFAULT,
	ALTER COLUMN struct_id DROP NOT NULL;
comment on column public."jurnaldetil".struct_id is '';


-- =============================================
-- FIELD: site_id int
-- =============================================
-- ADD site_id
alter table public."jurnaldetil" add site_id int  ;
comment on column public."jurnaldetil".site_id is '';

-- MODIFY site_id
alter table public."jurnaldetil"
	alter column site_id type int,
	ALTER COLUMN site_id DROP DEFAULT,
	ALTER COLUMN site_id DROP NOT NULL;
comment on column public."jurnaldetil".site_id is '';


-- =============================================
-- FIELD: unit_id int
-- =============================================
-- ADD unit_id
alter table public."jurnaldetil" add unit_id int  ;
comment on column public."jurnaldetil".unit_id is '';

-- MODIFY unit_id
alter table public."jurnaldetil"
	alter column unit_id type int,
	ALTER COLUMN unit_id DROP DEFAULT,
	ALTER COLUMN unit_id DROP NOT NULL;
comment on column public."jurnaldetil".unit_id is '';


-- =============================================
-- FIELD: project_id int
-- =============================================
-- ADD project_id
alter table public."jurnaldetil" add project_id int  ;
comment on column public."jurnaldetil".project_id is '';

-- MODIFY project_id
alter table public."jurnaldetil"
	alter column project_id type int,
	ALTER COLUMN project_id DROP DEFAULT,
	ALTER COLUMN project_id DROP NOT NULL;
comment on column public."jurnaldetil".project_id is '';


-- =============================================
-- FIELD: curr_id smallint
-- =============================================
-- ADD curr_id
alter table public."jurnaldetil" add curr_id smallint  ;
comment on column public."jurnaldetil".curr_id is '';

-- MODIFY curr_id
alter table public."jurnaldetil"
	alter column curr_id type smallint,
	ALTER COLUMN curr_id DROP DEFAULT,
	ALTER COLUMN curr_id DROP NOT NULL;
comment on column public."jurnaldetil".curr_id is '';


-- =============================================
-- FIELD: jurnaldetil_value decimal(18, 2)
-- =============================================
-- ADD jurnaldetil_value
alter table public."jurnaldetil" add jurnaldetil_value decimal(18, 2) not null default 0;
comment on column public."jurnaldetil".jurnaldetil_value is '';

-- MODIFY jurnaldetil_value
alter table public."jurnaldetil"
	alter column jurnaldetil_value type decimal(18, 2),
	ALTER COLUMN jurnaldetil_value SET DEFAULT 0,
	ALTER COLUMN jurnaldetil_value SET NOT NULL;
comment on column public."jurnaldetil".jurnaldetil_value is '';


-- =============================================
-- FIELD: curr_rate decimal(5, 0)
-- =============================================
-- ADD curr_rate
alter table public."jurnaldetil" add curr_rate decimal(5, 0) not null default 1;
comment on column public."jurnaldetil".curr_rate is '';

-- MODIFY curr_rate
alter table public."jurnaldetil"
	alter column curr_rate type decimal(5, 0),
	ALTER COLUMN curr_rate SET DEFAULT 1,
	ALTER COLUMN curr_rate SET NOT NULL;
comment on column public."jurnaldetil".curr_rate is '';


-- =============================================
-- FIELD: jurnaldetil_idr decimal(18, 2)
-- =============================================
-- ADD jurnaldetil_idr
alter table public."jurnaldetil" add jurnaldetil_idr decimal(18, 2) not null default 0;
comment on column public."jurnaldetil".jurnaldetil_idr is '';

-- MODIFY jurnaldetil_idr
alter table public."jurnaldetil"
	alter column jurnaldetil_idr type decimal(18, 2),
	ALTER COLUMN jurnaldetil_idr SET DEFAULT 0,
	ALTER COLUMN jurnaldetil_idr SET NOT NULL;
comment on column public."jurnaldetil".jurnaldetil_idr is '';


-- =============================================
-- FIELD: jurnaltype_id smallint
-- =============================================
-- ADD jurnaltype_id
alter table public."jurnaldetil" add jurnaltype_id smallint  ;
comment on column public."jurnaldetil".jurnaltype_id is '';

-- MODIFY jurnaltype_id
alter table public."jurnaldetil"
	alter column jurnaltype_id type smallint,
	ALTER COLUMN jurnaltype_id DROP DEFAULT,
	ALTER COLUMN jurnaltype_id DROP NOT NULL;
comment on column public."jurnaldetil".jurnaltype_id is '';


-- =============================================
-- FIELD: jurnaldetil_id_ref bigint
-- =============================================
-- ADD jurnaldetil_id_ref
alter table public."jurnaldetil" add jurnaldetil_id_ref bigint  ;
comment on column public."jurnaldetil".jurnaldetil_id_ref is '';

-- MODIFY jurnaldetil_id_ref
alter table public."jurnaldetil"
	alter column jurnaldetil_id_ref type bigint,
	ALTER COLUMN jurnaldetil_id_ref DROP DEFAULT,
	ALTER COLUMN jurnaldetil_id_ref DROP NOT NULL;
comment on column public."jurnaldetil".jurnaldetil_id_ref is '';


-- =============================================
-- FIELD: coacurr text
-- =============================================
-- ADD coacurr
alter table public."jurnaldetil" add coacurr text  ;
comment on column public."jurnaldetil".coacurr is '';

-- MODIFY coacurr
alter table public."jurnaldetil"
	alter column coacurr type text,
	ALTER COLUMN coacurr DROP DEFAULT,
	ALTER COLUMN coacurr DROP NOT NULL;
comment on column public."jurnaldetil".coacurr is '';


-- =============================================
-- FIELD: jurnaldetil_ishead boolean
-- =============================================
-- ADD jurnaldetil_ishead
alter table public."jurnaldetil" add jurnaldetil_ishead boolean not null default false;
comment on column public."jurnaldetil".jurnaldetil_ishead is '';

-- MODIFY jurnaldetil_ishead
alter table public."jurnaldetil"
	alter column jurnaldetil_ishead type boolean,
	ALTER COLUMN jurnaldetil_ishead SET DEFAULT false,
	ALTER COLUMN jurnaldetil_ishead SET NOT NULL;
comment on column public."jurnaldetil".jurnaldetil_ishead is '';


-- =============================================
-- FIELD: agingtype_id smallint
-- =============================================
-- ADD agingtype_id
alter table public."jurnaldetil" add agingtype_id smallint  ;
comment on column public."jurnaldetil".agingtype_id is '';

-- MODIFY agingtype_id
alter table public."jurnaldetil"
	alter column agingtype_id type smallint,
	ALTER COLUMN agingtype_id DROP DEFAULT,
	ALTER COLUMN agingtype_id DROP NOT NULL;
comment on column public."jurnaldetil".agingtype_id is '';


-- =============================================
-- FIELD: blockorder smallint
-- =============================================
-- ADD blockorder
alter table public."jurnaldetil" add blockorder smallint not null default 0;
comment on column public."jurnaldetil".blockorder is '';

-- MODIFY blockorder
alter table public."jurnaldetil"
	alter column blockorder type smallint,
	ALTER COLUMN blockorder SET DEFAULT 0,
	ALTER COLUMN blockorder SET NOT NULL;
comment on column public."jurnaldetil".blockorder is '';


-- =============================================
-- FIELD: paymreq_id bigint
-- =============================================
-- ADD paymreq_id
alter table public."jurnaldetil" add paymreq_id bigint  ;
comment on column public."jurnaldetil".paymreq_id is '';

-- MODIFY paymreq_id
alter table public."jurnaldetil"
	alter column paymreq_id type bigint,
	ALTER COLUMN paymreq_id DROP DEFAULT,
	ALTER COLUMN paymreq_id DROP NOT NULL;
comment on column public."jurnaldetil".paymreq_id is '';


-- =============================================
-- FIELD: paymreqdetil_id bigint
-- =============================================
-- ADD paymreqdetil_id
alter table public."jurnaldetil" add paymreqdetil_id bigint  ;
comment on column public."jurnaldetil".paymreqdetil_id is '';

-- MODIFY paymreqdetil_id
alter table public."jurnaldetil"
	alter column paymreqdetil_id type bigint,
	ALTER COLUMN paymreqdetil_id DROP DEFAULT,
	ALTER COLUMN paymreqdetil_id DROP NOT NULL;
comment on column public."jurnaldetil".paymreqdetil_id is '';


-- =============================================
-- FIELD: tag_paymreq_id bigint
-- =============================================
-- ADD tag_paymreq_id
alter table public."jurnaldetil" add tag_paymreq_id bigint  ;
comment on column public."jurnaldetil".tag_paymreq_id is 'untuk penanda bahwa baris ini merupakan hasil tarikan detil dari dokumen paymreq';

-- MODIFY tag_paymreq_id
alter table public."jurnaldetil"
	alter column tag_paymreq_id type bigint,
	ALTER COLUMN tag_paymreq_id DROP DEFAULT,
	ALTER COLUMN tag_paymreq_id DROP NOT NULL;
comment on column public."jurnaldetil".tag_paymreq_id is 'untuk penanda bahwa baris ini merupakan hasil tarikan detil dari dokumen paymreq';


-- =============================================
-- FIELD: tag_paymreq_data text
-- =============================================
-- ADD tag_paymreq_data
alter table public."jurnaldetil" add tag_paymreq_data text  ;
comment on column public."jurnaldetil".tag_paymreq_data is '';

-- MODIFY tag_paymreq_data
alter table public."jurnaldetil"
	alter column tag_paymreq_data type text,
	ALTER COLUMN tag_paymreq_data DROP DEFAULT,
	ALTER COLUMN tag_paymreq_data DROP NOT NULL;
comment on column public."jurnaldetil".tag_paymreq_data is '';


-- =============================================
-- FIELD: isdebet boolean
-- =============================================
-- ADD isdebet
alter table public."jurnaldetil" add isdebet boolean not null default false;
comment on column public."jurnaldetil".isdebet is '';

-- MODIFY isdebet
alter table public."jurnaldetil"
	alter column isdebet type boolean,
	ALTER COLUMN isdebet SET DEFAULT false,
	ALTER COLUMN isdebet SET NOT NULL;
comment on column public."jurnaldetil".isdebet is '';


-- =============================================
-- FIELD: iskredit boolean
-- =============================================
-- ADD iskredit
alter table public."jurnaldetil" add iskredit boolean not null default false;
comment on column public."jurnaldetil".iskredit is '';

-- MODIFY iskredit
alter table public."jurnaldetil"
	alter column iskredit type boolean,
	ALTER COLUMN iskredit SET DEFAULT false,
	ALTER COLUMN iskredit SET NOT NULL;
comment on column public."jurnaldetil".iskredit is '';


-- =============================================
-- FIELD: iscurradj boolean
-- =============================================
-- ADD iscurradj
alter table public."jurnaldetil" add iscurradj boolean not null default false;
comment on column public."jurnaldetil".iscurradj is '';

-- MODIFY iscurradj
alter table public."jurnaldetil"
	alter column iscurradj type boolean,
	ALTER COLUMN iscurradj SET DEFAULT false,
	ALTER COLUMN iscurradj SET NOT NULL;
comment on column public."jurnaldetil".iscurradj is '';


-- =============================================
-- FIELD: ismanuallink boolean
-- =============================================
-- ADD ismanuallink
alter table public."jurnaldetil" add ismanuallink boolean not null default false;
comment on column public."jurnaldetil".ismanuallink is '';

-- MODIFY ismanuallink
alter table public."jurnaldetil"
	alter column ismanuallink type boolean,
	ALTER COLUMN ismanuallink SET DEFAULT false,
	ALTER COLUMN ismanuallink SET NOT NULL;
comment on column public."jurnaldetil".ismanuallink is '';


-- =============================================
-- FIELD: jurnal_date date
-- =============================================
-- ADD jurnal_date
alter table public."jurnaldetil" add jurnal_date date  default now();
comment on column public."jurnaldetil".jurnal_date is '';

-- MODIFY jurnal_date
alter table public."jurnaldetil"
	alter column jurnal_date type date,
	ALTER COLUMN jurnal_date SET DEFAULT now(),
	ALTER COLUMN jurnal_date DROP NOT NULL;
comment on column public."jurnaldetil".jurnal_date is '';


-- =============================================
-- FIELD: jurnal_datedue date
-- =============================================
-- ADD jurnal_datedue
alter table public."jurnaldetil" add jurnal_datedue date  default now();
comment on column public."jurnaldetil".jurnal_datedue is '';

-- MODIFY jurnal_datedue
alter table public."jurnaldetil"
	alter column jurnal_datedue type date,
	ALTER COLUMN jurnal_datedue SET DEFAULT now(),
	ALTER COLUMN jurnal_datedue DROP NOT NULL;
comment on column public."jurnaldetil".jurnal_datedue is '';


-- =============================================
-- FIELD: periode_id smallint
-- =============================================
-- ADD periode_id
alter table public."jurnaldetil" add periode_id smallint  ;
comment on column public."jurnaldetil".periode_id is '';

-- MODIFY periode_id
alter table public."jurnaldetil"
	alter column periode_id type smallint,
	ALTER COLUMN periode_id DROP DEFAULT,
	ALTER COLUMN periode_id DROP NOT NULL;
comment on column public."jurnaldetil".periode_id is '';


-- =============================================
-- FIELD: ispost boolean
-- =============================================
-- ADD ispost
alter table public."jurnaldetil" add ispost boolean not null default false;
comment on column public."jurnaldetil".ispost is '';

-- MODIFY ispost
alter table public."jurnaldetil"
	alter column ispost type boolean,
	ALTER COLUMN ispost SET DEFAULT false,
	ALTER COLUMN ispost SET NOT NULL;
comment on column public."jurnaldetil".ispost is '';


-- =============================================
-- FIELD: jurnaldetil_order smallint
-- =============================================
-- ADD jurnaldetil_order
alter table public."jurnaldetil" add jurnaldetil_order smallint not null default 0;
comment on column public."jurnaldetil".jurnaldetil_order is '';

-- MODIFY jurnaldetil_order
alter table public."jurnaldetil"
	alter column jurnaldetil_order type smallint,
	ALTER COLUMN jurnaldetil_order SET DEFAULT 0,
	ALTER COLUMN jurnaldetil_order SET NOT NULL;
comment on column public."jurnaldetil".jurnaldetil_order is '';


-- =============================================
-- FIELD: outstanding_idr decimal(18, 2)
-- =============================================
-- ADD outstanding_idr
alter table public."jurnaldetil" add outstanding_idr decimal(18, 2) not null default 0;
comment on column public."jurnaldetil".outstanding_idr is '';

-- MODIFY outstanding_idr
alter table public."jurnaldetil"
	alter column outstanding_idr type decimal(18, 2),
	ALTER COLUMN outstanding_idr SET DEFAULT 0,
	ALTER COLUMN outstanding_idr SET NOT NULL;
comment on column public."jurnaldetil".outstanding_idr is '';


-- =============================================
-- FIELD: outstanding_value decimal(13, 2)
-- =============================================
-- ADD outstanding_value
alter table public."jurnaldetil" add outstanding_value decimal(13, 2) not null default 0;
comment on column public."jurnaldetil".outstanding_value is '';

-- MODIFY outstanding_value
alter table public."jurnaldetil"
	alter column outstanding_value type decimal(13, 2),
	ALTER COLUMN outstanding_value SET DEFAULT 0,
	ALTER COLUMN outstanding_value SET NOT NULL;
comment on column public."jurnaldetil".outstanding_value is '';


-- =============================================
-- FIELD: jurnal_doc varchar(30)
-- =============================================
-- ADD jurnal_doc
alter table public."jurnaldetil" add jurnal_doc varchar(30)  ;
comment on column public."jurnaldetil".jurnal_doc is '';

-- MODIFY jurnal_doc
alter table public."jurnaldetil"
	alter column jurnal_doc type varchar(30),
	ALTER COLUMN jurnal_doc DROP DEFAULT,
	ALTER COLUMN jurnal_doc DROP NOT NULL;
comment on column public."jurnaldetil".jurnal_doc is '';


-- =============================================
-- FIELD: jurnal_id bigint
-- =============================================
-- ADD jurnal_id
alter table public."jurnaldetil" add jurnal_id bigint  ;
comment on column public."jurnaldetil".jurnal_id is '';

-- MODIFY jurnal_id
alter table public."jurnaldetil"
	alter column jurnal_id type bigint,
	ALTER COLUMN jurnal_id DROP DEFAULT,
	ALTER COLUMN jurnal_id DROP NOT NULL;
comment on column public."jurnaldetil".jurnal_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."jurnaldetil" add _createby integer not null ;
comment on column public."jurnaldetil"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."jurnaldetil"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."jurnaldetil"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."jurnaldetil" add _createdate timestamp with time zone not null default now();
comment on column public."jurnaldetil"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."jurnaldetil"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."jurnaldetil"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."jurnaldetil" add _modifyby integer  ;
comment on column public."jurnaldetil"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."jurnaldetil"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."jurnaldetil"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."jurnaldetil" add _modifydate timestamp with time zone  ;
comment on column public."jurnaldetil"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."jurnaldetil"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."jurnaldetil"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$partner_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$struct_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$site_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$unit_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$coa_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$project_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$curr_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$jurnaltype_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$jurnaldetil_id_ref;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$agingtype_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$paymreq_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$paymreqdetil_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$tag_paymreq_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$periode_id;
ALTER TABLE public."jurnaldetil" DROP CONSTRAINT fk$public$jurnaldetil$jurnal_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$coa_id
	FOREIGN KEY (coa_id)
	REFERENCES public."coa"(coa_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$coa_id;
CREATE INDEX idx_fk$public$jurnaldetil$coa_id ON public."jurnaldetil"(coa_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$partner_id
	FOREIGN KEY (partner_id)
	REFERENCES public."partner"(partner_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$partner_id;
CREATE INDEX idx_fk$public$jurnaldetil$partner_id ON public."jurnaldetil"(partner_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$struct_id
	FOREIGN KEY (struct_id)
	REFERENCES public."struct"(struct_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$struct_id;
CREATE INDEX idx_fk$public$jurnaldetil$struct_id ON public."jurnaldetil"(struct_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$site_id
	FOREIGN KEY (site_id)
	REFERENCES public."site"(site_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$site_id;
CREATE INDEX idx_fk$public$jurnaldetil$site_id ON public."jurnaldetil"(site_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$unit_id
	FOREIGN KEY (unit_id)
	REFERENCES public."unit"(unit_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$unit_id;
CREATE INDEX idx_fk$public$jurnaldetil$unit_id ON public."jurnaldetil"(unit_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$project_id
	FOREIGN KEY (project_id)
	REFERENCES public."project"(project_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$project_id;
CREATE INDEX idx_fk$public$jurnaldetil$project_id ON public."jurnaldetil"(project_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$curr_id
	FOREIGN KEY (curr_id)
	REFERENCES public."curr"(curr_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$curr_id;
CREATE INDEX idx_fk$public$jurnaldetil$curr_id ON public."jurnaldetil"(curr_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$jurnaltype_id
	FOREIGN KEY (jurnaltype_id)
	REFERENCES public."jurnaltype"(jurnaltype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$jurnaltype_id;
CREATE INDEX idx_fk$public$jurnaldetil$jurnaltype_id ON public."jurnaldetil"(jurnaltype_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$jurnaldetil_id_ref
	FOREIGN KEY (jurnaldetil_id_ref)
	REFERENCES public."jurnaldetil"(jurnaldetil_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$jurnaldetil_id_ref;
CREATE INDEX idx_fk$public$jurnaldetil$jurnaldetil_id_ref ON public."jurnaldetil"(jurnaldetil_id_ref);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$agingtype_id
	FOREIGN KEY (agingtype_id)
	REFERENCES public."agingtype"(agingtype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$agingtype_id;
CREATE INDEX idx_fk$public$jurnaldetil$agingtype_id ON public."jurnaldetil"(agingtype_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$paymreq_id
	FOREIGN KEY (paymreq_id)
	REFERENCES public."paymreq"(paymreq_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$paymreq_id;
CREATE INDEX idx_fk$public$jurnaldetil$paymreq_id ON public."jurnaldetil"(paymreq_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$paymreqdetil_id
	FOREIGN KEY (paymreqdetil_id)
	REFERENCES public."paymreqdetil"(paymreqdetil_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$paymreqdetil_id;
CREATE INDEX idx_fk$public$jurnaldetil$paymreqdetil_id ON public."jurnaldetil"(paymreqdetil_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$tag_paymreq_id
	FOREIGN KEY (tag_paymreq_id)
	REFERENCES public."paymreq"(paymreq_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$tag_paymreq_id;
CREATE INDEX idx_fk$public$jurnaldetil$tag_paymreq_id ON public."jurnaldetil"(tag_paymreq_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$periode_id
	FOREIGN KEY (periode_id)
	REFERENCES public."periode"(periode_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$periode_id;
CREATE INDEX idx_fk$public$jurnaldetil$periode_id ON public."jurnaldetil"(periode_id);	


ALTER TABLE public."jurnaldetil"
	ADD CONSTRAINT fk$public$jurnaldetil$jurnal_id
	FOREIGN KEY (jurnal_id)
	REFERENCES public."jurnal"(jurnal_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaldetil$jurnal_id;
CREATE INDEX idx_fk$public$jurnaldetil$jurnal_id ON public."jurnaldetil"(jurnal_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================