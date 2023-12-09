import HeaderMenu from '@/comp/HeaderMenu'
import Share from '@/comp/Share'

async function getData() { }

export default async function Home() {
  const data = await getData()
  return <>
    {/* <HeaderMenu /> */}
    <div>
      1111
      <Share />
    </div>
  </>
}
