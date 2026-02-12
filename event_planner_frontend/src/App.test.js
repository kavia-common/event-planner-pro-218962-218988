import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";

test("renders landing page headline", () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  const headline = screen.getByText(/plan events like it’s 1989/i);
  expect(headline).toBeInTheDocument();
});
