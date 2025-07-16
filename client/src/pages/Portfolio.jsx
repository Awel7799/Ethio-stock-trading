import Portfolio from "../components/porttfolio/PortfolioPage";
import Navigation from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
export default function Portfoliopage(){
    return(
        <div className="m-0 p-0">
        <Navigation/>
        <Portfolio/>
        <Footer/>
        </div>
    );
}