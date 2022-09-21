import { Flex, Table, TableContainer, Tbody, Td, Tfoot, Th, Thead, Tr, Button, SkeletonText } from "@chakra-ui/react"
import { useInfiniteQuery } from "react-query"
import axios from "axios"
import React from "react"

type Block = {
  blockNumber: number
  feeRecipient: string
}

type Page = {
  blocks: Block[]
  latestBlockNumber: number
}

type BlocksResponseData = {
  latest_block_number: number
  blocks: {
    block_number: number
    fee_recipient: string
    fee_recipient_eth_diff: string
  }[]
}

export const LatestBlocks = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<Page, Error>(
    "blocks",
    async ({ pageParam }) => {
      const beforeQuery = pageParam ? `before=${pageParam}` : ""
      const { data } = await axios.get<BlocksResponseData>(
        `https://blocks.flashbots.net/v1/blocks?limit=20&${beforeQuery}`
      )

      return {
        latestBlockNumber: data.latest_block_number,
        blocks: data.blocks.map((b) => ({
          blockNumber: b.block_number,
          feeRecipient: b.fee_recipient,
        })),
      }
    },
    {
      getNextPageParam: (page, pages) => page.latestBlockNumber,
      refetchOnWindowFocus: false,
    }
  )

  return (
    <Flex grow={1}>
      <TableContainer flexGrow={1}>
        <Table>
          <Thead>
            <Tr>
              <Th width="20ch">Block number</Th>
              <Th>Fee recipient</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.blocks.map((b) => (
                  <Tr key={b.blockNumber}>
                    <Td>{b.blockNumber}</Td>
                    <Td>{b.feeRecipient}</Td>
                  </Tr>
                ))}
              </React.Fragment>
            ))}
            {(isLoading || isFetchingNextPage) &&
              Array(20)
                .fill(null)
                .map((v, i) => (
                  <Tr key={i}>
                    <Td>
                      <SkeletonText noOfLines={1} spacing="4" />
                    </Td>
                    <Td>
                      <SkeletonText noOfLines={1} spacing="4" />
                    </Td>
                  </Tr>
                ))}
          </Tbody>
          {hasNextPage && (
            <Tfoot>
              <Tr>
                <Td></Td>
                <Td textAlign="end">
                  <Button onClick={() => fetchNextPage()}>Load more</Button>
                </Td>
              </Tr>
            </Tfoot>
          )}
        </Table>
      </TableContainer>
    </Flex>
  )
}
