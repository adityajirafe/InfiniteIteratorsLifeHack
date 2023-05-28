import { createTheme } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import getThemedComponents from 'style-overrides/components';
import { typography } from 'style-overrides/typography';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#219EBC',
      dark: '#1E90AB',
      contrastText: '#FCFCFC'
    },
    secondary: {
      main: '#001A77',
      light: '#E6E8F1'
    },
    card: {
      main: '#272B30',
      dark: '#33383F'
    },
    tab: {
      activeText: '#FCFCFC',
      inActiveText: '#6F767E',
      backgroundHover: 'rgb(17, 19, 21)'
    },
    error: {
      main: '#E96666',
      light: '#FCE8E8'
    },
    warning: {
      main: '#66532e',
      light: '#ffe5b5  '
    },
    background: {
      default: '#111315',
      secondary: '#1A1D1F',
      tabs: '#272B30',
      pilotButton: '#000000',
      joystickKnob: 'radial-gradient(114.06% 114.06% at 50% 100%, #b8b8b8 0%, #ffffff 64.54%, #ffffff 100%)',
      widget: '#14181a',
      activeChip: 'rgba(142, 202, 230, 0.4)',
      inActiveChip: 'rgba(163, 163, 163, 0.4)',
      infoChip: 'rgba(142, 202, 230, 0.4)',
      warningChip: 'rgba(255, 222, 139, 0.4)',
      successChip: 'rgba(152, 226, 177, 0.4)',
      errorChip: 'rgba(217, 3, 104, 0.4)',
      onMissionChip: 'rgba(148, 75, 187, 0.4)',
      unverifiedChip: 'rgba(255, 183, 3, 0.4)'
    },
    inputFields: {
      main: '#111315'
    },
    borders: {
      main: '#272B30',
      activeChip: '#8ECAE6', // also used for robot info card title
      pilotButton: '#272B30',
      inActiveChip: '#afafaf',
      infoChip: '#8ECAE6',
      warningChip: '#FDC78A',
      successChip: '#98E2B1',
      errorChip: '#D90368',
      onMissionChip: '#975ebc',
      checkbox: 'rgba(111, 118, 126, 0.4)',
      unverifiedChip: '#FFB703'
    },
    text: {
      main: '#FCFCFC',
      secondary: '#6F767E',
      disabled: '#33383F',
      tabs: '#FCFCFC',
      toggleButton: '#EFEFEF',
      disabledToggleButton: '#808080',
      tooltipText1: '#FFFFFF', // only used for users icon tool tip
      tooltipText2: '#9A9FA5', // used for users icon tool tip and also time in robot info card
      tableStatus: '#20BF55',
      monospace: '#8ECAE6'
    },
    robotOpsIcons: {
      statusGreen: '#20BF55',
      statusRed: '#DE1A1A',
      statusNeutral: '#6F767E',
      statusGray: '#9A9FA5',
      statusYellow: '#FFB703'
    }
  },
  typography
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#219EBC',
      dark: '#1E90AB',
      contrastText: '#1A1D1F'
    },
    secondary: {
      main: '#001A77',
      light: '#E6E8F1'
    },
    card: {
      main: '#FCFCFC',
      dark: '#FCFCFC'
    },
    tab: {
      activeText: '#FCFCFC',
      inActiveText: '#6F767E',
      backgroundHover: '#EFEFEF'
    },
    error: {
      main: '#E96666',
      light: '#FCE8E8'
    },
    warning: {
      main: '#66532e',
      light: '#ffe5b5  '
    },
    background: {
      default: '#EBEBEB',
      secondary: '#F4F4F4',
      tabs: '#272B30',
      pilotButton: '#ffffff',
      joystickKnob: 'radial-gradient(114.06% 114.06% at 50% 100%, #040405 0%, #484848 64.54%, #9e9e9e 100%)',
      widget: '#fafafa',
      activeChip: 'rgba(142, 202, 230, 0.4)',
      inActiveChip: 'rgba(163, 163, 163, 0.4)',
      infoChip: 'rgba(142, 202, 230, 0.4)',
      warningChip: 'rgba(255, 222, 139, 0.4)',
      successChip: 'rgba(152, 226, 177, 0.4)',
      errorChip: 'rgba(217, 3, 104, 0.4)',
      onMissionChip: 'rgba(148, 75, 187, 0.4)'
    },
    inputFields: {
      main: '#EFEFEF'
    },
    borders: {
      main: '#EBEBEB',
      activeChip: '#219EBC', // also used for robot info card title
      pilotButton: '#c9c9c9',
      inActiveChip: '#afafaf',
      infoChip: '#8ECAE6',
      warningChip: '#FDC78A',
      successChip: '#98E2B1',
      errorChip: '#D90368',
      onMissionChip: '#975ebc',
      checkbox: '#EFEFEF'
    },
    text: {
      main: '#1A1D1F',
      secondary: '#6F767E',
      disabled: '#9A9FA5',
      tabs: '#FCFCFC',
      toggleButton: '#EFEFEF',
      disabledToggleButton: '#808080',
      tooltipText1: '#FFFFFF', // only used for users icon tool tip
      tooltipText2: '#9A9FA5', // used for users icon tool tip and also time in robot info card
      tableStatus: '#20BF55',
      monospace: '#8ECAE6'
    },
    OpsIcons: {
      statusGreen: '#20BF55',
      statusRed: '#DE1A1A',
      statusNeutral: '#6F767E',
      statusGray: '#9A9FA5',
      statusYellow: '#FFB703'
    }
  },
  typography
});

const theme = {
  dark: deepmerge(darkTheme, getThemedComponents(darkTheme)),
  light: deepmerge(lightTheme, getThemedComponents(lightTheme))
};

export default theme;
