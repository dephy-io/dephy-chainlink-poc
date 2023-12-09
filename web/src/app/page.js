import HeaderMenu from '@/comp/HeaderMenu'
import Share from '@/comp/Share'

async function getData() { }

export default async function Home() {
  const data = await getData()
  return <>
    {/* <HeaderMenu /> */}
    <div>
      11111
      <Share />
    </div>
  </>
}
