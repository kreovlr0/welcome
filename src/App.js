import React, { useState, useRef } from 'react';
import './App.css';

const bananaImg = 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768';
const chickenImg = 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg';

const GRID_SIZE = 6;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

function getRandomTileType() {
  return Math.random() < 0.5 ? 'banana' : 'chicken';
}

function App() {
  const [tiles, setTiles] = useState(Array(TILE_COUNT).fill(null));
  const [revealed, setRevealed] = useState(Array(TILE_COUNT).fill(false));
  const [playerChoice, setPlayerChoice] = useState(null);
  const [mistake, setMistake] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleMusicToggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSelectType = (type) => {
    setPlayerChoice(type);
  };

  const handleClick = (index) => {
    if (gameOver || revealed[index] || playerChoice === null) return;

    const tileType = getRandomTileType();
    const newTiles = [...tiles];
    const newRevealed = [...revealed];

    newTiles[index] = tileType;
    newRevealed[index] = true;

    setTiles(newTiles);
    setRevealed(newRevealed);

    if (tileType !== playerChoice) {
      setMistake(true);
      setGameOver(true);
    } else {
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
      if (newCorrectCount === TILE_COUNT / 2) {
        setGameOver(true);
      }
    }
  };

  const handleRestart = () => {
    setTiles(Array(TILE_COUNT).fill(null));
    setRevealed(Array(TILE_COUNT).fill(false));
    setPlayerChoice(null);
    setMistake(false);
    setGameOver(false);
    setCorrectCount(0);
  };

  const getStatusMessage = () => {
    if (!playerChoice) return 'Choose your side to start: Banana or Chicken';
    if (gameOver) {
      if (mistake) return 'Oops! You clicked the wrong one. You lost!';
      return 'Congratulations! You revealed all correctly and won!';
    }
    return `Click all the ${playerChoice}s without making a mistake! (${correctCount}/18)`;
  };

  return (
    <div className="container">
      <h1>Chicken Banana Minesweeper</h1>

      <audio ref={audioRef} src="/vidrado-em-voce.mp3" loop />
      <div className="music-controls">
        <button onClick={handleMusicToggle}>
          {isPlaying ? 'Pause Music' : 'Play Music'}
        </button>
      </div>

      <div className="buttons">
        <button onClick={() => handleSelectType('banana')} disabled={playerChoice !== null}>
          Play as Banana
        </button>
        <button onClick={() => handleSelectType('chicken')} disabled={playerChoice !== null}>
          Play as Chicken
        </button>
        <button onClick={handleRestart}>Restart Game</button>
      </div>

      <p className="status">{getStatusMessage()}</p>

      <div className="grid">
        {tiles.map((tile, index) => (
          <div key={index} className="square" onClick={() => handleClick(index)}>
            {revealed[index] ? (
              <img
                src={tile === 'banana' ? bananaImg : chickenImg}
                alt={tile}
                className="tile-img"
              />
            ) : (
              <div className="tile-covered">?</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
