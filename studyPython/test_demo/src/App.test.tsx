// src/App.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders Vite + React", () => {
    render(<App />);
    expect(screen.getByText("Vite + React")).toBeInTheDocument();
});
