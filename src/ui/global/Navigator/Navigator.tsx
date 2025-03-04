//* Import libraries
import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Breakpoint,
  useMediaQuery,
  Container,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import type { Theme as MuiTheme } from "@mui/material/styles";
import { useLocation } from "react-router";
import {
  NavigatorCore,
  DrawerPanel,
  DropdownMenu,
  DropdownButton,
  Link,
} from "@leanoncompany/supporti-react-ui";
import { CookieManager } from "@leanoncompany/supporti-utility";
import { INavigatorProps } from "../../../@types/ui/global/navigator";
import { SideBar } from "../../../layout";
import { Alarm } from "../Alarm";
import { MenuButton } from "../../local/input/MenuButton";
import { useRouter } from "next/router";

const Navigator = (props: INavigatorProps) => {
  //* Modules
  const router = useRouter();
  const navigatorCore = new NavigatorCore();
  const theme = useTheme() as MuiTheme & {
    breakpoints: {
      between: (start: string, end: string) => string;
      up: (point: string) => string;
    };
  };
  const cookieManager = new CookieManager();

  const menus = [
    {
      label: "회원",
      link: "",
      children: [
        {
          label: "관리자",
          link: "manager",
        },
        {
          label: "일반회원",
          link: "commonUser",
        },
      ],
    },
    {
      label: "약관",
      link: "auth/sign_in",
      children: [
        {
          label: "서비스",
          link: "term/marketing",
        },
        {
          label: "마케팅",
          link: "term/privacy",
        },
        {
          label: "개인정보",
          link: "term/service",
        },
      ],
    },

    {
      label: "게시판",
      link: "auth/sign_in",
      children: [
        { label: "이벤트", link: "board/event" },
        { label: "공지", link: "board/notice" },
        { label: "자주묻는질문", link: "board/faq" },
      ],
    },
    {
      label: "상품",
      link: "",
      children: [
        {
          label: "전체",
          link: "product",
        },
      ],
    },
    {
      label: "주문",
      link: "",
      children: [
        {
          label: "신규",
          link: "product",
        },
        {
          label: "전체",
          link: "product",
        },
        {
          label: "입금대기",
          link: "product",
        },
        {
          label: "결제완료",
          link: "product",
        },
        {
          label: "배송준비",
          link: "product",
        },
        {
          label: "배송중",
          link: "product",
        },
        {
          label: "취소요청",
          link: "product",
        },
        {
          label: "반품요청",
          link: "product",
        },
        {
          label: "환불싪패",
          link: "product",
        },
      ],
    },
    {
      label: "통계",
      link: "statistics",
    },
  ];

  function generateRandomNumber() {
    let result = "";
    const digits = "0123456789";
    for (let i = 0; i < 10; i++) {
      result += digits[Math.floor(Math.random() * 10)];
    }
    return result;
  }

  //* Constants
  const toolbarContents: { [key: string]: React.ReactElement } = {
    spacing: (
      <Box key={`${generateRandomNumber()}-spacing`} sx={{ flexGrow: 1 }} />
    ),
    drawer: (
      <DrawerPanel
        key={"drawer"}
        drawerRadius={0}
        direction={"left"}
        // openerElement={(openerCallback) => {
        // 	return (
        // 		<IconButton
        // 			color="inherit"
        // 			aria-label="open drawer"
        // 			edge="start"
        // 			onClick={openerCallback}
        // 		>
        // 			<MenuIcon />
        // 		</IconButton>
        // 	);
        // }}
      >
        <Box>
          <Box mb={1}>{props.sideBar}</Box>
          <Box>
            {props.menu.map((el, index) => (
              <Box key={index}>
                <MenuButton
                  icon={el.iconElement}
                  depth={0}
                  label={el.text}
                  isNotificated={false}
                  link={el.link}
                  currentPath={router.asPath}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </DrawerPanel>
    ),
    customDrawer: (
      <DrawerPanel key={"drawer"} drawerRadius={0} direction={"left"}>
        <Box>{props.customDrawerMenus}</Box>
      </DrawerPanel>
    ),
    logo: (
      <Box key={"logo"}>
        <Link isNext={true} to="/">
          <Box display="flex" alignItems={"center"}>
            {/* <img width={"80px"} src="/images/logo/qillie.svg" /> */}
            {/* <Box><img width={"52px"} src="/images/logo/only_head_logo.png" /></Box> */}
            {props.logoImage !== undefined ? (
              props.logoImage
            ) : (
              <Box>
                <img
                  style={{ width: "30px" }}
                  src={
                    props.logoPath !== undefined
                      ? props.logoPath
                      : "/images/logo/newLogo.png"
                  }
                />
              </Box>
            )}
          </Box>
        </Link>
      </Box>
    ),
    customMenu: (
      <Box key={"customMenu"} display={"flex"} alignItems={"center"}>
        {props.menu.map((el, index) => (
          <Box key={index} ml={index === 0 ? 0 : 1}>
            <MenuButton
              disableIconSpace={true}
              depth={0}
              label={el.text}
              isNotificated={false}
              link={el.link}
              currentPath={router.asPath}
            />
          </Box>
        ))}
      </Box>
    ),

    dropDownMenu: (
      <Box key={"dropDownMenu"} display={"flex"}>
        {props.dropDownMenus !== undefined && props.dropDownMenus}
      </Box>
    ),
    basicMenu: (
      <Box key={"basicMenu"}>
        {props.menu.map((el) => (
          <DropdownButton
            key={el.text}
            typographyProps={{
              variant: "caption",
            }}
            buttonProps={{
              variant: "text",
            }}
            buttonTypographyProps={{
              variant: "body2",
              color: "black",
            }}
            text={el.text}
            show={el.show}
            link={el.link}
            childLeafs={el.childLeafs}
          />
        ))}
      </Box>
    ),
    alarm: (
      <Box key={"alarm"}>
        {props.alarm !== undefined && (
          <Alarm
            {...props.alarm}
            modelName={process.env.NEXT_PUBLIC_AUTH_MODEL_NAME || "AdminMember"}
          />
        )}
      </Box>
    ),
    rightMenu: (
      <Box key={"rightMenu"} display={"flex"} alignItems={"center"}>
        {props.rightMenus !== undefined &&
          props.rightMenus.map((el, index) => (
            <Box mr={props.rightMenus!.length - 1 !== index ? 3 : 0}>{el}</Box>
          ))}
      </Box>
    ),
  };

  //* States
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>("xs");
  const toolbar: { [key: string]: React.ReactElement } =
    navigatorCore.setToolbarByOrder(props.order, toolbarContents);

  //* Media query hooks
  const isBetweenXsAndSm = useMediaQuery(theme.breakpoints.between("xs", "sm"));
  const isBetweenSmAndMd = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isBetweenMdAndLg = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const isBetweenLgAndXl = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isUpperXl = useMediaQuery(theme.breakpoints.up("xl"));

  //* Functions

  //* Life cycle
  React.useEffect(() => {
    const breakpointOrder = {
      xs: isBetweenXsAndSm,
      sm: isBetweenSmAndMd,
      md: isBetweenMdAndLg,
      lg: isBetweenLgAndXl,
      xl: isUpperXl,
    };

    for (const [breakpointKey, breakpointStatus] of Object.entries(
      breakpointOrder
    )) {
      if (breakpointStatus) {
        setBreakpoint(breakpointKey as Breakpoint);
        break;
      }
    }
  }, [
    isBetweenXsAndSm,
    isBetweenSmAndMd,
    isBetweenMdAndLg,
    isBetweenLgAndXl,
    isUpperXl,
  ]);

  const checkUseContainer = () => {
    if (props.useContainer !== true) {
      return (
        <Toolbar
          disableGutters={true}
          sx={{
            minHeight: "45pt !important;",
            justifyContent: "space-between !important;",
          }}
        >
          {navigatorCore.getToolbarByBreakpoint(breakpoint, toolbar)}
        </Toolbar>
      );
    } else if (props.useContainer === true) {
      return (
        <Container
          disableGutters={props.containerDisableGutters !== true ? false : true}
          sx={{
            maxWidth:
              props.containerMaxWidth !== undefined
                ? props.containerMaxWidth
                : undefined,
            px:
              props.containerPaddingX !== undefined
                ? { md: props.containerPaddingX, xs: 0 }
                : undefined,
          }}
        >
          <Toolbar
            disableGutters={true}
            sx={{
              minHeight: "45pt !important;",
              justifyContent: "space-between !important;",
            }}
          >
            {navigatorCore.getToolbarByBreakpoint(breakpoint, toolbar)}
          </Toolbar>
        </Container>
      );
    }
  };

  return (
    <Box
      display={props.disableHeader !== true ? "block" : "none"}
      mb={props.subMenu !== undefined ? "60pt" : "45pt"}
    >
      <AppBar
        position="fixed"
        sx={{
          backdropFilter: "blur(20px)",
          borderStyle: "solid",
          borderColor: "#f5f5f5",
          borderWidth: 0,
          borderBottomWidth: "thin",
          background: "rgba(255,255,255,0.7)",
          color: "#000",
          boxShadow: "inset 0px -1px 1px #f5f5f5",
        }}
      >
        {props.subMenu !== undefined && (
          <Container
            disableGutters={
              props.containerDisableGutters !== true ? false : true
            }
            sx={{
              maxWidth:
                props.containerMaxWidth !== undefined
                  ? props.containerMaxWidth
                  : undefined,
              px:
                props.containerPaddingX !== undefined
                  ? props.containerPaddingX
                  : undefined,
            }}
          >
            {props.subMenu}
          </Container>
        )}
        <Box
          px={
            props.containerPaddingX !== undefined ? props.containerPaddingX : 3
          }
        >
          {checkUseContainer()}
        </Box>
      </AppBar>
    </Box>
  );
};

export default Navigator;
