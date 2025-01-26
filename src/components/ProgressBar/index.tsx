import React from "react";
import { ProgressBar as ReactPrimeProgressBar } from "primereact/progressbar";
import { Wrapper } from "./wrapper";

interface Props {
  value: number;
}

export default function ProgressBar(props: Props) {
  return (
    <Wrapper>
      <ReactPrimeProgressBar value={props.value} showValue={false}/>
    </Wrapper>
  );
}
