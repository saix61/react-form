import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import "./App.css";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Container,
  Typography,
} from "@mui/material";
import { CustomSelect } from "./molecules/CustomSelect";
import { GET_DATA_QUERY } from "./gql/queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { Query } from "./generated/types";

function App() {
  const { data: response, loading } = useQuery<Query>(GET_DATA_QUERY);

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "all" });

  const [autocompleteReset, setAutocompleteReset] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    console.log(data);
    reset();
    setDefaultValue("");
    setAutocompleteReset((e) => !e);
  };

  const positions = response?.applicantIndividualCompanyPositions.data || [];
  const relations = response?.applicantIndividualCompanyRelations.data || [];

  return (
    <div className="App">
      <Container>
        <Box paddingBlock={8}>
          <Card>
            <CardContent>
              <Box p={4}>
                <Typography variant="h2" component="h1" mb={3}>
                  React-form
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box mb={2}>
                    <CustomSelect
                      control={control}
                      autocompleteReset={autocompleteReset}
                      options={positions}
                      label="Positions"
                      name="positions"
                      multiple={true}
                      loading={loading}
                    />
                  </Box>

                  <Box mb={2}>
                    <CustomSelect
                      control={control}
                      autocompleteReset={autocompleteReset}
                      options={relations}
                      label="Relations"
                      name="relations"
                      loading={loading}
                    />
                  </Box>

                  <Box mb={2}>
                    <TextField
                      {...register("textInput", {
                        required: "textInput is required",
                      })}
                      label={
                        (typeof errors?.textInput?.message === "string" &&
                          errors.textInput.message) ||
                        "textInput"
                      }
                      error={!!errors.textInput}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => {
                        setDefaultValue(e.currentTarget.value);
                        return e;
                      }}
                      value={defaultValue}
                    />
                  </Box>

                  <Box mb={2}>
                    <TextField
                      {...register("textArea")}
                      label="textArea"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                    />
                  </Box>

                  <Button type="submit" variant="contained" disabled={!isValid}>
                    Submit
                  </Button>
                </form>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </div>
  );
}

export default App;
