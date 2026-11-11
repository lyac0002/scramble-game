
/**************************************************
 * STARTER CODE
 **************************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 * depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string
 */
function shuffle(src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**************************************************
 * YOUR CODE BELOW
 **************************************************/

// Words for the game
const originalWords = [
  "apple",
  "banana",
  "orange",
  "school",
  "computer",
  "flower",
  "summer",
  "window",
  "planet",
  "guitar"
];

function App() {

  // Words left
  const [words, setWords] = React.useState(
    JSON.parse(localStorage.getItem("words")) || shuffle(originalWords)
  );

  // Points
  const [points, setPoints] = React.useState(
    Number(localStorage.getItem("points")) || 0
  );

  // Strikes
  const [strikes, setStrikes] = React.useState(
    Number(localStorage.getItem("strikes")) || 0
  );

  // Passes
  const [passes, setPasses] = React.useState(
    localStorage.getItem("passes") === null
      ? 3
      : Number(localStorage.getItem("passes"))
  );

  // Guess and message
  const [guess, setGuess] = React.useState("");
  const [message, setMessage] = React.useState("");

  // Scrambled word
  const [scrambled, setScrambled] = React.useState(
    localStorage.getItem("scrambled") || shuffle(words[0] || "")
  );

  // Save progress
  React.useEffect(() => {
    localStorage.setItem("words", JSON.stringify(words));
    localStorage.setItem("points", points);
    localStorage.setItem("strikes", strikes);
    localStorage.setItem("passes", passes);
    localStorage.setItem("scrambled", scrambled);
  }, [words, points, strikes, passes, scrambled]);

  // Check game over
  const gameOver = words.length === 0 || strikes >= 5;

  // Go to next word
  function nextWord() {
    const newWords = words.slice(1);

    setWords(newWords);

    if (newWords.length > 0) {
      setScrambled(shuffle(newWords[0]));
    } else {
      setScrambled("");
    }
  }

  // Check answer
  function checkGuess(event) {
    event.preventDefault();

    if (gameOver || guess.trim() === "") {
      return;
    }

    if (guess.trim().toLowerCase() === words[0].toLowerCase()) {
      setPoints(points + 1);
      setMessage("Correct! Good job!");
      nextWord();
    } else {
      setStrikes(strikes + 1);
      setMessage("Incorrect! Try again.");
    }

    setGuess("");
  }

  // Pass a word
  function passWord() {
    if (passes > 0 && !gameOver) {
      setPasses(passes - 1);
      setMessage("Word skipped!");
      setGuess("");
      nextWord();
    }
  }

  // Play again
  function restartGame() {
    const newWords = shuffle(originalWords);

    setWords(newWords);
    setPoints(0);
    setStrikes(0);
    setPasses(3);
    setGuess("");
    setMessage("");
    setScrambled(shuffle(newWords[0]));
  }

  return (
    <div className="game">

      <h1>Scramble Game</h1>
      <p>Guess the scrambled word!</p>

      <p>Points: {points}</p>
      <p>Strikes: {strikes}/5</p>
      <p>Passes: {passes}</p>

      {gameOver ? (
        <div>
          <h2>Game Over!</h2>
          <p>Your final score: {points}</p>

          <button onClick={restartGame}>
            Play Again
          </button>
        </div>
      ) : (
        <div>
          <h2>{scrambled}</h2>

          <form onSubmit={checkGuess}>
            <input
              type="text"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              placeholder="Enter your guess"
            />

            <button type="submit">
              Guess
            </button>
          </form>

          <button
            onClick={passWord}
            disabled={passes === 0}
          >
            Pass
          </button>

          <p>{message}</p>
          <p>Words left: {words.length}</p>

        </div>
      )}

    </div>
  );
}

// Display React game
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
