import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadPicture } from "../../feature/user.slice";

const UploadImg = () => {
    const [file, setFile] = useState();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.user);
    
    /*Quand on soumet le formulaire on appelle handlePicture
    */
    const handlePicture = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("userId", userData._id);
        data.append("file", file);

        dispatch(uploadPicture(data, userData._id));
    };

/*{`${process.env.REACT_APP_API_URL}api/user/upload`}
*/

    return(
        <form action="" onSubmit={handlePicture} className="upload-pic">
            <label htmlFor="file">Changer l'image</label>
            <input type="file" id="file" name="file" accept=".jpg, .jpeg, .png" 
            onChange={(e) => setFile(e.target.files[0])}/>
            <br/>
            <input type="submit" value="Envoyer" />
        </form>
    );
};

export default UploadImg;