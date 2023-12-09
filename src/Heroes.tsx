import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import { fetchHeroes } from "./components/FetchHeroes";
import { Hero } from "./components/types/Hero";

const URL = "https://api.opendota.com";

export default function Heroes() {
  const [data, setData] = useState<Hero[]>([]);

  const getData = async () => {
    const d = await fetchHeroes();
    setData(d);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Grid container spacing={2}>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid container sx={{ m: 5 }}>
            {data.map((v: Hero, i: number) => (
              <Grid
                container
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={i}
                justifyContent="center"
                sx={{ marginBottom: 2 }}
              >
                <Box
                  sx={{
                    borderRadius: 5,
                    overflow: "hidden",
                    backgroundColor: "chocolate",
                    transition: "transform 0.15s ease-in-out",
                    "&:hover": {
                      transform: "scale3d(1.2, 1.2, 1)",
                    },
                  }}
                >
                  <img src={`${URL}${v.img}`} alt="" width={200} />
                  <p>{v.localized_name}</p>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
