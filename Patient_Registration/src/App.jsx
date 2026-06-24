import { FormProvider } from "./context/FormContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <FormProvider>
      <AppRoutes />
    </FormProvider>
  );
}

export default App;
