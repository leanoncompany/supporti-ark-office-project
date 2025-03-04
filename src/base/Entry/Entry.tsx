import { ThemeProvider } from "@mui/material/styles";
import { Box, Container, useTheme } from "@mui/material";
import Head from "next/head";

// * Import modules
import { Footer } from "../../ui/global/Footer";
import { Navigator } from "../../ui/global/Navigator";
import { IEntryProps } from "../../@types/base/entry";
import React from "react";
import { CacheProvider } from "@emotion/react";
import { SideBar, SignIn } from "../../layout";
import { useRouter } from "next/router";
import useCheckLogin from "../../hooks/data/useCheckLogin";
import BreadCrumb from "../../ui/local/display/BreadCrumb";
import Memory from "../../utils/data/Memory";
import { CookieManager } from "@leanoncompany/supporti-utility";
import Grid2 from "@mui/material/Unstable_Grid2";

//* App
const Entry = (props: IEntryProps) => {
  const router = useRouter();
  const theme = useTheme();
  const cookieManager = new CookieManager();

  //* Constants
  props.memory.setData("menuSets", props.configs.sidebar.menuSets);

  //* States
  // const { isLogin } = useCheckLogin();
  const [mustRedirectToLoginPage, setMustRedirectToLoginPage] =
    React.useState<boolean>(false);
  const [isInitiated, setIsInitiated] = React.useState<boolean>(false);
  const [sideBar, setSideBar] = React.useState<React.ReactElement>(<></>);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    props.useAuthCheck === false ? true : false
  );
  const [isAuthNeededPage, setIsAuthNeededPage] = React.useState<boolean>(
    props.useAuthCheck === false ? true : false
  );

  //* Functions
  /**
   * 현재 페이지가 로그인이 필요한 페이지인지 확인하는 함수
   */
  const checkIsNoAuthRoute = (currentAsPath: string) => {
    const injectedNoAuthRoutes = props.noAuthRoutes || [];

    const noAuthRoutes = [...["/auth"], ...injectedNoAuthRoutes];

    let isNoAuthRoute = false;

    noAuthRoutes.forEach((noAuthRoute) => {
      if (noAuthRoute === "/") {
        if (currentAsPath === "/") {
          isNoAuthRoute = true;
        }
      } else {
        if (new RegExp(noAuthRoute, "gi").test(currentAsPath) === true) {
          isNoAuthRoute = true;
        }
      }
    });

    return isNoAuthRoute;
  };

  //* Hooks
  React.useEffect(() => {
    if (props.disableSideBar !== true) {
      setSideBar(<SideBar {...props.configs.sidebar} />);
    }
  }, []);

  /**
   * 현재 '로그인을 하는' 페이지인지 확인하는 훅
   */
  React.useEffect(() => {
    if (props.useAuthCheck !== false) {
      if (isAuthNeededPage === true) {
        setMustRedirectToLoginPage(!isAuthenticated);
      } else {
        setMustRedirectToLoginPage(false);
      }
    }
  }, [isAuthNeededPage, isAuthenticated]);

  /**
   * 로그인 여부를 확인하는 훅
   */
  React.useEffect(() => {
    if (props.useAuthCheck !== false) {
      setIsAuthenticated(
        cookieManager.getItemInCookies("ACCESS_TOKEN") !== undefined
      );
    }
  }, [router.asPath]);

  /**
   * 로그인이 필요한 페이지인지 확인하는 훅
   */
  React.useEffect(() => {
    if (props.useAuthCheck !== false) {
      setIsAuthNeededPage(!checkIsNoAuthRoute(router.asPath));
    }
  }, [router.asPath]);

  React.useEffect(() => {
    if (props.useAuthCheck !== false) {
      if (isInitiated === true) {
        setInterval(() => {
          const banCallback = () => {
            cookieManager.removeItemInCookies("ACCESS_TOKEN");

            const currentLocation = window.location.href;

            if (checkIsNoAuthRoute(currentLocation) == false) {
              // alert('로그인이 만료되었습니다.');
              // router.push('/auth/sign_in');
              setIsAuthNeededPage(true);
            }
          };

          let executeBanCallback =
            cookieManager.getItemInCookies("ACCESS_TOKEN") === undefined;

          if (executeBanCallback === false) {
            if (props.loginCheckCallback !== undefined) {
              props.loginCheckCallback(
                {},
                (res) => {},
                (err) => {
                  banCallback();
                }
              );
            }
          } else {
            banCallback();
          }
        }, 30000);
      }
    }
  }, [isInitiated]);

  React.useEffect(() => {
    setIsInitiated(true);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <script
          type="text/javascript"
          src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2-nopolyfill.js"
          charSet="utf-8"
        ></script>
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.1.0/kakao.min.js"
          integrity="sha384-dpu02ieKC6NUeKFoGMOKz6102CLEWi9+5RQjWSV0ikYSFFd8M3Wp2reIcquJOemx"
          crossOrigin="anonymous"
        ></script>
        <script
          type="text/javascript"
          src="https://code.jquery.com/jquery-1.12.4.min.js"
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"
        ></script>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, maximum-scale=1, initial-scale=1, width=device-width, user-scalable=0"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="content-language" content={"ko-KR"} />
        <meta name="application-name" content="퀼리" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="퀼리" />

        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href={`/images/favicon/apple-icon-57x57.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href={`/images/favicon/apple-icon-72x72.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`/images/favicon/apple-icon-76x76.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href={`/images/favicon/apple-icon-114x114.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href={`/images/favicon/apple-icon-120x120.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href={`/images/favicon/apple-icon-144x144.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href={`/images/favicon/apple-icon-152x152.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`/images/favicon/apple-icon-180x180.png`}
        />
        {/* <link
					rel="icon"
					sizes="32x32"
					href={`/images/favicon/favicon.ico`}
				/>
				<link
					rel="icon"
					sizes="16x16"
					href={`/images/favicon/favicon.ico`}
				/> */}
        <link rel="shortcut icon" href={"/images/favicon/favicon.ico"} />
        <link rel="icon" href="/favicon.ico" />
        {/* <meta
          name="description"
          content={"스타트업 전문 웹 및 앱 개발대행사 퀼리"}
        /> */}
        <title>{props.configs.head.title}</title>

        {props.headerTags !== undefined &&
          props.headerTags.map((tag, index) => tag)}
      </Head>

      <CacheProvider value={props.cache.emotion}>
        <ThemeProvider theme={props.cache.theme}>
          {/* Header navigator */}
          {props.customHeader !== undefined ? (
            props.customHeader
          ) : (
            <Navigator {...props.configs.header} sideBar={sideBar} />
          )}

          <Box height={"auto"} minHeight={"100%"}>
            <Grid2 container>
              <Grid2
                item
                display={{
                  xs: "none",
                  md:
                    mustRedirectToLoginPage || props.disableSideBar === true
                      ? "none"
                      : "block",
                }}
                xs={0}
                md={mustRedirectToLoginPage ? 0 : 3.25}
                lg={mustRedirectToLoginPage ? 0 : 2.5}
                xl={mustRedirectToLoginPage ? 0 : 2.25}
              >
                <Box borderRight={`1px solid #f5f5f5`}>{sideBar}</Box>
              </Grid2>

              <Grid2
                item
                xs={12}
                md={
                  mustRedirectToLoginPage || props.disableSideBar === true
                    ? 12
                    : isAuthNeededPage
                    ? 8.75
                    : 12
                }
                lg={
                  mustRedirectToLoginPage || props.disableSideBar === true
                    ? 12
                    : isAuthNeededPage
                    ? 9.5
                    : 12
                }
                xl={
                  mustRedirectToLoginPage || props.disableSideBar === true
                    ? 12
                    : isAuthNeededPage
                    ? 9.75
                    : 12
                }
              >
                {/* Page components */}
                <Container
                  disableGutters={props.disableGutturs !== true ? false : true}
                  sx={{
                    maxWidth:
                      props.containerMaxWidth !== undefined
                        ? props.containerMaxWidth
                        : undefined,
                    height: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    pt={props.disableGutturs !== undefined ? 0 : 3}
                    px={{
                      // xs: 0.5,
                      md:
                        props.containerPaddingX !== undefined
                          ? props.containerPaddingX
                          : 2,
                    }}
                  >
                    {/* Bread crumbs */}
                    {props.disableBreadCrumb !== true && (
                      <Box
                        mb={
                          mustRedirectToLoginPage || !isAuthNeededPage ? 0 : 1.5
                        }
                        display={
                          mustRedirectToLoginPage || !isAuthNeededPage
                            ? "none"
                            : "block"
                        }
                      >
                        <BreadCrumb memory={props.memory} />
                      </Box>
                    )}

                    {/* Content */}
                    <Box key={router.asPath}>
                      {mustRedirectToLoginPage ? (
                        <SignIn
                          tokenExpireHours={
                            props.configs.signIn?.tokenExpireHours || 24
                          }
                          signInSuccessLink={
                            props.configs.signIn?.signInSuccessLink
                          }
                          useAutoLogin={false}
                          saveUserName={false}
                          signUp={
                            props.disableSignUp !== true
                              ? {
                                  link: "/auth/sign_up",
                                  label: "회원가입",
                                }
                              : undefined
                          }
                          findInfo={{
                            link: "/auth/find_account",
                            label: "아이디/비밀번호 찾기",
                          }}
                          {...props.configs.signIn}
                        />
                      ) : (
                        <props.Component {...props.pageProps} />
                      )}
                    </Box>
                  </Box>
                </Container>
              </Grid2>
            </Grid2>
          </Box>

          {/* Footer components */}
          <Box display={props.configs.useFooter === true ? "block" : "none"}>
            {props.anotherFooter !== undefined ? (
              props.anotherFooter
            ) : (
              <Footer {...props.configs.footer} />
            )}
          </Box>
        </ThemeProvider>
      </CacheProvider>
    </React.Fragment>
  );
};
export default Entry;
