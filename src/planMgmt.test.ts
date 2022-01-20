import * as plan from './planMgmt'
import { UserSubState, UserSubsEvent } from './planMgmt'

test('get user subscription state', () => {
  // new user signup 
  const newUserEvents:UserSubsEvent[] = [{
    ts: 1,
    eventName: 'SIGNUP',
  }]
  expect(plan.getUserState(newUserEvents)).toEqual(UserSubState.FREE)

  // check if events are out of order
  const outOfOrderEvents:UserSubsEvent[] = [{
    ts: 1,
    eventName: 'SIGNUP',
  },{
    ts: 3,
    eventName: 'CANCEL',
  },{
    ts: 2,
    eventName: 'UPGRADE',
  }]
  expect(plan.getUserState(outOfOrderEvents)).toEqual('INACTIVE')

  // upgraded and its been awhile
  const activeEvents:UserSubsEvent[] = [{
    ts: 1,
    eventName: 'SIGNUP',
  },{
    ts: 3,
    eventName: 'UPGRADE',
  },{
    ts: 88,
    eventName: 'DOWNGRADE',
  }]
  expect(plan.getUserState(activeEvents)).toEqual(UserSubState.FREE)
})

test('get user quota', () => {
  const newUserEvents:UserSubsEvent[] = [{
    ts: 1,
    eventName: 'SIGNUP',
  }]
  expect(plan.getUserQuota(newUserEvents)).toEqual(10)
})

test('prompt user to upgrade', () => {
  const newUserEvents:UserSubsEvent[] = [{
    ts: 1,
    eventName: 'SIGNUP',
  }]
  const usage = 11
  expect(plan.promptToUpgrade(newUserEvents, usage)).toEqual(true)

  const usage2 = 9
  expect(plan.promptToUpgrade(newUserEvents, usage2)).toEqual(false)
})
