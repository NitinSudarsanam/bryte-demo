export default function CalendarEmbed({
  calendarId = "2c21e238c0857dc43f7d03919c49ef159146a198d4328bc70e543d29f6712eb2@group.calendar.google.com",
  title = 'Calendar',
  height = 700,
  timeZone = 'America/New_York',
  mode = 'MONTH' // 'WEEK', 'MONTH', 'AGENDA'
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
    
    <iframe
      title={title}
      src={src}
      style={{ border: 0, width: '100%', height }}
      loading='lazy'
    />
  )
}

// Usage
// <CalendarEmbed calendarId='your_calendar_id@group.calendar.google.com' />