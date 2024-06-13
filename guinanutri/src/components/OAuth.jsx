import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth(){
    const auth = getAuth(app);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleConnection = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt: 'select_account' });
        try{
            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
//                  googlePhotoUrl: result.user.photoURL, seulement si on veut stocker la photo
                }),
            });
            const data = await res.json();
            if(res.ok){
                dispatch(loginSuccess(data));
                navigate('/');
            }
        }catch(err){
            console.log(err);
        }
    }
    return(
        <Button type='button' gradientDuoTone='cyanToBlue' outline
        onClick={handleGoogleConnection}>
            <AiFillGoogleCircle className="w-6 h-6 mr-2"/>
            Continuer avec Google
        </Button>
    )
}