-- paymreq.sql


/* =============================================
 * CREATE TABLE public."paymreqdetil"
 * ============================================*/
create table public."paymreqdetil" (
	paymreqdetil_id bigint not null,
	constraint paymreqdetil_pk primary key (paymreqdetil_id)
);
comment on table public."paymreqdetil" is '';	


-- =============================================
-- FIELD: itemclass_id int
-- =============================================
-- ADD itemclass_id
alter table public."paymreqdetil" add itemclass_id int  ;
comment on column public."paymreqdetil".itemclass_id is '';

-- MODIFY itemclass_id
alter table public."paymreqdetil"
	alter column itemclass_id type int,
	ALTER COLUMN itemclass_id DROP DEFAULT,
	ALTER COLUMN itemclass_id DROP NOT NULL;
comment on column public."paymreqdetil".itemclass_id is '';


-- =============================================
-- FIELD: paymreqdetil_descr text
-- =============================================
-- ADD paymreqdetil_descr
alter table public."paymreqdetil" add paymreqdetil_descr text  ;
comment on column public."paymreqdetil".paymreqdetil_descr is '';

-- MODIFY paymreqdetil_descr
alter table public."paymreqdetil"
	alter column paymreqdetil_descr type text,
	ALTER COLUMN paymreqdetil_descr DROP DEFAULT,
	ALTER COLUMN paymreqdetil_descr DROP NOT NULL;
comment on column public."paymreqdetil".paymreqdetil_descr is '';


-- =============================================
-- FIELD: paymreqdetil_value decimal(15, 2)
-- =============================================
-- ADD paymreqdetil_value
alter table public."paymreqdetil" add paymreqdetil_value decimal(15, 2) not null default 0;
comment on column public."paymreqdetil".paymreqdetil_value is '';

-- MODIFY paymreqdetil_value
alter table public."paymreqdetil"
	alter column paymreqdetil_value type decimal(15, 2),
	ALTER COLUMN paymreqdetil_value SET DEFAULT 0,
	ALTER COLUMN paymreqdetil_value SET NOT NULL;
comment on column public."paymreqdetil".paymreqdetil_value is '';


-- =============================================
-- FIELD: paymreq_id bigint
-- =============================================
-- ADD paymreq_id
alter table public."paymreqdetil" add paymreq_id bigint  ;
comment on column public."paymreqdetil".paymreq_id is '';

-- MODIFY paymreq_id
alter table public."paymreqdetil"
	alter column paymreq_id type bigint,
	ALTER COLUMN paymreq_id DROP DEFAULT,
	ALTER COLUMN paymreq_id DROP NOT NULL;
comment on column public."paymreqdetil".paymreq_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."paymreqdetil" add _createby integer not null ;
comment on column public."paymreqdetil"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."paymreqdetil"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."paymreqdetil"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."paymreqdetil" add _createdate timestamp with time zone not null default now();
comment on column public."paymreqdetil"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."paymreqdetil"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."paymreqdetil"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."paymreqdetil" add _modifyby integer  ;
comment on column public."paymreqdetil"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."paymreqdetil"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."paymreqdetil"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."paymreqdetil" add _modifydate timestamp with time zone  ;
comment on column public."paymreqdetil"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."paymreqdetil"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."paymreqdetil"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."paymreqdetil" DROP CONSTRAINT fk$public$paymreqdetil$itemclass_id;
ALTER TABLE public."paymreqdetil" DROP CONSTRAINT fk$public$paymreqdetil$paymreq_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."paymreqdetil"
	ADD CONSTRAINT fk$public$paymreqdetil$itemclass_id
	FOREIGN KEY (itemclass_id)
	REFERENCES public."itemclass"(itemclass_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreqdetil$itemclass_id;
CREATE INDEX idx_fk$public$paymreqdetil$itemclass_id ON public."paymreqdetil"(itemclass_id);	


ALTER TABLE public."paymreqdetil"
	ADD CONSTRAINT fk$public$paymreqdetil$paymreq_id
	FOREIGN KEY (paymreq_id)
	REFERENCES public."paymreq"(paymreq_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$paymreqdetil$paymreq_id;
CREATE INDEX idx_fk$public$paymreqdetil$paymreq_id ON public."paymreqdetil"(paymreq_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================