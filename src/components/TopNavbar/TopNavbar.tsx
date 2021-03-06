import routes, { QUERY_PARAMS } from '@/config/routes'
import { useLocation, useNavigate } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import {
  FullLogo,
  Header,
  LogoLink,
  NavigationContainer,
  SearchbarContainer,
  ShortLogo,
  StyledSearchbar,
} from './TopNavbar.style'
import { RoutingState } from '@/types/routing'

const TopNavbar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as RoutingState
  const overlaidLocation = locationState?.overlaidLocation || location

  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    // close the searchbar on external navigation
    if (isFocused && !location.pathname.includes(routes.search())) {
      setSearchQuery('')
      setIsFocused(false)
    }

    // focus the searchbar when visiting search (e.g. from a link)
    if (!isFocused && location.pathname.includes(routes.search())) {
      setIsFocused(true)
      if (location.search) {
        const params = new URLSearchParams(location.search)
        const query = params.get(QUERY_PARAMS.SEARCH)
        setSearchQuery(query || '')
      }
    }
  }, [isFocused, location.pathname, location.search])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === 'NumpadEnter') && searchQuery.trim()) {
      const state: RoutingState = { overlaidLocation }

      // navigate to search results
      navigate(routes.search({ query: searchQuery.trim() }), { state })
    }
    if (e.key === 'Escape' || e.key === 'Esc') {
      handleCancel()
      e.currentTarget.blur()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFocused(true)
    setSearchQuery(e.currentTarget.value)
  }

  const handleFocus = () => {
    setIsFocused(true)

    // open the search overlay if not already visible
    if (!location.pathname.includes(routes.search())) {
      const state: RoutingState = { overlaidLocation }

      navigate(routes.search(), { state })
    }
  }

  const handleCancel = () => {
    setSearchQuery('')
    setIsFocused(false)

    // navigate to overlaid view or home on searchbar close
    const overlaidLocation = locationState?.overlaidLocation || { pathname: routes.index() }
    navigate(overlaidLocation)
  }
  return (
    <Header hasFocus={isFocused}>
      <NavigationContainer>
        <LogoLink to="/">
          <ShortLogo />
          <FullLogo />
        </LogoLink>
      </NavigationContainer>
      <SearchbarContainer>
        <StyledSearchbar
          placeholder="Search..."
          onChange={handleChange}
          value={searchQuery}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onCancel={handleCancel}
          showCancelButton={isFocused}
          controlled
        />
      </SearchbarContainer>
    </Header>
  )
}

export default TopNavbar
