CREATE USER 'readuser' IDENTIFIED BY 'strong-password';
GRANT SELECT ON music_metadata.* TO 'readuser';

CREATE USER 'fulluser' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON music_metadata.* TO 'fulluser';
