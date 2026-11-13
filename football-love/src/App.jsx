
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import "./App.css";

const questions = [
  {
    question: "Aakash, are you better than Everyone? 🐐",
    subtitle: "Please answer carefully.",
    yes: "Obviously! 😎",
  },
  {
    question: "Will you tolerate Pallavi's unlimited nonsense every day? 🤣",
    subtitle: "We suspect you score hat-tricks while sleeping.",
    yes: "I was born for this! 🏆",
  },
  {
    question: "Aakash, are you ready to make Pallavi your favourite human? ⚽💗",
    subtitle: "A very important tactical decision.",
    yes: "She's already VIP! 👑",
  },

  {
    question: "Will you let Pallavi be your biggest fan? ⚽",
    subtitle: "Final quiz question. No pressure, Champ!",
    yes: "Obviously, she's my VIP fan! 😂",
  },
];

const lanes = [
  { name: "LEFT", value: -2.25 },
  { name: "CENTER", value: 0 },
  { name: "RIGHT", value: 2.25 },
];

function StadiumLights() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-7, 6, -4]} intensity={35} color="#b9d9ff" />
      <pointLight position={[7, 6, -4]} intensity={35} color="#ffe2a6" />
      <hemisphereLight args={["#b9d8ff", "#174b27", 1]} />
    </>
  );
}

function Stadium() {
  return (
    <group>
      {/* Grass pitch */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        receiveShadow
      >
        <planeGeometry args={[13, 19]} />
        <meshStandardMaterial color="#16823e" roughness={1} />
      </mesh>

      {/* Pitch stripes */}
      {[-5.5, -3.5, -1.5, 0.5, 2.5, 4.5].map((z, i) => (
        <mesh
          key={z}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.055, z]}
        >
          <planeGeometry args={[13, 2]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#1b9146" : "#14783a"}
          />
        </mesh>
      ))}

      {/* White pitch markings */}
      <mesh position={[0, 0.005, 0]}>
        <boxGeometry args={[12.5, 0.025, 0.035]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0.005, 8.8]}>
        <boxGeometry args={[12.5, 0.025, 0.035]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-6.2, 0.005, 0]}>
        <boxGeometry args={[0.035, 0.025, 17.6]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[6.2, 0.005, 0]}>
        <boxGeometry args={[0.035, 0.025, 17.6]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Centre line */}
      <mesh position={[0, 0.006, 0]}>
        <boxGeometry args={[12.4, 0.025, 0.035]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Centre circle */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.012, 0]}
      >
        <ringGeometry args={[1.65, 1.69, 64]} />
        <meshBasicMaterial color="white" side={THREE.DoubleSide} />
      </mesh>

      {/* Penalty area */}
      <mesh position={[0, 0.012, -5.1]}>
        <boxGeometry args={[7.5, 0.025, 0.035]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-3.75, 0.012, -4.05]}>
        <boxGeometry args={[0.035, 0.025, 2.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[3.75, 0.012, -4.05]}>
        <boxGeometry args={[0.035, 0.025, 2.1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Stadium stands */}
      <mesh position={[0, 1.1, -10]}>
        <boxGeometry args={[18, 2.5, 1]} />
        <meshStandardMaterial color="#172747" />
      </mesh>
      <mesh position={[-8, 1.1, 0]}>
        <boxGeometry args={[1, 2.5, 20]} />
        <meshStandardMaterial color="#172747" />
      </mesh>
      <mesh position={[8, 1.1, 0]}>
        <boxGeometry args={[1, 2.5, 20]} />
        <meshStandardMaterial color="#172747" />
      </mesh>

      {/* Crowd-like coloured seats */}
      {Array.from({ length: 45 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            -8.4 + (i % 15) * 1.2,
            2.2 + Math.floor(i / 15) * 0.45,
            -9.35,
          ]}
        >
          <boxGeometry args={[0.55, 0.25, 0.2]} />
          <meshStandardMaterial
            color={["#ffcf54", "#ff5b8b", "#6ecbff", "#ffffff"][i % 4]}
          />
        </mesh>
      ))}
    </group>
  );
}

function Goal() {
  const postMaterial = <meshStandardMaterial color="#ffffff" metalness={0.3} />;

  return (
    <group position={[0, 0, -7.1]}>
      {/* Goal posts */}
      <mesh position={[-3, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 2.5, 16]} />
        {postMaterial}
      </mesh>
      <mesh position={[3, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.09, 2.5, 16]} />
        {postMaterial}
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[6.1, 0.16, 0.16]} />
        {postMaterial}
      </mesh>

      {/* Goal net back */}
      <mesh position={[0, 1.25, -0.8]}>
        <boxGeometry args={[5.9, 2.4, 0.04]} />
        <meshStandardMaterial
          color="#d9e8ff"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Net side depth */}
      {[-2.95, 2.95].map((x) => (
        <mesh key={x} position={[x, 1.2, -0.4]}>
          <boxGeometry args={[0.05, 2.4, 0.8]} />
          <meshStandardMaterial color="#e9f2ff" wireframe />
        </mesh>
      ))}
    </group>
  );
}

function Player() {
  return (
    <group position={[0, 0, 4.2]}>
      {/* Head */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.36, 24, 24]} />
        <meshStandardMaterial color="#bd8055" roughness={0.8} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.98, -0.02]}>
        <sphereGeometry args={[0.34, 20, 12, 0, Math.PI * 2, 0, 1]} />
        <meshStandardMaterial color="#171717" />
      </mesh>

      {/* Jersey */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[0.95, 1.15, 0.5]} />
        <meshStandardMaterial color="#1266d5" roughness={0.6} />
      </mesh>

      {/* Jersey number */}
      <Text
        position={[0, 1.05, 0.265]}
        fontSize={0.65}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#08244f"
      >
        7
      </Text>

      {/* Arms */}
      {[-0.65, 0.65].map((x) => (
        <mesh
          key={x}
          position={[x, 1.08, 0]}
          rotation={[0, 0, x < 0 ? -0.3 : 0.3]}
          castShadow
        >
          <capsuleGeometry args={[0.13, 0.65, 4, 8]} />
          <meshStandardMaterial color="#bd8055" />
        </mesh>
      ))}

      {/* Shorts */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.85, 0.4, 0.48]} />
        <meshStandardMaterial color="#f1f4ff" />
      </mesh>

      {/* Legs */}
      {[-0.24, 0.24].map((x) => (
        <group key={x}>
          <mesh position={[x, -0.12, 0]} castShadow>
            <capsuleGeometry args={[0.14, 0.55, 4, 8]} />
            <meshStandardMaterial color="#bd8055" />
          </mesh>
          <mesh position={[x, -0.45, 0.12]}>
            <boxGeometry args={[0.3, 0.14, 0.5]} />
            <meshStandardMaterial color="#111827" />
          </mesh>
        </group>
      ))}

      <Text
        position={[0, 2.25, 0]}
        fontSize={0.22}
        color="#ffdf67"
        anchorX="center"
      >
        AAKASH
      </Text>
    </group>
  );
}

function Goalkeeper({ targetX }) {
  const keeper = useRef();

  useFrame((_, delta) => {
    if (!keeper.current) return;

    keeper.current.position.x = THREE.MathUtils.damp(
      keeper.current.position.x,
      targetX,
      5,
      delta
    );

    const diveDirection = targetX - keeper.current.position.x;
    keeper.current.rotation.z = THREE.MathUtils.damp(
      keeper.current.rotation.z,
      diveDirection * 0.5,
      4,
      delta
    );
  });

  return (
    <group ref={keeper} position={[0, 0, -6.35]}>
      {/* Keeper body */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.38, 0.65, 5, 12]} />
        <meshStandardMaterial color="#f0a52d" />
      </mesh>

      {/* Keeper head */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshStandardMaterial color="#bd8055" />
      </mesh>

      {/* Keeper arms */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.45, 1.2, 0]}>
          <mesh rotation={[0, 0, side * -0.8]}>
            <capsuleGeometry args={[0.13, 0.65, 4, 8]} />
            <meshStandardMaterial color="#f0a52d" />
          </mesh>
          <mesh position={[side * 0.35, 0.2, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* Keeper legs */}
      {[-0.2, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.25, 0]}>
          <capsuleGeometry args={[0.13, 0.4, 4, 8]} />
          <meshStandardMaterial color="#202c52" />
        </mesh>
      ))}
    </group>
  );
}

function Football({ shot, onFinish }) {
  const ball = useRef();
  const progress = useRef(0);
  const finished = useRef(false);

  useFrame((_, delta) => {
    if (!ball.current || !shot || finished.current) return;

    progress.current = Math.min(progress.current + delta / 1.15, 1);

    const t = progress.current;
    const eased = t * t * (3 - 2 * t);

    const x = THREE.MathUtils.lerp(0, shot.lane, eased);
    const z = THREE.MathUtils.lerp(3.05, -6.6, eased);
    const y = 0.25 + Math.sin(t * Math.PI) * 1.4;

    ball.current.position.set(x, y, z);
    ball.current.rotation.x += delta * 9;
    ball.current.rotation.z += delta * 7;
    ball.current.scale.setScalar(1 - t * 0.15);

    if (t >= 1 && !finished.current) {
      finished.current = true;
      onFinish();
    }
  });

  return (
    <mesh ref={ball} position={[0, 0.25, 3.05]} castShadow>
      <sphereGeometry args={[0.25, 24, 24]} />
      <meshStandardMaterial color="white" roughness={0.7} />
    </mesh>
  );
}

function FootballScene({ shot, keeperLane, onFinish }) {
  return (
    <>
      <StadiumLights />
      <Stadium />
      <Goal />
      <Player />
      <Goalkeeper targetX={keeperLane} />

      {!shot && (
        <mesh position={[0, 0.25, 3.05]} castShadow>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color="white" roughness={0.7} />
        </mesh>
      )}

      {shot && (
        <Football
          key={shot.id}
          shot={shot}
          onFinish={onFinish}
        />
      )}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.65}
        maxPolarAngle={1.25}
        minAzimuthAngle={-0.25}
        maxAzimuthAngle={0.25}
      />
    </>
  );
}

export default function App() {
  const [page, setPage] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ left: 65, top: 55 });

  const [goals, setGoals] = useState(0);
  const [shotsTaken, setShotsTaken] = useState(0);
  const [selectedLane, setSelectedLane] = useState(0);
  const [keeperLane, setKeeperLane] = useState(0);
  const [shot, setShot] = useState(null);
  const [shotResult, setShotResult] = useState("");
  const [gameFinished, setGameFinished] = useState(false);

  const moveNoButton = () => {
    setNoCount((count) => count + 1);
    setNoPosition({
      left: Math.floor(Math.random() * 65) + 5,
      top: Math.floor(Math.random() * 65) + 5,
    });
  };

  const answerYes = () => {
    if (quizIndex < questions.length - 1) {
      setQuizIndex((index) => index + 1);
      setNoPosition({ left: 65, top: 55 });
    } else {
      setPage(2);
    }
  };

  const shootBall = () => {
    if (shot || shotsTaken >= 3) return;

    const keeper = lanes[Math.floor(Math.random() * lanes.length)].value;
    const scored = selectedLane !== keeper;

    setKeeperLane(keeper);
    setShotResult("");
    setShot({
      id: Date.now(),
      lane: selectedLane,
      scored,
    });
  };

  const finishShot = () => {
    if (!shot) return;

    if (shot.scored) {
      setGoals((value) => value + 1);
      setShotResult("⚽ GOOOOAL! WHAT A SHOT, AAKASH!");
    } else {
      setShotResult("🧤 AMAZING SAVE BY PALLAVI!");
    }

    setShotsTaken((value) => {
      const next = value + 1;
      if (next >= 3) setGameFinished(true);
      return next;
    });

    setShot(null);
  };

  const restartGame = () => {
    setPage(0);
    setQuizIndex(0);
    setNoCount(0);
    setNoPosition({ left: 65, top: 55 });
    setGoals(0);
    setShotsTaken(0);
    setSelectedLane(0);
    setKeeperLane(0);
    setShot(null);
    setShotResult("");
    setGameFinished(false);
  };

  return (
    <main className="stadium-page">
      <section className="game-card">
        <header className="scoreboard">
          <div className="scoreboard-title">🏆 THE CHAMP LEAGUE</div>
          <div className="scoreboard-subtitle">
            AAKASH VS PALLAVI • THE FRIENDSHIP CUP
          </div>
        </header>

        {page === 0 && (
          <div className="screen">
            <div className="hero-icon">⚽</div>
            <span className="tag">SPECIAL MATCH</span>
            <h1>
              WELCOME TO
              <span>THE CHAMP LEAGUE</span>
            </h1>
            <p className="description">
              A special football challenge created for the one and only AAKASH!
            </p>

            <div className="match-box">
              <p>TONIGHT'S BIG MATCH</p>
              <h2>AAKASH 🆚 PALLAVI</h2>
              <div className="teams">
                <strong>AAKASH ⚽</strong>
                <span>VS</span>
                <strong>PALLAVI 👑</strong>
              </div>
              <p className="small-note">
                First, pass the friendship challenge!
              </p>
            </div>

            <button className="pink-button" onClick={() => setPage(1)}>
              START THE CHALLENGE 🚀
            </button>
          </div>
        )}

        {page === 1 && (
          <div className="screen">
            <span className="tag">BFF CHALLENGE 💗</span>
            <h1>ONE TEAM, ONE FRIENDSHIP!</h1>

            <div className="progress">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index <= quizIndex ? "active" : ""}`}
                />
              ))}
            </div>

            <p className="question-count">
              QUESTION {quizIndex + 1} / {questions.length}
            </p>

            <div className="question-box">
              <div className="hero-icon">😎</div>
              <h2>{questions[quizIndex].question}</h2>
              <p>{questions[quizIndex].subtitle}</p>
            </div>

            <div className="choice-area">
              <button className="yes-button" onClick={answerYes}>
                {questions[quizIndex].yes}
              </button>
              <button
                className="no-button"
                style={{
                  left: `${noPosition.left}%`,
                  top: `${noPosition.top}%`,
                }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                onClick={moveNoButton}
              >
                NO 🙅
              </button>
            </div>

            <p className="funny-message">
              {noCount > 0
                ? `You tried ${noCount} times! The NO button is too fast! 😂`
                : "Choose wisely, Champ! 😁"}
            </p>
          </div>
        )}

        {page === 2 && (
          <div className="screen">
            <span className="tag">3D PENALTY SHOOTOUT ⚽</span>
            <h1>TIME TO SCORE, AAKASH!</h1>

            <div className="match-score">
              <div>
                <strong>AAKASH</strong>
                <span>{goals} GOALS</span>
              </div>
              <div className="versus">VS</div>
              <div>
                <strong>PALLAVI</strong>
                <span>{shotsTaken} SHOTS</span>
              </div>
            </div>

            <div className="shot-count">
              {gameFinished
                ? "FULL TIME!"
                : `SHOT ${shotsTaken + 1} / 3`}
            </div>

            <div className="scene-frame">
              <Canvas
                shadows
                camera={{ position: [0, 7.5, 13], fov: 43 }}
                dpr={[1, 2]}
              >
                <color attach="background" args={["#07172b"]} />
                <fog attach="fog" args={["#07172b", 17, 30]} />
                <FootballScene
                  shot={shot}
                  keeperLane={keeperLane}
                  onFinish={finishShot}
                />
              </Canvas>
              <div className="scene-caption">
                AAKASH • JERSEY NUMBER 7
              </div>
            </div>

            {!gameFinished && (
              <>
                <p className="description">
                  Choose your shooting direction!
                </p>

                <div className="shoot-buttons">
                  {lanes.map((lane) => (
                    <button
                      key={lane.name}
                      className={`shoot-button ${
                        selectedLane === lane.value ? "selected" : ""
                      }`}
                      onClick={() => !shot && setSelectedLane(lane.value)}
                      disabled={!!shot}
                    >
                      {lane.name}
                    </button>
                  ))}
                </div>

                <button
                  className="pink-button shoot-main"
                  onClick={shootBall}
                  disabled={!!shot}
                >
                  {shot ? "BALL IN MOTION..." : "KICK THE BALL! ⚽"}
                </button>
              </>
            )}

            {shotResult && (
              <div className="shot-result">{shotResult}</div>
            )}

            {gameFinished && !shot && (
              <div className="question-box">
                <h2>FULL TIME! 🏆</h2>
                <p>AAKASH scored {goals} out of 3 penalties!</p>
                <button
                  className="pink-button"
                  onClick={() => setPage(3)}
                >
                  GET YOUR CERTIFICATE 🎓
                </button>
              </div>
            )}
          </div>
        )}

        {page === 3 && (
          
<div className="final-celebration">
  <h1>🏆 THE CHAMP & QUEEN 🏆</h1>
  <p className="final-subtitle">
    One football, two legends, one unbreakable bond! 💗
  </p>

  <img
    src="/dudu-bubu-football.png.gif"
    alt="Champ Akash and Queen Pallavi celebrating football"
    className="dudu-bubu-image"
  />

  <div className="bear-titles">
    <span>👑 CHAMP — AKASH</span>
    <span>💖 QUEEN — PALLAVI</span>
  </div>

  <h2>Best Friends. Best Team. Forever! ⚽</h2>

  <p>Game over? Never! Our friendship is forever. 🥹💕</p>

  <button onClick={() => window.location.reload()}>
    PLAY AGAIN ⚽
  </button>
</div>

        )}

        <footer>MADE WITH ❤️ FOR AAKASH • THE CHAMP</footer>
      </section>
    </main>
  );
}
