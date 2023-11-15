import React, { useState, useEffect } from 'react';
import { useSpring, animated } from "react-spring";
import './UserProfilePage.css';

function UserProfilePage() {

  const [isComponentVisible, setComponentVisible] = useState(false);

    const [isEditing, setEditing] = useState({
        name: false,
        surname: false,
        username: false,
        email: false,
        password: false,
    });

    const userData = {
        name: 'John',
        surname: 'Doe',
        username: 'john.doe',
        email: 'john@example.com',
        password: '********',
    };

    useEffect(() => {
        setComponentVisible(true);
      }, []);
    
      const fadeIn = useSpring({
        opacity: isComponentVisible ? 1 : 0,
        from: { opacity: 0 },
      });

    const handleEditClick = (field) => {
        setEditing((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const handleSaveClick = (field) => {
        setEditing((prevState) => ({
            ...prevState,
            [field]: false,
        }));
    };

    return (
    <animated.div style={fadeIn}>
        <div className="user-profile-container">
            <h2 className="add-question-headline">Your Profile</h2>
            <div className="profile-image-container">
                <img src="images/userimage.jpg" alt="Profile" />
                <div class="file-input-container">
                    <label for="fileInput" class="choose-file-btn">Choose File</label>
                    <span class="file-name">No file chosen</span>
                    <input className="default-choosefile"
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange="(e) => handleFileChange(e)"
                    />
                </div>
            </div>
            <div className="user-info-container">
                <div className="user-info-row">
                    <span>Name:</span>
                    {isEditing.name ? (
                        <input className="edit-input" type="text" defaultValue={userData.name} />
                    ) : (
                        <span className="data-span">{userData.name}</span>
                    )}
                    <button
                        className="edit-button"
                        onClick={() => (isEditing.name ? handleSaveClick('name') : handleEditClick('name'))}
                    >
                        {isEditing.name ? 'Save' : 'Edit'}
                    </button>
                </div>

                <div className="user-info-row">
                    <span>Surname:</span>
                    {isEditing.surname ? (
                        <input className="edit-input" type="text" defaultValue={userData.surname} />
                    ) : (
                        <span className="data-span">{userData.surname}</span>
                    )}
                    <button
                        className="edit-button"
                        onClick={() => (isEditing.surname ? handleSaveClick('surname') : handleEditClick('surname'))}
                    >
                        {isEditing.surname ? 'Save' : 'Edit'}
                    </button>
                </div>

                <div className="user-info-row">
                    <span>Username:</span>
                    {isEditing.username ? (
                        <input className="edit-input" type="text" defaultValue={userData.username} />
                    ) : (
                        <span className="data-span">{userData.username}</span>
                    )}
                    <button
                        className="edit-button"
                        onClick={() => (isEditing.username ? handleSaveClick('username') : handleEditClick('username'))}
                    >
                        {isEditing.username ? 'Save' : 'Edit'}
                    </button>
                </div>

                <div className="user-info-row">
                    <span>Email:</span>
                    {isEditing.email ? (
                        <input className="edit-input" type="text" defaultValue={userData.email} />
                    ) : (
                        <span className="data-span">{userData.email}</span>
                    )}
                    <button
                        className="edit-button"
                        onClick={() => (isEditing.email ? handleSaveClick('email') : handleEditClick('email'))}
                    >
                        {isEditing.email ? 'Save' : 'Edit'}
                    </button>
                </div>

                <div className="user-info-row">
                    <span>Password:</span>
                    {isEditing.password ? (
                        <input className="edit-input" type="password" defaultValue={userData.password} />
                    ) : (
                        <span className="data-span">********</span>
                    )}
                    <button
                        className="edit-button"
                        onClick={() => (isEditing.password ? handleSaveClick('password') : handleEditClick('password'))}
                    >
                        {isEditing.password ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>
        </div>
        </animated.div>
    );
}

export default UserProfilePage;
