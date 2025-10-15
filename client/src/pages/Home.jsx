import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../sections/Hero'
import Collection from '../components/homecomponents/Collection'
import Products from '../sections/Products'
import Footer from '../sections/Footer'
import Design from '../components/homecomponents/Design'

function HomePage() {

    return (
        <>
            <Navbar/>
            <Hero/>
            <Collection/>
            <Design/>
            <Products/>
            <Footer/>
        </>
    )
}

export default HomePage