import React, { useState } from "react";
// import { CharacterName } from "./CharacterComponents";
import "./CreateCharacter.css";
import { DnDCharacterProfileSheet, DnDCharacter, DnDCharacterSpellSheet, DnDCharacterStatsSheet } from "dnd-character-sheets";
import "dnd-character-sheets/dist/index.css";
import saveSheet from "../../../api/saveSheet";
import { useAuthHeader } from "react-auth-kit";

export default function CreateCharacter() {

  const [characterDataStats, setCharacterDataStats] = useState({} as DnDCharacter);
  const [characterDataProfile, setCharacterDataProfile] = useState({} as DnDCharacter);
  const [characterDataSpell, setCharacterDataSpell] = useState({} as DnDCharacter);
  const authHeader = useAuthHeader();
  function handleCharacterUpdateStats(character: DnDCharacter) {
    setCharacterDataStats(character);
  }
  function handleCharacterUpdateProfile(character: DnDCharacter) {
    setCharacterDataProfile(character);
  }
  function handleCharacterUpdateSpell(character: DnDCharacter) {
    setCharacterDataSpell(character);
  }

  async function handleSave() {
    const header = authHeader();

    const characterSheet = {
      ...characterDataStats,
      ...characterDataProfile,
      ...characterDataSpell,
    }
    // console.log(characterSheet);
    const res = await saveSheet(characterSheet, header);
    if (res.status === 200)
      window.location.href = "/my-content";
  }

  return (
    <div className="character-sheet">
      <div className="page">
        <DnDCharacterStatsSheet onCharacterChanged={handleCharacterUpdateStats} />
      </div>
      <div className="page">
        <DnDCharacterProfileSheet onCharacterChanged={handleCharacterUpdateProfile} />
      </div>
      <div className="page">
        <DnDCharacterSpellSheet onCharacterChanged={handleCharacterUpdateSpell} />
      </div>
      <button onClick={handleSave}>Save Character</button>
    </div>
  )
}