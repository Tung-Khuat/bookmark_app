import React, { useState } from 'react';
import styled from 'styled-components';
import { Menu, MenuItem } from '@mui/material'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { defaultThemes } from './defaultThemes'
import * as appActions from '../state/appState/appActions'
import DarkModeSwitch from './DarkModeSwitch'

const PanelWrapper = styled.div`
    margin-block: 8px;
    position: relative;
    display: flex;
    justify-content: space-between;
    place-items: center;
`
const ColorPaletteContainer = styled.div`
    display: flex;
    cursor: pointer;
    margin-block: 8px;
    div {
        width: 16px;
        height: 30px;
        &:first-child {
            border-radius: 3px 0 0 3px;
        }
        &:last-child {
            border-radius: 0 3px 3px 0;
        }
    }
`
const PanelButtonContainer = styled.div`
    position: relative;
    width: 40px;
    height: 40px;
`
const PanelButton = styled.div`
`

function ThemeControlPanel({ storedTheme, darkMode, _setAppTheme, _toggleDarkMode }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleOnPanelClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
	}

    const renderPanelButton = () => {
        return defaultThemes.map((theme, index) =>
			<MenuItem 
				key={index}
				onClick={()=>{_setAppTheme(theme); handleClose()}}
			>
                { renderColorPalette(theme.themeColors?.paletteArray) }
			</MenuItem>  
        )
    }

    const renderColorPalette = (paletteArray) => {
        return (
            <ColorPaletteContainer>
                { 
                    paletteArray?.map((color, index) => (
                        <div key={index} style={{ backgroundColor: color }} />
                    )) 
                }
            </ColorPaletteContainer>
        )
    }
    
    return(
        <>
            <PanelWrapper>
                <PanelButton>
                    {storedTheme.name}
                    <div onClick={handleOnPanelClick} >
                        { renderColorPalette(storedTheme.themeColors?.paletteArray) }		
                    </div>		
                </PanelButton>
                <div>
                    <DarkModeSwitch
                        checked={darkMode}
                        value={darkMode}
                        onClick={_toggleDarkMode}
                    />
                </div>
            </PanelWrapper>
            <Menu
                id="theme-control-panel"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {renderPanelButton()}
            </Menu>
        </>
    )
}

const mapState = ({
	auth: { persistedLoginUser }, app: { theme, darkMode }
}) => ({ 
	persistedLoginUser,
    storedTheme: theme,
    darkMode,
})

const mapDispatchToProps = (dispatch) => ({
	_setAppTheme: bindActionCreators(appActions.setAppTheme, dispatch),
	_toggleDarkMode: bindActionCreators(appActions.toggleDarkMode, dispatch),
})

export default compose(
	connect(mapState, mapDispatchToProps)
)(ThemeControlPanel)