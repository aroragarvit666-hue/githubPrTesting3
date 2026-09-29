jest.mock('@adobe/aio-sdk', () => ({
  Core: { Logger: jest.fn(() => ({ info: jest.fn(), debug: jest.fn(), error: jest.fn() })) }
}))
const { main } = require('../actions/hello/index.js')

describe('hello action', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns 200 with default greeting when no name given', async () => {
    const res = await main({})
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Hello, World!')
    expect(res.body.timestamp).toBeDefined()
  })

  it('returns 200 with a personalized greeting', async () => {
    const res = await main({ name: 'Ada' })
    expect(res.statusCode).toBe(200)
    expect(res.body.message).toBe('Hello, Ada!')
  })

  it('returns 500 when an unexpected error occurs', async () => {
    // Force JSON.stringify to throw via a circular reference in params
    const circular = {}
    circular.self = circular
    const res = await main(circular)
    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBeDefined()
  })
})
