/* eslint-disable react/no-multi-comp */
import React from "react";
import PaginationItem from "@mui/material/PaginationItem";
import { alpha, IconButton } from "@mui/material";
import { ReactComponent as ArrowDown } from "../assets/arrow_down.svg";
import { ReactComponent as RawPrevious } from "../assets/previous.svg";
import { ReactComponent as RawNext } from "../assets/next.svg";
import { typography } from "./typography";

const BORDER_RADIUS = "12px";

/** Arrow icon for the select component */
function ArrowDownComponent(iconProps, theme) {
  return (
    <IconButton
      {...iconProps}
      disableRipple={true}
      sx={{
        "&.MuiSelect-iconOpen": {
          p: "0px 0px 0px 8px",
        },
        p: "0px 8px 0px 0px",
        "&:hover": {
          backgroundColor: theme.palette.background.secondary,
        },
      }}
    >
      <ArrowDown
        stroke={
          iconProps.className.includes("Mui-disabled")
            ? alpha("#6F767E", 0.3)
            : "#6F767E"
        }
      />
    </IconButton>
  );
}

/** Next icon for the pagination component */
function Next(iconProps, theme) {
  const [hover, setHover] = React.useState(false);
  const handleHoverOn = () => setHover(true);
  const handleHoverOff = () => setHover(false);

  return (
    <RawNext
      {...iconProps}
      stroke={hover ? theme.palette.text.main : theme.palette.text.secondary}
      onMouseEnter={handleHoverOn}
      onMouseLeave={handleHoverOff}
    />
  );
}

/** Previous icon for the pagination component */
function Previous(iconProps, theme) {
  const [hover, setHover] = React.useState(false);
  const handleHoverOn = () => setHover(true);
  const handleHoverOff = () => setHover(false);

  return (
    <RawPrevious
      {...iconProps}
      stroke={hover ? theme.palette.text.main : theme.palette.text.secondary}
      onMouseEnter={handleHoverOn}
      onMouseLeave={handleHoverOff}
    />
  );
}

export default function getThemedComponents(theme) {
  return {
    components: {
      MuiCssBaseline: {
        styleOverrides: () => ({
          body: {
            overflow: "hidden",
            [theme.breakpoints.down("sm")]: {
              overflowY: "scroll",
              overflowX: "hidden",
            },
          },
        }),
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiPagination: {
        defaultProps: {
          shape: "rounded",
          siblingCount: 0,
          boundaryCount: 1,
          renderItem: (item) => (
            <PaginationItem
              components={{
                previous: (props) => Previous(props, theme),
                next: (props) => Next(props, theme),
              }}
              {...item}
            />
          ),
        },
        styleOverrides: {
          root: {
            height: "40px",
            "& .MuiPagination-ul": {
              display: "flex",
              alignItems: "center",
              gap: "21px",
            },
            "& .MuiPaginationItem-root": {
              "&:hover": {
                backgroundColor: theme.palette.background.default,
              },
              margin: "0px",
              padding: "8px",
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            },
            "& .MuiPaginationItem-ellipsis": {
              minWidth: "24px",
              width: "24px",
            },
            "& .MuiPaginationItem-page": {
              borderRadius: "6px",
              minWidth: "24px",
              height: "24px",
              fontFamily: typography.fontFamily,
              fontStyle: typography.fontStyle,
              ...typography.body1Semibold,
              color: theme.palette.text.secondary,
              "&:hover": {
                color: theme.palette.text.main,
              },
            },
            "& .Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.text.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
            },
            "& .MuiPaginationItem-previousNext": {
              minWidth: "24px",
              width: "40px",
              height: "40px",
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            width: "100%",
            color: theme.palette.text.main,
            textDecoration: "none",
          },
        },
      },
      MuiAlert: {
        defaultProps: {
          icon: false,
        },
        styleOverrides: {
          root: {
            backgroundColor: theme.palette.error.light,
            "& .MuiSvgIcon-root": {
              color: theme.palette.error.main,
            },
          },
          action: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0px",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            borderRadius: BORDER_RADIUS,
            p: "12px 20px 12px 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex",
            ...typography.button1,
            height: "48px",
            color: theme.palette.text.main,
            "&.Mui-disabled": {
              color: theme.palette.text.disabled,
              backgroundColor: theme.palette.background.secondary,
              border: `1px solid ${theme.palette.borders.main}`,
            },
          },
          outlined: {
            border: `1px solid ${theme.palette.borders.main}`,
            "&:hover": {
              backgroundColor: theme.palette.background.default,
              border: `1px solid ${theme.palette.borders.main}`,
            },
          },
        },
      },
      MuiSelect: {
        defaultProps: {
          inputProps: {
            sx: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "12px",
              borderRadius: BORDER_RADIUS,
              gap: "12px",
              "&:focus": {
                borderRadius: BORDER_RADIUS,
                background: theme.palette.inputFields.main,
              },
              fontFamily: typography.fontFamily,
              fontStyle: typography.fontStyle,
              textTransform: typography.textTransform,
              ...typography.base1Semibold,
            },
          },
          MenuProps: {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            PaperProps: {
              sx: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                p: "12px 0px 12px 0px",
                borderRadius: BORDER_RADIUS,
                mt: "10px",
                backgroundImage: "none",
                backgroundColor: theme.palette.inputFields.main,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
            },
            MenuListProps: {
              sx: {
                width: "100%",
                maxHeight: "350px",
              },
            },
            sx: {
              ".MuiMenuItem-root": {
                ...typography.base1Semibold,
                height: "48px",
              },
            },
          },
          IconComponent: (props) => ArrowDownComponent(props, theme),
        },
        styleOverrides: {
          filled: {
            borderRadius: BORDER_RADIUS,
            border: "none",
          },
        },
      },
      MuiNativeSelect: {
        defaultProps: {
          disableUnderline: true,
          inputProps: {
            sx: {
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "12px",
              borderRadius: BORDER_RADIUS,
              gap: "12px",
              background: theme.palette.inputFields.main,
              "&:focus": {
                borderRadius: BORDER_RADIUS,
                background: theme.palette.inputFields.main,
              },
              fontFamily: typography.fontFamily,
              fontStyle: typography.fontStyle,
              textTransform: typography.textTransform,
              ...typography.base1Semibold,
            },
          },
          IconComponent: (props) => ArrowDownComponent(props, theme),
        },
        styleOverrides: {
          filled: {
            borderRadius: BORDER_RADIUS,
            border: "none",
          },
        },
      },
      MuiToggleButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            borderRadius: "4px",
            border: 0,
            "&.Mui-selected": {
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
              },
              color: theme.palette.text.main,
            },
            "&.Mui-disabled": {
              border: 0,
              color: theme.palette.text.disabledToggleButton,
              "&.Mui-selected": {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
              },
            },
            ...typography.base2,
            color: theme.palette.text.toggleButton,
          },
          sizeSmall: {
            height: "32px",
            width: "32px",
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: theme.palette.borders.checkbox,
            "&.Mui-checked": {
              color: theme.palette.primary.main,
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: theme.palette.text.secondary,
            "&.Mui-checked": {
              color: theme.palette.secondary.main,
            },
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            padding: "12px 20px",
            width: "max-content",
            background: "transparent",
            ...typography.button1,
            borderRadius: "10px",
            marginRight: "24px",
            transition: "0.2s",
            "&:hover": {
              background: theme.palette.tab.backgroundHover,
            },
            "&.Mui-selected": {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.tab.activeText,
              "&:hover": {
                background: theme.palette.secondary.main,
              },
            },
          },
        },
      },
      MuiFilledInput: {
        defaultProps: {
          disableUnderline: true,
          inputProps: {
            sx: {
              ...typography.base1Semibold,
              p: "12px",
              lineHeight: "24px",
            },
          },
        },
        styleOverrides: {
          root: {
            borderRadius: BORDER_RADIUS,
            "& input:-webkit-autofill": {
              WebkitBoxShadow: `0 0 0 1000px ${theme.palette.inputFields.main} inset`,
              transition: "background-color 600000s 0s, color 600000s 0s",
              borderBottomLeftRadius: BORDER_RADIUS,
              borderBottomRightRadius: BORDER_RADIUS,
            },
            "&.Mui-error": {
              border: `2px solid ${theme.palette.error.main}`,
            },
            backgroundColor: theme.palette.inputFields.main,
            "&:hover": {
              backgroundColor: theme.palette.inputFields.main,
            },
            "&.Mui-disabled": {
              backgroundColor: theme.palette.inputFields.main,
            },
            "&.Mui-focused": {
              backgroundColor: theme.palette.inputFields.main,
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            display: "flex",
            alignItems: "center",
            padding: 0,
          },
          switchBase: {
            left: "-6px",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "&.Mui-checked": {
              left: "-4px",
              "&:hover": {
                backgroundColor: "transparent",
              },
              "& + .MuiSwitch-track": {
                backgroundColor: theme.palette.primary.main,
                opacity: 1,
              },
            },
          },
          thumb: {
            color: theme.palette.card.main,
          },
          track: {
            height: "24px",
            width: "48px",
            borderRadius: "12px",
            opacity: 1,
            backgroundColor: theme.palette.background.default,
          },
        },
      },
    },
  };
}
