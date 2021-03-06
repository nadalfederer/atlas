import React, { useEffect } from 'react'
import { useOverlayManager, useRouterQuery } from '@/hooks'
import RecentSearches from './RecentSearches'
import SearchResults from './SearchResults'
import styled from '@emotion/styled'
import { colors, zIndex } from '@/shared/theme'
import { TOP_NAVBAR_HEIGHT } from '@/components/TopNavbar'
import { QUERY_PARAMS } from '@/config/routes'

const SearchOverlayView: React.FC = () => {
  const searchQuery = useRouterQuery(QUERY_PARAMS.SEARCH)
  const { handleOverlayOpen, handleOverlayClose } = useOverlayManager()

  // prevent body scroll
  useEffect(() => {
    handleOverlayOpen()

    return () => {
      handleOverlayClose()
    }
  }, [handleOverlayClose, handleOverlayOpen])

  return (
    <OverlayContainer role="dialog">
      {searchQuery ? <SearchResults query={searchQuery} /> : <RecentSearches />}
    </OverlayContainer>
  )
}

const OverlayContainer = styled.div`
  position: fixed;
  z-index: ${zIndex.nearOverlay};
  top: ${TOP_NAVBAR_HEIGHT}px;
  left: var(--sidenav-collapsed-width);
  right: 0;
  height: calc(100vh - ${TOP_NAVBAR_HEIGHT}px);

  background-color: ${colors.black};
  padding: 0 var(--global-horizontal-padding);
  overflow: auto;
`

export default SearchOverlayView
