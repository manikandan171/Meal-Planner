import { useState, useContext } from 'react';
import State from "../hooks/State";
import { Link } from 'react-router-dom';
import { UserContext } from "../hooks/UserContext"
const About = () => {
    const name = useContext(UserContext);
    return(
        <div>
              <h1>Hi! {name}</h1>
              <Link to="/state">Usestate Example</Link><br />
               <Link to="/form">Controlled Form</Link><br />
               <Link to="/effect">UseEffects example</Link>
        </div>
    )
}
export default About