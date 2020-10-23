import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BackButton,
  Box,
  Button,
  ButtonBase,
  Field,
  GU,
  Info,
  Link,
  Modal,
  TextInput,
  textStyle,
  useLayout,
  useTheme,
} from '@1hive/1hive-ui'
import BrightIdStatus from './BrightIdStatus'
import SingleDatePicker from '../SingleDatePicker/SingleDatePicker'

import { fetchPic } from '../../services'
import { dateFormat } from '../../utils/date-utils'
import { validateEmail } from '../../utils/validate-utils'

import verifiedCheck from '../../assets/verifiedCheck.svg'

function ProfileForm({ coverPic, onBack, profile, profilePic }) {
  const { name: layout } = useLayout()
  const {
    birthday,
    description,
    email,
    location,
    name,
    updateProfile,
    verifiedAccounts,
    website,
  } = profile
  const [error, setError] = useState(null)
  const [updatingProfile, setUpdatingProfile] = useState(false)

  const [formData, setFormData] = useState({
    birthday,
    description,
    email: {
      removed: false,
      value: email,
      verified: Boolean(email),
    },
    location,
    name,
    github: {
      removed: false,
      value: verifiedAccounts?.github?.username,
      verified: Boolean(verifiedAccounts?.github),
    },
    twitter: {
      removed: false,
      value: verifiedAccounts?.twitter?.username,
      verified: Boolean(verifiedAccounts?.twitter),
    },
    website,
  })

  // Private data might not be ready yet
  useEffect(() => {
    if (birthday || email) {
      setFormData(formData => ({
        ...formData,
        birthday,
        email: { removed: false, value: email, verified: Boolean(email) },
      }))
    }
    return () => {}
  }, [birthday, email])

  const handleAccountChange = useCallback(event => {
    const { name, value } = event.target
    setFormData(formData => ({
      ...formData,
      [name]: { ...formData[name], value },
    }))
  }, [])

  const handleAccountRemove = useCallback(account => {
    setFormData(formData => ({
      ...formData,
      [account]: { ...formData[account], removed: true },
    }))
  }, [])

  const handleAccountCancelRemove = useCallback(account => {
    setFormData(formData => ({
      ...formData,
      [account]: { ...formData[account], removed: false },
    }))
  }, [])

  const handleDataChange = useCallback(event => {
    const { name, value: newValue } = event.target
    setFormData(formData => ({ ...formData, [name]: newValue }))
  }, [])

  const handleBirthdayChange = useCallback(date => {
    const dateFormatted = dateFormat(date, 'iso')
    setFormData(formData => ({ ...formData, birthday: dateFormatted }))
  }, [])

  const [updatedFields, removedFields] = useMemo(() => {
    const updatedFields = {
      public: [],
      private: [],
    }
    const removedFields = {
      public: [],
      private: [],
    }

    if (formData.birthday && formData.birthday !== birthday) {
      updatedFields.private.push(['birthday', formData.birthday])
    }

    if (formData.description && formData.description !== description) {
      updatedFields.public.push(['description', formData.description])
    }

    if (formData.email.removed) {
      removedFields.private.push('proof_email')
    } else if (formData.email.verified && !email) {
      updatedFields.public.push(['email', formData.email.value])
    }

    if (formData.location && formData.location !== location) {
      updatedFields.public.push(['location', formData.location])
    }

    if (formData.name && formData.name !== name) {
      updatedFields.public.push(['name', formData.name])
    }

    if (formData.github.removed) {
      removedFields.public.push('proof_github')
    } else if (formData.github.verified && !verifiedAccounts?.github) {
      updatedFields.public.push(['github', formData.github.value])
    }

    if (formData.twitter.removed) {
      removedFields.public.push('proof_twitter')
    } else if (formData.twitter.verified && !verifiedAccounts?.twitter) {
      updatedFields.public.push(['twitter', formData.twitter.value])
    }

    if (formData.website && formData.website !== website) {
      updatedFields.public.push(['website', formData.website])
    }

    return [updatedFields, removedFields]
  }, [
    birthday,
    description,
    email,
    formData,
    location,
    name,
    verifiedAccounts,
    website,
  ])

  const handleFormSubmit = useCallback(
    async event => {
      event.preventDefault()

      try {
        setUpdatingProfile(true)

        // Check if cover or profile pictures have been updated or removed
        for (const pic of [
          { key: 'coverPhoto', ...coverPic },
          { key: 'image', ...profilePic },
        ]) {
          if (pic.updated) {
            // Upload updated image to IPFS and update it on 3box
            const { data, error } = await fetchPic(pic.buffer)
            if (error) {
              throw error
            }

            if (data.Type !== 'error') {
              updatedFields.public.push([
                pic.key,
                [{ '@type': 'ImageObject', contentUrl: { '/': data.Hash } }],
              ])
            } else {
              console.error('Could not fetch profile pic: ', data)
            }
          } else if (pic.removed) {
            removedFields.public.push(pic.key)
          }
        }

        await updateProfile(updatedFields, removedFields)
        setUpdatingProfile(false)
      } catch (err) {
        console.error(err)
        setUpdatingProfile(false)
        return setError(`Could not update profile: ${err.message}`)
      }

      onBack()
    },
    [coverPic, onBack, profilePic, removedFields, updatedFields, updateProfile]
  )

  const saveDisabled =
    updatedFields.public.length === 0 &&
    updatedFields.private.length === 0 &&
    removedFields.public.length === 0 &&
    removedFields.private.length === 0 &&
    !profilePic.updated &&
    !profilePic.removed &&
    !coverPic.updated &&
    !coverPic.removed

  return (
    <>
      <Modal visible={updatingProfile}>Updating profile...</Modal>
      <Box>
        <BackButton
          onClick={onBack}
          css={`
            padding: ${1 * GU}px;
            border: 0;
            margin-bottom: ${3 * GU}px;
            border-radius: ${1 * GU}px 0 0 ${1 * GU}px;
          `}
        />
        <form onSubmit={handleFormSubmit}>
          <div
            css={`
              width: ${layout === 'small' ? '100%' : '50%'};
            `}
          >
            <Section title="Basic">
              <Field label="Name">
                <TextInput
                  name="name"
                  value={formData.name}
                  onChange={handleDataChange}
                  wide
                />
              </Field>
              <Field label="About me">
                <TextInput
                  name="description"
                  value={formData.description}
                  onChange={handleDataChange}
                  multiline
                  wide
                />
              </Field>
            </Section>
            <Section title="Contact">
              <VerifiedAccount
                label="Email"
                name="email"
                removed={formData.email.removed}
                validation={validateEmail}
                value={formData.email.value}
                verified={formData.email.verified}
                onChange={handleAccountChange}
                onRemove={handleAccountRemove}
                onCancelRemove={handleAccountCancelRemove}
              />
            </Section>
            <Section title="Linked identities">
              <VerifiedAccount
                label="github.com/"
                name="github"
                removed={formData.github.removed}
                value={formData.github.value}
                verified={formData.github.verified}
                onChange={handleAccountChange}
                onRemove={handleAccountRemove}
                onCancelRemove={handleAccountCancelRemove}
              />
              <VerifiedAccount
                label="twitter.com/"
                name="twitter"
                removed={formData.twitter.removed}
                value={formData.twitter.value}
                verified={formData.twitter.verified}
                onChange={handleAccountChange}
                onRemove={handleAccountRemove}
                onCancelRemove={handleAccountCancelRemove}
              />
              <Info
                css={`
                  margin-top: ${2 * GU}px;
                `}
              >
                In order to verify your linked identities please do so
                temporarily from the{' '}
                <Link href="https://3box.io/">3Box dapp</Link>.
              </Info>
            </Section>
            <Section title="Bright Id">
              <BrightIdStatus />
            </Section>
            <Section title="About">
              <Field label="Location">
                <TextInput
                  name="location"
                  value={formData.location}
                  onChange={handleDataChange}
                  wide
                />
              </Field>
              <Field label="Website or url">
                <TextInput
                  name="website"
                  value={formData.website}
                  onChange={handleDataChange}
                  wide
                />
              </Field>
              <Field label="Birthday">
                <SingleDatePicker
                  format="iso"
                  initialDate={formData.birthday}
                  onChange={handleBirthdayChange}
                />
              </Field>
            </Section>
          </div>

          <div
            css={`
              margin-top: ${3 * GU}px;
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <div>{error && <Info mode="error">{error}</Info>}</div>
            <div>
              <Button label="Cancel" onClick={onBack} />
              <Button
                label="Save changes"
                mode="strong"
                type="submit"
                disabled={saveDisabled}
                css={`
                  margin-left: ${1 * GU}px;
                `}
              />
            </div>
          </div>
        </form>
      </Box>
    </>
  )
}

function Section({ children, title }) {
  const theme = useTheme()

  return (
    <div
      css={`
        margin-bottom: ${4 * GU}px;
        padding-bottom: ${3 * GU}px;

        &:not(:last-child) {
          border-bottom: 0.5px solid ${theme.border};
        }

        & label > div {
          color: ${theme.contentSecondary};
        }
      `}
    >
      <h5
        css={`
          ${textStyle('label1')};
          margin-bottom: ${2 * GU}px;
        `}
      >
        {title}
      </h5>
      {children}
    </div>
  )
}

function VerifiedAccount({
  label,
  name,
  onChange,
  onRemove,
  onCancelRemove,
  removed,
  validation,
  value,
  verified,
}) {
  const theme = useTheme()

  const verificationDisabled = (validation && !validation(value)) || true // TODO: remove

  return (
    <Field label={label}>
      {() =>
        verified ? (
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            <div
              css={`
                height: ${3 * GU}px;
                display: flex;
                align-items: center;
                color: ${theme.content};
              `}
            >
              {!removed && (
                <>
                  <span>{value}</span>
                  <img
                    src={verifiedCheck}
                    css={`
                      margin-left: ${1 * GU}px;
                    `}
                  />
                </>
              )}
            </div>
            <ButtonBase
              onClick={() => (removed ? onCancelRemove : onRemove)(name)}
              css={`
                ${textStyle('label1')};
              `}
            >
              {removed ? 'Cancel' : 'Remove'}
            </ButtonBase>
          </div>
        ) : (
          <TextInput
            name={name}
            onChange={onChange}
            wide
            adornment={
              <ButtonBase
                disabled={verificationDisabled}
                onClick={() => window.alert('verify!')}
                css={`
                  ${textStyle('label1')};
                  color: ${theme[
                    verificationDisabled ? 'contentSecondary' : 'positive'
                  ]};
                  opacity: ${verificationDisabled ? 0.5 : 1};
                `}
              >
                Verify
              </ButtonBase>
            }
            adornmentPosition="end"
            adornmentSettings={{ padding: 2 * GU }}
            disabled // TODO: remove
          />
        )
      }
    </Field>
  )
}

export default ProfileForm
