DROP PROCEDURE  IF EXISTS `things`.`sp_charging_heart`;
DELIMITER //
CREATE PROCEDURE  `things`.`sp_charging_heart`(  
                                        IN i_uuid varchar(32) CHARACTER SET utf8mb4,
                                        IN i_heart_count bigint unsigned,
                                        OUT o_ret TINYINT(4))
BEGIN
    DECLARE _checkcount int(11) default 0;
    DECLARE _msg TEXT;
    DECLARE _code VARCHAR(5);	  
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        GET DIAGNOSTICS CONDITION 1 _code = RETURNED_SQLSTATE, _msg = MESSAGE_TEXT;
    END;


    # -1 : 해당 email의 유저가 존재 하지 않음
    # -2 : heart_count 충전 실패
    set @uuid = i_uuid;
    set @heart_count = i_heart_count;     
    set @user_idx = 0;       
    select idx into @user_idx from things.users where uuid collate utf8mb4_unicode_ci = @uuid;    
    
    select row_count() into _checkcount;
    
    if _checkcount <= 0 then        
        set o_ret = -1;
    else
        insert into things.hearts(user_idx,count) values(@user_idx,@heart_count);
        select row_count() into _checkcount;
        if _checkcount <= 0 then
            set o_ret = -2;
        else
            set o_ret = 0;
        end if;
    end if;
    select o_ret; 
END //
DELIMITER ;