import { getRecord, webClient } from '@/hooks/useIdentity'
import React, { useState, useRef } from 'react'

type ProfileType = {
  name?: string
  bio?: string
}

const Identity = () => {
  const [bio, setBio] = useState('')
  const [name, setName] = useState('')
  const [profile, setProfile] = useState<ProfileType>({})
  const [localDid, setDid] = useState<any>(null)
  const [selfId, setSelfId] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)

  const selfIdRef = useRef<any>(null)
  const didRef = useRef<any>(null)

  selfIdRef.current = selfId
  didRef.current = localDid

  async function connect() {
    const { id, selfId, error } = await webClient()
    if (error) {
      console.log('error: ', error)
      return
    }

    setDid(id)
    setSelfId(selfId)
    const data = await selfId?.get('basicProfile')
    if (data) {
      setProfile(data)
    } else {
      setShowGreeting(true)
    }
    setLoaded(true)
  }

  async function updateProfile() {
    if (!bio && !name) {
      console.log('error... no profile information submitted')
      return
    }
    if (!selfId) {
      await connect()
    }
    const user: {
      name: string
      bio: string
    } = {
      ...profile,
      name: name ?? '',
      bio: bio ?? '',
    }

    await selfIdRef.current.set('basicProfile', user)
    setLocalProfileData()
    console.log('profile updated...')
  }

  async function readProfile() {
    try {
      const { record } = await getRecord()
      if (record) {
        setProfile(record)
      } else {
        setShowGreeting(true)
      }
    } catch (error) {
      setShowGreeting(true)
    }
    setLoaded(true)
  }

  async function setLocalProfileData() {
    try {
      const data = await selfIdRef.current.get(
        'basicProfile',
        didRef.current.id
      )
      if (!data) return
      setProfile(data)
      setShowGreeting(false)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <div>
      <h1>Decentralized Identity</h1>

      {Object.keys(profile).length ? (
        <div>
          <h2>{profile.name}</h2>
          <p>{profile.bio}</p>
        </div>
      ) : null}

      {!loaded && (
        <>
          <button onClick={connect}>Authenticate</button>
          <button onClick={readProfile}>Read Profile</button>
        </>
      )}
      {loaded && showGreeting && (
        <p>You have no profile yet. Please create one!</p>
      )}
      {loaded && (
        <>
          <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input placeholder="Bio" onChange={(e) => setBio(e.target.value)} />

          <button onClick={updateProfile}>Update Profile</button>
          <button onClick={readProfile}>Read Profile</button>
        </>
      )}
    </div>
  )
}

export default Identity
