-- jurnaltype.sql


/* =============================================
 * CREATE TABLE public."jurnaltypecoa"
 * ============================================*/
create table public."jurnaltypecoa" (
	jurnaltypecoa_id bigint not null,
	constraint jurnaltypecoa_pk primary key (jurnaltypecoa_id)
);
comment on table public."jurnaltypecoa" is '';	


-- =============================================
-- FIELD: coa_id int
-- =============================================
-- ADD coa_id
alter table public."jurnaltypecoa" add coa_id int  ;
comment on column public."jurnaltypecoa".coa_id is '';

-- MODIFY coa_id
alter table public."jurnaltypecoa"
	alter column coa_id type int,
	ALTER COLUMN coa_id DROP DEFAULT,
	ALTER COLUMN coa_id DROP NOT NULL;
comment on column public."jurnaltypecoa".coa_id is '';


-- =============================================
-- FIELD: jurnaltypecoa_isdr boolean
-- =============================================
-- ADD jurnaltypecoa_isdr
alter table public."jurnaltypecoa" add jurnaltypecoa_isdr boolean not null default false;
comment on column public."jurnaltypecoa".jurnaltypecoa_isdr is '';

-- MODIFY jurnaltypecoa_isdr
alter table public."jurnaltypecoa"
	alter column jurnaltypecoa_isdr type boolean,
	ALTER COLUMN jurnaltypecoa_isdr SET DEFAULT false,
	ALTER COLUMN jurnaltypecoa_isdr SET NOT NULL;
comment on column public."jurnaltypecoa".jurnaltypecoa_isdr is '';


-- =============================================
-- FIELD: jurnaltypecoa_iscr boolean
-- =============================================
-- ADD jurnaltypecoa_iscr
alter table public."jurnaltypecoa" add jurnaltypecoa_iscr boolean not null default false;
comment on column public."jurnaltypecoa".jurnaltypecoa_iscr is '';

-- MODIFY jurnaltypecoa_iscr
alter table public."jurnaltypecoa"
	alter column jurnaltypecoa_iscr type boolean,
	ALTER COLUMN jurnaltypecoa_iscr SET DEFAULT false,
	ALTER COLUMN jurnaltypecoa_iscr SET NOT NULL;
comment on column public."jurnaltypecoa".jurnaltypecoa_iscr is '';


-- =============================================
-- FIELD: jurnaltype_id smallint
-- =============================================
-- ADD jurnaltype_id
alter table public."jurnaltypecoa" add jurnaltype_id smallint  ;
comment on column public."jurnaltypecoa".jurnaltype_id is '';

-- MODIFY jurnaltype_id
alter table public."jurnaltypecoa"
	alter column jurnaltype_id type smallint,
	ALTER COLUMN jurnaltype_id DROP DEFAULT,
	ALTER COLUMN jurnaltype_id DROP NOT NULL;
comment on column public."jurnaltypecoa".jurnaltype_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."jurnaltypecoa" add _createby integer not null ;
comment on column public."jurnaltypecoa"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."jurnaltypecoa"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."jurnaltypecoa"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."jurnaltypecoa" add _createdate timestamp with time zone not null default now();
comment on column public."jurnaltypecoa"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."jurnaltypecoa"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."jurnaltypecoa"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."jurnaltypecoa" add _modifyby integer  ;
comment on column public."jurnaltypecoa"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."jurnaltypecoa"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."jurnaltypecoa"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."jurnaltypecoa" add _modifydate timestamp with time zone  ;
comment on column public."jurnaltypecoa"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."jurnaltypecoa"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."jurnaltypecoa"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."jurnaltypecoa" DROP CONSTRAINT fk$public$jurnaltypecoa$coa_id;
ALTER TABLE public."jurnaltypecoa" DROP CONSTRAINT fk$public$jurnaltypecoa$jurnaltype_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."jurnaltypecoa"
	ADD CONSTRAINT fk$public$jurnaltypecoa$coa_id
	FOREIGN KEY (coa_id)
	REFERENCES public."coa"(coa_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaltypecoa$coa_id;
CREATE INDEX idx_fk$public$jurnaltypecoa$coa_id ON public."jurnaltypecoa"(coa_id);	


ALTER TABLE public."jurnaltypecoa"
	ADD CONSTRAINT fk$public$jurnaltypecoa$jurnaltype_id
	FOREIGN KEY (jurnaltype_id)
	REFERENCES public."jurnaltype"(jurnaltype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaltypecoa$jurnaltype_id;
CREATE INDEX idx_fk$public$jurnaltypecoa$jurnaltype_id ON public."jurnaltypecoa"(jurnaltype_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."jurnaltypecoa"
	drop constraint uq$public$jurnaltypecoa$jurnaltypecoa_pair;
	

-- Add unique index 
alter table  public."jurnaltypecoa"
	add constraint uq$public$jurnaltypecoa$jurnaltypecoa_pair unique (jurnaltype_id, coa_id); 

