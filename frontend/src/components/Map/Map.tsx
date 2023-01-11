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
// import { ReactComponent as TokenDrag } from "../../icons/token-drag.svg";
import Grass from "../../assets/grass.png";
import { ReactComponent as Close } from "../../icons/close.svg";
import { ReactComponent as Arrow } from "../../icons/arrow-down.svg";
import { v4 } from "uuid";
import ReactModal from "react-modal";
import 'react-perfect-scrollbar/dist/css/styles.css';



const scaleStrength = 1.05;
const maxScale = 10;
const minScale = 0.6;
let currScale = 1;

const GUIDELINE_OFFSET = 20;

export default function Map({ socket }: { socket: Socket }) {
  const dragUrl = useRef();
  const dragName = useRef();
  const dragWidthHeight = useRef();
  const stageRef = useRef();
  const layerRef = useRef();
  const [tokenImages, setTokenImages] = useState([]);
  const [mapImages, setMapImages] = useState([]);
  const [utilOpen, setUtilOpen] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ x: window.innerWidth, y: window.innerHeight });
  const [imageSelectionOpen, setImageSelectionOpen] = useState(false);
  const params = useParams();

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
        name="token"
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

  //TODO: TRANSMIT TO OTHER CLIENTS
  const MAPImage = ({ image }: { image: any }) => {
    const [img] = useImage(image.src);
    console.log(dragWidthHeight.current, "IN MAP");
    return (
      <Image
        image={img}
        x={image.x}
        y={image.y}
        width={1100}
        height={1100}
        offsetX={(img ? 50 / 2 : 0)}
        offsetY={(img ? 50 / 2 : 0)}
        draggable
        name="token"
        onDragMove={(evt) => {
          const target = evt.currentTarget;
          const identifier = target.attrs["data-identifier"].split("=");
          const imgInArray = mapImages.find(v => v.id === identifier[0] && v.name === identifier[1]);
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
          const imgInArray = mapImages.find(v => v.id === identifier[0] && v.name === identifier[1]);
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

  function getLineGuideStops() {

    const width = stageRef.current.width();
    const height = stageRef.current.height();

    const offSet = stageRef.current.getPosition();

    // const x = offSet.x;
    // const y = offSet.y;
    // console.log(offSet);
    // console.log("A");

    // size in pixels
    const stepSize = 50 * currScale;

    let startX = offSet.x;
    let startY = offSet.y;

    const endX = (Math.abs(startX) === startX && startX !== 0) ? 0 : width + (Math.abs(startX) === startX) ? width : -width;
    const endY = (Math.abs(startY) === startY && startY !== 0) ? 0 : height + (Math.abs(startY) === startY) ? height : - height;
    const boundsX = [];
    const boundsY = [];

    if (startX < endX) {
      while (startX <= endX) {
        boundsX.push(startX);
        startX += stepSize;
      }
    } else {
      while (startX >= endX) {
        boundsX.push(startX);
        startX -= stepSize;
      }
    }

    if (startY < endY) {
      while (startY <= endY) {
        boundsY.push(startY);
        startY += stepSize;
      }
    } else {
      while (startY >= endY) {
        boundsY.push(startY);
        startY -= stepSize;
      }
    }
    return {
      vertical: boundsX.flat(),
      horizontal: boundsY.flat(),
    };
  }

  function getObjectSnappingEdges(node) {
    const box = node.getClientRect();
    const pos = node.absolutePosition();

    return {
      vertical: [
        {
          guide: Math.round(box.x),
          offset: Math.round(pos.x - box.x),
          snap: 'start',
        },
      ],
      horizontal: [
        {
          guide: Math.round(box.y),
          offset: Math.round(pos.y - box.y),
          snap: 'start',
        },
      ],
    }
  }


  function getGuides(lineGuideStops, itemBounds) {
    const resultV = [];
    const resultH = [];

    lineGuideStops.vertical.forEach((lineGuide) => {
      itemBounds.vertical.forEach((itemBound) => {
        const diff = Math.abs(lineGuide - itemBound.guide);
        // if the distance between guild line and object snap point is close we can consider this for snapping
        if (diff < GUIDELINE_OFFSET * currScale) {
          resultV.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
          });
        }
      });
    });

    lineGuideStops.horizontal.forEach((lineGuide) => {
      itemBounds.horizontal.forEach((itemBound) => {
        const diff = Math.abs(lineGuide - itemBound.guide);
        if (diff < GUIDELINE_OFFSET * currScale) {
          resultH.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
          });
        }
      });
    });

    const guides = [];

    const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
      guides.push({
        lineGuide: minV.lineGuide,
        offset: minV.offset,
        orientation: 'V',
        snap: minV.snap,
      });
    }
    if (minH) {
      guides.push({
        lineGuide: minH.lineGuide,
        offset: minH.offset,
        orientation: 'H',
        snap: minH.snap,
      });
    }
    return guides;
  }



  return (
    <>
      <div
        className="game-space"
        onDrop={(e) => {
          e.preventDefault();
          stageRef.current.setPointersPositions(e);
          if (!dragName.current.includes("map")) {
            const newData = {
              ...stageRef.current.getRelativePointerPosition(),
              src: dragUrl.current,
              name: dragName.current,
              id: v4(),
            };
            setTokenImages((old) => [...old, newData]);
            updateClientsOnDrop(newData);
          } else {
            const newData = {
              ...stageRef.current.getRelativePointerPosition(),
              src: dragUrl.current,
              name: dragName.current.split(" ")[1],
              id: v4(),
            };
            console.log(newData);;
            setMapImages((old) => [...old, newData]);
            console.log(mapImages);
          }

        }}
        onDragOver={(e) => e.preventDefault()}>
        <Stage
          scale={1}
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
            currScale = newScale;
            if (newScale > maxScale || newScale < minScale) return;
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

          <Layer
            ref={layerRef}
            onDragMove={(evt => {

              layerRef.current.find(".guide-line").forEach((l) => l.destroy());


              const lineGuideStops = getLineGuideStops();
              const itemBounds = getObjectSnappingEdges(evt.target);
              const guides = getGuides(lineGuideStops, itemBounds);

              if (!guides.length) return;

              const pos = evt.target.absolutePosition();

              guides.forEach((lg) => {
                switch (lg.snap) {
                  case "start": {
                    switch (lg.orientation) {
                      case "V":
                        pos.x = lg.lineGuide + lg.offset;
                        break;
                      case "H": {
                        pos.y = lg.lineGuide + lg.offset;
                        break;
                      }
                    }
                    break;
                  }
                  case "end": {
                    switch (lg.orientation) {
                      case "V": {
                        pos.x = lg.lineGuide + lg.offset;
                        break;
                      }
                      case "H": {
                        pos.y = lg.lineGuide + lg.offset;
                        break;
                      }
                    }
                    break;
                  }
                }
              });
              evt.target.absolutePosition(pos);

            })}
            onDragEnd={(evt) => {
              // console.log(evt.target.getPosition());
              layerRef.current.find(".guide-line").forEach((l) => l.destroy());
            }}>

            {
              mapImages.map((image) => (
                <MAPImage image={image} />
              ))
            }

            {
              tokenImages.map((image) =>
                <URLImage image={image} />
              )
            }

            {/* https://konvajs.org/docs/sandbox/Objects_Snapping.html#page-title */}
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
              <ImageSelection className="child-util" title="Select a map background" onClick={() => setImageSelectionOpen(true)} />
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

      {
        imageSelectionOpen &&
        <>
          <Close className="close-map-selector" onClick={() => setImageSelectionOpen(false)} />
          <div className="select-map">
            <img
              className={`map Grass`}
              src={Grass}
              onDragStart={(e) => {
                (dragUrl.current as any) = (e.target as HTMLImageElement).src;
                (dragName.current as any) = (e.target as HTMLImageElement).className;
                (dragWidthHeight.current as any) = { width: (e.target as HTMLImageElement).width, height: (e.target as HTMLImageElement).height }
                console.log(dragWidthHeight.current)
              }} />
          </div>
        </>
      }

    </>
  )
}