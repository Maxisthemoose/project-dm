import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat/Chat";
import { Link, useParams } from "react-router-dom";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import io from "socket.io-client";
import "./Room.css";
import Map from "../../components/Map/Map";
import { ArrowDropDown, ChatBubble } from "@mui/icons-material";
import GameToolBar from "../../components/GameToolBar/GameToolBar";
import { DnDCharacter } from "dnd-character-sheets";
import { Button } from "@mui/material";
import Dropdown from "react-dropdown";
import getSheets from "../../api/getSheets";

import "react-dropdown/style.css";

const socket = io(process.env.REACT_APP_BASE_URL!);

export default function Room() {
  const authHeader = useAuthHeader();
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [allSheets, setAllSheets] = useState([] as ({ data: DnDCharacter; _id: string; })[]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      console.log(allSheets, "in effect");
      allSheets.map((v) => v);
      const header = authHeader();
      const res = await getSheets(header);
      const data = res.data;
      setAllSheets(data.sheets);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="game-window">
      {
        loading ?
          <>Loading...</>
          :
          selectedSheet !== null ?
            <>
              <div className="game-toolbar">
                <GameToolBar socket={socket} character={selectedSheet as { data: DnDCharacter, _id: string }} />
              </div>
              <Map socket={socket} />
            </>
            :
            <>
              {/* Window to select character */}
              <div className="character-select">

                <Dropdown options={
                  allSheets.length < 1 ? ["Create a Character"] : allSheets.map(v => v.data.name!)
                }

                  //@ts-ignore
                  onChange={(o) => {
                    if (o.value === "Create a Character")
                      window.location.href = "/my-content";
                    //@ts-ignore
                    setSelectedSheet(allSheets.find(v => v.data.name === o.value))
                  }}
                  placeholder="Select a character..."
                />
              </div>
            </>


      }
    </div>
  )
}