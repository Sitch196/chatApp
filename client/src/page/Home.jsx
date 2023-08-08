import React, { useContext } from "react";
import Copy from "../components/Copy";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/GeneralContext";
const Home = ({ socket }) => {
  const navigate = useNavigate();
  const {
    username,
    setUsername,
    generatedId,
    setGeneratedId,
    copyValue,
    setCopyValue,
  } = useContext(AuthContext);

  const joinRoom = () => {
    if (username !== "" && generatedId !== "") {
      socket.emit("join_room", generatedId);
      navigate("/chat");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      joinRoom();
    }
  };

  const isButtonDisabled = username === "" || generatedId === "";

  const generateId = () => {
    // Simple ID generation using Math.random(). This can be replaced with a more robust method if needed.
    const randomId = Math.random().toString(36).substring(2, 10);
    setGeneratedId(randomId);
  };

  const copyToClipboard = () => {
    // Create a temporary input element to copy the ID to the clipboard
    const tempInput = document.createElement("input");
    tempInput.value = generatedId;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    setCopyValue(true);

    //reset copyValue back to false
    setTimeout(() => {
      setCopyValue(false);
    }, 1000);
  };
  return (
    <div className="joinChatContainer">
      <h3>Join A Chat</h3>
      <input
        type="text"
        maxLength="35"
        placeholder="Enter Your Name"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
        onKeyPress={handleKeyPress}
      />
      {!copyValue ? (
        <IdGeneratorContainer>
          <Generate onClick={generateId}>Generate</Generate>
          <Input
            type="text"
            placeholder="Generate Room ID"
            value={generatedId}
            onChange={(e) => {
              setGeneratedId(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          />
          <CopyWrapper onClick={copyToClipboard} disabled={!generatedId}>
            <FontAwesomeIcon icon={faCopy} />
          </CopyWrapper>
        </IdGeneratorContainer>
      ) : (
        <Copy />
      )}
      <button onClick={joinRoom} disabled={isButtonDisabled}>
        Join a Room
      </button>
    </div>
  );
};

export default Home;
const IdGeneratorContainer = styled.div`
  display: flex;
  align-items: center;
  /* margin-left: 0.4rem; */
  border-radius: 5px;
  border: 2px solid #43a047;
  width: 100%;
  height: 40px;
  background-color: #43a047;
`;
const Input = styled.input`
  &:focus {
    outline: none;
  }
`;
const Generate = styled.div`
  font-size: 0.9rem;
  color: white;
  padding: 0.3rem;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
  &:hover {
    transform: translateY(-1px);
  }
`;
const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  padding: 0.5rem;
  cursor: pointer;
  height: 3rem;
  color: whitesmoke;
`;
