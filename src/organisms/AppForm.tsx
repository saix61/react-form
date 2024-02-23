import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { GET_DATA_QUERY } from "../gql/queries";
import { Query } from "../generated/types";

import { useQuery } from "@apollo/client";
import { Box, Button, TextField } from "@mui/material";
import { CustomSelect } from "../molecules/CustomSelect";

export function AppForm() {
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "all" });

  const [autocompleteReset, setAutocompleteReset] = useState(false);

  const [textInput, setTextInput] = useState("");
  const [textArea, setTextArea] = useState("");

  const textInputLabel = errors?.textInput
    ? "textInput is required"
    : "textInput";

  const { data: response, loading } = useQuery<Query>(GET_DATA_QUERY);

  const positions = response?.applicantIndividualCompanyPositions.data || [];
  const relations = response?.applicantIndividualCompanyRelations.data || [];

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);

    reset();
    // don't use reset() only, it works with bug in some cases
    setAutocompleteReset((e) => !e);
    setTextInput("");
    setTextArea("");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box mb={2}>
        <CustomSelect
          autocompleteReset={autocompleteReset}
          options={positions}
          loading={loading}
          control={control}
          label="Positions"
          name="positions"
          multiple={true}
        />
      </Box>

      <Box mb={2}>
        <CustomSelect
          autocompleteReset={autocompleteReset}
          options={relations}
          loading={loading}
          control={control}
          label="Relations"
          name="relations"
        />
      </Box>

      <Box mb={2}>
        <TextField
          {...register("textInput", { required: true })}
          error={!!errors.textInput}
          label={textInputLabel}
          value={textInput}
          fullWidth
          variant="outlined"
          onChange={(e) => setTextInput(e.currentTarget.value)}
        />
      </Box>

      <Box mb={2}>
        <TextField
          {...register("textArea")}
          label="textArea"
          value={textArea}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          onChange={(e) => setTextArea(e.currentTarget.value)}
        />
      </Box>

      <Button
        disabled={!isValid}
        variant="contained"
        size={"large"}
        type="submit"
        fullWidth
      >
        Submit
      </Button>
    </form>
  );
}
