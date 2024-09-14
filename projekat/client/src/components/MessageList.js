import React, { useState, useEffect } from "react"; // Uvoz React-a, useState i useEffect hook-ova
import { useAuth } from "../hooks/useAuth"; // Uvoz hook-a za autentifikaciju
import api from "../api/posts"; // Uvoz API-a za komunikaciju sa serverom
import logo from "../assets/images/main.png"; // Uvoz slike za bot avatar

export default function MessageList({ messages }) {
  const { user, token } = useAuth(); // Fetch user data from useAuth hook
  const [profile, setProfile] = useState(null); // State for profile data

  // Fetch profile data on component mount or when user/token changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/profiles/${user.id}`);
        setProfile(response.data); // Set profile data to state
      } catch (error) {
        console.error("Error fetching profile:", error); // Log error to console
      }
    };

    fetchProfile();
  }, [user.id, token]);

  const defaultAvatar = "https://cdn-icons-png.freepik.com/512/3177/3177440.png"; // Default avatar if profile data is not available

  // Function to check if the bot's response contains an image tag
  const isImageResponse = (response) => {
    const regex = /<img.*?src="(.*?)".*?>/;
    return regex.test(response); // Returns true if the response contains an <img> tag
  };

  return (
    <>
      {messages
        .slice(0)
        .reverse()
        .map((message, index) => (
          <div key={message._id ? message._id : index}>
            {/* User's message */}
            <div className="msg right-msg">
              <div
                className="msg-img"
                style={{
                  backgroundImage: `url(${profile ? profile.avatar : defaultAvatar})`,
                }}
              />
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">{user ? user.name : "You"}</div>
                </div>
                <div className="msg-text">{message.text}</div>
              </div>
            </div>

            {/* Bot's message */}
            <div className="msg left-msg">
              <div
                className="msg-img"
                style={{ backgroundImage: `url(${logo})` }}
              />
              <div className="msg-bubble">
                <div className="msg-info">
                  <div className="msg-info-name">CAR BOT</div>
                </div>
                <div className="msg-text">
                  {/* Check if the response contains an <img> tag */}
                  {isImageResponse(message.response) ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: message.response }}
                    />
                  ) : (
                    message.response // If no image tag, just show the response text
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
