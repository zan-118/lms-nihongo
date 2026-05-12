'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'
import dynamicImport from 'next/dynamic'

const StudioPage = () => {
  return <NextStudio config={config} />
}

// Disable SSR for Sanity Studio
export default dynamicImport(() => Promise.resolve(StudioPage), {
  ssr: false,
})
