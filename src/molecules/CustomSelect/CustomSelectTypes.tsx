import { HTMLAttributes } from "react";
import { Control, FieldValues } from "react-hook-form";

import { ApplicantIndividualCompanyOption } from "../../generated/types";
import { FilterOptionsState } from "@mui/material";

export type TCustomSelectOption = ApplicantIndividualCompanyOption;

export type TCustomSelect = {
  multiple?: boolean;
  loading?: boolean;
  autocompleteReset: boolean;
  options: TCustomSelectOption[];
  control: Control<FieldValues>;
  label: string;
  name: string;
};

export type TCustomSelectState =
  | TCustomSelectOption[]
  | TCustomSelectOption
  | null;

export type TAutocompleteOption = {
  onChange: (...event: TCustomSelectState[]) => void;
  option: TCustomSelectOption;
};

export type TOnChangeHandler = {
  onChange: (...event: TCustomSelectState[]) => void;
  data: TCustomSelectState;
};

export type TRenderOptionHandler = {
  onChange: (...event: TCustomSelectState[]) => void;
  props: HTMLAttributes<HTMLLIElement>;
  option: TCustomSelectOption;
};

export type TPreventOnChange = {
  state: boolean;
};

export type TFilterCallback = {
  array: TCustomSelectState[];
  item: TCustomSelectOption;
  index: number;
};

export type TFilterOptionsHandler = {
  params: FilterOptionsState<TCustomSelectOption>;
  options: TCustomSelectOption[];
};
