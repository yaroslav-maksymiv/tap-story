import React from 'react'

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Login} from "./features/authentication/Login";
import {Register} from "./features/authentication/Register";
import {Home} from "./screens/Home";
import Layout from "./hocs/Layout";
import {AccountActivation} from "./features/authentication/AccountActivation";
import {Search} from "./screens/Search";
import {Story} from "./features/story/Story";
import {WebSocketComponent} from "./components/WebSocketComponent";
import {StoriesLibrary} from "./features/story/StoriesLibrary";
import {StoryCreate} from "./features/story/StoryCreate";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <WebSocketComponent />
            <Layout>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/search' element={<Search/>}/>
                    <Route path='/library' element={<StoriesLibrary/>}/>
                    <Route path='/story/create' element={<StoryCreate/>}/>
                    <Route path='/story/:id' element={<Story/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/activate/:uid/:token' element={<AccountActivation/>}/>
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
