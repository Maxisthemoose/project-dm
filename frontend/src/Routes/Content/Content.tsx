import React, { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { Link } from "react-router-dom";
import getSheets from "../../api/getSheets";
import SheetIcon from "../../components/SheetSelector/SheetIcon";

// PDF Content
// View and edit player character sheets
export default function Content() {
  // const authUser = useAuthUser();
  const authHeader = useAuthHeader();
  const [sheets, setSheets] = useState([] as any[]);

  useEffect(() => {
    (async () => {
      // const user = authUser()!;
      const header = authHeader();
      // console.log(user);
      // console.log(header);
      const userCharacterSheets = await getSheets(header);
      setSheets(userCharacterSheets.data.sheets);
      console.log(userCharacterSheets.data.sheets);
    })();
  }, []);

  return (
    <div>
      <div className="pdf-viewer"></div>
      <div className="character-sheet-viewer">
        {
          sheets.map((sheet) => (
            <SheetIcon sheet={sheet} />
          ))
        }
      </div>
      <Link to="/my-content/create-character">
        Create a Character Sheet
      </Link>
    </div>
  )
}