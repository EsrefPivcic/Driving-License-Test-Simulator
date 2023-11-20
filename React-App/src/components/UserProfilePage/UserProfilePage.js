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

  const handleSaveClick = async (field) => {
    if (field === 'Password') {
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
      } catch (error) {
        console.error('Error changing password:', error);
        setPasswordChangeError(error.message || 'An error occurred while changing the password');
        console.log('Password change error message:', passwordChangeError);
      }      
    }
  
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
                    />
                    <input
                      className={`edit-input password-input`}
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                      className={`edit-input password-input`}
                      type="password"
                      placeholder="Repeat New Password"
                      value={repeatNewPassword}
                      onChange={(e) => setRepeatNewPassword(e.target.value)}
                    />
                    {passwordChangeError && <p className="error-message-profile">{passwordChangeError}</p>}
                  </div>

                ) : (
                  <input className="edit-input" type="text" defaultValue={userData[key]} />
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
