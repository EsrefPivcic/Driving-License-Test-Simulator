import React, { useState } from 'react';
import './UserProfilePage.css';

function UserProfilePage() {
    const [isEditing, setEditing] = useState(false);

    const userData = {
        name: 'John',
        surname: 'Doe',
        username: 'john.doe',
        email: 'john@example.com',
        password: '********',
    };

    const handleEditClick = () => {
        setEditing(!isEditing);
    };

    return (
        <div className="user-profile-container">
            <div className="profile-image-container">
                <img src="images/userimage.jpg" alt="Profile" />
                <input type="file" accept="image/*" onChange={(e) => console.log(e.target.files[0])} />
            </div>

            <div className="user-info-container">
                <div className="user-info-row">
                    <span>Name:</span>
                    {isEditing ? (
                        <input type="text" defaultValue={userData.name} />
                    ) : (
                        <span>{userData.name}</span>
                    )}
                    <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
                </div>

                <div className="user-info-row">
                    <span>Surname:</span>
                    {isEditing ? (
                        <input type="text" defaultValue={userData.surname} />
                    ) : (
                        <span>{userData.surname}</span>
                    )}
                    <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
                </div>

                <div className="user-info-row">
                    <span>Username:</span>
                    {isEditing ? (
                        <input type="text" defaultValue={userData.username} />
                    ) : (
                        <span>{userData.username}</span>
                    )}
                    <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
                </div>

                <div className="user-info-row">
                    <span>Email:</span>
                    {isEditing ? (
                        <input type="text" defaultValue={userData.email} />
                    ) : (
                        <span>{userData.email}</span>
                    )}
                    <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
                </div>

                <div className="user-info-row">
                    <span>Password:</span>
                    {isEditing ? (
                        <input type="password" defaultValue={userData.password} />
                    ) : (
                        <span>********</span>
                    )}
                    <button onClick={handleEditClick}>{isEditing ? 'Save' : 'Edit'}</button>
                </div>

            </div>
        </div>
    );
}

export default UserProfilePage;
