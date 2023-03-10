
import { CacheStoreSpy, mockPurchases,getCacheExpirationDate } from "@/data/tests"
import { LocalLoadPurchases } from "./local-load-purchases"

type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (timestamp =  new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
    const sut = new LocalLoadPurchases(cacheStore, timestamp)
    return {
      sut,
      cacheStore
    }
}


describe('LocalLoadPurchases', () => {
  test('should not delete or insert cache on sut.init', async () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.actions).toEqual([])
  })

  
  test('should return empty list if load fails', async () => {
    const { cacheStore, sut } = makeSut()
    cacheStore.simulateFetchError()
    const purchases = await sut.loadAll()
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
    expect(purchases).toEqual([])
    })   
  
  test('should return a list of purchases if cache is valid', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() + 1)
      const { cacheStore, sut } = makeSut(currentDate)
      cacheStore.fetchResult = {
        timestamp,
        value: mockPurchases()
      }
      const purchases = await sut.loadAll()
      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
      expect(cacheStore.fetchKey).toBe('purchases')
      expect(purchases).toEqual(cacheStore.fetchResult.value)
    })

  test('should return an empty list if cache is expire', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() - 1)
      const { cacheStore, sut } = makeSut(currentDate)
      cacheStore.fetchResult = {
        timestamp,
        value: mockPurchases()
      }
      const purchases = await sut.loadAll()
      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
      expect(cacheStore.fetchKey).toBe('purchases')
      expect(purchases).toEqual([])
})

  test('should return an empty list if cache is  on expiration date', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
      const { cacheStore, sut } = makeSut(currentDate)
      cacheStore.fetchResult = {
        timestamp,
        value: mockPurchases()
      }
      const purchases = await sut.loadAll()
      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
      expect(cacheStore.fetchKey).toBe('purchases')
      expect(purchases).toEqual([])
})

  test('should return an empty list if cache is empty ', async () => {
    const currentDate = new Date()
    const timestamp = getCacheExpirationDate(currentDate)
    timestamp.setSeconds(timestamp.getSeconds() + 1)

      const { cacheStore, sut } = makeSut(currentDate)
      cacheStore.fetchResult = {
        timestamp,
        value: []
      }
      const purchases = await sut.loadAll()
      expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
      expect(cacheStore.fetchKey).toBe('purchases')
      expect(purchases).toEqual([])
    })
})
