import { RawContactRecord, ContactRecord, RawContact, OptionalLocale } from "./type"
import { AvailableState } from "../../common"
import { mandatoryTransform } from "./transformers"

const lowerCase = <T>(f: (_: T) => string): (_: T) => string => {
  return (arg: T) => {
    return f(arg).toLowerCase()
  }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
const normalizeKey = lowerCase(({ state, county, city }: OptionalLocale): string => {
  switch(state) {
    // only county
    case 'Florida':
    case 'Georgia':
    case 'Minnesota':
    case 'Nebraska': {
      return county!
    }

    // only city
    case 'Maine': return city!

    // hybrid count or city
    case 'Maryland': // Baltimore city is independent of county
    case 'Virginia': // Alexandria, Fairfax are independent of county.  All end in "City"
    case 'Nevada': {  // Carson City is independent of county
      return (city ?? '') + ':' + (county ?? '')
    }

    // both city and county
    case 'Michigan': {
      return city + ':' + county
    }
    case 'Wisconsin': {
      return city + ':' + (county ?? '')
    }
  }
})
/* eslint-enable @typescript-eslint/no-non-null-assertion */

export const normalizeLocale = ({state, city, county}: OptionalLocale): string => {
  return normalizeKey({
    state,
    city: city ? mandatoryTransform(city) : undefined,
    county: county ? mandatoryTransform(county) : undefined,
  })
}

export const normalizeState = (state: AvailableState, contacts: RawContact[]): Record<string, RawContact> => {
  const array = contacts.map(
    contact => [
      normalizeLocale({
        state,
        city: contact.city,
        county: contact.county,
      }),
      contact,
    ]
  )
  return Object.fromEntries(array)
}

export const normalizeRecords = (records: RawContactRecord): ContactRecord => {
  const rawArray  = Object.entries(records) as Array<[AvailableState, RawContact[]]>
  const array = rawArray.map(
    ([state, contactDatas]) => [
      state,
      normalizeState(state, contactDatas)
    ]
  )
  return Object.fromEntries(array)
}

