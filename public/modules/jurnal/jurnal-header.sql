-- jurnal.sql


/* =============================================
 * CREATE TABLE act."jurnal"
 * ============================================*/
create table act."jurnal" (
	jurnal_id bigint not null,
	constraint jurnal_pk primary key (jurnal_id)
);
comment on table act."jurnal" is '';	


-- =============================================
-- FIELD: jurnal_doc varchar(30)
-- =============================================
-- ADD jurnal_doc
alter table act."jurnal" add jurnal_doc varchar(30)  ;
comment on column act."jurnal".jurnal_doc is '';

-- MODIFY jurnal_doc
alter table act."jurnal"
	alter column jurnal_doc type varchar(30),
	ALTER COLUMN jurnal_doc DROP DEFAULT,
	ALTER COLUMN jurnal_doc DROP NOT NULL;
comment on column act."jurnal".jurnal_doc is '';


-- =============================================
-- FIELD: ispost boolean
-- =============================================
-- ADD ispost
alter table act."jurnal" add ispost boolean not null default false;
comment on column act."jurnal".ispost is '';

-- MODIFY ispost
alter table act."jurnal"
	alter column ispost type boolean,
	ALTER COLUMN ispost SET DEFAULT false,
	ALTER COLUMN ispost SET NOT NULL;
comment on column act."jurnal".ispost is '';


-- =============================================
-- FIELD: jurnal_source text
-- =============================================
-- ADD jurnal_source
alter table act."jurnal" add jurnal_source text  ;
comment on column act."jurnal".jurnal_source is '';

-- MODIFY jurnal_source
alter table act."jurnal"
	alter column jurnal_source type text,
	ALTER COLUMN jurnal_source DROP DEFAULT,
	ALTER COLUMN jurnal_source DROP NOT NULL;
comment on column act."jurnal".jurnal_source is '';


-- =============================================
-- FIELD: jurnaltype_id smallint
-- =============================================
-- ADD jurnaltype_id
alter table act."jurnal" add jurnaltype_id smallint not null default 0;
comment on column act."jurnal".jurnaltype_id is '';

-- MODIFY jurnaltype_id
alter table act."jurnal"
	alter column jurnaltype_id type smallint,
	ALTER COLUMN jurnaltype_id SET DEFAULT 0,
	ALTER COLUMN jurnaltype_id SET NOT NULL;
comment on column act."jurnal".jurnaltype_id is '';


-- =============================================
-- FIELD: paymreqterm_id bigint
-- =============================================
-- ADD paymreqterm_id
alter table act."jurnal" add paymreqterm_id bigint  ;
comment on column act."jurnal".paymreqterm_id is '';

-- MODIFY paymreqterm_id
alter table act."jurnal"
	alter column paymreqterm_id type bigint,
	ALTER COLUMN paymreqterm_id DROP DEFAULT,
	ALTER COLUMN paymreqterm_id DROP NOT NULL;
comment on column act."jurnal".paymreqterm_id is '';


-- =============================================
-- FIELD: periode_id smallint
-- =============================================
-- ADD periode_id
alter table act."jurnal" add periode_id smallint not null default 0;
comment on column act."jurnal".periode_id is '';

-- MODIFY periode_id
alter table act."jurnal"
	alter column periode_id type smallint,
	ALTER COLUMN periode_id SET DEFAULT 0,
	ALTER COLUMN periode_id SET NOT NULL;
comment on column act."jurnal".periode_id is '';


-- =============================================
-- FIELD: jurnal_date date
-- =============================================
-- ADD jurnal_date
alter table act."jurnal" add jurnal_date date  default now();
comment on column act."jurnal".jurnal_date is '';

-- MODIFY jurnal_date
alter table act."jurnal"
	alter column jurnal_date type date,
	ALTER COLUMN jurnal_date SET DEFAULT now(),
	ALTER COLUMN jurnal_date DROP NOT NULL;
comment on column act."jurnal".jurnal_date is '';


-- =============================================
-- FIELD: jurnal_datedue date
-- =============================================
-- ADD jurnal_datedue
alter table act."jurnal" add jurnal_datedue date  default now();
comment on column act."jurnal".jurnal_datedue is '';

-- MODIFY jurnal_datedue
alter table act."jurnal"
	alter column jurnal_datedue type date,
	ALTER COLUMN jurnal_datedue SET DEFAULT now(),
	ALTER COLUMN jurnal_datedue DROP NOT NULL;
comment on column act."jurnal".jurnal_datedue is '';


-- =============================================
-- FIELD: jurnal_descr text
-- =============================================
-- ADD jurnal_descr
alter table act."jurnal" add jurnal_descr text  ;
comment on column act."jurnal".jurnal_descr is '';

-- MODIFY jurnal_descr
alter table act."jurnal"
	alter column jurnal_descr type text,
	ALTER COLUMN jurnal_descr DROP DEFAULT,
	ALTER COLUMN jurnal_descr DROP NOT NULL;
comment on column act."jurnal".jurnal_descr is '';


-- =============================================
-- FIELD: partner_id int
-- =============================================
-- ADD partner_id
alter table act."jurnal" add partner_id int  ;
comment on column act."jurnal".partner_id is '';

-- MODIFY partner_id
alter table act."jurnal"
	alter column partner_id type int,
	ALTER COLUMN partner_id DROP DEFAULT,
	ALTER COLUMN partner_id DROP NOT NULL;
comment on column act."jurnal".partner_id is '';


-- =============================================
-- FIELD: paymtype_id smallint
-- =============================================
-- ADD paymtype_id
alter table act."jurnal" add paymtype_id smallint  ;
comment on column act."jurnal".paymtype_id is '';

-- MODIFY paymtype_id
alter table act."jurnal"
	alter column paymtype_id type smallint,
	ALTER COLUMN paymtype_id DROP DEFAULT,
	ALTER COLUMN paymtype_id DROP NOT NULL;
comment on column act."jurnal".paymtype_id is '';


-- =============================================
-- FIELD: partnerbank_id bigint
-- =============================================
-- ADD partnerbank_id
alter table act."jurnal" add partnerbank_id bigint  ;
comment on column act."jurnal".partnerbank_id is '';

-- MODIFY partnerbank_id
alter table act."jurnal"
	alter column partnerbank_id type bigint,
	ALTER COLUMN partnerbank_id DROP DEFAULT,
	ALTER COLUMN partnerbank_id DROP NOT NULL;
comment on column act."jurnal".partnerbank_id is '';


-- =============================================
-- FIELD: payment_bgno text
-- =============================================
-- ADD payment_bgno
alter table act."jurnal" add payment_bgno text  ;
comment on column act."jurnal".payment_bgno is '';

-- MODIFY payment_bgno
alter table act."jurnal"
	alter column payment_bgno type text,
	ALTER COLUMN payment_bgno DROP DEFAULT,
	ALTER COLUMN payment_bgno DROP NOT NULL;
comment on column act."jurnal".payment_bgno is '';


-- =============================================
-- FIELD: partnerbank_account text
-- =============================================
-- ADD partnerbank_account
alter table act."jurnal" add partnerbank_account text  ;
comment on column act."jurnal".partnerbank_account is '';

-- MODIFY partnerbank_account
alter table act."jurnal"
	alter column partnerbank_account type text,
	ALTER COLUMN partnerbank_account DROP DEFAULT,
	ALTER COLUMN partnerbank_account DROP NOT NULL;
comment on column act."jurnal".partnerbank_account is '';


-- =============================================
-- FIELD: partnerbank_bankname text
-- =============================================
-- ADD partnerbank_bankname
alter table act."jurnal" add partnerbank_bankname text  ;
comment on column act."jurnal".partnerbank_bankname is '';

-- MODIFY partnerbank_bankname
alter table act."jurnal"
	alter column partnerbank_bankname type text,
	ALTER COLUMN partnerbank_bankname DROP DEFAULT,
	ALTER COLUMN partnerbank_bankname DROP NOT NULL;
comment on column act."jurnal".partnerbank_bankname is '';


-- =============================================
-- FIELD: partnerbank_accountname text
-- =============================================
-- ADD partnerbank_accountname
alter table act."jurnal" add partnerbank_accountname text  ;
comment on column act."jurnal".partnerbank_accountname is '';

-- MODIFY partnerbank_accountname
alter table act."jurnal"
	alter column partnerbank_accountname type text,
	ALTER COLUMN partnerbank_accountname DROP DEFAULT,
	ALTER COLUMN partnerbank_accountname DROP NOT NULL;
comment on column act."jurnal".partnerbank_accountname is '';


-- =============================================
-- FIELD: partnercontact_id bigint
-- =============================================
-- ADD partnercontact_id
alter table act."jurnal" add partnercontact_id bigint  ;
comment on column act."jurnal".partnercontact_id is '';

-- MODIFY partnercontact_id
alter table act."jurnal"
	alter column partnercontact_id type bigint,
	ALTER COLUMN partnercontact_id DROP DEFAULT,
	ALTER COLUMN partnercontact_id DROP NOT NULL;
comment on column act."jurnal".partnercontact_id is '';


-- =============================================
-- FIELD: coa_id int
-- =============================================
-- ADD coa_id
alter table act."jurnal" add coa_id int  ;
comment on column act."jurnal".coa_id is '';

-- MODIFY coa_id
alter table act."jurnal"
	alter column coa_id type int,
	ALTER COLUMN coa_id DROP DEFAULT,
	ALTER COLUMN coa_id DROP NOT NULL;
comment on column act."jurnal".coa_id is '';


-- =============================================
-- FIELD: dept_id int
-- =============================================
-- ADD dept_id
alter table act."jurnal" add dept_id int  ;
comment on column act."jurnal".dept_id is '';

-- MODIFY dept_id
alter table act."jurnal"
	alter column dept_id type int,
	ALTER COLUMN dept_id DROP DEFAULT,
	ALTER COLUMN dept_id DROP NOT NULL;
comment on column act."jurnal".dept_id is '';


-- =============================================
-- FIELD: site_id int
-- =============================================
-- ADD site_id
alter table act."jurnal" add site_id int  ;
comment on column act."jurnal".site_id is '';

-- MODIFY site_id
alter table act."jurnal"
	alter column site_id type int,
	ALTER COLUMN site_id DROP DEFAULT,
	ALTER COLUMN site_id DROP NOT NULL;
comment on column act."jurnal".site_id is '';


-- =============================================
-- FIELD: unit_id int
-- =============================================
-- ADD unit_id
alter table act."jurnal" add unit_id int  ;
comment on column act."jurnal".unit_id is '';

-- MODIFY unit_id
alter table act."jurnal"
	alter column unit_id type int,
	ALTER COLUMN unit_id DROP DEFAULT,
	ALTER COLUMN unit_id DROP NOT NULL;
comment on column act."jurnal".unit_id is '';


-- =============================================
-- FIELD: project_id int
-- =============================================
-- ADD project_id
alter table act."jurnal" add project_id int  ;
comment on column act."jurnal".project_id is '';

-- MODIFY project_id
alter table act."jurnal"
	alter column project_id type int,
	ALTER COLUMN project_id DROP DEFAULT,
	ALTER COLUMN project_id DROP NOT NULL;
comment on column act."jurnal".project_id is '';


-- =============================================
-- FIELD: curr_id smallint
-- =============================================
-- ADD curr_id
alter table act."jurnal" add curr_id smallint  ;
comment on column act."jurnal".curr_id is '';

-- MODIFY curr_id
alter table act."jurnal"
	alter column curr_id type smallint,
	ALTER COLUMN curr_id DROP DEFAULT,
	ALTER COLUMN curr_id DROP NOT NULL;
comment on column act."jurnal".curr_id is '';


-- =============================================
-- FIELD: jurnal_value decimal(13, 2)
-- =============================================
-- ADD jurnal_value
alter table act."jurnal" add jurnal_value decimal(13, 2) not null default 0;
comment on column act."jurnal".jurnal_value is '';

-- MODIFY jurnal_value
alter table act."jurnal"
	alter column jurnal_value type decimal(13, 2),
	ALTER COLUMN jurnal_value SET DEFAULT 0,
	ALTER COLUMN jurnal_value SET NOT NULL;
comment on column act."jurnal".jurnal_value is '';


-- =============================================
-- FIELD: curr_rate decimal(5, 0)
-- =============================================
-- ADD curr_rate
alter table act."jurnal" add curr_rate decimal(5, 0) not null default 1;
comment on column act."jurnal".curr_rate is '';

-- MODIFY curr_rate
alter table act."jurnal"
	alter column curr_rate type decimal(5, 0),
	ALTER COLUMN curr_rate SET DEFAULT 1,
	ALTER COLUMN curr_rate SET NOT NULL;
comment on column act."jurnal".curr_rate is '';


-- =============================================
-- FIELD: jurnal_idr decimal(18, 2)
-- =============================================
-- ADD jurnal_idr
alter table act."jurnal" add jurnal_idr decimal(18, 2) not null default 0;
comment on column act."jurnal".jurnal_idr is '';

-- MODIFY jurnal_idr
alter table act."jurnal"
	alter column jurnal_idr type decimal(18, 2),
	ALTER COLUMN jurnal_idr SET DEFAULT 0,
	ALTER COLUMN jurnal_idr SET NOT NULL;
comment on column act."jurnal".jurnal_idr is '';


-- =============================================
-- FIELD: _postby text
-- =============================================
-- ADD _postby
alter table act."jurnal" add _postby text  ;
comment on column act."jurnal"._postby is '';

-- MODIFY _postby
alter table act."jurnal"
	alter column _postby type text,
	ALTER COLUMN _postby DROP DEFAULT,
	ALTER COLUMN _postby DROP NOT NULL;
comment on column act."jurnal"._postby is '';


-- =============================================
-- FIELD: _postdate text
-- =============================================
-- ADD _postdate
alter table act."jurnal" add _postdate text  ;
comment on column act."jurnal"._postdate is '';

-- MODIFY _postdate
alter table act."jurnal"
	alter column _postdate type text,
	ALTER COLUMN _postdate DROP DEFAULT,
	ALTER COLUMN _postdate DROP NOT NULL;
comment on column act."jurnal"._postdate is '';


-- =============================================
-- FIELD: copyto varchar(1)
-- =============================================
-- ADD copyto
alter table act."jurnal" add copyto varchar(1)  ;
comment on column act."jurnal".copyto is '';

-- MODIFY copyto
alter table act."jurnal"
	alter column copyto type varchar(1),
	ALTER COLUMN copyto DROP DEFAULT,
	ALTER COLUMN copyto DROP NOT NULL;
comment on column act."jurnal".copyto is '';


-- =============================================
-- FIELD: coacurr text
-- =============================================
-- ADD coacurr
alter table act."jurnal" add coacurr text  ;
comment on column act."jurnal".coacurr is '';

-- MODIFY coacurr
alter table act."jurnal"
	alter column coacurr type text,
	ALTER COLUMN coacurr DROP DEFAULT,
	ALTER COLUMN coacurr DROP NOT NULL;
comment on column act."jurnal".coacurr is '';


-- =============================================
-- FIELD: jurnaldetil_id_link bigint
-- =============================================
-- ADD jurnaldetil_id_link
alter table act."jurnal" add jurnaldetil_id_link bigint  ;
comment on column act."jurnal".jurnaldetil_id_link is '';

-- MODIFY jurnaldetil_id_link
alter table act."jurnal"
	alter column jurnaldetil_id_link type bigint,
	ALTER COLUMN jurnaldetil_id_link DROP DEFAULT,
	ALTER COLUMN jurnaldetil_id_link DROP NOT NULL;
comment on column act."jurnal".jurnaldetil_id_link is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table act."jurnal" add _createby integer not null ;
comment on column act."jurnal"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table act."jurnal"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column act."jurnal"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table act."jurnal" add _createdate timestamp with time zone not null default now();
comment on column act."jurnal"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table act."jurnal"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column act."jurnal"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table act."jurnal" add _modifyby integer  ;
comment on column act."jurnal"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table act."jurnal"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column act."jurnal"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table act."jurnal" add _modifydate timestamp with time zone  ;
comment on column act."jurnal"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table act."jurnal"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column act."jurnal"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$jurnaldetil_id_link;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$curr_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$project_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$unit_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$site_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$dept_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$coa_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$partnercontact_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$partnerbank_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$paymtype_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$partner_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$periode_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$paymreqterm_id;
ALTER TABLE act."jurnal" DROP CONSTRAINT fk$act$jurnal$jurnaltype_id;


-- Add Foreign Key Constraint  
ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$jurnaltype_id
	FOREIGN KEY (jurnaltype_id)
	REFERENCES act."jurnaltype"(jurnaltype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$jurnaltype_id;
CREATE INDEX idx_fk$act$jurnal$jurnaltype_id ON act."jurnal"(jurnaltype_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$paymreqterm_id
	FOREIGN KEY (paymreqterm_id)
	REFERENCES act."paymreqterm"(paymreqterm_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$paymreqterm_id;
CREATE INDEX idx_fk$act$jurnal$paymreqterm_id ON act."jurnal"(paymreqterm_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$periode_id
	FOREIGN KEY (periode_id)
	REFERENCES act."periode"(periode_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$periode_id;
CREATE INDEX idx_fk$act$jurnal$periode_id ON act."jurnal"(periode_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$partner_id
	FOREIGN KEY (partner_id)
	REFERENCES ent."partner"(partner_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$partner_id;
CREATE INDEX idx_fk$act$jurnal$partner_id ON act."jurnal"(partner_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$paymtype_id
	FOREIGN KEY (paymtype_id)
	REFERENCES act."paymtype"(paymtype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$paymtype_id;
CREATE INDEX idx_fk$act$jurnal$paymtype_id ON act."jurnal"(paymtype_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$partnerbank_id
	FOREIGN KEY (partnerbank_id)
	REFERENCES ent."partnerbank"(partnerbank_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$partnerbank_id;
CREATE INDEX idx_fk$act$jurnal$partnerbank_id ON act."jurnal"(partnerbank_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$partnercontact_id
	FOREIGN KEY (partnercontact_id)
	REFERENCES ent."partnercontact"(partnercontact_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$partnercontact_id;
CREATE INDEX idx_fk$act$jurnal$partnercontact_id ON act."jurnal"(partnercontact_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$coa_id
	FOREIGN KEY (coa_id)
	REFERENCES act."coa"(coa_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$coa_id;
CREATE INDEX idx_fk$act$jurnal$coa_id ON act."jurnal"(coa_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$dept_id
	FOREIGN KEY (dept_id)
	REFERENCES ent."dept"(dept_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$dept_id;
CREATE INDEX idx_fk$act$jurnal$dept_id ON act."jurnal"(dept_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$site_id
	FOREIGN KEY (site_id)
	REFERENCES ent."site"(site_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$site_id;
CREATE INDEX idx_fk$act$jurnal$site_id ON act."jurnal"(site_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$unit_id
	FOREIGN KEY (unit_id)
	REFERENCES ent."unit"(unit_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$unit_id;
CREATE INDEX idx_fk$act$jurnal$unit_id ON act."jurnal"(unit_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$project_id
	FOREIGN KEY (project_id)
	REFERENCES prj."project"(project_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$project_id;
CREATE INDEX idx_fk$act$jurnal$project_id ON act."jurnal"(project_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$curr_id
	FOREIGN KEY (curr_id)
	REFERENCES ent."curr"(curr_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$curr_id;
CREATE INDEX idx_fk$act$jurnal$curr_id ON act."jurnal"(curr_id);	


ALTER TABLE act."jurnal"
	ADD CONSTRAINT fk$act$jurnal$jurnaldetil_id_link
	FOREIGN KEY (jurnaldetil_id_link)
	REFERENCES act."jurnaldetil"(jurnaldetil_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnal$jurnaldetil_id_link;
CREATE INDEX idx_fk$act$jurnal$jurnaldetil_id_link ON act."jurnal"(jurnaldetil_id_link);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================
-- Drop existing unique index 
alter table act."jurnal"
	drop constraint uq$act$jurnal$jurnal_doc;
	

-- Add unique index 
alter table  act."jurnal"
	add constraint uq$act$jurnal$jurnal_doc unique (jurnal_doc); 

