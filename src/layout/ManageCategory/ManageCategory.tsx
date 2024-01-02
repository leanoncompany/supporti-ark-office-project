import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { AccordionPanel } from '@leanoncompany/supporti-react-ui';
import React, { useEffect, useState } from 'react';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LinkRoundedIcon from '@mui/icons-material/LinkRounded';
import { ICategory, ISubCategory } from '../../@types/layout/product/category/category';
import CategoryController from '../../controller/default/CategoryController';
import useCategory, { ICategoryTree } from '../../hooks/ecommerce/useCategory';
import { IUserInputStatus } from '@leanoncompany/supporti-react-ui';
import CreateCategoryModal from './CreateCategoryModal';
import DefaultController from '../../controller/default/DefaultController';
import CreateSubCategoryModal from './CreateSubCategoryModal';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

type Props = {};

const ManageCategory = (props: Props) => {
  const theme = useTheme();

  const router = useRouter();
  const categoryController = new DefaultController('ProductPrimaryCategory');
  const subCategoryController = new DefaultController('ProductSubCategory');

  const [categoryList, setCategoryList] = useState<ICategory[]>([]);

  // 카테고리 생성 모달 오픈
  const [openCategoryModal, setOpenCategoryModal] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryNameInputStatus, setCategoryNameInputStatus] = useState<IUserInputStatus>({
    status: 'default',
  });
  // 카테고리 수정 모달 오픈
  const [openCategoryEditModal, setOpenCategoryEditModal] = useState<boolean>(false);

  const [clickedCategoryId, setClickedCategoryId] = useState<number>();
  const [clickedSubCategoryId, setClickedSubCategoryId] = useState<number>();

  // 서브카테고리 생성 모달 오픈
  const [openSubCategoryModal, setOpenSubCategoryModal] = useState<boolean>(false);
  const [openSubCategoryEditModal, setOpenSubCategoryEditModal] = useState<boolean>(false);

  const { categoryTree, setCategoryTree } = useCategory();

  const routerChange = () => {
    router.push(`/${router.pathname}?state=${uuidv4()}`);
  };

  // 카테고리 생성 함수
  const createCategory = (name: string) => {
    categoryController.createItem(
      {
        NAME: name,
      },
      (res: any) => {
        let clonedCategoryTree: ICategory[] = [...categoryList];
        clonedCategoryTree.push({
          name: res.data.result.NAME,
          primaryCategoryId: res.data.result.PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE,
        });
        setCategoryList(clonedCategoryTree);
        setOpenCategoryModal(false);
        setCategoryName('');
        routerChange();
      },
      (err: any) => {
        console.log(err);
      }
    );
  };
  // 서브카테고리 생성 함수
  const createSubCategory = (id: number) => {
    subCategoryController.createItem(
      {
        NAME: categoryName,
        PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE: id,
      },
      (res: any) => {
        let clonedCategoryTree: ICategory[] = [...categoryList];
        clonedCategoryTree.map((el) => {
          if (el.primaryCategoryId === id) {
            if (el.children) {
              el.children.push({
                name: res.data.result.NAME,
                parentPrimaryCategoryId: res.data.result.PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE,
                subCategoryId: res.data.result.PRODUCT_SUB_CATEGORY_IDENTIFICATION_CODE,
              });
            } else {
              el.children = [
                {
                  name: res.data.result.NAME,
                  parentPrimaryCategoryId: res.data.result.PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE,
                  subCategoryId: res.data.result.PRODUCT_SUB_CATEGORY_IDENTIFICATION_CODE,
                },
              ];
            }
          }
        });
        setCategoryList(clonedCategoryTree);
        setOpenSubCategoryModal(false);
        setCategoryName('');
        setClickedCategoryId(undefined);
        routerChange();
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  const updateCategory = (primaryId: number) => {
    categoryController.updateItem(
      {
        PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE: primaryId,
        NAME: categoryName,
      },
      (res: any) => {
        let clonedCategoryTree: ICategory[] = [...categoryList];
        clonedCategoryTree.map((el) => {
          if (el.primaryCategoryId === primaryId) {
            el.name = categoryName;
          }
        });
        setCategoryList(clonedCategoryTree);
        setClickedCategoryId(undefined);
        setOpenCategoryEditModal(false);
        setCategoryName('');
        routerChange();
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  const updateSubCategory = (primaryId: number, subId: number) => {
    subCategoryController.updateItem(
      {
        NAME: categoryName,
        PRODUCT_SUB_CATEGORY_IDENTIFICATION_CODE: subId,
      },
      (res: any) => {
        let clonedCategoryTree: ICategory[] = [...categoryList];
        clonedCategoryTree.map((el, index) => {
          if (el.primaryCategoryId === primaryId && el.children !== undefined) {
            el.children.map((subEl, subIndex) => {
              if (subEl.subCategoryId === subId) {
                if (el.children !== undefined) {
                  el.children[subIndex].name = categoryName;
                }
              }
            });
          }
        });
        setCategoryList(clonedCategoryTree);
        setCategoryName('');
        setClickedSubCategoryId(undefined);
        setOpenSubCategoryEditModal(false);
        routerChange();
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  const deleteCategory = (primaryId: number) => {
    categoryController.deleteItem(
      {
        PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE: primaryId,
      },
      (res: any) => {
        let clonedCategoryTree: ICategory[] = [...categoryList];
        clonedCategoryTree = clonedCategoryTree.filter((el) => el.primaryCategoryId !== primaryId);
        setCategoryList(clonedCategoryTree);
        routerChange();
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  const deleteSubCategory = (primaryId: number, subId: number) => {
    subCategoryController.deleteItem(
      {
        PRODUCT_SUB_CATEGORY_IDENTIFICATION_CODE: subId,
      },
      (res: any) => {
        let clonedCategoryTree: ICategory[] = [...categoryList];
        clonedCategoryTree.map((el, index) => {
          if (el.primaryCategoryId === primaryId) {
            el.children = el.children?.filter((el) => el.subCategoryId !== subId);
          }
        });
        setCategoryList(clonedCategoryTree);
        routerChange();
      },
      (err: any) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    // eslint-disable-next-line array-callback-return
    let clonedCategory: ICategory[] = [];
    categoryTree.map((cateEl, cateIndex) => {
      let clonedSubCate: ISubCategory[] = [];
      cateEl.children.map((el) => {
        clonedSubCate.push({
          name: el.NAME,
          parentPrimaryCategoryId: el.PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE,
          subCategoryId: el.PRODUCT_SUB_CATEGORY_IDENTIFICATION_CODE,
        });
      });
      clonedCategory.push({
        name: cateEl.category.NAME,
        primaryCategoryId: cateEl.category.PRODUCT_PRIMARY_CATEGORY_IDENTIFICATION_CODE,
        children: clonedSubCate.length > 0 ? clonedSubCate : undefined,
      });
    });
    setCategoryList(clonedCategory);
  }, [categoryTree]);

  useEffect(() => {
    setCategoryName('');
  }, [openCategoryModal, openCategoryEditModal, openSubCategoryModal, openSubCategoryEditModal]);

  return (
    <Box width={'100%'} display={'flex'} flexDirection={'column'}>
      {/* 위에 제목, 추가버튼 */}
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
        <Box>
          <Typography variant={'h5'} fontWeight={'600'}>
            카테고리 관리
          </Typography>
        </Box>
        <CreateCategoryModal
          headerLabel={'생성'}
          isModal={openCategoryModal}
          setIsModal={setOpenCategoryModal}
          categoryName={categoryName}
          setCategoryName={setCategoryName}
          categoryNameInputStatus={categoryNameInputStatus}
          setCategoryNameInputStatus={setCategoryNameInputStatus}
          createCategory={createCategory}
          modalButtonElement={
            <IconButton
              onClick={() => setOpenCategoryModal(true)}
              sx={{
                py: 1,
                px: 1,
              }}>
              <AddCircleRoundedIcon
                style={{
                  fontSize: 'larger',
                }}
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
            </IconButton>
          }
        />
      </Box>
      {/* 리스트 */}
      <Box display={'flex'} flexDirection={'column'}>
        {categoryList.map((categoryEl, categoryIndex) => (
          <Accordion
            key={categoryIndex}
            elevation={0}
            sx={{
              '&:before': {
                display: 'none',
              },
              borderTop: `1px solid ${theme.palette.grey[100]}`,
              borderBottom: categoryList.length - 1 == categoryIndex ? `1px solid ${theme.palette.grey[100]}` : 'none',
            }}
            disableGutters={true}>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                paddingLeft: '20px',
                paddingRight: '20px',
                borderRadius: '0',
                py: '10px',
                display: 'flex',
              }}>
              <Box width={'100%'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
                  <Box
                    width={'48px'}
                    height={'48px'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    mr={2.5}
                    borderRadius={'4px'}
                    sx={{
                      backgroundColor: '#ec4c7c',
                    }}>
                    <LocalOfferIcon
                      fontSize="small"
                      style={{
                        color: 'white',
                      }}
                    />
                  </Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Box mr={1}></Box>
                    <Box display={'flex'} flexDirection={'column'}>
                      <Box>
                        <Typography variant={'body1'}>{categoryEl.name}</Typography>
                      </Box>
                      <Box>
                        <Typography variant={'subtitle1'} color={theme.palette.grey[700]}>
                          {categoryEl.children !== undefined && categoryEl.children.length !== 0
                            ? categoryEl.children.length + '개의 서브카테고리'
                            : '서브카테고리 없음'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box display={'flex'}>
                  <ButtonGroup
                    size="small"
                    aria-label="small button group"
                    sx={{
                      backgroundColor: '#f0f0f5',
                      borderRadius: 2,
                    }}>
                    <Tooltip title="추가">
                      <IconButton
                        onClick={() => {
                          setOpenSubCategoryModal(true);
                          setClickedCategoryId(categoryEl.primaryCategoryId);
                        }}>
                        <AddCircleRoundedIcon
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: 'large',
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="수정">
                      <IconButton
                        onClick={() => {
                          setOpenCategoryEditModal(true);
                          setClickedCategoryId(categoryEl.primaryCategoryId);
                          setCategoryName(categoryEl.name);
                        }}>
                        <EditRoundedIcon
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: 'large',
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="삭제">
                      <IconButton
                        onClick={() => {
                          deleteCategory(categoryEl.primaryCategoryId);
                        }}>
                        <DeleteForeverRoundedIcon
                          sx={{
                            color: theme.palette.primary.main,
                            fontSize: 'large',
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </ButtonGroup>
                </Box>
              </Box>
            </AccordionSummary>
            {categoryEl.children !== undefined && (
              <AccordionDetails sx={{ borderRadius: '0', width: '100%' }}>
                {categoryEl.children?.map((el, index) => (
                  <Box
                    key={index}
                    pl={5}
                    mt={index !== 0 ? 2 : 0}
                    py={0.5}
                    width={'100%'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#e2e2e2',
                      },
                    }}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box mr={1} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                        <LinkRoundedIcon
                          fontSize="medium"
                          sx={{
                            color: theme.palette.grey[400],
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant={'body2'}>{el.name}</Typography>
                      </Box>
                    </Box>
                    <Box>
                      <ButtonGroup
                        size="small"
                        aria-label="small button group"
                        sx={{
                          backgroundColor: '#f0f0f5',
                          borderRadius: 2,
                          marginRight: 0.6,
                        }}>
                        <Tooltip title="수정">
                          <IconButton
                            onClick={() => {
                              setClickedSubCategoryId(el.subCategoryId);
                              setClickedCategoryId(categoryEl.primaryCategoryId);
                              setCategoryName(el.name);
                              setOpenSubCategoryEditModal(true);
                            }}>
                            <EditRoundedIcon
                              sx={{
                                color: theme.palette.primary.main,
                                fontSize: 'large',
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="삭제">
                          <IconButton
                            onClick={() => {
                              deleteSubCategory(categoryEl.primaryCategoryId, el.subCategoryId);
                            }}>
                            <DeleteForeverRoundedIcon
                              sx={{
                                color: theme.palette.primary.main,
                                fontSize: 'large',
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      </ButtonGroup>
                    </Box>
                  </Box>
                ))}
              </AccordionDetails>
            )}
          </Accordion>
        ))}
      </Box>

      <CreateSubCategoryModal
        headLabel={'생성'}
        categoryId={clickedCategoryId}
        isModal={openSubCategoryModal}
        setIsModal={setOpenSubCategoryModal}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryNameInputStatus={categoryNameInputStatus}
        setCategoryNameInputStatus={setCategoryNameInputStatus}
        createSubCategory={createSubCategory}
      />
      <CreateSubCategoryModal
        headLabel={'수정'}
        categoryId={clickedCategoryId}
        subCategoryId={clickedSubCategoryId}
        isModal={openSubCategoryEditModal}
        setIsModal={setOpenSubCategoryEditModal}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryNameInputStatus={categoryNameInputStatus}
        setCategoryNameInputStatus={setCategoryNameInputStatus}
        updateSubCategory={updateSubCategory}
      />
      <CreateCategoryModal
        headerLabel={'수정'}
        isModal={openCategoryEditModal}
        setIsModal={setOpenCategoryEditModal}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryNameInputStatus={categoryNameInputStatus}
        setCategoryNameInputStatus={setCategoryNameInputStatus}
        updateCategory={updateCategory}
        categoryId={clickedCategoryId}
      />
    </Box>
  );
};

export default ManageCategory;
