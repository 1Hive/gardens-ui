import React, { useState } from 'react'
import AceEditor from 'react-ace'
import { Box, Button, textStyle } from '@1hive/1hive-ui'

import { evmcl, EVMcrispr } from '@1hive/evmcrispr'
import { useWallet } from '@/providers/Wallet'
import { getNetwork } from '@/networks'
import AccountModule from '@/components/Account/AccountModule'
import { useGardens } from '@/providers/Gardens'

function client(chainId) {
  return {
    4: 'gardens-rinkeby.1hive.org',
    100: 'gardens-xdai.1hive.org',
  }[chainId]
}

function Terminal() {
  const { account, ethers } = useWallet()
  const { connectedGarden } = useGardens()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState(
    `connect ${connectedGarden?.address} disputable-voting.open`
  )

  const addressShortened = account
    ? `${account.substr(0, 4)}..${account.substr(-4)}`
    : ''

  async function onForward() {
    setError('')
    setLoading(true)
    try {
      const [, dao, _path] =
        code.split('\n')[0].match(/^connect ([\w.-]+)(( [\w.\-:]+)*)$/) ?? []
      if (!dao || !_path) {
        console.log(dao, _path)
        throw new Error('First line must be `connect <dao> <...path>`')
      }
      if (!/0x[0-9A-Fa-f]+/.test(dao)) {
        throw new Error(
          'ENS not supported yet, please introduce the address of the DAO.'
        )
      }
      const path = _path
        .trim()
        .split(' ')
        .map(id => id.trim())
      const _code = code
        .split('\n')
        .slice(1)
        .join('\n')
      const evmcrispr = await EVMcrispr.create(dao, ethers.getSigner(), {
        ipfsGateway: 'https://ipfs.blossom.software/ipfs/',
      })
      await evmcrispr.forward(evmcl`${_code}`, path, {})
      const chainId = getNetwork().chainId
      const lastApp = evmcrispr.app(path.slice(-1)[0])
      // TODO: add vote number
      window.location.href = `https://${client(
        chainId
      )}/#/${dao}/vote/${lastApp}`
    } catch (e) {
      console.error(e)
      if (
        e.message.startsWith('transaction failed') &&
        /^0x[0-9a-f]{64}$/.test(e.message.split('"')[1])
      ) {
        setError(
          `Transaction failed, watch in block explorer ${
            e.message.split('"')[1]
          }`
        )
      } else {
        setError(e.message)
      }
    }
    setLoading(false)
  }

  return (
    <div>
      <div
        css={`
          ${textStyle('title3')};
        `}
      >
        Available commands:
      </div>
      <div
        css={`
          ${textStyle('body3')};
        `}
      >{`connect <dao> <...path>
install <repo> [...initParams]
grant <entity> <app> <role> [permissionManager]
revoke <entity> <app> <role>
exec <app> <methodName> [...params]
act <agent> <targetAddr> <methodSignature> [...params]`}</div>
      <div
        css={`
          ${textStyle('title3')};
        `}
      >
        Example (unwrap wxDAI):
      </div>
      <div
        css={`
          ${textStyle('body3')};
        `}
      >{`connect 1hive token-manager voting
install agent:new-agent
grant voting agent:new-agent TRANSFER_ROLE voting
exec vault transfer -token:tokens.honeyswap.org:WXDAI agent:new-agent 100e18
act agent:new-agent -token:tokens.honeyswap.org:WXDAI withdraw(uint256) 100e18
exec agent:new-agent transfer -token:XDAI vault 100e18`}</div>
      <React.Fragment>
        <Box heading="EVMcrispr">
          <AceEditor
            width="100%"
            mode="javascript"
            theme="github"
            name="code"
            value={code}
            onLoad={() => console.log('load')}
            onChange={setCode}
            fontSize={14}
            showPrintMargin
            showGutter
            highlightActiveLine
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
          />
        </Box>
        <div style={{ textAlign: 'right' }}>
          {!account ? (
            <AccountModule />
          ) : (
            <Button
              label={`${
                loading ? 'Forwarding' : 'Forward'
              } from ${addressShortened}`}
              onClick={onForward}
            />
          )}
        </div>
        <div style={{ color: 'red' }}>{error ? 'Error: ' + error : null}</div>
        {/* <div className="App" style={{ maxWidth: 1200, margin: 'auto' }}> */}
      </React.Fragment>
    </div>
  )
}

export default Terminal
