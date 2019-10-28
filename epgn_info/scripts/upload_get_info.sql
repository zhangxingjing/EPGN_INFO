-- 创建当前数据表
create table result_info(
    id int not null auto_increment primary key, -- 设置id为主键且自增
    original_file_name varchar(50),
    result_file_path varchar(50)
);

-- 插入数据
-- "insert into result_info (original_file_name, result_file_path) values(\"%s\", \"%s\")" %(original_file_path, result_file_path)
insert into result_info (original_file_name, result_file_path) values("/home/zheng/Documents/EPGN/700025 ( 0.00-21.96 s).asc", "/home/zheng/Documents/EPGN/csv/700025 ( 0.00-21.96 s).txt")