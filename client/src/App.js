import React, { useEffect, useState } from 'react';
import Routes from "./components/routes/index";
import { UidContext } from './components/AppContext';
import axios from 'axios';

/*A chaque fois qu'on appelle App on lance le useEffect
*il va contrôler le token de l'utilisateur avec le middleware backend requireAuth
*comme ça si il à un token qui est encore en cours de validité il n'aura pas besoin de se reconnecter
*l'id de l'utilisateur récupéré dans le token est stocké dans le state de App grâce à UidContext. Ainsi on peut le récupèrer quand on veut
*/
function App() {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const fetchToken = async() => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true
      })
        .then((res) => setUid(res.data))
        .catch((err) => console.log("No Token"))
    }
    fetchToken();
  }, []);
  
  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
};

export default App;

