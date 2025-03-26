import { useEffect, useState } from 'react';
import './Navbar.scss';
import { Code, Github } from 'lucide-react';


const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > 10) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
      }, []);
    
    return (
        <div className={`nav-container ${isScrolled ? "scrolled" : "transparent"}`}>
            <div className="container">
                <div className="logo-container">
                    <div className="logos">
                        <Github className='github-logo' />
                        <span className='logo-text'>Github Dashboard</span>
                    </div>
                </div>
                <button className="explore-Btn">
                    <a href="https://github.com/explore" target="_blank" className='link-to-explore' rel="noopener noreferrer">
                        <Code className='code-logo'/>
                        Explore
                    </a>
                </button>
            </div>
        </div>
    );
};

export default Navbar;