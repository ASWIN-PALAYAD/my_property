import axios from 'axios';
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Contact = ({listing}) => {

    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(()=> {

        const fetchLandlord = async()=> {
            try {
                const {data} = await axios.get(`/api/user/${listing.userRef}`);
                setLandlord(data);
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchLandlord();

    },[listing.userRef]);

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

  return (
    <>
    {landlord && (
        <div className='flex flex-col gap-2'>
            <p>
                Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span>
            </p>
            <textarea placeholder='Enter your message here' name="message" id="message" rows="2" value={message} 
            onChange={handleChange} className='w-full border p-3 rounded-lg'>
            </textarea>

            <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} 
            className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
                Send Message
            </Link>
        </div>
    )}

    </>
  )
}


Contact.propTypes = {
    listing: PropTypes.object.isRequired,
  };

export default Contact