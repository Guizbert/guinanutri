import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Home from "./pages/Home"
import About from "./pages/About"
import Header from "./components/Header"
import Footer from "./components/Footer"
import PrivateRoute from "./components/PrivateRoute"
import DashBoard from "./pages/DashBoard"
import Error from "./pages/Error"
import Module from "./pages/Module/Module"
import FormBuilder from "./components/dndkit/FormBuilder"
import Verification from "./pages/Verification"
import Questionnaire from "./pages/Questionnaire/Questionnaire"
import CreationModule from "./pages/Module/CreationModule"
import ListAnswerModule from "./pages/Module/ListAnswerModule"
import Answer from "./pages/Questionnaire/Answer"

// import {Draggable} from './Draggable'; 
// import {Droppable} from './Droppable';

export default function App() {
  return (
    <BrowserRouter >
      <Header></Header>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/verification" element={<Verification />} />
          <Route path="/login" element={<Login/>}></Route>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashBoard />}></Route>
            <Route path="/module" element={<Module />}></Route>
          </Route>
          <Route path="/error" element={<Error />}></Route>
          <Route path="/formDndKit" element={<FormBuilder />}></Route>
          <Route path="/questionnaire" element={<Questionnaire />}></Route>
          <Route path="/creationModule" element={<CreationModule />}></Route>
          <Route path="/reponseModule" element={<ListAnswerModule/>}></Route>
          <Route path="/reponse" element={<Answer/>}></Route>

        </Routes>
        <Footer/>

    </BrowserRouter>
  )
}