-- struct.sql


/* =============================================
 * CREATE TABLE public."structref"
 * ============================================*/
create table public."structref" (
	structref_id bigint not null,
	constraint structref_pk primary key (structref_id)
);
comment on table public."structref" is '';	


-- =============================================
-- FIELD: interface_id smallint
-- =============================================
-- ADD interface_id
alter table public."structref" add interface_id smallint  ;
comment on column public."structref".interface_id is '';

-- MODIFY interface_id
alter table public."structref"
	alter column interface_id type smallint,
	ALTER COLUMN interface_id DROP DEFAULT,
	ALTER COLUMN interface_id DROP NOT NULL;
comment on column public."structref".interface_id is '';


-- =============================================
-- FIELD: ref_name text
-- =============================================
-- ADD ref_name
alter table public."structref" add ref_name text  ;
comment on column public."structref".ref_name is '';

-- MODIFY ref_name
alter table public."structref"
	alter column ref_name type text,
	ALTER COLUMN ref_name DROP DEFAULT,
	ALTER COLUMN ref_name DROP NOT NULL;
comment on column public."structref".ref_name is '';


-- =============================================
-- FIELD: ref_value text
-- =============================================
-- ADD ref_value
alter table public."structref" add ref_value text  ;
comment on column public."structref".ref_value is '';

-- MODIFY ref_value
alter table public."structref"
	alter column ref_value type text,
	ALTER COLUMN ref_value DROP DEFAULT,
	ALTER COLUMN ref_value DROP NOT NULL;
comment on column public."structref".ref_value is '';


-- =============================================
-- FIELD: ref_descr text
-- =============================================
-- ADD ref_descr
alter table public."structref" add ref_descr text  ;
comment on column public."structref".ref_descr is '';

-- MODIFY ref_descr
alter table public."structref"
	alter column ref_descr type text,
	ALTER COLUMN ref_descr DROP DEFAULT,
	ALTER COLUMN ref_descr DROP NOT NULL;
comment on column public."structref".ref_descr is '';


-- =============================================
-- FIELD: ref_data json
-- =============================================
-- ADD ref_data
alter table public."structref" add ref_data json  ;
comment on column public."structref".ref_data is '';

-- MODIFY ref_data
alter table public."structref"
	alter column ref_data type json,
	ALTER COLUMN ref_data DROP DEFAULT,
	ALTER COLUMN ref_data DROP NOT NULL;
comment on column public."structref".ref_data is '';


-- =============================================
-- FIELD: struct_id int
-- =============================================
-- ADD struct_id
alter table public."structref" add struct_id int  ;
comment on column public."structref".struct_id is '';

-- MODIFY struct_id
alter table public."structref"
	alter column struct_id type int,
	ALTER COLUMN struct_id DROP DEFAULT,
	ALTER COLUMN struct_id DROP NOT NULL;
comment on column public."structref".struct_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."structref" add _createby integer not null ;
comment on column public."structref"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."structref"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."structref"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."structref" add _createdate timestamp with time zone not null default now();
comment on column public."structref"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."structref"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."structref"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."structref" add _modifyby integer  ;
comment on column public."structref"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."structref"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."structref"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."structref" add _modifydate timestamp with time zone  ;
comment on column public."structref"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."structref"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."structref"._modifydate is 'waktu terakhir record dimodifikasi';


-- =============================================
-- FIELD: _timestamp timestamp with time zone
-- =============================================
-- ADD _timestamp
alter table public."structref" add _timestamp timestamp with time zone not null default now();
comment on column public."structref"._timestamp is 'data timestamp';

-- MODIFY _timestamp
alter table public."structref"
	alter column _timestamp type timestamp with time zone,
	ALTER COLUMN _timestamp SET DEFAULT now(),
	ALTER COLUMN _timestamp SET NOT NULL;
comment on column public."structref"._timestamp is 'data timestamp';


-- =============================================
-- INDEX
-- =============================================
DROP INDEX IF EXISTS public.idx$public$structref$_timestamp;
CREATE INDEX idx$public$structref$_timestamp ON public.structref (_timestamp);


-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE public."structref"
	ADD CONSTRAINT fk$public$structref$interface_id
	FOREIGN KEY (interface_id)
	REFERENCES core."interface"(interface_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$structref$interface_id;
CREATE INDEX idx_fk$public$structref$interface_id ON public."structref"(interface_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================