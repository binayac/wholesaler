import { Link } from "react-router-dom"
import heroImg from "../../assets/deals.png"

const Banner = () => {
  return (
    <div className = "section__container header__container">
        <div className = "header__content z-30">
        <h4 className="uppercase">UP TO 20% Discount on</h4>
        <h1>Bathroom Furniture</h1>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dignissimos, beatae perferendis expedita iusto dolorem aperiam culpa sequi asperiores sapiente quas sed voluptates adipisci eius hic doloribus optio, mollitia temporibus consectetur. Doloribus iusto natus itaque sit!</p>
        <button className ="btn"><Link to="/shop">EXPLORE NOW</Link></button>
        </div>
        <div className = "header__image">
            <img src={heroImg} alt="banner image" />
        </div>
    </div>
  )
}
export default Banner