import slug from 'slug'

export default function test() {
  const slugger = slug('Live-Action sci-fi & fantasy Movies')
  return (
    <div>
      <p>{slugger}</p>
    </div>
  )
}
