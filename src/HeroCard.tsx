import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import { Hero } from "./components/types/Hero";

const URL = "https://api.opendota.com";

const styles = {
  paperContainer: {
    backgroundImage: `url(${"https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/backgrounds/grey_painterly.png"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
};

const universalDamage = (hero: any) => {
  const multiplier: number = 0.7;
  return Math.floor(
    hero.base_attack_max +
      (hero.base_str + hero.base_agi + hero.base_int) * multiplier
  );
};

const damageCalc = (hero: any) => {
  if (hero.primary_attr === "str") {
    return Math.floor(hero.base_attack_max + hero.base_str);
  } else if (hero.primary_attr === "agi") {
    return Math.floor(hero.base_attack_max + hero.base_agi);
  } else if (hero.primary_attr === "int") {
    return Math.floor(hero.base_attack_max + hero.base_int);
  }
};

const armorCalc = (hero: any) => {
  const multiplier: number = 0.167;
  let armor: number = hero.base_armor + hero.base_agi * multiplier;
  return armor.toFixed(1);
};

export default function HeroCard() {
  const [data, setData] = useState<Hero[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [selectedAttr, setSelectedAttr] = useState<string>("none");

  const fetchData = async () => {
    const API_URL = "https://api.opendota.com/api/heroStats";
    const res = await fetch(API_URL);
    const jsonData = await res.json();
    setHeroes(jsonData);
    setData(jsonData);
  };

  const findHero = (e: any) => {
    let filtered: any;

    if (selectedAttr !== e.target.name) {
      switch (e.target.name) {
        case "str":
          filtered = data.filter((hero: any) => hero.primary_attr === "str");
          setHeroes(filtered);
          break;
        case "agi":
          filtered = data.filter((hero: any) => hero.primary_attr === "agi");
          setHeroes(filtered);
          break;
        case "int":
          filtered = data.filter((hero: any) => hero.primary_attr === "int");
          setHeroes(filtered);
          break;
        case "uni":
          filtered = data.filter((hero: any) => hero.primary_attr === "all");
          setHeroes(filtered);
          break;
        default:
          break;
      }
      setSelectedAttr(e.target.name);
    } else {
      setSelectedAttr("none");
      setHeroes(data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={styles.paperContainer}>
      <Grid
        className="button"
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{
          paddingTop: 2,
        }}
      >
        <Grid item xs={9}>
          <Grid
            className="button"
            container
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            sx={{
              // width: 300,
              height: 80,
              backgroundColor: "wheat",
              borderRadius: 2,
            }}
          >
            <Grid item>
              <Button
                name="str"
                variant="contained"
                onClick={(e) => findHero(e)}
              >
                STR
              </Button>
            </Grid>
            <Grid item>
              <Button
                name="agi"
                variant="contained"
                onClick={(e) => findHero(e)}
              >
                AGI
              </Button>
            </Grid>
            <Grid item>
              <Button
                name="int"
                variant="contained"
                onClick={(e) => findHero(e)}
              >
                INT
              </Button>
            </Grid>
            <Grid item>
              <Button
                name="uni"
                variant="contained"
                onClick={(e) => findHero(e)}
              >
                ALL
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid className="outer" container>
        <Grid
          className="inner"
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          {heroes.map((hero: any, i: number) => (
            <Grid
              className="incard"
              container
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
              sx={{ width: 300 }}
              key={i}
            >
              <Grid
                className="card"
                item
                sx={{
                  margin: 3,
                  width: 300,
                  height: 370,
                  borderRadius: 3,
                  background:
                    hero.primary_attr === "str"
                      ? "linear-gradient(0deg, #EE4540 10%, #2F1B41 70%)"
                      : hero.primary_attr === "agi"
                      ? "linear-gradient(0deg, #2BA84A 10%, #2F1B41 70%)"
                      : hero.primary_attr === "int"
                      ? "linear-gradient(0deg, #4D4EE6 10%, #2F1B41 70%)"
                      : "linear-gradient(0deg, #4A0074 10%, #2F1B41 70%)",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                  transition: "transform 0.15s ease-in-out",
                }}
              >
                {/* Icon */}
                <Grid
                  className="name-box"
                  container
                  direction="row"
                  justifyContent="space-evenly"
                  alignItems="center"
                  sx={{
                    marginTop: 1,
                  }}
                >
                  <Grid item xs={3}>
                    <Grid
                      className="icon"
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box>
                        <img src={`${URL}${hero.icon}`} alt="icon" width={45} />
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid item xs={4}>
                    <Grid
                      className="movespeed"
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        width: 80,
                        height: 45,
                        borderRadius: 10,
                        backgroundColor: "#FFDCCC",
                      }}
                    >
                      <Grid item xs={4}>
                        <Box>
                          <img
                            src={`./assets/img/icons/speed.png`}
                            alt=""
                            width={20}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h6">{hero.move_speed}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <Grid
                      className="attribute"
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box>
                        <img
                          src={`./assets/img/attributes/${hero.primary_attr}.png`}
                          alt=""
                          width={50}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                {/* Image */}
                <Grid
                  className="image"
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="flex-start"
                  sx={{ mt: 1 }}
                >
                  <Grid
                    item
                    sx={{
                      width: 210,
                      height: 117,
                      border: "2px solid",
                      borderColor: "#FFDCCC",
                    }}
                  >
                    <img src={`${URL}${hero.img}`} alt="hero" width={206} />
                  </Grid>
                  <Grid
                    item
                    xs={10}
                    sx={{
                      paddingTop: 0.2,
                      backgroundColor: "#FFDCCC",
                      borderBottomLeftRadius: 15,
                      borderBottomRightRadius: 15,
                    }}
                  >
                    <Typography variant="body2">
                      {hero.localized_name.toUpperCase()}
                    </Typography>
                  </Grid>
                </Grid>
                {/* Stat */}
                <Grid
                  className="lower"
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ marginTop: 2 }}
                >
                  <Grid className="left-side" item xs={6}>
                    <Grid
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="flex-start"
                    >
                      {/* Left */}
                      <Grid item sx={{ width: 1 / 2 }}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="flex-end"
                          sx={{
                            width: 130,
                            height: 40,
                            bgcolor: "#FFDCCC",
                            borderTopRightRadius: 40,
                          }}
                        >
                          <Grid item xs={3}>
                            <Box>
                              <img
                                src="./assets/img/attributes/str.png"
                                alt="str"
                                width={30}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="h5">
                              {hero.base_str}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} sx={{ marginRight: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              +{hero.str_gain}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="flex-end"
                          sx={{
                            width: 130,
                            height: 40,
                            bgcolor: "#FFDCCC",
                            my: 0.3,
                          }}
                        >
                          <Grid item xs={3}>
                            <Box>
                              <img
                                src="./assets/img/attributes/agi.png"
                                alt="agi"
                                width={30}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="h5">
                              {hero.base_agi}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} sx={{ marginRight: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              +{hero.agi_gain}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="flex-end"
                          sx={{
                            width: 130,
                            height: 40,
                            bgcolor: "#FFDCCC",
                            borderBottomRightRadius: 40,
                          }}
                        >
                          <Grid item xs={3}>
                            <Box>
                              <img
                                src="./assets/img/attributes/int.png"
                                alt="int"
                                width={30}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="h5">
                              {hero.base_int}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} sx={{ marginRight: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              +{hero.int_gain}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid className="right-side" item xs={6}>
                    <Grid
                      container
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {/* Right */}
                      <Grid item sx={{ width: 1 / 2 }}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            mb: 1,
                            width: 90,
                            height: 60,
                            bgcolor: "#FFDCCC",
                            borderRadius: 20,
                          }}
                        >
                          <Grid item xs={3}>
                            <Box>
                              <img
                                src={`./assets/img/icons/atk.png`}
                                alt=""
                                width={20}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="h5">
                              {hero.primary_attr === "all"
                                ? universalDamage(hero)
                                : damageCalc(hero)}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          sx={{
                            mt: 1,
                            width: 90,
                            height: 60,
                            bgcolor: "#FFDCCC",
                            borderRadius: 20,
                          }}
                        >
                          <Grid item xs={3}>
                            <Box>
                              <img
                                src={`./assets/img/icons/armor.png`}
                                alt=""
                                width={20}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="h5">
                              {armorCalc(hero)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}
