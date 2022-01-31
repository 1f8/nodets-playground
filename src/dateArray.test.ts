import {
  getDateIntArrayByDayOfWeek,
} from './dateArray'

test('getDateIntArrayByDayOfWeek', () => {
  const dateInts = getDateIntArrayByDayOfWeek(
    20220204,
    20220208,
    [1,2,3,4,5,6],
  )
  expect(dateInts.length).toBe(4)

  // example for clinic
  // getDateIntArrayByDayOfWeek(
  //   20220204,
  //   20220304,
  //   [1,2,3,4,5,6],
  // ).filter(n => [
  //   20220214,
  //   20220215,
  // ].includes(n))
})
