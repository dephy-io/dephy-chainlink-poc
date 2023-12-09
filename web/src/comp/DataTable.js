'use client'

import { Text, Avatar, Badge, Table, Group, ActionIcon, Anchor, rem } from '@mantine/core';
import Share from './Share';

export function DataTable({ data }) {

  const rows = data.map((item, idx) => (
    <Table.Tr key={item.from}>
      <Table.Td className="t-share">
        <Share item={item} rank={idx + 1} />
      </Table.Td>
      <Table.Td>{idx + 1}</Table.Td>
      <Table.Td>
        <Badge variant="light">
          <pre>{item.from}</pre>
        </Badge>
      </Table.Td>

      <Table.Td className="t-val">
        <pre>{item.avgPf.toFixed(6)}</pre>
      </Table.Td>

      <Table.Td className="t-val">
        <pre>{item.avgPower.toFixed(2)}W</pre>
      </Table.Td>


    </Table.Tr>
  ));

  return (
    <Table.ScrollContainer minWidth={240}>
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>Rank#</Table.Th>
            <Table.Th>Device DID</Table.Th>
            <Table.Th>Avg. Power Factor</Table.Th>
            <Table.Th>Avg. Power</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
