-- coa.sql


/* =============================================
 * CREATE TABLE public."coaref"
 * ============================================*/
create table public."coaref" (
	coaref_id bigint not null,
	constraint coaref_pk primary key (coaref_id)
);
comment on table public."coaref" is '';	


-- =============================================
-- FIELD: interface_id smallint
-- =============================================
-- ADD interface_id
alter table public."coaref" add interface_id smallint  ;
comment on column public."coaref".interface_id is '';

-- MODIFY interface_id
alter table public."coaref"
	alter column interface_id type smallint,
	ALTER COLUMN interface_id DROP DEFAULT,
	ALTER COLUMN interface_id DROP NOT NULL;
comment on column public."coaref".interface_id is '';


-- =============================================
-- FIELD: ref_name text
-- =============================================
-- ADD ref_name
alter table public."coaref" add ref_name text  ;
comment on column public."coaref".ref_name is '';

-- MODIFY ref_name
alter table public."coaref"
	alter column ref_name type text,
	ALTER COLUMN ref_name DROP DEFAULT,
	ALTER COLUMN ref_name DROP NOT NULL;
comment on column public."coaref".ref_name is '';


-- =============================================
-- FIELD: ref_value text
-- =============================================
-- ADD ref_value
alter table public."coaref" add ref_value text  ;
comment on column public."coaref".ref_value is '';

-- MODIFY ref_value
alter table public."coaref"
	alter column ref_value type text,
	ALTER COLUMN ref_value DROP DEFAULT,
	ALTER COLUMN ref_value DROP NOT NULL;
comment on column public."coaref".ref_value is '';


-- =============================================
-- FIELD: ref_descr text
-- =============================================
-- ADD ref_descr
alter table public."coaref" add ref_descr text  ;
comment on column public."coaref".ref_descr is '';

-- MODIFY ref_descr
alter table public."coaref"
	alter column ref_descr type text,
	ALTER COLUMN ref_descr DROP DEFAULT,
	ALTER COLUMN ref_descr DROP NOT NULL;
comment on column public."coaref".ref_descr is '';


-- =============================================
-- FIELD: ref_data json
-- =============================================
-- ADD ref_data
alter table public."coaref" add ref_data json  ;
comment on column public."coaref".ref_data is '';

-- MODIFY ref_data
alter table public."coaref"
	alter column ref_data type json,
	ALTER COLUMN ref_data DROP DEFAULT,
	ALTER COLUMN ref_data DROP NOT NULL;
comment on column public."coaref".ref_data is '';


-- =============================================
-- FIELD: coa_id int
-- =============================================
-- ADD coa_id
alter table public."coaref" add coa_id int  ;
comment on column public."coaref".coa_id is '';

-- MODIFY coa_id
alter table public."coaref"
	alter column coa_id type int,
	ALTER COLUMN coa_id DROP DEFAULT,
	ALTER COLUMN coa_id DROP NOT NULL;
comment on column public."coaref".coa_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."coaref" add _createby integer not null ;
comment on column public."coaref"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."coaref"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."coaref"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."coaref" add _createdate timestamp with time zone not null default now();
comment on column public."coaref"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."coaref"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."coaref"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."coaref" add _modifyby integer  ;
comment on column public."coaref"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."coaref"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."coaref"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."coaref" add _modifydate timestamp with time zone  ;
comment on column public."coaref"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."coaref"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."coaref"._modifydate is 'waktu terakhir record dimodifikasi';


-- =============================================
-- FIELD: _timestamp timestamp with time zone
-- =============================================
-- ADD _timestamp
alter table public."coaref" add _timestamp timestamp with time zone not null default now();
comment on column public."coaref"._timestamp is 'data timestamp';

-- MODIFY _timestamp
alter table public."coaref"
	alter column _timestamp type timestamp with time zone,
	ALTER COLUMN _timestamp SET DEFAULT now(),
	ALTER COLUMN _timestamp SET NOT NULL;
comment on column public."coaref"._timestamp is 'data timestamp';


-- =============================================
-- INDEX
-- =============================================
DROP INDEX IF EXISTS public.idx$public$coaref$_timestamp;
CREATE INDEX idx$public$coaref$_timestamp ON public.coaref (_timestamp);


-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."coaref" DROP CONSTRAINT fk$public$coaref$interface_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."coaref"
	ADD CONSTRAINT fk$public$coaref$interface_id
	FOREIGN KEY (interface_id)
	REFERENCES core."interface"(interface_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$coaref$interface_id;
CREATE INDEX idx_fk$public$coaref$interface_id ON public."coaref"(interface_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."coaref"
	drop constraint uq$public$coaref$coaref_pair;
	

-- Add unique index 
alter table  public."coaref"
	add constraint uq$public$coaref$coaref_pair unique (interface_id, ref_name, ref_value); 

