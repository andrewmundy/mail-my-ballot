import React from 'react'
import Input from 'muicss/lib/react/input'

import { BaseInfo, StateInfo, isImplementedLocale } from '../../common'
import { client } from '../../lib/trpc'
import { RoundedButton } from '../util/Button'
import { useControlRef } from '../util/ControlRef'
import { BaseInput, PhoneInput, EmailInput, NameInput, BirthDateInput } from '../util/Input'
import { Togglable } from '../util/Togglable'
import { useAppHistory } from '../../lib/path'
import { Signature } from '../util/Signature'
import { AddressContainer, VoterContainer, ContactContainer } from '../../lib/unstated'
import { ContactInfo } from '../contact/ContactInfo'
import { AppForm } from '../util/Form'
import { Center } from '../util/Util'

export type StatelessInfo = Omit<BaseInfo, 'state'>

type EnrichValues<Info> = (base: StatelessInfo) => Info | null

type Props<Info> = React.PropsWithChildren<{
  enrichValues: EnrichValues<Info>
}>

/**
 * this works with redirect urls of the form
 * /#/org/default/state?registrationAddress=100%20S%20Biscayne%20Blvd,%20Miami,%20FL%2033131&name=George%20Washington&birthdate=1945-01-01&email=george@us.gov&telephone=212-111-1111
 */
export const Base = <Info extends StateInfo>({ enrichValues, children }: Props<Info>) => {
  const { pushSuccess, oid, query } = useAppHistory()
  const { address, locale } = AddressContainer.useContainer()
  const { contact } = ContactContainer.useContainer()
  const { voter } = VoterContainer.useContainer()

  const nameRef = useControlRef<Input>()
  const birthdateRef = useControlRef<Input>()
  const emailRef = useControlRef<Input>()
  const phoneRef = useControlRef<Input>()
  const mailingRef = useControlRef<Input>()
  if (!locale || !isImplementedLocale(locale) || !contact) return null

  const uspsAddress = address ? address.fullAddr : null
  const { city, county, otherCities, latLong } = locale

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.persist()  // allow async function call
    event.preventDefault()
    if (!address || !uspsAddress || !contact) return  // TODO: Add warning

    const baseInfo: StatelessInfo = {
      city: contact.city ?? city,
      county: contact.county ?? county,
      otherCities,
      latLong,
      oid,
      name: nameRef.value() || '',
      birthdate: birthdateRef.value() || '',
      email: emailRef.value() || '',
      mailingAddress: mailingRef.value() || '',
      phone: phoneRef.value() || '',
      uspsAddress,
      contact,
    }

    const info = enrichValues(baseInfo)
    if (!info) return  // TODO: Add warning
    const result = await client.register(info, voter)
    result.type === 'data' && pushSuccess(result.data)
    // TODO: Add warning if error
  }

  return <AppForm onSubmit={handleSubmit}>
    <NameInput
      id='name'
      ref={nameRef}
      defaultValue={query.name}
      required
    />
    <BaseInput
      id='registrationAddress'
      label='Registration Address'
      defaultValue={address?.queryAddr}
      disabled
    />
    <ContactInfo locale={locale} contact={contact}/>
    <BirthDateInput
      id='birthdate'
      ref={birthdateRef}
      defaultValue={query.birthdate}
      required
    />
    <EmailInput
      id='email'
      ref={emailRef}
      defaultValue={query.email}
      required
    />
    <PhoneInput
      id='telephone'
      ref={phoneRef}
      defaultValue={query.telephone}
    />
    <Togglable
      id='mailing'
      label='Mail My Ballot to a separate mailing address'
    >{
      (checked) => <BaseInput
        id='mailing'
        label='Mailing Address'
        ref={mailingRef}
        required={checked}
      />
    }</Togglable>
    { children }
    <Center>
      <RoundedButton color='primary' variant='raised' data-testid='submit'>
        Submit signup
      </RoundedButton>
    </Center>
  </AppForm>
}

export type NoSignature<Info extends StateInfo> = Omit<Info, 'signature'>

export const SignatureBase = <Info extends StateInfo>(
  {enrichValues, children}: Props<NoSignature<Info>>
) => {
  const [signature, setSignature] = React.useState<string | null>()

  const enrichValuesWithSignature = (baseInfo: StatelessInfo): Info | null => {
    const values = enrichValues(baseInfo)
    if (!values) return null

    if (!signature) {
      alert('Please sign form')
      return null
    }

    return {
      ...baseInfo,
      ...values,
      signature,
    } as Info  // hack b/c it cannot understand how to distribute over types
  }

  return <Base<Info>
    enrichValues={enrichValuesWithSignature}
  >
    { children }
    <Signature setSignature={setSignature}/>
  </Base>
}
