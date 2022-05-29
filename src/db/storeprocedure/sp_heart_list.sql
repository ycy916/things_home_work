DROP PROCEDURE  IF EXISTS `things`.`sp_heart_list`;
DELIMITER //
CREATE PROCEDURE  `things`.`sp_heart_list`(  
                                        IN i_uuid varchar(32) CHARACTER SET utf8mb4,
                                        IN i_page int unsigned,                                     
                                        OUT o_heart_info JSON,
                                        OUT o_total_count bigint unsigned,
                                        OUT o_ret TINYINT(4))
BEGIN
    DECLARE _checkcount int(11) default 0;   
    DECLARE _msg TEXT;
    DECLARE _code VARCHAR(5);	  
	DECLARE _start bigint(11);
    DECLARE _size int(11); 
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 _code = RETURNED_SQLSTATE, _msg = MESSAGE_TEXT;
    END;


    # -1 : 해당 email의 유저가 존재 하지 않음
    # -2 : heart_count 충전 실패
    set @uuid = i_uuid;
    set _size=10;        
    set @start = 0;
    set @user_idx = 0;
    select idx into @user_idx from things.users where uuid collate utf8mb4_unicode_ci =@uuid;
    select row_count() into _checkcount;
    if _checkcount <= 0 then
        set o_ret = -1;
    else       
	  set o_ret = 0;
      set @page = i_page;
      set _start = _size * (@page - 1);
      select count(*) into o_total_count from things.hearts where user_idx=@user_idx and count > 0 and deletedAt is null; 
      select JSON_ARRAYAGG(JSON_OBJECT('idx',a.idx,'count',a.count,'type',a.type,'validate_datetime',validate_datetime,'created_at', date_format(a.createdAt,'%Y-%m-%d %T'))) into o_heart_info from 
      (select idx,type,validate_datetime,count,createdAt from things.hearts where user_idx=@user_idx and count > 0 and deletedAt is null order by idx desc limit _start,_size) as a;
      
    end if;
    select o_ret,o_heart_info,o_total_count;
END //
DELIMITER ;