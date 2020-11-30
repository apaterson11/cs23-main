import React from 'react';
import axiosInstance from '../axios'


class Logout extends React.Component {

    componentDidMount() {
        const response = axiosInstance.post('logout/blacklist/', {
            refresh_token: localStorage.getItem('refresh_token')
        })
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        axiosInstance.defaults.headers['Authorization'] = null
        this.props.history.push('/login')
    }

    render() {
        return (
            <div>Logout</div>
        )
    }
}

export default Logout