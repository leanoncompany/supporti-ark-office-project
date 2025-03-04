import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Rating from "@mui/material/Rating";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { TextTypeInput } from "@leanoncompany/supporti-react-ui";
import DefaultController from "../../../../controller/default/DefaultController";
import Grid2 from "@mui/material/Unstable_Grid2";

interface IReviewEditFormProps {
  element: { [key: string]: any };
  reviewBotDelay: number;
}

const ReviewEditForm = (props: IReviewEditFormProps) => {
  //* Modules
  const theme = useTheme();
  const reviewReplyController = new DefaultController("ReviewReply");

  //* States
  const [data, setData] = useState<{ [key: string]: any }>({});
  const [clonedReviewReply, setClonedReviewReply] = useState<{
    [key: string]: any;
  } | null>(null);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  //* Hooks
  useEffect(() => {
    setData({ ...props.element });
  }, [props.element]);

  //* Functions
  const handleSaveReviewReply = () => {
    if (clonedReviewReply !== null) {
      reviewReplyController.updateItem(
        {
          REVIEW_REPLY_IDENTIFICATION_CODE:
            clonedReviewReply.REVIEW_REPLY_IDENTIFICATION_CODE,
          REVIEW_REPLY_CONTENT: clonedReviewReply.REVIEW_REPLY_CONTENT,
        },
        (response: any) => {
          alert("리뷰 답글 내용이 업데이트되었습니다!");

          setIsEditing(false);
        },
        (error: any) => {
          alert("리뷰 답글 내용 업데이트에 실패했습니다!");
        }
      );
    }
  };

  const timeCalc = (
    date: Date,
    additionalSuffix?: { minus: string; plus: string }
  ) => {
    const currentTime = new Date().getTime();
    const targetTime = date.getTime();

    const diff = currentTime - targetTime;
    let suffix = "전";

    if (diff >= 0) {
      suffix = `전 ${
        additionalSuffix?.minus !== undefined ? additionalSuffix?.minus : ""
      }`;
    } else {
      suffix = `후 ${
        additionalSuffix?.plus !== undefined ? additionalSuffix?.plus : ""
      }`;
    }

    const seconds = Math.floor(Math.abs(diff) / 1000);

    let label = "";

    // 초 단위로 차이를 계산하여 적절한 문자열을 반환합니다.
    if (seconds < 10) {
      label = "방금 전";
    } else if (seconds < 60) {
      label = `${seconds}초 ${suffix}`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days < 7) {
        label = `${days}일 ${suffix}`;
      } else {
        const weeks = Math.floor(days / 7);

        if (weeks <= 2) {
          label = `${weeks}주 ${suffix}`;
        } else {
          const months = Math.floor(weeks / 4);
          label = `${months}개월 ${suffix}`;
        }
      }
    }

    return { label, diff };
  };

  const calculateReviewReplyUploadDate = (reviewReply: any | null): string => {
    const uploadScheduleDate = moment(
      new Date(props.element.REVIEW_UPLOADED_DATE)
    )
      .add(props.reviewBotDelay, "days")
      .toDate();

    const timeCalcResult = timeCalc(uploadScheduleDate, {
      minus: "업로드 완료",
      plus: "업로드 예정",
    });

    // return timeCalcResult.diff.toString();

    if (
      timeCalcResult.diff >= 0 &&
      (reviewReply === null || props.element.IS_REPLIED === "N")
    ) {
      if (
        Math.floor(Math.abs(timeCalcResult.diff) / 1000) / 60 / 60 / 24 >=
        14
      ) {
        return "업로드 실패 (14일 초과)";
      } else {
        return "즉시 업로드 예정";
      }
    } else {
      return timeCalcResult.label;
    }
  };

  //* Hooks
  useEffect(() => {
    if (
      props.element.IS_REPLIED === "N" &&
      props.element.REVIEW_REPLY !== null
    ) {
      const calculateReviewReplyUploadDateResult =
        calculateReviewReplyUploadDate(props.element.REVIEW_REPLY);

      if (/업로드 예정/gi.test(calculateReviewReplyUploadDateResult)) {
        setCanEdit(true);
      }
    }
  }, [props.element]);

  useEffect(() => {
    setClonedReviewReply(props.element.REVIEW_REPLY);
  }, [props.element]);

  return (
    <Box
      mb={3}
      p={2.5}
      borderRadius={1.5}
      sx={{ background: "#fff" }}
      boxShadow={
        "0 5px 24px 0 rgba(66,69,79,.05), 0 3px 12px 0 rgba(66,69,79,.05), 0 0 0 1px rgba(66,69,79,.01)"
      }
    >
      <Box mb={1.5}>
        <Grid2 container spacing={1}>
          <Grid2 item xs={12} md={3}>
            {/* Reviewer nickname */}
            <Box mb={0.6}>
              <Typography variant={"h5"}>
                {props.element.REVIEWER_USER_NAME}
              </Typography>
            </Box>

            <Box display={"flex"} alignItems={"center"}>
              {/* Reviewer rate */}
              <Box mr={1}>
                <Rating
                  name="size-small"
                  readOnly
                  defaultValue={Number(props.element.REVIEWER_RATE)}
                  size="small"
                  icon={<StarRoundedIcon fontSize="inherit" />}
                  emptyIcon={
                    <StarRoundedIcon
                      style={{ opacity: 0.55 }}
                      fontSize="inherit"
                    />
                  }
                />
              </Box>

              {/* Review uploaded date */}
              <Box>
                <Typography variant={"body1"} color={"textSecondary"}>
                  {timeCalc(new Date(props.element.REVIEW_UPLOADED_DATE)).label}
                </Typography>
              </Box>
            </Box>
          </Grid2>
          <Grid2 item xs={12} md={9}>
            <Box>
              <Typography
                variant={"h6"}
                sx={{
                  fontWeight: 400,
                }}
                color={
                  props.element.REVIEW_CONTENT.length == 0
                    ? "textSecondary"
                    : undefined
                }
              >
                {props.element.REVIEW_CONTENT.length == 0
                  ? "내용 없음"
                  : props.element.REVIEW_CONTENT}
              </Typography>
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      {/* 리뷰 답변 섹션 */}

      <Grid2 container spacing={1}>
        <Grid2 item xs={12} md={3}></Grid2>
        <Grid2 item xs={12} md={9}>
          <Box
            borderRadius={1.5}
            p={1.5}
            sx={{
              background: "rgb(242, 242, 243)",
            }}
          >
            {/* Reviewer nickname */}
            <Box mb={0.6} display={"flex"} alignItems={"center"}>
              <Typography variant={"h5"}>사장님</Typography>

              {/* Review uploaded date */}
              {/* <Box ml={1}>
								<Typography
									variant={'body1'}
									color={'textSecondary'}
								>
									{calculateReviewReplyUploadDate(
										props.element.REVIEW_REPLY
									)}
								</Typography>
							</Box> */}
            </Box>

            <Box mb={2.5}>
              {/* Reviewer rate */}
              <Typography
                variant={"body1"}
                color={"textSecondary"}
                sx={{
                  fontWeight: 400,
                }}
              >
                {props.element.REVIEW_TARGET_SHOP_NAME}
              </Typography>
            </Box>
            <Box>
              {clonedReviewReply === null ? (
                <Box
                  mt={-1.5}
                  width={"100%"}
                  height={"120px"}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Box>
                    <Typography variant={"h6"} color={theme.palette.grey[700]}>
                      아직 답변 내용이 생성되지 않았습니다
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography
                    variant={"h6"}
                    sx={{
                      fontWeight: 400,
                    }}
                    color={
                      clonedReviewReply.REVIEW_REPLY_CONTENT.length == 0
                        ? "textSecondary"
                        : undefined
                    }
                  >
                    {clonedReviewReply.REVIEW_REPLY_CONTENT.length == 0 ? (
                      "내용 없음"
                    ) : isEditing ? (
                      <Box bgcolor={"white"} borderRadius={"4px"}>
                        <TextTypeInput
                          fullWidth
                          multiline={true}
                          rows={3}
                          value={clonedReviewReply.REVIEW_REPLY_CONTENT}
                          setValue={(value: any) => {
                            setClonedReviewReply({
                              ...clonedReviewReply,
                              REVIEW_REPLY_CONTENT: value,
                            });
                          }}
                        />
                      </Box>
                    ) : (
                      clonedReviewReply.REVIEW_REPLY_CONTENT
                    )}
                  </Typography>

                  {canEdit == true && (
                    <Box mt={3}>
                      <Grid2 container spacing={1}>
                        <Grid2 item xs={6} md={6}>
                          <Button
                            fullWidth
                            variant={isEditing ? "contained" : "outlined"}
                            onClick={() => {
                              if (isEditing == false) {
                                setIsEditing(true);
                              } else {
                                const confirm =
                                  window.confirm("저장하시겠습니까?");

                                if (confirm == true) {
                                  handleSaveReviewReply();
                                }
                              }
                            }}
                          >
                            {isEditing ? "저장하기" : "수정하기"}
                          </Button>
                        </Grid2>
                        <Grid2 item xs={6} md={6}>
                          {isEditing == true && (
                            <Button
                              fullWidth
                              variant={"outlined"}
                              onClick={() => {
                                setIsEditing(false);
                                setClonedReviewReply(
                                  props.element.REVIEW_REPLY
                                );
                              }}
                            >
                              취소하기
                            </Button>
                          )}
                        </Grid2>
                      </Grid2>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default ReviewEditForm;
