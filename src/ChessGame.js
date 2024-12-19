import React, { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "./Chessgame.css";

function ChessGame() {
  const [game, setGame] = useState(new Chess());
  const [history, setHistory] = useState([]); // Historial de movimientos
  const [moveMessage, setMoveMessage] = useState(""); // Mensaje de jugada (válido/inválido)
  let recognition = null; // Definir la variable reconocimiento aquí

  useEffect(() => {
    // Escuchar el evento de presionar teclas
    const handleKeyPress = (event) => {
      if (event.key === "m") {
        autoPressVoiceButton(); // Llama a la función para presionar el botón de voz automáticamente
        console.log("tecla m presionada correctamente");
      } else if (event.key === "n") {
        autoPressUndoButton(); // Llama a la función para presionar el botón de deshacer automáticamente
        console.log("tecla n presionada correctamente");
      }
    };

    // Agregar el evento al montar el componente
    window.addEventListener("keydown", handleKeyPress);

    // Limpiar el evento al desmontar el componente
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const startVoiceControl = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const command =
        event.results[event.results.length - 1][0].transcript.trim();
      console.log("Comando de voz:", command);
      processVoiceCommand(command);
    };

    recognition.onerror = (event) => {
      console.error("Error en el reconocimiento de voz:", event.error);
      stopRecognition(); // Detener el reconocimiento si hay un error
    };

    recognition.start();
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
      recognition = null; // Limpiar el objeto de reconocimiento
    }
  };

  const processVoiceCommand = (command) => {
    const sanitizedCommand = command
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace("to", "");

    const sourceSquare = sanitizedCommand.slice(0, 2);
    const targetSquare = sanitizedCommand.slice(2, 4);

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) {
      setMoveMessage(`Movimiento inválido: ${sourceSquare} -> ${targetSquare}`);
      autoPressVoiceButton(); // Llama a la función para presionar el botón automáticamente
    } else {
      setMoveMessage(`Movimiento válido: ${sourceSquare} -> ${targetSquare}`);
      stopRecognition(); // Detenemos el reconocimiento después de procesar un comando válido
    }
  };

  const autoPressVoiceButton = () => {
    const button1 = document.querySelector("#voice-button");
    if (button1) {
      button1.click(); // Simula el clic en el botón de voz
    }
  };

  const autoPressUndoButton = () => {
    const button2 = document.querySelector("#undo-button");
    if (button2) {
      button2.click();
    }
  };

  const makeAMove = (move) => {
    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      if (result) {
        setGame(gameCopy);
        setHistory([...history, game.fen()]); // Guarda el estado actual en el historial
      }
      return result;
    } catch (error) {
      console.error("Movimiento inválido:", error);
      return null;
    }
  };

  const undoLastMove = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      newHistory.pop();
      const previousFen =
        newHistory[newHistory.length - 1] || new Chess().fen();
      setGame(new Chess(previousFen));
      setHistory(newHistory);
    } else {
      alert("No hay movimientos para deshacer");
    }
  };

  return (
    <div>
      <div className="button-container">
        <button class="edit-post" onClick={startVoiceControl} id="voice-button">
          <span class="edit-tooltip">Press "m" to talk</span>
          <span class="edit-icon">🗣</span>
        </button>

        <button class="edit-post" onClick={undoLastMove} id="undo-button">
          <span class="edit-tooltip">Undo</span>
          <span class="edit-icon">↻</span>
        </button>
      </div>
      <div className="chessc">
        <Chessboard
          position={game.fen()}
          onPieceDrop={(source, target) => {
            const move = makeAMove({
              from: source,
              to: target,
              promotion: "q",
            });
            return move !== null;
          }}
        />
      </div>
      {/* Mostrar el mensaje de jugada */}
      <div>
        <p className="movements">{moveMessage}</p>
      </div>
    </div>
  );
}

export default ChessGame;
