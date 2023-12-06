import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { useAuth } from '../AuthContext/AuthContext';
import './UserProfilePage.css';

function UserProfilePage() {
  const storedToken = localStorage.getItem('token');
  const { fetchUserData, userData, setUserData } = useAuth();
  const [isComponentVisible, setComponentVisible] = useState(false);
  const [imageEmpty, setImageEmpty] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [successMessageImage, setSuccessMessageImage] = useState('');
  const [newName, setNewName] = useState('');
  const [newSurname, setNewSurname] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newImage, setNewImage] = useState('');

  const [isEditing, setEditing] = useState({
    name: false,
    surname: false,
    username: false,
    email: false,
    password: false,
  });

  const startEditing = (field) => {
    setEditing((prevEditing) => ({
      ...prevEditing,
      [field]: true,
    }));
  };

  const stopEditing = (field) => {
    setEditing((prevEditing) => ({
      ...prevEditing,
      [field]: false,
    }));
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Z][a-zA-Z]*$/;
    return nameRegex.test(name);
  };

  const validateUsername = (username) => {
    return /^\S+$/.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    fetchUserData();
    setComponentVisible(true);
  }, []);

  const fadeIn = useSpring({
    opacity: isComponentVisible ? 1 : 0,
    from: { opacity: 0 },
  });

  const changePassword = async () => {
    if (!oldPassword || !newPassword || !repeatNewPassword) {
      setErrorMessage('Please fill in all password fields.');
      return;
    }

    if (oldPassword === newPassword || oldPassword === repeatNewPassword) {
      setErrorMessage('New passwords must be different from the old password.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/user/changepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: storedToken,
          oldpassword: oldPassword,
          newpassword: newPassword,
          repeatnewpassword: repeatNewPassword,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      console.log('Password changed successfully');
      setSuccessMessage('Password changed successfully');
      setErrorMessage('');

      setOldPassword('');
      setNewPassword('');
      setRepeatNewPassword('');

      stopEditing('password');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage(error.message || 'An error occurred while changing the password');
      setSuccessMessage('');
    }
  };

  const changeName = async () => {
    if (!newName) {
      setErrorMessage('Please fill in the name field.');
      return;
    }

    if (!validateName(newName)) {
      setErrorMessage('Name must start with a capital letter and should not have spaces.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/user/changename', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: storedToken,
          newname: newName,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      console.log('Name changed successfully');
      setSuccessMessage('Name changed successfully');
      setErrorMessage('');
      setUserData((prevData) => ({ ...prevData, Name: newName }));

      stopEditing('name');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error changing name:', error);
      setErrorMessage(error.message || 'An error occurred while changing the name');
      setSuccessMessage('');
    }
  };

  const changeSurname = async () => {
    if (!newSurname) {
      setErrorMessage('Please fill in the surname field.');
      return;
    }

    if (!validateName(newSurname)) {
      setErrorMessage('Surname must start with a capital letter and should not have spaces.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/user/changesurname', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: storedToken,
          newsurname: newSurname,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      console.log('Surname changed successfully');
      setSuccessMessage('Surname changed successfully');
      setErrorMessage('');
      setUserData((prevData) => ({ ...prevData, Surname: newSurname }));

      stopEditing('surname');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error changing surname:', error);
      setErrorMessage(error.message || 'An error occurred while changing the surname');
      setSuccessMessage('');
    }
  };

  const changeUsername = async () => {
    if (!newUsername) {
      setErrorMessage('Please fill in the username field.');
      return;
    }

    if (!validateUsername(newUsername)) {
      setErrorMessage('Username should not have spaces.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/user/changeusername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: storedToken,
          newusername: newUsername,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      console.log('Username changed successfully');
      setSuccessMessage('Username changed successfully');
      setErrorMessage('');
      setUserData((prevData) => ({ ...prevData, Username: newUsername }));

      stopEditing('username');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error changing username:', error);
      setErrorMessage(error.message || 'An error occurred while changing the username');
      setSuccessMessage('');
    }
  };

  const changeEmail = async () => {
    if (!newEmail) {
      setErrorMessage('Please fill in the email field.');
      return;
    }

    if (!validateEmail(newEmail)) {
      setErrorMessage('Invalid email format. Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/user/changeemail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: storedToken,
          newEmail: newEmail,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      console.log('Email changed successfully');
      setSuccessMessage('Email changed successfully');
      setErrorMessage('');
      setUserData((prevData) => ({ ...prevData, Email: newEmail }));

      stopEditing('email');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error changing email:', error);
      setErrorMessage(error.message || 'An error occurred while changing the email');
      setSuccessMessage('');
    }
  };

  const addProfileImage = async () => {
    if (!newImage) {
      setImageEmpty(true);
      return;
    }
    setImageEmpty(false);
    try {
      const response = await fetch('http://localhost:8080/user/addprofileimage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: storedToken,
          imagebase64: newImage,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      console.log('Image added successfully');
      setSuccessMessageImage('Image added successfully');
      setUserData((prevData) => ({ ...prevData, ImageBase64: newImage }));
      setTimeout(() => {
        setSuccessMessageImage('');
      }, 2000);
    } catch (error) {
      console.error('Error adding a profile image:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target.result.split(',')[1];
      setNewImage(base64Image);
      setImageEmpty(false);
      setUserData({ ...userData, ImageBase64: base64Image });
    };

    reader.readAsDataURL(file);
    setUserData({ ...userData, ImageName: file.name });
  };

  return (
    <animated.div style={fadeIn}>
      <div className="user-profile-container">
        <h2 className="add-question-headline">Your Profile</h2>
        <div className="profile-image-container">
          {userData.ImageBase64 && (
            <img
              src={`data:image/png;base64,${userData.ImageBase64}`}
              alt={`User: ${userData.Username}`}
              className="category-image"
            />
          )}
          {!userData.ImageBase64 && (<img src="images/userimage.png" alt="Profile" />)}
          <div className="file-input-container">
            <div className="button-container">
              <label className="custom-file-input-btn">
                Choose File
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>
              <button className="save-image-button" onClick={addProfileImage}>Save Image</button>
            </div>
          </div>
        </div>
        {imageEmpty && (<p className="error-message-profile">Please select a new image!</p>)}
        {successMessageImage && <p className="success-message-profile">{successMessageImage}</p>}
        <div className="user-info-container">
          <div className="user-info-row">
            <span>Name:</span>
            {isEditing.name ? (
              <input
                className="edit-input"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            ) : (
              <span className="data-span">{userData.Name}</span>
            )}
            {!isEditing.name && (
              <button
                className="edit-button"
                onClick={() => startEditing('name')}
              >
                Edit
              </button>
            )}
            {isEditing.name && (
              <>
                <button
                  className="edit-button"
                  onClick={() => changeName()}
                >
                  Save
                </button>
              </>
            )}
          </div>
          <div className="user-info-row">
            <span>Surname:</span>
            {isEditing.surname ? (
              <input
                className="edit-input"
                type="text"
                value={newSurname}
                onChange={(e) => setNewSurname(e.target.value)}
              />
            ) : (
              <span className="data-span">{userData.Surname}</span>
            )}
            {!isEditing.surname && (
              <button
                className="edit-button"
                onClick={() => startEditing('surname')
                }
              >
                Edit
              </button>
            )}
            {isEditing.surname && (
              <button
                className="edit-button"
                onClick={() => changeSurname()}
              >
                Save
              </button>
            )}
          </div>
          <div className="user-info-row">
            <span>Username:</span>
            {isEditing.username ? (
              <input
                className="edit-input"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            ) : (
              <span className="data-span">{userData.Username}</span>
            )}
            {!isEditing.username && (
              <button
                className="edit-button"
                onClick={() => startEditing('username')
                }
              >
                Edit
              </button>
            )}
            {isEditing.username && (
              <button
                className="edit-button"
                onClick={() => changeUsername()}
              >
                Save
              </button>
            )}
          </div>
          <div className="user-info-row">
            <span>Email:</span>
            {isEditing.email ? (
              <input
                className="edit-input"
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            ) : (
              <span className="data-span">{userData.Email}</span>
            )}
            {!isEditing.email && (
              <button
                className="edit-button"
                onClick={() => startEditing('email')
                }
              >
                Edit
              </button>
            )}
            {isEditing.email && (
              <button
                className="edit-button"
                onClick={() => changeEmail()}
              >
                Save
              </button>
            )}
          </div>
          <div className="user-info-row">
            <span>Password:</span>
            {isEditing.password ? (
              <div className="password-editing">
                <input
                  className="edit-input password-input"
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <input
                  className="edit-input password-input"
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  className="edit-input password-input"
                  type="password"
                  placeholder="Repeat New Password"
                  value={repeatNewPassword}
                  onChange={(e) => setRepeatNewPassword(e.target.value)}
                  required
                />
              </div>
            ) : (
              <span className="data-span">********</span>
            )}
            {!isEditing.password && (
              <button
                className="edit-button"
                onClick={() => startEditing('password')
                }
              >
                Edit
              </button>
            )}
            {isEditing.password && (
              <button
                className="edit-button save-button"
                onClick={() => changePassword()}
              >
                Save
              </button>
            )}
          </div>
        </div>
        {errorMessage && <p className="error-message-profile">{errorMessage}</p>}
        {successMessage && <p className="success-message-profile">{successMessage}</p>}
      </div>
    </animated.div>
  );
}

export default UserProfilePage;