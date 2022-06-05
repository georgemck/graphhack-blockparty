
import { useEffect } from "react";
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import VideoDetails from "../components/video-details";
import Layout from "../components/layout"
import axios from 'axios';

function Video() {
    const { data: session, status } = useSession()
    

    useEffect(() => {
        axios.get("https://livepeer.com/api/asset", { headers: { "Authorization": "Bearer c1e0d441-8577-44c0-81be-5c80b295d3b9" } })
        .then((response) => console.log(response.data));
    }, [])

    return (
        <Layout>
            {!session && (
                <>
                </>
            )}
            {session?.user && (
                <VideoDetails />
            )}
        </Layout>
    )
}

export default Video;