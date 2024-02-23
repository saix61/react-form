import { Control, Controller, FieldValues } from "react-hook-form";
import { ApplicantIndividualCompanyOption } from "../generated/types";

import { Delete } from "@mui/icons-material";
import { HTMLAttributes, useEffect, useState } from "react";
import { isArray } from "@apollo/client/utilities";
import {
  createFilterOptions,
  Autocomplete,
  Button,
  Grid,
  TextField,
  FilterOptionsState,
} from "@mui/material";

const filter = createFilterOptions<ApplicantIndividualCompanyOption>();

export type TAutocompleteOption = {
  option: ApplicantIndividualCompanyOption;
  onChange: (...event: TApplicantIndividualCompanyOptionState[]) => void;
};

export type TApplicantIndividualCompanyOptionState =
  | ApplicantIndividualCompanyOption
  | ApplicantIndividualCompanyOption[]
  | null;

export type TCustomSelect = {
  name: string;
  label: string;
  options: ApplicantIndividualCompanyOption[];
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

  // states
  const preventOnChange: { state: boolean } = {
    state: false,
  };
  const [optionList, setOptionList] =
    useState<ApplicantIndividualCompanyOption[]>(options);
  const [fieldValue, setFieldValue] =
    useState<TApplicantIndividualCompanyOptionState>([]);

  // effects
  useEffect(() => {
    setOptionList(options);
  }, [options]);

  useEffect(() => {
    setFieldValue([]);
  }, [autocompleteReset]);

  // handlers
  const autocompleteOnChangeHandler = (
    data: TApplicantIndividualCompanyOptionState,
    onChange: (...event: TApplicantIndividualCompanyOptionState[]) => void
  ) => {
    if (preventOnChange.state) {
      preventOnChange.state = false;
    } else {
      const filterCallback = (
        item: ApplicantIndividualCompanyOption,
        index: number,
        array: TApplicantIndividualCompanyOptionState[]
      ) => array.indexOf(item) === index;

      if (isArray(data)) {
        const newData: ApplicantIndividualCompanyOption[] = [];
        newData.push(...data);

        if (data?.find((obj) => obj.id === "new")) {
          newData[newData.length - 1].id = String(new Date().getTime());
        }

        setOptionList((oldOptions) =>
          [...oldOptions, ...newData].filter(filterCallback)
        );
        setFieldValue(newData);
        onChange(newData);
      } else if (typeof data === "object" && data?.name) {
        const newData = data;

        if (data.id === "new") {
          newData.id = String(new Date().getTime());
        }

        setOptionList((oldOptions) =>
          [...oldOptions, newData].filter(filterCallback)
        );
        setFieldValue(newData);
        onChange(newData);
      } else {
        setFieldValue(data);
        onChange(data);
      }
    }
  };

  const autocompleteRenderOptionHandler = (
    props: HTMLAttributes<HTMLLIElement>,
    option: ApplicantIndividualCompanyOption,
    onChange: (...event: TApplicantIndividualCompanyOptionState[]) => void
  ) => (
    <li
      {...props}
      key={option.id}
      onClick={(event) => {
        if (!preventOnChange.state && props.onClick) {
          props.onClick(event);
        }
      }}
    >
      <AutocompleteOption option={option} onChange={onChange} />
    </li>
  );

  function AutocompleteOption(props: TAutocompleteOption) {
    const { option, onChange } = props;

    return (
      <Grid container alignItems={"Stretch"}>
        <Grid item xs={11}>
          {option.id === "new" ? `Add "${option.name}"` : option.name}
        </Grid>
        {option.id !== "new" && (
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
                      (item: ApplicantIndividualCompanyOption) =>
                        item !== option
                    );
                  }
                  return oldOptions;
                });

                if (isArray(fieldValue)) {
                  const newVal = fieldValue?.filter(
                    (item: ApplicantIndividualCompanyOption) =>
                      item.id !== option.id
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
    );
  }

  const autocompleteFilterOptions = (
    options: ApplicantIndividualCompanyOption[],
    params: FilterOptionsState<ApplicantIndividualCompanyOption>
  ) => {
    const filtered = filter(options, params);

    const { inputValue } = params;
    const isExisting = options.some((option) => inputValue === option.name);
    if (inputValue !== "" && !isExisting) {
      filtered.push({
        id: "new",
        name: inputValue,
      });
    }

    return filtered;
  };

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
            onChange={(_, data) => autocompleteOnChangeHandler(data, onChange)}
            renderOption={(props, option) =>
              autocompleteRenderOptionHandler(props, option, onChange)
            }
            filterOptions={(options, params) =>
              autocompleteFilterOptions(options, params)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={fieldState.error?.message || label}
                error={!!fieldState.error}
              />
            )}
            getOptionLabel={(option) =>
              option?.id
                ? option?.id === "new"
                  ? `Add "${option.name}"`
                  : !multiple
                  ? option.name
                  : "[ID:" + option.id + "] | " + option.name
                : ""
            }
          />
        )}
      />
    </div>
  );
}
