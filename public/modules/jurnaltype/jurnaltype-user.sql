-- jurnaltype.sql


/* =============================================
 * CREATE TABLE public."jurnaltypeuser"
 * ============================================*/
create table public."jurnaltypeuser" (
	jurnaltypeuser_id bigint not null,
	constraint jurnaltypeuser_pk primary key (jurnaltypeuser_id)
);
comment on table public."jurnaltypeuser" is '';	


-- =============================================
-- FIELD: user_id bigint
-- =============================================
-- ADD user_id
alter table public."jurnaltypeuser" add user_id bigint  ;
comment on column public."jurnaltypeuser".user_id is '';

-- MODIFY user_id
alter table public."jurnaltypeuser"
	alter column user_id type bigint,
	ALTER COLUMN user_id DROP DEFAULT,
	ALTER COLUMN user_id DROP NOT NULL;
comment on column public."jurnaltypeuser".user_id is '';


-- =============================================
-- FIELD: isallowposting boolean
-- =============================================
-- ADD isallowposting
alter table public."jurnaltypeuser" add isallowposting boolean not null default false;
comment on column public."jurnaltypeuser".isallowposting is '';

-- MODIFY isallowposting
alter table public."jurnaltypeuser"
	alter column isallowposting type boolean,
	ALTER COLUMN isallowposting SET DEFAULT false,
	ALTER COLUMN isallowposting SET NOT NULL;
comment on column public."jurnaltypeuser".isallowposting is '';


-- =============================================
-- FIELD: isallowunposting boolean
-- =============================================
-- ADD isallowunposting
alter table public."jurnaltypeuser" add isallowunposting boolean not null default false;
comment on column public."jurnaltypeuser".isallowunposting is '';

-- MODIFY isallowunposting
alter table public."jurnaltypeuser"
	alter column isallowunposting type boolean,
	ALTER COLUMN isallowunposting SET DEFAULT false,
	ALTER COLUMN isallowunposting SET NOT NULL;
comment on column public."jurnaltypeuser".isallowunposting is '';


-- =============================================
-- FIELD: jurnaltype_id smallint
-- =============================================
-- ADD jurnaltype_id
alter table public."jurnaltypeuser" add jurnaltype_id smallint  ;
comment on column public."jurnaltypeuser".jurnaltype_id is '';

-- MODIFY jurnaltype_id
alter table public."jurnaltypeuser"
	alter column jurnaltype_id type smallint,
	ALTER COLUMN jurnaltype_id DROP DEFAULT,
	ALTER COLUMN jurnaltype_id DROP NOT NULL;
comment on column public."jurnaltypeuser".jurnaltype_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."jurnaltypeuser" add _createby integer not null ;
comment on column public."jurnaltypeuser"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."jurnaltypeuser"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."jurnaltypeuser"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."jurnaltypeuser" add _createdate timestamp with time zone not null default now();
comment on column public."jurnaltypeuser"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."jurnaltypeuser"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."jurnaltypeuser"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."jurnaltypeuser" add _modifyby integer  ;
comment on column public."jurnaltypeuser"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."jurnaltypeuser"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."jurnaltypeuser"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."jurnaltypeuser" add _modifydate timestamp with time zone  ;
comment on column public."jurnaltypeuser"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."jurnaltypeuser"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."jurnaltypeuser"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."jurnaltypeuser" DROP CONSTRAINT fk$public$jurnaltypeuser$user_id;
ALTER TABLE public."jurnaltypeuser" DROP CONSTRAINT fk$public$jurnaltypeuser$jurnaltype_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."jurnaltypeuser"
	ADD CONSTRAINT fk$public$jurnaltypeuser$user_id
	FOREIGN KEY (user_id)
	REFERENCES core."user"(user_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaltypeuser$user_id;
CREATE INDEX idx_fk$public$jurnaltypeuser$user_id ON public."jurnaltypeuser"(user_id);	


ALTER TABLE public."jurnaltypeuser"
	ADD CONSTRAINT fk$public$jurnaltypeuser$jurnaltype_id
	FOREIGN KEY (jurnaltype_id)
	REFERENCES public."jurnaltype"(jurnaltype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$jurnaltypeuser$jurnaltype_id;
CREATE INDEX idx_fk$public$jurnaltypeuser$jurnaltype_id ON public."jurnaltypeuser"(jurnaltype_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================