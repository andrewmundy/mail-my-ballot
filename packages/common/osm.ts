import { Address } from "."
import { isState, State } from "./states"

/*
  In theory, this module could exist on the client, but we need it in common for
  testing on the server.  See `contact/index.test.ts`.
*/

const fetch = (typeof window !== 'undefined' && window.fetch) ? window.fetch : require('node-fetch')

const getJson = async <T>(url: string): Promise<T> => {
  const result = await fetch(url)
  return await result.json()
}

interface BasicAddress {
  houseNumber: string
  road: string
  unit: string
  city: string
  country: string
  state: string
  postcode: string
  county: string
}

export const fetchState = async (zip: string): Promise<State | null> => {
  const query = `${zip} United States`
  const summary = (await getJson<Array<any>>(`https://nominatim.openstreetmap.org/search/${query}?format=json&countrycodes=us`))[0]
  if (!summary) return null

  const parts = summary.display_name.split(',')
  const state = parts[parts.length - 3].trim()
  return isState(state) ? state : null
}

const parseDisplayName = (displayName: string, unit: string): BasicAddress | null => {
  /*
  Parse a display_name field from osm sumary result, e.g.
  2125, Butterfield Road, Regents Club Of Troy, Big Beaver, Troy, Oakland County, Michigan, 48084, United States of America
  */

  // 
  const parts = displayName.split(',')
  if(parts.length < 7) return null
  return {
    houseNumber: parts[0].trim(),
    road: parts[1].trim(),
    unit,
    city: parts[parts.length - 5].trim(),
    county: parts[parts.length - 4].trim(),
    state: parts[parts.length - 3].trim(),
    postcode: parts[parts.length - 2].trim(),
    country: parts[parts.length - 1].trim(),
  }
}

export const geocode = async (queryAddr: string, unit = ''): Promise<Address | null> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const summary = (await getJson<Array<any>>(`https://nominatim.openstreetmap.org/search/${queryAddr}?format=json&countrycodes=us`))[0]
  if (!summary) {
    return null
  }
  const osmId = summary.osm_type[0].toUpperCase() + summary.osm_id
  const summaryAddress = parseDisplayName(summary.display_name, unit)
  if (summaryAddress) {
    return {
      queryAddr,
      fullAddr: summary.display_name,
      ...summaryAddress
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detail = (await getJson<Array<any>>(`https://nominatim.openstreetmap.org/lookup?osm_ids=${osmId}&format=json`))[0]
  if (!detail) {
    return null
  }
  const { address } = detail
  const {
    house_number: rawHouseNumber,
    road,
    city,
    state,
    postcode,
    country,
    county
  } = address

  // OSM is often missing the house number on response.  So we'll infer it
  const fullAddr = summary.display_name
  const houseNumber = rawHouseNumber ? rawHouseNumber : fullAddr.split(',')[0].trim()

  return {
    queryAddr,
    fullAddr,
    houseNumber,
    road,
    unit,
    city,
    state,
    postcode,
    country,
    county,
  }
}