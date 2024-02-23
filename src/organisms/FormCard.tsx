import { Box, Card, Typography, CardContent } from "@mui/material";
import { AppForm } from "./AppForm";

export function FormCard() {
  return (
    <Card>
      <CardContent>
        <Box p={4}>
          <Typography variant="h2" component="h1" mb={3}>
            React-form
          </Typography>
          <AppForm />
        </Box>
      </CardContent>
    </Card>
  );
}
