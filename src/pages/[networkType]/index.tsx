import React from 'react'

import WelcomeLoader from '@/components/Welcome/WelcomeLoader'

const HomePage = () => {
  return <WelcomeLoader />
}

export async function getServerSideProps() {
  return {
    props: {},
    redirect: {
      destination: '/home',
      permanent: true,
    },
  }
}

export default HomePage
