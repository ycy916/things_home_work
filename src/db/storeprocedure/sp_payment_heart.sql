DROP PROCEDURE  IF EXISTS `things`.`sp_payment_heart`;
DELIMITER //
CREATE PROCEDURE  `things`.`sp_payment_heart`(  
                                        IN i_uuid varchar(32) CHARACTER SET utf8mb4,
                                        IN i_payment_heart_count bigint unsigned,
                                        OUT o_sum_heart bigint unsigned,
                                        OUT o_total_sum_bonus_heart bigint unsigned,
                                        OUT o_total_sum_heart bigint unsigned,
                                        OUT o_bonus_heart_info JSON,
                                        OUT o_heart_info JSON,
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
    set @payment_heart_count = i_payment_heart_count;        
    set @user_idx = 0;
    select idx into @user_idx from things.users where uuid collate utf8mb4_unicode_ci =@uuid;
    select row_count() into _checkcount;
    if _checkcount <= 0 then
        set o_ret = -1;
    else        
        set @sum_heart = 0;
        select sum(count) into @sum_heart from things.hearts where user_idx = @user_idx and deletedAt is null;
        set o_sum_heart = @sum_heart;
        if @payment_heart_count > @sum_heart then
            set o_ret = -2;
        else
            select sum(count) into o_total_sum_heart from things.hearts where user_idx = @user_idx and type = 0 and deletedAt is null;
            select sum(count) into o_total_sum_bonus_heart from things.hearts where user_idx = @user_idx and type = 1 and deletedAt is null;
            select JSON_ARRAYAGG(JSON_OBJECT('idx',a.idx,'count',a.count,'createdAt',a.createdAt)) into o_heart_info from (select idx,count,createdAt from things.hearts where user_idx=@user_idx and type= 0 and deletedAt is null) as a;
            select JSON_ARRAYAGG(JSON_OBJECT('idx',idx,'count',count,'validate_datetime',validate_datetime,'createdAt',createdAt)) into o_bonus_heart_info from (select idx,count,validate_datetime,createdAt from things.hearts where user_idx=@user_idx and type= 1 and deletedAt is null) as a;
            set o_ret = 0;
        end if;
    end if;
    select o_ret,o_sum_heart,o_total_sum_bonus_heart,o_bonus_heart_info,o_total_sum_heart,o_heart_info;
END //
DELIMITER ;