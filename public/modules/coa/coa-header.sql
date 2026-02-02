-- coa.sql


/* =============================================
 * CREATE TABLE public."coa"
 * ============================================*/
create table public."coa" (
	coa_id int not null,
	constraint coa_pk primary key (coa_id)
);
comment on table public."coa" is '';	


-- =============================================
-- FIELD: coa_isdisabled boolean
-- =============================================
-- ADD coa_isdisabled
alter table public."coa" add coa_isdisabled boolean not null default false;
comment on column public."coa".coa_isdisabled is '';

-- MODIFY coa_isdisabled
alter table public."coa"
	alter column coa_isdisabled type boolean,
	ALTER COLUMN coa_isdisabled SET DEFAULT false,
	ALTER COLUMN coa_isdisabled SET NOT NULL;
comment on column public."coa".coa_isdisabled is '';


-- =============================================
-- FIELD: coa_name text
-- =============================================
-- ADD coa_name
alter table public."coa" add coa_name text  ;
comment on column public."coa".coa_name is '';

-- MODIFY coa_name
alter table public."coa"
	alter column coa_name type text,
	ALTER COLUMN coa_name DROP DEFAULT,
	ALTER COLUMN coa_name DROP NOT NULL;
comment on column public."coa".coa_name is '';


-- =============================================
-- FIELD: curr_id smallint
-- =============================================
-- ADD curr_id
alter table public."coa" add curr_id smallint  ;
comment on column public."coa".curr_id is '';

-- MODIFY curr_id
alter table public."coa"
	alter column curr_id type smallint,
	ALTER COLUMN curr_id DROP DEFAULT,
	ALTER COLUMN curr_id DROP NOT NULL;
comment on column public."coa".curr_id is '';


-- =============================================
-- FIELD: curr_descr text
-- =============================================
-- ADD curr_descr
alter table public."coa" add curr_descr text  ;
comment on column public."coa".curr_descr is '';

-- MODIFY curr_descr
alter table public."coa"
	alter column curr_descr type text,
	ALTER COLUMN curr_descr DROP DEFAULT,
	ALTER COLUMN curr_descr DROP NOT NULL;
comment on column public."coa".curr_descr is '';


-- =============================================
-- FIELD: coagroup_id int
-- =============================================
-- ADD coagroup_id
alter table public."coa" add coagroup_id int  ;
comment on column public."coa".coagroup_id is '';

-- MODIFY coagroup_id
alter table public."coa"
	alter column coagroup_id type int,
	ALTER COLUMN coagroup_id DROP DEFAULT,
	ALTER COLUMN coagroup_id DROP NOT NULL;
comment on column public."coa".coagroup_id is '';


-- =============================================
-- FIELD: coarpt_id smallint
-- =============================================
-- ADD coarpt_id
alter table public."coa" add coarpt_id smallint  ;
comment on column public."coa".coarpt_id is '';

-- MODIFY coarpt_id
alter table public."coa"
	alter column coarpt_id type smallint,
	ALTER COLUMN coarpt_id DROP DEFAULT,
	ALTER COLUMN coarpt_id DROP NOT NULL;
comment on column public."coa".coarpt_id is '';


-- =============================================
-- FIELD: agingtype_id smallint
-- =============================================
-- ADD agingtype_id
alter table public."coa" add agingtype_id smallint  ;
comment on column public."coa".agingtype_id is '';

-- MODIFY agingtype_id
alter table public."coa"
	alter column agingtype_id type smallint,
	ALTER COLUMN agingtype_id DROP DEFAULT,
	ALTER COLUMN agingtype_id DROP NOT NULL;
comment on column public."coa".agingtype_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."coa" add _createby integer not null ;
comment on column public."coa"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."coa"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."coa"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."coa" add _createdate timestamp with time zone not null default now();
comment on column public."coa"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."coa"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."coa"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."coa" add _modifyby integer  ;
comment on column public."coa"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."coa"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."coa"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."coa" add _modifydate timestamp with time zone  ;
comment on column public."coa"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."coa"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."coa"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE public."coa"
	ADD CONSTRAINT fk$public$coa$curr_id
	FOREIGN KEY (curr_id)
	REFERENCES public."curr"(curr_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$coa$curr_id;
CREATE INDEX idx_fk$public$coa$curr_id ON public."coa"(curr_id);	


ALTER TABLE public."coa"
	ADD CONSTRAINT fk$public$coa$coagroup_id
	FOREIGN KEY (coagroup_id)
	REFERENCES public."coagroup"(coagroup_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$coa$coagroup_id;
CREATE INDEX idx_fk$public$coa$coagroup_id ON public."coa"(coagroup_id);	


ALTER TABLE public."coa"
	ADD CONSTRAINT fk$public$coa$coarpt_id
	FOREIGN KEY (coarpt_id)
	REFERENCES public."coarpt"(coarpt_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$coa$coarpt_id;
CREATE INDEX idx_fk$public$coa$coarpt_id ON public."coa"(coarpt_id);	


ALTER TABLE public."coa"
	ADD CONSTRAINT fk$public$coa$agingtype_id
	FOREIGN KEY (agingtype_id)
	REFERENCES public."agingtype"(agingtype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$coa$agingtype_id;
CREATE INDEX idx_fk$public$coa$agingtype_id ON public."coa"(agingtype_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  public."coa"
	add constraint uq$public$coa$coa_name unique (coa_name); 

