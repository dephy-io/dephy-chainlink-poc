'use client'

import {
  ShareToLens, Theme, Size
} from '@lens-protocol/widgets-react'


export default function Share({ item, rank }) {
  return <ShareToLens
    content={`The power efficiency of my outlet device ${item.from} ranked #${rank} on DePHY! It has avg. power factor of ${item.avgPf} and avg. power of ${item.avgPower}W!`}
    theme='mint'
    size='small'
  />
}