"use client";

import Header from "@/components/Header";
import Console from "@/components/Console";
import ProgressBar from "@/components/ProgressBar";
import Splitter from "@/components/Splitter";
import React, { useState } from "react";
import { Wrapper } from "./wrapper";
import Button from "@/components/Button";

function Main() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };
  return (
    <Wrapper>
      <Splitter
        layout="vertical"
        isVisible={isVisible}
        upper={
          <div className="upper">
            <ProgressBar value={89} />
            <Header />
            <Button active={isVisible} onClick={toggleVisibility}>
              {isVisible ? (
                <i className="pi pi-angle-down" style={{ fontSize: "1.5rem" }}></i>
              ) : (
                <i className="pi pi-angle-up" style={{ fontSize: "1.5rem" }}></i>
              )}
            </Button>
          </div>
        }
        lower={
          <div className="lower">
            <Console />
          </div>
        }
      />
    </Wrapper>
  );
}

export default Main;
