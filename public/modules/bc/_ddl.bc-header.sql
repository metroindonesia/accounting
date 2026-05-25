-- bc.sql


/* =============================================
 * CREATE TABLE public."bc"
 * ============================================*/
create table public."bc" (
	bc_id bigint not null,
	constraint bc_pk primary key (bc_id)
);
comment on table public."bc" is '';	


-- =============================================
-- FIELD: bc_doc text
-- =============================================
-- ADD bc_doc
alter table public."bc" add bc_doc text  ;
comment on column public."bc".bc_doc is '';

-- MODIFY bc_doc
alter table public."bc"
	alter column bc_doc type text,
	ALTER COLUMN bc_doc DROP DEFAULT,
	ALTER COLUMN bc_doc DROP NOT NULL;
comment on column public."bc".bc_doc is '';


-- =============================================
-- FIELD: bc_descr text
-- =============================================
-- ADD bc_descr
alter table public."bc" add bc_descr text  ;
comment on column public."bc".bc_descr is '';

-- MODIFY bc_descr
alter table public."bc"
	alter column bc_descr type text,
	ALTER COLUMN bc_descr DROP DEFAULT,
	ALTER COLUMN bc_descr DROP NOT NULL;
comment on column public."bc".bc_descr is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."bc" add _createby integer not null ;
comment on column public."bc"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."bc"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."bc"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."bc" add _createdate timestamp with time zone not null default now();
comment on column public."bc"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."bc"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."bc"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."bc" add _modifyby integer  ;
comment on column public."bc"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."bc"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."bc"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."bc" add _modifydate timestamp with time zone  ;
comment on column public."bc"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."bc"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."bc"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Add Foreign Key Constraint  	


-- =============================================
-- UNIQUE INDEX
-- =============================================