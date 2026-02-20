import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/Offers/Offers'
import NewCollections from '../Components/NewCollections/NewCollections'
import RecentlyViewed from '../Components/RecentlyViewed/RecentlyViewed'
import NewsLetter from '../Components/NewsLetter/NewsLetter'


const Shop = () => {
  return (
    <div>
      <Hero />
      <Popular />
      <Offers />
      <NewCollections />
      <RecentlyViewed maxItems={8} />
      <NewsLetter />
    </div>
  )
}

export default Shop
