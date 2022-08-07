import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/common/Header";
import Login from "./components/page/Login";
import Signup from "./components/page/Signup";
import Home from "./components/page/Home";
import NotFound from "./components/page/NotFound";

const App = () => {
    return(
        <React.StrictMode>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path="/login" element={ <Login /> } ></Route>
                    <Route path="/signup" element={ <Signup />} ></Route>
                    <Route path="/home" element={ <Home /> }></Route>
                    <Route path="*" element={ <NotFound /> }>
                        {/* {
                            window.location.href = '/login'
                        } */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </React.StrictMode>
    );
}

export default App;