import React, { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams } from "react-router-dom";
import { DnDCharacter, DnDCharacterProfileSheet, DnDCharacterSpellSheet, DnDCharacterStatsSheet } from "dnd-character-sheets";
import getSheet from "../../../api/getSheet";
import updateSheet from "../../../api/updateSheet";

export default function EditCharacter() {
  const params = useParams();
  const [characterDataStats, setCharacterDataStats] = useState({} as DnDCharacter);
  const [characterDataProfile, setCharacterDataProfile] = useState({} as DnDCharacter);
  const [characterDataSpell, setCharacterDataSpell] = useState({} as DnDCharacter);

  const [loading, setLoading] = useState(true);

  const [sheet, setSheet] = useState({} as DnDCharacter);
  const [sheetToSave, setSheetToSave] = useState({} as DnDCharacter);
  const authHeader = useAuthHeader();

  function handleCharacterUpdateStats(character: DnDCharacter) {
    setCharacterDataStats(character);
    update();
  }
  function handleCharacterUpdateProfile(character: DnDCharacter) {
    setCharacterDataProfile(character);
    update();
  }
  function handleCharacterUpdateSpell(character: DnDCharacter) {
    setCharacterDataSpell(character);
    update();
  }

  function update() {
    setSheetToSave({
      ...characterDataStats,
      ...characterDataProfile,
      ...characterDataSpell,
    });
  }

  async function handleSaveEdit() {
    console.log(sheetToSave, authHeader(), params.id!);
    await updateSheet(sheetToSave, authHeader(), params.id!);
  }

  useEffect(() => {
    (async () => {
      // fetch specific with id
      // /api/v1/get-sheet/:id

      const header = authHeader();
      const id = params.id;
      if (!id) window.location.href = "/404";
      const res = await getSheet(header, id!);
      if (res.status === 500) window.location.href = "/404";
      setSheet(res.data.sheet.data);
      console.log(res.data.sheet.data);
      console.log(sheet);

      console.log(loading);
      setLoading(false);
      console.log(loading);
    })();



  }, []);

  return (
    <>
      {!loading ?
        <div className="character-sheet">
          <div className="page">
            <DnDCharacterStatsSheet defaultCharacter={sheet} onCharacterChanged={handleCharacterUpdateStats} />
          </div>
          <div className="page">
            <DnDCharacterProfileSheet defaultCharacter={sheet} onCharacterChanged={handleCharacterUpdateProfile} />
          </div>
          <div className="page">
            <DnDCharacterSpellSheet defaultCharacter={sheet} onCharacterChanged={handleCharacterUpdateSpell} />
          </div>
          <button onClick={handleSaveEdit}>Save Character</button>
          <button>Delete Character</button>
        </div>
        : <p>LOADING</p>}
    </>
  )
}