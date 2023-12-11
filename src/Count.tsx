import { Button } from "@mui/base";
import { Typography } from "@mui/material";
import React, { useState } from "react";

function Count() {
  const [count, setCount] = useState(0);
  const [num, setNum] = useState(0);

  const handleClick = (e: any) => {
    if (e.target.name === "up") {
      setCount(count + 1);
    } else {
      setCount(count - 1);
    }
    setNum(count);
    //commit1
    console.log("count", count);
    console.log("num", num);
  };
  return (
    <div>
      <Typography variant="h1">{num}</Typography>
      <Button name="down" onClick={(e) => handleClick(e)}>
        -
      </Button>
      <Button name="up" onClick={(e) => handleClick(e)}>
        +
      </Button>
    </div>
  );
}

export default Count;
