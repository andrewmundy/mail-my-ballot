import { ContactData, AvailableState } from "../../common"

export type RawContact = Omit<ContactData, 'state'>

export type RawContactRecord = Record<AvailableState, RawContact[]>

export type ContactRecord = Record<AvailableState, Record<string, RawContact>>
