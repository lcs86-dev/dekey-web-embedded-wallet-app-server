try {
  throw new Error('aaa')
} catch (error) {
  console.log(error.message)
  console.log(error.toString())
}