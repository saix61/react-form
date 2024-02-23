import { Box, Container } from "@mui/material";
import { FormCard } from "./organisms/FormCard";

function App() {
  return (
    <div className="App">
      <Box paddingBlock={8}>
        <Container>
          <FormCard />
        </Container>
      </Box>
    </div>
  );
}

export default App;
