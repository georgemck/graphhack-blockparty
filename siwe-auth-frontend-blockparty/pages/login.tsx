import { useEffect, useState } from "react";
import { getCsrfToken, signIn, useSession } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useAccount, useConnect, useNetwork, useSignMessage } from 'wagmi'
import Layout from "../components/layout"
import axios from 'axios';

import { Card, Text, Grid, Button, Image, Link } from "@nextui-org/react";
import { link } from "fs";

const imageDetails = [
  {
    "url": "https://github.com/nextui-org/nextui/blob/next/apps/docs/public/nextui-banner.jpeg?raw=true",
    "title": "Graph The Hack",
    "link": "/0"
  },
  {
    "url": "https://github.com/nextui-org/nextui/blob/next/apps/docs/public/nextui-banner.jpeg?raw=true",
    "title": "Black Party",
    "link": "/1"
  },
  {
    "url": "https://github.com/nextui-org/nextui/blob/next/apps/docs/public/nextui-banner.jpeg?raw=true",
    "title": "To The Moon",
    "link": "/2"
  }
]

function Siwe() {
  const [{ data: connectData }, connectAsync] = useConnect();
  const [, signMessage] = useSignMessage();
  const [metaData, setMetaData] = useState(null)

  const handleLogin = async () => {
    try {
      const res = await connectAsync(connectData.connectors[0]);
      const callbackUrl = '/protected';
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.data?.account,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: res.data?.chain?.id,
        nonce: await getCsrfToken()
      });
      const { data: signature, error } = await signMessage({ message: message.prepareMessage() });

      signIn('credentials', { message: JSON.stringify(message), redirect: false, signature, callbackUrl });

    } catch (error) {
      window.alert(error)
    }
  }
  const { data: session, status } = useSession()

  useEffect(() => {
    axios.get("https://livepeer.com/api/asset", { headers: { "Authorization": "Bearer c1e0d441-8577-44c0-81be-5c80b295d3b9" } })
      .then((response) => setMetaData(response.data));
  }, []);

  const [clickedButton, setClickedButton] = useState('');
  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const button: HTMLButtonElement = event.currentTarget;
    setClickedButton(button.name);
  };


  return (
    <Layout>

      {!session && (
        <>
          <button onClick={(e) => {
            e.preventDefault()
            handleLogin()
          }}
          >
            Sign-in
          </button>
        </>
      )}

      {session?.user && (
        <Grid.Container gap={1} justify="center">

          {imageDetails.map((item, i) => (
            <Grid key={i} xs={4}>
              <Card css={{ mw: "400px" }}>
                <Image
                  width={320}
                  height={180}
                  src={item.url}
                  alt="Default Image"
                  objectFit="cover"
                />
                <p>{item.title}</p>
                <Button onClick={buttonHandler} className="button" name="${i}" shadow color="gradient" auto>
                  Open
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid.Container>
        // <>
        //   Welcome Crypto User {session.user.email ?? session.user.name}
        // </>
      )}

    </Layout>
  )
}

Siwe.Layout = Layout

export default Siwe
