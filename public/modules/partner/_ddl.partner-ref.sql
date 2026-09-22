-- partner.sql


/* =============================================
 * CREATE TABLE public."partnerref"
 * ============================================*/
create table public."partnerref" (
	partnerref_id bigint not null,
	constraint partnerref_pk primary key (partnerref_id)
);
comment on table public."partnerref" is '';	


-- =============================================
-- FIELD: interface_id smallint
-- =============================================
-- ADD interface_id
alter table public."partnerref" add interface_id smallint  ;
comment on column public."partnerref".interface_id is '';

-- MODIFY interface_id
alter table public."partnerref"
	alter column interface_id type smallint,
	ALTER COLUMN interface_id DROP DEFAULT,
	ALTER COLUMN interface_id DROP NOT NULL;
comment on column public."partnerref".interface_id is '';


-- =============================================
-- FIELD: partnerref_name text
-- =============================================
-- ADD partnerref_name
alter table public."partnerref" add partnerref_name text  ;
comment on column public."partnerref".partnerref_name is '';

-- MODIFY partnerref_name
alter table public."partnerref"
	alter column partnerref_name type text,
	ALTER COLUMN partnerref_name DROP DEFAULT,
	ALTER COLUMN partnerref_name DROP NOT NULL;
comment on column public."partnerref".partnerref_name is '';


-- =============================================
-- FIELD: partnerref_value text
-- =============================================
-- ADD partnerref_value
alter table public."partnerref" add partnerref_value text  ;
comment on column public."partnerref".partnerref_value is '';

-- MODIFY partnerref_value
alter table public."partnerref"
	alter column partnerref_value type text,
	ALTER COLUMN partnerref_value DROP DEFAULT,
	ALTER COLUMN partnerref_value DROP NOT NULL;
comment on column public."partnerref".partnerref_value is '';


-- =============================================
-- FIELD: partnerref_descr text
-- =============================================
-- ADD partnerref_descr
alter table public."partnerref" add partnerref_descr text  ;
comment on column public."partnerref".partnerref_descr is '';

-- MODIFY partnerref_descr
alter table public."partnerref"
	alter column partnerref_descr type text,
	ALTER COLUMN partnerref_descr DROP DEFAULT,
	ALTER COLUMN partnerref_descr DROP NOT NULL;
comment on column public."partnerref".partnerref_descr is '';


-- =============================================
-- FIELD: partnerref_data json
-- =============================================
-- ADD partnerref_data
alter table public."partnerref" add partnerref_data json  ;
comment on column public."partnerref".partnerref_data is '';

-- MODIFY partnerref_data
alter table public."partnerref"
	alter column partnerref_data type json,
	ALTER COLUMN partnerref_data DROP DEFAULT,
	ALTER COLUMN partnerref_data DROP NOT NULL;
comment on column public."partnerref".partnerref_data is '';


-- =============================================
-- FIELD: partner_id int
-- =============================================
-- ADD partner_id
alter table public."partnerref" add partner_id int  ;
comment on column public."partnerref".partner_id is '';

-- MODIFY partner_id
alter table public."partnerref"
	alter column partner_id type int,
	ALTER COLUMN partner_id DROP DEFAULT,
	ALTER COLUMN partner_id DROP NOT NULL;
comment on column public."partnerref".partner_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."partnerref" add _createby integer not null ;
comment on column public."partnerref"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."partnerref"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."partnerref"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."partnerref" add _createdate timestamp with time zone not null default now();
comment on column public."partnerref"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."partnerref"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."partnerref"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."partnerref" add _modifyby integer  ;
comment on column public."partnerref"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."partnerref"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."partnerref"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."partnerref" add _modifydate timestamp with time zone  ;
comment on column public."partnerref"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."partnerref"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."partnerref"._modifydate is 'waktu terakhir record dimodifikasi';


-- =============================================
-- FIELD: _timestamp timestamp with time zone
-- =============================================
-- ADD _timestamp
alter table public."partnerref" add _timestamp timestamp with time zone not null default now();
comment on column public."partnerref"._timestamp is 'data timestamp';

-- MODIFY _timestamp
alter table public."partnerref"
	alter column _timestamp type timestamp with time zone,
	ALTER COLUMN _timestamp SET DEFAULT now(),
	ALTER COLUMN _timestamp SET NOT NULL;
comment on column public."partnerref"._timestamp is 'data timestamp';


-- =============================================
-- INDEX
-- =============================================
DROP INDEX IF EXISTS public.idx$public$partnerref$_timestamp;
CREATE INDEX idx$public$partnerref$_timestamp ON public.partnerref (_timestamp);


-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."partnerref" DROP CONSTRAINT fk$public$partnerref$interface_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."partnerref"
	ADD CONSTRAINT fk$public$partnerref$interface_id
	FOREIGN KEY (interface_id)
	REFERENCES core."interface"(interface_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$partnerref$interface_id;
CREATE INDEX idx_fk$public$partnerref$interface_id ON public."partnerref"(interface_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."partnerref"
	drop constraint uq$public$partnerref$partnerref_pair;
	

-- Add unique index 
alter table  public."partnerref"
	add constraint uq$public$partnerref$partnerref_pair unique (interface_id, partnerref_name, partnerref_value); 

