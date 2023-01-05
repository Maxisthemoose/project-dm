import React from "react";
import "./SheetIcon.css";

export default function SheetIcon({ sheet }: { sheet: any }) {
  return (
    <div className="sheet-icon-wrapper" key={`${sheet._id}-wrapper`} onClick={() => window.location.href = `/my-content/edit/${sheet._id}`}>
      <p className="sheet-icon-name" key={`${sheet._id}-name`}>
        Character Name: {sheet.data.name}
      </p>
      <p className="sheet-icon-race" key={`${sheet._id}-race`}>
        Race: {sheet.data.race}
      </p>
    </div>
  )
}