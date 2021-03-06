import React from 'react'
import { SerializedStyles } from '@emotion/core'
import { Hamburger, HamburgerInner, HamburgerBox } from './HamburgerButton.style'

type HamburgerButtonProps = {
  active: boolean
  onClick: (e: React.MouseEvent<HTMLElement>) => void
  outerStyles?: SerializedStyles
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ active, onClick }) => {
  return (
    <Hamburger onClick={onClick} aria-label="Main menu" aria-expanded={active}>
      <HamburgerBox>
        <HamburgerInner active={active} />
      </HamburgerBox>
    </Hamburger>
  )
}

export default HamburgerButton
