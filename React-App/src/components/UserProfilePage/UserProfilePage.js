import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './UserProfilePage.css';

function UserProfilePage() {
  const storedToken = localStorage.getItem('token');
  const [isComponentVisible, setComponentVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [newName, setNewName] = useState('');
  const [newSurname, setNewSurname] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

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

  const [userData, setUserData] = useState({
    Name: '',
    Surname: '',
    Username: '',
    Email: '',
    Password: '',
  });

  const [isEditing, setEditing] = useState({
    name: false,
    surname: false,
    username: false,
    email: false,
    password: false,
  });

  const fetchStudentData = async () => {
    const token = storedToken;
    try {
      const response = await fetch('http://localhost:8080/student/getbytoken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordChangeError(error.message || 'An error occurred while changing the password');
    }
  };

  useEffect(() => {
    fetchStudentData();
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

  const changePassword = async () => {
    if (!oldPassword || !newPassword || !repeatNewPassword) {
      setPasswordChangeError('Please fill in all password fields.');
      return;
    }
  
    if (oldPassword === newPassword || oldPassword === repeatNewPassword) {
      setPasswordChangeError('New passwords must be different from the old password.');
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
      setPasswordChangeSuccess('Password changed successfully');
      setPasswordChangeError('');
  
      setOldPassword('');
      setNewPassword('');
      setRepeatNewPassword('');
  
      setTimeout(() => {
        setEditing((prevState) => ({
          ...prevState,
          Password: false,
        }));
        setPasswordChangeSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordChangeError(error.message || 'An error occurred while changing the password');
      setPasswordChangeSuccess('');
    }
  };
  
  const changeName = async () => {
    if (!validateName(newName)) {
      console.error('Invalid name format');
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
      setUserData((prevData) => ({ ...prevData, Name: newName }));
  
      setEditing((prevState) => ({
        ...prevState,
        Name: false,
      }));
    } catch (error) {
      console.error('Error changing name:', error);
    }
  };
  
  const changeSurname = async () => {
    if (!validateName(newSurname)) {
      console.error('Invalid surname format');
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
      setUserData((prevData) => ({ ...prevData, Surname: newSurname }));
  
      setEditing((prevState) => ({
        ...prevState,
        Surname: false,
      }));
    } catch (error) {
      console.error('Error changing surname:', error);
    }
  };
  
  const changeUsername = async () => {
    if (!validateUsername(newUsername)) {
      console.error('Invalid username format');
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
      setUserData((prevData) => ({ ...prevData, Username: newUsername }));
  
      setEditing((prevState) => ({
        ...prevState,
        Username: false,
      }));
    } catch (error) {
      console.error('Error changing username:', error);
    }
  };
  
  const changeEmail = async () => {
    if (!validateEmail(newEmail)) {
      console.error('Invalid email format');
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
      setUserData((prevData) => ({ ...prevData, Email: newEmail }));
  
      setEditing((prevState) => ({
        ...prevState,
        Email: false,
      }));
    } catch (error) {
      console.error('Error changing email:', error);
    }
  };
  
  const handleSaveClick = async (field) => {
    switch (field) {
      case 'Password':
        changePassword();
        break;
      case 'Name':
        changeName();
        break;
      case 'Surname':
        changeSurname();
        break;
      case 'Username':
        changeUsername();
        break;
      case 'Email':
        changeEmail();
        break;
      default:
        setEditing((prevState) => ({
          ...prevState,
          [field]: false,
        }));
    }
  };

  return (
    <animated.div style={fadeIn}>
      <div className="user-profile-container">
        <h2 className="add-question-headline">Your Profile</h2>
        <div className="profile-image-container">
          <img src="images/userimage.jpg" alt="Profile" />
          <div className="file-input-container">
            <label htmlFor="fileInput" className="choose-file-btn">
              Choose File
            </label>
            <span className="file-name">No file chosen</span>
            <input
              className="default-choosefile"
              type="file"
              accept="image/*"
            //onChange={(e) => handleFileChange(e)}
            />
          </div>
        </div>
        <div className="user-info-container">
          {Object.keys(userData).map((key) => key !== 'ID' && (
            <div key={key} className="user-info-row">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              {isEditing[key] ? (
                key === 'Password' ? (
                  <div className="password-editing">
                    <input
                      className={`edit-input password-input`}
                      type="password"
                      placeholder="Old Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                    <input
                      className={`edit-input password-input`}
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <input
                      className={`edit-input password-input`}
                      type="password"
                      placeholder="Repeat New Password"
                      value={repeatNewPassword}
                      onChange={(e) => setRepeatNewPassword(e.target.value)}
                      required
                    />
                    {passwordChangeError && <p className="error-message-profile">{passwordChangeError}</p>}
                    {passwordChangeSuccess && <p className="success-message-profile">{passwordChangeSuccess}</p>}
                  </div>
                ) : (
                  <input
                    className="edit-input"
                    type="text"
                    value={
                      key === 'Name' ? newName :
                      key === 'Surname' ? newSurname :
                      key === 'Username' ? newUsername :
                      key === 'Email' ? newEmail :
                      userData[key]
                    }
                    onChange={(e) => {
                      if (key === 'Name') setNewName(e.target.value);
                      if (key === 'Surname') setNewSurname(e.target.value);
                      if (key === 'Username') setNewUsername(e.target.value);
                      if (key === 'Email') setNewEmail(e.target.value);
                    }}
                  />
                )
              ) : (
                <span className="data-span">{key === 'Password' ? '********' : userData[key]}</span>
              )}
              <button
                className={`edit-button ${isEditing[key] && key === 'Password' ? 'save-button' : ''}`}
                onClick={() => {
                  if (isEditing[key]) {
                    handleSaveClick(key);
                  } else {
                    handleEditClick(key);
                  }
                }}
              >
                {isEditing[key] ? 'Save' : 'Edit'}
              </button>

            </div>
          ))}
        </div>
      </div>
    </animated.div>
  );
}

export default UserProfilePage;