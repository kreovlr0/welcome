import React, { useState, useRef } from 'react';
import './App.css';

const bananaImg = 'https://thumbs.dreamstime.com/b/bunch-bananas-6175887.jpg?w=768';
const chickenImg = 'https://thumbs.dreamstime.com/z/full-body-brown-chicken-hen-standing-isolated-white-backgroun-background-use-farm-animals-livestock-theme-49741285.jpg?ct=jpeg';

const GRID_SIZE = 6;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;
const CHICKEN_COUNT = TILE_COUNT / 2;
const BANANA_COUNT = TILE_COUNT / 2;

function generateBalancedTiles() {
  const tiles = Array(CHICKEN_COUNT).fill('chicken').concat(Array(BANANA_COUNT).fill('banana'));
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

function App() {
  const [tiles, setTiles] = useState(generateBalancedTiles());
  const [revealed, setRevealed] = useState(Array(TILE_COUNT).fill(false));
  const [playerChoice, setPlayerChoice] = useState(null);
  const [mistake, setMistake] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
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

    const clickedTile = tiles[index];
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (clickedTile === playerChoice) {
      const newScore = score + 1;
      setScore(newScore);

      if (newScore === TILE_COUNT / 2) {
        setGameOver(true);
        setRevealed(Array(TILE_COUNT).fill(true)); // reveal all
      }
    } else {
      setMistake(true);
      setGameOver(true);
      setRevealed(Array(TILE_COUNT).fill(true)); // reveal all
    }
  };

  const handleRestart = () => {
    setTiles(generateBalancedTiles());
    setRevealed(Array(TILE_COUNT).fill(false));
    setPlayerChoice(null);
    setMistake(false);
    setGameOver(false);
    setScore(0);
  };

  const getStatusMessage = () => {
    if (!playerChoice) return 'Choose your side to start: Banana or Chicken';
    if (gameOver) {
      if (mistake) return `Oops! You clicked the wrong one. You lost with ${score} correct clicks.`;
      return `🎉 You win! All ${score}/18 tiles were correct.`;
    }
    return `Click all ${playerChoice}s without mistake (${score}/18 correct)`;
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
              <div className="tile-covered">{index + 1}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
