-- periode.sql


/* =============================================
 * CREATE TABLE public."periode"
 * ============================================*/
create table public."periode" (
	periode_id smallint not null,
	constraint periode_pk primary key (periode_id)
);
comment on table public."periode" is 'periode financial';	


-- =============================================
-- FIELD: periode_isclosed boolean
-- =============================================
-- ADD periode_isclosed
alter table public."periode" add periode_isclosed boolean not null default false;
comment on column public."periode".periode_isclosed is '';

-- MODIFY periode_isclosed
alter table public."periode"
	alter column periode_isclosed type boolean,
	ALTER COLUMN periode_isclosed SET DEFAULT false,
	ALTER COLUMN periode_isclosed SET NOT NULL;
comment on column public."periode".periode_isclosed is '';


-- =============================================
-- FIELD: periode_isactive boolean
-- =============================================
-- ADD periode_isactive
alter table public."periode" add periode_isactive boolean not null default false;
comment on column public."periode".periode_isactive is '';

-- MODIFY periode_isactive
alter table public."periode"
	alter column periode_isactive type boolean,
	ALTER COLUMN periode_isactive SET DEFAULT false,
	ALTER COLUMN periode_isactive SET NOT NULL;
comment on column public."periode".periode_isactive is '';


-- =============================================
-- FIELD: periode_name text
-- =============================================
-- ADD periode_name
alter table public."periode" add periode_name text  ;
comment on column public."periode".periode_name is '';

-- MODIFY periode_name
alter table public."periode"
	alter column periode_name type text,
	ALTER COLUMN periode_name DROP DEFAULT,
	ALTER COLUMN periode_name DROP NOT NULL;
comment on column public."periode".periode_name is '';


-- =============================================
-- FIELD: periode_year smallint
-- =============================================
-- ADD periode_year
alter table public."periode" add periode_year smallint not null default 0;
comment on column public."periode".periode_year is '';

-- MODIFY periode_year
alter table public."periode"
	alter column periode_year type smallint,
	ALTER COLUMN periode_year SET DEFAULT 0,
	ALTER COLUMN periode_year SET NOT NULL;
comment on column public."periode".periode_year is '';


-- =============================================
-- FIELD: periode_month smallint
-- =============================================
-- ADD periode_month
alter table public."periode" add periode_month smallint not null default 0;
comment on column public."periode".periode_month is '';

-- MODIFY periode_month
alter table public."periode"
	alter column periode_month type smallint,
	ALTER COLUMN periode_month SET DEFAULT 0,
	ALTER COLUMN periode_month SET NOT NULL;
comment on column public."periode".periode_month is '';


-- =============================================
-- FIELD: periode_start date
-- =============================================
-- ADD periode_start
alter table public."periode" add periode_start date  default now();
comment on column public."periode".periode_start is '';

-- MODIFY periode_start
alter table public."periode"
	alter column periode_start type date,
	ALTER COLUMN periode_start SET DEFAULT now(),
	ALTER COLUMN periode_start DROP NOT NULL;
comment on column public."periode".periode_start is '';


-- =============================================
-- FIELD: periode_end date
-- =============================================
-- ADD periode_end
alter table public."periode" add periode_end date  default now();
comment on column public."periode".periode_end is '';

-- MODIFY periode_end
alter table public."periode"
	alter column periode_end type date,
	ALTER COLUMN periode_end SET DEFAULT now(),
	ALTER COLUMN periode_end DROP NOT NULL;
comment on column public."periode".periode_end is '';


-- =============================================
-- FIELD: previous_periode_id smallint
-- =============================================
-- ADD previous_periode_id
alter table public."periode" add previous_periode_id smallint  ;
comment on column public."periode".previous_periode_id is '';

-- MODIFY previous_periode_id
alter table public."periode"
	alter column previous_periode_id type smallint,
	ALTER COLUMN previous_periode_id DROP DEFAULT,
	ALTER COLUMN previous_periode_id DROP NOT NULL;
comment on column public."periode".previous_periode_id is '';


-- =============================================
-- FIELD: periode_closeby text
-- =============================================
-- ADD periode_closeby
alter table public."periode" add periode_closeby text  ;
comment on column public."periode".periode_closeby is '';

-- MODIFY periode_closeby
alter table public."periode"
	alter column periode_closeby type text,
	ALTER COLUMN periode_closeby DROP DEFAULT,
	ALTER COLUMN periode_closeby DROP NOT NULL;
comment on column public."periode".periode_closeby is '';


-- =============================================
-- FIELD: periode_closedate timestamp with time zone
-- =============================================
-- ADD periode_closedate
alter table public."periode" add periode_closedate timestamp with time zone  ;
comment on column public."periode".periode_closedate is '';

-- MODIFY periode_closedate
alter table public."periode"
	alter column periode_closedate type timestamp with time zone,
	ALTER COLUMN periode_closedate DROP DEFAULT,
	ALTER COLUMN periode_closedate DROP NOT NULL;
comment on column public."periode".periode_closedate is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."periode" add _createby integer not null ;
comment on column public."periode"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."periode"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."periode"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."periode" add _createdate timestamp with time zone not null default now();
comment on column public."periode"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."periode"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."periode"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."periode" add _modifyby integer  ;
comment on column public."periode"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."periode"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."periode"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."periode" add _modifydate timestamp with time zone  ;
comment on column public."periode"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."periode"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."periode"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  
ALTER TABLE public."periode"
	ADD CONSTRAINT fk$public$periode$previous_periode_id
	FOREIGN KEY (previous_periode_id)
	REFERENCES public."periode"(periode_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$periode$previous_periode_id;
CREATE INDEX idx_fk$public$periode$previous_periode_id ON public."periode"(previous_periode_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Add unique index 
alter table  public."periode"
	add constraint uq$public$periode$periode_yearmonth unique (periode_year, periode_month); 

alter table  public."periode"
	add constraint uq$public$periode$periode_name unique (periode_name); 

alter table  public."periode"
	add constraint uq$public$periode$previous_periode_id unique (previous_periode_id); 

