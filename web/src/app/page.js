import HeaderMenu from '@/comp/HeaderMenu'
import { sql } from "@vercel/postgres";
import "server-only";
import { Text, Title, TextInput, Button, Image, Container } from '@mantine/core';
import classes from './global.module.css';
import { DataTable } from '../comp/DataTable';
import { cache } from 'react'

export const revalidate = 600;

export const getData = cache(async (r) => {
  const { rows } = await sql`SELECT * FROM "LastEvent" ORDER BY "eventCreatedAt" DESC;`
  return rows.map(i => {
    return {
      r,
      ...i,
      address: i.from.replace('did:dephy:', ''),
      avgPower: i.value.data.reduce((prev, curr) => prev + curr.power, 0) / 5,
      avgPf: i.value.data.reduce((prev, curr) => prev + curr.pf, 0) / 5,
    }
  }).sort((a, b) => a.avgPf > b.avgPf ? -1 : 1)
})

export default async function Home({ searchParams: { r } }) {
  const data = await getData(r)
  const t = new Date();

  return <>
    <HeaderMenu />
    <Container size="md">
      <Banner />
    </Container>
    <Container size="md">
      <DataTable data={data} />
    </Container>
    <Container>
      <Text fz="sm" c="dimmed" style={{ textAlign: 'center', marginTop: '12px' }}>
        Updated on {t.toLocaleString('en-US', { timeZone: 'utc', hour12: false })} UTC
      </Text>
    </Container>
  </>
}

const Banner = () => {
  return <div className={classes.wrapper}>
    <div className={classes.body}>
      <Title className={classes.title}>What is Power factor (PF)?</Title>
      <Text mb={5}>
        PF expresses the ratio of true power used in a circuit to the apparent power delivered to the circuit.
      </Text>
      <Text mb={5}>
        Higher PF means more efficiency, less energy will be wasted to damage our environment.
      </Text>
      <Text fw={500} fz="lg" mb={5}>
        {"Check the PF of your outlet device on DePHY's decentralized network and share it on Lens!"}
      </Text>
      <div style={{ marginTop: 12 }}>
        <a href="https://dephy.io"><Button>Learn more about DePHY</Button></a>
      </div>

    </div>
    <Image src="/dephy.svg" className={classes.image} alt='DePHY.io logo' />
  </div>
}


