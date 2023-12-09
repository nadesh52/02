import React, { useState, useEffect } from "react";
import { Hero } from "./components/types/Hero";
import { fetchHeroes } from "./components/FetchHeroes";
import {
  Grid,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const URL = "https://api.opendota.com";

export default function HeroSimulate() {
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [armor, setArmor] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [level, setLevel] = useState<number>(1);
  const [selectedHero, setSelectedHero] = useState<any>({
    localized_name: "no hero select",
  });
  const [nagateValue, setNagateValue] = useState<number>(0);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await fetchHeroes();
    const sorted = res.sort((a: any, b: any) => {
      if (a.localized_name < b.localized_name) {
        return -1;
      }
      if (a.localized_name > b.localized_name) {
        return 1;
      }
      return 0;
    });
    setAllHeroes(sorted);
    setIsLoading(false);
  };

  const handleChange = (e: SelectChangeEvent<unknown>) => {
    let result: Hero = allHeroes.find((obj) => {
      return obj.id === e.target.value;
    })!;

    if (isLoading === false) {
      setSelectedHero(result);
    }
  };

  const armorCalculator = (hero: Hero, lv: number, nagate: number) => {
    const { base_armor, base_agi, agi_gain } = hero;

    let multiplier: number = 0.167;
    let negArmor: number = nagate;
    let level: number = lv > 1 ? (lv -= 1) : lv;
    let sumAgi: number = lv > 1 ? base_agi + agi_gain * level : base_agi;

    const mainArmor = base_armor + sumAgi * multiplier * (1 - negArmor);
    setArmor(mainArmor.toFixed(1));
  };

  const levelUp = () => {
    level >= 30 ? setLevel(30) : setLevel(level + 1);
  };

  const levelDown = () => {
    level <= 1 ? setLevel(1) : setLevel(level - 1);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Grid container maxWidth="xl">
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          rowGap={2}
        >
          <Grid item>
            <img src={`./assets/img/attributes/str.png`} alt="str" width={50} />
            top str box
          </Grid>
          <Grid item>
            <Grid
              className="str-box"
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Select
                onChange={(e) => handleChange(e)}
                defaultValue=""
                sx={{ width: 230 }}
              >
                {allHeroes.map((hero: Hero, i: number) => (
                  <MenuItem value={hero.id} key={i}>
                    <Grid item>
                      {/* hero selections */}
                      <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                      >
                        <Grid item>
                          <Box
                            component="img"
                            src={`${URL}${hero.icon}`}
                            alt="hero-icon"
                            sx={{ marginRight: 1, width: 25 }}
                          />
                        </Grid>
                        <Grid item>{hero.localized_name}</Grid>
                      </Grid>
                    </Grid>
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              className="button-box"
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              sx={{ width: 200 }}
            >
              <Grid item>
                <IconButton
                  color="primary"
                  sx={{ backgroundColor: "lightgrey", borderRadius: 5 }}
                  onClick={levelDown}
                >
                  <RemoveIcon />
                </IconButton>
              </Grid>
              <Grid item>Level: {level}</Grid>
              <Grid item>
                <IconButton
                  color="primary"
                  sx={{ backgroundColor: "lightgrey", borderRadius: 5 }}
                  onClick={levelUp}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              <Grid item>armor: {armor}</Grid>
            </Grid>
          </Grid>
          <Grid item>{selectedHero.localized_name}</Grid>
          <Grid item>
            <img src={`./assets/img/attributes/agi.png`} alt="" width={50} />
            top agi box
          </Grid>
          <Grid item>
            <Grid
              className="agi-box"
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              {/* {agiHeroes.map((hero: Hero) => (
                <Grid item>
                  <img src={`${URL}${hero.img}`} alt="" width={200} />
                </Grid>
              ))} */}
            </Grid>
          </Grid>
          <Grid item>
            <img src={`./assets/img/attributes/int.png`} alt="" width={50} />
            top int box
          </Grid>
          <Grid item>
            <Grid
              className="int-box"
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              {/* {intHeroes.map((hero: Hero) => (
                <Grid item>
                  <img src={`${URL}${hero.img}`} alt="" width={200} />
                </Grid>
              ))} */}
            </Grid>
          </Grid>
          <Grid item>
            <img src={`./assets/img/attributes/all.png`} alt="uni" width={50} />
            top uni box
          </Grid>
          <Grid item>
            <Grid
              className="uni-box"
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              {/* {uniHeroes.map((hero: Hero) => (
                <Grid item>
                  <img src={`${URL}${hero.img}`} alt="" width={200} />
                </Grid>
              ))} */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      Sim
      <p>hero status</p>
    </div>
  );
}
