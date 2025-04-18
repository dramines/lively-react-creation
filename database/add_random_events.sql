
-- First, let's create a procedure to add random events
DELIMITER //

CREATE PROCEDURE AddRandomEvents()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE place_id INT;
  DECLARE provider_id INT;
  DECLARE place_name VARCHAR(255);
  DECLARE place_cur CURSOR FOR SELECT id, provider_id, name FROM places;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  -- Event details arrays
  SET @event_titles = JSON_ARRAY(
    'Summer Festival', 'Art Exhibition', 'Music Concert', 'Food Tasting', 
    'Cultural Event', 'Workshop', 'Theater Show', 'Dance Performance',
    'Tech Conference', 'Fashion Show', 'Comedy Night', 'Wine Tasting'
  );
  
  SET @organizers = JSON_ARRAY(
    'Cultural Association', 'City Council', 'Local Artists', 'Community Center',
    'Event Planning Co.', 'Tourist Office', 'Local Business Association'
  );

  OPEN place_cur;
  
  read_loop: LOOP
    FETCH place_cur INTO place_id, provider_id, place_name;
    IF done THEN
      LEAVE read_loop;
    END IF;

    -- Generate 3-5 random events for each place
    SET @num_events = FLOOR(3 + RAND() * 3);
    
    WHILE @num_events > 0 DO
      -- Random date between now and next 6 months
      SET @start_date = DATE_ADD(NOW(), INTERVAL FLOOR(RAND() * 180) DAY);
      SET @end_date = DATE_ADD(@start_date, INTERVAL FLOOR(1 + RAND() * 72) HOUR);
      
      -- Random title and organizer
      SET @title = JSON_UNQUOTE(JSON_EXTRACT(@event_titles, CONCAT('$[', FLOOR(RAND() * JSON_LENGTH(@event_titles)), ']')));
      SET @organizer = JSON_UNQUOTE(JSON_EXTRACT(@organizers, CONCAT('$[', FLOOR(RAND() * JSON_LENGTH(@organizers)), ']')));
      
      -- Random ticket price between 10 and 100
      SET @price = ROUND(10 + RAND() * 90, 2);
      
      -- Random capacity between 50 and 500
      SET @capacity = 50 + FLOOR(RAND() * 451);

      -- Insert the random event
      INSERT INTO events (
        title,
        description,
        startDate,
        endDate,
        location,
        organizer,
        ticketPrice,
        capacity,
        images,
        provider_id
      ) VALUES (
        @title,
        CONCAT('Join us for an amazing ', @title, ' at ', place_name, '. Don''t miss this spectacular event!'),
        @start_date,
        @end_date,
        place_name,
        @organizer,
        @price,
        @capacity,
        JSON_ARRAY('event1.jpg', 'event2.jpg'),
        provider_id
      );
      
      SET @num_events = @num_events - 1;
    END WHILE;
    
  END LOOP;

  CLOSE place_cur;
END //

DELIMITER ;

-- Execute the procedure
CALL AddRandomEvents();

-- Clean up (optional - remove the procedure after use)
DROP PROCEDURE IF EXISTS AddRandomEvents;
