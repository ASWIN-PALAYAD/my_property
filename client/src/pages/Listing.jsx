import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

const Listing = () => {

    
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copy, setCopy] = useState(false);
    const {currentUser} = useSelector((state)=>state.user);
    const [contact, setContact] = useState(false);


    useEffect(() => {
        const fetchingData = async () => {

            try {
                setError(false);
                setLoading(true);
                const { data } = await axios.get(`/api/listing/getSingleListing/${params.listingId}`);
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return
                }
                setListing(data);
                setLoading(false);
                setError(false);

            } catch (error) {
                setError(true)
                setLoading(false);
            }



        }
        fetchingData();
    }, [params.listingId])

    return (
        <main>
            {loading && <p className='text-center my-7'>Loading...</p>}
            {error && <p className='text-center my-7 text-red-700'>Something went wrong</p>}

            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {listing?.imageUrl?.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[450px]' style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}>

                                </div>
                            </SwiperSlide>
                        ))}

                    </Swiper>

                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center
                bg-slate-100 cursor-pointer'
                        onClick={() => { navigator.clipboard.writeText(window.location.href), setCopy(true) }}
                    >
                        <FaShare className='text-slate-500' />
                    </div>
                    {copy && setTimeout(() => {
                        setCopy(false);
                    }, 2000) &&
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>Link copied!</p>
                    }

                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                        <p className='text-2xl font-semibold'>{listing.name} - $ {listing.offer ? listing.discountPrice.toLocaleString('en-US') :
                            listing.regularPrice.toLocaleString('en-US')} {listing.type === 'rent' && '/month'}</p>

                        <p className='flex items-center gap-2 mt-6 text-slate-600 my-2 text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>

                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === "rent" ? "For Rent" : "For Sale"}
                            </p>
                            {listing.offer && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>${+listing.regularPrice - +listing.discountPrice} OFF</p>
                            )}

                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description</span> - {listing.description}
                        </p>
                        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBed className='text-lg'/>
                                {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaBath className='text-lg'/>
                                {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaParking className='text-lg'/>
                                {listing.parking ? "Parking spot" : "No parking"}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap'>
                                <FaChair className='text-lg'/>
                                {listing.furnished ? "Furnished" : "Unfurnished"}
                            </li>
                        </ul>
                            
                        
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase  hover:opacity-95 p-3' >
                            Contact landlord
                        </button>
                        )}
                        
                        {contact && <Contact listing={listing}/>}
                        
                    </div>

                </>
            )}
        </main>
    )
}

export default Listing