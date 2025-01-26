import styled from "styled-components";
import { Button } from "primereact/button";

export const Wrapper = styled(Button)<{ backgroundColor?: string; color?: string; active?: string }>`
  background-color: ${({ color, active }) =>
    active == "true" ? (color ? "darken(0.8, color)" : "#f0f0f0") : color || "white"};
  color: ${({ color }) => (color ? "white" : "black")};
  border: 0.5px solid gray;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ color }) =>
      color ? "darken(0.1, color)" : "#f0f0f0"};
  }
`;

