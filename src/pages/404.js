import React, { useEffect } from "react"
import { graphql, Link } from "gatsby"
import SEO from "../components/seo"

export const useFetch = url => {
  const [state, setState] = React.useState({ loading: true, data: null })

  useEffect(() => {
    setState(currState => ({ loading: true, data: currState.data }))
    fetch(url)
      .then(y => y.json())
      .then(x => setState({ loading: false, data: x }))
  }, [])

  return state
}

const NotFoundPage = ({ data, location }) => {
  const randomDigit = Math.floor(Math.random() * 104 + 5)

  const { data: gif, loading } = useFetch(
    `https://api.giphy.com/v1/gifs/search?api_key=dppowCiYXsJgxcuSgfRf4CGWqx2onwuo&q=fail&limit=1&offset=${randomDigit}&rating=PG&lang=en`
  )

  if (loading) return null

  console.log("gif", gif.data[0].images)
  return (
    <>
      <SEO title="404: Not Found" />
      {!loading && !!gif && (
        <div
          style={{
            backgroundImage: `url(${gif.data[0].images.downsized.url})`,
            height: "100vh",
            backgroundSize: "cover",
          }}
        >
          <div
            style={{
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <h1
              style={{
                fontSize: "90px",
                color: "#fff",
                textShadow:
                  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
                margin: 0,
              }}
            >
              404
            </h1>
            <Link to="/">
              <button>Go back</button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
