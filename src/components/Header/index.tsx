/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Wrapper } from "./wrapper";
import Menu from "@/components/Menu";
import Button from "@/components/Button";


export default function Header() {
  return (
    <Wrapper>
      <Menu/>
      <Button>Migrate</Button>
      <Button>Rollback</Button>
    </Wrapper>
  );
}
