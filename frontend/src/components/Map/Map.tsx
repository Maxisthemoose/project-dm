//@ts-nocheck
import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { Stage, Layer, Rect, Image } from "react-konva";
import { images as TokenImageArray } from "../../icons/tokens/tokens";
import "./Map.css";
import PerfectScrollBar from "react-perfect-scrollbar";
import useImage from "use-image";
import { ReactComponent as MapDrag } from "../../icons/map-drag.svg";
import { ReactComponent as TokenDrag } from "../../icons/token-drag.svg";

import 'react-perfect-scrollbar/dist/css/styles.css';


const scaleStrength = 1.05;
const maxScale = 20;
const minScale = 0.1;

const URLImage = ({ image, stageRef }: { image: any, stageRef: any }) => {
  const [img] = useImage(image.src);
  // console.log()
  return (
    <Image
      image={img}
      x={image.x + stageRef.current.offsetX()}
      y={image.y + stageRef.current.offsetY()}
      width={50}
      height={50}
      offsetX={(img ? 50 / 2 : 0)}
      offsetY={(img ? 50 / 2 : 0)}
      draggable
    />
  );
};

export default function Map({ socket }: { socket: Socket }) {
  const dragUrl = useRef();
  const stageRef = useRef();
  const [images, setImages] = useState([]);
  const [stageDraggable, setStageDraggable] = useState(false);
  const params = useParams();
  // const [state, setState] = useState({} as any);
  // const [canvasState, setCanvasState] = useState([] as any[]);

  function click(evt: any) {
    // setState(stage);
    // socket.emit("map_update", { room: params.id!, data: state.current });
  }

  useEffect(() => {
    // socket.on("map_update", (data) => {

    // });
  }, []);

  return (
    <div
      className="game-space"
      onDrop={(e) => {
        e.preventDefault();
        // register event position
        stageRef.current.setPointersPositions(e);
        // add image
        console.log(stageRef.current.getPointerPosition());
        setImages(
          images.concat([
            {
              ...stageRef.current.getPointerPosition(),
              src: dragUrl.current,
            },
          ])
        );
      }}
      onDragOver={(e) => e.preventDefault()}>
      <Stage
        draggable={true}
        onWheel={(e) => {
          e.evt.preventDefault();
          const oldScale = stageRef.current.scaleX();
          const pointer = stageRef.current.getPointerPosition();

          const pointTo = {
            x: (pointer.x - stageRef.current.x()) / oldScale,
            y: (pointer.y - stageRef.current.y()) / oldScale,
          }

          const dir = e.evt.deltaY > 0 ? -1 : 1;

          const newScale = dir > 0 ? oldScale * scaleStrength : oldScale / scaleStrength;

          stageRef.current.scale({ x: newScale, y: newScale });
          const newPos = {
            x: pointer.x - pointTo.x * newScale,
            y: pointer.y - pointTo.y * newScale,
          }
          console.log(newPos);
          stageRef.current.position(newPos);
          // stageRef.current.setWidth(stageRef.current.width() * newScale);
        }}
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          backgroundColor: "#27292e",
        }}
      >

        <Layer>
          {/* <Rect width={window.innerWidth} height={window.innerHeight} fill="#23262b" /> */}
          {images.map((image) =>
            <URLImage image={image} stageRef={stageRef} />
          )}
        </Layer>
      </Stage>
      {/* <div className="map-util-toolbar">
        <MapDrag title="Move map around" />
        <TokenDrag title="Move tokens on map around" />
      </div> */}

      <PerfectScrollBar aria-keyshortcuts="" className="token-wrapper">
        {
          TokenImageArray.map((v, i) => (
            <img
              src={v}
              key={`${i}-token`}
              className="token"
              draggable
              onDragStart={(e) => {
                (dragUrl.current as any) = (e.target as HTMLImageElement).src
              }}
            />
          ))
        }
      </PerfectScrollBar>
    </div>
  )
}