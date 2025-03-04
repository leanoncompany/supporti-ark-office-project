import {
  Autocomplete,
  Box,
  darken,
  lighten,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Theme } from "@mui/material/styles";
const GroupHeader = styled("div")(({ theme }: { theme: Theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === "light"
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

export interface IAutoCompleteTypeFilterSelectableOption {
  label: string;
  value: any;
  args?: { [key: string]: any };
}

interface IAutoCompleteTypeFilterProps {
  value: IAutoCompleteTypeFilterSelectableOption | null;
  setValue: any;
  selectableOptionList: IAutoCompleteTypeFilterSelectableOption[];
  label?: string;
  placeholder?: string;
  groupBy?: (option: IAutoCompleteTypeFilterSelectableOption) => string;
  disabled?: boolean;
}

const AutoCompleteTypeFilter = (props: IAutoCompleteTypeFilterProps) => {
  //* Modules
  const theme = useTheme();

  //* States
  //* Functions

  //* Functions
  //* Hooks

  //* Component
  return (
    <Box>
      {props.label !== undefined && (
        <Box mb={1.5}>
          <Typography variant={"h6"}>{props.label}</Typography>
        </Box>
      )}

      <Autocomplete
        renderGroup={(params) => (
          <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
        disabled={props.disabled}
        groupBy={props.groupBy}
        fullWidth
        value={props.value}
        onChange={(
          event: any,
          newValue: { label: string; value: any } | null
        ) => {
          props.setValue(newValue);
        }}
        options={props.selectableOptionList}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => {
          return (
            <Box>
              <TextField {...params} placeholder={props.placeholder} />
            </Box>
          );
        }}
      />
    </Box>
  );
};

export default AutoCompleteTypeFilter;
