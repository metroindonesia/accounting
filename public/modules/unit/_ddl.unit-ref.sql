-- unit.sql


/* =============================================
 * CREATE TABLE public."unitref"
 * ============================================*/
create table public."unitref" (
	unitref_id bigint not null,
	constraint unitref_pk primary key (unitref_id)
);
comment on table public."unitref" is '';	


-- =============================================
-- FIELD: interface_id smallint
-- =============================================
-- ADD interface_id
alter table public."unitref" add interface_id smallint  ;
comment on column public."unitref".interface_id is '';

-- MODIFY interface_id
alter table public."unitref"
	alter column interface_id type smallint,
	ALTER COLUMN interface_id DROP DEFAULT,
	ALTER COLUMN interface_id DROP NOT NULL;
comment on column public."unitref".interface_id is '';


-- =============================================
-- FIELD: ref_name text
-- =============================================
-- ADD ref_name
alter table public."unitref" add ref_name text  ;
comment on column public."unitref".ref_name is '';

-- MODIFY ref_name
alter table public."unitref"
	alter column ref_name type text,
	ALTER COLUMN ref_name DROP DEFAULT,
	ALTER COLUMN ref_name DROP NOT NULL;
comment on column public."unitref".ref_name is '';


-- =============================================
-- FIELD: ref_value text
-- =============================================
-- ADD ref_value
alter table public."unitref" add ref_value text  ;
comment on column public."unitref".ref_value is '';

-- MODIFY ref_value
alter table public."unitref"
	alter column ref_value type text,
	ALTER COLUMN ref_value DROP DEFAULT,
	ALTER COLUMN ref_value DROP NOT NULL;
comment on column public."unitref".ref_value is '';


-- =============================================
-- FIELD: ref_descr text
-- =============================================
-- ADD ref_descr
alter table public."unitref" add ref_descr text  ;
comment on column public."unitref".ref_descr is '';

-- MODIFY ref_descr
alter table public."unitref"
	alter column ref_descr type text,
	ALTER COLUMN ref_descr DROP DEFAULT,
	ALTER COLUMN ref_descr DROP NOT NULL;
comment on column public."unitref".ref_descr is '';


-- =============================================
-- FIELD: ref_data json
-- =============================================
-- ADD ref_data
alter table public."unitref" add ref_data json  ;
comment on column public."unitref".ref_data is '';

-- MODIFY ref_data
alter table public."unitref"
	alter column ref_data type json,
	ALTER COLUMN ref_data DROP DEFAULT,
	ALTER COLUMN ref_data DROP NOT NULL;
comment on column public."unitref".ref_data is '';


-- =============================================
-- FIELD: unit_id int
-- =============================================
-- ADD unit_id
alter table public."unitref" add unit_id int  ;
comment on column public."unitref".unit_id is '';

-- MODIFY unit_id
alter table public."unitref"
	alter column unit_id type int,
	ALTER COLUMN unit_id DROP DEFAULT,
	ALTER COLUMN unit_id DROP NOT NULL;
comment on column public."unitref".unit_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."unitref" add _createby integer not null ;
comment on column public."unitref"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."unitref"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."unitref"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."unitref" add _createdate timestamp with time zone not null default now();
comment on column public."unitref"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."unitref"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."unitref"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."unitref" add _modifyby integer  ;
comment on column public."unitref"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."unitref"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."unitref"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."unitref" add _modifydate timestamp with time zone  ;
comment on column public."unitref"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."unitref"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."unitref"._modifydate is 'waktu terakhir record dimodifikasi';


-- =============================================
-- FIELD: _timestamp timestamp with time zone
-- =============================================
-- ADD _timestamp
alter table public."unitref" add _timestamp timestamp with time zone not null default now();
comment on column public."unitref"._timestamp is 'data timestamp';

-- MODIFY _timestamp
alter table public."unitref"
	alter column _timestamp type timestamp with time zone,
	ALTER COLUMN _timestamp SET DEFAULT now(),
	ALTER COLUMN _timestamp SET NOT NULL;
comment on column public."unitref"._timestamp is 'data timestamp';


-- =============================================
-- INDEX
-- =============================================
DROP INDEX IF EXISTS public.idx$public$unitref$_timestamp;
CREATE INDEX idx$public$unitref$_timestamp ON public.unitref (_timestamp);


-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE public."unitref"
	ADD CONSTRAINT fk$public$unitref$interface_id
	FOREIGN KEY (interface_id)
	REFERENCES core."interface"(interface_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$unitref$interface_id;
CREATE INDEX idx_fk$public$unitref$interface_id ON public."unitref"(interface_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================