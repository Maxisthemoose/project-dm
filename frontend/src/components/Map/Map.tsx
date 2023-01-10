//@ts-nocheck
import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { Stage, Layer, Rect, Image } from "react-konva";
// THIS WILL NEED TO BE UPDATED SO THAT ALL ARE OBJECTS WITH NAMES
// FOR ID AND CHOOSING THE CORRECT IMAGE ON OTHER CLIENTS
import { images as TokenImageArray } from "../../icons/tokens/tokens";
import "./Map.css";
import PerfectScrollBar from "react-perfect-scrollbar";
import useImage from "use-image";
import { ReactComponent as MapDrag } from "../../icons/map-drag.svg";
import { ReactComponent as ImageSelection } from "../../icons/image-selection.svg";
import { ReactComponent as TokenDrag } from "../../icons/token-drag.svg";
import { ReactComponent as Arrow } from "../../icons/arrow-down.svg";
import { v4 } from "uuid";
import 'react-perfect-scrollbar/dist/css/styles.css';


const scaleStrength = 1.05;
const maxScale = 20;
const minScale = 0.1;

export default function Map({ socket }: { socket: Socket }) {
  const dragUrl = useRef();
  const dragName = useRef();
  const stageRef = useRef();
  const [tokenImages, setTokenImages] = useState([]);
  const [utilOpen, setUtilOpen] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ x: window.innerWidth, y: window.innerHeight });
  const params = useParams();
  // const [state, setState] = useState({} as any);
  // const [canvasState, setCanvasState] = useState([] as any[]);

  function click(evt: any) {
    // setState(stage);
    // socket.emit("map_update", { room: params.id!, data: state.current });
  }

  function updateClientsOnDrop(newData) {
    socket.emit("token_array_update", { image: newData, room: params.id });
  }

  useEffect(() => {
    window.onresize = (ev) => (setCanvasSize({ x: ev.target.innerWidth, y: ev.target.innerHeight }));

    socket.on("recieve_map", (data) => {
      setTokenImages(data);
      socket.off("recieve_map");
    });

    socket.on("receive_map_update", (data) => {
      setTokenImages(data);
      console.log(tokenImages);
    });

    socket.on("receive_update_on_img_drag_end", (data) => {
      setTokenImages(data);
    });
  }, []);

  const URLImage = ({ image }: { image: any }) => {
    const [img] = useImage(image.src);
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
        onDragMove={(evt) => {
          const target = evt.currentTarget;
          const identifier = target.attrs["data-identifier"].split("=");
          const imgInArray = tokenImages.find(v => v.id === identifier[0] && v.name === identifier[1]);
          const { x, y } = target.attrs;
          imgInArray.x = x;
          imgInArray.y = y;

          socket.emit("update_on_img_drag_end", {
            room: params.id,
            data: {
              identifier,
              x,
              y,
            }
          });

        }}
        onDragEnd={(evt) => {
          const target = evt.currentTarget;
          const identifier = target.attrs["data-identifier"].split("=");
          const imgInArray = tokenImages.find(v => v.id === identifier[0] && v.name === identifier[1]);
          const { x, y } = target.attrs;
          imgInArray.x = x;
          imgInArray.y = y;

          socket.emit("update_on_img_drag_end", {
            room: params.id,
            data: {
              identifier,
              x,
              y,
            }
          });

        }}
        // Generate a unique key so it can be referenced and updated in array
        data-identifier={`${image.id}=${image.name}`}
      />
    );
  };

  return (
    <div
      className="game-space"
      onDrop={(e) => {
        e.preventDefault();
        stageRef.current.setPointersPositions(e);
        const newData = {
          ...stageRef.current.getRelativePointerPosition(),
          src: dragUrl.current,
          name: dragName.current,
          id: v4(),
        };
        setTokenImages((old) => [...old, newData]);
        updateClientsOnDrop(newData);
      }}
      onDragOver={(e) => e.preventDefault()}>
      <Stage
        draggable
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

          stageRef.current.position(newPos);
        }}
        ref={stageRef}
        width={canvasSize.x}
        height={canvasSize.y}
        style={{
          backgroundColor: "#27292e",
        }}
      >

        <Layer>
          {tokenImages.map((image) =>
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
            <MapDrag className="child-util" title="Move map around" />
            <ImageSelection className="child-util" title="Select a map background" />
            {/* <TokenDrag title="Move tokens on map around" /> */}
          </>
        }

      </div>

      <PerfectScrollBar aria-keyshortcuts="" className="token-wrapper">
        {
          TokenImageArray.map((v, i, arr) => (
            <img
              src={v[Object.keys(v)]}
              key={`${i}-token`}
              className={`token ${Object.keys(v)[0]}`}
              draggable
              title={Object.keys(v)[0]}
              onDragStart={(e) => {
                (dragUrl.current as any) = (e.target as HTMLImageElement).src;
                (dragName.current as any) = (e.target as HTMLImageElement).className.split(" ")[1];
              }}
            />
          ))
        }
      </PerfectScrollBar>
    </div>
  )
}