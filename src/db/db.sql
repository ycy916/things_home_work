drop table if exists things.users;
create table things.users(
    idx bigint unsigned not null auto_increment,
    uuid varchar(32) unique not null,
    email varchar(32) unique default null,
    token text,
    refresh_token text,
    createdAt timestamp not null default current_timestamp,
    updatedAt timestamp not null default current_timestamp on update current_timestamp,
    deletedAt datetime,
    primary key (idx),
    index index0(email),
    index index1(uuid)
)DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

drop table if exists things.hearts;

-- create table things.hearts(
--     idx bigint unsigned not null auto_increment,
--     user_idx bigint unsigned not null,
--     count bigint unsigned default 0,
--     createdAt timestamp not null default current_timestamp,
--     updatedAt timestamp not null default current_timestamp on update current_timestamp,
--     deletedAt datetime,
--     primary key (idx),
--     index index0(user_idx)
-- )DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- drop table if exists things.bonus_hearts;
drop table if exists things.hearts;
create table things.hearts(
    idx bigint unsigned not null auto_increment,
    user_idx bigint unsigned not null,
    type tinyint default 0,  # 일반 하트(0) , 보너스 하트(1)
    count bigint unsigned default 0,
    validate_datetime datetime default null, #일반 하트일 경우 null
    createdAt timestamp not null default current_timestamp,
    updatedAt timestamp not null default current_timestamp on update current_timestamp,
    deletedAt datetime,
    primary key (idx),
    index index0(user_idx)
)DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;