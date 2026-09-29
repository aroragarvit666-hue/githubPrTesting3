import React, { useState } from 'react'
import {
  Provider,
  defaultTheme,
  View,
  Flex,
  Heading,
  Content,
  TextField,
  Button,
  ProgressCircle,
  InlineAlert,
  Well
} from '@adobe/react-spectrum'
import actions from '../config.json'

export default function App({ runtime, ims }) {
  // Do NOT call runtime.done() here — index.js calls it in the ready handler
  const helloUrl = actions['hello']

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function sayHello() {
    setError('')
    setMessage('')

    if (!helloUrl) {
      // config.json is empty until the app is deployed or the sandbox is running
      setError('Action URL not available yet. Deploy the app (or start the sandbox) to call the action.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(helloUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ims.token}`,
          'x-gw-ims-org-id': ims.org
        },
        body: JSON.stringify({ name: name || undefined })
      })
      if (!res.ok) throw new Error(`Action failed: ${res.status}`)
      const data = await res.json()
      setMessage(data.message)
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Provider theme={defaultTheme} colorScheme="light" UNSAFE_style={{ backgroundColor: 'transparent' }}>
      <View padding="size-400" maxWidth="size-6000" margin="0 auto">
        <Flex direction="column" gap="size-300">
          <Heading level={1}>Hello World</Heading>
          <Content>
            Enter a name and call the <code>hello</code> action running on Adobe I/O Runtime.
          </Content>

          <TextField
            label="Name"
            value={name}
            onChange={setName}
            onKeyDown={(e) => e.key === 'Enter' && sayHello()}
            width="100%"
          />

          <Flex>
            <Button variant="accent" onPress={sayHello} isPending={isLoading}>
              Say hello
            </Button>
          </Flex>

          {isLoading && (
            <Flex alignItems="center" justifyContent="center" height="size-1000">
              <ProgressCircle aria-label="Calling action" isIndeterminate size="M" />
            </Flex>
          )}

          {message && (
            <Well>
              <Heading level={3} marginTop="0">{message}</Heading>
            </Well>
          )}

          {error && (
            <InlineAlert variant="negative">
              <Heading>Error</Heading>
              <Content>{error}</Content>
            </InlineAlert>
          )}
        </Flex>
      </View>
    </Provider>
  )
}
