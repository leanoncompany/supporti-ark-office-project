import { ArrowDropUpRounded, ArrowDropDownRounded } from "@mui/icons-material";
import { Box, ListItemButton, Typography, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import DataUtil from "../../../../utils/data/DataUtil";
import { useRouter } from "next/router";
import CircleIcon from "@mui/icons-material/Circle";

interface IMenuButtonProps {
  label: string;
  depth: number;
  isNotificated: boolean;
  isOpen?: boolean;
  icon?: React.ReactElement;
  link: string;
  disableIconSpace?: boolean;
  currentPath: string;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setDrawerOpened?: React.Dispatch<React.SetStateAction<boolean>>;
  menuId?: string;
  openedRootMenuId?: string;
  setOpenedRootMenuId?: React.Dispatch<React.SetStateAction<string>>;
}

const MenuButton = (props: IMenuButtonProps) => {
  //* States
  const [showNotificatedSign, setShowNotificatedSign] =
    React.useState<boolean>(true);
  const [isActivated, setIsActivated] = React.useState<boolean>(false);

  //* Modules
  const dataUtil = new DataUtil();
  const router = useRouter();
  const theme = useTheme();

  //* Functions
  /**
   * 확장 아이콘(ExpandLess / ExpandMore) 랜더링 함수
   */
  const renderIsExpandIcon = () => {
    let icon: React.ReactElement =
      props.disableIconSpace === true ? (
        <Box></Box>
      ) : (
        <Box width={"24px"} height={"24px"}></Box>
      );

    if (props.isOpen !== undefined) {
      if (props.depth == 0) {
        if (
          props.setOpenedRootMenuId !== undefined &&
          props.menuId !== undefined
        ) {
          if (props.openedRootMenuId === props.menuId) {
            icon = <ArrowDropUpRounded />;
          } else {
            icon = <ArrowDropDownRounded />;
          }
        }
      } else {
        props.isOpen
          ? (icon = <ArrowDropUpRounded />)
          : (icon = <ArrowDropDownRounded />);
      }
    }

    return icon;
  };

  //* Hooks
  /**
   * 활성화 여부 결정 훅
   */
  useEffect(() => {
    const normalizedPropsLink = dataUtil.normalizePath(props.link);
    const normalizedCurrentPath = dataUtil.normalizePath(props.currentPath);

    if (normalizedPropsLink == normalizedCurrentPath) {
      setIsActivated(true);
    } else {
      if (/\?/.test(normalizedCurrentPath)) {
        if (props.label == "전체") {
          setIsActivated(normalizedPropsLink == normalizedCurrentPath);
        } else {
          setIsActivated(normalizedCurrentPath.includes(normalizedPropsLink));
        }
      } else {
        const currentPathArray = props.currentPath.split("/");
        const menuLinkPathArray = props.link.split("/");

        let identicalWithPath = true;

        menuLinkPathArray.map((menuLinkPath, depth) => {
          if (menuLinkPath != currentPathArray[depth]) {
            identicalWithPath = false;
          }
        });

        setIsActivated(identicalWithPath);
      }
    }
  }, [props.currentPath]);

  /**
   * 알림 노출 여부 결정 훅
   */
  useEffect(() => {
    if (props.depth == 0) {
      if (
        props.setOpenedRootMenuId !== undefined &&
        props.menuId !== undefined
      ) {
        if (props.openedRootMenuId === props.menuId) {
          setShowNotificatedSign(false);
        } else {
          setShowNotificatedSign(props.isNotificated);
        }
      } else {
        setShowNotificatedSign(props.isNotificated);
      }
    } else {
      if (props.isOpen !== undefined) {
        if (props.isOpen) {
          setShowNotificatedSign(false);
        } else {
          setShowNotificatedSign(props.isNotificated);
        }
      } else {
        setShowNotificatedSign(props.isNotificated);
      }
    }
  }, [props.isOpen, props.isNotificated, props.openedRootMenuId]);

  return (
    <ListItemButton
      sx={{
        minHeight: "40px",
        p: 1,
        borderRadius: 1,
        my: 0.25,
        justifyContent: "space-between",
        backgroundColor:
          isActivated && props.isOpen === undefined ? "#f4f4ff" : "none",
      }}
      onClick={() => {
        /**
         * Control toggle open status when button is root
         */
        if (props.depth == 0) {
          if (props.setIsOpen !== undefined) {
            if (
              props.setOpenedRootMenuId !== undefined &&
              props.menuId !== undefined
            ) {
              if (props.openedRootMenuId === props.menuId) {
                props.setOpenedRootMenuId("-1");
              } else {
                props.setOpenedRootMenuId(props.menuId);
              }
            }
          } else {
            router.push(props.link);
          }
        } else {
          if (props.setIsOpen !== undefined) {
            props.setIsOpen(!props.isOpen);
          } else {
            router.push(props.link);
          }
        }

        if (props.setDrawerOpened !== undefined) {
          props.setDrawerOpened(false);
        }
      }}
    >
      {/* Icon section */}
      <Box>
        <Box display={"flex"} alignItems={"center"}>
          {/* Expand icon section */}
          <Box display={"flex"} alignItems={"center"}>
            {React.cloneElement(renderIsExpandIcon(), {
              style: {
                mr: 1,
                fontSize: "x-large",
                color: isActivated
                  ? theme.palette.primary.main
                  : theme.palette.grey["600"],
              },
            })}
          </Box>

          {props.icon !== undefined && (
            <Box pr={1} display={"flex"} alignItems={"center"}>
              {React.cloneElement(props.icon, {
                style: {
                  fontSize: "medium",
                  color: isActivated
                    ? theme.palette.primary.main
                    : theme.palette.grey["600"],
                },
              })}
            </Box>
          )}

          {/* Label section */}
          <Typography
            variant={"body1"}
            sx={{
              fontWeight: isActivated ? "500" : "400",
            }}
            color={
              isActivated
                ? theme.palette.primary.main
                : theme.palette.grey["A200"]
            }
          >
            {props.label}
          </Typography>
        </Box>
      </Box>

      {/* Notification section */}
      <Box pb={1.5}>
        <CircleIcon
          style={{
            color: theme.palette.primary.dark,
            fontSize: "xx-small",
            display: showNotificatedSign ? "block" : "none",
          }}
        />
      </Box>
    </ListItemButton>
  );
};

export default MenuButton;
