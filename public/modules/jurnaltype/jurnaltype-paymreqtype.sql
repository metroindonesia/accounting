-- jurnaltype.sql


/* =============================================
 * CREATE TABLE public."jurnaltypepaymreqtype"
 * ============================================*/
create table public."jurnaltypepaymreqtype" (
	jurnaltypepaymreqtype_id bigint not null,
	constraint jurnaltypepaymreqtype_pk primary key (jurnaltypepaymreqtype_id)
);
comment on table public."jurnaltypepaymreqtype" is '';	


-- =============================================
-- FIELD: paymreqtype_id smallint
-- =============================================
-- ADD paymreqtype_id
alter table public."jurnaltypepaymreqtype" add paymreqtype_id smallint  ;
comment on column public."jurnaltypepaymreqtype".paymreqtype_id is '';

-- MODIFY paymreqtype_id
alter table public."jurnaltypepaymreqtype"
	alter column paymreqtype_id type smallint,
	ALTER COLUMN paymreqtype_id DROP DEFAULT,
	ALTER COLUMN paymreqtype_id DROP NOT NULL;
comment on column public."jurnaltypepaymreqtype".paymreqtype_id is '';


-- =============================================
-- FIELD: jurnaltype_id smallint
-- =============================================
-- ADD jurnaltype_id
alter table public."jurnaltypepaymreqtype" add jurnaltype_id smallint  ;
comment on column public."jurnaltypepaymreqtype".jurnaltype_id is '';

-- MODIFY jurnaltype_id
alter table public."jurnaltypepaymreqtype"
	alter column jurnaltype_id type smallint,
	ALTER COLUMN jurnaltype_id DROP DEFAULT,
	ALTER COLUMN jurnaltype_id DROP NOT NULL;
comment on column public."jurnaltypepaymreqtype".jurnaltype_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."jurnaltypepaymreqtype" add _createby integer not null ;
comment on column public."jurnaltypepaymreqtype"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."jurnaltypepaymreqtype"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."jurnaltypepaymreqtype"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."jurnaltypepaymreqtype" add _createdate timestamp with time zone not null default now();
comment on column public."jurnaltypepaymreqtype"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."jurnaltypepaymreqtype"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."jurnaltypepaymreqtype"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."jurnaltypepaymreqtype" add _modifyby integer  ;
comment on column public."jurnaltypepaymreqtype"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."jurnaltypepaymreqtype"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."jurnaltypepaymreqtype"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."jurnaltypepaymreqtype" add _modifydate timestamp with time zone  ;
comment on column public."jurnaltypepaymreqtype"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."jurnaltypepaymreqtype"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."jurnaltypepaymreqtype"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."jurnaltypepaymreqtype" DROP CONSTRAINT fk$public$jurnaltypepaymreqtype$paymreqtype_id;
ALTER TABLE public."jurnaltypepaymreqtype" DROP CONSTRAINT fk$public$jurnaltypepaymreqtype$jurnaltype_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."jurnaltypepaymreqtype"
	ADD CONSTRAINT fk$public$jurnaltypepaymreqtype$paymreqtype_id
	FOREIGN KEY (paymreqtype_id)
	REFERENCES public."paymreqtype"(paymreqtype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaltypepaymreqtype$paymreqtype_id;
CREATE INDEX idx_fk$public$jurnaltypepaymreqtype$paymreqtype_id ON public."jurnaltypepaymreqtype"(paymreqtype_id);	


ALTER TABLE public."jurnaltypepaymreqtype"
	ADD CONSTRAINT fk$public$jurnaltypepaymreqtype$jurnaltype_id
	FOREIGN KEY (jurnaltype_id)
	REFERENCES public."jurnaltype"(jurnaltype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaltypepaymreqtype$jurnaltype_id;
CREATE INDEX idx_fk$public$jurnaltypepaymreqtype$jurnaltype_id ON public."jurnaltypepaymreqtype"(jurnaltype_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."jurnaltypepaymreqtype"
	drop constraint uq$public$jurnaltypepaymreqtype$jurnaltypepaymreqtype_pair;
	

-- Add unique index 
alter table  public."jurnaltypepaymreqtype"
	add constraint uq$public$jurnaltypepaymreqtype$jurnaltypepaymreqtype_pair unique (jurnaltype_id, paymreqtype_id); 

