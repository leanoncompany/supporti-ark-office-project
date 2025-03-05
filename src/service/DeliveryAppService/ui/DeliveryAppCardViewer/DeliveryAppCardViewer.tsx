import { Box, CardContent, Grid, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import DefaultController from "../../../../controller/default/DefaultController";
import { BadgeFilter } from "../../../../ui/local/input/BadgeFilter";
import DataUtil from "../../../../utils/data/DataUtil";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { DateSelectPicker } from "../../../../ui/local/utils/DateSelectPicker";
import moment from "moment";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

export interface IDeliveryAppCardSummary {
  label: string;
  key: string;
  value: number;
  postFix: string;
}

interface IDeliveryAppCardViewerProps {
  activatedSummaryIndex: number;
  setActivatedSummaryIndex: React.Dispatch<React.SetStateAction<number>>;
  summaryList: IDeliveryAppCardSummary[];
}

const DeliveryAppCardViewer = (props: IDeliveryAppCardViewerProps) => {
  //* Modules
  const theme = useTheme();
  const dataUtil = new DataUtil();

  //* States

  //* Functions
  const checkIsSelected = (index: number) => {
    return index === props.activatedSummaryIndex;
  };

  //* Hooks
  useEffect(() => {}, []);

  //* Components
  return (
    <Box>
      <Grid container spacing={1.5}>
        {props.summaryList.map((summary, summaryIndex) => (
          <Grid item xs={12} md={6}>
            <CardContent
              onClick={() => {
                props.setActivatedSummaryIndex(summaryIndex);
              }}
              sx={{
                p: "0 !important",
                pb: "0 !important",
              }}
            >
              <Box
                display={"flex"}
                alignItems={"flex-start"}
                justifyContent={"space-between"}
                border={`1px solid ${
                  checkIsSelected(summaryIndex)
                    ? theme.palette.primary.main
                    : "rgba(0,0,0,.1)"
                }`}
                borderRadius={1}
                p={1.5}
              >
                <Box display={"flex"} alignItems={"flex-start"}>
                  <Typography
                    variant="h6"
                    color={
                      checkIsSelected(summaryIndex)
                        ? theme.palette.primary.main
                        : undefined
                    }
                    sx={{
                      fontWeight: checkIsSelected(summaryIndex)
                        ? 500
                        : undefined,
                    }}
                  >
                    {summary.label}
                  </Typography>

                  {checkIsSelected(summaryIndex) && (
                    <Box ml={0.75}>
                      <CheckRoundedIcon
                        htmlColor={theme.palette.primary.main}
                        fontSize={"small"}
                      />
                    </Box>
                  )}
                </Box>
                <Box pt={"30px"} display={"flex"} alignItems={"flex-end"}>
                  <Box>
                    <Typography
                      variant="h4"
                      color={
                        checkIsSelected(summaryIndex)
                          ? theme.palette.primary.main
                          : undefined
                      }
                      sx={{
                        fontWeight: checkIsSelected(summaryIndex)
                          ? 500
                          : undefined,
                      }}
                    >
                      {dataUtil.numberWithCommas(summary.value)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      color={
                        checkIsSelected(summaryIndex)
                          ? theme.palette.primary.main
                          : undefined
                      }
                      sx={{
                        fontWeight: checkIsSelected(summaryIndex)
                          ? 500
                          : undefined,
                      }}
                    >
                      {summary.postFix}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DeliveryAppCardViewer;
