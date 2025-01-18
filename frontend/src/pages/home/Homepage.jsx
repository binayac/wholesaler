import Blogpage from "../blogs/Blogpage"
import TrendingProducts from "../Shop/TrendingProducts"
import Banner from "./Banner"
import Categories from "./Categories"
import DealsSection from "./DealsSection"
import HeroSection from "./HeroSection"
import PromoBanner from "./PromoBanner"

const Homepage = () => {
  return (
    <>
    <Banner/>
    <Categories/>
    <HeroSection/>
    <TrendingProducts/>
    <DealsSection/>
    <PromoBanner/>
    <Blogpage/>
    </>
  )
}
export default Homepage