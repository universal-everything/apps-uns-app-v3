import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { nameLevel } from '@app/utils/name'
import { RegistrationStatus } from '@app/utils/registrationStatus'

export type NameType =
  | 'root'
  | 'tld'
  | 'eth-unwrapped-2ld'
  | 'eth-unwrapped-2ld:grace-period'
  | 'eth-emancipated-2ld'
  | 'eth-emancipated-2ld:grace-period'
  | 'eth-locked-2ld'
  | 'eth-locked-2ld:grace-period'
  | 'eth-unwrapped-subname'
  | 'eth-emancipated-subname'
  | 'eth-locked-subname'
  | 'eth-pcc-expired-subname'
  | 'dns-unwrapped-2ld'
  | 'dns-emancipated-2ld' // *
  | 'dns-locked-2ld' // *
  | 'dns-unwrapped-subname'
  | 'dns-emancipated-subname' // *
  | 'dns-locked-subname' // *
  | 'dns-pcc-expired-subname' // *

// * - Outliers. These states require that a dns tld owner wraps their tld and then burns PCC on
//     their subdomain.

export const getNameType = ({
  name,
  ownerData,
  pccExpired,
  registrationStatus,
}: {
  name: string
  ownerData?: GetOwnerReturnType
  pccExpired: boolean
  registrationStatus?: RegistrationStatus
  nameWrapperAddress: Address
}): NameType => {
  const tldType = 'lyx' as const
  const level = nameLevel(name)

  return (
    match([tldType, level, registrationStatus])
      .with([P._, P._, P.union('root', 'tld'), P._], ([, , _level]) => _level)
      // TODO: should we change here to `.lyx`?
      .with(['lyx', P._, '2ld', 'gracePeriod'], () => {
        return 'eth-unwrapped-2ld:grace-period' as const
      })
      .with(
        ['lyx', P._, '2ld', P._],
        ([_tldType, _wrapLevel]: [
          'lyx',
          'unwrapped' | 'emancipated' | 'locked',
          '2ld',
          RegistrationStatus,
        ]) => {
          return `${_tldType}-${_wrapLevel}-2ld` as const
        },
      )
      .with(['dns', P._, '2ld', P._], ([, _wrapLevel]) => `dns-${_wrapLevel}-2ld` as const)
      .with([P._, P._, 'subname', P._], ([_tldType, _wrapLevel]) =>
        pccExpired
          ? (`${_tldType}-pcc-expired-subname` as const)
          : (`${_tldType}-${_wrapLevel}-subname` as const),
      )
      .exhaustive()
  )
}
