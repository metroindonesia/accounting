-- struct.sql


/* =============================================
 * CREATE TABLE public."struct"
 * ============================================*/
create table public."struct" (
	struct_id int not null,
	constraint struct_pk primary key (struct_id)
);
comment on table public."struct" is '';	


-- =============================================
-- FIELD: struct_code text
-- =============================================
-- ADD struct_code
alter table public."struct" add struct_code text  ;
comment on column public."struct".struct_code is '';

-- MODIFY struct_code
alter table public."struct"
	alter column struct_code type text,
	ALTER COLUMN struct_code DROP DEFAULT,
	ALTER COLUMN struct_code DROP NOT NULL;
comment on column public."struct".struct_code is '';


-- =============================================
-- FIELD: struct_isdisabled boolean
-- =============================================
-- ADD struct_isdisabled
alter table public."struct" add struct_isdisabled boolean not null default false;
comment on column public."struct".struct_isdisabled is '';

-- MODIFY struct_isdisabled
alter table public."struct"
	alter column struct_isdisabled type boolean,
	ALTER COLUMN struct_isdisabled SET DEFAULT false,
	ALTER COLUMN struct_isdisabled SET NOT NULL;
comment on column public."struct".struct_isdisabled is '';


-- =============================================
-- FIELD: struct_isparent boolean
-- =============================================
-- ADD struct_isparent
alter table public."struct" add struct_isparent boolean not null default false;
comment on column public."struct".struct_isparent is '';

-- MODIFY struct_isparent
alter table public."struct"
	alter column struct_isparent type boolean,
	ALTER COLUMN struct_isparent SET DEFAULT false,
	ALTER COLUMN struct_isparent SET NOT NULL;
comment on column public."struct".struct_isparent is '';


-- =============================================
-- FIELD: struct_name text
-- =============================================
-- ADD struct_name
alter table public."struct" add struct_name text  ;
comment on column public."struct".struct_name is '';

-- MODIFY struct_name
alter table public."struct"
	alter column struct_name type text,
	ALTER COLUMN struct_name DROP DEFAULT,
	ALTER COLUMN struct_name DROP NOT NULL;
comment on column public."struct".struct_name is '';


-- =============================================
-- FIELD: isitemowner boolean
-- =============================================
-- ADD isitemowner
alter table public."struct" add isitemowner boolean not null default false;
comment on column public."struct".isitemowner is '';

-- MODIFY isitemowner
alter table public."struct"
	alter column isitemowner type boolean,
	ALTER COLUMN isitemowner SET DEFAULT false,
	ALTER COLUMN isitemowner SET NOT NULL;
comment on column public."struct".isitemowner is '';


-- =============================================
-- FIELD: struct_istransaction boolean
-- =============================================
-- ADD struct_istransaction
alter table public."struct" add struct_istransaction boolean not null default false;
comment on column public."struct".struct_istransaction is '';

-- MODIFY struct_istransaction
alter table public."struct"
	alter column struct_istransaction type boolean,
	ALTER COLUMN struct_istransaction SET DEFAULT false,
	ALTER COLUMN struct_istransaction SET NOT NULL;
comment on column public."struct".struct_istransaction is '';


-- =============================================
-- FIELD: structhrk_id smallint
-- =============================================
-- ADD structhrk_id
alter table public."struct" add structhrk_id smallint  ;
comment on column public."struct".structhrk_id is '';

-- MODIFY structhrk_id
alter table public."struct"
	alter column structhrk_id type smallint,
	ALTER COLUMN structhrk_id DROP DEFAULT,
	ALTER COLUMN structhrk_id DROP NOT NULL;
comment on column public."struct".structhrk_id is '';


-- =============================================
-- FIELD: struct_parent int
-- =============================================
-- ADD struct_parent
alter table public."struct" add struct_parent int  ;
comment on column public."struct".struct_parent is '';

-- MODIFY struct_parent
alter table public."struct"
	alter column struct_parent type int,
	ALTER COLUMN struct_parent DROP DEFAULT,
	ALTER COLUMN struct_parent DROP NOT NULL;
comment on column public."struct".struct_parent is '';


-- =============================================
-- FIELD: struct_level smallint
-- =============================================
-- ADD struct_level
alter table public."struct" add struct_level smallint not null default 0;
comment on column public."struct".struct_level is '';

-- MODIFY struct_level
alter table public."struct"
	alter column struct_level type smallint,
	ALTER COLUMN struct_level SET DEFAULT 0,
	ALTER COLUMN struct_level SET NOT NULL;
comment on column public."struct".struct_level is '';


-- =============================================
-- FIELD: struct_pathid text
-- =============================================
-- ADD struct_pathid
alter table public."struct" add struct_pathid text  ;
comment on column public."struct".struct_pathid is '';

-- MODIFY struct_pathid
alter table public."struct"
	alter column struct_pathid type text,
	ALTER COLUMN struct_pathid DROP DEFAULT,
	ALTER COLUMN struct_pathid DROP NOT NULL;
comment on column public."struct".struct_pathid is '';


-- =============================================
-- FIELD: struct_path text
-- =============================================
-- ADD struct_path
alter table public."struct" add struct_path text  ;
comment on column public."struct".struct_path is '';

-- MODIFY struct_path
alter table public."struct"
	alter column struct_path type text,
	ALTER COLUMN struct_path DROP DEFAULT,
	ALTER COLUMN struct_path DROP NOT NULL;
comment on column public."struct".struct_path is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."struct" add _createby integer not null ;
comment on column public."struct"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."struct"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."struct"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."struct" add _createdate timestamp with time zone not null default now();
comment on column public."struct"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."struct"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."struct"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."struct" add _modifyby integer  ;
comment on column public."struct"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."struct"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."struct"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."struct" add _modifydate timestamp with time zone  ;
comment on column public."struct"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."struct"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."struct"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."struct" DROP CONSTRAINT fk$public$struct$structhrk_id;
ALTER TABLE public."struct" DROP CONSTRAINT fk$public$struct$struct_parent;


-- Add Foreign Key Constraint  
ALTER TABLE public."struct"
	ADD CONSTRAINT fk$public$struct$structhrk_id
	FOREIGN KEY (structhrk_id)
	REFERENCES public."structhrk"(structhrk_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$struct$structhrk_id;
CREATE INDEX idx_fk$public$struct$structhrk_id ON public."struct"(structhrk_id);	


ALTER TABLE public."struct"
	ADD CONSTRAINT fk$public$struct$struct_parent
	FOREIGN KEY (struct_parent)
	REFERENCES public."struct"(struct_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$struct$struct_parent;
CREATE INDEX idx_fk$public$struct$struct_parent ON public."struct"(struct_parent);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."struct"
	drop constraint uq$public$struct$struct_code;

alter table public."struct"
	drop constraint uq$public$struct$struct_name;
	

-- Add unique index 
alter table  public."struct"
	add constraint uq$public$struct$struct_code unique (struct_code); 

alter table  public."struct"
	add constraint uq$public$struct$struct_name unique (struct_name); 

