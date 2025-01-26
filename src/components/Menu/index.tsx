/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import { Menu as ReactPrimeMenu } from 'primereact/menu';
import { PrimeIcons } from 'primereact/api';

import Button from "@/components/Button";
import { Wrapper, OverlayPanelWrapper } from "./wrapper";

const items = [
  {
      label: 'Settings',
      items: [
          { label: 'New', icon: PrimeIcons.PLUS },
          { label: 'Open', icon: PrimeIcons.DOWNLOAD }
      ]
  }
];

export default function Menu() {
  const ref = useRef(null);

  return (
    <Wrapper>
      <Button
        onClick={(e) => (ref as any)?.current?.toggle(e)}
      >
        <i className="pi pi-plus" style={{ fontSize: "1.5rem" }}></i>
      </Button>
      <OverlayPanelWrapper ref={ref}>
        <ReactPrimeMenu model={items} />
      </OverlayPanelWrapper>
    </Wrapper>
  );
}
