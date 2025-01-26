/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { MouseEventHandler } from "react";
import { Wrapper } from "./wrapper";

interface Props {
  onClick?: MouseEventHandler<any> | undefined;
  children: React.ReactNode;
  color?: string;
  icon?: string;
  disabled?: boolean;
  active?: boolean;
}

export default function Menu(props: Props) {
  return (
    <Wrapper
      active={props?.active?.toString()}
      type="button"
      onClick={props?.onClick}
      disabled={props?.disabled || false}
      icon={props?.icon}
    >
      {props.children}
    </Wrapper>
  );
}
