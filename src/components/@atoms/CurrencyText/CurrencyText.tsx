import { Skeleton } from '@ensdomains/thorin'

import { useEthPrice } from '@app/hooks/useEthPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

type Props = {
  eth?: bigint
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: bigint
  currency: CurrencyDisplay
}

export const CurrencyText = ({ eth, bufferPercentage = 100n, currency = 'lyx' }: Props) => {
  const { data: ethPrice, isLoading: isEthPriceLoading } = useEthPrice()

  const isLoading = isEthPriceLoading || !eth || !ethPrice

  return (
    <Skeleton loading={isLoading}>
      {(() => {
        if (isLoading) return '0.0000 LYX'
        if (currency === 'lyx')
          return makeDisplay({ value: (eth * bufferPercentage) / 100n, symbol: 'lyx' })
        return makeDisplay({ value: (eth * ethPrice) / BigInt(1e8), symbol: currency })
      })()}
    </Skeleton>
  )
}
