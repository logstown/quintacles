import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete'
import { useState, useMemo } from 'react'
import { networks } from '@/lib/networks'
import { take, find } from 'lodash'

export function NetworkPicker({
  networkId,
  setNetworkFromPicker,
  networkName,
}: {
  networkId?: number
  setNetworkFromPicker: (networkId?: number) => void
  networkName?: string
}) {
  const [networkSearch, setNetworkSearch] = useState(networkName ?? '')

  const filteredNetworks = useMemo(() => {
    if (networkSearch.length < 2) {
      return []
    } else {
      const filtered = networks.filter(x =>
        x.name.toLowerCase().includes(networkSearch.toLowerCase()),
      )

      return take(filtered, 5)
    }
  }, [networkSearch])

  const networkSelected = (networkId: React.Key | null) => {
    const Network = find(networks, { id: Number(networkId) })

    setNetworkSearch(Network?.name ?? '')
    setNetworkFromPicker(Network?.id)
  }

  return (
    <Autocomplete
      label='Network'
      labelPlacement='outside'
      size='lg'
      placeholder='Type to Search...'
      variant='bordered'
      inputValue={networkSearch}
      onInputChange={setNetworkSearch}
      className='w-60'
      items={filteredNetworks}
      menuTrigger='input'
      isClearable={!!networkId && networkId.toString() !== ''}
      selectedKey={networkId?.toString() ?? ''}
      onSelectionChange={networkSelected}
      color='primary'
    >
      {item => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
    </Autocomplete>
  )
}
