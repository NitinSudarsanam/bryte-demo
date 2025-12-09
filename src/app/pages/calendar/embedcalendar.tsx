import "./calendar.css";
export default function CalendarEmbed({
  calendarId = "f053152a50b51df2648bfbbc7c0eecee40d26e5a329ba6d64d2b4126cdbf0069@group.calendar.google.com",
  title = 'Calendar',
  height = 700,
  timeZone = 'America/New_York',
  mode = 'WEEK' // 'WEEK', 'MONTH', 'AGENDA'
}) {
  const params = new URLSearchParams({
    src: calendarId,
    ctz: timeZone,
    mode,
    showTitle: '0',
    showNav: '0',
    showDate: '1',
    showTabs: '0',
    showCalendars: '0',
    showPrint: '0'
  })
  const src = `https://calendar.google.com/calendar/embed?${params.toString()}`

  return (
    
    <iframe className="calendar-style"
      title={title}
      src={src}
      style={{ border: 0, width: '100%', height }}
      loading='lazy'
    />
  )
}

// Usage
// <CalendarEmbed calendarId='your_calendar_id@group.calendar.google.com' />