import React, { useState } from "react";

export const fetchHeroes = async () => {
  const API_URL = "https://api.opendota.com/api/heroStats";

  let res = await fetch(API_URL);
  return res.json();
};
