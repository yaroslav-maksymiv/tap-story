import React from 'react'

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Login} from "./features/authentication/Login";
import {Register} from "./features/authentication/Register";
import {Home} from "./screens/Home";
import Layout from "./hocs/Layout";
import {AccountActivation} from "./features/authentication/AccountActivation";
import {Story} from "./features/story/Story";
import {WebSocketComponent} from "./components/WebSocketComponent";
import {StoriesLibrary} from "./features/story/StoriesLibrary";
import {StoryCreate} from "./features/story/StoryCreate";
import {MyStories} from "./features/story/MyStories";
import {StoryEdit} from "./features/story/StoryEdit";
import {StoriesSearch} from "./features/story/StoriesSearch";
import {Episode} from "./features/episode/Episode";
import {PasswordReset} from "./features/authentication/PasswordReset";
import {PasswordResetActivation} from "./features/authentication/PasswordResetActivation";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <WebSocketComponent/>
            <Layout>
                <Routes>
                    <Route path='/' element={<StoriesSearch/>}/>
                    <Route path='/home' element={<Home/>}/>
                    <Route path='/library' element={<StoriesLibrary/>}/>

                    <Route path='/my/stories' element={<MyStories/>}/>
                    <Route path='/story/create' element={<StoryCreate/>}/>
                    <Route path='/story/:id' element={<Story/>}/>
                    <Route path='/story/:id/edit' element={<StoryEdit/>}/>
                    <Route path='/episode/:id/edit' element={<Episode/>}/>

                    <Route path='/login' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>
                    <Route path='/password-reset' element={<PasswordReset/>}/>
                    <Route path='/password/reset/confirm/:uid/:token' element={<PasswordResetActivation/>}/>
                    <Route path='/activate/:uid/:token' element={<AccountActivation/>}/>
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
