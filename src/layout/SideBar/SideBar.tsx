import { Box, Button, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import RecursiveDropdownMenu from './components/RecursiveDropdownMenu';
import { IMenu, IMenuSet, ISideBar } from '../../@types/layout/sideBar/sideBar';
import { Alarm } from '../../ui/global/Alarm';

// import { useNotification } from '../../hooks/data/useNotification';
import useCategory from '../../hooks/ecommerce/useCategory';
import useCheckLogin from '../../hooks/data/useCheckLogin';

import Profile from '../Profile';
import LogoutButton from '../../ui/local/utils/LogoutButton/LogoutButton';
import DataUtil from '../../utils/data/DataUtil';
import { CookieManager } from '@leanoncompany/supporti-utility';

// type Props = {};

const SideBar = (props: ISideBar) => {
  //* Modules
  const cookieManager = new CookieManager();
  const dataUtil = new DataUtil();
  const router = useRouter();
  const theme = useTheme();

  //* Refs
  const ref = React.useRef<HTMLDivElement>(null);

  //* Constants
  const colorCombination: string[] = ['#6b6db1', '#f8738a', '#ffc85b', '#b9cfe7', '#b5d8cc', '#e0aaf3'];

  //* States
  const { isLogin } = useCheckLogin();
  const { categoryTree } = useCategory(true, props.disableCategory);
  const [openedRootMenuId, setOpenedRootMenuId] = useState<string>('-1');
  const [menuSets, setMenuSets] = useState<IMenuSet[]>([]);
  const [profileWidth, setProfileWidth] = useState<number>();

  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);

  //* Hooks
  /**
   * 인자로 들어온 메뉴 세트 저장 훅
   */
  useEffect(() => {
    if (props.menuSets !== undefined) {
      setMenuSets([...props.menuSets]);
    }
  }, [props.menuSets]);

  const getElement = (index: number) => {
    let element = document.getElementById(`plugin-${index}`);

    if (element !== null) {
      element.click();
    }
  };

  React.useEffect(() => {
    const accessToken = cookieManager.getItemInCookies('ACCESS_TOKEN');
    if (accessToken !== undefined) {
      // router.push('/');
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [router.asPath]);
  /**
   * 카테고리 트리 메뉴 세트에 추가 훅
   */
  useEffect(() => {
    if (categoryTree.length > 0) {
      let clonedList = [...menuSets];

      //* Convert category tree to menu set format
      let convertedCategoryTree: any = [];

      categoryTree.map((element: any) => {
        convertedCategoryTree.push({
          label: element.category.NAME,
          link: `./?PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE=${element.category.PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE}`,
          children: element.children.map((child: any) => {
            return {
              label: child.NAME,
              link: `&PRODUCT_SUB_CATEGORY_IDENTIFICATION_CODE=${child.PRODUCT_SUB_CATEGORY_IDENTIFICATION_CODE}`,
              children: [],
            };
          }),
        });
      });

      //* Find '상품' menu set
      clonedList.map((element) => {
        element.menus.map((menu) => {
          if (menu.label === '상품') {
            if (menu.children !== undefined) {
              menu.children = [menu.children[0], ...convertedCategoryTree];
            }
          }
        });
      });

      setMenuSets(clonedList);
    }
  }, [categoryTree]);

  useEffect(() => {
    if (ref.current !== null) {
      setProfileWidth(ref.current.offsetWidth);
    }
  }, []);

  return (
    <Box px={3} py={2} width={'100%'} position={'relative'} ref={ref}>
      <Box
        py={1}
        pt={1}
        pb={2.5}
        mb={3}
        display={isAuthenticated ? 'block' : 'none'}
        borderBottom={`1px solid ${theme.palette.grey[400]}`}>
        <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
          <Box>
            <Profile width={profileWidth !== undefined ? profileWidth : 250} {...props.profileProps} />

            {/* Profile plugins */}
            <Box>
              {props.profilePlugins !== undefined &&
                props.profilePlugins.map((element: any, index: number) => (
                  <Box key={index} mb={0.25}>
                    {element}
                  </Box>
                ))}
            </Box>
          </Box>

          <Box display={'flex'} alignItems={'center'}>
            <Box>
              <LogoutButton />
            </Box>

            <Box display={{ xs: 'none', md: 'block' }}>
              {props.disableAlarm !== true && (
                <Alarm {...props.alarm} modelName={process.env.NEXT_PUBLIC_AUTH_MODEL_NAME || 'AdminMember'} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box my={1} display={isAuthenticated ? 'flex' : 'none'} flexDirection={'column'} justifyContent={'space-between'}>
        {props.plugin !== undefined &&
          props.plugin.map((element: any, index: number) => (
            <Box key={index} display={isAuthenticated ? 'flex' : 'none'}>
              <Button
                key={index}
                fullWidth
                sx={{
                  py: 1,
                  px: 1,
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
                onClick={() => {
                  getElement(index);
                }}>
                <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'start'}>
                  <Box
                    width={'24px'}
                    mr={1}
                    height={'24px'}
                    borderRadius={'5px'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    sx={{
                      backgroundColor: colorCombination[index],
                    }}>
                    {React.cloneElement(element.icon, {
                      style: {
                        color: 'white',
                        fontSize: 'medium',
                      },
                    })}
                  </Box>
                  <Typography variant={'body1'} fontWeight={600}>
                    {element.label}
                  </Typography>
                </Box>
              </Button>

              <Box
                sx={{
                  display: 'none',
                }}>
                {React.cloneElement(element.element, {
                  id: `plugin-${index}`,
                })}
              </Box>
            </Box>
          ))}
      </Box>

      <Box></Box>

      <Box
        width={'100%'}
        display={isAuthenticated ? 'flex' : 'none'}
        flexDirection={isAuthenticated ? 'column' : undefined}>
        {/* 1 뎁스 */}
        {menuSets.map((menuSet, menuSetIndex) => (
          <Box width={'100%'} key={JSON.stringify(menuSetIndex)} display={menuSet.hide === true ? 'none' : 'block'}>
            <Box mb={1.25} mt={3.25}>
              <Typography variant={'body2'} color={theme.palette.grey['800']} fontWeight={'600'}>
                {menuSet.label}
              </Typography>
            </Box>

            <Box>
              {menuSet.menus.map((menu, index) => (
                <Box key={index}>
                  <RecursiveDropdownMenu
                    link={`/${menuSet.link}/${menu.link}`}
                    icon={menu.icon}
                    depth={0}
                    menu={menu}
                    menuId={`menu-${menuSetIndex}-${index}`}
                    openedRootMenuId={openedRootMenuId}
                    setOpenedRootMenuId={setOpenedRootMenuId}
                    currentPath={router.asPath}
                    menuIndex={index}
                  />
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SideBar;
