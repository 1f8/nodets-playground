export type EventName = 'SIGNUP' | 'UPGRADE' | 'DOWNGRADE' | 'CANCEL'


export enum UserSubState {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  INACTIVE = 'INACTIVE',
}

export interface UserSubsEvent {
  ts: number
  eventName: EventName
  expires?: number
}

export const Quotas = {
  Inactive: 0,
  Free: 10,
  Premium: 50,
}

export const getUserState = (events:UserSubsEvent[], id?:string):UserSubState => {
  if (!events?.length) {
    return UserSubState.FREE
  }

  const lastEvent:UserSubsEvent = events
    .sort((a,b) => a.ts-b.ts)
    [events.length-1]

  if (lastEvent.eventName==='CANCEL') {
    return UserSubState.INACTIVE
  }

  if (lastEvent.eventName==='UPGRADE') {
    return UserSubState.PREMIUM
  }

  if (lastEvent.eventName==='DOWNGRADE') {
    const upgradeEvents = events
      .filter(a => a.eventName==='UPGRADE')
      .sort((a,b) => a.ts-b.ts)
    const upgradeEvent = upgradeEvents[upgradeEvents.length-1]
    const upgradedOn = upgradeEvent.ts
    const downgradedOn = lastEvent.ts
    const cyclesPaidFor = Math.ceil((downgradedOn - upgradedOn)/30)
    const upgradeEndsOn = upgradedOn + (cyclesPaidFor*30)

    const now = 200  // pretend number
    return upgradeEndsOn < now
      ? UserSubState.FREE
      : UserSubState.PREMIUM
  }

  return UserSubState.FREE
}

export const getUserQuota = (events:UserSubsEvent[]):number => {
  const state = getUserState(events)
  return state==='INACTIVE' ? Quotas.Inactive
    : state==='PREMIUM'     ? Quotas.Premium
    : Quotas.Free
}

export const promptToUpgrade = (events:UserSubsEvent[], usage:number):boolean => {
  const state = getUserState(events)

  if (state===UserSubState.INACTIVE) return false

  if (state===UserSubState.PREMIUM) return false

  if (usage > Quotas.Free) {
    return true
  }

  return false
}
