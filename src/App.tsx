import { Flex, Heading } from "@chakra-ui/react"

import { LatestBlocks } from "./components/LatestBlocks"

function App() {
  return (
    <Flex justifyContent="center" paddingTop={10}>
      <Flex direction="column" grow={1} gap={5} maxWidth={1240}>
        <Heading>Flashbots blocks</Heading>
        <Flex boxShadow="base" rounded="md" borderWidth={1} grow={1} alignSelf="stretch">
          <LatestBlocks />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default App
