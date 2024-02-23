import { Control, Controller, FieldValues } from "react-hook-form";

import { Delete } from "@mui/icons-material";
import { TOption, TOptionList } from "../App";
import { useEffect, useState } from "react";
import { isArray } from "@apollo/client/utilities";
import {
  createFilterOptions,
  Autocomplete,
  Button,
  Grid,
  TextField,
} from "@mui/material";

const filter = createFilterOptions<TOption>();

export type TCustomSelect = {
  name: string;
  label: string;
  options: TOptionList;
  control: Control<FieldValues>;
  autocompleteReset: boolean;
  multiple?: boolean;
  loading?: boolean;
};

export function CustomSelect(props: TCustomSelect) {
  const {
    loading = false,
    multiple = false,
    autocompleteReset,
    options,
    control,
    label,
    name,
  } = props;

  const preventOnChange: { state: boolean } = {
    state: false,
  };
  const [optionList, setOptionList] = useState<TOptionList>(options);
  const [fieldValue, setFieldValue] = useState<TOption | TOptionList | null>(
    []
  );

  useEffect(() => {
    setOptionList(options);
  }, [options]);

  useEffect(() => {
    setFieldValue([]);
  }, [autocompleteReset]);

  return (
    <div className="CustomSelect">
      <Controller
        name={name}
        control={control}
        rules={{ required: label + " is required" }}
        render={({ field: { onChange }, fieldState }) => (
          <Autocomplete
            loading={loading}
            multiple={multiple}
            options={optionList}
            value={fieldValue}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              const isExisting = options.some(
                (option) => inputValue === option.name
              );
              if (inputValue !== "" && !isExisting) {
                filtered.push({
                  id: 0,
                  name: inputValue,
                });
              }

              return filtered;
            }}
            getOptionLabel={(option) => {
              return option?.id
                ? option?.id == 0
                  ? `Add "${option.name}"`
                  : !multiple
                  ? option.name
                  : "[ID:" + option.id + "] | " + option.name
                : "";
            }}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  label={fieldState.error?.message || label}
                  error={!!fieldState.error}
                />
              );
            }}
            onChange={(_, data) => {
              if (preventOnChange.state) {
                preventOnChange.state = false;
              } else {
                if (isArray(data)) {
                  const newData: TOptionList = [];
                  newData.push(...data);
                  if (data?.find((obj) => obj.id === 0)) {
                    newData[newData.length - 1].id = new Date().getTime();
                  }
                  setOptionList((oldOptions) =>
                    [...oldOptions, ...newData].filter(
                      (item, index, array) => array.indexOf(item) === index
                    )
                  );
                  setFieldValue(newData);
                  onChange(newData);
                } else if (typeof data === "object" && data?.name) {
                  const newData = data;

                  if (data.id === 0) {
                    newData.id = new Date().getTime();
                  }
                  setOptionList((oldOptions) =>
                    [...oldOptions, newData].filter(
                      (item, index, array) => array.indexOf(item) === index
                    )
                  );
                  setFieldValue(newData);
                  onChange(newData);
                } else {
                  setFieldValue(data);
                  onChange(data);
                }
              }
            }}
            renderOption={(props, option) => (
              <li
                {...props}
                key={option.id}
                onClick={(event) => {
                  if (!preventOnChange.state && props.onClick) {
                    props.onClick(event);
                  }
                }}
              >
                <Grid container alignItems={"Stretch"}>
                  <Grid item xs={11}>
                    {option.id === 0 ? `Add "${option.name}"` : option.name}
                  </Grid>
                  {option.id !== 0 && (
                    <Grid item xs={1}>
                      <Button
                        fullWidth
                        variant="text"
                        color="error"
                        size="small"
                        aria-label="delete"
                        sx={{ height: "100%" }}
                        onClick={() => {
                          preventOnChange.state = true;

                          setOptionList((oldOptions) => {
                            if (isArray(oldOptions)) {
                              return oldOptions?.filter(
                                (item: TOption) => item !== option
                              );
                            }
                            return oldOptions;
                          });

                          if (isArray(fieldValue)) {
                            const newVal = fieldValue?.filter(
                              (item: TOption) => item.id !== option.id
                            );

                            setFieldValue(newVal);
                            onChange(newVal);
                          } else if (fieldValue?.id === option.id) {
                            setFieldValue([]);
                            onChange([]);
                          }
                        }}
                      >
                        <Delete />
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </li>
            )}
          />
        )}
      />
    </div>
  );
}
