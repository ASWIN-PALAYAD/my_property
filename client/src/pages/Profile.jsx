import { useSelector } from "react-redux";
import { useRef } from 'react';
import { useState, useEffect } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from "../firebase";
import { updateUserStart,updateUserSuccess,updateUserFail, deleteUserStart, deleteUserFail, deleteUserSuccess, signOutUserStart, signOutUserSuccess, signOutUserFail } from "../redux/slices/user/userSlice.js";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = () => {

  const fileRef = useRef(null);
  const dispatch = useDispatch();

  const { currentUser,loading,error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },

      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(
          (downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          }
        )
      }
    );

  }

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleChange = (e) => {
    setFormData({...formData,[e.target.id] : e.target.value})
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart())
      const {data} = await axios.post(`/api/user/update/${currentUser?._id}`,{...formData});
      if(data?.success === false){
        dispatch(updateUserFail(data?.message));
        return
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFail(error.response.data.message))
    }
  }

  const handleDeleteUser = async() => {
    try {
      dispatch(deleteUserStart());
      const {data} = await axios.delete(`/api/user/delete/${currentUser._id}`);
      if(data?.success === false) {
        dispatch(deleteUserFail(data?.message));
        return;
      }
      dispatch(deleteUserSuccess(data))

    } catch (error) {
      dispatch(deleteUserFail(error.response.data.message))
    }
  }

  const handleSignout = async() => {
    try {
      dispatch(signOutUserStart())
      const {data} = await axios.get('/api/auth/signout');
      if(data?.success === false){
        dispatch(signOutUserFail(data?.message));
        return;
      }
      dispatch(signOutUserSuccess(data))
      
    } catch (error) {
      dispatch(signOutUserFail(error?.response.data.message));

    }
  }

  const handleShowListing = async() => {
    try {
      setShowListingError(false);
      const {data} = await axios.get(`/api/user/listings/${currentUser._id}`);
      if(data.success === false){
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  }

  const handleDeleteListing = async(listingId) => {
    try {
      const {data} = await axios.delete(`/api/listing/delete/${listingId}`);
      if(data.success === false){
        console.log(data.message);
        return;
      }
      setUserListings((pre)=> pre.filter((listing)=> listing._id !== listingId));
    } catch (error) {
      console.log(error.message);
    }
  }
 

  return (
    <div className="p-3 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className="flex flex-col gap-4">
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <img src={formData.avatar || currentUser?.avatar} alt="profile" onClick={() => fileRef.current.click()} className="rounded-full w-24 h-24 object-cover cursor-pointer 
          self-center mt-2" />
        <p className="text-sm self-center">
          {fileUploadError ?
            <span className="text-red-700">Error file upload (image must be less than 2 mb)</span> :
            filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc} %`}</span>) :
              filePerc === 100 ? (
                <span className="text-green-700">Image successfully uploaded</span>
              ) : ' '
          }
        </p>
        <input type="text" id="username" placeholder="username" defaultValue={currentUser?.username}
        onChange={handleChange}
        className="border p-3 rounded-lg" />
        <input type="email" id="email" placeholder="email" defaultValue={currentUser?.email}
        onChange={handleChange}
        className="border p-3 rounded-lg" />
        <input type="password" id="password" placeholder="password"
        onChange={handleChange}
        className="border p-3 rounded-lg" />
        
         <p className="text-red-700 mt-5 text-center" >{error ? error : ""}</p>

        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        disabled={loading} 
        >
          {loading ? 'loading...' : 'update'}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90%" to={"/create-listing"}>
            Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer font-bold">Delete account</span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer font-bold">Sign out</span>
      </div>
      <p className="text-green-700 mt-5 text-center" >{updateSuccess ? "Successfully updated" : ''}</p>
      <button onClick={handleShowListing} className="text-green-700 w-full">Show Listings</button>
      <p className="text-red-700 mt-5">{showListingError? "Error showing listing" : ''}</p>
      {userListings && userListings.length > 0 && 
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
          {userListings.map((listing)=> (
          <div key={listing?._id} className="border rounded-lg p-3 flex  justify-between items-center gap-4">
            <Link to={`/listing/${listing._id}`}>
              <img src={listing?.imageUrl[0]} alt="listing cover" className="h-16 w-16 object-contain " />
            </Link>
            <Link to={`/listing/${listing._id}`} className="text-slate-700 font-semibold hover:underline truncate flex-1" >
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button onClick={()=>handleDeleteListing(listing._id)} className="text-red-700 uppercase font-semibold" >Delete</button>
              <Link to={`/update-listing/${listing._id}`} className="text-green-700 uppercase font-semibold" >Edit</Link>
            </div>
          </div>
        ))}
        </div>
      }
    </div>
  )
}

export default Profile