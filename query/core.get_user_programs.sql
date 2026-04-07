-- DROP FUNCTION core.get_user_programs(int4);

CREATE OR REPLACE FUNCTION core.get_user_programs(in_user_id integer)
 RETURNS TABLE(id integer, title text, url text, icon text, type text, level integer, path text, parent integer)
 LANGUAGE plpgsql
AS $function$


declare
	showallprogram bool;


begin
	
	drop table if exists temp_program;
	create temp table temp_program (
		id int,
		title text,
		url text,
		icon text,
		type text,
		level int,
		path text,
		parent int
	);


	-- cek apakah user boleh lihat semua program
	select user_isshowallprogram from core."user" where user_id =  in_user_id
	into showallprogram;



	if showallprogram=true then

		-- ambil semua program yang ada
		insert into temp_program
		(id, title, url, icon, type, level, path, parent)
		select distinct 
		D.program_id as id,
		D.program_title as title,
		concat(E.apps_url, '/', D.program_name, '?variance=' , D.program_variance) as url,
		case when D.program_icon='' then '' else concat(E.apps_url, '/', D.program_icon) end as icon,
		'1' as type,
		coalesce(F.programgroup_level, 1) as level,
		F.programgroup_path as path,
		D.programgroup_id
		from core."program" D inner join core."apps" E on  E.apps_id = D.apps_id and D.program_isdisabled = false
						   left join core."programgroup" F on F.programgroup_id = D.programgroup_id; 

	else

		-- ambil program hanya yang dipunyai user
		insert into temp_program
		(id, title, url, icon, type, level, path, parent)
		select distinct 
		D.program_id as id,
		D.program_title as title,
		concat(E.apps_url, '/', D.program_name, '?variance=' , D.program_variance) as url,
		case when D.program_icon='' then '' else concat(E.apps_url, '/', D.program_icon) end as icon,
		'1' as type,
		coalesce(F.programgroup_level, 1) as level,
		F.programgroup_path as path,
		D.programgroup_id 
		from core."user" A inner join core."usergroup" B on B.user_id  = A.user_id and B.usergroup_isdisabled = false
		                   inner join core."groupprogram" C on C.group_id = B.group_id  and C.groupprogram_isdisabled = false
		                   inner join core."program" D on D.program_id = C.program_id and D.program_isdisabled = false
		                   inner join core."apps" E on  E.apps_id = D.apps_id
						   left join core."programgroup" F on F.programgroup_id = D.programgroup_id 	
		where A.user_id = in_user_id;

	end if;

	

	-- ambil hierarki group
	with recursive program_hierarchy as (
	  select 
	    src.programgroup_id,
	    src.programgroup_name,
	    src.programgroup_parent,
		src.programgroup_pathid,
	    src.programgroup_path,
	    src.programgroup_icon,
		src.programgroup_level
	  from core.programgroup src
	  where src.programgroup_id in (select tmp.parent from temp_program tmp)
	
	  union
	
	  select 
	    pg.programgroup_id,
	    pg.programgroup_name,
	    pg.programgroup_parent,
		pg.programgroup_pathid,
	    pg.programgroup_path,
	    pg.programgroup_icon,
 		pg.programgroup_level

	  from core.programgroup pg inner join program_hierarchy ph 
	       on ph.programgroup_parent = pg.programgroup_id
	)
	
	insert into temp_program
	(id, title, url, icon, type, level, path, parent)
	select 
	ph.programgroup_id as id, 
	ph.programgroup_name as title, 
	'' as url,
	ph.programgroup_icon as icon,
	'0' as type , 
	ph.programgroup_level as level, 
	ph.programgroup_path, 
	ph.programgroup_parent
	from program_hierarchy ph
	order by ph.programgroup_path;


	return query
	select 
	X.id, 
	X.title, 
	X.url, 
	X.icon, 
	case when X.type='0' then 'group' else 'program' end as type, 
	X.level, 
	X.path,
	X.parent
	from temp_program X
	order by X.path nulls last, X.type, X.title;
	
end;
$function$
;
