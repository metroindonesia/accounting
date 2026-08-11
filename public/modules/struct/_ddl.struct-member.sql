-- struct.sql


/* =============================================
 * CREATE TABLE public."structmember"
 * ============================================*/
create table public."structmember" (
	structmember_id bigint not null,
	constraint structmember_pk primary key (structmember_id)
);
comment on table public."structmember" is '';	


-- =============================================
-- FIELD: user_id int
-- =============================================
-- ADD user_id
alter table public."structmember" add user_id int  ;
comment on column public."structmember".user_id is '';

-- MODIFY user_id
alter table public."structmember"
	alter column user_id type int,
	ALTER COLUMN user_id DROP DEFAULT,
	ALTER COLUMN user_id DROP NOT NULL;
comment on column public."structmember".user_id is '';


-- =============================================
-- FIELD: issuspend boolean
-- =============================================
-- ADD issuspend
alter table public."structmember" add issuspend boolean not null default false;
comment on column public."structmember".issuspend is '';

-- MODIFY issuspend
alter table public."structmember"
	alter column issuspend type boolean,
	ALTER COLUMN issuspend SET DEFAULT false,
	ALTER COLUMN issuspend SET NOT NULL;
comment on column public."structmember".issuspend is '';


-- =============================================
-- FIELD: struct_id int
-- =============================================
-- ADD struct_id
alter table public."structmember" add struct_id int  ;
comment on column public."structmember".struct_id is '';

-- MODIFY struct_id
alter table public."structmember"
	alter column struct_id type int,
	ALTER COLUMN struct_id DROP DEFAULT,
	ALTER COLUMN struct_id DROP NOT NULL;
comment on column public."structmember".struct_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table public."structmember" add _createby integer not null ;
comment on column public."structmember"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table public."structmember"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column public."structmember"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table public."structmember" add _createdate timestamp with time zone not null default now();
comment on column public."structmember"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table public."structmember"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column public."structmember"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table public."structmember" add _modifyby integer  ;
comment on column public."structmember"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table public."structmember"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column public."structmember"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table public."structmember" add _modifydate timestamp with time zone  ;
comment on column public."structmember"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table public."structmember"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column public."structmember"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE public."structmember" DROP CONSTRAINT fk$public$structmember$user_id;


-- Add Foreign Key Constraint  
ALTER TABLE public."structmember"
	ADD CONSTRAINT fk$public$structmember$user_id
	FOREIGN KEY (user_id)
	REFERENCES core."user"(user_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS public.idx_fk$public$structmember$user_id;
CREATE INDEX idx_fk$public$structmember$user_id ON public."structmember"(user_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table public."structmember"
	drop constraint uq$public$structmember$structmember_pair;
	

-- Add unique index 
alter table  public."structmember"
	add constraint uq$public$structmember$structmember_pair unique (struct_id, user_id); 

