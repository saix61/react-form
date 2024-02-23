import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

import * as T from "./CustomSelectTypes";

import { isArray } from "@apollo/client/utilities";
import { Delete } from "@mui/icons-material";
import {
  Grid,
  Button,
  TextField,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";

const filter = createFilterOptions<T.TCustomSelectOption>();

export function CustomSelect({
  name,
  label,
  control,
  options,
  loading = false,
  multiple = false,
  autocompleteReset,
}: T.TCustomSelect) {
  // states
  const [fieldValue, setFieldValue] = useState<T.TCustomSelectState>([]);
  const [optionList, setOptionList] =
    useState<T.TCustomSelectOption[]>(options);
  const preventOnChange: T.TPreventOnChange = {
    state: false,
  };

  // effects
  useEffect(() => {
    setOptionList(options);
  }, [options]);

  useEffect(() => {
    setFieldValue([]);
  }, [autocompleteReset]);

  // handlers
  const getOptionLabelHandler = (option: T.TCustomSelectOption) =>
    (option?.id === "new"
      ? `Add "${option.name}"`
      : multiple
      ? `[ID:${option.id}] | ${option.name}`
      : option.name) ?? "";

  const onChangeHandler = ({ data, onChange }: T.TOnChangeHandler) => {
    if (preventOnChange.state) {
      preventOnChange.state = false;
    } else {
      const filterCallback = ({ item, index, array }: T.TFilterCallback) =>
        array.indexOf(item) === index;

      if (isArray(data)) {
        const newData: T.TCustomSelectOption[] = [];
        newData.push(...data);

        if (data?.find((obj) => obj.id === "new")) {
          newData[newData.length - 1].id = String(new Date().getTime());
        }

        setOptionList((oldOptions) =>
          [...oldOptions, ...newData].filter((item, index, array) =>
            filterCallback({ item, index, array })
          )
        );
        setFieldValue(newData);
        onChange(newData);
      } else if (typeof data === "object" && data?.name) {
        const newData = data;

        if (data.id === "new") {
          newData.id = String(new Date().getTime());
        }

        setOptionList((oldOptions) =>
          [...oldOptions, newData].filter((item, index, array) =>
            filterCallback({ item, index, array })
          )
        );
        setFieldValue(newData);
        onChange(newData);
      } else {
        setFieldValue(data);
        onChange(data);
      }
    }
  };

  const filterOptionsHandler = ({
    options,
    params,
  }: T.TFilterOptionsHandler) => {
    const { inputValue } = params;
    const filtered = filter(options, params);
    const isExisting = options.some((option) => inputValue === option.name);

    if (inputValue !== "" && !isExisting) {
      filtered.push({
        id: "new",
        name: inputValue,
      });
    }

    return filtered;
  };

  const renderOptionHandler = ({
    props,
    option,
    onChange,
  }: T.TRenderOptionHandler) => (
    <li
      {...props}
      key={option.id}
      onClick={(e) =>
        !preventOnChange.state && props.onClick && props.onClick(e)
      }
    >
      <AutocompleteOption option={option} onChange={onChange} />
    </li>
  );

  // components
  function AutocompleteOption({ option, onChange }: T.TAutocompleteOption) {
    const onClickHandler = () => {
      preventOnChange.state = true;

      setOptionList((oldOptions) => {
        if (isArray(oldOptions)) {
          return oldOptions?.filter(
            (item: T.TCustomSelectOption) => item !== option
          );
        }

        return oldOptions;
      });

      if (isArray(fieldValue)) {
        const newVal = fieldValue?.filter(
          (item: T.TCustomSelectOption) => item.id !== option.id
        );

        setFieldValue(newVal);
        onChange(newVal);
      } else if (fieldValue?.id === option.id) {
        setFieldValue([]);
        onChange([]);
      }
    };

    return (
      <Grid container alignItems={"Stretch"}>
        <Grid item xs={11}>
          {option.id === "new" ? `Add "${option.name}"` : option.name}
        </Grid>
        {option.id !== "new" && (
          <Grid item xs={1}>
            <Button
              sx={{ height: "100%" }}
              onClick={onClickHandler}
              variant="text"
              color="error"
              size="small"
              fullWidth
            >
              <Delete />
            </Button>
          </Grid>
        )}
      </Grid>
    );
  }

  // CustomSelect return()
  return (
    <div className="CustomSelect">
      <Controller
        name={name}
        control={control}
        rules={{ required: label + " is required" }}
        render={({ field: { onChange }, fieldState }) => (
          <Autocomplete
            loading={loading}
            value={fieldValue}
            multiple={multiple}
            options={optionList}
            onChange={(_, data) => onChangeHandler({ data, onChange })}
            getOptionLabel={(option) => getOptionLabelHandler(option)}
            renderOption={(props, option) =>
              renderOptionHandler({ props, option, onChange })
            }
            filterOptions={(options, params) =>
              filterOptionsHandler({ options, params })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={fieldState.error?.message || label}
                error={!!fieldState.error}
              />
            )}
          />
        )}
      />
    </div>
  );
}
