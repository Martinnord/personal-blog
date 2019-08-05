import React from "react"
import addToMailchimp from "gatsby-plugin-mailchimp"

export const SignUpForm = () => {
  const [values, setValues] = React.useState({ firstName: "", email: "" })
  const [res, setRes] = React.useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    const result = await addToMailchimp(values.email, {
      firstName: values.firstName,
    })
    setRes(result.msg)
  }

  return (
    <div
      style={{
        margin: "90px 0 48px 0",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ backgroundColor: "rgb(249, 250, 251)" }}
      >
        <div style={{ padding: "40px" }}>
          <h1
            style={{
              fontSize: "20px",
              textAlign: "center",
            }}
          >
            Join the Newsletter 📧 
          </h1>
          <p
            style={{
              textAlign: "center",
              margin: 0,
            }}
          >
             Hey, you should subscribe to my newsletter to get my latest content
            by email.
          </p>
          <br />

          {res && (
            <p
              style={{
                textAlign: "center",
                margin: 0,
              }}
            >
              {res}
            </p>
          )}
        </div>
        <div
          style={{ padding: "40px", display: "flex", flexDirection: "column" }}
        >
          <div style={{ marginBottom: "15px" }}>
            <input
              style={{
                width: "100%",
                fontSize: "15px",
                padding: "12px",
                border: "1px solid #e3e3e3",
                lineHeight: "1.4",
              }}
              name="firstName"
              placeholder="Your first name"
              value={values.firstName}
              onChange={e => {
                e.persist()
                setValues(curr => ({ ...curr, firstName: e.target.value }))
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <input
              style={{
                width: "100%",
                fontSize: "15px",
                padding: "12px",
                border: "1px solid #e3e3e3",
                lineHeight: "1.4",
              }}
              name="email"
              placeholder="Your email"
              value={values.email}
              onChange={e => {
                e.persist()
                setValues(curr => ({ ...curr, email: e.target.value }))
              }}
            />
          </div>
          <button
            style={{
              backgroundColor: "#FDF6E3",
              border: "none",
              minHeight: "40px",
              cursor: "pointer",
            }}
            type="submit"
          >
            <span style={{ padding: "12px 24px", color: "#657b83" }}>
              Subscribe
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
