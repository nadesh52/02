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
  Typography,
  Slider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const URL = "https://api.opendota.com";

const defaultValue: any = {
  name: "",
  attack_min: 0,
  attack_max: 0,
  attack_range: 0,
  attack_speed: 0,
  projectile_speed: 0,
  base_health: 0,
  base_health_regen: 0,
  base_mana: 0,
  base_mana_regen: 0,
  armor: 0,
  magic_armor: 0,
  move_speed: 0,
  base_str: 0,
  base_agi: 0,
  base_int: 0,
  turn_rate: 0,
  day_vision: 0,
  night_vision: 0,
};

const defaultAttr = {
  str: 0,
  agi: 0,
  int: 0,
  atk: 0,
  armor: 0,
  hp: 0,
  hp_regen: 0,
  mp: 0,
  mp_regen: 0,
};

let newAtkMin: number;
let newAtkMax: number;

let sumAll;
let sumIncrement;

export default function HeroSimulate() {
  const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [disable, setDisable] = useState<boolean>(true);

  const [selectedHero, setSelectedHero] = useState<any>(defaultValue);
  const [level, setLevel] = useState<number>(0);
  const [attribute, setAttribute] = useState(defaultAttr);

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

  const heroSelection = (e: SelectChangeEvent<unknown>) => {
    let result: Hero = allHeroes.find((obj) => {
      return obj.id === e.target.value;
    })!;

    if (isLoading === false) {
      setLevel(1);
      setSelectedHero(result);
      setAttribute({
        str: result.base_str,
        agi: result.base_agi,
        int: result.base_int,
        atk: (result.base_attack_min + result.base_attack_max) / 2,
        armor: result.base_armor,
        hp: result.base_health,
        hp_regen: result.base_health_regen,
        mp: result.base_mana,
        mp_regen: result.base_mana_regen,
      });
    }
    setDisable(false);
  };

  const attackCalc = (): number => {
    const {
      base_str,
      base_agi,
      base_int,
      str_gain,
      agi_gain,
      int_gain,
      base_attack_min,
      base_attack_max,
    } = selectedHero;

    if (selectedHero.primary_attr === "str") {
      newAtkMin = Math.round(
        base_str + str_gain * (level - 1) + base_attack_min
      );
      newAtkMax = Math.round(
        base_str + str_gain * (level - 1) + base_attack_max
      );
    } else if (selectedHero.primary_attr === "agi") {
      newAtkMin = Math.round(
        base_agi + agi_gain * (level - 1) + base_attack_min
      );
      newAtkMax = Math.round(
        base_agi + agi_gain * (level - 1) + base_attack_max
      );
    } else if (selectedHero.primary_attr === "int") {
      newAtkMin = Math.round(
        base_int + int_gain * (level - 1) + base_attack_min
      );
      newAtkMax = Math.round(
        base_int + int_gain * (level - 1) + base_attack_max
      );
    } else if (selectedHero.primary_attr === "all") {
      sumAll = base_str + base_agi + base_int;
      sumIncrement = (str_gain + agi_gain + int_gain) * (level - 1);
      newAtkMin = base_attack_min + (sumAll + sumIncrement) * 0.7;
      newAtkMax = base_attack_max + (sumAll + sumIncrement) * 0.7;
    }

    return Math.round(newAtkMin + newAtkMax / 2);
  };

  const armorCalc = (): number => {
    return Math.round(
      selectedHero.base_armor +
        0.167 * (selectedHero.base_agi + selectedHero.agi_gain * (level - 1))
    );
  };

  const hpCalc = (): number => {
    return Math.round(
      selectedHero.base_health +
        22 * (selectedHero.base_str + selectedHero.str_gain * (level - 1))
    );
  };

  const hpRegCalc = (): number => {
    return (
      selectedHero.base_health_regen +
      0.1 * (selectedHero.base_str + selectedHero.str_gain * (level - 1))
    ).toFixed(1);
  };

  const mpCalc = (): number => {
    return Math.round(
      selectedHero.base_mana +
        12 * (selectedHero.base_int + selectedHero.int_gain * (level - 1))
    );
  };

  const mpRegCalc = (): number => {
    return (
      selectedHero.base_mana_regen +
      0.05 * (selectedHero.base_int + selectedHero.int_gain * (level - 1))
    ).toFixed(1);
  };

  const attributeCalculator = () => {
    const { base_str, base_agi, base_int, str_gain, agi_gain, int_gain } =
      selectedHero;

    if (isLoading === false) {
      let attr = {
        str: Math.round(base_str + str_gain * (level - 1)),
        agi: Math.round(base_agi + agi_gain * (level - 1)),
        int: Math.round(base_int + int_gain * (level - 1)),
        atk: attackCalc(),
        armor: armorCalc(),
        hp: hpCalc(),
        hp_regen: hpRegCalc(),
        mp: mpCalc(),
        mp_regen: mpRegCalc(),
      };
      setAttribute(attr);
      console.log(attr);
    }
  };

  const handleChange = (e: any) => {
    setLevel(e.target.value);
  };

  const handleButtonClick = (name: string) => {
    const minLv = 1;
    const maxLv = 30;

    if (name === "down") {
      if (level <= minLv) {
        setLevel(minLv);
      } else {
        setLevel(level - 1);
      }
    } else if (name === "up") {
      if (level >= maxLv) {
        setLevel(maxLv);
      } else {
        setLevel(level + 1);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    attributeCalculator();
  }, [level]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Grid
        item
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        rowGap={2}
        sx={{ width: 700 }}
      >
        <Grid
          className="top-section"
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h5">Select Hero</Typography>
          </Grid>

          {/* Dropdown */}
          <Grid item>
            <Grid
              className="detail-box"
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <Grid item>
                <Select
                  onChange={(e) => heroSelection(e)}
                  defaultValue=""
                  sx={{ width: 230, height: 50 }}
                >
                  {allHeroes.map((hero: Hero, i: number) => (
                    <MenuItem value={hero.id} key={i}>
                      <Grid item>
                        {/* hero selections */}
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
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
          </Grid>

          {/* Level Button */}
          <Grid item>
            <Grid
              className="button-box"
              container
              direction="row"
              justifyContent="space-around"
              alignItems="center"
              sx={{ marginTop: 2, width: 250 }}
            >
              <Grid item xs={1}>
                <IconButton
                  name="levelDown"
                  color="primary"
                  sx={{ backgroundColor: "lightgrey", borderRadius: 5 }}
                  onClick={() => {
                    handleButtonClick("down");
                  }}
                  disabled={disable}
                >
                  <RemoveIcon />
                </IconButton>
              </Grid>

              <Grid item xs={10}>
                <Typography variant="h6">Level {level}</Typography>
              </Grid>

              <Grid item xs={1}>
                <IconButton
                  name="levelUp"
                  color="primary"
                  sx={{ backgroundColor: "lightgrey", borderRadius: 5 }}
                  onClick={() => {
                    handleButtonClick("up");
                  }}
                  disabled={disable}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
              {/* Slider */}
              <Grid item>
                <Slider
                  min={1}
                  max={30}
                  defaultValue={1}
                  step={1}
                  valueLabelDisplay="auto"
                  value={level}
                  onChange={(e) => handleChange(e)}
                  sx={{ width: 120 }}
                  disabled={disable}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* avatar + hp bar */}
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              width: 300,
              height: 250,
              bgcolor: "darkslateblue",
              boxShadow: 10,
              // border: "2px solid",
              borderRadius: 2,
            }}
          >
            <Grid item>
              <Typography variant="h5">
                {selectedHero.localized_name}
              </Typography>
            </Grid>

            <Grid item>
              <img src={URL + selectedHero.img} alt="selected-hero" />
            </Grid>
            {/* HP & MP bar */}
            <Grid
              item
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 300 }}
            >
              {/* HP */}
              <Grid
                item
                container
                direction="row"
                justifyContent="center"
                sx={{ bgcolor: "greenyellow" }}
              >
                <Grid item xs={4} sx={{ textAlign: "left" }}>
                  <Typography variant="caption">Health</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">{attribute.hp}</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography variant="caption">
                    +{attribute.hp_regen}
                  </Typography>
                </Grid>
              </Grid>

              {/* Mana */}
              <Grid
                item
                container
                direction="row"
                justifyContent="center"
                sx={{ bgcolor: "skyblue" }}
              >
                <Grid item xs={4} sx={{ textAlign: "left" }}>
                  <Typography variant="caption">Mana</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1">{attribute.mp}</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: "right" }}>
                  <Typography variant="caption">
                    +{attribute.mp_regen}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          className="bottom-section"
          item
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
        >
          {/* ATTRIBUTES */}
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1 / 4, bgcolor: "paleturquoise" }}
          >
            <Typography variant="h6">ATTRIBUITES</Typography>
            {/* STR */}
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={5} sx={{ textAlign: "left" }}>
                <Grid item>
                  <img
                    src={`./assets/img/attributes/str.png`}
                    alt="str"
                    width={35}
                  />
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h5">{attribute.str}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">
                  +{selectedHero.str_gain}
                </Typography>
              </Grid>
            </Grid>
            {/* AGI */}
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={5} sx={{ textAlign: "left" }}>
                <Grid item>
                  <img
                    src={`./assets/img/attributes/agi.png`}
                    alt="agi"
                    width={35}
                  />
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h5">{attribute.agi}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">
                  +{selectedHero.agi_gain}
                </Typography>
              </Grid>
            </Grid>
            {/* INT */}
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={5}>
                <Grid item>
                  <img
                    src={`./assets/img/attributes/int.png`}
                    alt="int"
                    width={35}
                  />
                </Grid>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h5">{attribute.int}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body2">
                  +{selectedHero.int_gain}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* ATTACK */}
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1 / 4, bgcolor: "goldenrod" }}
          >
            <Grid item>
              <Typography variant="h6">ATTACK</Typography>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <img src={`./assets/img/icons/atk.png`} alt="atk" width={25} />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography variant="body1" gutterBottom>
                  {attribute.atk}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <img
                  src={`./assets/img/icons/attack_time.png`}
                  alt="atk_time"
                  width={25}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography variant="body1" gutterBottom>
                  {selectedHero.attack_rate}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <img
                  src={`./assets/img/icons/attack_range.png`}
                  alt="atk_range"
                  width={25}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography variant="body1" gutterBottom>
                  {selectedHero.attack_range}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <img
                  src={`./assets/img/icons/projectile_speed.png`}
                  alt="atk"
                  width={25}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography variant="body1" gutterBottom>
                  {selectedHero.projectile_speed}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* DEFENSE */}
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1 / 4, bgcolor: "chartreuse" }}
          >
            <Grid item>
              <Typography variant="h6">DEFENSE</Typography>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <img
                  src={`./assets/img/icons/armor.png`}
                  alt="armor"
                  width={25}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography variant="body1" gutterBottom>
                  {attribute.armor}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <img
                  src={`./assets/img/icons/magic_resist.png`}
                  alt="mr"
                  width={25}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography variant="body1" gutterBottom>
                  {selectedHero.base_mr}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* MOBILITY */}
          <Grid
            item
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1 / 4, bgcolor: "pink" }}
          >
            <Grid item>
              <Typography variant="h6">MOBILITY</Typography>
            </Grid>

            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <img
                  src={`./assets/img/icons/speed.png`}
                  alt="speed"
                  width={25}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography variant="body1" gutterBottom>
                  {selectedHero.move_speed}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <img
                  src={`./assets/img/icons/turn_rate.png`}
                  alt="tr"
                  width={25}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography variant="body1" gutterBottom>
                  {selectedHero.turn_rate}
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ width: 100 }}
            >
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <img
                  src={`./assets/img/icons/vision.png`}
                  alt="vs"
                  width={25}
                />
              </Grid>
              <Grid item xs={6} sx={{ textAlign: "left" }}>
                <Typography variant="body1" gutterBottom>
                  {selectedHero.day_vision}/{selectedHero.night_vision}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
