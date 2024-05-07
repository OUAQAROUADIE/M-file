import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import AppsIcon from '@material-ui/icons/Apps';
import { Avatar } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { doSignOut } from '../firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import './style.css'
const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  height: 60px;
  border-bottom: 1px solid lightgray;
`;

const HeaderLogo = styled.div`
  display: flex;
  align-items: center;
  img {
    width: 40px;
  }
  span {
    font-size: 22px;
    margin-left: 10px;
    color: gray;
  }
`;

const HeaderSearch = styled.div`
  display: flex;
  align-items: center;
  width: 700px;
  background-color: whitesmoke;
  padding: 12px;
  border-radius: 10px;
  input {
    background-color: transparent;
    border: 0;
    outline: 0;
    flex: 1;
  }
`;

const HeaderIcons = styled.div`
  display: flex;
  align-items: center;
  span {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  svg.MuiSvgIcon-root {
    margin: 0px 10px;
  }
`;

const Header = ({ photoURL }) => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();
    return (
        <HeaderContainer>
            <HeaderLogo>
                <img src="/logo.png" className="logo" alt="Logo" />
                <h5>M-File</h5>
            </HeaderLogo>

            <HeaderIcons>
                {userLoggedIn ? (
                    <>
                        <span className="m-lg-1">
                            <Avatar onClick={() => navigate('/profile')} src={photoURL || 'default_avatar_url'} />
                        </span>
                        <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-blue-600 underline m-lg-1'>
                            <FontAwesomeIcon icon={faArrowRightFromBracket} />

                        </button>

                    </>
                ) : (
                    <></>
                )}
            </HeaderIcons>
        </HeaderContainer>
    );
};

export default Header;
