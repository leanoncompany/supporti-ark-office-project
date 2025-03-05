import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  TextField,
  useTheme,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Select from "../../input/Select/Select";
import { IUserInputStatus } from "../../../../@types/external/qillieReactUi";

interface IDateSelectPickerProps {
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  selectors: string[];
  calculateSelectableDateRangeFrom?: Date;
  selectedDateUnit: string | null;
}

const DateSelectPicker = (props: IDateSelectPickerProps) => {
  //* Modules
  const theme = useTheme();

  //* States
  const [selectableSourceDateList, setSelectableSourceDateList] = useState<
    Date[]
  >([]);

  const [year, setYear] = useState<number>(moment().year());
  const [yearInputStatus, setYearInputStatus] = useState<IUserInputStatus>({
    status: "default",
  });
  const [selectableYearList, setSelectableYearList] = useState<
    { label: string; value: string }[]
  >([]);

  const [month, setMonth] = useState<number>(moment().month());
  const [monthInputStatus, setMonthInputStatus] = useState<IUserInputStatus>({
    status: "default",
  });
  const [selectableMonthList, setSelectableMonthList] = useState<
    { label: string; value: string }[]
  >([]);

  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  //* Constants

  //* Functions
  function generateDates(date: Date, units: string[]): Date[] {
    const result: Date[] = [];

    const year = date.getFullYear();
    const month = date.getMonth();

    if (units.includes("year")) {
      const firstDayOfYear = new Date(year, 0, 1);
      result.push(firstDayOfYear);
    }

    if (units.includes("month")) {
      for (let i = month; i < 12; i++) {
        const currentMonth = new Date(year, i, 1);
        result.push(currentMonth);
      }

      for (let i = year + 1; i <= new Date().getFullYear(); i++) {
        for (let j = 0; j < 12; j++) {
          const currentMonth = new Date(i, j, 1);
          result.push(currentMonth);
        }
      }
    } else if (!units.includes("year")) {
      result.push(new Date(year, 0, 1));
    }

    return result;
  }

  //* Hooks
  useEffect(() => {
    let unit: any = "year";

    if (props.selectors.includes("month")) {
      unit = "month";
    }

    const startMoment = moment()
      .year(year)
      .month(month - 1)
      .startOf(unit);
    const endMoment = moment()
      .year(year)
      .month(month - 1)
      .endOf(unit);

    setStartDate(dayjs(startMoment.format("YYYY-MM-DD 00:00:00")));
    setEndDate(dayjs(endMoment.format("YYYY-MM-DD 23:59:59")));
  }, [year, month]);

  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      props.setStartDate(new Date(startDate.format("YYYY-MM-DDT00:00:00")));
      props.setEndDate(new Date(endDate.format("YYYY-MM-DDT23:59:59")));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    let generatedDates: Date[] = [];

    if (props.calculateSelectableDateRangeFrom !== undefined) {
      generatedDates = generateDates(
        props.calculateSelectableDateRangeFrom,
        props.selectors
      );
    } else {
      generatedDates = generateDates(new Date("2023-01-01"), props.selectors);
    }

    setSelectableSourceDateList(generatedDates);
  }, [props.calculateSelectableDateRangeFrom, props.selectors]);

  useEffect(() => {
    if (selectableSourceDateList.length != 0) {
      let selectableYears: { label: string; value: string }[] = [];

      selectableSourceDateList.map((date) => {
        const value = {
          label: `${date.getFullYear().toString()}년`,
          value: date.getFullYear().toString(),
        };

        let isAlreadyExist = false;

        for (const element of selectableYears) {
          if (element.value === value.value) {
            isAlreadyExist = true;
            break;
          }
        }

        if (!isAlreadyExist) {
          selectableYears.push(value);
        }
      });

      setSelectableYearList(selectableYears);

      let selectableMonths: any[] = [];

      selectableSourceDateList.map((date) => {
        let isAlreadyExist = false;

        for (const element of selectableMonths) {
          if (element.value === (date.getMonth() + 1).toString()) {
            isAlreadyExist = true;
            break;
          }
        }

        if (!isAlreadyExist) {
          selectableMonths.push({
            label: `${date.getMonth() + 1}월`,
            value: (date.getMonth() + 1).toString(),
          });
        }
      });

      setSelectableMonthList(selectableMonths);
    }
  }, [selectableSourceDateList]);

  useEffect(() => {
    if (props.selectedDateUnit !== null) {
      if (props.selectedDateUnit === "month") {
        setYear(moment().year());
        setMonth(0);
      } else if (props.selectedDateUnit === "day") {
        setYear(moment().year());
        setMonth(moment().month() + 1);
      }
    }
  }, [props.selectedDateUnit]);

  return (
    <Box>
      <Grid
        container
        columnSpacing={{ xs: 0.5, md: 2 }}
        mt={1}
        display={"flex"}
        alignItems={"center"}
        mb={1}
      >
        <Grid item xs={6} md={6}>
          <Box>
            <Select
              labelConfig={{
                label: "연도",
                position: "outer",
              }}
              inputStatus={yearInputStatus}
              value={year}
              setValue={setYear}
              selectableItems={selectableYearList}
            />
          </Box>
        </Grid>

        <Grid item xs={6} md={6}>
          <Box display={props.selectedDateUnit == "month" ? "none" : "block"}>
            <Select
              labelConfig={{
                label: "월",
                position: "outer",
              }}
              inputStatus={monthInputStatus}
              value={month}
              setValue={setMonth}
              selectableItems={selectableMonthList}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DateSelectPicker;
