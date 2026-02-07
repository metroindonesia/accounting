-- paymreqtype.sql


/* =============================================
 * CREATE TABLE public."paymreqtype"
 * ============================================*/
create table public."paymreqtype" (
	paymreqtype_id smallint not null,
	constraint paymreqtype_pk primary key (paymreqtype_id)
);
comment on table public."paymreqtype" is '';	


-- =============================================
-- FIELD: paymreqtype_name text
-- =============================================
-- ADD paymreqtype_name
alter table public."paymreqtype" add paymreqtype_name text  ;
comment on column public."paymreqtype".paymreqtype_name is '';

-- MODIFY paymreqtype_name
alter table public."paymreqtype"
	alter column paymreqtype_name type text,
	ALTER COLUMN paymreqtype_name DROP DEFAULT,
	ALTER COLUMN paymreqtype_name DROP NOT NULL;
comment on column public."paymreqtype".paymreqtype_name is '';


-- =============================================
-- FIELD: agingtype_id smallint
-- =============================================
-- ADD agingtype_id
alter table public."paymreqtype" add agingtype_id smallint  ;
comment on column public."paymreqtype".agingtype_id is '';

-- MODIFY agingtype_id
alter table public."paymreqtype"
	alter column agingtype_id type smallint,
	ALTER COLUMN agingtype_id DROP DEFAULT,
	ALTER COLUMN agingtype_id DROP NOT NULL;
comment on column public."paymreqtype".agingtype_id is '';


-- =============================================
-- FIELD: paymreqtype_title text
-- =============================================
-- ADD paymreqtype_title
alter table public."paymreqtype" add paymreqtype_title text  ;
comment on column public."paymreqtype".paymreqtype_title is '';

-- MODIFY paymreqtype_title
alter table public."paymreqtype"
	alter column paymreqtype_title type text,
	ALTER COLUMN paymreqtype_title DROP DEFAULT,
	ALTER COLUMN paymreqtype_title DROP NOT NULL;
comment on column public."paymreqtype".paymreqtype_title is '';


-- =============================================
-- FIELD: paymreqtype_prog text
-- =============================================
-- ADD paymreqtype_prog
alter table public."paymreqtype" add paymreqtype_prog text  ;
comment on column public."paymreqtype".paymreqtype_prog is '';

-- MODIFY paymreqtype_prog
alter table public."paymreqtype"
	alter column paymreqtype_prog type text,
	ALTER COLUMN paymreqtype_prog DROP DEFAULT,
	ALTER COLUMN paymreqtype_prog DROP NOT NULL;
comment on column public."paymreqtype".paymreqtype_prog is '';


-- =============================================
-- FIELD: hasinvoice boolean
-- =============================================
-- ADD hasinvoice
alter table public."paymreqtype" add hasinvoice boolean not null default false;
comment on column public."paymreqtype".hasinvoice is '';

-- MODIFY hasinvoice
alter table public."paymreqtype"
	alter column hasinvoice type boolean,
	ALTER COLUMN hasinvoice SET DEFAULT false,
	ALTER COLUMN hasinvoice SET NOT NULL;
comment on column public."paymreqtype".hasinvoice is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."paymreqtype" add _createby integer not null ;
comment on column public."paymreqtype"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."paymreqtype"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."paymreqtype"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."paymreqtype" add _createdate timestamp with time zone not null default now();
comment on column public."paymreqtype"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."paymreqtype"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."paymreqtype"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."paymreqtype" add _modifyby integer  ;
comment on column public."paymreqtype"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."paymreqtype"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."paymreqtype"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."paymreqtype" add _modifydate timestamp with time zone  ;
comment on column public."paymreqtype"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."paymreqtype"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."paymreqtype"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."paymreqtype" DROP CONSTRAINT fk$public$paymreqtype$agingtype_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."paymreqtype"
	ADD CONSTRAINT fk$public$paymreqtype$agingtype_id
	FOREIGN KEY (agingtype_id)
	REFERENCES public."agingtype"(agingtype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreqtype$agingtype_id;
CREATE INDEX idx_fk$public$paymreqtype$agingtype_id ON public."paymreqtype"(agingtype_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."paymreqtype"
	drop constraint uq$public$paymreqtype$paymreqtype_name;
	

-- Add unique index 
alter table  public."paymreqtype"
	add constraint uq$public$paymreqtype$paymreqtype_name unique (paymreqtype_name); 

