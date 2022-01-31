export const getDateIntArrayByDayOfWeek = (
  from: number,
  to:   number,
  daysOfWeek: number[] = [0,1,2,3,4,5,6],
):number[] => {
  const x:number[] = []

  let current = from
  while (current <= to) {
    const s = current.toString()

    // convert to Date()
    const ymd = [
      s.substring(0, 4),
      s.substring(4, 6),
      s.substring(6, 8),
    ]
    const dt = new Date(ymd.join('-'))

    // if conditional, add to array
    if (daysOfWeek.includes(dt.getDay())) {
      x.push(current)
    }

    // next day
    const nextDt = new Date(dt.getTime() + (1000*60*60*24))
    current = Number([
      nextDt.getFullYear(),
      (nextDt.getMonth() + 1).toString().padStart(2, '0'),
      nextDt.getDate().toString().padStart(2, '0'),
    ].join(''))
  }

  return x
}
