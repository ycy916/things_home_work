DROP PROCEDURE  IF EXISTS `things`.`sp_bonus_heart_charging`;
DELIMITER //
CREATE PROCEDURE  `things`.`sp_bonus_heart_charging`(  
                                        IN i_uuid varchar(128),
                                        IN i_bonus_heart_count bigint unsigned,
                                        IN i_datetime datetime,
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
    set @user_idx = 0;
    select idx into @user_idx from things.users where uuid=@uuid;
    select row_count() into _checkcount;
    if _checkcount <= 0 then
        set o_ret = -1;
    else
        set @bonus_heart_count = i_bonus_heart_count;        
        insert into things.bonus_hearts(user_idx,count,validate_datetime) values(@user_idx,@bonus_heart_count);
        select row_count() into _checkcount;
        if _checkcount <= 0 then
            set o_ret = -2;
        else
            set o_ret = 0;
        end if;
    end if;
END //
DELIMITER ;