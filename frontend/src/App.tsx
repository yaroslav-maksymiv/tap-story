import React from 'react'

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Login} from "./features/authentication/Login";
import {Register} from "./features/authentication/Register";
import {Home} from "./screens/Home";
import Layout from "./hocs/Layout";
import {AccountActivation} from "./features/authentication/AccountActivation";
import {Search} from "./screens/Search";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/search' element={<Search/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/activate/:uid/:token' element={<AccountActivation/>}/>
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
