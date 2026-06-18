import { Link } from "react-router-dom";
import {useLocation} from "react-router-dom";
import logoIcon from '/src/assets/Logo-PetMap.svg'; // Import icons
import { Outlet } from "react-router-dom";
// Outlet is for shouwing nested pages data. If we clicj Info or Address, the Outlet will display data from them.


export function About() {

    let currentLocation = useLocation();
    return (
        <section id="about">
            <header>
                <div>
                    <Link className="home-btn" to="/">
                        <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                    </Link> 
                </div> 
            </header>
            <main className="white-container">
                <div className="about-content flex-column">
                    {/* <div>About us</div> */}
                    <h3 className="jost-700">Welcome to Pet Map!</h3>
                    <div className="about-text">
                        <p>
                            We are a community-driven platform dedicated to helping pet lovers find the perfect homes for their furry friends.
                        </p>
                        Our primary goal is to provide a tool that works fast and is highly accessible to all users, regardless of their 💻📱device or 📍location.  
                        Here is what you can expect from our platform:Interactive Map: We feature a real-time interactive map 
                        for reporting and tracking found animals.  Advanced Technology: The platform utilizes React for dynamic 
                        filtering and relies on a backend database for smooth and secure user data management.  
                        Bilingual Support: We provide a seamless toggle between Spanish and English to support users in their preferred language.  
                        A Mission of Care: This bilingual approach ensures that our local philosophy of "love and care" resonates 
                        across global regions.  We hope this tool makes it easier for you to connect with local shelters 
                        and helps our furry friends find the loving homes they deserve. <br /> <br />Thank you for visiting!
                    </div>
                </div>
                {/*
                <p>My Current URL Location is {currentLocation.pathname}</p><br/>
                <Link to="info">Information</Link><br/>
                <Link to="contact">Contact</Link><br/>
                <Outlet/>
                */}
            </main>
        </section>
    )
}


export function Info() {
    return (
        <div>Information</div>
    )
}

export function Contact() {
    return (
        <div>Contact</div>
    )
}

const AboutContent =()=>{

}
export default AboutContent;