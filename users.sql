DROP TABLE IF EXISTS `user_types`; 
CREATE TABLE `user_types` (
  id int auto_increment PRIMARY KEY, 
  description varchar(20)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8 DEFAULT COLLATE utf8_unicode_ci;

INSERT INTO user_types VALUES(null, 'user'); 
INSERT INTO user_types VALUES(null, 'doctor');
INSERT INTO user_types VALUES(null, 'organization');
INSERT INTO user_types VALUES(null, 'moderator');
INSERT INTO user_types VALUES(null, 'admin'); 

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  id int auto_increment PRIMARY KEY, 
  username varchar(50) NOT NULL, 
  email varchar(50) NOT NULL, 
  password varchar(50) NOT NULL, 
  user_type_id int, 
  timestamp int,
  FOREIGN KEY (user_type_id) REFERENCES user_types(id)  
) ENGINE=InnoDB DEFAULT CHARSET=utf8 DEFAULT COLLATE utf8_unicode_ci;