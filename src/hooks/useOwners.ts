import { useMemo } from 'react'

import { useBasicName } from '@app/hooks/useBasicName'
import { OwnerArray } from '@app/types'

import { DEFAULT_ABILITIES, type useAbilities } from './abilities/useAbilities'

type BasicNameReturnType = ReturnType<typeof useBasicName>

type UseOwnersParameters = {
  ownerData: BasicNameReturnType['ownerData']
  abilities?: ReturnType<typeof useAbilities>['data']
}

export const useOwners = ({ ownerData, abilities = DEFAULT_ABILITIES }: UseOwnersParameters) => {
  const owners = useMemo(() => {
    const _owners: OwnerArray = []

    if (ownerData?.owner) {
      _owners.push({
        address: ownerData?.owner,
        canTransfer: abilities.canSendManager,
        transferType: 'manager',
        label: 'name.manager',
        description: 'details.descriptions.controller',
        testId: 'owner-button-owner',
      })
    }
    if (ownerData?.registrant) {
      _owners.push({
        address: ownerData.registrant,
        canTransfer: abilities.canSendOwner,
        transferType: 'owner',
        label: 'name.owner',
        description: 'details.descriptions.registrant',
        testId: 'owner-button-registrant',
      })
    }

    return _owners
  }, [ownerData, abilities])

  return owners
}
