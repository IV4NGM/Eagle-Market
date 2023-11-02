let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdmNTQ1MzkwLWZkOGYtNDQxMi1iN2IzLTRlMjY3NTg2NzUxZiIsInJvbGUiOiJBRE1JTiIsImVtYWlsIjoic3VwZXJtYW5AZGMuY29tIiwiZ2VuZGVyIjoiTSIsImZpcnN0X25hbWUiOiJDbGFyayIsImxhc3RfbmFtZSI6IktlbnQiLCJpYXQiOjE2OTg4OTAyNjF9.Didh7TWRrnUdsLE6_MqiHml0BrMfxE55hL2o0Ulf6QM'
let id = '7f545390-fd8f-4412-b7b3-4e267586751f'

const login = () => {
  const intent = fetch('https://eagle-market.onrender.com/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
  },
    body: JSON.stringify({
      "email": "superman@dc.com",
      "password": "superman"
    })
  })

  intent.then((value) => {
    return value.json()
  })
  .then((value) => {
    console.log(value)
    token = value.token
    console.log(token)
  })
  .catch(e => console.log(e))
}

const getUsers = () => {
  const results = fetch('https://eagle-market.onrender.com/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  results.then((value) =>{
    return value.json()
  })
  .then((value) =>{
    console.log(value)
  })
  .catch(e => console.log(e))
}

const getMe = () => {
  const results = fetch(`https://eagle-market.onrender.com/users/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  results.then((value) =>{
    return value.json()
  })
  .then((value) =>{
    console.log(value)
  })
  .catch(e => console.log(e))
}

const getUser = (token) => {
  return JSON.parse(atob(token.split(".")[1]))
}

// login()
// getUsers()
// getMe()
// console.log(getUser(token))