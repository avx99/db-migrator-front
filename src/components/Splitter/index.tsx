import React from "react";
import { Wrapper } from "./wrapper";
import { SplitterPanel } from "primereact/splitter";

interface Props {
  upper: React.ReactNode;
  lower: React.ReactNode;
  setIsVisible?: () => void;
  isVisible: boolean;
  layout: "vertical" | "horizontal";
}

export default function Splitter(props: Props) {

  return (
    <>
      {props.isVisible ? (
        <Wrapper
          layout="vertical"
        >
          <SplitterPanel className="splitter-upper">
            {props.upper}
          </SplitterPanel>
          <SplitterPanel className="splitter-lower">
            {props.lower}
          </SplitterPanel>
        </Wrapper>
      ) : (
        <div className="splitter-upper">{props.upper}</div>
      )}
    </>
  );
}
