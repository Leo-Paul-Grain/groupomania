import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import { UidContext } from './AppContext';
import Logout from './Log/Logout';


/*On utilise le uidcontext pour savoir quel utilisateur est connecté et afficher son nom dans la navbar
*/
const Navbar = () => {
    const uid = useContext(UidContext);

    return (
        <nav>
            <div className='nav-container'>
                <div className="logo">
                    <NavLink end to="/">
                        <div className="logo">
                            <img src="./img/icon-left-font.png" alt="logo groupomonia"/>
                        </div>
                    </NavLink>
                </div>
                {uid ? (
                    <ul>
                        <li></li>
                        <li className="welcome">
                            <NavLink end to="/profil">
                                <h5>Bienvenue 'valeur dynamique'</h5>
                            </NavLink>
                        </li>
                        <Logout />
                    </ul>
                ) : (
                    <ul>
                        <li>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;