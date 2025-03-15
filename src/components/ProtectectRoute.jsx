import { useDispatch, useSelector } from 'react-redux';
import { hideLoading, showLoading } from '../redux/features/alertSlice'
import api from '../services/axios.js'
import { Navigate } from 'react-router-dom'
import { setUser } from '../redux/features/userSlice';
import { useEffect } from 'react';

export default function ProtectedRoutes({ children }) {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)

    // eslint-disable-next-line
    const getUser = async () => {
        try {
            dispatch(showLoading())
            const res = await api.get('userProfile',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            dispatch(hideLoading())
            console.log(res.data)
            if(res.data){
                dispatch(setUser(res.data))
            } else {
                <Navigate to="/"/>
                localStorage.clear()
            }
        } catch (error) {
            dispatch(hideLoading())
            localStorage.clear()
            console.error(error)
        }
    }

    useEffect(() => {
        if(!user) {
            getUser()
        }
    }, [user, getUser])

    if(localStorage.getItem("token")){
        return children
    } else {
        return <Navigate to="/"/>
    }
}