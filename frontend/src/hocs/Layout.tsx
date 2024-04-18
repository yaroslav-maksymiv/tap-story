import {useAppDispatch} from '../app/hooks'
import {useEffect} from "react";
import {checkIsAuthenticated, loadUser} from "../features/authentication/authenticationThunks";
import {Navbar} from "../components/Navbar";

const Layout = (props: any) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(checkIsAuthenticated())
        dispatch(loadUser({access: localStorage.getItem('access')}))
    }, [])

    return (
        <div>
            <Navbar/>
            <div className="mx-auto max-w-7xl px-2 h-full">
                {props.children}
            </div>
        </div>
    )
}

export default Layout