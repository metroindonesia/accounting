-- itemclass.sql


/* =============================================
 * CREATE TABLE public."itemclassstruct"
 * ============================================*/
create table public."itemclassstruct" (
	itemclassstruct_id bigint not null,
	constraint itemclassstruct_pk primary key (itemclassstruct_id)
);
comment on table public."itemclassstruct" is '';	


-- =============================================
-- FIELD: struct_id int
-- =============================================
-- ADD struct_id
alter table public."itemclassstruct" add struct_id int  ;
comment on column public."itemclassstruct".struct_id is '';

-- MODIFY struct_id
alter table public."itemclassstruct"
	alter column struct_id type int,
	ALTER COLUMN struct_id DROP DEFAULT,
	ALTER COLUMN struct_id DROP NOT NULL;
comment on column public."itemclassstruct".struct_id is '';


-- =============================================
-- FIELD: itemclassstruct_isdisabled boolean
-- =============================================
-- ADD itemclassstruct_isdisabled
alter table public."itemclassstruct" add itemclassstruct_isdisabled boolean not null default false;
comment on column public."itemclassstruct".itemclassstruct_isdisabled is '';

-- MODIFY itemclassstruct_isdisabled
alter table public."itemclassstruct"
	alter column itemclassstruct_isdisabled type boolean,
	ALTER COLUMN itemclassstruct_isdisabled SET DEFAULT false,
	ALTER COLUMN itemclassstruct_isdisabled SET NOT NULL;
comment on column public."itemclassstruct".itemclassstruct_isdisabled is '';


-- =============================================
-- FIELD: itemclass_id int
-- =============================================
-- ADD itemclass_id
alter table public."itemclassstruct" add itemclass_id int  ;
comment on column public."itemclassstruct".itemclass_id is '';

-- MODIFY itemclass_id
alter table public."itemclassstruct"
	alter column itemclass_id type int,
	ALTER COLUMN itemclass_id DROP DEFAULT,
	ALTER COLUMN itemclass_id DROP NOT NULL;
comment on column public."itemclassstruct".itemclass_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."itemclassstruct" add _createby integer not null ;
comment on column public."itemclassstruct"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."itemclassstruct"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."itemclassstruct"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."itemclassstruct" add _createdate timestamp with time zone not null default now();
comment on column public."itemclassstruct"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."itemclassstruct"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."itemclassstruct"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."itemclassstruct" add _modifyby integer  ;
comment on column public."itemclassstruct"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."itemclassstruct"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."itemclassstruct"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."itemclassstruct" add _modifydate timestamp with time zone  ;
comment on column public."itemclassstruct"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."itemclassstruct"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."itemclassstruct"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."itemclassstruct" DROP CONSTRAINT fk$public$itemclassstruct$struct_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."itemclassstruct"
	ADD CONSTRAINT fk$public$itemclassstruct$struct_id
	FOREIGN KEY (struct_id)
	REFERENCES public."struct"(struct_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$itemclassstruct$struct_id;
CREATE INDEX idx_fk$public$itemclassstruct$struct_id ON public."itemclassstruct"(struct_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================