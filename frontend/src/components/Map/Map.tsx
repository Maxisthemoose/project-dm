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
import { ReactComponent as Arrow } from "../../icons/arrow-down.svg";
import 'react-perfect-scrollbar/dist/css/styles.css';


const scaleStrength = 1.05;
const maxScale = 20;
const minScale = 0.1;

const URLImage = ({ image }: { image: any }) => {
  const [img] = useImage(image.src);
  // console.log()
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
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
  const [utilOpen, setUtilOpen] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ x: window.innerWidth, y: window.innerHeight });
  const params = useParams();
  // const [state, setState] = useState({} as any);
  // const [canvasState, setCanvasState] = useState([] as any[]);

  function click(evt: any) {
    // setState(stage);
    // socket.emit("map_update", { room: params.id!, data: state.current });
  }

  useEffect(() => {
    window.onresize = (ev) => {

      console.log(ev.target.innerWidth, ev.target.innerHeight);
      setCanvasSize({ x: ev.target.innerWidth, y: ev.target.innerHeight });
    }
    // socket.on("map_update", (data) => {

    // });
  }, []);

  return (
    <div
      className="game-space"
      onDrop={(e) => {
        e.preventDefault();
        stageRef.current.setPointersPositions(e);
        setImages(
          images.concat([
            {
              ...stageRef.current.getRelativePointerPosition(),
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
          const pointer = stageRef.current.getRelativePointerPosition();
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

          stageRef.current.position(newPos);
          // stageRef.current.setWidth(stageRef.current.width() * newScale);
        }}
        ref={stageRef}
        width={canvasSize.x}
        height={canvasSize.y}
        style={{
          backgroundColor: "#27292e",
        }}
      >

        <Layer>
          {/* <Rect width={window.innerWidth} height={window.innerHeight} fill="#23262b" /> */}
          {images.map((image) =>
            <URLImage image={image} />
          )}
        </Layer>
      </Stage>
      <div className="map-util-toolbar">
        {
          utilOpen ?
            <Arrow className="close-util" onClick={() => setUtilOpen(false)} />
            :
            <Arrow className="open-util" onClick={() => setUtilOpen(true)} />
        }
        {
          utilOpen &&
          <>
            <MapDrag title="Move map around" />
            {/* <TokenDrag title="Move tokens on map around" /> */}
          </>
        }

      </div>

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