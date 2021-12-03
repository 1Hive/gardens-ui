import React, { useMemo } from 'react'
import styled from 'styled-components'
import {
  Accordion,
  GU,
  IdentityBadge,
  Info,
  textStyle,
  useTheme,
} from '@1hive/1hive-ui'
import { Header } from '../kit'

import Navigation from '../Navigation'
import { useOnboardingState } from '@providers/Onboarding'
import { useWallet } from '@providers/Wallet'
import { addressesEqual } from '@utils/web3-utils'
import { getNetwork } from '@/networks'
import {
  DAY_IN_SECONDS,
  HOUR_IN_SECONDS,
  MINUTE_IN_SECONDS,
} from '@utils/kit-utils'
import { ZERO_ADDR } from '@/constants'
import { BYOT_TYPE, NATIVE_TYPE } from '../constants'

function ReviewInformation() {
  const { onBack, onStartDeployment } = useOnboardingState()

  return (
    <div>
      <Header title="Review information" />
      <div
        css={`
          margin-bottom: ${4 * GU}px;
        `}
      >
        <Accordion
          items={[
            ['Type', <ReviewGardenType />],
            ['Profile', <ReviewGardenProfile />],
            ['Tokenomics', <ReviewGardenTokenomics />],
            ['Governance', <ReviewGardenGovernance />],
          ]}
        />
        <Info
          css={`
            margin-top: ${2 * GU}px;
          `}
        >
          Carefully review your configuration settings. If something doesn’t
          look right, you can always go back and change it before launching your
          garden.
        </Info>
      </div>

      <Navigation
        backEnabled
        nextEnabled
        nextLabel="Launch your garden"
        onBack={onBack}
        onNext={onStartDeployment}
      />
    </div>
  )
}

/// /////// TYPE //////////
function ReviewGardenType() {
  const { config } = useOnboardingState()
  return (
    <div
      css={`
        padding: ${5 * GU}px ${7 * GU}px;
        width: 100%;
      `}
    >
      <Field
        label="Garden type"
        value={
          config.garden.type === NATIVE_TYPE
            ? 'Native Token'
            : 'Pre-existing Token'
        }
      />
    </div>
  )
}

/// /////// PROFILE //////////
function ReviewGardenProfile() {
  const theme = useTheme()
  const { config } = useOnboardingState()
  return (
    <div
      css={`
        padding: ${5 * GU}px ${7 * GU}px 0px ${7 * GU}px;
        width: 100%;
      `}
    >
      <div>
        <Field label="Garden name" value={config.garden.name} />
        <Field label="Garden description" value={config.garden.description} />
        <Field label="Forum" value={config.garden.forum} />
      </div>
      <LineBreak />
      <div>
        <div
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          ASSETS
        </div>
        <div
          css={`
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: ${9 * GU}px;
          `}
        >
          <Field
            label="Header logo"
            value={config.garden.logo_type?.blob.name || 'No image'}
          />
          <Field
            label="Garden logo"
            value={config.garden.logo?.blob.name || 'No image'}
          />

          <Field
            label="Token icon"
            value={config.garden.token_logo?.blob.name || 'No image'}
          />
        </div>
        <p
          css={`
            ${textStyle('body4')};
            color: ${theme.contentSecondary};
            margin-bottom: ${3 * GU}px;
          `}
        >
          If you don´t upload images, default ones will be displayed.
        </p>
      </div>

      <LineBreak />
      <div>
        <div
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          COMMUNITY LINKS
        </div>
        <div>
          {Object.values(config.garden.links.community[0]).length > 0 ? (
            config.garden.links.community.map(({ link, label }) => (
              <Field label={label} value={link} />
            ))
          ) : (
            <div
              css={`
                margin-bottom: ${3 * GU}px;
              `}
            >
              No links
            </div>
          )}
        </div>
      </div>

      <LineBreak />
      <div>
        <div
          css={`
            margin-bottom: ${2 * GU}px;
          `}
        >
          DOCUMENTATION LINKS
        </div>
        <div>
          {Object.values(config.garden.links.documentation[0]).length > 0 ? (
            config.garden.links.documentation.map(({ link, label }) => (
              <Field label={label} value={link} />
            ))
          ) : (
            <div
              css={`
                margin-bottom: ${3 * GU}px;
              `}
            >
              No links
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
/// /////// TOKENOMICS //////////
function ReviewGardenTokenomics() {
  const { config } = useOnboardingState()
  return (
    <div
      css={`
        padding: ${5 * GU}px ${7 * GU}px;
        width: 100%;
      `}
    >
      <ReviewTokens />
      <LineBreak />
      <ReviewHoneyswapLiquidity />
      {config.garden.type === NATIVE_TYPE && (
        <>
          <LineBreak />
          <ReviewIssuance />
        </>
      )}
    </div>
  )
}

const ReviewTokens = () => {
  const { config } = useOnboardingState()
  // commonPool = ((totalSeedsAmount + gardenTokenLiquidity) * initialRatio) / (1 - initialRatio)
  const totalSeedsAmount = config.tokens.holders.reduce(
    (acc, [_, stake]) => acc + stake,
    0
  )
  const initialRatio = config.issuance.initialRatio / 100

  const commonPool =
    parseFloat(
      (totalSeedsAmount + parseInt(config.liquidity.tokenLiquidity)) *
        initialRatio
    ) / (1 - initialRatio).toFixed(2)

  return (
    <div>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        TOKEN SETTINGS
      </div>
      {config.garden.type === BYOT_TYPE && (
        <Field
          label="Token address"
          value={
            <div>
              <AddressBadge address={config.tokens.address} shorten={false} />
              <span
                css={`
                  margin-right: ${0.5 * GU}px;
                `}
              >
                ({config.tokens.existingTokenSymbol})
              </span>
            </div>
          }
        />
      )}
      <TwoCols>
        <Field label="Token name" value={config.tokens.name} />
        <Field label="Token symbol" value={config.tokens.symbol} />
        {config.garden.type === NATIVE_TYPE && (
          <>
            <Field
              label="Seed holders"
              value={
                <div>
                  {config.tokens.holders.map(([holder, stake]) => (
                    <div
                      css={`
                        margin-bottom: ${0.5 * GU}px;
                      `}
                    >
                      <AddressBadge address={holder} />{' '}
                      <span>
                        {stake} {config.tokens.symbol}
                      </span>
                    </div>
                  ))}
                </div>
              }
            />
            <Field
              label="Common pool"
              value={`${commonPool} ${config.tokens.symbol}`}
            />
          </>
        )}
      </TwoCols>
      {config.tokens.gnosisSafe && (
        <Field
          label="Gnosis safe"
          value={
            <AddressBadge address={config.tokens.gnosisSafe} shorten={false} />
          }
        />
      )}
    </div>
  )
}

const ReviewHoneyswapLiquidity = () => {
  const { config } = useOnboardingState()
  const { garden, liquidity, tokens } = config
  const tokenSymbol =
    tokens[garden.type === NATIVE_TYPE ? 'symbol' : 'existingTokenSymbol']

  const tokenPriceInUSD =
    liquidity.honeyTokenLiquidityStable / liquidity.tokenLiquidity
  const tokenPriceInHNY =
    liquidity.honeyTokenLiquidity / liquidity.tokenLiquidity

  return (
    <div>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        HONEYSWAP LIQUIDITY
      </div>
      <div>
        <Field
          label="Initial price"
          value={
            <span>
              1 {tokenSymbol} ({parseFloat(tokenPriceInUSD).toFixed(2)} USD) ={' '}
              {parseFloat(tokenPriceInHNY).toFixed(4)} HNY
            </span>
          }
        />
        <Field
          label="Liquidity provided"
          value={
            <span>
              {liquidity.tokenLiquidity} {tokenSymbol} (
              {liquidity.honeyTokenLiquidityStable} USD) +{' '}
              {liquidity.honeyTokenLiquidity} HNY (
              {liquidity.honeyTokenLiquidityStable} USD)
            </span>
          }
        />
      </div>
    </div>
  )
}

const ReviewIssuance = () => {
  const { config } = useOnboardingState()
  return (
    <div>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        ISSUANCE
      </div>
      <div>
        <Field
          label="Target ratio"
          value={`${config.issuance.targetRatio} %`}
        />
        <Field
          label="Throttle"
          value={`${config.issuance.maxAdjustmentRatioPerYear} %`}
        />
      </div>
    </div>
  )
}

/// /////// GOVERNANCE //////////
function ReviewGardenGovernance() {
  return (
    <div
      css={`
        padding: ${5 * GU}px ${7 * GU}px;
        width: 100%;
      `}
    >
      <ReviewAgreement />
      <LineBreak />
      <ReviewConvictionVoting />
      <LineBreak />
      <ReviewVoting />
    </div>
  )
}

const ReviewAgreement = () => {
  const { config } = useOnboardingState()
  const { agreement, tokens } = config

  return (
    <div>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        COMMUNITY COVENANT
      </div>
      <TwoCols>
        <Field label="Title" value={agreement.title} />
        <Field label="File" value={agreement.covenantFile.blob.name} />
        <Field
          label="Action amount"
          value={`${agreement.actionAmount} ${tokens.symbol}`}
        />
        <Field
          label="Challenge amount"
          value={`${agreement.challengeAmount} ${tokens.symbol}`}
        />
        <Field
          label="Challenge period"
          value={<Duration duration={agreement.challengePeriod} />}
        />
      </TwoCols>
    </div>
  )
}
const ReviewConvictionVoting = () => {
  const { config } = useOnboardingState()
  const { conviction } = config

  return (
    <div>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        CONVICTION VOTING
      </div>
      <div>
        <TwoCols>
          <Field
            label="Conviction growth"
            value={`${conviction.halflifeDays} days`}
          />
          <Field label="Spending limit" value={`${conviction.maxRatio} %`} />
        </TwoCols>
        <Field
          label="Minimum conviction"
          value={`${conviction.minThreshold} %`}
        />
        <Field
          label="Minimum active stake"
          value={`${conviction.minThresholdStakePct} %`}
        />
        {conviction.requestToken &&
          !addressesEqual(conviction.requestToken, ZERO_ADDR) && (
            <Field
              label="Request token"
              value={
                <AddressBadge
                  address={conviction.requestToken}
                  shorten={false}
                />
              }
            />
          )}
      </div>
    </div>
  )
}
const ReviewVoting = () => {
  const { config } = useOnboardingState()
  const { voting } = config

  return (
    <div>
      <div
        css={`
          margin-bottom: ${2 * GU}px;
        `}
      >
        COMMUNITY VOTING
      </div>
      <div>
        <TwoCols>
          <Field label="Support" value={`${voting.voteSupportRequired} %`} />
          <Field
            label="Minimum approval"
            value={`${voting.voteMinAcceptanceQuorum} %`}
            css={`
              margin-left: ${10 * GU}px;
            `}
          />
        </TwoCols>
        <TwoCols>
          <Field
            label="Voting duration"
            value={<Duration duration={voting.voteDuration} />}
          />
          <Field
            label="Execution delay period"
            value={<Duration duration={voting.voteExecutionDelay} />}
          />
        </TwoCols>

        <Field
          label="Quiet ending period"
          value={<Duration duration={voting.voteQuietEndingPeriod} />}
        />
        <Field
          label="Quiet ending extension period"
          value={<Duration duration={voting.voteQuietEndingExtension} />}
        />
        <Field
          label="Delegated voting period"
          value={<Duration duration={voting.voteDelegatedVotingPeriod} />}
        />
      </div>
    </div>
  )
}

const Field = ({ label, value }) => {
  const theme = useTheme()
  return (
    <div
      css={`
        margin-bottom: ${3 * GU}px;
      `}
    >
      <h2
        css={`
          ${textStyle('label1')};
          font-weight: 200;
          color: ${theme.contentSecondary};
          margin-bottom: ${1 * GU}px;
        `}
      >
        {label}
      </h2>
      <div
        css={`
          ${textStyle('body1')};
        `}
      >
        {value}
      </div>
    </div>
  )
}

const LineBreak = () => {
  const theme = useTheme()

  return (
    <div
      css={`
        height: 1px;
        border-top: 0.5px solid ${theme.surfaceOpened};
        margin-bottom: ${3 * GU}px;
      `}
    />
  )
}

const AddressBadge = ({ address, shorten = true }) => {
  const { chainId } = useWallet()
  const { explorer, type } = getNetwork(chainId)
  return (
    <IdentityBadge
      entity={address}
      shorten={shorten}
      explorerProvider={explorer}
      networkType={type}
    />
  )
}

const Duration = ({ duration }) => {
  const [days, hours, minutes] = useDurationUnits(duration)

  return (
    <div>
      {days > 0 && (
        <span>
          {days} day{days > 1 ? 's' : ''}
        </span>
      )}
      {hours > 0 && (
        <span
          css={`
            margin-left: ${0.5 * GU}px;
          `}
        >
          {hours} hour{hours > 1 ? 's' : ''}
        </span>
      )}
      {minutes > 0 && (
        <span
          css={`
            margin-left: ${0.5 * GU}px;
          `}
        >
          {minutes} minute{minutes > 1 ? 's' : ''}
        </span>
      )}
    </div>
  )
}

const useDurationUnits = duration => {
  return useMemo(() => {
    let remaining = duration

    const days = Math.floor(remaining / DAY_IN_SECONDS)
    remaining -= days * DAY_IN_SECONDS

    const hours = Math.floor(remaining / HOUR_IN_SECONDS)
    remaining -= hours * HOUR_IN_SECONDS

    const minutes = Math.floor(remaining / MINUTE_IN_SECONDS)
    remaining -= minutes * MINUTE_IN_SECONDS

    return [days, hours, minutes]
  }, [duration])
}

const TwoCols = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
`

export default ReviewInformation
