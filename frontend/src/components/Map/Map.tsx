import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Socket } from "socket.io-client";
import { Stage, Layer, Rect, Image } from "react-konva";
// import BarbarianPNG from "../../icons/tokens/barbarian.png";
import { images } from "../../icons/tokens/tokens";
import "./Map.css";
import PerfectScrollBar from "react-perfect-scrollbar";
import useImage from "use-image";
import 'react-perfect-scrollbar/dist/css/styles.css';

const URLImage = ({ image }: { image: any }) => {
  const [img] = useImage(image.src);
  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      // I will use offset to set origin to the center of the image
      offsetX={img ? img.width / 2 : 0}
      offsetY={img ? img.height / 2 : 0}
    />
  );
};

export default function Map({ socket }: { socket: Socket }) {
  let stage = useRef(null);
  const dragUrl = React.useRef();
  const params = useParams();
  const [state, setState] = useState({} as any);

  const [canvasState, setCanvasState] = useState([]);

  function click(evt: any) {
    setState(stage);
    socket.emit("map_update", { room: params.id!, data: state.current });
  }

  useEffect(() => {
    socket.on("map_update", (data) => {

    });
  }, []);

  return (
    <div className="game-space">
      <Stage ref={stage} onDragEnd={(evt) => click(evt)} width={window.innerWidth} height={window.innerHeight} >
        <Layer>
          <Rect width={window.innerWidth} height={window.innerHeight} fill="#23262b" />
          <URLImage image={<img src={images[0]} />} />
        </Layer>
      </Stage>
      <div className="map-util-toolbar">
      </div>
      <PerfectScrollBar aria-keyshortcuts="" className="token-wrapper">
        {
          images.map((v, i) => (
            <img src={v} key={`${i}-token`} className="token" draggable onDragStart={(e) => (
              (dragUrl.current as any) = (e.target as HTMLImageElement).src
            )} />
          ))
        }
      </PerfectScrollBar>
    </div>
  )
}