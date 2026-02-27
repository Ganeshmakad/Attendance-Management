-- Attendance System Database
CREATE DATABASE IF NOT EXISTS attendancedb;
USE attendancedb;

CREATE TABLE IF NOT EXISTS attendance (
  id      INT PRIMARY KEY AUTO_INCREMENT,
  name    VARCHAR(100) NOT NULL,
  roll    VARCHAR(20)  NOT NULL,
  subject VARCHAR(100) NOT NULL,
  date    DATE         NOT NULL,
  status  ENUM('Present','Absent','Late') NOT NULL
);

-- Sample data
INSERT INTO attendance (name, roll, subject, date, status) VALUES
('Ganesh', '21CS045', 'DBMS', CURDATE(), 'Present'),
('Priya',  '21CS032', 'DBMS', CURDATE(), 'Absent'),
('Ravi',   '21CS018', 'DBMS', CURDATE(), 'Late');

SELECT 'Done ✅' AS status;
