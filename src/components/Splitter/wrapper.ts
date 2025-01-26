import styled from "styled-components";
import { Splitter } from "primereact/splitter";

export const Wrapper = styled(Splitter)<{ layout: "vertical" | "horizontal" }>`
  height: 100%;
  display: flex;
  flex-direction: ${(props) => (props.layout === "vertical" ? "column" : "row")};

  .splitter-upper,
  .splitter-lower {
    overflow: auto;
  }

  .empty-splitter{
    height: 10px;
    background: red;
  }

  .toggle-button {
    position: fixed;
    bottom: 1rem;
    left: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    z-index: 1000; /* Ensure the button stays above other elements */

    &:hover {
      background-color: #0056b3;
    }
  }
`;
