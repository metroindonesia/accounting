-- jurnal.sql


/* =============================================
 * CREATE TABLE act."jurnaldetil"
 * ============================================*/
create table act."jurnaldetil" (
	jurnaldetil_id bigint not null,
	constraint jurnaldetil_pk primary key (jurnaldetil_id)
);
comment on table act."jurnaldetil" is '';	


-- =============================================
-- FIELD: coa_id int
-- =============================================
-- ADD coa_id
alter table act."jurnaldetil" add coa_id int  ;
comment on column act."jurnaldetil".coa_id is '';

-- MODIFY coa_id
alter table act."jurnaldetil"
	alter column coa_id type int,
	ALTER COLUMN coa_id DROP DEFAULT,
	ALTER COLUMN coa_id DROP NOT NULL;
comment on column act."jurnaldetil".coa_id is '';


-- =============================================
-- FIELD: jurnaldetil_descr text
-- =============================================
-- ADD jurnaldetil_descr
alter table act."jurnaldetil" add jurnaldetil_descr text  ;
comment on column act."jurnaldetil".jurnaldetil_descr is '';

-- MODIFY jurnaldetil_descr
alter table act."jurnaldetil"
	alter column jurnaldetil_descr type text,
	ALTER COLUMN jurnaldetil_descr DROP DEFAULT,
	ALTER COLUMN jurnaldetil_descr DROP NOT NULL;
comment on column act."jurnaldetil".jurnaldetil_descr is '';


-- =============================================
-- FIELD: partner_id int
-- =============================================
-- ADD partner_id
alter table act."jurnaldetil" add partner_id int  ;
comment on column act."jurnaldetil".partner_id is '';

-- MODIFY partner_id
alter table act."jurnaldetil"
	alter column partner_id type int,
	ALTER COLUMN partner_id DROP DEFAULT,
	ALTER COLUMN partner_id DROP NOT NULL;
comment on column act."jurnaldetil".partner_id is '';


-- =============================================
-- FIELD: dept_id int
-- =============================================
-- ADD dept_id
alter table act."jurnaldetil" add dept_id int  ;
comment on column act."jurnaldetil".dept_id is '';

-- MODIFY dept_id
alter table act."jurnaldetil"
	alter column dept_id type int,
	ALTER COLUMN dept_id DROP DEFAULT,
	ALTER COLUMN dept_id DROP NOT NULL;
comment on column act."jurnaldetil".dept_id is '';


-- =============================================
-- FIELD: site_id int
-- =============================================
-- ADD site_id
alter table act."jurnaldetil" add site_id int  ;
comment on column act."jurnaldetil".site_id is '';

-- MODIFY site_id
alter table act."jurnaldetil"
	alter column site_id type int,
	ALTER COLUMN site_id DROP DEFAULT,
	ALTER COLUMN site_id DROP NOT NULL;
comment on column act."jurnaldetil".site_id is '';


-- =============================================
-- FIELD: unit_id int
-- =============================================
-- ADD unit_id
alter table act."jurnaldetil" add unit_id int  ;
comment on column act."jurnaldetil".unit_id is '';

-- MODIFY unit_id
alter table act."jurnaldetil"
	alter column unit_id type int,
	ALTER COLUMN unit_id DROP DEFAULT,
	ALTER COLUMN unit_id DROP NOT NULL;
comment on column act."jurnaldetil".unit_id is '';


-- =============================================
-- FIELD: project_id int
-- =============================================
-- ADD project_id
alter table act."jurnaldetil" add project_id int  ;
comment on column act."jurnaldetil".project_id is '';

-- MODIFY project_id
alter table act."jurnaldetil"
	alter column project_id type int,
	ALTER COLUMN project_id DROP DEFAULT,
	ALTER COLUMN project_id DROP NOT NULL;
comment on column act."jurnaldetil".project_id is '';


-- =============================================
-- FIELD: curr_id smallint
-- =============================================
-- ADD curr_id
alter table act."jurnaldetil" add curr_id smallint  ;
comment on column act."jurnaldetil".curr_id is '';

-- MODIFY curr_id
alter table act."jurnaldetil"
	alter column curr_id type smallint,
	ALTER COLUMN curr_id DROP DEFAULT,
	ALTER COLUMN curr_id DROP NOT NULL;
comment on column act."jurnaldetil".curr_id is '';


-- =============================================
-- FIELD: jurnaldetil_value decimal(13, 2)
-- =============================================
-- ADD jurnaldetil_value
alter table act."jurnaldetil" add jurnaldetil_value decimal(13, 2) not null default 0;
comment on column act."jurnaldetil".jurnaldetil_value is '';

-- MODIFY jurnaldetil_value
alter table act."jurnaldetil"
	alter column jurnaldetil_value type decimal(13, 2),
	ALTER COLUMN jurnaldetil_value SET DEFAULT 0,
	ALTER COLUMN jurnaldetil_value SET NOT NULL;
comment on column act."jurnaldetil".jurnaldetil_value is '';


-- =============================================
-- FIELD: curr_rate decimal(5, 0)
-- =============================================
-- ADD curr_rate
alter table act."jurnaldetil" add curr_rate decimal(5, 0) not null default 1;
comment on column act."jurnaldetil".curr_rate is '';

-- MODIFY curr_rate
alter table act."jurnaldetil"
	alter column curr_rate type decimal(5, 0),
	ALTER COLUMN curr_rate SET DEFAULT 1,
	ALTER COLUMN curr_rate SET NOT NULL;
comment on column act."jurnaldetil".curr_rate is '';


-- =============================================
-- FIELD: jurnaldetil_idr decimal(18, 2)
-- =============================================
-- ADD jurnaldetil_idr
alter table act."jurnaldetil" add jurnaldetil_idr decimal(18, 2) not null default 0;
comment on column act."jurnaldetil".jurnaldetil_idr is '';

-- MODIFY jurnaldetil_idr
alter table act."jurnaldetil"
	alter column jurnaldetil_idr type decimal(18, 2),
	ALTER COLUMN jurnaldetil_idr SET DEFAULT 0,
	ALTER COLUMN jurnaldetil_idr SET NOT NULL;
comment on column act."jurnaldetil".jurnaldetil_idr is '';


-- =============================================
-- FIELD: jurnaltype_id smallint
-- =============================================
-- ADD jurnaltype_id
alter table act."jurnaldetil" add jurnaltype_id smallint  ;
comment on column act."jurnaldetil".jurnaltype_id is '';

-- MODIFY jurnaltype_id
alter table act."jurnaldetil"
	alter column jurnaltype_id type smallint,
	ALTER COLUMN jurnaltype_id DROP DEFAULT,
	ALTER COLUMN jurnaltype_id DROP NOT NULL;
comment on column act."jurnaldetil".jurnaltype_id is '';


-- =============================================
-- FIELD: jurnaldetil_id_ref bigint
-- =============================================
-- ADD jurnaldetil_id_ref
alter table act."jurnaldetil" add jurnaldetil_id_ref bigint  ;
comment on column act."jurnaldetil".jurnaldetil_id_ref is '';

-- MODIFY jurnaldetil_id_ref
alter table act."jurnaldetil"
	alter column jurnaldetil_id_ref type bigint,
	ALTER COLUMN jurnaldetil_id_ref DROP DEFAULT,
	ALTER COLUMN jurnaldetil_id_ref DROP NOT NULL;
comment on column act."jurnaldetil".jurnaldetil_id_ref is '';


-- =============================================
-- FIELD: coacurr text
-- =============================================
-- ADD coacurr
alter table act."jurnaldetil" add coacurr text  ;
comment on column act."jurnaldetil".coacurr is '';

-- MODIFY coacurr
alter table act."jurnaldetil"
	alter column coacurr type text,
	ALTER COLUMN coacurr DROP DEFAULT,
	ALTER COLUMN coacurr DROP NOT NULL;
comment on column act."jurnaldetil".coacurr is '';


-- =============================================
-- FIELD: agingtype_id smallint
-- =============================================
-- ADD agingtype_id
alter table act."jurnaldetil" add agingtype_id smallint  ;
comment on column act."jurnaldetil".agingtype_id is '';

-- MODIFY agingtype_id
alter table act."jurnaldetil"
	alter column agingtype_id type smallint,
	ALTER COLUMN agingtype_id DROP DEFAULT,
	ALTER COLUMN agingtype_id DROP NOT NULL;
comment on column act."jurnaldetil".agingtype_id is '';


-- =============================================
-- FIELD: iscurradj boolean
-- =============================================
-- ADD iscurradj
alter table act."jurnaldetil" add iscurradj boolean not null default false;
comment on column act."jurnaldetil".iscurradj is '';

-- MODIFY iscurradj
alter table act."jurnaldetil"
	alter column iscurradj type boolean,
	ALTER COLUMN iscurradj SET DEFAULT false,
	ALTER COLUMN iscurradj SET NOT NULL;
comment on column act."jurnaldetil".iscurradj is '';


-- =============================================
-- FIELD: jurnaldetil_ishead boolean
-- =============================================
-- ADD jurnaldetil_ishead
alter table act."jurnaldetil" add jurnaldetil_ishead boolean not null default false;
comment on column act."jurnaldetil".jurnaldetil_ishead is '';

-- MODIFY jurnaldetil_ishead
alter table act."jurnaldetil"
	alter column jurnaldetil_ishead type boolean,
	ALTER COLUMN jurnaldetil_ishead SET DEFAULT false,
	ALTER COLUMN jurnaldetil_ishead SET NOT NULL;
comment on column act."jurnaldetil".jurnaldetil_ishead is '';


-- =============================================
-- FIELD: isdebet boolean
-- =============================================
-- ADD isdebet
alter table act."jurnaldetil" add isdebet boolean not null default false;
comment on column act."jurnaldetil".isdebet is '';

-- MODIFY isdebet
alter table act."jurnaldetil"
	alter column isdebet type boolean,
	ALTER COLUMN isdebet SET DEFAULT false,
	ALTER COLUMN isdebet SET NOT NULL;
comment on column act."jurnaldetil".isdebet is '';


-- =============================================
-- FIELD: iskredit boolean
-- =============================================
-- ADD iskredit
alter table act."jurnaldetil" add iskredit boolean not null default false;
comment on column act."jurnaldetil".iskredit is '';

-- MODIFY iskredit
alter table act."jurnaldetil"
	alter column iskredit type boolean,
	ALTER COLUMN iskredit SET DEFAULT false,
	ALTER COLUMN iskredit SET NOT NULL;
comment on column act."jurnaldetil".iskredit is '';


-- =============================================
-- FIELD: jurnal_date date
-- =============================================
-- ADD jurnal_date
alter table act."jurnaldetil" add jurnal_date date  default now();
comment on column act."jurnaldetil".jurnal_date is '';

-- MODIFY jurnal_date
alter table act."jurnaldetil"
	alter column jurnal_date type date,
	ALTER COLUMN jurnal_date SET DEFAULT now(),
	ALTER COLUMN jurnal_date DROP NOT NULL;
comment on column act."jurnaldetil".jurnal_date is '';


-- =============================================
-- FIELD: jurnal_datedue date
-- =============================================
-- ADD jurnal_datedue
alter table act."jurnaldetil" add jurnal_datedue date  default now();
comment on column act."jurnaldetil".jurnal_datedue is '';

-- MODIFY jurnal_datedue
alter table act."jurnaldetil"
	alter column jurnal_datedue type date,
	ALTER COLUMN jurnal_datedue SET DEFAULT now(),
	ALTER COLUMN jurnal_datedue DROP NOT NULL;
comment on column act."jurnaldetil".jurnal_datedue is '';


-- =============================================
-- FIELD: periode_id smallint
-- =============================================
-- ADD periode_id
alter table act."jurnaldetil" add periode_id smallint  ;
comment on column act."jurnaldetil".periode_id is '';

-- MODIFY periode_id
alter table act."jurnaldetil"
	alter column periode_id type smallint,
	ALTER COLUMN periode_id DROP DEFAULT,
	ALTER COLUMN periode_id DROP NOT NULL;
comment on column act."jurnaldetil".periode_id is '';


-- =============================================
-- FIELD: ispost boolean
-- =============================================
-- ADD ispost
alter table act."jurnaldetil" add ispost boolean not null default false;
comment on column act."jurnaldetil".ispost is '';

-- MODIFY ispost
alter table act."jurnaldetil"
	alter column ispost type boolean,
	ALTER COLUMN ispost SET DEFAULT false,
	ALTER COLUMN ispost SET NOT NULL;
comment on column act."jurnaldetil".ispost is '';


-- =============================================
-- FIELD: jurnaldetil_order smallint
-- =============================================
-- ADD jurnaldetil_order
alter table act."jurnaldetil" add jurnaldetil_order smallint not null default 0;
comment on column act."jurnaldetil".jurnaldetil_order is '';

-- MODIFY jurnaldetil_order
alter table act."jurnaldetil"
	alter column jurnaldetil_order type smallint,
	ALTER COLUMN jurnaldetil_order SET DEFAULT 0,
	ALTER COLUMN jurnaldetil_order SET NOT NULL;
comment on column act."jurnaldetil".jurnaldetil_order is '';


-- =============================================
-- FIELD: outstanding_idr decimal(18, 2)
-- =============================================
-- ADD outstanding_idr
alter table act."jurnaldetil" add outstanding_idr decimal(18, 2) not null default 0;
comment on column act."jurnaldetil".outstanding_idr is '';

-- MODIFY outstanding_idr
alter table act."jurnaldetil"
	alter column outstanding_idr type decimal(18, 2),
	ALTER COLUMN outstanding_idr SET DEFAULT 0,
	ALTER COLUMN outstanding_idr SET NOT NULL;
comment on column act."jurnaldetil".outstanding_idr is '';


-- =============================================
-- FIELD: outstanding_value decimal(13, 2)
-- =============================================
-- ADD outstanding_value
alter table act."jurnaldetil" add outstanding_value decimal(13, 2) not null default 0;
comment on column act."jurnaldetil".outstanding_value is '';

-- MODIFY outstanding_value
alter table act."jurnaldetil"
	alter column outstanding_value type decimal(13, 2),
	ALTER COLUMN outstanding_value SET DEFAULT 0,
	ALTER COLUMN outstanding_value SET NOT NULL;
comment on column act."jurnaldetil".outstanding_value is '';


-- =============================================
-- FIELD: jurnal_doc varchar(30)
-- =============================================
-- ADD jurnal_doc
alter table act."jurnaldetil" add jurnal_doc varchar(30)  ;
comment on column act."jurnaldetil".jurnal_doc is '';

-- MODIFY jurnal_doc
alter table act."jurnaldetil"
	alter column jurnal_doc type varchar(30),
	ALTER COLUMN jurnal_doc DROP DEFAULT,
	ALTER COLUMN jurnal_doc DROP NOT NULL;
comment on column act."jurnaldetil".jurnal_doc is '';


-- =============================================
-- FIELD: jurnal_id bigint
-- =============================================
-- ADD jurnal_id
alter table act."jurnaldetil" add jurnal_id bigint  ;
comment on column act."jurnaldetil".jurnal_id is '';

-- MODIFY jurnal_id
alter table act."jurnaldetil"
	alter column jurnal_id type bigint,
	ALTER COLUMN jurnal_id DROP DEFAULT,
	ALTER COLUMN jurnal_id DROP NOT NULL;
comment on column act."jurnaldetil".jurnal_id is '';


-- =============================================
-- FIELD: _createby integer
-- =============================================
-- ADD _createby
alter table act."jurnaldetil" add _createby integer not null ;
comment on column act."jurnaldetil"._createby is 'user yang pertama kali membuat record ini';

-- MODIFY _createby
alter table act."jurnaldetil"
	alter column _createby type integer,
	ALTER COLUMN _createby DROP DEFAULT,
	ALTER COLUMN _createby SET NOT NULL;
comment on column act."jurnaldetil"._createby is 'user yang pertama kali membuat record ini';


-- =============================================
-- FIELD: _createdate timestamp with time zone
-- =============================================
-- ADD _createdate
alter table act."jurnaldetil" add _createdate timestamp with time zone not null default now();
comment on column act."jurnaldetil"._createdate is 'waktu record dibuat pertama kali';

-- MODIFY _createdate
alter table act."jurnaldetil"
	alter column _createdate type timestamp with time zone,
	ALTER COLUMN _createdate SET DEFAULT now(),
	ALTER COLUMN _createdate SET NOT NULL;
comment on column act."jurnaldetil"._createdate is 'waktu record dibuat pertama kali';


-- =============================================
-- FIELD: _modifyby integer
-- =============================================
-- ADD _modifyby
alter table act."jurnaldetil" add _modifyby integer  ;
comment on column act."jurnaldetil"._modifyby is 'user yang terakhir modifikasi record ini';

-- MODIFY _modifyby
alter table act."jurnaldetil"
	alter column _modifyby type integer,
	ALTER COLUMN _modifyby DROP DEFAULT,
	ALTER COLUMN _modifyby DROP NOT NULL;
comment on column act."jurnaldetil"._modifyby is 'user yang terakhir modifikasi record ini';


-- =============================================
-- FIELD: _modifydate timestamp with time zone
-- =============================================
-- ADD _modifydate
alter table act."jurnaldetil" add _modifydate timestamp with time zone  ;
comment on column act."jurnaldetil"._modifydate is 'waktu terakhir record dimodifikasi';

-- MODIFY _modifydate
alter table act."jurnaldetil"
	alter column _modifydate type timestamp with time zone,
	ALTER COLUMN _modifydate DROP DEFAULT,
	ALTER COLUMN _modifydate DROP NOT NULL;
comment on column act."jurnaldetil"._modifydate is 'waktu terakhir record dimodifikasi';




-- =============================================
-- FOREIGN KEY CONSTRAINT
-- =============================================
-- Drop Existing Foreign Key Constraint 
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$jurnal_id;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$periode_id;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$jurnaldetil_id_ref;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$jurnaltype_id;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$curr_id;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$project_id;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$unit_id;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$site_id;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$dept_id;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$partner_id;
ALTER TABLE act."jurnaldetil" DROP CONSTRAINT fk$act$jurnaldetil$coa_id;


-- Add Foreign Key Constraint  
ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$coa_id
	FOREIGN KEY (coa_id)
	REFERENCES act."coa"(coa_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$coa_id;
CREATE INDEX idx_fk$act$jurnaldetil$coa_id ON act."jurnaldetil"(coa_id);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$partner_id
	FOREIGN KEY (partner_id)
	REFERENCES ent."partner"(partner_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$partner_id;
CREATE INDEX idx_fk$act$jurnaldetil$partner_id ON act."jurnaldetil"(partner_id);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$dept_id
	FOREIGN KEY (dept_id)
	REFERENCES ent."dept"(dept_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$dept_id;
CREATE INDEX idx_fk$act$jurnaldetil$dept_id ON act."jurnaldetil"(dept_id);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$site_id
	FOREIGN KEY (site_id)
	REFERENCES ent."site"(site_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$site_id;
CREATE INDEX idx_fk$act$jurnaldetil$site_id ON act."jurnaldetil"(site_id);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$unit_id
	FOREIGN KEY (unit_id)
	REFERENCES ent."unit"(unit_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$unit_id;
CREATE INDEX idx_fk$act$jurnaldetil$unit_id ON act."jurnaldetil"(unit_id);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$project_id
	FOREIGN KEY (project_id)
	REFERENCES prj."project"(project_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$project_id;
CREATE INDEX idx_fk$act$jurnaldetil$project_id ON act."jurnaldetil"(project_id);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$curr_id
	FOREIGN KEY (curr_id)
	REFERENCES ent."curr"(curr_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$curr_id;
CREATE INDEX idx_fk$act$jurnaldetil$curr_id ON act."jurnaldetil"(curr_id);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$jurnaltype_id
	FOREIGN KEY (jurnaltype_id)
	REFERENCES act."jurnaltype"(jurnaltype_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$jurnaltype_id;
CREATE INDEX idx_fk$act$jurnaldetil$jurnaltype_id ON act."jurnaldetil"(jurnaltype_id);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$jurnaldetil_id_ref
	FOREIGN KEY (jurnaldetil_id_ref)
	REFERENCES act."jurnaldetil"(jurnaldetil_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$jurnaldetil_id_ref;
CREATE INDEX idx_fk$act$jurnaldetil$jurnaldetil_id_ref ON act."jurnaldetil"(jurnaldetil_id_ref);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$periode_id
	FOREIGN KEY (periode_id)
	REFERENCES act."periode"(periode_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$periode_id;
CREATE INDEX idx_fk$act$jurnaldetil$periode_id ON act."jurnaldetil"(periode_id);	


ALTER TABLE act."jurnaldetil"
	ADD CONSTRAINT fk$act$jurnaldetil$jurnal_id
	FOREIGN KEY (jurnal_id)
	REFERENCES act."jurnal"(jurnal_id);


-- Add As Index, drop dulu jika sudah ada
DROP INDEX IF EXISTS act.idx_fk$act$jurnaldetil$jurnal_id;
CREATE INDEX idx_fk$act$jurnaldetil$jurnal_id ON act."jurnaldetil"(jurnal_id);	

	


-- =============================================
-- UNIQUE INDEX
-- =============================================