-- curr.sql


/* =============================================
 * CREATE TABLE public."currrate"
 * ============================================*/
create table public."currrate" (
	currrate_id bigint not null,
	constraint currrate_pk primary key (currrate_id)
);
comment on table public."currrate" is '';	


-- =============================================
-- FIELD: currrate_date date
-- =============================================
-- ADD currrate_date
alter table public."currrate" add currrate_date date  default now();
comment on column public."currrate".currrate_date is '';

-- MODIFY currrate_date
alter table public."currrate"
	alter column currrate_date type date,
	ALTER COLUMN currrate_date SET DEFAULT now(),
	ALTER COLUMN currrate_date DROP NOT NULL;
comment on column public."currrate".currrate_date is '';


-- =============================================
-- FIELD: currrate_value int
-- =============================================
-- ADD currrate_value
alter table public."currrate" add currrate_value int not null default 0;
comment on column public."currrate".currrate_value is '';

-- MODIFY currrate_value
alter table public."currrate"
	alter column currrate_value type int,
	ALTER COLUMN currrate_value SET DEFAULT 0,
	ALTER COLUMN currrate_value SET NOT NULL;
comment on column public."currrate".currrate_value is '';


-- =============================================
-- FIELD: curr_id smallint
-- =============================================
-- ADD curr_id
alter table public."currrate" add curr_id smallint  ;
comment on column public."currrate".curr_id is '';

-- MODIFY curr_id
alter table public."currrate"
	alter column curr_id type smallint,
	ALTER COLUMN curr_id DROP DEFAULT,
	ALTER COLUMN curr_id DROP NOT NULL;
comment on column public."currrate".curr_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."currrate" add _createby integer not null ;
comment on column public."currrate"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."currrate"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."currrate"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."currrate" add _createdate timestamp with time zone not null default now();
comment on column public."currrate"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."currrate"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."currrate"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."currrate" add _modifyby integer  ;
comment on column public."currrate"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."currrate"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."currrate"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."currrate" add _modifydate timestamp with time zone  ;
comment on column public."currrate"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."currrate"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."currrate"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."currrate" DROP CONSTRAINT fk$public$currrate$curr_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."currrate"
	ADD CONSTRAINT fk$public$currrate$curr_id
	FOREIGN KEY (curr_id)
	REFERENCES public."curr"(curr_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$currrate$curr_id;
CREATE INDEX idx_fk$public$currrate$curr_id ON public."currrate"(curr_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================