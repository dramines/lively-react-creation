export const generateTimeSlots = (start, end, interval) => {
    const slots = [];
    let currentTime = start;
  
    while (currentTime < end) {
      const startHour = currentTime;
      const endHour = startHour + interval / 60;
      const formatTime = (hour) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour > 12 ? hour - 12 : hour;
        return `${formattedHour}:00 ${period}`;
      };
  
      slots.push(`${formatTime(startHour)} - ${formatTime(endHour)}`);
      currentTime = endHour;
    }
  
    return slots;
  };
  