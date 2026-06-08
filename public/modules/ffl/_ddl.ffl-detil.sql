-- ffl.sql


/* =============================================
 * CREATE TABLE public."ffldetil"
 * ============================================*/
create table public."ffldetil" (
	ffldetil_id bigint not null,
	constraint ffldetil_pk primary key (ffldetil_id)
);
comment on table public."ffldetil" is '';	


-- =============================================
-- FIELD: ffldetil_data text
-- =============================================
-- ADD ffldetil_data
alter table public."ffldetil" add ffldetil_data text  ;
comment on column public."ffldetil".ffldetil_data is '';

-- MODIFY ffldetil_data
alter table public."ffldetil"
	alter column ffldetil_data type text,
	ALTER COLUMN ffldetil_data DROP DEFAULT,
	ALTER COLUMN ffldetil_data DROP NOT NULL;
comment on column public."ffldetil".ffldetil_data is '';


-- =============================================
-- FIELD: ffl_id bigint
-- =============================================
-- ADD ffl_id
alter table public."ffldetil" add ffl_id bigint  ;
comment on column public."ffldetil".ffl_id is '';

-- MODIFY ffl_id
alter table public."ffldetil"
	alter column ffl_id type bigint,
	ALTER COLUMN ffl_id DROP DEFAULT,
	ALTER COLUMN ffl_id DROP NOT NULL;
comment on column public."ffldetil".ffl_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."ffldetil" add _createby integer not null ;
comment on column public."ffldetil"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."ffldetil"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."ffldetil"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."ffldetil" add _createdate timestamp with time zone not null default now();
comment on column public."ffldetil"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."ffldetil"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."ffldetil"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."ffldetil" add _modifyby integer  ;
comment on column public."ffldetil"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."ffldetil"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."ffldetil"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."ffldetil" add _modifydate timestamp with time zone  ;
comment on column public."ffldetil"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."ffldetil"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."ffldetil"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."ffldetil" DROP CONSTRAINT fk$public$ffldetil$ffl_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."ffldetil"
	ADD CONSTRAINT fk$public$ffldetil$ffl_id
	FOREIGN KEY (ffl_id)
	REFERENCES public."ffl"(ffl_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$ffldetil$ffl_id;
CREATE INDEX idx_fk$public$ffldetil$ffl_id ON public."ffldetil"(ffl_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================